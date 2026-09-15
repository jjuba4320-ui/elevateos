import { create } from 'zustand';
import { FocusModeType, FocusSettings, FocusSession } from '../types';
import { soundscapeEngine } from '../services/audioService';
import { useGamificationStore } from './useGamificationStore';

interface FocusStore {
  mode: FocusModeType;
  timeLeftSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  activeSubjectOrProject: string;
  notes: string;
  settings: FocusSettings;
  activeAmbient: 'rain' | 'white_noise' | 'library' | 'cafe' | 'off';
  sessionHistory: FocusSession[];
  todayFocusMinutes: number;
  stopwatchElapsedSeconds: number;

  // Actions
  setMode: (mode: FocusModeType) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  finishCurrentSession: () => void;
  setSubjectOrProject: (subject: string) => void;
  setAmbientSound: (sound: 'rain' | 'white_noise' | 'library' | 'cafe' | 'off') => void;
  setAmbientVolume: (vol: number) => void;
  updateSettings: (settings: Partial<FocusSettings>) => void;
}

const DEFAULT_SETTINGS: FocusSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  strictModeEnabled: true,
  autoStartBreaks: false,
  dailyGoalHours: 4.0,
  soundscapeVolume: 0.25,
};

const SAMPLE_HISTORY: FocusSession[] = [
  {
    id: 'foc_1',
    type: 'pomodoro',
    durationMinutes: 25,
    subjectOrProject: 'BAC Mathematics',
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    strictModeEnforced: true,
  },
  {
    id: 'foc_2',
    type: 'pomodoro',
    durationMinutes: 25,
    subjectOrProject: 'BAC Physics',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    strictModeEnforced: true,
  },
  {
    id: 'foc_3',
    type: 'stopwatch_exam',
    durationMinutes: 90,
    subjectOrProject: 'Physics Mock Exam 2024',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    strictModeEnforced: true,
  },
];

const savedHistory = localStorage.getItem('elevate_focus_history');
const initialHistory = savedHistory ? JSON.parse(savedHistory) : SAMPLE_HISTORY;

export const useFocusStore = create<FocusStore>((set, get) => ({
  mode: 'pomodoro',
  timeLeftSeconds: DEFAULT_SETTINGS.workMinutes * 60,
  totalDurationSeconds: DEFAULT_SETTINGS.workMinutes * 60,
  isRunning: false,
  activeSubjectOrProject: 'BAC Mathematics',
  notes: '',
  settings: DEFAULT_SETTINGS,
  activeAmbient: 'off',
  sessionHistory: initialHistory,
  todayFocusMinutes: 110,
  stopwatchElapsedSeconds: 0,

  setMode: (mode) => {
    const { settings } = get();
    let mins = settings.workMinutes;
    if (mode === 'short_break') mins = settings.shortBreakMinutes;
    if (mode === 'long_break') mins = settings.longBreakMinutes;

    set({
      mode,
      isRunning: false,
      timeLeftSeconds: mins * 60,
      totalDurationSeconds: mins * 60,
      stopwatchElapsedSeconds: 0,
    });
  },

  startTimer: () => {
    set({ isRunning: true });
    const { activeAmbient, settings } = get();
    if (activeAmbient !== 'off') {
      soundscapeEngine.startAmbientSound(activeAmbient, settings.soundscapeVolume);
    }
  },

  pauseTimer: () => {
    set({ isRunning: false });
    soundscapeEngine.stopAmbientSound();
  },

  resetTimer: () => {
    const { mode, settings } = get();
    let mins = settings.workMinutes;
    if (mode === 'short_break') mins = settings.shortBreakMinutes;
    if (mode === 'long_break') mins = settings.longBreakMinutes;

    set({
      isRunning: false,
      timeLeftSeconds: mins * 60,
      totalDurationSeconds: mins * 60,
      stopwatchElapsedSeconds: 0,
    });
    soundscapeEngine.stopAmbientSound();
  },

  tickTimer: () => {
    const state = get();
    if (!state.isRunning) return;

    if (state.mode === 'stopwatch_exam') {
      set({ stopwatchElapsedSeconds: state.stopwatchElapsedSeconds + 1 });
      return;
    }

    if (state.timeLeftSeconds <= 1) {
      // Finished
      get().finishCurrentSession();
    } else {
      set({ timeLeftSeconds: state.timeLeftSeconds - 1 });
    }
  },

  finishCurrentSession: () => {
    const state = get();
    soundscapeEngine.stopAmbientSound();
    soundscapeEngine.playPomodoroBell();

    const isWorkOrExam = state.mode === 'pomodoro' || state.mode === 'stopwatch_exam';
    const durationMins =
      state.mode === 'stopwatch_exam'
        ? Math.max(1, Math.round(state.stopwatchElapsedSeconds / 60))
        : Math.round(state.totalDurationSeconds / 60);

    if (isWorkOrExam) {
      useGamificationStore.getState().recordFocusCompleted(durationMins);
    }

    const newSession: FocusSession = {
      id: 'foc_' + Date.now(),
      type: state.mode,
      durationMinutes: durationMins,
      subjectOrProject: state.activeSubjectOrProject,
      timestamp: new Date().toISOString(),
      strictModeEnforced: state.settings.strictModeEnabled,
    };

    const nextHistory = [newSession, ...state.sessionHistory];
    localStorage.setItem('elevate_focus_history', JSON.stringify(nextHistory));

    set({
      isRunning: false,
      timeLeftSeconds: state.settings.workMinutes * 60,
      stopwatchElapsedSeconds: 0,
      sessionHistory: nextHistory,
      todayFocusMinutes: state.todayFocusMinutes + (isWorkOrExam ? durationMins : 0),
    });
  },

  setSubjectOrProject: (subject) => set({ activeSubjectOrProject: subject }),

  setAmbientSound: (sound) => {
    const { isRunning, settings } = get();
    set({ activeAmbient: sound });
    if (sound === 'off') {
      soundscapeEngine.stopAmbientSound();
    } else if (isRunning) {
      soundscapeEngine.startAmbientSound(sound, settings.soundscapeVolume);
    }
  },

  setAmbientVolume: (vol) => {
    soundscapeEngine.setAmbientVolume(vol);
    set((state) => ({
      settings: { ...state.settings, soundscapeVolume: vol },
    }));
  },

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
  },
}));
