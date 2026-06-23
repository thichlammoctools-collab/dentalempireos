-- Survey: Hồ Sơ Gốc Rễ (Roots Profile)
-- Intake self-assessment for dental clinic consulting.
-- Public — no auth required. AI analysis stored in ai_analysis column.

CREATE TABLE IF NOT EXISTS "survey_responses" (
  "id"               integer PRIMARY KEY AUTOINCREMENT,
  "created_at"       text NOT NULL DEFAULT (datetime('now')),
  "lang"             text NOT NULL DEFAULT 'vi',

  -- Lead info
  "owner_name"       text,
  "clinic_name"      text,
  "clinic_address"   text,
  "email"            text,
  "years_in_operation" integer,
  "staff_count"      integer,

  -- === PART 1: ROOTS (Ch.26) ===
  "roots_q1"         text,       -- "Nếu PK không còn tồn tại..." (open)
  "roots_q2"         text,       -- "PK sinh ra để phụng sự gì?" (open)
  "roots_q3"         text,       -- "3 giá trị không bao giờ được đánh đổi" (open)
  "roots_q4"         text,       -- "Tình huống đứng vững giá trị" (open)
  "roots_d1"         integer,    -- 1-5: Viết rõ tầm nhìn trong 1 câu
  "roots_d2"         integer,    -- 1-5: NV hiểu & thể hiện 3 giá trị
  "roots_d3"         integer,    -- 1-5: QĐ hàng ngày nhất quán vs giá trị
  "roots_q4_choice"  text,       -- Multiple choice: when profit vs values conflict

  -- === PART 2: SKY (Ch.24) — Sincerity ===
  "sky_sin_open"     text,       -- "VD từ chối dịch vụ vì lý do chân thành"
  "sky_s_d1"         integer,    -- 1-5: Tư vấn đúng khi không cần thêm DV
  "sky_s_d2"         integer,    -- 1-5: NV dám nói thật với BN

  -- === PART 2: SKY — Kindness ===
  "sky_k_open"       text,       -- "BN mô tả cảm giác khi ra khỏi ghế?"
  "sky_k_d1"         integer,    -- 1-5: NV quan tâm cảm xúc BN
  "sky_k_d2"         integer,    -- 1-5: Quan tâm sức khỏe TT & phát triển NV

  -- === PART 2: SKY — Yielding ===
  "sky_y_open"       text,       -- "Lần gần nhất thừa nhận mình sai..."
  "sky_y_d1"         integer,    -- 1-5: Lắng nghe phản hồi quy trình
  "sky_y_d2"         integer,    -- 1-5: Dễ thay đổi khi có thông tin mới

  -- === PART 3: S.T.A.R.S (Ch.25) ===
  "stars_s_d"        integer,    -- Skills: 1-5
  "stars_s_open"     text,       -- "Ai đúng giá trị nhất? Ai cần phát triển?"
  "stars_t_d"        integer,    -- Traits: 1-5
  "stars_t_open"     text,       -- "VD đội ngũ hành động đúng dù áp lực"
  "stars_a_d"        integer,    -- Actions: 1-5
  "stars_a_open"     text,       -- "VD团队 hành động đúng dưới áp lực lớn" (optional)

  -- === PART 3: S.T.A.R.S — Results & Synergy ===
  "stars_r_d"        integer,    -- Results: 1-5
  "stars_syn_choice" text,       -- Multiple choice: synergy level
  "stars_syn_d"      integer,    -- Synergy: 1-5
  "stars_syn_open"   text,       -- "Nếu chỉ đào tạo thêm 1 kỹ năng..."

  -- === PART 4: Living System (Ch.22) ===
  "living_o1"        text,       -- "PK gần 'hệ thống sống' hay 'cỗ máy' hơn?"
  "living_o2"        text,       -- "Điều gì đang sống tốt nhất / yếu nhất?"
  "living_d1"        integer,    -- 1-5: Cơ chế tự học hỏi
  "living_d2"        integer,    -- 1-5: Dữ liệu phi tài chính dùng QĐ
  "living_d3"        integer,    -- 1-5: NV an toàn để báo lỗi / ý kiến
  "living_d4"        integer,    -- 1-5: Mối quan hệ BS-đội đang trưởng thành

  -- === PART 5: Future Potential ===
  "future_o1"        text,       -- "3 năm tới, PK sẽ ở đâu?"
  "future_o2"        text,       -- "Áp lực lớn nhất hiện tại?"
  "future_o3"        text,       -- "Điều đã thử nhiều lần chưa thành công?"

  -- === PART 6: Commitment ===
  "commit_o1"        text,       -- "Sẵn sàng nhìn thấy điều không dễ chịu?"
  "commit_o2"        text,       -- "1 điều nhỏ có thể làm ngay?"
  "commit_choice"    text,       -- Multiple choice: commitment level
  "signature"        text,

  -- === Computed Scores ===
  "score_roots"      real,
  "score_sky"        real,
  "score_stars"      real,
  "score_living"     real,
  "score_total"      real,

  -- === AI Analysis ===
  "ai_analysis"      text,       -- markdown from Claude API
  "ai_analyzed_at"   text
);

CREATE INDEX IF NOT EXISTS idx_survey_created ON "survey_responses" ("created_at");
CREATE INDEX IF NOT EXISTS idx_survey_email   ON "survey_responses" ("email");
