import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
//
import { defaultLang } from './config-lang';
//
import translationEnUS from './languages/en-US.json';
import translationViVN from './languages/vi-VN.json';

// ----------------------------------------------------------------------

const lng = localStorageGetItem('i18nextLng', defaultLang.value);

// Migrate old short codes to BCP-47 format
const migrationMap: Record<string, string> = {
  en: 'en-US',
  vi: 'vi-VN',
};

const migratedLng = (lng && migrationMap[lng]) || lng || defaultLang.value;
if (lng && migrationMap[lng]) {
  localStorage.setItem('i18nextLng', migrationMap[lng]);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: translationEnUS },
      'vi-VN': { translation: translationViVN },
    },
    lng: migratedLng,
    fallbackLng: migratedLng,
    debug: false,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
