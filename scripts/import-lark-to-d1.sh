#!/usr/bin/env bash
# ============================================================
# import-lark-to-d1.sh — One-shot import from Lark Doc -> D1
#
# Usage:
#   bash scripts/import-lark-to-d1.sh \
#     --doc "https://...larksuite.com/docx/TOKEN" \
#     --tier 1 --chapter-no 3 \
#     --chapter-id "03-roadmap-to-be-sky" \
#     --title "ROADMAP TO BE SKY" \
#     [--description "..."] \
#     [--execute]        # run SQL on remote D1
#     [--execute-local]  # run SQL on local D1
# ============================================================
set -euo pipefail

# ---- Parse args ----
DOC_URL="" TIER="" CHAPTER_NO="" CHAPTER_ID="" TITLE="" DESCRIPTION="" EXEC_FLAG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --doc)           DOC_URL="$2";     shift 2 ;;
    --tier)          TIER="$2";        shift 2 ;;
    --chapter-no)    CHAPTER_NO="$2";  shift 2 ;;
    --chapter-id)    CHAPTER_ID="$2";  shift 2 ;;
    --title)         TITLE="$2";       shift 2 ;;
    --description)   DESCRIPTION="$2"; shift 2 ;;
    --execute)       EXEC_FLAG="--remote"; shift ;;
    --execute-local) EXEC_FLAG="--local";  shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

[[ -z "$DOC_URL" || -z "$TIER" || -z "$CHAPTER_NO" || -z "$CHAPTER_ID" || -z "$TITLE" ]] && {
  echo "Usage: bash scripts/import-lark-to-d1.sh --doc URL --tier N --chapter-no N --chapter-id SLUG --title TITLE"
  exit 1
}

# Auto-resolve account ID
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  export CLOUDFLARE_ACCOUNT_ID=$(grep -o '"account_id": *"[^"]*"' wrangler.jsonc | head -1 | sed 's/.*"\([^"]*\)"/\1/')
  echo "CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID"
fi

# Extract token from URL
DOC_TOKEN=$(echo "$DOC_URL" | sed -n 's|.*/docx/\([^?]*\).*|\1|p')
[[ -z "$DOC_TOKEN" ]] && DOC_TOKEN="$DOC_URL"

SQL_FILE="migrations/import-${CHAPTER_ID}.sql"
TMPDIR="tmp/import-${CHAPTER_ID}"
mkdir -p "$TMPDIR/images"

# ============================================================
# STEP 1: Fetch Lark Doc
# ============================================================
echo "=========================================="
echo "STEP 1/6: Fetching Lark document"
echo "=========================================="
lark-cli docs +fetch --api-version v2 --doc "$DOC_TOKEN" --detail with-ids > "$TMPDIR/doc.json"
echo "  Saved $(wc -c < "$TMPDIR/doc.json") bytes"

# ============================================================
# STEP 2: Parse + Download images (Python)
# ============================================================
echo ""
echo "=========================================="
echo "STEP 2/6: Parsing & downloading images"
echo "=========================================="
python3 -u - "$TMPDIR" << 'PARSE_DOWNLOAD'
import json, re, sys, os, subprocess, time

tmpdir = sys.argv[1]
with open(os.path.join(tmpdir, "doc.json"), "r", encoding="utf-8") as f:
    data = json.load(f)
content = data["data"]["document"]["content"]

images = re.findall(r'<img[^>]+/>', content)
print(f"  Found {len(images)} images")

manifest = []
for i, img in enumerate(images):
    href_m = re.search(r'href="([^"]+)"', img)
    src_m = re.search(r'src="([^"]+)"', img)
    name_m = re.search(r'name="([^"]+)"', img)
    if not href_m:
        continue
    local = os.path.join(tmpdir, "images", f"img_{i+1:02d}.png")
    print(f"  [{i+1}/{len(images)}] Downloading...")
    subprocess.run(["curl", "-s", "-L", "-o", local, href_m.group(1)], timeout=60)
    sz = os.path.getsize(local) if os.path.exists(local) else 0
    manifest.append({
        "index": i+1,
        "src": src_m.group(1) if src_m else "",
        "name": name_m.group(1) if name_m else "image.png",
        "local": local,
    })
    print(f"    -> {sz:,} bytes")
    time.sleep(0.2)

with open(os.path.join(tmpdir, "img_manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print(f"  Done: {len(manifest)} images")
PARSE_DOWNLOAD

# ============================================================
# STEP 3: Upload images to R2 (Bash loop, reading from file)
# ============================================================
echo ""
echo "=========================================="
echo "STEP 3/6: Uploading images to R2"
echo "=========================================="

# Generate R2 keys via Python, write to a lines file
python3 -u - "$TMPDIR" "$CHAPTER_ID" << GENKEYS
import json, uuid, sys, os

tmpdir = sys.argv[1]
chapter_id = sys.argv[2]
with open(os.path.join(tmpdir, "img_manifest.json")) as f:
    imgs = json.load(f)

lines = []
for img in imgs:
    r2_key = f"book/{chapter_id}/{uuid.uuid4()}-img{img['index']:02d}.png"
    img["r2_key"] = r2_key
    lines.append(f"{r2_key}|{img['src']}|{img['name']}|{img['local']}")

# Save updated manifest with r2_key
with open(os.path.join(tmpdir, "img_manifest.json"), "w") as f:
    json.dump(imgs, f, indent=2, ensure_ascii=False)

# Write upload lines
with open(os.path.join(tmpdir, "r2_lines.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")
GENKEYS

# Upload loop - read from file, no pipe subshell issue
MAP_FILE="$TMPDIR/r2_map.txt"
: > "$MAP_FILE"
COUNT=0
OK=0

while IFS='|' read -r R2_KEY SRC NAME LOCAL; do
  [[ -z "$R2_KEY" ]] && continue
  COUNT=$((COUNT + 1))
  echo "  [$COUNT] Uploading $(basename "$R2_KEY")..."
  if npx wrangler r2 object put "dentalempireos/$R2_KEY" --file "$LOCAL" --content-type image/png --remote --config wrangler.jsonc 2>&1 | tail -1; then
    echo "$R2_KEY|$SRC|$NAME" >> "$MAP_FILE"
    OK=$((OK + 1))
    echo "    OK"
  else
    echo "    FAILED"
  fi
done < "$TMPDIR/r2_lines.txt"

echo "  Uploaded $OK/$COUNT images to R2"

# ============================================================
# STEP 4: Generate SQL (Python)
# ============================================================
echo ""
echo "=========================================="
echo "STEP 4/6: Generating SQL migration"
echo "=========================================="
python3 -u - "$TMPDIR" "$CHAPTER_ID" "$TIER" "$CHAPTER_NO" "$TITLE" "$DESCRIPTION" "$SQL_FILE" << 'GENSQL'
import json, re, sys, io, uuid, unicodedata, os

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

tmpdir = sys.argv[1]
chapter_id = sys.argv[2]
tier = int(sys.argv[3])
chapter_no = int(sys.argv[4])
title = sys.argv[5]
description = sys.argv[6]
sql_file = sys.argv[7]

with open(os.path.join(tmpdir, "doc.json"), "r", encoding="utf-8") as f:
    data = json.load(f)
content = data["data"]["document"]["content"]

# Build src -> r2 mapping from uploaded files
src_to_r2 = {}
r2map_path = os.path.join(tmpdir, "r2_map.txt")
if os.path.exists(r2map_path):
    with open(r2map_path) as f:
        for line in f:
            line = line.strip()
            if "|" not in line: continue
            parts = line.split("|", 2)
            r2_key, src_token = parts[0], parts[1]
            fname = parts[2] if len(parts) > 2 else "image.png"
            src_to_r2[src_token] = {"r2_key": r2_key, "filename": fname, "mime": "image/png"}

print(f"  Image mapping: {len(src_to_r2)}")

def slugify(text):
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")[:80]

def html_to_md(html):
    t = html
    t = re.sub(r"<b>(.*?)</b>", r"**\1**", t, flags=re.DOTALL)
    t = re.sub(r"<strong>(.*?)</strong>", r"**\1**", t, flags=re.DOTALL)
    t = re.sub(r"<em>(.*?)</em>", r"*\1*", t, flags=re.DOTALL)
    t = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", t, flags=re.DOTALL)
    t = re.sub(r"<code>(.*?)</code>", r"`\1`", t, flags=re.DOTALL)
    t = re.sub(r"<span[^>]*>(.*?)</span>", r"\1", t, flags=re.DOTALL)
    t = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1", t, flags=re.DOTALL)
    t = re.sub(r"<[ou]l[^>]*>\s*", "", t)
    t = re.sub(r"</[ou]l>\s*", "", t)
    t = re.sub(r"<br\s*/?>", "\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    for ent, ch in [("&amp;","&"),("&lt;","<"),("&gt;",">"),("&quot;",'"'),("&#39;","'")]:
        t = t.replace(ent, ch)
    return re.sub(r"\n{3,}", "\n\n", t).strip()

def esc(s):
    return s.replace("'", "''").replace("\\", "\\\\")
    return s.replace("'", "''")

# ---- Parse XML ----
nodes = []
pos = 0
while pos < len(content):
    m = re.search(r'<(h[1-6]|img|p|ul|ol|pre|callout|table|hr|title)[\s>]', content[pos:])
    if not m: break
    tag = m.group(1)
    open_gt = content.find(">", pos + m.start())
    if open_gt == -1: break
    after_open = open_gt + 1

    if tag == "img":
        full = content[pos + m.start():after_open]
        sm = re.search(r'src="([^"]+)"', full)
        nm = re.search(r'name="([^"]+)"', full)
        if sm: nodes.append({"type":"image","src":sm.group(1),"name":nm.group(1) if nm else "image.png"})
        pos = after_open; continue

    if tag in ("title","h1"):
        end = re.search(rf"</{tag}>", content[after_open:])
        pos = after_open + (end.end() if end else 0); continue

    if tag in ("h2","h3","h4","h5","h6"):
        end = re.search(rf"</{tag}>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            nodes.append({"type":"heading","level":int(tag[1]),"text":re.sub(r"<[^>]+>","",inner).strip()})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    if tag == "p":
        end = re.search(r"</p>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            if inner.strip(): nodes.append({"type":"text","html":inner.strip()})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    if tag in ("ul","ol"):
        end = re.search(rf"</{tag}>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            if inner.strip(): nodes.append({"type":"text","html":inner.strip()})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    if tag == "callout":
        end = re.search(r"</callout>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            em = re.search(r'emoji="([^"]+)"', content[pos+m.start():after_open])
            emoji = em.group(1) if em else "\U0001f4a1"
            txt = re.sub(r"<[^>]+>","",inner).strip()
            if txt: nodes.append({"type":"text","html":f"{emoji} {txt}"})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    if tag == "pre":
        end = re.search(r"</pre>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            lm = re.search(r'lang="([^"]+)"', content[pos+m.start():after_open])
            code = re.sub(r"<[^>]+>","",inner).strip()
            lang = lm.group(1) if lm else ""
            if code: nodes.append({"type":"text","html":f"```{lang}\n{code}\n```"})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    if tag == "hr":
        nodes.append({"type":"text","html":"---"})
        pos = after_open; continue

    if tag == "table":
        end = re.search(r"</table>", content[after_open:])
        if end:
            inner = content[after_open:after_open+end.start()]
            rows = re.findall(r"<tr[^>]*>(.*?)</tr>", inner, re.DOTALL)
            if rows:
                lines = []
                for ri, row in enumerate(rows):
                    cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.DOTALL)
                    clean = [re.sub(r"<[^>]+>","",c).strip() for c in cells]
                    if clean:
                        lines.append("| " + " | ".join(clean) + " |")
                        if ri == 0: lines.append("| " + " | ".join(["---"]*len(clean)) + " |")
                nodes.append({"type":"text","html":"\n".join(lines)})
            pos = after_open+end.end()
        else: pos = after_open
        continue

    pos = after_open

print(f"  Nodes: {len(nodes)} ({sum(1 for n in nodes if n['type']=='heading')} headings, {sum(1 for n in nodes if n['type']=='text')} text, {sum(1 for n in nodes if n['type']=='image')} images)")

# ---- Build sections ----
sections = []
h2 = h3 = None
preamble = []

for node in nodes:
    if node["type"] == "heading":
        lv = node["level"]
        if lv == 2:
            h2 = {"id":str(uuid.uuid4()),"text":node["text"],"children":[],"content":list(preamble)}
            preamble = []; h3 = None; sections.append(h2)
        elif lv == 3:
            h3 = {"id":str(uuid.uuid4()),"text":node["text"],"content":[]}
            if h2: h2["children"].append(h3)
            else: sections.append(h3)
        elif lv in (4,5,6):
            tgt = h3 or h2
            if tgt: tgt["content"].append({"type":"heading","level":min(lv,3),"text":node["text"]})
    elif node["type"] in ("text","image"):
        tgt = h3 or h2
        if tgt: tgt["content"].append(node)
        else: preamble.append(node)

# ---- Generate SQL ----
sql = []
now = "2026-06-20T00:00:00Z"
sql.append(f"INSERT OR IGNORE INTO chapter (id,tier,chapter_no,title,description,`order`,status,createdAt,updatedAt) VALUES ('{chapter_id}',{tier},{chapter_no},'{esc(title)}','{esc(description)}',{chapter_no},'draft','{now}','{now}');")

so = 0; bo = 0

def add_blocks(sid, clist):
    global bo
    for c in clist:
        if c["type"] == "text":
            md = html_to_md(c["html"])
            if md.strip():
                bid = str(uuid.uuid4())
                sql.append(f"INSERT OR IGNORE INTO block (id,section_id,`order`,type,text_md,r2_key,filename,mime,alt,caption) VALUES ('{bid}','{sid}',{bo},'text','{esc(md)}',NULL,NULL,NULL,NULL,NULL);")
                bo += 1
        elif c["type"] == "image":
            src = c.get("src")
            if src and src in src_to_r2:
                u = src_to_r2[src]
                bid = str(uuid.uuid4())
                sql.append(f"INSERT OR IGNORE INTO block (id,section_id,`order`,type,text_md,r2_key,filename,mime,alt,caption) VALUES ('{bid}','{sid}',{bo},'image',NULL,'{u['r2_key']}','{u['filename']}','{u['mime']}','{esc(c.get('name','image'))}',NULL);")
                bo += 1

for h2 in sections:
    h2id = h2["id"]
    sql.append(f"INSERT OR IGNORE INTO section (id,chapter_id,parent_id,level,title,slug,`order`,keywords) VALUES ('{h2id}','{chapter_id}',NULL,2,'{esc(h2['text'])}','{slugify(h2['text'])}',{so},'[]');")
    so += 1; add_blocks(h2id, h2.get("content",[]))
    for h3 in h2.get("children",[]):
        h3id = h3["id"]
        sql.append(f"INSERT OR IGNORE INTO section (id,chapter_id,parent_id,level,title,slug,`order`,keywords) VALUES ('{h3id}','{chapter_id}','{h2id}',3,'{esc(h3['text'])}','{slugify(h3['text'])}',{so},'[]');")
        so += 1; add_blocks(h3id, h3.get("content",[]))

out = "\n".join(sql)
os.makedirs(os.path.dirname(sql_file) or ".", exist_ok=True)
with open(sql_file, "w", encoding="utf-8") as f:
    f.write(out + "\n")

print(f"  SQL: {len(sql)} statements, {len(out)} bytes")
print(f"  Sections: {so}, Blocks: {bo}")
GENSQL

# ============================================================
# STEP 5: Execute on D1
# ============================================================
echo ""
echo "=========================================="
echo "STEP 5/6: Executing SQL on D1"
echo "=========================================="

if [[ -n "$EXEC_FLAG" ]]; then
  echo "  Cleaning existing data..."
  npx wrangler d1 execute DB $EXEC_FLAG --command "DELETE FROM block WHERE section_id IN (SELECT id FROM section WHERE chapter_id='$CHAPTER_ID')" --config wrangler.jsonc 2>&1 | tail -1
  npx wrangler d1 execute DB $EXEC_FLAG --command "DELETE FROM section WHERE chapter_id='$CHAPTER_ID'" --config wrangler.jsonc 2>&1 | tail -1
  npx wrangler d1 execute DB $EXEC_FLAG --command "DELETE FROM chapter WHERE id='$CHAPTER_ID'" --config wrangler.jsonc 2>&1 | tail -1

  echo "  Importing SQL..."
  npx wrangler d1 execute DB $EXEC_FLAG --file "$SQL_FILE" --config wrangler.jsonc 2>&1 | grep -E "Processed|Executed|success|error"
else
  echo "  Skipped (--execute not set). Run manually:"
  echo "    npx wrangler d1 execute DB --remote --file $SQL_FILE"
fi

# ============================================================
# STEP 6: Summary
# ============================================================
echo ""
echo "=========================================="
echo "STEP 6/6: Summary"
echo "=========================================="
echo "  Chapter: $TITLE (Tier $TIER, #$CHAPTER_NO)"
echo "  ID:      $CHAPTER_ID"
echo "  SQL:     $SQL_FILE"
echo "  Images:  ${OK:-0} uploaded to R2"
echo "  Temp:    $TMPDIR/"
echo ""
echo "Done!"
