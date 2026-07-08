-- Fix cf_open2 label_vi and placeholder_vi
UPDATE survey_question SET label_vi = 'Nếu bạn phải chọn 1 kênh content duy nhất để đầu tư trong 3 tháng tới, bạn sẽ chọn kênh nào? Tại sao kênh đó?' WHERE question_id = 'cf_open2';
UPDATE survey_question SET placeholder_vi = 'Nghĩ về kênh nào có tiềm năng mang lại bệnh nhân mới với ít thời gian nhất.' WHERE question_id = 'cf_open2';
