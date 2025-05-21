import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { en as English } from '../i18n/language/en.js';
import { ko as 한국어 } from '../i18n/language/ko.js';

const languageDetectorOptions = {
  /**
   * @order : 감지 방법
   * @caches : 캐싱 장소
   */

  order: ['localStorage'],
  caches: ['localStorage'],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: languageDetectorOptions,
    resources: {
      English,
      한국어,
    },
    fallbackLng: 'English',
    ns: Object.keys(English), // 네임스페이스 선언
    defaultNS: 'main',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const translatedNationsName = ['English', '한국어'];
