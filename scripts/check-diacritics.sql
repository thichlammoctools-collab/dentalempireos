-- Check questions with missing diacritics in scale_labels_vi
SELECT
  sq.question_id,
  sq.label_vi,
  sq.scale_labels_vi
FROM survey_question sq
JOIN survey_section ss ON sq.section_id = ss.id
JOIN survey_definition sd ON ss.survey_id = sd.id
WHERE sq.type = 'select'
  AND sq.scale_labels_vi IS NOT NULL
  AND sq.scale_labels_vi != 'null'
  AND sq.scale_labels_vi NOT LIKE '%ă%'
  AND sq.scale_labels_vi NOT LIKE '%â%'
  AND sq.scale_labels_vi NOT LIKE '%ô%'
  AND sq.scale_labels_vi NOT LIKE '%ơ%'
  AND sq.scale_labels_vi NOT LIKE '%ư%'
  AND sq.scale_labels_vi NOT LIKE '%đ%'
  AND sq.scale_labels_vi NOT LIKE '%ế%'
  AND sq.scale_labels_vi NOT LIKE '%ố%'
  AND sq.scale_labels_vi NOT LIKE '%ồ%'
  AND sq.scale_labels_vi NOT LIKE '%ờ%'
  AND sq.scale_labels_vi NOT LIKE '%ở%'
  AND sq.scale_labels_vi NOT LIKE '%ợ%'
  AND sq.scale_labels_vi NOT LIKE '%ạ%'
  AND sq.scale_labels_vi NOT LIKE '%ả%'
  AND sq.scale_labels_vi NOT LIKE '%ấ%'
  AND sq.scale_labels_vi NOT LIKE '%ầ%'
  AND sq.scale_labels_vi NOT LIKE '%ẩ%'
  AND sq.scale_labels_vi NOT LIKE '%ẫ%'
  AND sq.scale_labels_vi NOT LIKE '%ậ%'
  AND sq.scale_labels_vi NOT LIKE '%ể%'
  AND sq.scale_labels_vi NOT LIKE '%ệ%'
  AND sq.scale_labels_vi NOT LIKE '%ọ%'
  AND sq.scale_labels_vi NOT LIKE '%ỏ%'
  AND sq.scale_labels_vi NOT LIKE '%ớ%'
  AND sq.scale_labels_vi NOT LIKE '%ợ%'
  AND sq.scale_labels_vi NOT LIKE '%ờ%'
  AND sq.scale_labels_vi NOT LIKE '%ừ%'
  AND sq.scale_labels_vi NOT LIKE '%ứ%'
  AND sq.scale_labels_vi NOT LIKE '%ữ%'
ORDER BY sd.order_index, ss.order_idx, sq.order_idx;
