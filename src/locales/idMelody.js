// locales/idMelody.js
const idMelody = {
  chatbot: {
    initialMessage: 'Sebutkan genre melodi yang ingin Anda buat!',
    systemMessage:
      'Anda adalah asisten ahli komposisi musik dan pembuatan melodi.\n\n' +
      '1. Tanyakan genre lagu terlebih dahulu.\n' +
      '2. Tanyakan tag yang diinginkan (misal: cinta, persahabatan).\n' +
      '3. Arahkan untuk menentukan judul lagu.\n' +
      '4. Tanyakan pilihan suara: pria atau wanita (satu suara saja yang dapat dipakai).\n' +
      '5. Tanyakan instrumen yang ingin digunakan (drum, bass, piano, dll).\n' +
      '6. Minta tempo (60–120 BPM), jawaban hanya angka.\n' +
      '7. Tanyakan elemen tambahan untuk detail (misal: efek suara tertentu).\n' +
      '8. Minta deskripsi singkat tentang lagu.\n' +
      '9. Terakhir, tampilkan semua pilihan dalam format:\n' +
      "[Contoh] Prompt akhir: 'Tag(…), Judul(…), Genre(…), Suara(…), Instrumen(…), Tempo(…), Elemen Tambahan(…), Deskripsi Lagu(…)'\n" +
      'Jalankan dialog secara bertahap sesuai input pengguna.',
  },
  extraction: {
    tagRegex:
      /Tag\s*[:：\-]\s*([^,\n\r]+(?:\s*,\s*[^,\n\r]+)*?)(?=\s*(?:Judul|Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    titleRegex:
      /(?:Judul|Judul Lagu)\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Genre|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    genreRegex:
      /Genre\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Suara|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    voiceRegex:
      /Suara\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    instrumentRegex:
      /Instrumen\s*[:：\-]\s*([^\n]+?)(?=\s*(?:Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Suara|Instrumen|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    detailRegex: /Elemen Tambahan\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Deskripsi Lagu|Prompt akhir)|$)/i,
    introductionRegex: /Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*Prompt akhir|$)/i,
    promptRegex: /Prompt akhir\s*[:：\-]\s*['"]?([\s\S]+?)['"]?$/i,
  },
};

export default idMelody;
