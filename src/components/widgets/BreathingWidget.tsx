import { useState, useEffect } from 'react';
import {
  Heart,
  Droplets,
  Wind,
  Plus,
  Minus,
  Smile,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';
import { useWellnessStore } from '../../stores/useWellnessStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { soundscapeEngine } from '../../services/audioService';

export function BreathingWidget() {
  const {
    todayWellness,
    setOneLineJournal,
    setGratitudeItem,
    incrementWater,
    decrementWater,
    setMood,
    recordBreathingMinutes,
  } = useWellnessStore();

  const { theme } = useThemeStore();

  // 4-7-8 Breathing Cycle State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phases
          if (breathPhase === 'Inhale (4s)') {
            setBreathPhase('Hold (7s)');
            return 7;
          } else if (breathPhase === 'Hold (7s)') {
            setBreathPhase('Exhale (8s)');
            return 8;
          } else {
            setBreathPhase('Inhale (4s)');
            setCycleCount((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathSeconds(4);
      setBreathPhase('Inhale (4s)');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      if (cycleCount > 0) {
        recordBreathingMinutes(Math.max(1, Math.round(cycleCount * 0.3)));
        soundscapeEngine.playTaskCompleteSound();
      }
    } else {
      setIsBreathingActive(true);
      setCycleCount(0);
    }
  };

  const getBreathCircleScale = () => {
    if (!isBreathingActive) return 'scale-100';
    if (breathPhase === 'Inhale (4s)') return 'scale-125 transition-transform duration-4000';
    if (breathPhase === 'Hold (7s)') return 'scale-125';
    return 'scale-90 transition-transform duration-8000';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 4-7-8 Breathing & Stress Decompression Circle */}
      <div
        className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Wind className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-base text-white">4-7-8 Vagus Nerve Decompression</h3>
                <p className="text-xs text-neutral-400">Scientifically recalibrates parasympathetic nervous system</p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-400">{cycleCount} Cycles</span>
          </div>

          {/* Animated Circle Visualizer */}
          <div className="flex flex-col items-center justify-center py-6">
            <div
              className={`w-36 h-36 rounded-full flex items-center justify-center border-2 border-cyan-400/40 bg-cyan-950/20 shadow-2xl transition-all ${getBreathCircleScale()}`}
            >
              <div className="text-center">
                <span className="text-3xl font-black font-mono text-white">{breathSeconds}</span>
                <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider mt-1">
                  {breathPhase}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {isBreathingActive ? 'Focus softly on your breath...' : 'Ready for 2-minute reset'}
          </span>
          <button
            onClick={toggleBreathing}
            className="px-4 py-2 rounded-xl text-xs font-bold text-black transition hover:opacity-90"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            {isBreathingActive ? 'Stop & Save' : 'Begin 4-7-8'}
          </button>
        </div>
      </div>

      {/* Hydration & Daily Gratitude Journal */}
      <div
        className="p-6 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        {/* Hydration Tracker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <h4 className="font-semibold text-sm text-white">Hydration Flow</h4>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              {todayWellness.waterGlasses} / 8 Glasses ({(todayWellness.waterGlasses * 0.25).toFixed(1)}L)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-7 rounded-md transition border ${
                    idx < todayWellness.waterGlasses
                      ? 'bg-cyan-500 border-cyan-400'
                      : 'bg-neutral-800/80 border-neutral-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={decrementWater}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={incrementWater}
                className="w-7 h-7 rounded-lg text-black font-bold flex items-center justify-center text-xs"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Thing Gratitude Log */}
        <div className="pt-2 border-t border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-xs text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>3 Gratitude Sparks (Mental Grounding)</span>
            </h4>
          </div>

          <div className="space-y-1.5">
            {todayWellness.gratitudeList.map((g, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-500">{idx + 1}.</span>
                <input
                  type="text"
                  value={g}
                  onChange={(e) => setGratitudeItem(idx, e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
