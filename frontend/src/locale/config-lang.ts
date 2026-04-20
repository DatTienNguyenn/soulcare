// @mui
import { Localization, enUS, viVN } from '@mui/material/locale';
import { enUS as enUSAdapter, vi as viVNAdapter } from 'date-fns/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export interface LocaleFormatting {
  dateFormat: string;
  dateTimeFormat: string;
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ';
  useChineseNumerals: boolean;
  currency: 'USD' | 'VND' | 'EUR' | 'CNY';
}

export interface LocaleConfig {
  label: string;
  value: string;
  systemValue: Localization;
  icon: string;
  adapterLocale: Locale;
  formatting: LocaleFormatting;
}

export const allLangs: LocaleConfig[] = [
  {
    label: 'Tiếng Việt',
    value: 'vi-VN',
    systemValue: viVN,
    icon: 'flagpack:vn',
    adapterLocale: viVNAdapter,
    formatting: {
      dateFormat: 'dd/MM/yyyy',
      dateTimeFormat: 'dd/MM/yyyy HH:mm',
      decimalSeparator: ',',
      thousandsSeparator: '.',
      useChineseNumerals: false,
      currency: 'VND',
    },
  },
  {
    label: 'English',
    value: 'en-US',
    systemValue: enUS,
    icon: 'flagpack:us',
    adapterLocale: enUSAdapter,
    formatting: {
      dateFormat: 'MM/dd/yyyy',
      dateTimeFormat: 'MM/dd/yyyy hh:mm a',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      useChineseNumerals: false,
      currency: 'USD',
    },
  },
];

export const defaultLang = allLangs[1]; // English
