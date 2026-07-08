-- Check early scanners (batch 1-2) for missing diacritics
SELECT sq.question_id, sq.scale_labels_vi
FROM survey_question sq
JOIN survey_section ss ON sq.section_id = ss.id
JOIN survey_definition sd ON ss.survey_id = sd.id
WHERE sq.type = 'select'
  AND sq.scale_labels_vi IS NOT NULL
  AND sq.scale_labels_vi != 'null'
  AND sd.order_index <= 22
ORDER BY sd.order_index
LIMIT 5;
