import { create } from 'zustand';
import { GamificationState, Badge, RewardItem } from '../types';
import { soundscapeEngine } from '../services/audioService';
import confetti from 'canvas-confetti';

const INITIAL_BADGES: Badge[] = [
  { id: 'first_step', title: 'First Spark', description: 'Complete your first task in ElevateOS', icon: 'zap', unlocked: true, xpValue: 50 },
  { id: 'streak_3', title: 'Momentum Builder', description: 'Maintain a 3-day habit streak', icon: 'flame', unlocked: true, xpValue: 150 },
  { id: 'focus_god', title: 'Deep Work Monk', description: 'Log over 120 minutes of strict focus', icon: 'shield', unlocked: false, xpValue: 300 },
  { id: 'bac_master', title: 'BAC Conqueror', description: 'Review 5 units and log 3 solved mistakes', icon: 'graduation-cap', unlocked: false, xpValue: 500 },
  { id: 'iron_will', title: 'Iron Discipline', description: 'Reach Level 10 and maintain zero relapses for 7 days', icon: 'award', unlocked: false, xpValue: 800 },
  { id: 'clean_sheet', title: 'Flawless Week', description: '100% habit completion for an entire week', icon: 'sparkles', unlocked: false, xpValue: 600 },
];

const DEFAULT_REWARDS: RewardItem[] = [
  { id: 'rw_1', title: 'Watch 1 Episode of Favorite Series', costXp: 350, icon: 'film', category: 'Entertainment', redeemedCount: 2 },
  { id: 'rw_2', title: 'Guilt-Free 45min Gaming Session', costXp: 500, icon: 'gamepad-2', category: 'Entertainment', redeemedCount: 1 },
  { id: 'rw_3', title: 'Favorite Specialty Coffee & Pastry', costXp: 300, icon: 'coffee', category: 'Treat', redeemedCount: 4 },
  { id: 'rw_4', title: 'Order Cheat Meal / Favorite Takeout', costXp: 850, icon: 'utensils', category: 'Food', redeemedCount: 0 },
  { id: 'rw_5', title: 'Buy Desired Book / Tech Accessory', costXp: 1500, icon: 'shopping-bag', category: 'Milestone', redeemedCount: 0 },
];

interface GamificationStore extends GamificationState {
  rewards: RewardItem[];
  addXp: (amount: number, reason?: string) => void;
  useStreakShield: () => boolean;
  addStreakShield: (count: number) => void;
  redeemReward: (rewardId: string) => boolean;
  createCustomReward: (title: string, costXp: number, category: string, icon?: string) => void;
  checkBadges: () => void;
  recordFocusCompleted: (minutes: number) => void;
  recordTaskCompleted: () => void;
  recordHabitChecked: () => void;
}

export function calculateLevel(xp: number): { level: number; title: string; progress: number; nextLevelXp: number } {
  // 500 XP per level scaling slightly
  const baseLevel = Math.floor(xp / 400) + 1;
  const level = Math.min(50, Math.max(1, baseLevel));
  const currentLevelBaseXp = (level - 1) * 400;
  const nextLevelXp = level * 400;
  const progress = Math.min(100, Math.max(0, Math.round(((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100)));

  let title = 'Novice Operator';
  if (level >= 45) title = 'Transcendent Mythic';
  else if (level >= 35) title = 'Apex Grandmaster';
  else if (level >= 25) title = 'Master Strategist';
  else if (level >= 18) title = 'Elite Champion';
  else if (level >= 12) title = 'Discipline Specialist';
  else if (level >= 6) title = 'Focused Apprentice';

  return { level, title, progress, nextLevelXp };
}

const savedGamification = localStorage.getItem('elevate_gamification');
const initialGamification = savedGamification
  ? JSON.parse(savedGamification)
  : {
      xp: 850,
      level: 3,
      title: 'Focused Apprentice',
      streakShieldsAvailable: 2,
      totalTasksDone: 14,
      totalFocusMinutes: 195,
      totalHabitChecks: 26,
      badges: INITIAL_BADGES,
      unlockedThemes: ['dark_neon', 'midnight_gold'],
      rewards: DEFAULT_REWARDS,
    };

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  ...initialGamification,

  addXp: (amount, reason) => {
    set((state) => {
      const oldLevel = state.level;
      const newXp = state.xp + amount;
      const { level, title } = calculateLevel(newXp);

      // Trigger celebratory fanfare if leveled up
      if (level > oldLevel) {
        soundscapeEngine.playLevelUpSound();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
          });
        } catch {
          // Ignore
        }
      }

      const next = {
        ...state,
        xp: newXp,
        level,
        title,
      };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
  },

  useStreakShield: () => {
    const current = get().streakShieldsAvailable;
    if (current <= 0) return false;
    set((state) => {
      const next = { ...state, streakShieldsAvailable: state.streakShieldsAvailable - 1 };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
    return true;
  },

  addStreakShield: (count) => {
    set((state) => {
      const next = { ...state, streakShieldsAvailable: state.streakShieldsAvailable + count };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
  },

  redeemReward: (rewardId) => {
    const state = get();
    const item = state.rewards.find((r) => r.id === rewardId);
    if (!item || state.xp < item.costXp) return false;

    set((s) => {
      const updatedRewards = s.rewards.map((r) =>
        r.id === rewardId ? { ...r, redeemedCount: r.redeemedCount + 1 } : r
      );
      const newXp = s.xp - item.costXp;
      const { level, title } = calculateLevel(newXp);
      const next = {
        ...s,
        xp: newXp,
        level,
        title,
        rewards: updatedRewards,
      };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
    return true;
  },

  createCustomReward: (title, costXp, category, icon = 'gift') => {
    set((state) => {
      const newReward: RewardItem = {
        id: 'rw_' + Date.now(),
        title,
        costXp,
        category,
        icon,
        redeemedCount: 0,
      };
      const next = { ...state, rewards: [newReward, ...state.rewards] };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
  },

  checkBadges: () => {
    // evaluate conditions
  },

  recordFocusCompleted: (minutes) => {
    set((state) => {
      const next = {
        ...state,
        totalFocusMinutes: state.totalFocusMinutes + minutes,
      };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
    get().addXp(Math.round(minutes * 2.5), 'Focus Session completed');
  },

  recordTaskCompleted: () => {
    set((state) => {
      const next = {
        ...state,
        totalTasksDone: state.totalTasksDone + 1,
      };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
    get().addXp(30, 'Task completed');
  },

  recordHabitChecked: () => {
    set((state) => {
      const next = {
        ...state,
        totalHabitChecks: state.totalHabitChecks + 1,
      };
      localStorage.setItem('elevate_gamification', JSON.stringify(next));
      return next;
    });
    get().addXp(20, 'Habit streak kept');
  },
}));
