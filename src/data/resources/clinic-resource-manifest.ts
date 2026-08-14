export interface ClinicResourceManifest {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'sops' | 'checklists';
  tag: string;
  icon: string;
  sortOrder: number;
  accessMode: 'free' | 'credits';
  status: 'draft';
  version: number;
  reviewFlags: string[];
  pdf: { filename: string; audience: string; objectives: string[]; sections: Array<{ title: string; points: string[] }> };
  workbook: { filename: string; sheets: Array<{ name: string; columns: string[]; sampleRows: string[][]; dropdowns?: Array<{ column: string; values: string[] }> }> };
}

export const CLINIC_RESOURCE_MANIFEST: ClinicResourceManifest[] = [
  {
    id: 'clinic-core-sop-playbook', slug: 'clinic-core-sop-playbook', title: 'Clinic Core SOP Playbook',
    description: 'Khung SOP, checklist và dashboard hoàn thành cho vận hành phòng khám.', category: 'sops', tag: 'Vận hành', icon: 'assignment', sortOrder: 10, accessMode: 'free', status: 'draft', version: 1,
    reviewFlags: ['Không chứa phác đồ hoặc chỉ dẫn điều trị.'],
    pdf: { filename: 'clinic-core-sop-playbook-v1.pdf', audience: 'Chủ phòng khám, quản lý vận hành và trưởng bộ phận.', objectives: ['Chuẩn hóa owner, SLA và bằng chứng hoàn thành.', 'Thiết lập vòng lặp audit và cập nhật SOP hàng tuần.'], sections: [
      { title: 'Tư duy chuẩn hóa', points: ['Mỗi SOP có owner, phiên bản, SLA và bằng chứng hoàn thành.', 'Review định kỳ để biến ngoại lệ thành cải tiến hệ thống.'] },
      { title: 'Lead và lịch hẹn', points: ['Tiếp nhận lead, phản hồi đầu tiên, xác nhận lịch và xử lý no-show.', 'Ghi nhận next action rõ ràng tại từng điểm chạm.'] },
      { title: 'Vận hành tại phòng khám', points: ['Check-in và bàn giao lễ tân – điều phối – lâm sàng.', 'Bàn giao sau điều trị sang CSKH ở cấp vận hành.'] },
      { title: 'Audit tuần', points: ['Kiểm tra checklist, exception log và corrective action.', 'Cập nhật owner, ngày review và phiên bản SOP.'] },
    ] },
    workbook: { filename: 'clinic-core-sop-playbook-v1.xlsx', sheets: [
      { name: 'SOP Register', columns: ['Mã SOP', 'Tên SOP', 'Phiên bản', 'Owner', 'Ngày hiệu lực', 'Ngày review', 'Trạng thái'], sampleRows: [['SOP-001', 'Tiếp nhận lead', '1.0', 'Quản lý vận hành', '2026-08-14', '2026-11-14', 'Đang áp dụng']], dropdowns: [{ column: 'G', values: ['Nháp', 'Đang áp dụng', 'Cần review'] }] },
      { name: 'Checklist', columns: ['Chu kỳ', 'Hạng mục', 'Owner', 'Hạn hoàn thành', 'Bằng chứng', 'Trạng thái'], sampleRows: [['Hằng ngày', 'Kiểm tra lịch hẹn ngày mai', 'Lễ tân', '17:00', 'Ảnh chụp/ghi chú', 'Chưa hoàn thành']], dropdowns: [{ column: 'A', values: ['Hằng ngày', 'Hằng tuần'] }, { column: 'F', values: ['Chưa hoàn thành', 'Hoàn thành', 'Ngoại lệ'] }] },
      { name: 'Exception Log', columns: ['Ngày', 'SOP', 'Ngoại lệ', 'Tác động', 'Corrective action', 'Owner', 'Hạn xử lý', 'Trạng thái'], sampleRows: [['2026-08-14', 'SOP-001', 'Lead quá SLA', 'Trung bình', 'Rà soát lịch trực', 'Quản lý', '2026-08-21', 'Mở']], dropdowns: [{ column: 'H', values: ['Mở', 'Đang xử lý', 'Đã đóng'] }] },
      { name: 'Dashboard', columns: ['Chỉ số', 'Giá trị'], sampleRows: [['Tỷ lệ hoàn thành checklist', '=COUNTIF(Checklist!F:F,"Hoàn thành")/MAX(1,COUNTA(Checklist!B:B)-1)']] },
    ] },
  },
  {
    id: 'crm-pipeline-lead-sla-booking-conversion-kit', slug: 'crm-pipeline-lead-sla-booking-conversion-kit', title: 'CRM Pipeline, Lead SLA & Booking Conversion Kit',
    description: 'Pipeline CRM, SLA lead và dashboard chuyển đổi lịch hẹn.', category: 'checklists', tag: 'CRM & Sales', icon: 'conversion_path', sortOrder: 20, accessMode: 'credits', status: 'draft', version: 1,
    reviewFlags: ['Không bao gồm tư vấn chẩn đoán hoặc khuyến nghị điều trị.'],
    pdf: { filename: 'crm-pipeline-lead-sla-booking-conversion-kit-v1.pdf', audience: 'Quản lý, lễ tân và đội ngũ tư vấn.', objectives: ['Thiết lập pipeline, owner và mandatory fields.', 'Quản lý SLA phản hồi và conversion theo tuần.'], sections: [
      { title: 'Pipeline chuẩn', points: ['New Lead → Contacted → Qualified → Booked → Confirmed → Completed → Follow-up/Lost.', 'Không chuyển stage khi thiếu owner hoặc next action.'] },
      { title: 'SLA và kịch bản', points: ['SLA phản hồi đầu tiên và aging theo lead.', 'Script phản hồi đầu tiên, xác nhận lịch, xử lý do dự và no-show.'] },
      { title: 'Follow-up và funnel review', points: ['Lịch follow-up theo stage và lost reason chuẩn hóa.', 'Weekly review theo nguồn lead, booking và show-up.'] },
    ] },
    workbook: { filename: 'crm-pipeline-lead-sla-booking-conversion-kit-v1.xlsx', sheets: [
      { name: 'Lead Pipeline', columns: ['Lead ID', 'Ngày tạo', 'Nguồn', 'UTM Campaign', 'Owner', 'Stage', 'Next action', 'Hạn SLA', 'Lost reason'], sampleRows: [['LEAD-001', '2026-08-14', 'Facebook', 'khai-truong', 'Tư vấn A', 'New Lead', 'Gọi lần đầu', '2026-08-14 10:00', '']], dropdowns: [{ column: 'F', values: ['New Lead', 'Contacted', 'Qualified', 'Booked', 'Confirmed', 'Completed', 'Follow-up', 'Lost'] }, { column: 'I', values: ['Không liên hệ được', 'Không phù hợp thời gian', 'Ngân sách', 'Khác'] }] },
      { name: 'SLA Aging', columns: ['Lead ID', 'Owner', 'Stage', 'Hạn SLA', 'Trạng thái'], sampleRows: [['=\'Lead Pipeline\'!A2', '=\'Lead Pipeline\'!E2', '=\'Lead Pipeline\'!F2', '=\'Lead Pipeline\'!H2', '=IF(D2<NOW(),"Quá hạn","Trong SLA")']] },
      { name: 'Conversion Dashboard', columns: ['Chỉ số', 'Giá trị'], sampleRows: [['Tổng lead', '=COUNTA(\'Lead Pipeline\'!A:A)-1'], ['Đã đặt lịch', '=COUNTIF(\'Lead Pipeline\'!F:F,"Booked")']] },
    ] },
  },
  {
    id: 'patient-lifecycle-recall-toolkit', slug: 'patient-lifecycle-recall-toolkit', title: 'Patient Lifecycle & Recall Toolkit',
    description: 'Tracker recall, reactivation, feedback và KPI vòng đời khách hàng.', category: 'checklists', tag: 'CSKH', icon: 'favorite', sortOrder: 30, accessMode: 'credits', status: 'draft', version: 1,
    reviewFlags: ['Nội dung hậu điều trị dùng placeholder và cần phụ trách chuyên môn phê duyệt.'],
    pdf: { filename: 'patient-lifecycle-recall-toolkit-v1.pdf', audience: 'Lễ tân, trợ thủ, bác sĩ và đội CSKH.', objectives: ['Quản lý dữ liệu recall, owner, channel và next action.', 'Đo recall, no-show, reactivation và service recovery.'], sections: [
      { title: 'Patient lifecycle', points: ['Pre-visit, check-in, treatment-day handoff, post-visit operational follow-up, recall, reactivation và review.', 'Owner và SLA rõ theo từng điểm chạm.'] },
      { title: 'Script và escalation', points: ['Script nhắc lịch, xác nhận, hỏi trải nghiệm và service recovery.', '[Nội dung cần phụ trách chuyên môn phê duyệt] cho hướng dẫn sau điều trị.'] },
      { title: 'KPI tuần', points: ['Recall rate, no-show rate, reactivation và review/referral trigger.', 'Phản hồi tiêu cực được ghi nhận và chuyển tuyến nội bộ.'] },
    ] },
    workbook: { filename: 'patient-lifecycle-recall-toolkit-v1.xlsx', sheets: [
      { name: 'Recall Due List', columns: ['Patient ID', 'Due date', 'Owner', 'Channel', 'Status', 'Outcome', 'Next action'], sampleRows: [['PT-001', '2026-08-21', 'CSKH A', 'Zalo', 'Chờ liên hệ', '', 'Gọi lần 1']], dropdowns: [{ column: 'D', values: ['Điện thoại', 'Zalo', 'Email'] }, { column: 'E', values: ['Chờ liên hệ', 'Đã liên hệ', 'Đã đặt lịch', 'Không phản hồi'] }] },
      { name: 'Reactivation', columns: ['Patient ID', 'Ngày bắt đầu', 'Owner', 'Lý do', 'Outcome', 'Next action'], sampleRows: [['PT-002', '2026-08-14', 'CSKH A', 'Quá hạn recall', 'Đang theo dõi', 'Gọi lại tuần sau']] },
      { name: 'Feedback Log', columns: ['Ngày', 'Patient ID', 'Kênh', 'Feedback', 'Mức độ', 'Owner', 'Trạng thái'], sampleRows: [['2026-08-14', 'PT-003', 'Google', 'Cần phản hồi dịch vụ', 'Cần xử lý', 'Quản lý', 'Mở']], dropdowns: [{ column: 'G', values: ['Mở', 'Đang xử lý', 'Đã đóng'] }] },
      { name: 'KPI Dashboard', columns: ['Chỉ số', 'Giá trị'], sampleRows: [['Recall đã liên hệ', '=COUNTIF(\'Recall Due List\'!E:E,"Đã liên hệ")'], ['No-show rate', '[Nhập dữ liệu lịch hẹn để tính]']] },
    ] },
  },
];
