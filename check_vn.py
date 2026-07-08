#!/usr/bin/env python3
# Check for specific Vietnamese typos in seed files
import glob, os, sys

for fname in glob.glob('src/data/seeds/*.ts'):
    with open(fname, 'rb') as f:
        data = f.read()

    fn = os.path.basename(fname)

    # 1. cấp (cập): c + ậ + p = 63 E1 BB 8B 70 (U+1ECB)
    # cấp: c + ấ + p = 63 E1 BA 95 70 (U+1EA5)
    # cập (wrong o): c + ộ + p = 63 E1 BB 95 70 (U+1ED5)
    wrong_cap_o = b'c\xe1\xbb\x95p'  # cập with ộ
    if wrong_cap_o in data:
        pos = data.find(wrong_cap_o)
        ctx = data[max(0,pos-30):pos+40].decode('utf-8', errors='replace')
        sys.stderr.write(f'{fn}: cập(wrong o) at {pos}: {ctx}\n')

    # 2. dự báo: d + ự (U+1EF1) = d E1 BB B1
    # dý: d + ý (U+00FD) = d C3 BD
    wrong_du = b'd\xc3\xbd'  # dý
    correct_du = b'd\xe1\xbb\xb1'  # dự
    if wrong_du in data:
        pos = data.find(wrong_du)
        ctx = data[max(0,pos-15):pos+20].decode('utf-8', errors='replace')
        sys.stderr.write(f'{fn}: dý(wrong) at {pos}: {ctx}\n')

    # 3. khuyến khích: check second occurrence
    # khuyế = khuy + ế (U+1EBF) = 6b 68 75 79 e1 ba be
    # We fixed this already (e1babe already correct)
    # But also check: khuy + ệ (U+1EC7) = e1 ba 87
    # ệ = E1 BA 87
    khuyen_ekh = b'khuy\xe1\xba\x87'  # khuy + ệ (U+1EC7)
    if khuyen_ekh in data:
        pos = data.find(khuyen_ekh)
        ctx = data[max(0,pos-10):pos+20].decode('utf-8', errors='replace')
        sys.stderr.write(f'{fn}: khuyệ at {pos}: {ctx}\n')

    # 4. tập trung vs tập trung
    # tập = t + ậ + p = 74 E1 BB 8B 70
    # tập = t + ấ + p = 74 E1 BA 95 70
    wrong_tap = b'\xe1\xbb\x8b\xe1\xbb\x95'  # ậộ (wrong)
    correct_tap = b'\xe1\xbb\x8b\xe1\xbb\x8b'  # ậậ (wrong too)
    correct_tap2 = b'\xe1\xba\x95\xe1\xbb\x8b'  # ấậ (correct: tập)

    # Just check if the word "tập" appears correctly
    # tập = 74 e1 bb 8b 70
    tap_wrong = b'\x74\xe1\xbb\x8b\x74'  # tật (wrong)
    # Don't over-fix, just report

sys.stderr.write('Check done\n')
