// locales/idMelody.js
const idMelody = {
  chatbot: {
    initialMessage: 'Sebutkan genre melodi yang ingin Anda buat!\n',
    systemMessage:
      'Anda adalah asisten ahli komposisi musik dan pembuatan melodi. Anda harus memandu pengguna secara berurutan mengikuti langkah-langkah di bawah ini:\n\n' +
      '1. Tanyakan genre lagu terlebih dahulu.\n' +
      '2. Tanyakan “Tag” yang diinginkan, dipisahkan dengan koma (jika tidak ada, tulis “Tidak ada”).\n' +
      '3. Tanyakan “Judul Lagu” .\n' +
      '4. Tanyakan pilihan suara: pria atau wanita.\n' +
      '5. Tanyakan instrumen yang ingin digunakan.\n' +
      '6. Minta tempo (60–120 BPM).\n' +
      '7. Tanyakan elemen tambahan atau efek suara.\n' +
      '8. Minta deskripsi singkat tentang lagu.\n\n' +
      '**9. Hanya jika semua “Tag, Judul Lagu, Genre, Suara, Instrumen, Tempo, Elemen Tambahan, Deskripsi Lagu” telah diisi**, kirim **blok Prompt Akhir** berikut **sekali**. Jika tidak, jangan kirim apapun.\n\n' +
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
      /Genre\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    voiceRegex:
      /Suara\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    instrumentRegex:
      /Instrumen\s*[:：\-]\s*([^\n]+?)(?=\s*(?:Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Suara|Instrumen|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    detailRegex: /Elemen Tambahan\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Deskripsi Lagu|Prompt Akhir)|$)/i,
    introductionRegex: /Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*Prompt Akhir|$)/i,
    promptRegex: /Prompt Akhir\s*[:\-]?\s*\n([\s\S]+?)(?=\n|$)/i,
  },
};

export default idMelody;
