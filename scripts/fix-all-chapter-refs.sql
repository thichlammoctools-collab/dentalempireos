-- Re-map ALL chapter_refs to match actual book chapter structure
-- Based on scanner content vs book chapter themes

-- Batch 1 (Ch.1-8): mostly correct, only update what changed
UPDATE survey_definition SET chapter_refs = '["Ch.8"]' WHERE slug = 'cskh-check'; -- CSKH = Bức Tranh Toàn Cảnh

-- Batch 2 (Ch.9-14): major re-mapping
UPDATE survey_definition SET chapter_refs = '["Ch.9"]' WHERE slug = 'van-hoa-check'; -- Văn hóa = EMPIRE FLYWHEEL
UPDATE survey_definition SET chapter_refs = '["Ch.10"]' WHERE slug = 'phan-biet-thuong-hieu-check'; -- Brand positioning = PERSONAL BRAND
UPDATE survey_definition SET chapter_refs = '["Ch.10"]' WHERE slug = 'thuong-hieu-ca-nhan-check'; -- Personal brand = PERSONAL BRAND

-- Ch.MỚI → Ch.23 STRATEGY OS (startup = positioning + strategy)
UPDATE survey_definition SET chapter_refs = '["Ch.23"]' WHERE slug = 'startup-check';

-- Ch.CLOUDS → Ch.13 GROWTH ENGINE (content funnel = growth acquisition)
UPDATE survey_definition SET chapter_refs = '["Ch.13"]' WHERE slug = 'content-funnel-check';

-- Ch.REFERRAL → Ch.17 REFERRAL ECOSYSTEM
UPDATE survey_definition SET chapter_refs = '["Ch.17"]' WHERE slug = 'referral-check';

-- Ch.METRICS → Ch.31 DATA OS (do-luong = metrics)
UPDATE survey_definition SET chapter_refs = '["Ch.31"]' WHERE slug = 'do-luong-check';

-- Ch.SUPPLY → Ch.26 CLINIC OS (kho-vat-tu = clinic operations)
UPDATE survey_definition SET chapter_refs = '["Ch.26"]' WHERE slug = 'kho-vat-tu-check';

-- Ch.LINHHON → Ch.20 THE DENTAL OS FLYWHEEL ENGINE (linh hồn = sứ mệnh, tầm nhìn)
UPDATE survey_definition SET chapter_refs = '["Ch.20"]' WHERE slug = 'linh-hon-check';

-- Ch.PATIENT → Ch.18 PATIENT COMMUNITY (chu thể hóa = patient agency → community)
UPDATE survey_definition SET chapter_refs = '["Ch.18"]' WHERE slug = 'chu-the-hoa-check';

-- Ch.REFLECTION → Ch.19 EDUCATION & PRODUCT (case reflection = clinical learning)
UPDATE survey_definition SET chapter_refs = '["Ch.19"]' WHERE slug = 'case-reflection-check';

-- Ch.ENERGY → Ch.14 TRUST ASSETS (năng lượng cá nhân → trust)
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'nang-luong-check';

-- Ch.DIGITAL → Ch.13 GROWTH ENGINE (số hóa = digital transformation → growth)
UPDATE survey_definition SET chapter_refs = '["Ch.13"]' WHERE slug = 'so-hoa-check';

-- Ch.BRAND → Ch.24 MARKETING OS (5 scanners về brand content/marketing)
UPDATE survey_definition SET chapter_refs = '["Ch.24"]' WHERE slug = 'marketing-content-check';
UPDATE survey_definition SET chapter_refs = '["Ch.24"]' WHERE slug = 'marketing-online-check';

-- Ch.STARTUP → Ch.14 TRUST ASSETS (3 scanners: competitive positioning → trust)
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'loi-nhu-quan-check';
UPDATE survey_definition SET chapter_refs = '["Ch.14"]' WHERE slug = 'thu-vi-tri-check';

-- Ch.STARTUP → Ch.20 THE DENTAL OS FLYWHEEL ENGINE (adaptability → org learning)
UPDATE survey_definition SET chapter_refs = '["Ch.20"]' WHERE slug = 'thich-ung-dung-check';

-- Ch.SYSTEM → Ch.25 SALES OS (2 scanners: operational efficiency + sales)
UPDATE survey_definition SET chapter_refs = '["Ch.25"]' WHERE slug = 'hieu-qua-check';
UPDATE survey_definition SET chapter_refs = '["Ch.25"]' WHERE slug = 'tu-van-ban-hang-check';

-- Ch.SYSTEM → Ch.12 CLINIC SYSTEM (cơ sở vật chất = clinic infrastructure)
UPDATE survey_definition SET chapter_refs = '["Ch.12"]' WHERE slug = 'co-so-vat-chat-check';

-- Ch.CSKH → Ch.25 SALES OS (tư vấn bán hàng)
-- Note: cskh-check already at Ch.8, tu-van-ban-hang-check already updated above
