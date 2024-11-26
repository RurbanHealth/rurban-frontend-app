// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

// Import language translation files
import en from '../data/locales/en.json';
import ar from '../data/locales/ar.json';

// Detect language settings from the device
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  return locales.length ? locales[0].languageTag : 'en'; // Default to English
};

// i18n configuration
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    fallbackLng: 'en', // Fallback language
    lng: getDeviceLanguage(), // Detect and set the user's device language
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes HTML, so no need for this
    },
    compatibilityJSON: 'v3', // Adjust to your version if needed
  });

export default i18n;
