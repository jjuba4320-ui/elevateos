import { useState, FormEvent } from 'react';
import {
  Flame,
  Shield,
  Plus,
  Trash2,
  Check,
  Calendar,
  AlertOctagon,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useHabitStore } from '../../stores/useHabitStore';
import { useGamificationStore } from '../../stores/useGamificationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Habit } from '../../types';

export function HabitHeatmap({ onOpenRewardStore }: { onOpenRewardStore?: () => void }) {
  const {
    habits,
    badHabits,
    checkInHabit,
    uncheckHabit,
    useShieldOnHabit,
    resetBadHabitTimer,
    addHabit,
    deleteHabit,
  } = useHabitStore();

  const { streakShieldsAvailable } = useGamificationStore();
  const { theme } = useThemeStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academics');
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];

  // Active habit for heatmap viewing
  const activeHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];

  // Generate 52 weeks x 7 days data for the GitHub style grid
  const weeksCount = 36; // 36 weeks for great responsive view
  const daysInGrid: { date: string; active: boolean; monthLabel?: string }[] = [];
  const currentDate = new Date();

  // Align with Monday
  for (let i = weeksCount * 7 - 1; i >= 0; i--) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isActive = activeHabit ? !!activeHabit.logs[dateStr] : false;
    daysInGrid.push({
      date: dateStr,
      active: isActive,
      monthLabel: d.getDate() === 1 ? d.toLocaleString('en-US', { month: 'short' }) : undefined,
    });
  }

  const handleCreateHabit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: 'daily',
      icon: 'check',
      targetPerDay: 1,
      unit: 'session',
      timeOfDay: 'morning',
      color: theme.primaryAccent,
      archived: false,
      streakShields: 0,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  // Calculate clean days for bad habit timers
  const calculateCleanDays = (cleanSinceDate: string) => {
    const diff = Math.max(0, Date.now() - new Date(cleanSinceDate).getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Daily Check-in Cards & Streak Shields */}
      <div
        id="habit-checkin-container"
        className="p-6 rounded-2xl border shadow-xl space-y-5"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <h2 className="font-bold text-lg text-white">Daily Habit Loop & Streaks</h2>
            </div>
            <p className="text-xs text-neutral-400">
              One-tap check-in immediately awards XP and reinforces atomic identity habits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Shield counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34d399',
              }}
              title="Protects streak from resetting if you miss 1 day"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{streakShieldsAvailable} Streak Shields</span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-black transition hover:opacity-90"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Habit</span>
            </button>
          </div>
        </div>

        {/* Habit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {habits.map((habit) => {
            const isDoneToday = !!habit.logs[todayStr];
            const isSelected = habit.id === selectedHabitId;

            return (
              <div
                key={habit.id}
                onClick={() => setSelectedHabitId(habit.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected ? 'ring-1' : 'hover:border-neutral-700'
                }`}
                style={{
                  backgroundColor: isDoneToday ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.25)',
                  borderColor: isSelected ? theme.primaryAccent : isDoneToday ? 'rgba(16, 185, 129, 0.4)' : theme.borderSubtle,
                }}
              >
                <div className="flex items-center gap-3.5">
                  {/* One-Tap Check Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDoneToday) {
                        uncheckHabit(habit.id);
                      } else {
                        checkInHabit(habit.id);
                      }
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isDoneToday
                        ? 'bg-emerald-500 text-black shadow-lg scale-105'
                        : 'border border-neutral-700 hover:border-cyan-400 bg-neutral-900 text-transparent hover:text-neutral-500'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>

                  <div>
                    <h3 className={`text-sm font-semibold ${isDoneToday ? 'text-white' : 'text-neutral-200'}`}>
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{habit.streak} days</span>
                      </span>
                      <span>•</span>
                      <span>Best: {habit.bestStreak}d</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {habit.streakShields > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                      Shielded
                    </span>
                  )}
                  {streakShieldsAvailable > 0 && habit.streakShields === 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        useShieldOnHabit(habit.id);
                      }}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800 transition"
                      title="Apply Streak Shield"
                    >
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-rose-400 transition"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub-Style Annual Activity Heatmap Grid */}
      <div
        id="github-heatmap-container"
        className="p-6 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-base text-white">
                Activity Heatmap: {activeHabit?.title || 'Habits'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Visualizing consistency across the past 36 weeks. Each column represents a 7-day cycle.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-neutral-800" />
            <div
              className="w-3 h-3 rounded-sm opacity-50"
              style={{ backgroundColor: theme.primaryAccent }}
            />
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: theme.primaryAccent }}
            />
            <span>More</span>
          </div>
        </div>

        {/* The Grid Canvas */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
            {daysInGrid.map((item, idx) => (
              <div
                key={idx}
                title={`${item.date}: ${item.active ? 'Completed' : 'Missed'}`}
                className={`w-3.5 h-3.5 rounded-xs transition-all duration-150 ${
                  item.active
                    ? 'shadow-xs hover:scale-125'
                    : 'bg-neutral-800/80 hover:bg-neutral-700'
                }`}
                style={{
                  backgroundColor: item.active ? theme.primaryAccent : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consistency Rating: <strong className="text-white">88.4%</strong> in the last 90 days</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">Auto-synced with LocalStorage</span>
        </div>
      </div>

      {/* Bad Habit Break Timers Section */}
      <div
        id="bad-habits-section"
        className="p-6 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">Negative Habit Break Timers</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Track consecutive days clean from dopamine traps and cognitive distractions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badHabits.map((item) => {
            const clean = calculateCleanDays(item.cleanSinceDate);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border bg-neutral-900/50 border-neutral-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-white">{item.habitName}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    Relapses: {item.relapseCount}
                  </span>
                </div>

                {/* Counter big badge */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    {clean.days}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400 uppercase">
                    Days Clean ({clean.hours}h)
                  </span>
                </div>

                <p className="text-xs text-neutral-400 italic">
                  "{item.reasonToQuit}"
                </p>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-mono text-[11px]">
                    Saved: ~{clean.days * (item.savingsPerDay || 60)} mins
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Did you relapse on "${item.habitName}"? This will restart the clean timer.`)) {
                        resetBadHabitTimer(item.id);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-rose-400 hover:bg-rose-950/40 text-[11px] font-semibold border border-rose-900/40 transition"
                  >
                    Log Relapse
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHabit}
            className="max-w-md w-full p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4"
          >
            <h3 className="font-bold text-lg text-white">Create New Habit Loop</h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Habit Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 30m BAC Organic Chemistry Drills"
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none"
              >
                <option value="Academics">Academics / BAC</option>
                <option value="Fitness">Fitness & Health</option>
                <option value="Mindset">Mindset & Focus</option>
                <option value="Coding">Software Engineering</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-black font-bold"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Create Habit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
