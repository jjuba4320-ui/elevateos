import { create } from 'zustand';
import { WellnessEntry, BrainDumpNote } from '../types';

export interface WorkoutSet {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  attendees: string;
  actionItems: string[];
  keyDecisions: string;
}

export interface BudgetEntry {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
}

interface WellnessStore {
  todayWellness: WellnessEntry;
  brainDumps: BrainDumpNote[];
  workouts: WorkoutSet[];
  meetingNotes: MeetingNote[];
  budgetEntries: BudgetEntry[];
  budgetItems: BudgetEntry[];
  hydrationTargetGlasses: number;

  setOneLineJournal: (text: string) => void;
  setGratitudeItem: (index: number, text: string) => void;
  incrementWater: () => void;
  decrementWater: () => void;
  setMood: (mood: WellnessEntry['mood']) => void;
  recordBreathingMinutes: (minutes: number) => void;

  addBrainDump: (content: string, category: BrainDumpNote['category']) => void;
  archiveBrainDump: (id: string) => void;
  deleteBrainDump: (id: string) => void;

  // Athlete Dashboard extensions
  addWorkoutSet: (exercise: string, sets: number, reps: number, weightKg: number) => void;
  toggleWorkoutSet: (id: string) => void;
  deleteWorkoutSet: (id: string) => void;

  // Professional Dashboard extensions
  addMeetingNote: (title: string, attendees: string, decisions: string, actions: string[]) => void;
  deleteMeetingNote: (id: string) => void;

  // Personal Dashboard extensions
  addBudgetEntry: (title: string, amount: number, type: 'expense' | 'income', category: string) => void;
  deleteBudgetEntry: (id: string) => void;
  addBudgetItem: (title: string, amount: number, type: 'expense' | 'income', category: string) => void;
  deleteBudgetItem: (id: string) => void;
}

const todayDateStr = new Date().toISOString().split('T')[0];

const DEFAULT_WELLNESS: WellnessEntry = {
  date: todayDateStr,
  oneLineJournal: 'Made solid headway on BAC physics simulations and maintained 2h uninterrupted focus.',
  gratitudeList: [
    'Clarity on capacitor charging differential equations',
    'Quiet study room with cold water on desk',
    'Supportive parents and encouraging study peers',
  ],
  waterGlasses: 6,
  mood: 'focused',
  breathingMinutes: 5,
};

const DEFAULT_BRAIN_DUMPS: BrainDumpNote[] = [
  {
    id: 'bd_1',
    content: 'Review past BAC 2021 session 2 question 4 on projectile trajectories with air resistance formula.',
    category: 'urgent',
    createdAt: new Date().toISOString(),
    archived: false,
  },
  {
    id: 'bd_2',
    content: 'Order sticky memo tabs for flagging tricky pages in the physics reference book.',
    category: 'idea',
    createdAt: new Date().toISOString(),
    archived: false,
  },
  {
    id: 'bd_3',
    content: 'Research high-protein snacks for sustained mental stamina during 3-hour mock exams.',
    category: 'random',
    createdAt: new Date().toISOString(),
    archived: false,
  },
];

const DEFAULT_WORKOUTS: WorkoutSet[] = [
  { id: 'w_1', exercise: 'Barbell Back Squats', sets: 4, reps: 8, weightKg: 85, completed: true },
  { id: 'w_2', exercise: 'Romanian Deadlifts', sets: 3, reps: 10, weightKg: 70, completed: true },
  { id: 'w_3', exercise: 'Hanging Leg Raises', sets: 3, reps: 15, weightKg: 0, completed: false },
];

const DEFAULT_MEETINGS: MeetingNote[] = [
  {
    id: 'm_1',
    title: 'Sprint Planning & Release Checklist',
    date: todayDateStr,
    attendees: 'Lead Arch, Product Owner, QA Team',
    keyDecisions: 'Lock release candidate on Thursday. Offline-first fallback validated.',
    actionItems: ['Review PR #142 for caching', 'Run performance stress testing on low-end tablets'],
  },
];

const DEFAULT_BUDGET: BudgetEntry[] = [
  { id: 'b_1', title: 'Study Textbooks & Notebooks', amount: 35, type: 'expense', category: 'Education', date: todayDateStr },
  { id: 'b_2', title: 'Gym & Swimming Pass', amount: 45, type: 'expense', category: 'Health', date: todayDateStr },
  { id: 'b_3', title: 'Tutoring Allowance / Freelance', amount: 150, type: 'income', category: 'Income', date: todayDateStr },
];

const savedWellness = localStorage.getItem('elevate_wellness_data');
const initialWellness = savedWellness ? JSON.parse(savedWellness) : DEFAULT_WELLNESS;

export const useWellnessStore = create<WellnessStore>((set) => ({
  todayWellness: initialWellness,
  brainDumps: DEFAULT_BRAIN_DUMPS,
  workouts: DEFAULT_WORKOUTS,
  meetingNotes: DEFAULT_MEETINGS,
  budgetEntries: DEFAULT_BUDGET,
  budgetItems: DEFAULT_BUDGET,
  hydrationTargetGlasses: 8,

  setOneLineJournal: (text) => {
    set((state) => {
      const next = { ...state.todayWellness, oneLineJournal: text };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next));
      return { todayWellness: next };
    });
  },

  setGratitudeItem: (index, text) => {
    set((state) => {
      const list = [...state.todayWellness.gratitudeList];
      list[index] = text;
      const next = { ...state.todayWellness, gratitudeList: list };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next));
      return { todayWellness: next };
    });
  },

  incrementWater: () => {
    set((state) => {
      const next = { ...state.todayWellness, waterGlasses: state.todayWellness.waterGlasses + 1 };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next));
      return { todayWellness: next };
    });
  },

  decrementWater: () => {
    set((state) => {
      const next = {
        ...state.todayWellness,
        waterGlasses: Math.max(0, state.todayWellness.waterGlasses - 1),
      };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next));
      return { todayWellness: next };
    });
  },

  setMood: (mood) => {
    set((state) => {
      const next = { ...state.todayWellness, mood };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next));
      return { todayWellness: next };
    });
  },

  recordBreathingMinutes: (minutes) => {
    set((state) => {
      const next = {
        ...state,
        todayWellness: {
          ...state.todayWellness,
          breathingMinutes: state.todayWellness.breathingMinutes + minutes,
        },
      };
      localStorage.setItem('elevate_wellness_data', JSON.stringify(next.todayWellness));
      return next;
    });
  },

  addBrainDump: (content, category) => {
    set((state) => ({
      brainDumps: [
        {
          id: 'bd_' + Date.now(),
          content,
          category,
          createdAt: new Date().toISOString(),
          archived: false,
        },
        ...state.brainDumps,
      ],
    }));
  },

  archiveBrainDump: (id) => {
    set((state) => ({
      brainDumps: state.brainDumps.map((b) =>
        b.id === id ? { ...b, archived: !b.archived } : b
      ),
    }));
  },

  deleteBrainDump: (id) => {
    set((state) => ({
      brainDumps: state.brainDumps.filter((b) => b.id !== id),
    }));
  },

  addWorkoutSet: (exercise, sets, reps, weightKg) => {
    set((state) => ({
      workouts: [
        ...state.workouts,
        {
          id: 'w_' + Date.now(),
          exercise,
          sets,
          reps,
          weightKg,
          completed: false,
        },
      ],
    }));
  },

  toggleWorkoutSet: (id) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w
      ),
    }));
  },

  deleteWorkoutSet: (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },

  addMeetingNote: (title, attendees, decisions, actions) => {
    set((state) => ({
      meetingNotes: [
        {
          id: 'm_' + Date.now(),
          title,
          date: todayDateStr,
          attendees,
          keyDecisions: decisions,
          actionItems: actions,
        },
        ...state.meetingNotes,
      ],
    }));
  },

  deleteMeetingNote: (id) => {
    set((state) => ({
      meetingNotes: state.meetingNotes.filter((m) => m.id !== id),
    }));
  },

  addBudgetEntry: (title, amount, type, category) => {
    set((state) => {
      const entry: BudgetEntry = {
        id: 'b_' + Date.now(),
        title,
        amount,
        type,
        category,
        date: todayDateStr,
      };
      const next = [entry, ...state.budgetEntries];
      return { budgetEntries: next, budgetItems: next };
    });
  },

  deleteBudgetEntry: (id) => {
    set((state) => {
      const next = state.budgetEntries.filter((b) => b.id !== id);
      return { budgetEntries: next, budgetItems: next };
    });
  },

  addBudgetItem: (title, amount, type, category) => {
    set((state) => {
      const entry: BudgetEntry = {
        id: 'b_' + Date.now(),
        title,
        amount,
        type,
        category,
        date: todayDateStr,
      };
      const next = [entry, ...state.budgetEntries];
      return { budgetEntries: next, budgetItems: next };
    });
  },

  deleteBudgetItem: (id) => {
    set((state) => {
      const next = state.budgetEntries.filter((b) => b.id !== id);
      return { budgetEntries: next, budgetItems: next };
    });
  },
}));
