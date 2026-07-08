-- Fix label_vi (câu hỏi) cho nl_q1-q5 — batch 1-2
UPDATE survey_question SET label_vi = 'Mức năng lượng thể chất của bạn hàng ngày như thế nào — sức bền, giấc ngủ, dinh dưỡng?' WHERE question_id = 'nl_q1';
UPDATE survey_question SET label_vi = 'Bạn có thường xuyên cảm thấy căng thẳng, lo âu, hoặc kiệt sức trong công việc không?' WHERE question_id = 'nl_q2';
UPDATE survey_question SET label_vi = 'Bạn có thời gian cho bản thân (nghỉ ngơi, sở thích, gia đình) ngoài công việc không?' WHERE question_id = 'nl_q3';
UPDATE survey_question SET label_vi = 'Bạn có động lực và cảm hứng để tiếp tục phát triển trong nghề không?' WHERE question_id = 'nl_q4';
UPDATE survey_question SET label_vi = 'Bạn có cảm giác "sống có mục đích" trong công việc nha khoa không?' WHERE question_id = 'nl_q5';

-- Fix label_vi cho open questions
UPDATE survey_question SET label_vi = 'Khi nào bạn cảm thấy năng lượng cao nhất trong ngày? Điều gì làm bạn cảm thấy tràn đầy năng lượng?' WHERE question_id = 'nl_open1';
UPDATE survey_question SET label_vi = 'Điều gì "hút" năng lượng của bạn nhiều nhất trong công việc hàng ngày? (người, tình huống, thói quen)' WHERE question_id = 'nl_open2';

-- Fix placeholder_vi cho open questions
UPDATE survey_question SET placeholder_vi = 'Nghĩ về những khoảnh khắc bạn cảm thấy tràn đầy năng lượng — có thể là khi gặp bệnh nhân khó, khi hoàn thành một ca khó, hay khi học được điều mới.' WHERE question_id = 'nl_open1';
UPDATE survey_question SET placeholder_vi = 'Nghĩ về những thứ làm bạn mệt mỏi — có thể là bệnh nhân khó, nhân viên, quy trình, hay chính cách suy nghĩ của bạn.' WHERE question_id = 'nl_open2';
