import { BacDashboardWidget } from '../widgets/BacDashboardWidget';
import { PomodoroTimer } from '../widgets/PomodoroTimer';
import { TaskKanbanAndEisenhower } from '../widgets/TaskKanbanAndEisenhower';
import { HabitHeatmap } from '../widgets/HabitHeatmap';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { GamificationCard } from '../widgets/GamificationCard';
import { useBacStore } from '../../stores/useBacStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { GraduationCap, Award, Users, BookOpen } from 'lucide-react';

export function BacDashboard({
  onOpenMistakesLogbook,
  onOpenCalculator,
  onOpenRewardStore,
}: {
  onOpenMistakesLogbook: () => void;
  onOpenCalculator: () => void;
  onOpenRewardStore: () => void;
}) {
  const { studyPartners, calculateWeightedAverage } = useBacStore();
  const { theme } = useThemeStore();
  const { currentAverage, targetAverage } = calculateWeightedAverage();

  return (
    <div className="space-y-8">
      {/* Gamification & Dynamic Avatar Status */}
      <GamificationCard onOpenRewardStore={onOpenRewardStore} />

      {/* Flagship BAC Exam Countdown & Curriculum/Mistakes Widget */}
      <BacDashboardWidget
        onOpenMistakesLogbook={onOpenMistakesLogbook}
        onOpenCalculator={onOpenCalculator}
      />

      {/* Grade Estimator & Study Partner Live Indicator Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grade Summary Box */}
        <div
          className="p-5 rounded-2xl border flex items-center justify-between shadow-lg"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Weighted BAC Grade Target</h4>
            </div>
            <p className="text-xs text-neutral-400">Calculated across coefficients for Experimental Sciences stream</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black font-mono" style={{ color: theme.primaryAccent }}>
              {targetAverage} <span className="text-xs text-neutral-500 font-normal">/ 20.0</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Current Baseline: <strong className="text-white">{currentAverage}</strong>
            </div>
          </div>
        </div>

        {/* Study Partner Online Status Indicator */}
        <div
          className="p-5 rounded-2xl border shadow-lg space-y-2.5"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">BAC Study Circle (Simulated Peers)</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300">
              3 Active Now
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {studyPartners.slice(0, 4).map((p, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      p.status === 'focusing'
                        ? 'bg-amber-400 animate-pulse'
                        : p.status === 'online'
                        ? 'bg-emerald-400'
                        : 'bg-neutral-600'
                    }`}
                  />
                  <span className="font-medium text-white">{p.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono line-clamp-1">{p.subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus & Strict Pomodoro Timer */}
      <PomodoroTimer />

      {/* Task & Kanban Matrix */}
      <TaskKanbanAndEisenhower />

      {/* Habits & 36-Week Activity Heatmap */}
      <HabitHeatmap onOpenRewardStore={onOpenRewardStore} />

      {/* Wellness & 4-7-8 Breathing */}
      <BreathingWidget />
    </div>
  );
}
