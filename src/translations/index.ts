
import enTranslations from './en';
import frTranslations from './fr';

export type Language = "en" | "fr";

export type TranslationKey = keyof typeof enTranslations;

export const translations = {
  en: enTranslations,
  fr: frTranslations
};

export default translations;
