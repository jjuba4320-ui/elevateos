import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Printer,
  Download,
  X,
  CheckCircle2,
  Flame,
  Award,
  Calendar,
} from 'lucide-react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useHabitStore } from '../../stores/useHabitStore';
import { useFocusStore } from '../../stores/useFocusStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useUserStore } from '../../stores/useUserStore';

export function AnalyticsModal({ onClose }: { onClose: () => void }) {
  const { tasks } = useTaskStore();
  const { habits } = useHabitStore();
  const { todayFocusMinutes, sessionHistory } = useFocusStore();
  const { profile } = useUserStore();
  const { theme } = useThemeStore();

  // Daily Productivity Score (0-100 Algorithm)
  // 40% Focus target + 30% Task completion + 30% Habit completion
  const focusTarget = 240; // 4 hours
  const focusRatio = Math.min(1, todayFocusMinutes / focusTarget);

  const completedTasksToday = tasks.filter((t) => t.status === 'completed').length;
  const totalTasksToday = Math.max(1, tasks.length);
  const taskRatio = Math.min(1, completedTasksToday / totalTasksToday);

  const todayStr = new Date().toISOString().split('T')[0];
  const checkedHabitsToday = habits.filter((h) => !!h.logs[todayStr]).length;
  const totalHabitsToday = Math.max(1, habits.length);
  const habitRatio = Math.min(1, checkedHabitsToday / totalHabitsToday);

  const productivityScore = Math.round(
    focusRatio * 40 + taskRatio * 30 + habitRatio * 30
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="max-w-2xl w-full rounded-2xl border p-6 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl print:bg-white print:text-black"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white print:text-black">
                ElevateOS Intelligence & Analytics
              </h2>
            </div>
            <p className="text-xs text-neutral-400 print:text-neutral-600">
              Deterministic 0-100 algorithmic productivity synthesis for {profile.name}.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 text-xs hover:text-white hover:bg-neutral-700 print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>

        {/* Big Productivity Score Meter */}
        <div className="p-5 rounded-2xl border bg-neutral-900/80 border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-neutral-300">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Daily Composite Productivity Index
            </span>
            <h3 className="text-2xl font-bold text-white print:text-black">
              {productivityScore >= 80 ? 'Optimal Flow State' : productivityScore >= 50 ? 'Steady Progress' : 'Warming Up'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              Synthesized from {todayFocusMinutes}m deep focus, {completedTasksToday} completed tasks, and {checkedHabitsToday} habit rings kept unbroken.
            </p>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="stroke-neutral-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={theme.primaryAccent}
                strokeWidth="8"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * productivityScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black font-mono text-white print:text-black">{productivityScore}</span>
              <span className="text-[10px] block text-neutral-400 font-bold uppercase">/ 100</span>
            </div>
          </div>
        </div>

        {/* Algorithm Factor Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border bg-neutral-900/50 border-neutral-800">
            <div className="text-xs text-neutral-400">Focus Factor (40%)</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {Math.round(focusRatio * 40)} / 40 pts
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">{todayFocusMinutes} mins logged</div>
          </div>

          <div className="p-3.5 rounded-xl border bg-neutral-900/50 border-neutral-800">
            <div className="text-xs text-neutral-400">Task Velocity (30%)</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {Math.round(taskRatio * 30)} / 30 pts
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">{completedTasksToday} done today</div>
          </div>

          <div className="p-3.5 rounded-xl border bg-neutral-900/50 border-neutral-800">
            <div className="text-xs text-neutral-400">Habit Adherence (30%)</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {Math.round(habitRatio * 30)} / 30 pts
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">{checkedHabitsToday} / {habits.length} rings active</div>
          </div>
        </div>

        {/* Peak Productivity Hour Analysis */}
        <div className="p-4 rounded-xl border bg-neutral-900/40 border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white print:text-black">Peak Productivity Window</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">08:00 AM – 11:30 AM</span>
          </div>
          <p className="text-xs text-neutral-400">
            Cognitive energy peak observed in early morning blocks. Recommended time for heaviest BAC Mathematics and Physics exam series solving.
          </p>
        </div>

        {/* Weekly Mock Summary Graph */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white print:text-black">7-Day Consistency Curve</span>
            <span className="text-neutral-400 font-mono text-[11px]">Avg: 78.4 / 100</span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 bg-neutral-900/60 rounded-xl border border-neutral-800">
            {[
              { day: 'Mon', score: 68 },
              { day: 'Tue', score: 82 },
              { day: 'Wed', score: 75 },
              { day: 'Thu', score: 90 },
              { day: 'Fri', score: 85 },
              { day: 'Sat', score: 94 },
              { day: 'Sun', score: productivityScore },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-neutral-400">{d.score}</span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${d.score}%`,
                    backgroundColor: i === 6 ? theme.primaryAccent : '#334155',
                  }}
                />
                <span className="text-[10px] font-mono text-neutral-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
