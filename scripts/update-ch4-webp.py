#!/usr/bin/env python3
"""Generate UPDATE SQL to convert chapter 4 images from PNG to WebP."""
import subprocess, json, uuid, sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Get image blocks — extract JSON portion from wrangler output
result = subprocess.run(
    ["npx", "wrangler", "d1", "execute", "DB", "--remote", "--config", "wrangler.jsonc", "--command",
     "SELECT id FROM block WHERE section_id IN (SELECT id FROM section WHERE chapter_id='04-ky-nang-ca-nhan') AND type='image' ORDER BY \"order\""],
    shell=True, capture_output=True, text=True, encoding="utf-8", timeout=30,
)
# Find JSON array start
json_start = result.stdout.find('[')
raw = result.stdout[json_start:] if json_start != -1 else result.stdout
data = json.loads(raw)
blocks = data[0]["results"] if isinstance(data, list) and len(data) > 0 else []
print(f"Found {len(blocks)} image blocks", file=sys.stderr)

# Generate new R2 keys and SQL
sql_lines = []
for i, block in enumerate(blocks, 1):
    uid = str(uuid.uuid4())
    new_r2 = f"book/04-ky-nang-ca-nhan/{uid}-ch4-img{i:02d}.webp"
    sql_lines.append(f"UPDATE block SET r2_key='{new_r2}', mime='image/webp', filename='image.webp' WHERE id='{block['id']}';")

sql = "\n".join(sql_lines)
out_file = "migrations/update-ch4-webp.sql"
Path(out_file).write_text(sql, encoding="utf-8")
print(f"Written {len(sql_lines)} UPDATE statements to {out_file}", file=sys.stderr)
