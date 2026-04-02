import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANG_CODES } from '@shared/domain';

import sr from '@/locales/sr.json';
import hr from '@/locales/hr.json';
import en from '@/locales/en.json';
import de from '@/locales/de.json';
import it from '@/locales/it.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';

/**
 * UI-facing language descriptors.
 * Codes are authoritative from SUPPORTED_LANG_CODES; label and flag are
 * display-only and live here rather than in shared/domain.ts.
 */
export const languages = [
  { code: 'sr', label: 'Srpski',   flag: '🇷🇸' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'en', label: 'English',  flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sr: { translation: sr },
      hr: { translation: hr },
      en: { translation: en },
      de: { translation: de },
      it: { translation: it },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: 'sr',
    // Derived from the shared source of truth — no manual list to keep in sync.
    supportedLngs: [...SUPPORTED_LANG_CODES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'tinytastesteps-lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
