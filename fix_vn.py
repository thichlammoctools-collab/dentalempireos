#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix Vietnamese typos in seed files using byte-level replacement.
Safe: replaces wrong bytes with correct bytes.
"""
import glob, os, sys

FIXES = [
    # 1. khuy + ờ (U+1EBF=0x6F) -> khuyến (ế = U+1EBF=0x6E)
    # ờ = E1 BA BF, ế = E1 BA BE
    (b'khuy\xe1\xba\xbf', b'khuy\xe1\xba\xbe', 'khuyờ->khuyến'),
    # 2. d + ý (U+00FD=C3BD) -> d + ự (U+1EF1=E1 BBB1)
    # dý = 64 C3 BD, dự = 64 E1 BB B1
    (b'd\xc3\xbd', b'd\xe1\xbb\xb1', 'dý->dự'),
]

# Special: fix ấộ -> ấậ (wrong ộ after ậ)
# ấộ = E1 BA 95 E1 BB 95 (wrong: second char should be ậ=U+1ECB=E1 BB 8B)
# ấậ = E1 BA 95 E1 BB 8B (correct)
wrong_aaoo = b'\xe1\xba\x95\xe1\xbb\x95'  # ấộ
correct_aaoo = b'\xe1\xba\x95\xe1\xbb\x8b'  # ấậ
# Only replace when it's "cấộ" or "tậộ" context
# But "tậộ" is not a word. The issue is "cấộ" in "cấp" (wrong U+1ED5=ộ)
# Actually: cấp(correct) = c + ấ + p = 63 E1 BA 95 70
# cấộ(wrong) = c + ấ + ộ + p = 63 E1 BA 95 E1 BB 95 70
wrong_capop = b'\xe1\xba\x95\xe1\xbb\x95\x70'  # ấộp
correct_capop = b'\xe1\xba\x95\xe1\xbb\x8b\x70'  # ấập

seed_files = glob.glob('src/data/seeds/*.ts')

for fpath in sorted(seed_files):
    with open(fpath, 'rb') as f:
        data = f.read()

    original = data
    changes = []

    for wrong, correct, desc in FIXES:
        if wrong in data:
            count = data.count(wrong)
            data = data.replace(wrong, correct)
            changes.append(f'{count}x {desc}')

    # Fix ấộp -> ấập
    if wrong_capop in data:
        count = data.count(wrong_capop)
        data = data.replace(wrong_capop, correct_capop)
        changes.append(f'{count}x ấộp->ấập')

    if changes:
        with open(fpath, 'wb') as f:
            f.write(data)
        sys.stderr.write(f'FIXED: {os.path.basename(fpath)}: {", ".join(changes)}\n')

sys.stderr.write(f'\nDone.\n')
