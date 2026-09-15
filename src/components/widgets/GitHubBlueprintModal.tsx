import { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  FolderTree,
  Download,
  Upload,
  X,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useThemeStore } from '../../stores/useThemeStore';

export function GitHubBlueprintModal({ onClose }: { onClose: () => void }) {
  const { theme } = useThemeStore();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleExport = () => {
    const backup = storageService.exportFullBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevateos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = storageService.importBackup(importJson);
    if (ok) {
      setImportStatus('Backup successfully imported! Reloading...');
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setImportStatus('Invalid JSON backup format. Please check file syntax.');
    }
  };

  const cliCommands = `# Step 1: Initialize local git repository
git init
git add .
git commit -m "feat(core): Initial architecture for ElevateOS gamified productivity suite"

# Step 2: Configure main branch & GitHub remote repository
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/elevateos.git

# Step 3: Push complete production codebase to GitHub
git push -u origin main

# (Optional) Deploy to Vercel / Cloud Run
npm run build
npx vercel --prod`;

  const directoryTree = `elevateos/
├── src/
│   ├── types/
│   │   └── index.ts                 # Full type specifications (User, Task, Habit, BacSubject)
│   ├── stores/
│   │   ├── useUserStore.ts          # Profile, role selection, PIN security
│   │   ├── useThemeStore.ts         # 5 Presets, accent palette, blue light mode
│   │   ├── useTaskStore.ts          # NLP parser, 3-tier goals, Eisenhower & Kanban
│   │   ├── useHabitStore.ts         # Streaks, streak shields, annual heatmap
│   │   ├── useGamificationStore.ts  # Level 1-50 calculation, XP reward store
│   │   ├── useFocusStore.ts         # Pomodoro, strict mode, ambient soundscape
│   │   ├── useBacStore.ts           # BAC countdown, curriculum units, كراس الأخطاء
│   │   └── useWellnessStore.ts      # 4-7-8 breathing, hydration, gratitude logs
│   ├── services/
│   │   ├── audioService.ts          # Web Audio API ambient noise & feedback synthesizers
│   │   ├── storageService.ts        # LocalStorage + Supabase sync & JSON backup
│   │   └── nlpTaskParser.ts         # Natural language task parser with duration & tags
│   ├── components/
│   │   ├── onboarding/
│   │   │   └── OnboardingFlow.tsx   # 3-step dynamic onboarding engine
│   │   ├── dashboard/
│   │   │   ├── DynamicDashboardRouter.tsx  # Role-based dashboard orchestrator
│   │   │   ├── BacDashboard.tsx            # BAC Student flagship view
│   │   │   ├── AthleteDashboard.tsx        # Athlete workouts & hydration
│   │   │   ├── ProfessionalDashboard.tsx   # Eisenhower & time tracking
│   │   │   └── PersonalDashboard.tsx       # Habit rings & micro-budget
│   │   ├── widgets/
│   │   │   ├── BacDashboardWidget.tsx      # Exam countdown & mistakes index
│   │   │   ├── PomodoroTimer.tsx           # Strict focus timer & mock exam mode
│   │   │   ├── HabitHeatmap.tsx            # GitHub-style 36-week heatmap
│   │   │   ├── TaskKanbanAndEisenhower.tsx # Kanban, Eisenhower & NLP tasks
│   │   │   ├── GamificationCard.tsx        # Dynamic Avatar & XP progress
│   │   │   ├── RewardStoreModal.tsx        # Custom XP reward redemption
│   │   │   ├── MistakesLogbookModal.tsx    # Digital كراس الأخطاء
│   │   │   ├── BreathingWidget.tsx         # 4-7-8 breathing decompression
│   │   │   ├── AnalyticsModal.tsx          # 0-100 productivity score algorithm
│   │   │   └── ShareStoryModal.tsx         # Instagram Story 9:16 progress card
│   │   └── common/
│   │       └── Navbar.tsx                  # Mode switch, theme picker, sync indicator
│   ├── App.tsx                             # Master application layout
│   └── main.tsx                            # React entry point`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="max-w-3xl w-full rounded-2xl border p-6 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white">ElevateOS Architectural Blueprint & GitHub Setup</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Principal engineering specification, complete modular directory hierarchy, and Git CLI setup guide.
          </p>
        </div>

        {/* CLI Setup Commands Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step-by-Step GitHub Push CLI Commands</span>
            </span>
            <button
              onClick={() => copyToClipboard(cliCommands, 'cli')}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-mono"
            >
              {copiedSection === 'cli' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'cli' ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/70 border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
            {cliCommands}
          </pre>
        </div>

        {/* Directory Structure Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-400" />
              <span>Production Directory Tree Blueprint</span>
            </span>
            <button
              onClick={() => copyToClipboard(directoryTree, 'tree')}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-mono"
            >
              {copiedSection === 'tree' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'tree' ? 'Copied!' : 'Copy Hierarchy'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/70 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-56">
            {directoryTree}
          </pre>
        </div>

        {/* JSON Export / Import Hub (Module 7 Data Portability) */}
        <div className="pt-3 border-t border-neutral-800 space-y-3">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Offline-First Data Portability (JSON Sync)
          </h4>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Full JSON Database Backup</span>
            </button>
          </div>

          <div className="pt-2">
            <label className="block text-[11px] text-neutral-400 mb-1">
              Import / Restore Existing ElevateOS JSON State:
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Paste exported JSON payload here..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono focus:outline-none"
              />
              <button
                onClick={handleImport}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black shrink-0"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Import
              </button>
            </div>
            {importStatus && (
              <div className="text-xs text-amber-400 mt-1 font-mono">{importStatus}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
