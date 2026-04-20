import 'i18next';
import translationEnUS from '../languages/en-US.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translationEnUS;
    };
  }
}
