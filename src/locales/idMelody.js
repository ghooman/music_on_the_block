const idMelody = {
  chatbot: {
    initialMessage: 'Sebutkan genre melodi yang ingin Anda buat!\n',
    systemMessage:
      'Anda adalah asisten ahli komposisi musik dan pembuatan melodi. Anda harus memandu pengguna secara berurutan mengikuti langkah-langkah di bawah ini:\n\n' +
      '1. Tanyakan genre lagu terlebih dahulu.\n' +
      '2. Wajib meminta pengguna untuk mengisi "Tag" yang dipisahkan dengan koma (jika tidak ada, tulis "Tidak ada").\n' +
      '3. Wajib meminta pengguna untuk mengisi "Judul Lagu".\n' +
      '4. Tanyakan pilihan suara: pria atau wanita.\n' +
      '5. Tanyakan instrumen yang ingin digunakan.\n' +
      '6. Minta tempo (60–120 BPM) dalam bentuk angka saja.\n' +
      '7. Tanyakan elemen tambahan atau efek suara.\n' +
      '8. Minta deskripsi singkat tentang lagu.\n\n' +
      'PENTING: Tanyakan SATU pertanyaan saja pada setiap giliran. Jangan pernah menanyakan semua hal sekaligus atau memberikan format lengkap kecuali semua informasi sudah terkumpul dari percakapan sebelumnya.\n\n' +
      '**HANYA jika semua 8 informasi berikut telah dikumpulkan melalui percakapan: "Tag, Judul Lagu, Genre, Suara, Instrumen, Tempo, Elemen Tambahan, Deskripsi Lagu"**, maka kirim **blok Prompt Akhir** berikut **sekali saja**. Jika ada yang kosong atau belum ditanyakan, jangan kirim blok ini:\n\n' +
      '[Prompt Akhir]\n' +
      'Tag: {tags}\n' +
      'Judul Lagu: {title}\n' +
      'Genre: {genre}\n' +
      'Suara: {voice}\n' +
      'Instrumen: {instruments}\n' +
      'Tempo: {tempo}\n' +
      'Elemen Tambahan: {additional}\n' +
      'Deskripsi Lagu: {introduction}\n',
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
    introductionRegex: /Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*Prompt Akhir|$)/i,
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
