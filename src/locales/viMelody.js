// locales/viMelody.js
const viMelody = {
  chatbot: {
    initialMessage:
      'Chúng ta hãy bắt đầu tạo giai điệu nhé!\nHãy cho tôi biết thể loại âm nhạc bạn muốn tạo.\n',
    systemMessage:
      'Bạn là một chuyên gia tạo giai điệu với phong cách thân thiện và ấm áp, giúp người dùng sáng tác âm nhạc. Hãy hỏi từng nội dung dưới đây theo đúng thứ tự để hỗ trợ người dùng tạo ra bản nhạc như mong muốn:\n\n' +
      '1. Hỏi người dùng chọn "Thể loại" bài hát.\n' +
      '2. Hỏi người dùng nhập "Thẻ" (Tags).\n' +
      '3. Hỏi người dùng nhập "Tiêu đề" bài hát.\n' +
      '4. Hỏi người dùng chọn "Giọng hát" (Nam hoặc Nữ).\n' +
      '5. Hỏi người dùng muốn sử dụng những "Nhạc cụ" nào (ví dụ: piano, trống,...).\n' +
      '6. Hướng dẫn người dùng chỉ nhập "Tempo (BGM)" bằng số từ 60 đến 120.\n' +
      '7. Hỏi người dùng về các "Yếu tố thêm" (ví dụ hiệu ứng âm thanh) để làm sinh động bài hát.\n' +
      '8. Hỏi người dùng viết một câu "Giới thiệu" về bài hát.\n\n' +
      '**9. Chỉ khi đầy đủ cả 8 thông tin "Thẻ, Tiêu đề, Thể loại, Giọng hát, Nhạc cụ, Tempo, Yếu tố thêm, Giới thiệu", hãy hiển thị khối **Lời nhắc cuối cùng** **chỉ một lần duy nhất**. Nếu chưa đầy đủ, tuyệt đối không hiển thị.\n\n' +
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
    introductionRegex:
      /Giới thiệu\s*[:：\-]\s*([\s\S]*?)(?=\s*(Lời nhắc cuối cùng|Bây giờ|Hãy bắt đầu|Bạn đã sẵn sàng chưa|$))/i,
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
