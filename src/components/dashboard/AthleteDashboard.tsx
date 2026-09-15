import { useState, FormEvent } from 'react';
import { Dumbbell, Flame, Plus, Check, Trash2, Droplets, Timer, Sparkles } from 'lucide-react';
import { useWellnessStore } from '../../stores/useWellnessStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { PomodoroTimer } from '../widgets/PomodoroTimer';
import { HabitHeatmap } from '../widgets/HabitHeatmap';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { GamificationCard } from '../widgets/GamificationCard';
import { soundscapeEngine } from '../../services/audioService';

export function AthleteDashboard({ onOpenRewardStore }: { onOpenRewardStore: () => void }) {
  const { workouts, addWorkoutSet, toggleWorkoutSet, deleteWorkoutSet, todayWellness, incrementWater } =
    useWellnessStore();
  const { theme } = useThemeStore();

  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [weightKg, setWeightKg] = useState(70);

  // Simple rest timer in seconds
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const startRestTimer = (secs: number) => {
    setRestSeconds(secs);
    setIsResting(true);
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          soundscapeEngine.playPomodoroBell();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAddWorkout = (e: FormEvent) => {
    e.preventDefault();
    if (!exercise.trim()) return;
    addWorkoutSet(exercise.trim(), Number(sets), Number(reps), Number(weightKg));
    setExercise('');
  };

  return (
    <div className="space-y-8">
      <GamificationCard onOpenRewardStore={onOpenRewardStore} />

      {/* Workout Sets & Reps Logger & Rest Timer Banner */}
      <div
        className="p-6 rounded-2xl border shadow-xl space-y-5"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Dumbbell className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white">Workout Volume & Reps Logger</h2>
            </div>
            <p className="text-xs text-neutral-400">
              Track progressive overload, exercise sets, and set between-set rest timers.
            </p>
          </div>

          {/* Quick Rest Timer Controller */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Rest Timer:</span>
            {[60, 90, 120].map((s) => (
              <button
                key={s}
                onClick={() => startRestTimer(s)}
                className="px-2.5 py-1 rounded-lg border border-neutral-700 bg-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-500 font-mono"
              >
                {s}s
              </button>
            ))}
            {isResting && (
              <span className="text-xs font-mono font-bold text-amber-400 animate-pulse ml-1">
                {restSeconds}s Remaining
              </span>
            )}
          </div>
        </div>

        {/* Add Workout Form */}
        <form onSubmit={handleAddWorkout} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Exercise (e.g. Barbell Squat, Pull-ups)"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              min={0}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-black shrink-0"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              Add
            </button>
          </div>
        </form>

        {/* Workouts logged list */}
        <div className="space-y-2 pt-2">
          {workouts.map((w) => (
            <div
              key={w.id}
              onClick={() => toggleWorkoutSet(w.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                w.completed ? 'bg-emerald-950/20 border-emerald-800/40 text-neutral-300' : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                    w.completed ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'border-neutral-600'
                  }`}
                >
                  {w.completed && '✓'}
                </div>
                <div>
                  <span className={`text-sm font-semibold ${w.completed ? 'line-through text-neutral-400' : 'text-white'}`}>
                    {w.exercise}
                  </span>
                  <div className="text-xs text-neutral-400 font-mono">
                    {w.sets} Sets × {w.reps} Reps @ {w.weightKg} kg (Volume: {w.sets * w.reps * w.weightKg} kg)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkoutSet(w.id);
                }}
                className="p-1 rounded text-neutral-600 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <HabitHeatmap onOpenRewardStore={onOpenRewardStore} />
      <BreathingWidget />
      <PomodoroTimer />
    </div>
  );
}
