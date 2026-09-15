import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Plus,
  Trash2,
  Check,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertOctagon,
  RotateCcw,
} from 'lucide-react';
import { useHabitStore } from '../../../stores/useHabitStore';
import { useGamificationStore } from '../../../stores/useGamificationStore';
import { useNotionStore } from '../../../stores/useNotionStore';
import { Habit } from '../../../types';

export function NotionHabitsView() {
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
  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academics');
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];

  // Generate 32 weeks x 7 days data for the GitHub style grid
  const weeksCount = 30;
  const daysInGrid: { date: string; active: boolean; monthLabel?: string }[] = [];
  const currentDate = new Date();

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

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: 'daily',
      icon: 'flame',
      streakShields: 0,
      targetPerDay: 1,
      unit: 'times',
      color: '#06b6d4',
      archived: false,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div
      className={`flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 transition-colors ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-4xl sm:text-5xl mb-2">📊</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
              {isArabic ? 'متتبع العادات والـ Streaks (Habitica & Streaks)' : 'Habits & Streaks Heatmap (Habitica & Streaks)'}
            </h1>
            <p className="text-xs text-neutral-400">
              {isArabic
                ? 'بناء الروتين اليومي وتثبيت العادات الدراسية مع شبكة النشاط التفاعلية، ودروع حماية السلاسل المتتالية.'
                : 'Form daily study rituals, monitor streaks with a GitHub-style heatmap, and protect progress with shields.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Shield className="w-4 h-4" />
              <span>
                {streakShieldsAvailable} {isArabic ? 'دروع حماية متاحة' : 'Shields'}
              </span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'عادة جديدة' : 'New Habit'}</span>
            </button>
          </div>
        </div>

        {/* 1. Today's Habit Checklist */}
        <div
          className={`p-6 rounded-3xl border shadow-xl mb-8 ${
            isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-wider">
                {isArabic ? 'روتين اليوم وإنجاز العادات' : "Today's Habit Checklist"}
              </h2>
            </div>
            <span className="text-xs text-neutral-500">{todayStr}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {habits.map((habit) => {
              const isDoneToday = !!habit.logs[todayStr];
              const isSelected = habit.id === selectedHabitId;

              return (
                <div
                  key={habit.id}
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-500/5'
                      : isDark
                      ? 'bg-[#1a1a1a] border-[#2e2e2e] hover:border-neutral-600'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="text-xs font-bold">{habit.title}</div>
                      <span className="text-[10px] text-neutral-400">{habit.category}</span>
                    </div>

                    {/* Streak Badge */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      <span>{habit.streak} {isArabic ? 'يوم' : 'd'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isDoneToday
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isDoneToday ? (isArabic ? 'تم اليوم ✓' : 'Done ✓') : (isArabic ? 'تسجيل إنجاز' : 'Check-in')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                      }}
                      className="text-neutral-600 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. GitHub-Style Interactive Activity Heatmap */}
        {activeHabit && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl mb-8 ${
              isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black">
                    {isArabic ? `شبكة الالتزام السنوي (Heatmap): ${activeHabit.title}` : `Yearly Activity Heatmap: ${activeHabit.title}`}
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {isArabic
                    ? `أطول سلسلة متتالية تم تسجيلها: ${activeHabit.bestStreak || activeHabit.streak} يوماً`
                    : `Longest streak record: ${activeHabit.bestStreak || activeHabit.streak} days`}
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                <span>{isArabic ? 'أقل' : 'Less'}</span>
                <div className="w-2.5 h-2.5 rounded bg-neutral-800 border border-white/5" />
                <div className="w-2.5 h-2.5 rounded bg-emerald-900 border border-emerald-700" />
                <div className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-500" />
                <div className="w-2.5 h-2.5 rounded bg-emerald-400 border border-emerald-300" />
                <span>{isArabic ? 'أكثر' : 'More'}</span>
              </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto pb-2">
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
                  gridAutoFlow: 'column',
                }}
              >
                {daysInGrid.map((day, idx) => (
                  <div
                    key={idx}
                    title={`${day.date}: ${day.active ? 'Completed' : 'Missed'}`}
                    className={`w-3 h-3 rounded-sm transition cursor-pointer ${
                      day.active
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                        : isDark
                        ? 'bg-[#181818] border border-white/5 hover:border-neutral-600'
                        : 'bg-neutral-200 border border-neutral-300 hover:border-neutral-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Bad Habits Breaking & Clean Days */}
        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-black">
              {isArabic ? 'تحدي الإقلاع عن العادات المعطلة (Sober Streak)' : 'Breaking Bad Habits Tracker'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badHabits.map((bad) => {
              const cleanDays = Math.max(
                0,
                Math.floor((Date.now() - new Date(bad.cleanSinceDate).getTime()) / (1000 * 60 * 60 * 24))
              );
              return (
                <div
                  key={bad.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-neutral-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-rose-300">{bad.habitName}</div>
                    <div className="text-xl font-black mt-1">
                      {cleanDays} <span className="text-xs text-neutral-400 font-normal">{isArabic ? 'يوماً بدون انتكاسة' : 'clean days'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => resetBadHabitTimer(bad.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition"
                    title="Reset counter if relapsed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isArabic ? 'إعادة الضبط' : 'Reset'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Habit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'}`}>
              <h2 className="text-lg font-black mb-4">{isArabic ? 'إضافة عادة يومية جديدة' : 'Add Habit'}</h2>
              <form onSubmit={handleCreateHabit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'اسم العادة' : 'Habit Title'}</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700 focus:outline-none focus:border-cyan-400"
                    placeholder={isArabic ? 'مثال: حل مسألة فيزياء يومياً' : 'e.g. Solve 1 Math problem daily'}
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'المجال' : 'Category'}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  >
                    <option value="Academics">{isArabic ? 'دراسة وأكاديميا' : 'Academics'}</option>
                    <option value="Health">{isArabic ? 'صحة ورياضة' : 'Health'}</option>
                    <option value="Mindset">{isArabic ? 'تركيز وتأمل' : 'Mindset'}</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                  >
                    {isArabic ? 'حفظ العادة' : 'Save Habit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
