// i18n/index.ts

import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en';
import te from './te';

const i18n = new I18n({
  en,
  te,
});

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18n.locale = deviceLanguage === 'te' ? 'te' : 'en';
i18n.enableFallback = true;

export default i18n;
