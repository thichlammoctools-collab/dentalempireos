#!/usr/bin/env python3
"""
Import a Lark document into DentalEmpireOS D1 database.
Pipeline: fetch Lark doc XML → parse structure → download images → upload to R2 → generate SQL

Usage:
  python scripts/lark-to-d1-import.py --doc-token <token> --tier <1|2|3> --chapter-no <n> --chapter-id <slug> --chapter-title "Title"

Steps:
  1. Fetch doc via lark-cli
  2. Parse XML into sections/blocks
  3. Download images from Lark
  4. Upload images to R2 via Wrangler
  5. Generate SQL migration
  6. Execute SQL on D1
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

# Fix Windows console encoding for emoji output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def fetch_lark_doc(doc_token: str) -> str:
    """Fetch Lark document content via lark-cli."""
    print(f"📥 Fetching Lark doc: {doc_token}")
    result = subprocess.run(
        ["lark-cli", "docs", "+fetch", "--api-version", "v2", "--doc", doc_token, "--detail", "with-ids"],
        capture_output=True, text=True, encoding="utf-8"
    )
    if result.returncode != 0:
        print(f"❌ Failed to fetch doc: {result.stderr}")
        sys.exit(1)
    data = json.loads(result.stdout)
    if not data.get("ok"):
        print(f"❌ Lark API error: {data}")
        sys.exit(1)
    content = data["data"]["document"]["content"]
    print(f"✅ Doc fetched ({len(content)} chars)")
    return content


def download_lark_image(token: str, output_path: str) -> str:
    """Download an image from Lark doc."""
    result = subprocess.run(
        ["lark-cli", "docs", "+media-download", "--token", token, "--output", output_path],
        capture_output=True, text=True, encoding="utf-8"
    )
    if result.returncode != 0:
        print(f"  ⚠️  Failed to download image {token}: {result.stderr}")
        return None
    # lark-cli auto-adds extension if not provided
    # Find the actual file
    base = Path(output_path).stem
    parent = Path(output_path).parent
    for f in parent.iterdir():
        if f.stem == base and f.is_file():
            return str(f)
    # Fallback: assume the output_path is correct
    if os.path.exists(output_path):
        return output_path
    print(f"  ⚠️  Downloaded but file not found at {output_path}")
    return None


def upload_to_r2(file_path: str, chapter_id: str) -> dict:
    """Upload file to R2 via Wrangler and return r2_key."""
    ext = Path(file_path).suffix.lstrip(".")
    safe_name = Path(file_path).stem[:60]
    # Generate a UUID-like key
    import uuid
    key = f"book/{chapter_id}/{uuid.uuid4()}-{safe_name}.{ext}"

    print(f"  📤 Uploading to R2: {key}")
    # Detect mime type
    mime_map = {
        "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
        "webp": "image/webp", "svg": "image/svg+xml", "gif": "image/gif",
        "pdf": "application/pdf",
    }
    mime = mime_map.get(ext.lower(), "application/octet-stream")

    result = subprocess.run(
        [
            "npx", "wrangler", "r2", "object", "put", key,
            "--file", file_path,
            "--content-type", mime,
            "--remote",
        ],
        capture_output=True, text=True, encoding="utf-8"
    )
    if result.returncode != 0:
        print(f"  ❌ R2 upload failed: {result.stderr}")
        return None

    print(f"  ✅ Uploaded: {key}")
    return {"r2_key": key, "mime": mime, "filename": Path(file_path).name}


def parse_lark_xml(content: str) -> list:
    """
    Parse Lark XML content into a flat list of nodes: headings, text paragraphs, images.
    Returns list of dicts with type and content info.
    """
    nodes = []
    # Token-based patterns to split content
    # We need to handle the content sequentially

    # Pattern for block-level elements
    # h1-h5, img, p, ul/ol, pre, callout, etc.

    pos = 0
    while pos < len(content):
        # Skip to next tag
        tag_match = re.search(r'<(h[1-6]|img|p|ul|ol|pre|callout|table|hr|title)[\s>]', content[pos:])
        if not tag_match:
            break

        tag_start = pos + tag_match.start()
        tag_name = tag_match.group(1)
        tag_content_start = pos + tag_match.end()

        if tag_name in ('img',):
            # Self-closing tag
            end_match = re.search(r'/>', content[tag_content_start:])
            if end_match:
                full_tag = content[tag_start:tag_content_start + end_match.end()]
                id_m = re.search(r'id="([^"]+)"', full_tag)
                name_m = re.search(r'name="([^"]+)"', full_tag)
                src_m = re.search(r'src="([^"]+)"', full_tag)
                w_m = re.search(r'width="([^"]+)"', full_tag)
                h_m = re.search(r'height="([^"]+)"', full_tag)
                nodes.append({
                    "type": "image",
                    "id": id_m.group(1) if id_m else None,
                    "name": name_m.group(1) if name_m else "image.png",
                    "src": src_m.group(1) if src_m else None,
                    "width": int(w_m.group(1)) if w_m else None,
                    "height": int(h_m.group(1)) if h_m else None,
                })
                pos = tag_content_start + end_match.end()
                continue

        if tag_name == 'title':
            # Skip title - we already have chapter info
            end_match = re.search(r'</title>', content[tag_content_start:])
            if end_match:
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name == 'h1':
            # Skip h1 - same as title
            end_match = re.search(r'</h1>', content[tag_content_start:])
            if end_match:
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name in ('h2', 'h3', 'h4', 'h5', 'h6'):
            end_match = re.search(rf'</{tag_name}>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                id_m = re.search(r'id="([^"]+)"', content[tag_start:tag_content_start])
                text = re.sub(r'<[^>]+>', '', inner).strip()
                level = int(tag_name[1])
                nodes.append({
                    "type": "heading",
                    "level": level,
                    "id": id_m.group(1) if id_m else None,
                    "text": text,
                })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name == 'p':
            end_match = re.search(r'</p>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                id_m = re.search(r'id="([^"]+)"', content[tag_start:tag_content_start])
                # Keep some inline HTML for markdown conversion
                text = inner.strip()
                if text:
                    nodes.append({
                        "type": "text",
                        "id": id_m.group(1) if id_m else None,
                        "html": text,
                    })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name in ('ul', 'ol'):
            end_match = re.search(rf'</{tag_name}>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                id_m = re.search(r'id="([^"]+)"', content[tag_start:tag_content_start])
                text = inner.strip()
                if text:
                    nodes.append({
                        "type": "text",
                        "id": id_m.group(1) if id_m else None,
                        "html": text,
                    })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name == 'callout':
            end_match = re.search(r'</callout>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                id_m = re.search(r'id="([^"]+)"', content[tag_start:tag_content_start])
                emoji_m = re.search(r'emoji="([^"]+)"', content[tag_start:tag_content_start])
                emoji = emoji_m.group(1) if emoji_m else "💡"
                text = re.sub(r'<[^>]+>', '', inner).strip()
                if text:
                    nodes.append({
                        "type": "text",
                        "id": id_m.group(1) if id_m else None,
                        "html": f"{emoji} {text}",
                    })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name == 'pre':
            end_match = re.search(r'</pre>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                id_m = re.search(r'id="([^"]+)"', content[tag_start:tag_content_start])
                lang_m = re.search(r'lang="([^"]+)"', content[tag_start:tag_content_start])
                code_text = re.sub(r'<[^>]+>', '', inner).strip()
                lang = lang_m.group(1) if lang_m else ""
                if code_text:
                    nodes.append({
                        "type": "text",
                        "id": id_m.group(1) if id_m else None,
                        "html": f"```{lang}\n{code_text}\n```",
                    })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        if tag_name == 'hr':
            nodes.append({"type": "text", "html": "---"})
            pos = tag_content_start + 2  # skip />
            continue

        if tag_name == 'table':
            end_match = re.search(r'</table>', content[tag_content_start:])
            if end_match:
                inner = content[tag_content_start:tag_content_start + end_match.start()]
                # Convert table to markdown
                rows = re.findall(r'<tr[^>]*>(.*?)</tr>', inner, re.DOTALL)
                if rows:
                    table_lines = []
                    for i, row in enumerate(rows):
                        cells = re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.DOTALL)
                        clean_cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
                        if clean_cells:
                            table_lines.append("| " + " | ".join(clean_cells) + " |")
                            if i == 0:
                                table_lines.append("| " + " | ".join(["---"] * len(clean_cells)) + " |")
                    nodes.append({
                        "type": "text",
                        "html": "\n".join(table_lines),
                    })
                pos = tag_content_start + end_match.end()
            else:
                pos = tag_content_start
            continue

        # Unknown tag, skip past it
        pos = tag_content_start

    return nodes


def html_to_markdown(html: str) -> str:
    """Convert Lark HTML-ish content to markdown."""
    text = html
    # Bold
    text = re.sub(r'<b>(.*?)</b>', r'**\1**', text, flags=re.DOTALL)
    text = re.sub(r'<strong>(.*?)</strong>', r'**\1**', text, flags=re.DOTALL)
    # Italic
    text = re.sub(r'<em>(.*?)</em>', r'*\1*', text, flags=re.DOTALL)
    # Links
    text = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.DOTALL)
    # Inline code
    text = re.sub(r'<code>(.*?)</code>', r'`\1`', text, flags=re.DOTALL)
    # Span with text-color - just keep text
    text = re.sub(r'<span[^>]*>(.*?)</span>', r'\1', text, flags=re.DOTALL)
    # List items
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1', text, flags=re.DOTALL)
    text = re.sub(r'<ul[^>]*>\s*', '', text)
    text = re.sub(r'</ul>\s*', '', text)
    text = re.sub(r'<ol[^>]*>\s*', '', text)
    text = re.sub(r'</ol>\s*', '', text)
    # Line breaks
    text = re.sub(r'<br\s*/?>', '\n', text)
    # Remove remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    # Clean up whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    return text


def build_section_tree(nodes: list) -> list:
    """
    Build a hierarchical section tree from flat nodes.
    Returns sections with their nested content blocks.
    """
    sections = []
    current_section = None
    current_content = []

    for node in nodes:
        if node["type"] == "heading" and node["level"] in (2, 3, 4, 5):
            # Save previous section content
            if current_section:
                current_section["content"] = current_content
                sections.append(current_section)
                current_content = []

            current_section = {
                "level": node["level"],
                "text": node["text"],
                "id": node["id"],
                "content": [],
            }
        elif current_section is not None:
            current_content.append(node)
        # Content before first heading goes into preamble

    # Save last section
    if current_section:
        current_section["content"] = current_content
        sections.append(current_section)

    return sections


def slugify(text: str) -> str:
    """Create URL-friendly slug from text."""
    import unicodedata
    # Normalize unicode
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')[:80]


def generate_sql(chapter_id: str, tier: int, chapter_no: int, title: str,
                 description: str, sections: list, image_uploads: dict) -> str:
    """Generate SQL INSERT statements."""
    now = datetime.now(timezone.utc).isoformat()
    sql_parts = []

    # Chapter
    sql_parts.append(
        f"INSERT OR IGNORE INTO chapter (id, tier, chapter_no, title, description, `order`, status, createdAt, updatedAt) "
        f"VALUES ('{chapter_id}', {tier}, {chapter_no}, '{title.replace(chr(39), chr(39)+chr(39))}', "
        f"'{description.replace(chr(39), chr(39)+chr(39))}', {chapter_no}, 'draft', '{now}', '{now}');"
    )

    import uuid

    def new_uuid():
        return str(uuid.uuid4())

    section_order = 0
    block_order = 0

    for sec in sections:
        section_id = new_uuid()
        sec_level = min(sec["level"], 3)  # DB only supports level 2 or 3
        db_level = 2 if sec["level"] == 2 else 3
        slug = slugify(sec["text"])

        # Parent mapping: h3's parent is the preceding h2, h4/h5's parent is preceding h3
        parent_id = "NULL"

        sql_parts.append(
            f"INSERT OR IGNORE INTO section (id, chapter_id, parent_id, level, title, slug, `order`, keywords) "
            f"VALUES ('{section_id}', '{chapter_id}', {parent_id}, {db_level}, "
            f"'{sec['text'].replace(chr(39), chr(39)+chr(39))}', '{slug}', {section_order}, '[]');"
        )
        section_order += 1

        # Content blocks for this section
        for content_node in sec.get("content", []):
            if content_node["type"] == "text":
                md = html_to_markdown(content_node["html"])
                if md.strip():
                    # Escape for SQL
                    md_escaped = md.replace("'", "''").replace("\\", "\\\\")
                    block_id = new_uuid()
                    sql_parts.append(
                        f"INSERT OR IGNORE INTO block (id, section_id, `order`, type, text_md, r2_key, filename, mime, alt, caption) "
                        f"VALUES ('{block_id}', '{section_id}', {block_order}, 'text', "
                        f"'{md_escaped}', NULL, NULL, NULL, NULL, NULL);"
                    )
                    block_order += 1

            elif content_node["type"] == "image":
                src = content_node.get("src")
                if src and src in image_uploads:
                    upload = image_uploads[src]
                    block_id = new_uuid()
                    sql_parts.append(
                        f"INSERT OR IGNORE INTO block (id, section_id, `order`, type, text_md, r2_key, filename, mime, alt, caption) "
                        f"VALUES ('{block_id}', '{section_id}', {block_order}, 'image', "
                        f"NULL, '{upload['r2_key']}', '{upload['filename']}', '{upload['mime']}', "
                        f"'{content_node.get('name', 'image')}', NULL);"
                    )
                    block_order += 1
                elif src:
                    print(f"  ⚠️  Image {src} not found in uploads, skipping block")

    return "\n".join(sql_parts)


def main():
    parser = argparse.ArgumentParser(description="Import Lark doc to DentalEmpireOS D1")
    parser.add_argument("--doc-token", required=True, help="Lark document token or URL")
    parser.add_argument("--tier", type=int, required=True, choices=[1, 2, 3], help="Book tier")
    parser.add_argument("--chapter-no", type=int, required=True, help="Chapter number")
    parser.add_argument("--chapter-id", required=True, help="Chapter ID (slug)")
    parser.add_argument("--chapter-title", required=True, help="Chapter title")
    parser.add_argument("--description", default="", help="Chapter description")
    parser.add_argument("--no-images", action="store_true", help="Skip image download/upload")
    parser.add_argument("--sql-only", action="store_true", help="Only generate SQL, don't execute")
    parser.add_argument("--execute", action="store_true", help="Execute SQL on D1 (remote)")
    parser.add_argument("--execute-local", action="store_true", help="Execute SQL on D1 (local)")
    parser.add_argument("--output", default=None, help="Output SQL file path")

    args = parser.parse_args()

    # Step 1: Fetch doc
    content = fetch_lark_doc(args.doc_token)

    # Step 2: Parse structure
    print("\n📋 Parsing document structure...")
    nodes = parse_lark_xml(content)

    headings = [n for n in nodes if n["type"] == "heading"]
    images = [n for n in nodes if n["type"] == "image"]
    print(f"  Found {len(headings)} headings, {len(images)} images")

    # Step 3: Build section tree
    sections = build_section_tree(nodes)
    print(f"  Built {len(sections)} sections")

    # Step 4: Download and upload images
    image_uploads = {}
    if not args.no_images and images:
        print(f"\n🖼️  Processing {len(images)} images...")
        tmp_dir = Path(f"tmp/lark-import/{args.chapter_id}")
        tmp_dir.mkdir(parents=True, exist_ok=True)

        for i, img in enumerate(images):
            src = img.get("src")
            if not src:
                print(f"  ⚠️  Image {img['id']} has no src token, skipping")
                continue

            print(f"  [{i+1}/{len(images)}] Downloading {img.get('name', 'image')} (src={src})...")
            local_path = str(tmp_dir / f"img_{i+1}")
            downloaded = download_lark_image(src, local_path)

            if downloaded:
                upload = upload_to_r2(downloaded, args.chapter_id)
                if upload:
                    image_uploads[src] = upload

            # Small delay to avoid rate limiting
            time.sleep(0.3)

        print(f"  ✅ Uploaded {len(image_uploads)}/{len(images)} images to R2")

    # Step 5: Generate SQL
    print(f"\n📝 Generating SQL migration...")
    sql = generate_sql(
        chapter_id=args.chapter_id,
        tier=args.tier,
        chapter_no=args.chapter_no,
        title=args.chapter_title,
        description=args.description,
        sections=sections,
        image_uploads=image_uploads,
    )

    # Step 6: Write SQL file
    if args.output:
        output_path = args.output
    else:
        output_path = f"migrations/import-{args.chapter_id}.sql"

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(sql + "\n")
    print(f"  ✅ SQL written to {output_path} ({len(sql)} chars, {sql.count('INSERT')} statements)")

    # Step 7: Execute on D1
    if args.execute or args.execute_local:
        flag = "--remote" if args.execute else "--local"
        print(f"\n🚀 Executing SQL on D1 ({flag})...")
        result = subprocess.run(
            ["npx", "wrangler", "d1", "execute", "DB", flag, "--file", output_path],
            capture_output=True, text=True, encoding="utf-8"
        )
        if result.returncode == 0:
            print("  ✅ SQL executed successfully!")
            print(result.stdout[-500:] if len(result.stdout) > 500 else result.stdout)
        else:
            print(f"  ❌ Execution failed:")
            print(result.stderr)
            sys.exit(1)

    print(f"\n🎉 Import complete!")
    print(f"  Chapter: {args.chapter_title} (Tier {args.tier}, #{args.chapter_no})")
    print(f"  Sections: {len(sections)}")
    print(f"  Images: {len(image_uploads)}")
    print(f"  SQL: {output_path}")


if __name__ == "__main__":
    main()
