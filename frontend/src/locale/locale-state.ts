import i18n from './i18n';
import { allLangs, defaultLang, LocaleConfig } from './config-lang';

// ----------------------------------------------------------------------

let currentLocaleValue = defaultLang.value;

// Sync with i18next language changes
i18n.on('languageChanged', (lng: string) => {
  currentLocaleValue = lng;
});

// Initialize from i18next current language
if (i18n.language) {
  currentLocaleValue = i18n.language;
}

export function getCurrentLocale(): string {
  return currentLocaleValue;
}

export function getLocaleConfig(locale?: string): LocaleConfig {
  const target = locale || currentLocaleValue;
  return allLangs.find((l) => l.value === target) || defaultLang;
}

export function getFormatConfig(locale?: string) {
  return getLocaleConfig(locale).formatting;
}
