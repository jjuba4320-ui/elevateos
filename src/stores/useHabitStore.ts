import { create } from 'zustand';
import { Habit, BadHabitBreakTimer } from '../types';
import { soundscapeEngine } from '../services/audioService';
import { useGamificationStore } from './useGamificationStore';

// Helper to generate past year heatmap seed
function generateSampleHeatmapLogs(intensity = 0.75): Record<string, boolean> {
  const logs: Record<string, boolean> = {};
  const today = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (Math.random() < intensity) {
      logs[dateStr] = true;
    }
  }
  return logs;
}

const SAMPLE_HABITS: Habit[] = [
  {
    id: 'hb_1',
    title: 'Daily BAC Math Problem Solving (Min 45m)',
    category: 'Study',
    frequency: 'daily',
    icon: 'calculator',
    streak: 12,
    bestStreak: 21,
    streakShields: 1,
    logs: { ...generateSampleHeatmapLogs(0.85), [new Date().toISOString().split('T')[0]]: true },
    targetPerDay: 1,
    currentToday: 1,
    unit: 'session',
    timeOfDay: 'morning',
    color: '#06b6d4',
    archived: false,
    createdAt: '2026-01-01',
  },
  {
    id: 'hb_2',
    title: 'Morning 15-min Formula & Flashcard Review',
    category: 'Study',
    frequency: 'daily',
    icon: 'book-open',
    streak: 7,
    bestStreak: 14,
    streakShields: 0,
    logs: generateSampleHeatmapLogs(0.7),
    targetPerDay: 1,
    currentToday: 0,
    unit: 'review',
    timeOfDay: 'morning',
    color: '#8b5cf6',
    archived: false,
    createdAt: '2026-01-10',
  },
  {
    id: 'hb_3',
    title: 'Hydration Target (2.5L Water)',
    category: 'Wellness',
    frequency: 'daily',
    icon: 'droplets',
    streak: 9,
    bestStreak: 18,
    streakShields: 2,
    logs: generateSampleHeatmapLogs(0.8),
    targetPerDay: 8,
    currentToday: 5,
    unit: 'glasses',
    timeOfDay: 'afternoon',
    color: '#3b82f6',
    archived: false,
    createdAt: '2026-01-05',
  },
  {
    id: 'hb_4',
    title: 'Evening Digital Detox & Sleep Preparation at 23:00',
    category: 'Health',
    frequency: 'daily',
    icon: 'moon',
    streak: 5,
    bestStreak: 11,
    streakShields: 1,
    logs: generateSampleHeatmapLogs(0.65),
    targetPerDay: 1,
    currentToday: 0,
    unit: 'bedtime',
    timeOfDay: 'evening',
    color: '#10b981',
    archived: false,
    createdAt: '2026-01-15',
  },
];

const SAMPLE_BAD_HABITS: BadHabitBreakTimer[] = [
  {
    id: 'bh_1',
    habitName: 'Mindless Social Media Scrolling & TikTok',
    cleanSinceDate: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    relapseCount: 1,
    reasonToQuit: 'Reclaim 2.5 hours every day to conquer BAC examination with honors',
    savingsPerDay: 150, // 150 minutes saved
  },
  {
    id: 'bh_2',
    habitName: 'Late Night Screen Blue Light Past 00:30',
    cleanSinceDate: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    relapseCount: 2,
    reasonToQuit: 'Deep REM sleep for memory consolidation and neural recovery',
    savingsPerDay: 60,
  },
];

interface HabitStore {
  habits: Habit[];
  badHabits: BadHabitBreakTimer[];
  checkInHabit: (id: string) => void;
  uncheckHabit: (id: string) => void;
  incrementHabitCount: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'logs' | 'currentToday'>) => void;
  deleteHabit: (id: string) => void;
  useShieldOnHabit: (id: string) => boolean;
  resetBadHabitTimer: (id: string) => void;
  addBadHabit: (name: string, reason: string, savingsMinutes?: number) => void;
  deleteBadHabit: (id: string) => void;
}

const savedHabits = localStorage.getItem('elevate_habits');
const initialHabits = savedHabits ? JSON.parse(savedHabits) : SAMPLE_HABITS;

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: initialHabits,
  badHabits: SAMPLE_BAD_HABITS,

  checkInHabit: (id) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;

    soundscapeEngine.playTaskCompleteSound();
    useGamificationStore.getState().recordHabitChecked();

    set((state) => {
      const next = state.habits.map((h) => {
        if (h.id !== id) return h;
        const wasDoneToday = !!h.logs[today];
        const newLogs = { ...h.logs, [today]: true };
        const newStreak = wasDoneToday ? h.streak : h.streak + 1;
        const newBest = Math.max(h.bestStreak, newStreak);
        return {
          ...h,
          streak: newStreak,
          bestStreak: newBest,
          currentToday: h.targetPerDay,
          logs: newLogs,
        };
      });
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
  },

  uncheckHabit: (id) => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => {
      const next = state.habits.map((h) => {
        if (h.id !== id) return h;
        const newLogs = { ...h.logs };
        delete newLogs[today];
        return {
          ...h,
          streak: Math.max(0, h.streak - 1),
          currentToday: 0,
          logs: newLogs,
        };
      });
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
  },

  incrementHabitCount: (id) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;

    const nextCount = habit.currentToday + 1;
    const isCompletedNow = nextCount >= habit.targetPerDay;

    if (isCompletedNow && habit.currentToday < habit.targetPerDay) {
      soundscapeEngine.playTaskCompleteSound();
      useGamificationStore.getState().recordHabitChecked();
    }

    set((state) => {
      const next = state.habits.map((h) => {
        if (h.id !== id) return h;
        const newLogs = { ...h.logs };
        if (isCompletedNow) {
          newLogs[today] = true;
        }
        return {
          ...h,
          currentToday: nextCount,
          streak: isCompletedNow && !h.logs[today] ? h.streak + 1 : h.streak,
          bestStreak: Math.max(h.bestStreak, isCompletedNow && !h.logs[today] ? h.streak + 1 : h.streak),
          logs: newLogs,
        };
      });
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
  },

  addHabit: (data) => {
    set((state) => {
      const newHabit: Habit = {
        ...data,
        id: 'hb_' + Date.now(),
        streak: 0,
        bestStreak: 0,
        currentToday: 0,
        logs: {},
        archived: false,
        createdAt: new Date().toISOString(),
      };
      const next = [newHabit, ...state.habits];
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
  },

  deleteHabit: (id) => {
    set((state) => {
      const next = state.habits.filter((h) => h.id !== id);
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
  },

  useShieldOnHabit: (id) => {
    const gamification = useGamificationStore.getState();
    if (!gamification.useStreakShield()) return false;

    set((state) => {
      const next = state.habits.map((h) =>
        h.id === id ? { ...h, streakShields: h.streakShields + 1 } : h
      );
      localStorage.setItem('elevate_habits', JSON.stringify(next));
      return { habits: next };
    });
    return true;
  },

  resetBadHabitTimer: (id) => {
    set((state) => ({
      badHabits: state.badHabits.map((b) =>
        b.id === id
          ? {
              ...b,
              cleanSinceDate: new Date().toISOString(),
              relapseCount: b.relapseCount + 1,
            }
          : b
      ),
    }));
  },

  addBadHabit: (name, reason, savingsMinutes = 60) => {
    set((state) => ({
      badHabits: [
        ...state.badHabits,
        {
          id: 'bh_' + Date.now(),
          habitName: name,
          cleanSinceDate: new Date().toISOString(),
          relapseCount: 0,
          reasonToQuit: reason,
          savingsPerDay: savingsMinutes,
        },
      ],
    }));
  },

  deleteBadHabit: (id) => {
    set((state) => ({
      badHabits: state.badHabits.filter((b) => b.id !== id),
    }));
  },
}));
