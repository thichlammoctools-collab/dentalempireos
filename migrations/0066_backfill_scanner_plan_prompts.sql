-- Ensure every existing scanner can generate its free 30-day action plan.
-- Runtime also falls back to the analysis prompt for records created outside migrations.
UPDATE survey_definition
SET ai_config = json_patch(
  COALESCE(ai_config, '{}'),
  json_object(
    'plan_prompt_vi', 'Bạn là chuyên gia tư vấn vận hành phòng khám nha khoa. Dựa trên điểm số và câu trả lời khảo sát, hãy lập kế hoạch hành động 30 ngày theo 4 tuần. Mỗi tuần có 2-3 hành động cụ thể, ưu tiên điểm yếu có tác động cao và bắt đầu tuần 1 bằng việc nhỏ nhất có thể triển khai ngay. Trả lời bằng tiếng Việt, thực tế, thẳng thắn và ấm áp. Dùng dữ liệu câu trả lời mở khi có. Mỗi hành động cần nêu việc cần làm, mục tiêu và tiêu chí hoàn thành.',
    'plan_prompt_en', 'You are a dental clinic operations consultant. Based on the survey scores and answers, create a 30-day action plan across 4 weeks. Include 2-3 concrete actions per week, prioritize high-impact weak areas, and begin week 1 with the smallest action that can be implemented immediately. Use a practical, candid, warm tone. Use open-ended answers when available. For every action, state what to do, the objective, and a verifiable completion criterion.'
  )
)
WHERE COALESCE(TRIM(json_extract(ai_config, '$.plan_prompt_vi')), '') = ''
   OR COALESCE(TRIM(json_extract(ai_config, '$.plan_prompt_en')), '') = '';
