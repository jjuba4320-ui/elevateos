import { create } from 'zustand';
import { UserProfile, UserRole, ProfileMode } from '../types';

interface UserState {
  profile: UserProfile;
  syncStatus: {
    isOnline: boolean;
    lastSynced: string;
    pendingSyncs: number;
    cloudConnected: boolean;
  };
  setProfile: (profile: Partial<UserProfile>) => void;
  setOnboarded: (val: boolean) => void;
  setRole: (role: UserRole) => void;
  completeOnboarding: (data: { name: string; age: number; mainGoal: string; role: UserRole }) => void;
  setProfileMode: (mode: ProfileMode) => void;
  setPinLock: (pin: string | undefined) => void;
  unlockWithPin: (pin: string) => boolean;
  lockApp: () => void;
  resetOnboarding: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_elevate_01',
  name: 'Amine Benali',
  age: 18,
  mainGoal: 'Score 17.5+ in BAC & Master Physics and Mathematics',
  role: 'bac_student',
  avatarSeed: 'Atlas',
  avatarLevel: 1,
  profileMode: 'study_mode',
  isOnboarded: false,
  pinCode: undefined,
  isPinLocked: false,
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
};

export const useUserStore = create<UserState>((set, get) => {
  // Try to load persisted user
  const saved = localStorage.getItem('elevate_user_profile');
  const initialProfile = saved ? { ...DEFAULT_USER, ...JSON.parse(saved) } : DEFAULT_USER;

  return {
    profile: initialProfile,
    syncStatus: {
      isOnline: navigator.onLine,
      lastSynced: 'Just now',
      pendingSyncs: 0,
      cloudConnected: true,
    },

    setProfile: (updates) => {
      set((state) => {
        const next = { ...state.profile, ...updates };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    setOnboarded: (val) => {
      set((state) => {
        const next = { ...state.profile, isOnboarded: val };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    setRole: (role) => {
      set((state) => {
        const next = { ...state.profile, role };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    completeOnboarding: ({ name, age, mainGoal, role }) => {
      set((state) => {
        const next: UserProfile = {
          ...state.profile,
          name: name.trim() || 'Hero',
          age: age || 18,
          mainGoal: mainGoal.trim() || 'Achieve peak excellence',
          role,
          isOnboarded: true,
          lastActive: new Date().toISOString(),
        };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    setProfileMode: (mode) => {
      set((state) => {
        const next = { ...state.profile, profileMode: mode };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    setPinLock: (pin) => {
      set((state) => {
        const next = { ...state.profile, pinCode: pin, isPinLocked: false };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },

    unlockWithPin: (pin) => {
      const currentPin = get().profile.pinCode;
      if (!currentPin || currentPin === pin) {
        set((state) => ({ profile: { ...state.profile, isPinLocked: false } }));
        return true;
      }
      return false;
    },

    lockApp: () => {
      if (get().profile.pinCode) {
        set((state) => ({ profile: { ...state.profile, isPinLocked: true } }));
      }
    },

    resetOnboarding: () => {
      set(() => {
        const next = { ...DEFAULT_USER, isOnboarded: false };
        localStorage.setItem('elevate_user_profile', JSON.stringify(next));
        return { profile: next };
      });
    },
  };
});
