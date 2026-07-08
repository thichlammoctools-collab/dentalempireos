-- Fix missing Vietnamese diacritics for nang-luong-check (batch 1-2)

UPDATE survey_question SET scale_labels_vi = '{"1":"Thường xuyên mệt, ngủ ít và không chất lượng, ăn uống tùy ý","2":"Thỉnh thoảng mệt, ngủ không đều, ăn uống chưa tốt","3":"Khá ổn nhưng có lúc mệt, không rõ lý do","4":"Năng lượng thể chất tốt, ngủ được, ăn uống khá đều","5":"Năng lượng thể chất đỉnh dao, ngủ ngon, ăn uống có kế hoạch"}' WHERE question_id = 'nl_q1';

UPDATE survey_question SET scale_labels_vi = '{"1":"Thường xuyên kiệt sức, cảm giác cháy bên trong","2":"Thường xuyên căng thẳng và lo âu","3":"Thỉnh thoảng căng thẳng, đặc biệt khi bận","4":"Căng thẳng ở mức chấp nhận được, có cách xử lý","5":"Kiểm soát căng thẳng tốt, có phương pháp giữ bình tĩnh"}' WHERE question_id = 'nl_q2';

UPDATE survey_question SET scale_labels_vi = '{"1":"Gần như không có thời gian riêng, làm việc tất cả thời gian","2":"Ít thời gian riêng, gần như tất cả thời gian cho công việc","3":"Có một chút thời gian riêng nhưng không đều đều","4":"Có thời gian riêng đều đều, cân bằng khá tốt","5":"Cân bằng xuất sắc giữa công việc và cuộc sống"}' WHERE question_id = 'nl_q3';

UPDATE survey_question SET scale_labels_vi = '{"1":"Không còn động lực, chỉ làm vì áp lực tài chính","2":"Ít động lực, cảm thấy chán nản với công việc","3":"Động lực trung bình, có lúc hăng hái lúc chán","4":"Động lực tốt, có mục tiêu phát triển rõ ràng","5":"Động lực mạnh mẽ, liên tục học hỏi và phát triển"}' WHERE question_id = 'nl_q4';

UPDATE survey_question SET scale_labels_vi = '{"1":"Cảm giác công việc vô nghĩa, chỉ là cách kiếm tiền","2":"Công việc là công việc, không có ý nghĩa đặc biệt","3":"Thỉnh thoảng cảm thấy có ý nghĩa, nhưng không thường xuyên","4":"Thường xuyên cảm thấy công việc có ý nghĩa với bệnh nhân","5":"Cảm giác sống có mục đích mạnh mẽ, công việc là sứ mệnh"}' WHERE question_id = 'nl_q5';
