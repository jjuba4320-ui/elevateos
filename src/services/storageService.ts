/**
 * ElevateOS Storage & Offline-First Sync Service
 * Handles localStorage, cloud synchronization abstraction (Supabase), and JSON export/import
 */

export interface SyncStatus {
  isOnline: boolean;
  lastSyncedAt: string;
  pendingChangesCount: number;
  syncMode: 'offline_local' | 'cloud_synced';
}

const STORAGE_KEYS = {
  USER: 'elevate_user_profile',
  THEME: 'elevate_theme_config',
  TASKS: 'elevate_tasks',
  HABITS: 'elevate_habits',
  GAMIFICATION: 'elevate_gamification',
  FOCUS: 'elevate_focus',
  BAC: 'elevate_bac_data',
  WELLNESS: 'elevate_wellness_data',
};

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set failed:', e);
    }
  },

  exportFullBackup(): string {
    const backup: Record<string, unknown> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      try {
        const item = localStorage.getItem(key);
        if (item) backup[name] = JSON.parse(item);
      } catch {
        // Ignore
      }
    });
    return JSON.stringify({
      app: 'ElevateOS',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      data: backup,
    }, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) return false;
      Object.entries(parsed.data).forEach(([name, val]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
        if (key && val) {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });
      return true;
    } catch {
      return false;
    }
  },
};
