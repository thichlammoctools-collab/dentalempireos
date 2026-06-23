// Internationalization for "Hồ Sơ Gốc Rễ" Survey
// Single object with 'vi' and 'en' keys, each containing the same structure.

export interface SurveyQuestion {
  id: string;           // matches DB column name (without lang prefix)
  label: string;
  placeholder?: string;
  type: 'textarea' | 'select' | 'radio';
  anchor?: boolean;     // highlight as "anchor question" ⭐
  scaleLabels?: Record<number, string>;  // for select type
  options?: string[];   // for radio type
}

export interface SurveyPart {
  id: string;
  title: string;
  subtitle: string;
  ref: string;           // e.g. "Ch.26 — R.O.A.D.M.A.P"
  questions: SurveyQuestion[];
}

export interface SurveyTranslations {
  meta: {
    title: string;
    description: string;
    submitButton: string;
    submitting: string;
    required: string;
  };
  info: {
    ownerName: string;
    clinicName: string;
    clinicAddress: string;
    email: string;
    yearsInOperation: string;
    staffCount: string;
  };
  parts: SurveyPart[];
}

export const scaleLabels: Record<string, Record<number, string>> = {
  vi: {
    1: 'Chưa có',
    2: 'Đang bắt đầu',
    3: 'Đã có nhưng chưa ổn định',
    4: 'Ổn định',
    5: 'Đầu tàu và nhất quán',
  },
  en: {
    1: 'Not yet',
    2: 'Starting',
    3: 'Inconsistent',
    4: 'Stable',
    5: 'Exemplary',
  },
};

export const surveyData: Record<string, SurveyTranslations> = {
  vi: {
    meta: {
      title: 'Hồ Sơ Gốc Rễ',
      description: 'Trước khi bắt đầu hành trình, hãy quay về gốc rễ. Khảo sát này giúp bạn và tư vấn viên thấy rõ bản sắc, giá trị và năng lực hiện có của phòng khám. Không có câu hỏi đúng/sai — chỉ có sự chân thật.',
      submitButton: 'Gửi Hồ Sơ',
      submitting: 'Đang xử lý...',
      required: 'bắt buộc',
    },
    info: {
      ownerName: 'Họ tên chủ phòng khám / Bác sĩ',
      clinicName: 'Tên phòng khám',
      clinicAddress: 'Địa chỉ',
      email: 'Email liên hệ',
      yearsInOperation: 'Số năm hoạt động',
      staffCount: 'Số nhân sự hiện tại',
    },
    parts: [
      {
        id: 'roots',
        title: 'PHẦN 1: GỐC RỄ — BẮT NỀN TẢNG',
        subtitle: 'Xác định bản sắc phòng khám — là ai, sinh ra để phụng sự điều gì, giá trị nào không bao giờ được đánh đổi.',
        ref: 'Chương 26 — R.O.A.D.M.A.P · ROOTS',
        questions: [
          {
            id: 'roots_q1',
            label: 'Nếu một ngày nào đó phòng khám không còn tồn tại, điều gì sẽ mất đi đối với bệnh nhân, đối với đội ngũ và đối với chính bạn?',
            placeholder: 'Hãy tưởng tượng phòng khám của bạn không còn ở đó. Điều gì bạn cảm thấy mất mát nhất?',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'roots_q2',
            label: 'Phòng khám của bạn sinh ra để phụng sự điều gì? Viết một câu không quá 2 dòng.',
            placeholder: 'Ví dụ: "Phòng khám sinh ra để giúp mọi người có nụ cười tự tin mà không cần lo lắng."',
            type: 'textarea',
          },
          {
            id: 'roots_q3',
            label: 'Nếu phải chọn chỉ 3 giá trị không bao giờ được đánh đổi (dù có áp lực tài chính), bạn sẽ chọn giá trị nào? Tại sao?',
            placeholder: 'Liệt kê 3 giá trị và giải thích ngắn gọn tại sao chúng không thể bị đánh đổi.',
            type: 'textarea',
          },
          {
            id: 'roots_q4',
            label: 'Bạn có thể kể một tình huống mà bạn đã đứng vững giá trị, dù phải hy sinh lợi ích ngắn hạn? Điều đó đã đánh đổi bạn như thế nào?',
            placeholder: 'Một câu chuyện thật — giá trị nào, lợi ích gì phải đánh đổi, và kết quả ra sao.',
            type: 'textarea',
          },
          {
            id: 'roots_d1',
            label: 'Bạn có thể viết rõ tầm nhìn của phòng khám trong một câu không (không quá 15 từ)?',
            type: 'select',
            scaleLabels: {
              1: 'Không biết phải viết gì',
              2: 'Có ý tưởng nhưng chưa rõ ràng',
              3: 'Đã viết nhưng chưa tự tin',
              4: 'Rõ ràng, có thể chia sẻ với mọi người',
              5: 'Rất rõ ràng, có thể trích dẫn bất cứ lúc nào',
            },
          },
          {
            id: 'roots_d2',
            label: 'Tất cả nhân sự trong phòng khám có hiểu và thể hiện được 3 giá trị cốt lõi không?',
            type: 'select',
            scaleLabels: {
              1: 'Không chắc họ hiểu',
              2: 'Một vài người hiểu',
              3: 'Đa số hiểu nhưng chưa nhất quán',
              4: 'Mọi người hiểu và cố gắng thể hiện',
              5: 'Mỗi người có thể giải thích và hành động theo giá trị',
            },
          },
          {
            id: 'roots_d3',
            label: 'Quy trình quyết định hàng ngày của bạn có được thông nhất với giá trị cốt lõi không?',
            type: 'select',
            scaleLabels: {
              1: 'Thường xuyên mâu thuẫn',
              2: 'Thỉnh thoảng mâu thuẫn',
              3: 'Nỗ lực nhưng chưa ổn định',
              4: 'Phần lớn nhất quán',
              5: 'Luôn nhất quán — giá trị là la bàn',
            },
          },
          {
            id: 'roots_q4_choice',
            label: 'Khi có mâu thuẫn giữa lợi ích tài chính và giá trị của phòng khám, bạn thường:',
            type: 'radio',
            options: [
              'Đứng vững giá trị, dù phải hy sinh doanh thu',
              'Cân bằng lợi ích tài chính lên trên',
              'Cố gắng tìm cách cân bằng, nhưng thường là doanh thu trước',
              'Đang học cách cân bằng',
            ],
          },
        ],
      },
      {
        id: 'sky',
        title: 'PHẦN 2: TRỤC ĐẠO ĐỨC — SKY',
        subtitle: 'Đo lường 3 phẩm chất đạo đức: Sincerity (Chân thành), Kindness (Tử tế), Yielding (Nhường mình).',
        ref: 'Chương 24 — TO BE SKY',
        questions: [
          {
            id: 'sky_sin_open',
            label: 'Bạn có thể kể một ví dụ cụ thể mà phòng khám đã từ chối một dịch vụ/tư vấn vì lý do chân thành (không phải vì tài chính)? Nếu không, tại sao?',
            placeholder: 'Ví dụ: "BN muốn bọc sứ 8 răng nhưng BS chỉ tư vấn 4 răng vì thật sự không cần thiết."',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'sky_s_d1',
            label: 'Khi phát hiện bệnh nhân cần dịch vụ hơn nhưng không nhất thiết phải làm, bạn thường:',
            type: 'select',
            scaleLabels: {
              1: 'Thường tư vấn thêm để tăng doanh thu',
              2: 'Thỉnh thoảng tư vấn thêm khi thấy cơ hội',
              3: 'Nỗ lực nói đúng nhưng đôi khi bị áp lực',
              4: 'Phần lớn nói đúng, dù mất doanh thu',
              5: 'Luôn nói nội dung chính xác, dù mất doanh thu',
            },
          },
          {
            id: 'sky_s_d2',
            label: 'Nhân sự bạn quản lý có dám nói thẳng với bệnh nhân khi họ thắc mắc bất đồng không?',
            type: 'select',
            scaleLabels: {
              1: 'Thường lúng túng, tránh né',
              2: 'Cố gắng nhưng chưa tự tin',
              3: 'Được đào tạo nhưng chưa thành thục',
              4: 'Tự tin nói thẳng trong hầu hết tình huống',
              5: 'Được đào tạo để nói thẳng một cách tự nhiên và tôn trọng',
            },
          },
          {
            id: 'sky_k_open',
            label: 'Bệnh nhân trong phòng khám của bạn thường mô tả họ cảm nhận như thế nào khi thoát khỏi ghế răng? Bạn biết điều đó như thế nào?',
            placeholder: 'Bạn có thể trích dẫn review, tin nhắn, hoặc cảm nhận thật sự từ bệnh nhân.',
            type: 'textarea',
          },
          {
            id: 'sky_k_d1',
            label: 'Nhân sự phòng khám có thường xuyên được quan tâm đến cảm xúc (không chỉ là căn bệnh lý) của bệnh nhân không?',
            type: 'select',
            scaleLabels: {
              1: 'Hầu như không',
              2: 'Thỉnh thoảng khi có vấn đề',
              3: 'Nỗ lực nhưng chưa thành văn hóa',
              4: 'Đây là thói quen trong hầu hết tương tác',
              5: 'Đây là chuẩn mực — mỗi tương tác đều có sự quan tâm',
            },
          },
          {
            id: 'sky_k_d2',
            label: 'Bạn có quan tâm đến sức khỏe tinh thần và sự phát triển cá nhân của nhân sự không, không chỉ là hiệu quả làm việc?',
            type: 'select',
            scaleLabels: {
              1: 'Chỉ quan tâm khi có vấn đề',
              2: 'Thỉnh thoảng hỏi thăm',
              3: 'Nỗ lực nhưng chưa thường xuyên',
              4: 'Đây là phần quan trọng trong quản lý',
              5: 'Đây là nhiệm vụ của tôi — mỗi người đều cần được phát triển',
            },
          },
          {
            id: 'sky_y_open',
            label: 'Lần gần nhất bạn thừa nhận mình sai với nhân sự hoặc bệnh nhân và thay đổi hành động? Điều đó khó khăn ở điểm nào?',
            placeholder: 'Một câu chuyện thật — bạn sai ở đâu, khó khăn nhất là điều gì, và kết quả ra sao.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'sky_y_d1',
            label: 'Khi nhân sự phản hồi rằng quy trình không hợp lý, bạn thường:',
            type: 'select',
            scaleLabels: {
              1: 'Khó chịu, thường bảo vệ quy trình',
              2: 'Lắng nghe nhưng ít thay đổi',
              3: 'Cân nhắc nhưng thường giữ nguyên',
              4: 'Lắng nghe và sẵn sàng điều chỉnh',
              5: 'Lắng nghe, cân nhắc và điều chỉnh nếu có lý',
            },
          },
          {
            id: 'sky_y_d2',
            label: 'Có phải bạn thường là người cuối cùng trong phòng khám phải thay đổi ý kiến không?',
            type: 'select',
            scaleLabels: {
              1: 'Rất khó thay đổi ý khi đã quyết',
              2: 'Phải có lý do rất lớn mới thay đổi',
              3: 'Cố gắng nhưng đôi khi cứng đầu',
              4: 'Dễ thay đổi khi thấy thông tin hợp lý',
              5: 'Luôn sẵn sàng thay đổi — đó là sức mạnh, không phải yếu đuối',
            },
          },
        ],
      },
      {
        id: 'stars',
        title: 'PHẦN 3: BẢN ĐỒ NĂNG LỰC — S.T.A.R.S',
        subtitle: 'Đánh giá 5 chiều năng lực: Skills, Traits, Actions, Results, Synergy.',
        ref: 'Chương 25 — S.T.A.R.S',
        questions: [
          {
            id: 'stars_s_d',
            label: 'Đội ngũ chuyên môn của bạn (bác sĩ, phụ tá) có thể đảm bảo chất lượng điều trị ổn định không?',
            type: 'select',
            scaleLabels: {
              1: 'Rất phụ thuộc vào từng người',
              2: 'Một vài người giỏi, phần còn lại yếu',
              3: 'Ổn định nhưng chưa nhất quán',
              4: 'Ổn định trong hầu hết tình huống',
              5: 'Ổn định tuyệt đối — không phụ thuộc vào cá nhân',
            },
          },
          {
            id: 'stars_s_open',
            label: 'Người nào trong đội ngũ của bạn hiện đang là người "đúng giá trị" nhất? Ai cần được phát triển thêm? Tại sao bạn nghĩ vậy?',
            placeholder: 'Liệt kê tên và lý do — không cần mô tả chi tiết, chỉ cần cảm nhận thật.',
            type: 'textarea',
          },
          {
            id: 'stars_t_d',
            label: 'Bạn đánh giá phong cách tuyển dụng hiện tại của mình: bạn có tuyển người "đúng giá trị" trước, "giỏi năng lực" sau không?',
            type: 'select',
            scaleLabels: {
              1: 'Thường tuyển người giỏi trước',
              2: 'Thấy cả hai nhưng thường thiên về năng lực',
              3: 'Cố gắng nhưng chưa có quy tắc rõ ràng',
              4: 'Phân biệt rõ — giá trị là tiêu chuẩn đầu tiên',
              5: 'Luôn đặt giá trị lên hàng đầu — năng lực có thể đào tạo',
            },
          },
          {
            id: 'stars_t_open',
            label: 'Cho một ví dụ cụ thể mà đội ngũ đã hành động đúng, dù áp lực lớn. Và một ví dụ ngược lại.',
            placeholder: 'Hai tình huống: một thành công, một chưa tốt — ngắn gọn.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'stars_a_d',
            label: 'Các quy trình quan trọng (tiếp đón, tư vấn, điều trị, CSKH) đã được chuẩn hóa và thực hiện nhất quán chưa?',
            type: 'select',
            scaleLabels: {
              1: 'Chủ yếu tùy trường hợp',
              2: 'Có quy trình trên giấy nhưng ít người tuân thủ',
              3: 'Đang áp dụng nhưng chưa ổn định',
              4: 'Có quy trình rõ ràng và được thực hiện',
              5: 'Quy trình sống trong văn hóa — mọi người thực hiện vì hiểu, không vì ép',
            },
          },
          {
            id: 'stars_a_open',
            label: 'Nếu chỉ có thể đào tạo thêm 1 kỹ năng cho toàn đội ngũ ngay bây giờ, bạn sẽ chọn kỹ năng gì? Tại sao?',
            placeholder: 'Chỉ 1 — và giải thích lý do.',
            type: 'textarea',
          },
          {
            id: 'stars_r_d',
            label: 'Bạn có hệ thống đo lường kết quả không chỉ doanh thu, mà cả chất lượng điều trị, hài lòng bệnh nhân và sự phát triển của đội ngũ không?',
            type: 'select',
            scaleLabels: {
              1: 'Chỉ đo doanh thu',
              2: 'Đo thêm một vài chỉ số',
              3: 'Cố gắng đo nhiều hơn nhưng chưa có hệ thống',
              4: 'Có hệ thống đo đa chiều',
              5: 'Hệ thống đo lường phản ánh SKY — không chỉ kết quả, mà còn cách đạt được',
            },
          },
          {
            id: 'stars_syn_choice',
            label: 'Khi một thành viên trong đội ngũ hoàn thành ca điều trị, quá trình phối hợp giữa các bộ phận (tiếp đón, tư vấn, phụ tá, kế toán) đang:',
            type: 'radio',
            options: [
              'Rất tốn kém, thường mất thông tin',
              'Ổn định nhưng chưa trơn tru',
              'Tốt, mọi người hiểu vai trò của nhau',
              'Rất tốt, tạo ra giá trị vượt ngoài phần việc cá nhân',
            ],
          },
          {
            id: 'stars_syn_d',
            label: 'Mối quan hệ giữa các bộ phận trong phòng khám có tạo ra sức mạnh lớn hơn tổng từng bộ phận riêng lẻ không?',
            type: 'select',
            scaleLabels: {
              1: 'Mỗi phần hoạt động độc lập',
              2: 'Thỉnh thoảng phối hợp nhưng chưa ăn ý',
              3: 'Phối hợp được nhưng chưa tạo giá trị thêm',
              4: 'Phối hợp tốt, tạo giá trị cộng thêm',
              5: 'Luôn tạo ra giá trị vượt ngoài — cả nhóm mạnh hơn từng người',
            },
          },
          {
            id: 'stars_syn_open',
            label: 'Điều gì bạn cảm thấy tự hào nhất về đội ngũ hiện tại? Điều gì khiến bạn lo lắng nhất?',
            placeholder: 'Cả hai câu hỏi — tự hào và lo lắng. Chỉ cần viết cảm nhận thật.',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'living',
        title: 'PHẦN 4: HỆ THỐNG SỐNG',
        subtitle: 'Đo lường mức độ phòng khám đang vận hành như một "hệ thống sống" thay vì "cỗ máy".',
        ref: 'Chương 22 — Hệ Thống Sống',
        questions: [
          {
            id: 'living_o1',
            label: 'Bạn tự đánh giá phòng khám của mình gần với "hệ thống sống" hơn hay "cỗ máy" hơn? Nếu phòng khám là một cơ sống, bạn nghĩ nó đang ở giai đoạn nào: còn mơ, đang lớn, hay đã chín?',
            placeholder: 'Hãy miêu tả tự nhiên — không cần lý thuyết, chỉ cần cảm nhận thật.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'living_o2',
            label: 'Điều gì trong phòng khám đang sống tốt nhất? Điều gì đang yếu nhất? Bạn thấy sự khác biệt giữa hai phần này?',
            placeholder: 'Viết 2 ý: điều sống tốt nhất + điều yếu nhất.',
            type: 'textarea',
          },
          {
            id: 'living_d1',
            label: 'Phòng khám có cơ chế "tự học hỏi" từ lỗi không? (Ví dụ: phân tích ca tai biến, học từ khi phàn nàn của bệnh nhân)',
            type: 'select',
            scaleLabels: {
              1: 'Không có',
              2: 'Có nhưng chỉ khi có vấn đề lớn',
              3: 'Đang cố gắng nhưng chưa thành thói quen',
              4: 'Có và được thực hiện',
              5: 'Có và thực sự dùng để cải thiện — đây là văn hóa',
            },
          },
          {
            id: 'living_d2',
            label: 'Dữ liệu về chất lượng (không chỉ tài chính) có được sử dụng để quyết định không?',
            type: 'select',
            scaleLabels: {
              1: 'Hiếm khi',
              2: 'Thỉnh thoảng xem xét',
              3: 'Cố gắng thu thập nhưng chưa dùng',
              4: 'Dùng để ra quyết định',
              5: 'Luôn là cơ sở ra quyết định',
            },
          },
          {
            id: 'living_d3',
            label: 'Nhân sự có cảm thấy an toàn để báo lỗi, để ý kiến và để học hỏi từ nhau không?',
            type: 'select',
            scaleLabels: {
              1: 'Không, thường lo sợ',
              2: 'Một vài người dám, phần lớn không',
              3: 'Cố gắng xây dựng nhưng chưa thành',
              4: 'Phần lớn an toàn',
              5: 'Có, đây là văn hóa — mọi người học hỏi từ nhau',
            },
          },
          {
            id: 'living_d4',
            label: 'Bạn có cảm nhận rằng mối quan hệ giữa bạn và đội ngũ đang trưởng thành không?',
            type: 'select',
            scaleLabels: {
              1: 'Khá tĩnh — không có gì mới',
              2: 'Thỉnh thoảng có chuyển biến',
              3: 'Đang dần tốt hơn',
              4: 'Tốt — có sự tin tưởng và hiểu nhau',
              5: 'Rất tốt — cả hai cùng lớn lên',
            },
          },
        ],
      },
      {
        id: 'future',
        title: 'PHẦN 5: TIỀM NĂNG & TƯƠNG LAI',
        subtitle: 'Hiểu tâm trạng, hy vọng và áp lực của chủ phòng khám — giúp tư vấn viên nắm bắt "khoảng cách" giữa hiện tại và tầm nhìn.',
        ref: '',
        questions: [
          {
            id: 'future_o1',
            label: 'Trong 3 năm tới, bạn thấy phòng khám này ở đâu? Mô tả khung cảnh: có bao nhiêu người, doanh thu mục tiêu, chất lượng trải nghiệm bệnh nhân, và tâm trạng của bạn.',
            placeholder: 'Hãy tưởng tượng — không cần chính xác, chỉ cần thật.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'future_o2',
            label: 'Áp lực lớn nhất mà bạn đang phải đối mặt là gì? (tài chính, nhân sự, cạnh tranh, tại bản thân, hay khác?) Áp lực này ảnh hưởng đến quyết định của bạn như thế nào?',
            placeholder: 'Viết tự nhiên — đây là nơi để bạn được "thở".',
            type: 'textarea',
          },
          {
            id: 'future_o3',
            label: 'Điều gì mà bạn đã thử nhiều lần mà chưa thành công? Bạn nghĩ tại sao?',
            placeholder: 'Không cần phân tích — chỉ cần kể lại.',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'commit',
        title: 'PHẦN 6: CAM KẾT — TRƯỚC BUỔI TƯ VẤN',
        subtitle: 'Tạo sự rõ ràng và động lực trước khi bắt đầu hành trình tư vấn.',
        ref: '',
        questions: [
          {
            id: 'commit_o1',
            label: 'Bạn có sẵn sàng nhìn thấy những điều không dễ chịu về phòng khám của bạn không? Những điều đó có thể khó chịu, nhưng nó là nền tảng để thay đổi thật sự. Điều gì khiến bạn lo lắng nhất khi nghĩ đến việc đó?',
            placeholder: 'Hãy thành thật — đây không phải câu hỏi để đánh giá.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'commit_o2',
            label: 'Bắt đầu từ ngày mai, bạn có thể làm ngay một điều nhỏ để thể hiện sự thay đổi không? Mô tả điều đó.',
            placeholder: 'Một hành động nhỏ cụ thể — không cần lớn, chỉ cần thật.',
            type: 'textarea',
          },
          {
            id: 'commit_choice',
            label: 'Bạn cam kết với bản thân rằng:',
            type: 'radio',
            options: [
              'Tôi muốn hiểu thấu phòng khám của mình từ gốc đến ngọn',
              'Tôi sẵn sàng thay đổi khi thấy thông tin đúng',
              'Tôi hiểu rằng thành công cần thời gian và tôi kiên nhẫn',
              'Tất cả trên',
            ],
          },
        ],
      },
    ],
  },

  en: {
    meta: {
      title: 'Roots Profile',
      description: 'Before starting the journey, let\'s return to the roots. This survey helps you and your consultant clearly see the identity, values, and current capabilities of your clinic. There are no right or wrong answers — only honesty.',
      submitButton: 'Submit Profile',
      submitting: 'Processing...',
      required: 'required',
    },
    info: {
      ownerName: 'Full name of clinic owner / Doctor',
      clinicName: 'Clinic name',
      clinicAddress: 'Address',
      email: 'Contact email',
      yearsInOperation: 'Years in operation',
      staffCount: 'Current number of staff',
    },
    parts: [
      {
        id: 'roots',
        title: 'PART 1: ROOTS — BUILDING THE FOUNDATION',
        subtitle: 'Define the clinic\'s identity — who you are, what you were born to serve, and which values can never be compromised.',
        ref: 'Ch.26 — R.O.A.D.M.A.P · ROOTS',
        questions: [
          {
            id: 'roots_q1',
            label: 'If your clinic one day ceased to exist, what would be lost for your patients, for your team, and for yourself?',
            placeholder: 'Imagine your clinic is no longer there. What would you feel the most loss about?',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'roots_q2',
            label: 'What was your clinic born to serve? Write one sentence of no more than 2 lines.',
            placeholder: 'e.g., "This clinic was born to help people have a confident smile without worry."',
            type: 'textarea',
          },
          {
            id: 'roots_q3',
            label: 'If you could choose only 3 values that can never be compromised (even under financial pressure), which would you choose? Why?',
            placeholder: 'List 3 values and briefly explain why they can never be compromised.',
            type: 'textarea',
          },
          {
            id: 'roots_q4',
            label: 'Can you share a situation where you stood firm on a value, even though you had to sacrifice short-term benefit? How did that affect you?',
            placeholder: 'A true story — which value, what benefit was sacrificed, and what was the outcome.',
            type: 'textarea',
          },
          {
            id: 'roots_d1',
            label: 'Can you write your clinic\'s vision clearly in one sentence (no more than 15 words)?',
            type: 'select',
            scaleLabels: {
              1: 'Don\'t know what to write',
              2: 'Have an idea but not clear yet',
              3: 'Written but not fully confident',
              4: 'Clear — can share with everyone',
              5: 'Crystal clear — can quote it anytime',
            },
          },
          {
            id: 'roots_d2',
            label: 'Do all staff in your clinic understand and embody the 3 core values?',
            type: 'select',
            scaleLabels: {
              1: 'Not sure they understand',
              2: 'A few people understand',
              3: 'Most understand but inconsistently',
              4: 'Everyone understands and tries to embody them',
              5: 'Each person can explain and act according to the values',
            },
          },
          {
            id: 'roots_d3',
            label: 'Are your daily decisions aligned with the core values?',
            type: 'select',
            scaleLabels: {
              1: 'Frequently misaligned',
              2: 'Sometimes misaligned',
              3: 'Making effort but inconsistent',
              4: 'Largely aligned',
              5: 'Always aligned — values are the compass',
            },
          },
          {
            id: 'roots_q4_choice',
            label: 'When there\'s a conflict between financial benefit and your clinic\'s values, you usually:',
            type: 'radio',
            options: [
              'Stand firm on values, even at the cost of revenue',
              'Prioritize financial benefit',
              'Try to balance, but revenue usually comes first',
              'Still learning how to balance',
            ],
          },
        ],
      },
      {
        id: 'sky',
        title: 'PART 2: ETHICAL PILLAR — SKY',
        subtitle: 'Measuring 3 ethical qualities: Sincerity, Kindness, Yielding.',
        ref: 'Ch.24 — TO BE SKY',
        questions: [
          {
            id: 'sky_sin_open',
            label: 'Can you share a specific example where your clinic refused a service/consultation for honest reasons (not financial)? If not, why?',
            placeholder: 'e.g., "The patient wanted 8 veneers but the doctor recommended only 4 — truly not needed."',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'sky_s_d1',
            label: 'When you discover a patient needs more services but doesn\'t necessarily need them, you usually:',
            type: 'select',
            scaleLabels: {
              1: 'Often recommend additional services to increase revenue',
              2: 'Sometimes recommend when you see an opportunity',
              3: 'Try to be honest but sometimes pressured',
              4: 'Largely honest, even at the cost of revenue',
              5: 'Always accurate, even at the cost of revenue',
            },
          },
          {
            id: 'sky_s_d2',
            label: 'Can your staff be honest with patients when they have concerns or disagreements?',
            type: 'select',
            scaleLabels: {
              1: 'Often awkward, avoid it',
              2: 'Try but not confident',
              3: 'Trained but not yet proficient',
              4: 'Confident in most situations',
              5: 'Trained to be honest naturally and respectfully',
            },
          },
          {
            id: 'sky_k_open',
            label: 'How do patients in your clinic typically describe how they feel after leaving the dental chair? How do you know this?',
            placeholder: 'You can quote reviews, messages, or genuine feelings from patients.',
            type: 'textarea',
          },
          {
            id: 'sky_k_d1',
            label: 'Does your clinic staff regularly pay attention to patients\' emotions (not just their clinical condition)?',
            type: 'select',
            scaleLabels: {
              1: 'Almost never',
              2: 'Sometimes when there\'s a problem',
              3: 'Making effort but not yet a culture',
              4: 'This is the habit in most interactions',
              5: 'This is the standard — every interaction includes care',
            },
          },
          {
            id: 'sky_k_d2',
            label: 'Do you care about your staff\'s mental well-being and personal growth, not just their performance?',
            type: 'select',
            scaleLabels: {
              1: 'Only care when there\'s a problem',
              2: 'Occasionally check in',
              3: 'Making effort but not regularly',
              4: 'This is an important part of management',
              5: 'This is my duty — every person needs to grow',
            },
          },
          {
            id: 'sky_y_open',
            label: 'The last time you admitted you were wrong to a staff member or patient and changed your action? What was the hardest part?',
            placeholder: 'A true story — where you were wrong, what was hardest, and what happened.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'sky_y_d1',
            label: 'When staff feedback that a process isn\'t working, you usually:',
            type: 'select',
            scaleLabels: {
              1: 'Uncomfortable, usually defend the process',
              2: 'Listen but rarely change',
              3: 'Consider but usually keep things as is',
              4: 'Listen and ready to adjust',
              5: 'Listen, consider, and adjust if reasonable',
            },
          },
          {
            id: 'sky_y_d2',
            label: 'Are you usually the last person in the clinic to change your mind?',
            type: 'select',
            scaleLabels: {
              1: 'Very hard to change once decided',
              2: 'Need very strong reasons to change',
              3: 'Trying but sometimes stubborn',
              4: 'Easy to change when seeing reasonable information',
              5: 'Always ready to change — that\'s strength, not weakness',
            },
          },
        ],
      },
      {
        id: 'stars',
        title: 'PART 3: CAPABILITY MAP — S.T.A.R.S',
        subtitle: 'Evaluating 5 dimensions of capability: Skills, Traits, Actions, Results, Synergy.',
        ref: 'Ch.25 — S.T.A.R.S',
        questions: [
          {
            id: 'stars_s_d',
            label: 'Can your clinical team (doctors, assistants) maintain consistent treatment quality?',
            type: 'select',
            scaleLabels: {
              1: 'Heavily dependent on individuals',
              2: 'A few strong people, rest are weak',
              3: 'Stable but not consistent',
              4: 'Stable in most situations',
              5: 'Absolutely stable — not dependent on any individual',
            },
          },
          {
            id: 'stars_s_open',
            label: 'Who in your team is currently "most aligned with values"? Who needs development? Why do you think so?',
            placeholder: 'List names and reasons — brief is fine.',
            type: 'textarea',
          },
          {
            id: 'stars_t_d',
            label: 'Your current hiring approach: do you hire for "values fit" first, "competence" second?',
            type: 'select',
            scaleLabels: {
              1: 'Usually hire for competence first',
              2: 'See both but usually lean toward competence',
              3: 'Trying but no clear rule yet',
              4: 'Clear distinction — values are the first criterion',
              5: 'Always values first — competence can be trained',
            },
          },
          {
            id: 'stars_t_open',
            label: 'Give a specific example where your team acted correctly under heavy pressure. And one example where they didn\'t.',
            placeholder: 'Two situations — one success, one needing improvement. Brief.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'stars_a_d',
            label: 'Have your key processes (reception, consultation, treatment, aftercare) been standardized and consistently implemented?',
            type: 'select',
            scaleLabels: {
              1: 'Mostly situational',
              2: 'Written down but few follow',
              3: 'Being implemented but not yet stable',
              4: 'Clear processes, consistently followed',
              5: 'Processes live in the culture — people follow because they understand, not because they\'re forced',
            },
          },
          {
            id: 'stars_a_open',
            label: 'If you could train just ONE more skill for your entire team right now, what would it be? Why?',
            placeholder: 'Just one — and explain why.',
            type: 'textarea',
          },
          {
            id: 'stars_r_d',
            label: 'Do you have a system to measure results beyond revenue — including treatment quality, patient satisfaction, and team growth?',
            type: 'select',
            scaleLabels: {
              1: 'Only measure revenue',
              2: 'Measure a few additional metrics',
              3: 'Trying to measure more but no system yet',
              4: 'Have a multi-dimensional measurement system',
              5: 'Measurement reflects SKY — not just results, but how results are achieved',
            },
          },
          {
            id: 'stars_syn_choice',
            label: 'When a team member completes a treatment, the coordination between departments (reception, consultation, assistants, billing) is:',
            type: 'radio',
            options: [
              'Very costly, information is often lost',
              'Stable but not yet smooth',
              'Good, everyone understands each other\'s roles',
              'Excellent, creating value beyond individual tasks',
            ],
          },
          {
            id: 'stars_syn_d',
            label: 'Does the relationship between departments in your clinic create strength greater than the sum of individual parts?',
            type: 'select',
            scaleLabels: {
              1: 'Each part operates independently',
              2: 'Sometimes coordinate but not yet in sync',
              3: 'Can coordinate but doesn\'t create added value',
              4: 'Coordinate well, creating added value',
              5: 'Always creates value beyond — the team is stronger than any individual',
            },
          },
          {
            id: 'stars_syn_open',
            label: 'What are you most proud of about your team? What worries you most?',
            placeholder: 'Both questions — pride and worry. Just write what you truly feel.',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'living',
        title: 'PART 4: THE LIVING SYSTEM',
        subtitle: 'Measuring how much your clinic operates as a "living system" rather than a "machine".',
        ref: 'Ch.22 — The Living System',
        questions: [
          {
            id: 'living_o1',
            label: 'Would you say your clinic is closer to a "living system" or a "machine"? If your clinic were a living organism, what stage would it be in: still dreaming, growing, or mature?',
            placeholder: 'Describe naturally — no theory needed, just what you truly feel.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'living_o2',
            label: 'What in your clinic is working best right now? What\'s the weakest? Do you see the difference between these two?',
            placeholder: 'Write two things: what\'s strongest + what\'s weakest.',
            type: 'textarea',
          },
          {
            id: 'living_d1',
            label: 'Does your clinic have a mechanism to "self-learn" from mistakes? (e.g., analyzing adverse events, learning from patient complaints)',
            type: 'select',
            scaleLabels: {
              1: 'No mechanism',
              2: 'Yes, but only for major issues',
              3: 'Trying but not yet habitual',
              4: 'Yes, and it\'s being implemented',
              5: 'Yes, and genuinely used for improvement — this is the culture',
            },
          },
          {
            id: 'living_d2',
            label: 'Is non-financial quality data being used to make decisions?',
            type: 'select',
            scaleLabels: {
              1: 'Rarely',
              2: 'Sometimes reviewed',
              3: 'Trying to collect but not yet using',
              4: 'Used for decision-making',
              5: 'Always the basis for decisions',
            },
          },
          {
            id: 'living_d3',
            label: 'Do staff feel safe to report errors, give opinions, and learn from each other?',
            type: 'select',
            scaleLabels: {
              1: 'No, they\'re usually afraid',
              2: 'A few people dare, most don\'t',
              3: 'Trying to build but not yet there',
              4: 'Most people feel safe',
              5: 'Yes, this is the culture — everyone learns from each other',
            },
          },
          {
            id: 'living_d4',
            label: 'Do you feel that the relationship between you and your team is maturing?',
            type: 'select',
            scaleLabels: {
              1: 'Quite static — nothing new',
              2: 'Occasionally some change',
              3: 'Gradually improving',
              4: 'Good — there\'s trust and understanding',
              5: 'Excellent — both sides are growing together',
            },
          },
        ],
      },
      {
        id: 'future',
        title: 'PART 5: POTENTIAL & FUTURE',
        subtitle: 'Understanding your mindset, hopes, and pressures — helping your consultant see the gap between current state and vision.',
        ref: '',
        questions: [
          {
            id: 'future_o1',
            label: 'In the next 3 years, where do you see this clinic? Describe the scene: how many people, target revenue, patient experience quality, and your mood.',
            placeholder: 'Just imagine — doesn\'t need to be precise, just honest.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'future_o2',
            label: 'What\'s the biggest pressure you\'re facing right now? (Financial, staffing, competition, personal, or other?) How does this pressure affect your decisions?',
            placeholder: 'Write naturally — this is your space to breathe.',
            type: 'textarea',
          },
          {
            id: 'future_o3',
            label: 'What have you tried many times but haven\'t succeeded? Why do you think that is?',
            placeholder: 'No analysis needed — just tell the story.',
            type: 'textarea',
          },
        ],
      },
      {
        id: 'commit',
        title: 'PART 6: COMMITMENT — BEFORE THE CONSULTING SESSION',
        subtitle: 'Creating clarity and motivation before starting the consulting journey.',
        ref: '',
        questions: [
          {
            id: 'commit_o1',
            label: 'Are you ready to see things about your clinic that aren\'t easy to face? These may be uncomfortable, but they\'re the foundation for real change. What worries you most about that?',
            placeholder: 'Be honest — this question is not for evaluation.',
            type: 'textarea',
            anchor: true,
          },
          {
            id: 'commit_o2',
            label: 'Starting tomorrow, can you do one small thing to show change? Describe that thing.',
            placeholder: 'One specific small action — doesn\'t need to be big, just real.',
            type: 'textarea',
          },
          {
            id: 'commit_choice',
            label: 'You commit to yourself that:',
            type: 'radio',
            options: [
              'I want to deeply understand my clinic from root to surface',
              'I\'m ready to change when I see the right information',
              'I understand that success takes time and I\'m patient',
              'All of the above',
            ],
          },
        ],
      },
    ],
  },
};
