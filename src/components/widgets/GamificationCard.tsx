import {
  Sparkles,
  Zap,
  Gift,
  Award,
  Flame,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useGamificationStore, calculateLevel } from '../../stores/useGamificationStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useUserStore } from '../../stores/useUserStore';

export function GamificationCard({ onOpenRewardStore }: { onOpenRewardStore?: () => void }) {
  const { xp, level, title, streakShieldsAvailable, totalTasksDone, totalFocusMinutes, totalHabitChecks, badges } =
    useGamificationStore();
  const { profile } = useUserStore();
  const { theme } = useThemeStore();

  const { progress, nextLevelXp } = calculateLevel(xp);

  // Avatar rank badge icon / style based on level
  const getAvatarRankBadge = () => {
    if (level >= 35) return { label: 'Mythic Paragon', color: 'from-amber-400 to-rose-500', glow: 'shadow-amber-500/30' };
    if (level >= 20) return { label: 'Apex Master', color: 'from-violet-500 to-cyan-400', glow: 'shadow-violet-500/30' };
    if (level >= 10) return { label: 'Elite Champion', color: 'from-cyan-400 to-emerald-400', glow: 'shadow-cyan-500/30' };
    return { label: 'Focused Apprentice', color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/30' };
  };

  const rankBadge = getAvatarRankBadge();

  return (
    <div
      id="gamification-status-card"
      className="p-6 rounded-2xl border relative overflow-hidden shadow-xl space-y-5"
      style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Avatar & Identity Evolution */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Dynamic Avatar Ring */}
            <div
              className={`w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr ${rankBadge.color} shadow-lg ${rankBadge.glow} flex items-center justify-center`}
            >
              <div
                className="w-full h-full rounded-[14px] flex items-center justify-center font-black text-xl text-white relative overflow-hidden"
                style={{ backgroundColor: theme.bgDark }}
              >
                <span>{profile.name ? profile.name.slice(0, 2).toUpperCase() : 'EO'}</span>
                {/* Level badge attached */}
                <div
                  className="absolute bottom-0 inset-x-0 py-0.5 text-[9px] font-mono font-bold text-center text-black"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  LVL {level}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">{profile.name}</h3>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                style={{ backgroundColor: `${theme.primaryAccent}22`, color: theme.primaryAccent }}
              >
                {title}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Role: <span className="capitalize text-neutral-200">{profile.role.replace('_', ' ')}</span> • Mode: <span className="capitalize text-neutral-200">{profile.profileMode.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {/* Reward Store Launcher */}
        {onOpenRewardStore && (
          <button
            onClick={onOpenRewardStore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-black transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            <Gift className="w-4 h-4" />
            <span>Reward Store</span>
          </button>
        )}
      </div>

      {/* XP Level Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-neutral-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>XP Energy: <strong>{xp}</strong> XP</span>
          </span>
          <span className="font-mono text-neutral-400 text-[11px]">
            Next Level at {nextLevelXp} XP ({100 - progress}% to go)
          </span>
        </div>
        <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: theme.primaryAccent }}
          />
        </div>
      </div>

      {/* Gamification Core Stat Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tasks Done</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">{totalTasksDone}</div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Focus Time</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">{Math.round(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m</div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Habit Checks</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">{totalHabitChecks}</div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-1 text-violet-400 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Streak Shields</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">{streakShieldsAvailable} Active</div>
        </div>
      </div>
    </div>
  );
}
