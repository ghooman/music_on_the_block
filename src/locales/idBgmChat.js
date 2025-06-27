// locales/idBgmChat.js
const idBgmChat = {
  chatbot: {
    initialMessage: 'Sebutkan genre melodi yang ingin Anda buat!',
    systemMessage:
      'Anda adalah asisten ahli komposisi musik dan pembuatan melodi.\n\n' +
      '1. Tanyakan kepada pengguna untuk memilih genre lagu yang diinginkan.\n' +
      '2. Tanyakan tag yang ingin dipakai. (misal: cinta, persahabatan, kesuksesan)\n' +
      '3. Arahkan pengguna untuk menentukan judul lagu.\n' +
      '4. Tanyakan instrumen yang ingin digunakan. (misal: drum, bass, piano)\n' +
      '5. Minta pengguna memilih tempo lagu (60–120 BPM). Jawaban hanya angka.\n' +
      '6. Tanyakan elemen tambahan untuk memperkaya detail (misal: melodi khusus, efek suara).\n' +
      '7. Minta pengguna menulis deskripsi singkat tentang lagu.\n' +
      '8. Setelah semua pilihan, tampilkan ringkasan dalam format berikut:\n' +
      "[Contoh] Prompt akhir: 'Tag(…), Judul(…), Genre(…), Instrumen(…), Tempo(…), Elemen Tambahan(…), Deskripsi Lagu(…)'\n" +
      'Lakukan langkah demi langkah dan sesuaikan respon berdasarkan input pengguna.',
  },
  extraction: {
    tagRegex:
      /Tag\s*[:：\-]\s*([^,\n\r]+(?:\s*,\s*[^,\n\r]+)*?)(?=\s*(?:Judul|Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    titleRegex:
      /(?:Judul|Judul Lagu)\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Genre|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    genreRegex:
      /Genre\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Instrumen|Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    instrumentRegex:
      /Instrumen\s*[:：\-]\s*([^\n]+?)(?=\s*(?:Tempo|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    tempoRegex:
      /Tempo\s*[:：\-]\s*([^,\n]+?)(?=\s+(?:Tag|Judul|Genre|Instrumen|Elemen Tambahan|Deskripsi Lagu)|$)/i,
    detailRegex: /Elemen Tambahan\s*[:：\-]\s*([\s\S]*?)(?=\s*(?:Deskripsi Lagu|Prompt akhir)|$)/i,
    introductionRegex: /Deskripsi Lagu\s*[:：\-]\s*([\s\S]*?)(?=\s*Prompt akhir|$)/i,
    promptRegex: /Prompt akhir\s*[:：\-]\s*['"]?([\s\S]+?)['"]?$/i,
  },
};

export default idBgmChat;
