/**
 * ElevateOS - Core TypeScript Interfaces & System Specifications
 */

export type UserRole =
  | 'bac_student'
  | 'athlete'
  | 'professional'
  | 'personal';

export type ProfileMode = 'study_mode' | 'work_mode' | 'vacation_mode' | 'beast_mode';

export type ThemePreset =
  | 'dark_neon'
  | 'midnight_gold'
  | 'cyberpunk_slate'
  | 'pastel_warm'
  | 'forest_emerald';

export interface ThemeConfig {
  preset: ThemePreset;
  primaryAccent: string; // Hex or CSS color
  secondaryAccent: string;
  bgDark: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderSubtle: string;
  blueLightFilter: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  mainGoal: string;
  role: UserRole;
  avatarSeed: string;
  avatarLevel: number;
  profileMode: ProfileMode;
  isOnboarded: boolean;
  pinCode?: string;
  isPinLocked: boolean;
  createdAt: string;
  lastActive: string;
}

// ============ MODULE 2: TASKS & GOALS ============

export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // ISO date
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: string[];
  subtasks: SubTask[];
  recurrence: RecurrencePattern;
  goalMilestoneId?: string;
  rolloverEnabled: boolean;
  completedAt?: string;
  subjectTag?: string; // For BAC or student context
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  yearlyGoalId: string;
  title: string;
  targetMonth: string;
  completed: boolean;
  progressPercent: number;
}

export interface YearlyGoal {
  id: string;
  year: number;
  title: string;
  category: 'Academics' | 'Fitness' | 'Career' | 'Personal' | 'Finance';
  targetDate: string;
  milestones: GoalMilestone[];
  progress: number;
}

// ============ MODULE 3: HABITS & GAMIFICATION ============

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  icon: string;
  streak: number;
  bestStreak: number;
  streakShields: number; // freeze day protection
  logs: Record<string, boolean>; // 'YYYY-MM-DD': true
  targetPerDay: number;
  currentToday: number;
  unit: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  color: string;
  archived: boolean;
  createdAt: string;
}

export interface BadHabitBreakTimer {
  id: string;
  habitName: string;
  cleanSinceDate: string; // ISO
  relapseCount: number;
  reasonToQuit: string;
  savingsPerDay?: number; // e.g., money or time saved
}

export interface GamificationState {
  xp: number;
  level: number;
  title: string;
  streakShieldsAvailable: number;
  totalTasksDone: number;
  totalFocusMinutes: number;
  totalHabitChecks: number;
  badges: Badge[];
  unlockedThemes: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
}

export interface RewardItem {
  id: string;
  title: string;
  costXp: number;
  icon: string;
  category: string;
  redeemedCount: number;
}

// ============ MODULE 4: FOCUS & TIME ============

export type FocusModeType = 'pomodoro' | 'short_break' | 'long_break' | 'stopwatch_exam';

export interface FocusSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  strictModeEnabled: boolean;
  autoStartBreaks: boolean;
  dailyGoalHours: number;
  soundscapeVolume: number;
}

export interface FocusSession {
  id: string;
  type: FocusModeType;
  durationMinutes: number;
  subjectOrProject: string;
  timestamp: string;
  notes?: string;
  strictModeEnforced: boolean;
}

// ============ MODULE 5: BAC & STUDENT EXCLUSIVE ============

export type BacBranch =
  | 'experimental_sciences' // علوم تجريبية
  | 'mathematics' // رياضيات
  | 'math_technical' // تقني رياضي
  | 'management_economics' // تسيير واقتصاد
  | 'foreign_languages' // لغات أجنبية
  | 'literature_philosophy'; // آداب وفلسفة

export interface BacSubject {
  id: string;
  name: string;
  nameAr: string;
  coefficient: number;
  targetGrade: number; // 0 to 20
  currentEstimatedGrade: number;
  revisionPercentage: number;
  units: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface BacMistakeEntry {
  id: string;
  date: string;
  subjectId: string;
  subjectName: string;
  exerciseRef: string; // e.g., "BAC 2023 Session 1 Ex 3"
  mistakeType: 'Conceptual' | 'Calculation' | 'Formula Forgotten' | 'Time Management' | 'Question Misread';
  errorDescription: string;
  correctSolution: string;
  lessonLearned: string;
  needsReview: boolean;
  reviewedTimes: number;
}

export interface FormulaNote {
  id: string;
  subjectId: string;
  subjectName: string;
  unit: string;
  title: string;
  latexOrRule: string;
  keyConditions: string;
}

// ============ MODULE 6: ANALYTICS & INSIGHTS ============

export interface DailyProductivityScore {
  date: string;
  score: number; // 0 - 100
  focusScore: number;
  taskScore: number;
  habitScore: number;
  mood?: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
}

// ============ MODULE 8: WELLNESS ============

export interface WellnessEntry {
  date: string; // YYYY-MM-DD
  oneLineJournal: string;
  gratitudeList: string[]; // 3 items
  waterGlasses: number; // target e.g. 8
  mood: 'energized' | 'calm' | 'focused' | 'drained' | 'anxious';
  breathingMinutes: number;
}

export interface BrainDumpNote {
  id: string;
  content: string;
  createdAt: string;
  category: 'idea' | 'urgent' | 'later' | 'random';
  archived: boolean;
}
