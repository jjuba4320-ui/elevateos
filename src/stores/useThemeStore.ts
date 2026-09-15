import { create } from 'zustand';
import { ThemePreset, ThemeConfig } from '../types';

export const THEME_PRESETS: Record<ThemePreset, { name: string; description: string; colors: ThemeConfig }> = {
  dark_neon: {
    name: 'Dark Neon',
    description: 'Electric cyan and neon lime accents on deep jet black',
    colors: {
      preset: 'dark_neon',
      primaryAccent: '#06b6d4', // cyan-500
      secondaryAccent: '#10b981', // emerald-500
      bgDark: '#090d16',
      cardBg: '#0f172a',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      borderSubtle: '#1e293b',
      blueLightFilter: false,
    },
  },
  midnight_gold: {
    name: 'Midnight Gold',
    description: 'Obsidian base with warm champagne amber accents',
    colors: {
      preset: 'midnight_gold',
      primaryAccent: '#f59e0b', // amber-500
      secondaryAccent: '#eab308',
      bgDark: '#0c0a09',
      cardBg: '#1c1917',
      textPrimary: '#fafaf9',
      textSecondary: '#a8a29e',
      borderSubtle: '#292524',
      blueLightFilter: false,
    },
  },
  cyberpunk_slate: {
    name: 'Cyberpunk Slate',
    description: 'Deep indigo slate with ultraviolet & electric violet hues',
    colors: {
      preset: 'cyberpunk_slate',
      primaryAccent: '#8b5cf6', // violet-500
      secondaryAccent: '#ec4899',
      bgDark: '#0b0c15',
      cardBg: '#131424',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      borderSubtle: '#242540',
      blueLightFilter: false,
    },
  },
  pastel_warm: {
    name: 'Pastel Warm',
    description: 'Sophisticated warm stone and soft terracotta atmosphere',
    colors: {
      preset: 'pastel_warm',
      primaryAccent: '#f97316', // orange-500
      secondaryAccent: '#fb923c',
      bgDark: '#171412',
      cardBg: '#231e1a',
      textPrimary: '#fafaf9',
      textSecondary: '#a8a29e',
      borderSubtle: '#332b25',
      blueLightFilter: false,
    },
  },
  forest_emerald: {
    name: 'Forest Emerald',
    description: 'Deep alpine pine with tranquil sage and jade accents',
    colors: {
      preset: 'forest_emerald',
      primaryAccent: '#10b981', // emerald-500
      secondaryAccent: '#84cc16',
      bgDark: '#06130d',
      cardBg: '#0c1e16',
      textPrimary: '#f0fdf4',
      textSecondary: '#86efac',
      borderSubtle: '#143828',
      blueLightFilter: false,
    },
  },
};

interface ThemeState {
  theme: ThemeConfig;
  preset: ThemePreset;
  isBlueLightFilterOn: boolean;
  setPreset: (preset: ThemePreset) => void;
  setPrimaryAccent: (color: string) => void;
  toggleBlueLightFilter: () => void;
}

const savedTheme = localStorage.getItem('elevate_theme_config');
const initialTheme: ThemeConfig = savedTheme
  ? JSON.parse(savedTheme)
  : THEME_PRESETS.dark_neon.colors;

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  preset: initialTheme.preset,
  isBlueLightFilterOn: initialTheme.blueLightFilter,

  setPreset: (preset) => {
    set((state) => {
      const base = THEME_PRESETS[preset].colors;
      const next = {
        ...base,
        blueLightFilter: state.isBlueLightFilterOn,
      };
      localStorage.setItem('elevate_theme_config', JSON.stringify(next));
      return { theme: next, preset };
    });
  },

  setPrimaryAccent: (color) => {
    set((state) => {
      const next = { ...state.theme, primaryAccent: color };
      localStorage.setItem('elevate_theme_config', JSON.stringify(next));
      return { theme: next };
    });
  },

  toggleBlueLightFilter: () => {
    set((state) => {
      const nextFilter = !state.isBlueLightFilterOn;
      const next = { ...state.theme, blueLightFilter: nextFilter };
      localStorage.setItem('elevate_theme_config', JSON.stringify(next));
      return { theme: next, isBlueLightFilterOn: nextFilter };
    });
  },
}));
