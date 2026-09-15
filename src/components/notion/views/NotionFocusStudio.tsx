import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Coffee,
  BookOpen,
  Waves,
  Sliders,
  CheckCircle2,
  Flame,
  Shield,
  Clock,
  Music,
} from 'lucide-react';
import { useFocusStore } from '../../../stores/useFocusStore';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useNotionStore } from '../../../stores/useNotionStore';
import { FocusModeType } from '../../../types';

export function NotionFocusStudio() {
  const {
    mode,
    timeLeftSeconds,
    totalDurationSeconds,
    isRunning,
    activeSubjectOrProject,
    settings,
    activeAmbient,
    todayFocusMinutes,
    stopwatchElapsedSeconds,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    setSubjectOrProject,
    setAmbientSound,
    setAmbientVolume,
    updateSettings,
  } = useFocusStore();

  const { tasks } = useTaskStore();
  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickTimer]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    totalDurationSeconds > 0
      ? Math.round(((totalDurationSeconds - timeLeftSeconds) / totalDurationSeconds) * 100)
      : 0;

  const ambientTracks = [
    { id: 'off', labelAr: 'إيقاف', labelEn: 'Off', icon: VolumeX },
    { id: 'rain', labelAr: 'مطر هادئ', labelEn: 'Rain', icon: CloudRain },
    { id: 'white_noise', labelAr: 'ضجيج أبيض', labelEn: 'White Noise', icon: Waves },
    { id: 'library', labelAr: 'مكتبة هادئة', labelEn: 'Library', icon: BookOpen },
    { id: 'cafe', labelAr: 'مقهى دراسي', labelEn: 'Cafe', icon: Coffee },
  ] as const;

  return (
    <div
      className={`flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 transition-colors ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-4xl sm:text-5xl mb-3">⏳</div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {isArabic ? 'محطة التركيز وأصوات الطبيعة (Pomodoro & Forest)' : 'Focus & Ambient Soundscape Studio (Pomodoro & Forest)'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {isArabic
              ? 'مساحة عمل مخصصة للتركيز العميق بدون مقاطعات، مع مؤقتات بومودورو، ومولد أصوات بيئية بالذكاء الصوتي (Web Audio)، ومحاكاة نمو شجرة التركيز.'
              : 'Deep work focus environment with customizable Pomodoro sessions, binaural soundscapes, and gamified focus tree growth.'}
          </p>
        </div>

        {/* Main Focus Card */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border shadow-xl relative overflow-hidden mb-8 ${
            isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            mode === 'pomodoro' ? 'bg-cyan-500/10' : mode === 'short_break' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
          }`} />

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setMode('pomodoro')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                mode === 'pomodoro'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {isArabic ? 'جلسة عمل (25د)' : 'Focus (25m)'}
            </button>
            <button
              onClick={() => setMode('short_break')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                mode === 'short_break'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {isArabic ? 'استراحة قصيرة (5د)' : 'Short Break (5m)'}
            </button>
            <button
              onClick={() => setMode('long_break')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                mode === 'long_break'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {isArabic ? 'استراحة طويلة (15د)' : 'Long Break (15m)'}
            </button>
            <button
              onClick={() => setMode('stopwatch_exam')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                mode === 'stopwatch_exam'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {isArabic ? 'محاكاة اختبار' : 'Exam Flow'}
            </button>
          </div>

          {/* Giant Time Display & Tree Growth Visual */}
          <div className="text-center py-4">
            <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-cyan-400 drop-shadow-sm mb-4 select-none">
              {mode === 'stopwatch_exam'
                ? formatSeconds(stopwatchElapsedSeconds)
                : formatSeconds(timeLeftSeconds)}
            </div>

            {/* Tree Growth Status */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-neutral-300 mb-6">
              <span className="text-lg">
                {progressPercent > 80 ? '🌳' : progressPercent > 40 ? '🌿' : progressPercent > 10 ? '🌱' : '🌰'}
              </span>
              <span>
                {isArabic
                  ? `مستوى نمو شجرة التركيز: ${progressPercent}%`
                  : `Focus Tree Growth: ${progressPercent}%`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto h-2 rounded-full bg-black/40 overflow-hidden mb-8">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Main Action Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => (isRunning ? pauseTimer() : startTimer())}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl transition hover:scale-105 active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-black'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>{isArabic ? 'إيقاف مؤقت' : 'Pause Focus'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{isArabic ? 'بدء التركيز العميق' : 'Start Focus'}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                title={isArabic ? 'إعادة ضبط المؤقت' : 'Reset timer'}
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-3.5 rounded-2xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                title={isArabic ? 'إعدادات المؤقت' : 'Timer settings'}
              >
                <Sliders className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Task Linker */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-400">
              {isArabic ? 'ما المهمة التي تركز عليها حالياً؟' : 'What task are you working on?'}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={activeSubjectOrProject}
                onChange={(e) => setSubjectOrProject(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl border bg-black/40 border-neutral-700 text-white focus:outline-none"
              >
                <option value="General Focus">{isArabic ? 'جلسة تركيز عامة' : 'General Focus'}</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ambient Soundscapes Engine (Endel & Brain.fm Style) */}
        <div
          className={`p-6 rounded-3xl border shadow-md mb-8 ${
            isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold">{isArabic ? 'أصوات الطبيعة والتركيز البيئي (Web Audio)' : 'Ambient Soundscapes'}</h3>
            </div>
            <span className="text-[11px] text-neutral-400">
              {activeAmbient !== 'off' ? `🟢 ${isArabic ? 'صوت نشط' : 'Playing'}` : `⚪ ${isArabic ? 'صامت' : 'Muted'}`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
            {ambientTracks.map((track) => {
              const Icon = track.icon;
              const isSelected = activeAmbient === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setAmbientSound(track.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md font-bold'
                      : isDark
                      ? 'bg-[#1a1a1a] border-[#333] text-neutral-400 hover:text-white hover:bg-[#252525]'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:text-black'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{isArabic ? track.labelAr : track.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 pt-2">
            <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundscapeVolume}
              onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-xs text-neutral-400 w-12 text-right">
              {Math.round(settings.soundscapeVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Daily Focus Stats & Streak */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-semibold">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{isArabic ? 'ساعات التركيز اليوم' : 'Today Focus Time'}</span>
            </div>
            <div className="text-2xl font-black text-white">{todayFocusMinutes} <span className="text-xs font-normal text-neutral-400">{isArabic ? 'دقيقة' : 'mins'}</span></div>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-semibold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isArabic ? 'أيام الاستمرارية' : 'Focus Streak'}</span>
            </div>
            <div className="text-2xl font-black text-amber-400">14 <span className="text-xs font-normal text-neutral-400">{isArabic ? 'يوماً متتالياً' : 'days streak'}</span></div>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'دروع الحماية' : 'Streak Shields'}</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">2 <span className="text-xs font-normal text-neutral-400">{isArabic ? 'درع نشط' : 'active'}</span></div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'}`}>
              <h2 className="text-lg font-black mb-4">{isArabic ? 'إعدادات المؤقت والتركيز' : 'Timer Settings'}</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'مدة جلسة العمل (دقيقة)' : 'Work Session (minutes)'}</label>
                  <input
                    type="number"
                    value={settings.workMinutes}
                    onChange={(e) => updateSettings({ workMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'الاستراحة القصيرة (دقيقة)' : 'Short Break (minutes)'}</label>
                  <input
                    type="number"
                    value={settings.shortBreakMinutes}
                    onChange={(e) => updateSettings({ shortBreakMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'الاستراحة الطويلة (دقيقة)' : 'Long Break (minutes)'}</label>
                  <input
                    type="number"
                    value={settings.longBreakMinutes}
                    onChange={(e) => updateSettings({ longBreakMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  {isArabic ? 'حفظ وإغلاق' : 'Save & Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
