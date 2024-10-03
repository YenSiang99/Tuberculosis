// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import msTranslation from "./locales/ms/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    ms: { translation: msTranslation },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback language
  interpolation: { escapeValue: false }, // React already handles escaping
});

export default i18n;
