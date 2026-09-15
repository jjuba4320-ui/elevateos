import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  ShieldAlert,
  Clock,
  Timer,
  CheckCircle2,
  Sliders,
  Sparkles,
  CloudRain,
  Coffee,
  BookOpen,
  Waves,
} from 'lucide-react';
import { useFocusStore } from '../../stores/useFocusStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { FocusModeType } from '../../types';

export function PomodoroTimer() {
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

  const { theme } = useThemeStore();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [strictWarningOpen, setStrictWarningOpen] = useState(false);

  // Interval loop
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

  // Format MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainder = secs % 60;
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  // Progress percentage for gauge
  const progressPercent =
    mode === 'stopwatch_exam'
      ? Math.min(100, Math.round((stopwatchElapsedSeconds / 7200) * 100))
      : totalDurationSeconds > 0
      ? Math.min(100, Math.max(0, Math.round(((totalDurationSeconds - timeLeftSeconds) / totalDurationSeconds) * 100)))
      : 0;

  // Daily target gauge
  const dailyGoalMinutes = settings.dailyGoalHours * 60;
  const dailyProgressPercent = Math.min(100, Math.round((todayFocusMinutes / dailyGoalMinutes) * 100));

  const handleModeSwitch = (newMode: FocusModeType) => {
    if (isRunning && settings.strictModeEnabled) {
      setStrictWarningOpen(true);
      return;
    }
    setMode(newMode);
  };

  return (
    <div
      id="pomodoro-timer-widget"
      className="p-6 rounded-2xl border relative overflow-hidden shadow-xl"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.borderSubtle,
      }}
    >
      {/* Header with Strict Mode indicator and Settings */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-black"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Focus & Exam Engine</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Strict Mode</span>
              <button
                onClick={() => updateSettings({ strictModeEnabled: !settings.strictModeEnabled })}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                  settings.strictModeEnabled
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {settings.strictModeEnabled ? (
                  <>
                    <Shield className="w-3 h-3" />
                    <span>Active (Zero Tab Distraction)</span>
                  </>
                ) : (
                  <span>Disabled</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSettingsModal(!showSettingsModal)}
          className="p-2 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition"
          title="Configure Timer Durations"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[
          { id: 'pomodoro', label: `Focus (${settings.workMinutes}m)`, icon: Clock },
          { id: 'short_break', label: `Short (${settings.shortBreakMinutes}m)`, icon: Sparkles },
          { id: 'long_break', label: `Long (${settings.longBreakMinutes}m)`, icon: Sparkles },
          { id: 'stopwatch_exam', label: 'BAC Mock Exam', icon: Timer },
        ].map((item) => {
          const isSelected = mode === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleModeSwitch(item.id as FocusModeType)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isSelected
                  ? 'text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/50 border-neutral-800'
              }`}
              style={{
                backgroundColor: isSelected ? theme.primaryAccent : undefined,
                borderColor: isSelected ? theme.primaryAccent : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Focus Ring & Display */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        {/* SVG Circular Progress Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-neutral-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={theme.primaryAccent}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tighter text-white">
              {mode === 'stopwatch_exam' ? formatTime(stopwatchElapsedSeconds) : formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mt-1">
              {mode === 'stopwatch_exam' ? 'Mock Solving Time' : isRunning ? 'In Deep Flow' : 'Session Ready'}
            </span>
            {/* Subject Link Pill */}
            <div className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              {activeSubjectOrProject}
            </div>
          </div>
        </div>

        {/* Play/Pause/Reset Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white flex items-center justify-center transition hover:border-neutral-700"
            title="Reset Session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-pomodoro-toggle"
            onClick={isRunning ? pauseTimer : startTimer}
            className="px-8 py-3.5 rounded-2xl font-bold text-black flex items-center gap-2 text-base shadow-xl transition-transform hover:scale-102 active:scale-98"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subject Selector & Ambient Soundscape Bar */}
      <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject-Linked Focus Sessions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Target Subject / Module
          </label>
          <select
            value={activeSubjectOrProject}
            onChange={(e) => setSubjectOrProject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="BAC Mathematics">BAC Mathematics (الرياضيات)</option>
            <option value="BAC Physics">BAC Physics & Chemistry (الفيزياء)</option>
            <option value="BAC Natural Sciences">BAC Natural Sciences (العلوم)</option>
            <option value="BAC Philosophy">BAC Philosophy (الفلسفة)</option>
            <option value="BAC Foreign Languages">BAC Foreign Languages (اللغات)</option>
            <option value="Competitive Coding / Dev">Competitive Coding / Dev</option>
            <option value="Deep Reading & Strategy">Deep Reading & Strategy</option>
          </select>
        </div>

        {/* Ambient Synthesizer Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ambient Soundscape</span>
            </label>
            <span className="text-[10px] text-neutral-500 font-mono">Web Audio API</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'off', label: 'Mute', icon: VolumeX },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'white_noise', label: 'Binaural', icon: Waves },
              { id: 'library', label: 'Library', icon: BookOpen },
              { id: 'cafe', label: 'Cafe', icon: Coffee },
            ].map((snd) => {
              const active = activeAmbient === snd.id;
              const Icon = snd.icon;
              return (
                <button
                  key={snd.id}
                  onClick={() => setAmbientSound(snd.id as typeof activeAmbient)}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold flex flex-col items-center gap-1 transition ${
                    active
                      ? 'bg-neutral-800 border-cyan-400 text-cyan-300'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{snd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Focus Target Progress Gauge */}
      <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-neutral-300">
            Daily Focus Goal: <strong className="text-white">{todayFocusMinutes}m</strong> / {dailyGoalMinutes}m ({settings.dailyGoalHours}h)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${dailyProgressPercent}%`,
                backgroundColor: theme.primaryAccent,
              }}
            />
          </div>
          <span className="text-xs font-mono font-bold" style={{ color: theme.primaryAccent }}>
            {dailyProgressPercent}%
          </span>
        </div>
      </div>

      {/* Strict Mode Alert Warning Modal */}
      {strictWarningOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-neutral-900 border border-rose-700/60 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-lg text-white">Strict Focus Mode Engaged</h3>
            </div>
            <p className="text-sm text-neutral-300">
              You are in an active deep work cycle. Strict Mode protects your momentum by preventing habit interrupts or tab switching until the timer bells.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setStrictWarningOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-white"
              >
                Return to Flow
              </button>
              <button
                onClick={() => {
                  setStrictWarningOpen(false);
                  pauseTimer();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white"
              >
                Override & Break Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4">
            <h3 className="font-bold text-lg text-white">Customize Timer Parameters</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Work Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={settings.workMinutes}
                  onChange={(e) => updateSettings({ workMinutes: parseInt(e.target.value, 10) || 25 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Short Break (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.shortBreakMinutes}
                  onChange={(e) => updateSettings({ shortBreakMinutes: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Daily Target (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  max={16}
                  value={settings.dailyGoalHours}
                  onChange={(e) => updateSettings({ dailyGoalHours: parseFloat(e.target.value) || 4 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black font-bold"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
