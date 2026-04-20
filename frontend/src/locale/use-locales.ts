import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect } from 'react';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { allLangs, defaultLang, LocaleConfig } from './config-lang';
import i18n from './i18n';
// ----------------------------------------------------------------------

export type CurrentLang = LocaleConfig;

export function useLocales() {
  const { t } = useTranslation();

  const settings = useSettingsContext();

  const [currentLang, setCurrentLang] = useState<CurrentLang>(
    allLangs.find((lang) => lang.value === i18n.language) || defaultLang
  );

  // Listen to language changes and update state
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLang = allLangs.find((lang) => lang.value === lng) || defaultLang;
      setCurrentLang(newLang);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const onChangeLang = useCallback(
    (newlang: string) => {
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
    },
    [settings]
  );

  return {
    allLangs,
    t,
    currentLang,
    onChangeLang,
  };
}
