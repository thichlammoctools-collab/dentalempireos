UPDATE "survey_definition"
SET "title_vi" = 'Tư duy Kinh doanh Check',
    "translations_vi" = REPLACE(
      "translations_vi",
      'Lời Như Quản Check',
      'Tư duy Kinh doanh Check'
    ),
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'loi-nhu-quan-check';
