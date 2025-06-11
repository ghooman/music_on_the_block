import 'dotenv/config';
import fs from 'fs';
import { GoogleSpreadsheet } from 'google-spreadsheet';
const SHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_TRANSLATE_KEY;

(async function makeJson() {
  const doc = new GoogleSpreadsheet(SHEET_ID, {
    apiKey: API_KEY,
  });

  await doc.loadInfo();
  const sheets = doc.sheetCount;

  for (let i = 0; i < sheets; i++) {
    // 시트 돌리는 거
    const sheet = doc.sheetsByIndex[i];
    await sheet.loadCells();
    const rows = await sheet.getRows();
    let langs = ['en', 'ko', 'id']; // ['ko', 'en', 'it']

    const jsonData = {};

    langs.forEach((language, index) => {
      for (let j = 1; j <= rows.length; j++) {
        jsonData[sheet.getCell(j, 1).value] = sheet.getCell(j, index + 1).value;
        jsonData[sheet.getCell(j, 1).value] = sheet.getCell(j, index + 1).value;
      }

      const jsonString = JSON.stringify(jsonData, null, 1);

      // JSON 파일 생성
      fs.writeFileSync(`./src/i18n_locales/${language}/${sheet.title}.json`, jsonString);
    });
  }
})();
