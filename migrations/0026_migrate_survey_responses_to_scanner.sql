-- Migration 0026: Migrate data from old survey_responses to scanner_response.
-- Converts column-per-question rows to generic JSON responses_json + scores_json.
-- Also updates the ai_application row and product app_id link.
-- This is a one-time migration — run after seeding the "ho-so-goc-re" definition.

-- Migrate responses (skip if scanner_response already has rows for this survey)
INSERT OR IGNORE INTO "scanner_response"
  ("survey_id","created_at","lang","owner_name","clinic_name","clinic_address","email",
   "years_in_operation","staff_count","responses_json","scores_json","ai_analysis","ai_analyzed_at")
SELECT
  'ho-so-goc-re' AS "survey_id",
  "created_at","lang","owner_name","clinic_name","clinic_address","email",
  "years_in_operation","staff_count",
  json_object(
    'roots_q1',"roots_q1",'roots_q2',"roots_q2",'roots_q3',"roots_q3",'roots_q4',"roots_q4",
    'roots_d1',"roots_d1",'roots_d2',"roots_d2",'roots_d3',"roots_d3",'roots_q4_choice',"roots_q4_choice",
    'sky_sin_open',"sky_sin_open",'sky_s_d1',"sky_s_d1",'sky_s_d2',"sky_s_d2",
    'sky_k_open',"sky_k_open",'sky_k_d1',"sky_k_d1",'sky_k_d2',"sky_k_d2",
    'sky_y_open',"sky_y_open",'sky_y_d1',"sky_y_d1",'sky_y_d2',"sky_y_d2",
    'stars_s_d',"stars_s_d",'stars_s_open',"stars_s_open",'stars_t_d',"stars_t_d",'stars_t_open',"stars_t_open",
    'stars_a_d',"stars_a_d",'stars_a_open',"stars_a_open",'stars_r_d',"stars_r_d",
    'stars_syn_choice',"stars_syn_choice",'stars_syn_d',"stars_syn_d",'stars_syn_open',"stars_syn_open",
    'living_o1',"living_o1",'living_o2',"living_o2",
    'living_d1',"living_d1",'living_d2',"living_d2",'living_d3',"living_d3",'living_d4',"living_d4",
    'future_o1',"future_o1",'future_o2',"future_o2",'future_o3',"future_o3",
    'commit_o1',"commit_o1",'commit_o2',"commit_o2",'commit_choice',"commit_choice",'signature',"signature"
  ) AS "responses_json",
  json_object(
    'roots',"score_roots",'sky',"score_sky",'stars',"score_stars",'living',"score_living",'total',"score_total"
  ) AS "scores_json",
  "ai_analysis","ai_analyzed_at"
FROM "survey_responses"
WHERE NOT EXISTS (
  SELECT 1 FROM "scanner_response" WHERE "survey_id" = 'ho-so-goc-re'
);

-- Update ai_application row to point to the new survey_definition id
UPDATE "ai_application" SET
  "name" = 'Hồ Sơ Gốc Rễ',
  "slug" = 'ho-so-goc-re',
  "status" = 'active',
  "updated_at" = datetime('now')
WHERE "id" = 'survey-rootsgoc-1-app';

-- Link product rows to the new ai_application
UPDATE "product" SET
  "app_id" = 'survey-rootsgoc-1-app'
WHERE "id" LIKE 'survey-rootsgoc%'
  AND ("app_id" IS NULL OR app_id = '');