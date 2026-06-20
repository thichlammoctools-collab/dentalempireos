#!/usr/bin/env python3
"""
import-lark.py — One-shot import from Lark Docs -> Cloudflare D1 + R2

Usage:
  python3 scripts/import-lark.py \
    --doc "https://...larksuite.com/docx/TOKEN" \
    --tier 1 --chapter-no 3 \
    --chapter-id "03-roadmap-to-be-sky" \
    --title "ROADMAP TO BE SKY" \
    [--description "..."] \
    [--execute]        # execute SQL on remote D1
    [--execute-local]  # execute SQL on local D1 (via wrangler)
    [--no-images]      # skip image download/upload
    [--no-webp]        # keep original PNG (skip WebP conversion)
    [--webp-quality 80]

Pipeline:
  1. lark-cli fetch doc (XML with block IDs)
  2. Parse headings, text, images from XML
  3. Download images via curl (Lark direct URLs)
  4. Convert to WebP (via sharp/Node.js) — optional, on by default
  5. Upload to R2 via Cloudflare REST API (S3-compatible)
  6. Generate SQL migration file
  7. Execute SQL on D1 via Cloudflare REST API
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import uuid
import unicodedata
import hashlib
import hmac
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# ── Fix Windows encoding ──
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ════════════════════════════════════════════════════════════════
# CONFIG
# ════════════════════════════════════════════════════════════════
ACCOUNT_ID = "6c99b69a2ef00c1754fae70793262cd3"
R2_BUCKET = "dentalempireos"
D1_DB_ID = "dc3b8890-c22f-4ebb-8172-1db5f4317241"
R2_ENDPOINT = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
D1_EXEC_ENDPOINT = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{D1_DB_ID}/execute"


# ════════════════════════════════════════════════════════════════
# CREDENTIALS — auto-detect from wrangler session
# ════════════════════════════════════════════════════════════════
# ── Windows subprocess fix ──
# On Windows, Python subprocess can't find .cmd/.exe in PATH without shell=True
SHELL = sys.platform == "win32"


def run_cmd(args: list, **kwargs) -> subprocess.CompletedProcess:
    """Run a command, auto-detecting shell=True on Windows."""
    defaults = {"shell": SHELL, "encoding": "utf-8", "timeout": 30}
    defaults.update(kwargs)
    return subprocess.run(args, **defaults)


def get_wrangler_token() -> str:
    """Read the session token from wrangler config."""
    config_paths = [
        Path.home() / ".config" / ".wrangler" / "config" / "default.toml",
        Path(os.environ.get("APPDATA", "")) / "xdg.config" / ".wrangler" / "config" / "default.toml",
    ]
    for p in config_paths:
        if p.exists():
            for line in p.read_text().splitlines():
                if line.startswith("oauth_token"):
                    token = line.split("=", 1)[1].strip().strip('"')
                    return token
    raise RuntimeError(
        "Wrangler session token not found.\n"
        "Run `lark-cli config init` or `wrangler login` first."
    )


# ════════════════════════════════════════════════════════════════
# R2 Upload via Cloudflare REST API (S3-compatible)
# ════════════════════════════════════════════════════════════════
def r2_upload_file(token: str, r2_key: str, file_path: str, content_type: str, max_retries: int = 3) -> bool:
    """Upload a file to R2 using Cloudflare REST API (S3 PutObject)."""
    import urllib.request
    import urllib.error

    # S3 v4 signature is complex; Cloudflare also supports a simpler
    # presigned-URL approach, but the most reliable way is to use
    # the Cloudflare API with bearer token + S3-compatible endpoint.
    #
    # Actually, the simplest reliable approach: use the presigned URL
    # from the Cloudflare R2 API, or just use the direct S3 API with
    # HMAC credentials from the worker binding. Since we don't have
    # S3 API keys, we'll use the Cloudflare Workers API to upload.
    #
    # The most practical approach: use `wrangler r2 object put` but
    # with subprocess and proper error handling. For truly native
    # upload, we need S3 credentials.
    #
    # Alternative: Use the Cloudflare API to create a temporary upload
    # URL via the R2 bucket API.
    #
    # Let's use a different approach: since we have the bearer token,
    # we can use the S3-compatible endpoint with token-based auth.

    # Actually, the most reliable cross-platform approach is to use
    # the Cloudflare REST API endpoint for R2 object upload.
    # This is: PUT /accounts/{account_id}/r2/buckets/{bucket}/objects/{key}

    # Wait — Cloudflare doesn't have a direct R2 upload REST API outside S3.
    # The recommended approach is S3-compatible API with HMAC keys.
    # Since we only have the OAuth token, we need to use wrangler as the uploader.

    # BEST APPROACH: Use wrangler but with proper subprocess handling.
    for attempt in range(max_retries):
        try:
            result = run_cmd(
                [
                    "npx", "wrangler", "r2", "object", "put",
                    f"{R2_BUCKET}/{r2_key}",
                    "--file", file_path,
                    "--content-type", content_type,
                    "--remote",
                    "--config", "wrangler.jsonc",
                ],
                capture_output=True,
                text=True,
                timeout=120,
                cwd=str(Path(__file__).parent.parent),
            )
            if result.returncode == 0:
                return True
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"    Retry {attempt+2}/{max_retries} (wait {wait}s)...")
                time.sleep(wait)
        except subprocess.TimeoutExpired:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
        except Exception as e:
            print(f"    Error: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)

    return False


def r2_upload_batch(token: str, uploads: list, max_workers: int = 3) -> dict:
    """Upload multiple files to R2 with controlled parallelism."""
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {}
        for item in uploads:
            future = executor.submit(
                r2_upload_file, token, item["r2_key"], item["local"], item["mime"]
            )
            futures[future] = item

        for future in as_completed(futures):
            item = futures[future]
            success = future.result()
            results[item["src"]] = {
                "r2_key": item["r2_key"],
                "filename": item["name"],
                "mime": item["mime"],
            } if success else None
            status = "OK" if success else "FAILED"
            print(f"    [{status}] {item['name']} -> {item['r2_key'][:50]}...")

    return results


# ════════════════════════════════════════════════════════════════
# D1 Execute via Cloudflare REST API
# ════════════════════════════════════════════════════════════════
def d1_execute_sql(token: str, sql: str) -> bool:
    """Execute SQL on D1 via Cloudflare REST API."""
    import urllib.request
    import urllib.error

    payload = json.dumps({"sql": sql}).encode("utf-8")
    req = urllib.request.Request(
        D1_EXEC_ENDPOINT,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        resp = urllib.request.urlopen(req, timeout=60)
        result = json.loads(resp.read())
        if not result.get("success"):
            errors = result.get("errors", [])
            for err in errors[:3]:
                print(f"    D1 error: {err.get('message', err)}")
            return False
        meta = result.get("result", [{}])[0].get("meta", {})
        rows_written = meta.get("rows_written", 0)
        print(f"    OK: {result.get('result', [{}])[0].get('meta', {}).get('rows_written', 0)} rows written")
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"    D1 HTTP error {e.code}: {body[:300]}")
        return False


def d1_delete_chapter(token: str, chapter_id: str) -> bool:
    """Delete all data for a chapter from D1."""
    sql = (
        f"DELETE FROM block WHERE section_id IN (SELECT id FROM section WHERE chapter_id='{chapter_id}'); "
        f"DELETE FROM section WHERE chapter_id='{chapter_id}'; "
        f"DELETE FROM chapter WHERE id='{chapter_id}';"
    )
    return d1_execute_sql(token, sql)


# ════════════════════════════════════════════════════════════════
# LARK: Fetch + Parse + Download
# ════════════════════════════════════════════════════════════════
def lark_fetch_doc(doc_token: str, tmpdir: str) -> str:
    """Fetch Lark doc via lark-cli, return XML content."""
    print(f"  Fetching doc: {doc_token}")
    result = run_cmd(
        ["lark-cli", "docs", "+fetch", "--api-version", "v2", "--doc", doc_token, "--detail", "with-ids"],
        capture_output=True, text=True, timeout=30,
    )
    if result.returncode != 0:
        print(f"  ERROR: lark-cli failed: {result.stderr[:300]}")
        sys.exit(1)
    data = json.loads(result.stdout)
    if not data.get("ok"):
        print(f"  ERROR: Lark API error: {data.get('error', {}).get('message', 'unknown')}")
        sys.exit(1)

    content = data["data"]["document"]["content"]
    doc_path = os.path.join(tmpdir, "doc.json")
    with open(doc_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  OK: {len(content):,} chars")
    return content


def lark_download_images(content: str, tmpdir: str) -> list:
    """Download images from Lark document, return manifest."""
    images = re.findall(r'<img[^>]+/>', content)
    print(f"  Found {len(images)} images")
    if not images:
        return []

    img_dir = os.path.join(tmpdir, "images")
    os.makedirs(img_dir, exist_ok=True)
    manifest = []

    for i, img in enumerate(images):
        href_m = re.search(r'href="([^"]+)"', img)
        src_m = re.search(r'src="([^"]+)"', img)
        name_m = re.search(r'name="([^"]+)"', img)
        if not href_m:
            continue

        local = os.path.join(img_dir, f"img_{i+1:02d}.png")
        # Skip if already downloaded and valid
        if os.path.exists(local) and os.path.getsize(local) > 1000:
            sz = os.path.getsize(local)
            print(f"  [{i+1}] Cached ({sz:,} bytes)")
        else:
            print(f"  [{i+1}] Downloading...")
            try:
                run_cmd(
                    ["curl", "-s", "-L", "--connect-timeout", "10", "--max-time", "120", "-o", local, href_m.group(1)],
                    timeout=150,
                )
            except subprocess.TimeoutExpired:
                print(f"    WARN: timeout, skipping")
                continue
            sz = os.path.getsize(local) if os.path.exists(local) else 0
            if sz < 1000:
                print(f"    WARN: too small ({sz} bytes), skipping")
                continue
            print(f"    {sz:,} bytes")
            time.sleep(0.15)

        manifest.append({
            "index": i + 1,
            "src": src_m.group(1) if src_m else "",
            "name": name_m.group(1) if name_m else f"img_{i+1:02d}.png",
            "local": local,
        })

    return manifest


def convert_to_webp(manifest: list, quality: int = 80) -> dict:
    """Convert PNG images to WebP via sharp/Node.js. Returns map of src -> local webp path."""
    if not manifest:
        return {}

    # Write manifest for Node.js
    tmpdir = os.path.dirname(manifest[0]["local"])
    input_file = os.path.join(tmpdir, "convert_input.json")
    output_file = os.path.join(tmpdir, "convert_output.json")

    with open(input_file, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False)

    proj_dir = str(Path(__file__).parent.parent).replace(chr(92), "/")
    node_script = f"""
const path = require('path');
const sharp = require(path.join('{proj_dir}'.replace(/\\//g, '/'), 'node_modules', 'sharp'));
const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('{input_file.replace(chr(92), "/")}', 'utf8'));
const results = {{}};
let totalBefore = 0, totalAfter = 0;

async function convert() {{
  for (const img of manifest) {{
    const src = img.local.replace(/\\\\/g, '/');
    const dst = src.replace('.png', '.webp');
    try {{
      const before = fs.statSync(src).size;
      await sharp(src).webp({{ quality: {quality} }}).toFile(dst);
      const after = fs.statSync(dst).size;
      results[img.src] = dst.replace(/\\\\/g, '/');
      totalBefore += before;
      totalAfter += after;
      const pct = before > 0 ? Math.round((1 - after/before) * 100) : 0;
      console.log('  [' + img.index + '] ' + (before/1024).toFixed(0) + 'KB -> ' + (after/1024).toFixed(0) + 'KB (-' + pct + '%)');
    }} catch (e) {{
      console.error('  [' + img.index + '] WARN: ' + e.message);
      results[img.src] = src;
    }}
  }}
  fs.writeFileSync('{output_file.replace(chr(92), "/")}', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log('  Total: ' + (totalBefore/1024/1024).toFixed(1) + 'MB -> ' + (totalAfter/1024/1024).toFixed(1) + 'MB (-' + pct + '%)');
}}
convert().catch(e => {{ console.error(e.message); process.exit(1); }});
"""

    print("  Converting to WebP...")
    result = run_cmd(
        ["node", "-e", node_script],
        capture_output=True, text=True, timeout=120,
        cwd=str(Path(__file__).parent.parent),
    )
    if result.returncode == 0:
        print(result.stdout.strip())
    else:
        print(f"  WARN: WebP conversion failed: {result.stderr[:200]}")
        # Fallback: use original PNGs
        return {img["src"]: img["local"] for img in manifest}

    if os.path.exists(output_file):
        with open(output_file, "r") as f:
            return json.load(f)
    return {img["src"]: img["local"] for img in manifest}


# ════════════════════════════════════════════════════════════════
# XML Parser (same logic as gen-chapter3-sql.py)
# ════════════════════════════════════════════════════════════════
def parse_lark_xml(content: str) -> list:
    """Parse Lark XML into flat list of nodes."""
    nodes = []
    pos = 0
    while pos < len(content):
        m = re.search(r'<(h[1-6]|img|p|ul|ol|pre|callout|table|hr|title)[\s>]', content[pos:])
        if not m:
            break
        tag = m.group(1)
        open_gt = content.find(">", pos + m.start())
        if open_gt == -1:
            break
        after_open = open_gt + 1

        if tag == "img":
            full = content[pos + m.start():after_open]
            sm = re.search(r'src="([^"]+)"', full)
            nm = re.search(r'name="([^"]+)"', full)
            if sm:
                nodes.append({"type": "image", "src": sm.group(1), "name": nm.group(1) if nm else "image.png"})
            pos = after_open
            continue

        if tag in ("title", "h1"):
            end = re.search(rf"</{tag}>", content[after_open:])
            pos = after_open + (end.end() if end else 0)
            continue

        if tag in ("h2", "h3", "h4", "h5", "h6"):
            end = re.search(rf"</{tag}>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                text = re.sub(r"<[^>]+>", "", inner).strip()
                nodes.append({"type": "heading", "level": int(tag[1]), "text": text})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        if tag == "p":
            end = re.search(r"</p>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                if inner.strip():
                    nodes.append({"type": "text", "html": inner.strip()})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        if tag in ("ul", "ol"):
            end = re.search(rf"</{tag}>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                if inner.strip():
                    nodes.append({"type": "text", "html": inner.strip()})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        if tag == "callout":
            end = re.search(r"</callout>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                em = re.search(r'emoji="([^"]+)"', content[pos + m.start():after_open])
                emoji = em.group(1) if em else "\U0001f4a1"
                txt = re.sub(r"<[^>]+>", "", inner).strip()
                if txt:
                    nodes.append({"type": "text", "html": f"{emoji} {txt}"})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        if tag == "pre":
            end = re.search(r"</pre>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                lm = re.search(r'lang="([^"]+)"', content[pos + m.start():after_open])
                code = re.sub(r"<[^>]+>", "", inner).strip()
                lang = lm.group(1) if lm else ""
                if code:
                    nodes.append({"type": "text", "html": f"```{lang}\n{code}\n```"})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        if tag == "hr":
            nodes.append({"type": "text", "html": "---"})
            pos = after_open
            continue

        if tag == "table":
            end = re.search(r"</table>", content[after_open:])
            if end:
                inner = content[after_open:after_open + end.start()]
                rows = re.findall(r"<tr[^>]*>(.*?)</tr>", inner, re.DOTALL)
                if rows:
                    lines = []
                    for ri, row in enumerate(rows):
                        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.DOTALL)
                        clean = [re.sub(r"<[^>]+>", "", c).strip() for c in cells]
                        if clean:
                            lines.append("| " + " | ".join(clean) + " |")
                            if ri == 0:
                                lines.append("| " + " | ".join(["---"] * len(clean)) + " |")
                    nodes.append({"type": "text", "html": "\n".join(lines)})
                pos = after_open + end.end()
            else:
                pos = after_open
            continue

        pos = after_open

    return nodes


# ════════════════════════════════════════════════════════════════
# SQL Generator
# ════════════════════════════════════════════════════════════════
def slugify(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")[:80]


def html_to_md(html: str) -> str:
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
    for ent, ch in [("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&#39;", "'")]:
        t = t.replace(ent, ch)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def esc_sql(s: str) -> str:
    return s.replace("'", "''").replace("\\", "\\\\")


def build_section_tree(nodes: list) -> list:
    sections = []
    h2 = h3 = None
    preamble = []
    for node in nodes:
        if node["type"] == "heading":
            lv = node["level"]
            if lv == 2:
                h2 = {"id": str(uuid.uuid4()), "text": node["text"], "children": [], "content": list(preamble)}
                preamble = []
                h3 = None
                sections.append(h2)
            elif lv == 3:
                h3 = {"id": str(uuid.uuid4()), "text": node["text"], "content": []}
                if h2:
                    h2["children"].append(h3)
                else:
                    sections.append(h3)
            elif lv in (4, 5, 6):
                tgt = h3 or h2
                if tgt:
                    tgt["content"].append({"type": "heading", "level": min(lv, 3), "text": node["text"]})
        elif node["type"] in ("text", "image"):
            tgt = h3 or h2
            if tgt:
                tgt["content"].append(node)
            else:
                preamble.append(node)
    return sections


def generate_sql(chapter_id: str, tier: int, chapter_no: int, title: str,
                 description: str, sections: list, src_to_r2: dict) -> str:
    sql = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    sql.append(
        f"INSERT OR IGNORE INTO chapter (id,tier,chapter_no,title,description,`order`,status,createdAt,updatedAt) "
        f"VALUES ('{chapter_id}',{tier},{chapter_no},'{esc_sql(title)}','{esc_sql(description)}',{chapter_no},'draft','{now}','{now}');"
    )

    so = 0
    bo = [0]  # mutable counter

    def add_blocks(sid, clist):
        for c in clist:
            if c["type"] == "text":
                md = html_to_md(c["html"])
                if md.strip():
                    bid = str(uuid.uuid4())
                    sql.append(
                        f"INSERT OR IGNORE INTO block (id,section_id,`order`,type,text_md,r2_key,filename,mime,alt,caption) "
                        f"VALUES ('{bid}','{sid}',{bo[0]},'text','{esc_sql(md)}',NULL,NULL,NULL,NULL,NULL);"
                    )
                    bo[0] += 1
            elif c["type"] == "image":
                src = c.get("src")
                if src and src in src_to_r2 and src_to_r2[src] is not None:
                    u = src_to_r2[src]
                    bid = str(uuid.uuid4())
                    r2k = u["r2_key"]
                    fname = u["filename"]
                    fmime = u["mime"]
                    alt = esc_sql(c.get("name", "image"))
                    sql.append(
                        f"INSERT OR IGNORE INTO block (id,section_id,`order`,type,text_md,r2_key,filename,mime,alt,caption) "
                        f"VALUES ('{bid}','{sid}',{bo[0]},'image',NULL,'{r2k}','{fname}','{fmime}','{alt}',NULL);"
                    )
                    bo[0] += 1

    for h2 in sections:
        h2id = h2["id"]
        sql.append(
            f"INSERT OR IGNORE INTO section (id,chapter_id,parent_id,level,title,slug,`order`,keywords) "
            f"VALUES ('{h2id}','{chapter_id}',NULL,2,'{esc_sql(h2['text'])}','{slugify(h2['text'])}',{so},'[]');"
        )
        so += 1
        add_blocks(h2id, h2.get("content", []))
        for h3 in h2.get("children", []):
            h3id = h3["id"]
            sql.append(
                f"INSERT OR IGNORE INTO section (id,chapter_id,parent_id,level,title,slug,`order`,keywords) "
                f"VALUES ('{h3id}','{chapter_id}','{h2id}',3,'{esc_sql(h3['text'])}','{slugify(h3['text'])}',{so},'[]');"
            )
            so += 1
            add_blocks(h3id, h3.get("content", []))

    return "\n".join(sql), so, bo[0]


# ════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════
def main():
    parser = argparse.ArgumentParser(description="Import Lark Doc to DentalEmpireOS D1+R2")
    parser.add_argument("--doc", required=True, help="Lark doc URL or token")
    parser.add_argument("--tier", type=int, required=True, choices=[1, 2, 3])
    parser.add_argument("--chapter-no", type=int, required=True)
    parser.add_argument("--chapter-id", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument("--execute", action="store_true", help="Execute SQL on remote D1")
    parser.add_argument("--execute-local", action="store_true", help="Execute SQL on local D1 (wrangler)")
    parser.add_argument("--no-images", action="store_true")
    parser.add_argument("--no-webp", action="store_true")
    parser.add_argument("--webp-quality", type=int, default=80)
    parser.add_argument("--sql-only", action="store_true", help="Only generate SQL, don't execute")
    parser.add_argument("--output", help="Output SQL file path")
    args = parser.parse_args()

    # Extract doc token from URL
    doc_token = re.sub(r"^https?://[^/]+/docx/([^?]+).*", r"\1", args.doc)
    if doc_token == args.doc and not re.match(r"^[A-Za-z0-9]+$", doc_token):
        print("ERROR: Cannot extract doc token from URL")
        sys.exit(1)

    sql_file = args.output or f"migrations/import-{args.chapter_id}.sql"
    tmpdir = f"tmp/import-{args.chapter_id}"
    os.makedirs(os.path.join(tmpdir, "images"), exist_ok=True)

    # ── Step 1: Get credentials ──
    print("=" * 50)
    print("STEP 1/7: Getting Cloudflare credentials")
    print("=" * 50)
    try:
        token = get_wrangler_token()
        print(f"  Token: {token[:20]}...{token[-10:]}")
    except RuntimeError as e:
        print(f"  ERROR: {e}")
        sys.exit(1)

    # ── Step 2: Fetch Lark Doc ──
    print()
    print("=" * 50)
    print("STEP 2/7: Fetching Lark document")
    print("=" * 50)
    content = lark_fetch_doc(doc_token, tmpdir)

    # ── Step 3: Parse + Download images ──
    print()
    print("=" * 50)
    print("STEP 3/7: Parsing & downloading images")
    print("=" * 50)
    nodes = parse_lark_xml(content)
    headings = sum(1 for n in nodes if n["type"] == "heading")
    texts = sum(1 for n in nodes if n["type"] == "text")
    imgs = sum(1 for n in nodes if n["type"] == "image")
    print(f"  Parsed: {len(nodes)} nodes ({headings} headings, {texts} text, {imgs} images)")

    manifest = []
    if not args.no_images:
        manifest = lark_download_images(content, tmpdir)
    print(f"  Downloaded: {len(manifest)} images")

    # ── Step 4: Convert to WebP ──
    src_to_local = {}
    if manifest and not args.no_webp:
        print()
        print("=" * 50)
        print("STEP 4/7: Converting to WebP")
        print("=" * 50)
        src_to_local = convert_to_webp(manifest, quality=args.webp_quality)
    else:
        src_to_local = {m["src"]: m["local"] for m in manifest}

    # ── Step 5: Upload to R2 ──
    print()
    print("=" * 50)
    print("STEP 5/7: Uploading images to R2")
    print("=" * 50)
    src_to_r2 = {}
    if manifest:
        uploads = []
        for m in manifest:
            local_path = src_to_local.get(m["src"], m["local"])
            ext = "webp" if local_path.endswith(".webp") else "png"
            mime = "image/webp" if ext == "webp" else "image/png"
            r2_key = f"book/{args.chapter_id}/{uuid.uuid4()}-img{m['index']:02d}.{ext}"
            uploads.append({
                "src": m["src"],
                "r2_key": r2_key,
                "local": local_path,
                "mime": mime,
                "name": m["name"],
            })

        src_to_r2 = r2_upload_batch(token, uploads, max_workers=3)
        ok = sum(1 for v in src_to_r2.values() if v is not None)
        print(f"  Uploaded: {ok}/{len(uploads)} images")

    # ── Step 6: Generate SQL ──
    print()
    print("=" * 50)
    print("STEP 6/7: Generating SQL")
    print("=" * 50)
    sections = build_section_tree(nodes)
    sql_text, num_sections, num_blocks = generate_sql(
        args.chapter_id, args.tier, args.chapter_no,
        args.title, args.description, sections, src_to_r2,
    )
    os.makedirs(os.path.dirname(sql_file) or ".", exist_ok=True)
    with open(sql_file, "w", encoding="utf-8") as f:
        f.write(sql_text + "\n")
    print(f"  SQL: {len(sql_text):,} bytes, {sql_text.count(';')} statements")
    print(f"  Sections: {num_sections}, Blocks: {num_blocks}")
    print(f"  Output: {sql_file}")

    # ── Step 7: Execute ──
    print()
    print("=" * 50)
    print("STEP 7/7: Execute SQL")
    print("=" * 50)
    if args.sql_only:
        print("  Skipped (--sql-only)")
    elif args.execute:
        print("  Deleting existing data...")
        for cmd in [
            f"DELETE FROM block WHERE section_id IN (SELECT id FROM section WHERE chapter_id='{args.chapter_id}')",
            f"DELETE FROM section WHERE chapter_id='{args.chapter_id}'",
            f"DELETE FROM chapter WHERE id='{args.chapter_id}'",
        ]:
            result = run_cmd(
                ["npx", "wrangler", "d1", "execute", "DB", "--remote",
                 "--command", cmd, "--config", "wrangler.jsonc"],
                capture_output=True, text=True, timeout=30,
                cwd=str(Path(__file__).parent.parent),
            )
        print("  Executing SQL...")
        result = run_cmd(
            ["npx", "wrangler", "d1", "execute", "DB", "--remote",
             "--file", sql_file, "--config", "wrangler.jsonc"],
            capture_output=True, text=True, timeout=120,
            cwd=str(Path(__file__).parent.parent),
        )
        if result.returncode == 0:
            print("  Success!")
            for line in result.stdout.splitlines():
                if any(k in line for k in ["rows", "Processed", "Executed"]):
                    print(f"    {line.strip()}")
        else:
            print(f"  FAILED: {result.stderr[:200]}")
    elif args.execute_local:
        print("  Executing on local D1 via wrangler...")
        subprocess.run(
            ["npx", "wrangler", "d1", "execute", "DB", "--local", "--file", sql_file, "--config", "wrangler.jsonc"],
            shell=True,
            cwd=str(Path(__file__).parent.parent),
        )
    else:
        print(f"  SQL ready. Execute with:")
        print(f"    python3 scripts/import-lark.py --doc \"{args.doc}\" --tier {args.tier} "
              f"--chapter-no {args.chapter_no} --chapter-id \"{args.chapter_id}\" "
              f"--title \"{args.title}\" --execute")

    # ── Summary ──
    print()
    print("=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"  Chapter: {args.title} (Tier {args.tier}, #{args.chapter_no})")
    print(f"  ID:      {args.chapter_id}")
    print(f"  SQL:     {sql_file}")
    print(f"  Images:  {len(src_to_r2)} uploaded to R2")
    print()
    print("Done!")


if __name__ == "__main__":
    main()
