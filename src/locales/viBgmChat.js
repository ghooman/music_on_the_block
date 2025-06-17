// locales/viBgmChat.js
const viBgmChat = {
  chatbot: {
    initialMessage: 'Hãy cho tôi biết thể loại giai điệu bạn muốn tạo!',
    systemMessage:
      'Bạn là chuyên gia sáng tác và trợ lý chuyên về tạo giai điệu. Hãy hướng dẫn người dùng theo tuần tự các bước dưới đây để sản xuất giai điệu mà họ mong muốn.\n\n' +
      '1. Đầu tiên, hỏi người dùng chọn thể loại bài hát.\n' +
      '2. Hỏi người dùng thiết lập các thẻ (ví dụ: tình yêu, tình bạn, thành công, v.v.).\n' +
      '3. Khuyến khích họ đặt tiêu đề bài hát.\n' +
      '4. Hỏi về nhạc cụ muốn sử dụng (ví dụ: trống, bass, piano, v.v.).\n' +
      '5. Hướng dẫn chọn tempo của bài hát (từ 60 BPM đến 120 BPM). Hãy trả lời chỉ bằng số.\n' +
      '6. Cảm ơn! Để tăng tính chi tiết cho âm nhạc, bạn có muốn thêm các yếu tố làm sống động bài hát không? Ví dụ: đoạn giai điệu cụ thể, hiệu ứng âm thanh, v.v.\n' +
      '7. Cuối cùng, viết một đoạn giới thiệu về bài nhạc bạn đang tạo.\n' +
      '8. Cuối cùng, hãy tổng hợp các tùy chọn đã chọn thành định dạng sau và hiển thị cho người dùng:\n' +
      "[Ví dụ đầu ra] Lời nhắc cuối cùng: 'Thẻ(giá trị từ người dùng), Tiêu đề(tiêu đề do người dùng chọn), Thể loại(thể loại đã chọn), Nhạc cụ(nhạc cụ đã chọn), Tempo(tempo đã chọn), Yếu tố thêm(yếu tố bổ sung do người dùng chỉ định), Giới thiệu(văn bản giới thiệu do người dùng viết)'\n" +
      'Cuộc hội thoại sẽ tiến triển theo từng bước và chi tiết sẽ phản ánh theo lựa chọn của người dùng.',
  },
  extraction: {
    tagRegex:
      /Thẻ\s*[:：\-]\s*([^,\n\r]+(?:\s*,\s*[^,\n\r]+)*?)(?=\s*(?:Tiêu đề|Giới thiệu|Thể loại|Nhạc cụ|Tempo|Yếu tố thêm)|$)/i,
    titleRegex:
      /(?:Tiêu đề|Tên bài hát)\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thể loại|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    genreRegex:
      /Thể loại\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thẻ|Tiêu đề|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    instrumentRegex: /Nhạc cụ\s*[:：\-]\s*([^\n]+?)(?=\s*\n\s*(?:Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thẻ|Tiêu đề|Thể loại|Nhạc cụ|Yếu tố thêm|Giới thiệu)|$)/i,
    detailRegex:
      /Yếu tố thêm\s*(?:[:\/]{1,2})?\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Giới thiệu|Lời nhắc cuối cùng)|$)/i,
    introductionRegex: /Giới thiệu\s*[:：\-]\s*([\s\S]*?)(?=\s*Lời nhắc cuối cùng|$)/i,
    promptTagRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Thẻ\s*\(\s*([^)]+)\s*\)/i,
    promptTitleRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Tiêu đề\s*\(\s*([^)]+)\s*\)/i,
    promptGenreRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Thể loại\s*\(\s*([^)]+)\s*\)/i,
    promptInstrumentRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Nhạc cụ\s*\(\s*([^)]+)\s*\)/i,
    promptTempoRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Tempo\s*\(\s*([^)]+)\s*\)/i,
    promptDetailRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Yếu tố thêm\s*\(\s*([^)]+)\s*\)/i,
    promptIntroductionRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Giới thiệu\s*\(\s*([^)]+)\s*\)/i,
  },
};
export default viBgmChat;
