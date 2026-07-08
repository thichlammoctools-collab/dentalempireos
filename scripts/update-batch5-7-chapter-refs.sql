-- Update chapter_refs for batch 5-7 scanners (orders 33-39)

-- 33: kpi-check → Ch.31 DATA OS (KPI = đo lường dữ liệu)
UPDATE survey_definition SET chapter_refs = '["Ch.31"]' WHERE slug = 'kpi-check';

-- 34: os-maturity-check → Ch.22 EMPIRE OS (maturity đánh giá mức độ OS)
UPDATE survey_definition SET chapter_refs = '["Ch.22"]' WHERE slug = 'os-maturity-check';

-- 35: dao-tao-check → Ch.29 PEOPLE OS (đào tạo nhân sự)
UPDATE survey_definition SET chapter_refs = '["Ch.29"]' WHERE slug = 'dao-tao-check';

-- 36: patient-experience-check → Ch.16 PATIENT EXPERIENCE
UPDATE survey_definition SET chapter_refs = '["Ch.16"]' WHERE slug = 'patient-experience-check';

-- 37: crm-check → Ch.15 CUSTOMER JOURNEY (CRM gắn với hành trình khách hàng)
UPDATE survey_definition SET chapter_refs = '["Ch.15"]' WHERE slug = 'crm-check';

-- 38: roadmap-check → Ch.3 R.O.A.D.M.A.P TO THE SKY
UPDATE survey_definition SET chapter_refs = '["Ch.3"]' WHERE slug = 'roadmap-check';

-- 39: total-os-diagnostic → Ch.32 TỔNG KẾT TẦNG 3
UPDATE survey_definition SET chapter_refs = '["Ch.32"]' WHERE slug = 'total-os-diagnostic';
