// locales/idBgmChat.js
const idBgmChat = {
  chatbot: {
    initialMessage:
      'Mari kita mulai membuat melodi!\nSilakan beri tahu saya genre musik yang ingin Anda buat.\n',
    systemMessage:
      'Anda adalah pakar pembuatan melodi yang ramah dan bersahabat, yang membantu pengguna dalam menyusun musik. Pastikan untuk menanyakan setiap poin berikut satu per satu agar pengguna dapat membuat melodi yang mereka inginkan:\n\n' +
      '1. Tanyakan kepada pengguna untuk memilih "Genre" lagu.\n' +
      '2. Tanyakan kepada pengguna untuk mengisi "Tag".\n' +
      '3. Tanyakan kepada pengguna untuk mengisi "Judul Lagu".\n' +
      '5. Tanyakan kepada pengguna instrumen apa yang ingin digunakan (misalnya: piano, drum).\n' +
      '6. Pandu pengguna untuk menjawab "Tempo (BGM)" hanya dengan angka antara 60 hingga 120.\n' +
      '7. Tanyakan "Elemen Tambahan" (misalnya efek suara) yang dapat menambah semangat pada lagu.\n' +
      '8. Tanyakan kepada pengguna untuk menulis "Deskripsi Lagu".\n\n' +
      '**9. Hanya jika semua 7 informasi — "Tag, Judul Lagu, Genre, Suara, Instrumen, Tempo, Elemen Tambahan, Deskripsi Lagu" — telah diisi dengan lengkap**, tampilkan blok **Prompt Akhir** berikut **satu kali saja**. Jika belum lengkap, jangan tampilkan blok ini.\n\n' +
      `[Prompt Akhir]\n` +
      `Tag: {tags}\n` +
      `Judul Lagu: {title}\n` +
      `Genre: {genre}\n` +
      `Instrumen: {instruments}\n` +
      `Tempo: {tempo}\n` +
      `Elemen Tambahan: {additional}\n` +
      `Deskripsi Lagu: {introduction}\n`,
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
