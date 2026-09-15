import { create } from 'zustand';
import { Language, UiMode, translations, Translations } from '../i18n/translations';

interface LanguageState {
  language: Language;
  uiMode: UiMode;
  t: Translations;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setUiMode: (mode: UiMode) => void;
  toggleUiMode: () => void;
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('elevate_language');
  if (saved === 'ar' || saved === 'en') {
    return saved;
  }
  // Default to Arabic as requested by user
  return 'ar';
};

const getInitialUiMode = (): UiMode => {
  const saved = localStorage.getItem('elevate_ui_mode');
  if (saved === 'beginner' || saved === 'advanced') {
    return saved;
  }
  // Default to beginner mode as requested by user ("جعل الواجهة بسيطة ومناسبة للمستخدمين المبتدئين")
  return 'beginner';
};

const initialLang = getInitialLanguage();
const initialUi = getInitialUiMode();

// Apply document attributes immediately
if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLang;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLang,
  uiMode: initialUi,
  t: translations[initialLang],
  dir: initialLang === 'ar' ? 'rtl' : 'ltr',

  setLanguage: (lang) => {
    localStorage.setItem('elevate_language', lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
    set({
      language: lang,
      t: translations[lang],
      dir,
    });
  },

  toggleLanguage: () => {
    set((state) => {
      const nextLang: Language = state.language === 'ar' ? 'en' : 'ar';
      localStorage.setItem('elevate_language', nextLang);
      const dir = nextLang === 'ar' ? 'rtl' : 'ltr';
      if (typeof document !== 'undefined') {
        document.documentElement.dir = dir;
        document.documentElement.lang = nextLang;
      }
      return {
        language: nextLang,
        t: translations[nextLang],
        dir,
      };
    });
  },

  setUiMode: (mode) => {
    localStorage.setItem('elevate_ui_mode', mode);
    set({ uiMode: mode });
  },

  toggleUiMode: () => {
    set((state) => {
      const nextMode: UiMode = state.uiMode === 'beginner' ? 'advanced' : 'beginner';
      localStorage.setItem('elevate_ui_mode', nextMode);
      return { uiMode: nextMode };
    });
  },
}));
