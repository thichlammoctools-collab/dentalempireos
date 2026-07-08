-- Comprehensive check: all Vietnamese text fields missing diacritics
SELECT
  sq.question_id,
  sq.label_vi,
  sq.scale_labels_vi
FROM survey_question sq
JOIN survey_section ss ON sq.section_id = ss.id
JOIN survey_definition sd ON ss.survey_id = sd.id
WHERE (
  (sq.type = 'select' AND sq.scale_labels_vi NOT LIKE '%ă%' AND sq.scale_labels_vi NOT LIKE '%â%' AND sq.scale_labels_vi NOT LIKE '%ô%' AND sq.scale_labels_vi NOT LIKE '%ơ%' AND sq.scale_labels_vi NOT LIKE '%ư%' AND sq.scale_labels_vi NOT LIKE '%đ%')
  OR (sq.label_vi NOT LIKE '%ă%' AND sq.label_vi NOT LIKE '%â%' AND sq.label_vi NOT LIKE '%ô%' AND sq.label_vi NOT LIKE '%ơ%' AND sq.label_vi NOT LIKE '%ư%' AND sq.label_vi NOT LIKE '%đ%')
)
ORDER BY sd.order_index, ss.order_idx, sq.order_idx;
