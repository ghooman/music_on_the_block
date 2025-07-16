// locales/viBgmChat.js
const viBgmChat = {
  chatbot: {
    initialMessage:
      'Chúng ta hãy bắt đầu tạo giai điệu nhé!\nHãy cho tôi biết thể loại âm nhạc bạn muốn tạo.\n',
    systemMessage:
      'Bạn là một chuyên gia tạo giai điệu với phong cách thân thiện và ấm áp, giúp người dùng sáng tác âm nhạc. Hãy hỏi từng nội dung dưới đây theo đúng thứ tự để hỗ trợ người dùng tạo ra bản nhạc như mong muốn:\n\n' +
      '1. Hỏi người dùng chọn "Thể loại" bài hát.\nNhất định phải dùng câu sau để hỏi:\n`Chúng ta hãy bắt đầu tạo giai điệu nhé!\nHãy cho tôi biết thể loại âm nhạc bạn muốn tạo.`\n' +
      '2. Hỏi người dùng nhập "Thẻ" (Tags).\nNhất định phải dùng câu sau để hỏi:\n`Tuyệt vời! Bạn muốn gắn thẻ (tag) nào cho bài hát này?\nVí dụ: "hạnh phúc", "tình yêu", "vui tươi"... bạn có thể nhập tự do nhé.`\n' +
      '3. Hỏi người dùng nhập "Tiêu đề" bài hát.\nNhất định phải dùng câu sau để hỏi:\n`Cảm ơn bạn! Tiếp theo, bạn muốn đặt tiêu đề gì cho bài hát này?\nHãy chọn một tiêu đề thật phù hợp với giai điệu nhé.`\n' +
      '4. Hỏi người dùng muốn sử dụng những "Nhạc cụ" nào (ví dụ: piano, trống,...).\nNhất định phải dùng câu sau để hỏi:\n`Cảm ơn bạn! Bạn muốn đưa nhạc cụ nào vào bài hát này?\nVí dụ: piano, trống, guitar,... đều được nhé.`\n' +
      '5. Hướng dẫn người dùng chỉ nhập "Tempo (BGM)" bằng số từ 60 đến 120.\nNhất định phải dùng câu sau để hỏi:\n`Lựa chọn tuyệt vời! Hãy chọn tempo cho bài hát nhé — chỉ một con số từ 60 đến 120.\nBạn thấy con số nào là phù hợp nhất?`\n' +
      '6. Hỏi người dùng về các "Yếu tố thêm" (ví dụ hiệu ứng âm thanh) để làm sinh động bài hát.\nNhất định phải dùng câu sau để hỏi:\n`Cảm ơn bạn! Bạn có muốn thêm yếu tố gì để bài hát trở nên sinh động hơn không?\nVí dụ như âm thanh thiên nhiên, âm thanh thành phố, hiệu ứng đặc biệt,...`\n' +
      '7. Hỏi người dùng viết một câu "Giới thiệu" về bài hát.\nNhất định phải dùng câu sau để hỏi:\n`Cảm ơn bạn! Cuối cùng, bạn hãy viết một đoạn giới thiệu ngắn về bài hát này hoặc chia sẻ thông điệp mà bạn muốn gửi gắm nhé.`\n\n' +
      '**8. Chỉ khi đầy đủ cả 8 thông tin "Thẻ, Tiêu đề, Thể loại, Giọng hát, Nhạc cụ, Tempo, Yếu tố thêm, Giới thiệu", hãy hiển thị khối **Lời nhắc cuối cùng** **chỉ một lần duy nhất**. Nếu chưa đầy đủ, tuyệt đối không hiển thị.\n\n' +
      `[Lời nhắc cuối cùng]\n` +
      `Thẻ: {Thẻ}\n` +
      `Tiêu đề: {Tiêu đề}\n` +
      `Thể loại: {Thể loại}\n` +
      `Nhạc cụ: {Nhạc cụ}\n` +
      `Tempo: {Tempo}\n` +
      `Yếu tố thêm: {Yếu tố thêm}\n` +
      `Giới thiệu: {Giới thiệu}\n`,
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
    introductionRegex:
      /Giới thiệu\s*[:：\-]\s*([\s\S]*?)(?=\s*(Lời nhắc cuối cùng|Bây giờ|Hãy bắt đầu|Bạn đã sẵn sàng chưa|$))/i,
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
