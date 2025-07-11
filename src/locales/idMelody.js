const idMelody = {
  chatbot: {
    initialMessage:
      'Mari kita mulai membuat melodi!\nSilakan beri tahu saya genre musik yang ingin Anda buat.\n',
    systemMessage:
      'Anda adalah pakar pembuatan melodi yang ramah dan bersahabat, yang membantu pengguna dalam menyusun musik. Pastikan untuk menanyakan setiap poin berikut satu per satu agar pengguna dapat membuat melodi yang mereka inginkan:\n\n' +
      '1. Tanyakan kepada pengguna untuk memilih "Genre" lagu.\n' +
      '2. Tanyakan kepada pengguna untuk mengisi "Tag".\n' +
      '3. Tanyakan kepada pengguna untuk mengisi "Judul Lagu".\n' +
      '4. Tanyakan kepada pengguna untuk memilih "Suara" (pria atau wanita).\n' +
      '5. Tanyakan kepada pengguna instrumen apa yang ingin digunakan (misalnya: piano, drum).\n' +
      '6. Pandu pengguna untuk menjawab "Tempo (BGM)" hanya dengan angka antara 60 hingga 120.\n' +
      '7. Tanyakan "Elemen Tambahan" (misalnya efek suara) yang dapat menambah semangat pada lagu.\n' +
      '8. Tanyakan kepada pengguna untuk menulis "Deskripsi Lagu".\n\n' +
      '**9. Hanya jika semua 8 informasi — "Tag, Judul Lagu, Genre, Suara, Instrumen, Tempo, Elemen Tambahan, Deskripsi Lagu" — telah diisi dengan lengkap**, tampilkan blok **Prompt Akhir** berikut **satu kali saja**. Jika belum lengkap, jangan tampilkan blok ini.\n\n' +
      `[Prompt Akhir]\n` +
      `Tag: {tags}\n` +
      `Judul Lagu: {title}\n` +
      `Genre: {genre}\n` +
      `Suara: {voice}\n` +
      `Instrumen: {instruments}\n` +
      `Tempo: {tempo}\n` +
      `Elemen Tambahan: {additional}\n` +
      `Deskripsi Lagu: {introduction}\n`,
  },
  extraction: {
    tagRegex:
      /Tag\s*[:：\-]\s*([^,\n\r]+(?:\s*,\s*[^,\n\r]+)*?)(?=\s*(?:Judul|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    titleRegex:
      /(?:Judul Lagu|Judul)\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    genreRegex:
      /Genre\s*[:：\-]\s*([^,\n]+(?:\s*,\s*[^,\n]+)*?)(?=\s+(?:Tag|Judul|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    voiceRegex:
      /Suara\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    instrumentRegex:
      /Instrumen\s*[:：\-]\s*([^\n]+?)(?=\s*(?:Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Suara|Instrumen|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    detailRegex: /Elemen Tambahan\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Deskripsi Lagu|Prompt Akhir)|$)/i,
    introductionRegex:
      /Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*(Prompt akhir|Sekarang|Ayo mulai|Apakah kamu siap|$))/i,
    promptTagRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Tag\s*[:：\-]\s*([^,\n]+?)(?=\s*(?:Judul|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptTagRegex2:
      /Tag\s*[:：\-]\s*([^,\n]+?)(?=\s*\n\s*(?:Judul|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu))/i,
    promptTagRegex3:
      /^([^,\n]+(?:\s*,\s*[^,\n]+)*?)(?=\s*\n\s*(?:Judul|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu))/im,
    promptTitleRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?(?:Judul Lagu|Judul)\s*[:：\-]\s*([^,\n]+?)(?=\s*(?:Tag|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptGenreRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Genre\s*[:：\-]\s*([^,\n]+?)(?=\s*(?:Tag|Judul|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptVoiceRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Suara\s*[:：\-]\s*([^,\n]+?)(?=\s*(?:Tag|Judul|Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptInstrumentRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Instrumen\s*[:：\-]\s*([^\n]+?)(?=\s*(?:Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptTempoRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s*(?:Tag|Judul|Genre|Suara|Instrumen|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    promptDetailRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Elemen Tambahan\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Deskripsi Lagu)|$)/i,
    promptIntroductionRegex:
      /(?:Prompt\s*Akhir|최종\s*프롬프트)[\s\S]*?Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*$)/i,
  },
};

export default idMelody;
