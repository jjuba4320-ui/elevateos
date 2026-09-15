import { useState } from 'react';
import {
  Moon,
  Palette,
  BarChart3,
  Share2,
  Terminal,
  Volume2,
  VolumeX,
  ChevronDown,
  RotateCcw,
  Globe,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';
import { useUserStore } from '../../stores/useUserStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { ThemePreset, UserRole } from '../../types';
import { soundscapeEngine } from '../../services/audioService';

interface NavbarProps {
  onOpenAnalytics: () => void;
  onOpenStoryCard: () => void;
  onOpenBlueprint: () => void;
  onReplayOnboarding: () => void;
}

export function Navbar({
  onOpenAnalytics,
  onOpenStoryCard,
  onOpenBlueprint,
  onReplayOnboarding,
}: NavbarProps) {
  const { theme, preset, setPreset, toggleBlueLightFilter, isBlueLightFilterOn } = useThemeStore();
  const { profile, setRole } = useUserStore();
  const { language, toggleLanguage, uiMode, toggleUiMode, t, dir } = useLanguageStore();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundscapeEngine.setMasterVolume(next ? 0 : 0.5);
  };

  const themeOptions: { id: ThemePreset; name: string; color: string }[] = [
    { id: 'dark_neon', name: 'Dark Neon', color: '#06b6d4' },
    { id: 'midnight_gold', name: 'Midnight Gold', color: '#eab308' },
    { id: 'cyberpunk_slate', name: 'Cyberpunk', color: '#ec4899' },
    { id: 'pastel_warm', name: 'Pastel Warm', color: '#fb923c' },
    { id: 'forest_emerald', name: 'Forest Emerald', color: '#10b981' },
  ];

  const roleList: UserRole[] = ['bac_student', 'athlete', 'professional', 'personal'];

  return (
    <header
      id="main-app-navbar"
      className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200"
      dir={dir}
      style={{
        backgroundColor: `${theme.bgDark}ee`,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Branding & Role Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-black text-sm shadow-md"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              ⚡
            </span>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                {t.appName}
              </span>
              <span className="text-[10px] font-medium text-neutral-400">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs font-semibold text-neutral-200 hover:border-neutral-700 transition"
              title={t.switchRole}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryAccent }} />
              <span className="line-clamp-1">{t.roles[profile.role]}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {showRoleMenu && (
              <div
                className={`absolute mt-2 w-56 rounded-2xl border p-1.5 shadow-2xl z-50 space-y-1 ${
                  dir === 'rtl' ? 'right-0' : 'left-0'
                }`}
                style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
              >
                <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                  {t.switchRole}
                </div>
                {roleList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                      profile.role === r
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white">{t.roles[r]}</div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{t.roleSubtitles[r]}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Controls & Toggles */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Beginner / Advanced Mode Switcher Pill */}
          <button
            onClick={toggleUiMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              uiMode === 'beginner'
                ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-300'
                : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-700'
            }`}
            title={uiMode === 'beginner' ? t.simpleModeDesc : t.advancedModeDesc}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {uiMode === 'beginner' ? t.simpleMode : t.advancedMode}
            </span>
          </button>

          {/* Language Switcher (AR / EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs font-bold text-neutral-200 hover:text-white hover:border-neutral-700 transition"
            title={t.switchLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-sans text-[11px]">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Blue Light Mode Toggle */}
          <button
            onClick={toggleBlueLightFilter}
            className={`p-2 rounded-xl border text-xs transition ${
              isBlueLightFilterOn
                ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
            title={t.nightComfort}
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition"
            title={t.soundToggle}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Theme Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition"
              title={t.themePicker}
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemeMenu && (
              <div
                className={`absolute mt-2 w-44 rounded-xl border p-1 shadow-2xl z-50 space-y-0.5 ${
                  dir === 'rtl' ? 'left-0' : 'right-0'
                }`}
                style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
              >
                <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                  {t.themePicker}
                </div>
                {themeOptions.map((tm) => (
                  <button
                    key={tm.id}
                    onClick={() => {
                      setPreset(tm.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      preset === tm.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <span>{tm.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tm.color }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Analytics Modal Button */}
          <button
            onClick={onOpenAnalytics}
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition"
            title={t.analytics}
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Instagram Story Share Card Button */}
          <button
            onClick={onOpenStoryCard}
            className="hidden sm:flex p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition"
            title={t.shareStory}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Blueprint & GitHub CLI Button - shown in pro mode or on demand */}
          {uiMode === 'advanced' && (
            <button
              onClick={onOpenBlueprint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs text-black transition hover:opacity-90 shadow"
              style={{ backgroundColor: theme.primaryAccent }}
              title="Architecture Blueprint & CLI Commands"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI</span>
            </button>
          )}

          {/* Re-trigger Onboarding Button */}
          <button
            onClick={onReplayOnboarding}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition"
            title={t.restartOnboarding}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
