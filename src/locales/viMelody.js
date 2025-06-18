// locales/viMelody.js
const viMelody = {
  chatbot: {
    initialMessage: 'Hãy cho tôi biết thể loại giai điệu bạn muốn tạo!\n',
    systemMessage:
      'Bạn là chuyên gia sáng tác và trợ lý chuyên về tạo giai điệu. Hãy chắc chắn hướng dẫn người dùng theo thứ tự sau:\n\n' +
      '1. Hỏi họ chọn thể loại bài hát.\n' +
      '2. Bắt buộc nhập "Thẻ" cách nhau bằng dấu phẩy. (Nếu không có, nhập "Không có")\n' +
      '3. Bắt buộc nhập "Tiêu đề" của bài hát.\n' +
      '4. Hỏi chọn giọng hát (Nam hoặc Nữ).\n' +
      '5. Hỏi về nhạc cụ muốn sử dụng (Piano, trống, v.v.).\n' +
      '6. Hướng dẫn trả lời chỉ bằng số tempo từ 60 đến 120.\n' +
      '7. Hỏi về yếu tố bổ sung để làm sống động bài hát (hiệu ứng âm thanh, v.v.).\n' +
      '8. Yêu cầu viết đoạn giới thiệu về bài hát.\n\n' +
      '**9. Tuy nhiên, chỉ khi cả 8 thông tin "Thẻ, Tiêu đề, Thể loại, Giọng hát, Nhạc cụ, Tempo, Yếu tố thêm, Giới thiệu" đều được nhập**, mới xuất khối **Lời nhắc cuối cùng** một lần. Nếu không, không được xuất.\n\n' +
      `[Lời nhắc cuối cùng]\n` +
      `Thẻ: {Thẻ}\n` +
      `Tiêu đề: {Tiêu đề}\n` +
      `Thể loại: {Thể loại}\n` +
      `Giọng hát: {Giọng hát}\n` +
      `Nhạc cụ: {Nhạc cụ}\n` +
      `Tempo: {Tempo}\n` +
      `Yếu tố thêm: {Yếu tố thêm}\n` +
      `Giới thiệu: {Giới thiệu}\n`,
  },
  extraction: {
    tagRegex:
      /Thẻ\s*[:：\-]\s*([^,\n\r]+(?:\s*,\s*[^,\n\r]+)*?)(?=\s*(?:Tiêu đề|Thể loại|Giọng hát|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    titleRegex:
      /(?:Tiêu đề|Tên bài hát)\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thể loại|Giọng hát|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    genreRegex:
      /Thể loại\s*[:：\-]\s*([^,\n]+(?:\s*,\s*[^,\n]+)*?)(?=\s+(?:Thẻ|Tiêu đề|Giọng hát|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    voiceRegex:
      /Giọng hát\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thẻ|Tiêu đề|Thể loại|Nhạc cụ|Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    instrumentRegex: /Nhạc cụ\s*[:：\-]\s*([^\n]+?)(?=\s*\n\s*(?:Tempo|Yếu tố thêm|Giới thiệu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Thẻ|Tiêu đề|Thể loại|Giọng hát|Nhạc cụ|Yếu tố thêm|Giới thiệu)|$)/i,
    detailRegex:
      /Yếu tố thêm\s*(?:[:\/]{1,2})?\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Giới thiệu|Lời nhắc cuối cùng)|$)/i,
    introductionRegex: /Giới thiệu\s*[:：\-]\s*([\s\S]*?)(?=\s*Lời nhắc cuối cùng|$)/i,
    promptTagRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Thẻ\s*\(\s*([^)]+)\s*\)/i,
    promptTitleRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Tiêu đề\s*\(\s*([^)]+)\s*\)/i,
    promptGenreRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Thể loại\s*\(\s*([^)]+)\s*\)/i,
    promptVoiceRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Giọng hát\s*\(\s*([^)]+)\s*\)/i,
    promptInstrumentRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Nhạc cụ\s*\(\s*([^)]+)\s*\)/i,
    promptTempoRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Tempo\s*\(\s*([^)]+)\s*\)/i,
    promptDetailRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Yếu tố thêm\s*\(\s*([^)]+)\s*\)/i,
    promptIntroductionRegex: /(?:Lời nhắc cuối cùng|Prompt)[\s\S]*?Giới thiệu\s*\(\s*([^)]+)\s*\)/i,
  },
};
export default viMelody;
