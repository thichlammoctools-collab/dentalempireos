-- Fix chapter_refs: only update scanners that are currently WRONG
-- (Already correct ones: Ch.1-10 batches, Ch.22, Ch.29, Ch.16, Ch.15, Ch.3, Ch.32)

-- STARTUP → Ch.23 STRATEGY OS (startup = positioning + strategy)
UPDATE survey_definition SET chapter_refs = '["Ch.23"]' WHERE slug = 'startup-check';

-- CLOUDS → Ch.13 GROWTH ENGINE (content funnel = growth acquisition)
UPDATE survey_definition SET chapter_refs = '["Ch.13"]' WHERE slug = 'content-funnel-check';

-- REFERRAL → Ch.17 REFERRAL ECOSYSTEM
UPDATE survey_definition SET chapter_refs = '["Ch.17"]' WHERE slug = 'referral-check';

-- METRICS → Ch.31 DATA OS (do-luong = metrics)
UPDATE survey_definition SET chapter_refs = '["Ch.31"]' WHERE slug = 'do-luong-check';

-- SUPPLY → Ch.26 CLINIC OS (kho-vat-tu = clinic operations)
UPDATE survey_definition SET chapter_refs = '["Ch.26"]' WHERE slug = 'kho-vat-tu-check';

-- LINHHON → Ch.20 THE DENTAL OS FLYWHEEL ENGINE (linh hồn = sứ mệnh, tầm nhìn)
UPDATE survey_definition SET chapter_refs = '["Ch.20"]' WHERE slug = 'linh-hon-check';

-- PATIENT → Ch.18 PATIENT COMMUNITY (chu thể hóa → patient agency → community)
UPDATE survey_definition SET chapter_refs = '["Ch.18"]' WHERE slug = 'chu-the-hoa-check';

-- REFLECTION → Ch.19 EDUCATION & PRODUCT (case reflection = clinical learning)
UPDATE survey_definition SET chapter_refs = '["Ch.19"]' WHERE slug = 'case-reflection-check';

-- ENERGY → Ch.14 TRUST ASSETS (năng lượng cá nhân → personal trust assets)
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'nang-luong-check';

-- DIGITAL → Ch.13 GROWTH ENGINE (số hóa = digital transformation)
UPDATE survey_definition SET chapter_refs = '["Ch.13"]' WHERE slug = 'so-hoa-check';

-- BRAND scanners → Ch.24 MARKETING OS
UPDATE survey_definition SET chapter_refs = '["Ch.24"]' WHERE slug = 'marketing-content-check';
UPDATE survey_definition SET chapter_refs = '["Ch.24"]' WHERE slug = 'marketing-online-check';

-- Ch.SYSTEM → Ch.25 SALES OS (hiệu quả vận hành + sales)
UPDATE survey_definition SET chapter_refs = '["Ch.25"]' WHERE slug = 'hieu-qua-check';
UPDATE survey_definition SET chapter_refs = '["Ch.25"]' WHERE slug = 'tu-van-ban-hang-check';

-- Ch.SYSTEM → Ch.12 CLINIC SYSTEM (cơ sở vật chất)
UPDATE survey_definition SET chapter_refs = '["Ch.12"]' WHERE slug = 'co-so-vat-chat-check';

-- Ch.STARTUP → Ch.14 TRUST ASSETS (vị trí cạnh tranh + lợi nhuận)
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'loi-nhu-quan-check';
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'thu-vi-tri-check';

-- Ch.STARTUP → Ch.20 (thích ứng = org learning → flywheel engine)
UPDATE survey_definition SET chapter_refs = '["Ch.20"]' WHERE slug = 'thich-ung-dung-check';
