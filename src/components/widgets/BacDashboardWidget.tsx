import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  AlertCircle,
  BookOpen,
  Calculator,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useBacStore } from '../../stores/useBacStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { BacSubject } from '../../types';

interface BacCountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function BacDashboardWidget({
  onOpenMistakesLogbook,
  onOpenCalculator,
}: {
  onOpenMistakesLogbook?: () => void;
  onOpenCalculator?: () => void;
}) {
  const { examDate, subjects, mistakes, formulas, toggleUnitCompleted } = useBacStore();
  const { theme } = useThemeStore();

  const [countdown, setCountdown] = useState<BacCountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_math');
  const [formulaSearch, setFormulaSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'curriculum' | 'formulas' | 'mistakes'>('curriculum');

  // Real-time Countdown calculation
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(examDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [examDate]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const pendingMistakesCount = mistakes.filter((m) => m.needsReview).length;

  const filteredFormulas = formulas.filter(
    (f) =>
      f.title.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.subjectName.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.unit.toLowerCase().includes(formulaSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time BAC Countdown & Motivational Focus Engine */}
      <div
        id="bac-countdown-banner"
        className="p-6 rounded-2xl border relative overflow-hidden shadow-xl"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.borderSubtle,
        }}
      >
        <div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: theme.primaryAccent }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: theme.primaryAccent }}>
                Baccalaureate National Examination (BAC)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Target Exam Date: {new Date(examDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Every Pomodoro block and error logged into your <span className="text-cyan-300 font-medium">Mistakes Logbook</span> builds the mental foundation for highest honors (Mention Très Bien).
            </p>
          </div>

          {/* Countdown Clock Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full sm:w-auto">
            {[
              { label: 'DAYS', val: countdown.days },
              { label: 'HOURS', val: countdown.hours },
              { label: 'MINS', val: countdown.minutes },
              { label: 'SECS', val: countdown.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="px-3.5 py-3 rounded-xl border text-center min-w-[64px] sm:min-w-[76px]"
                style={{
                  backgroundColor: theme.bgDark,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="text-xl sm:text-2xl font-black font-mono tracking-tight" style={{ color: theme.primaryAccent }}>
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'curriculum'
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
              style={{ backgroundColor: activeTab === 'curriculum' ? theme.primaryAccent : undefined }}
            >
              Curriculum & Units Tracker
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'formulas'
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
              style={{ backgroundColor: activeTab === 'formulas' ? theme.primaryAccent : undefined }}
            >
              Formula Sheets ({formulas.length})
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'mistakes'
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
              style={{ backgroundColor: activeTab === 'mistakes' ? theme.primaryAccent : undefined }}
            >
              <span>كراس الأخطاء (Mistakes)</span>
              {pendingMistakesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingMistakesCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 transition"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Grade & Coeff Simulator</span>
              </button>
            )}
            {onOpenMistakesLogbook && (
              <button
                onClick={onOpenMistakesLogbook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 transition"
              >
                <Plus className="w-3.5 h-3.5" style={{ color: theme.primaryAccent }} />
                <span>Log New Mistake</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: CURRICULUM & UNITS TRACKER */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subject selector sidebar */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
              BAC Subjects & Coefficients
            </div>
            {subjects.map((sub: BacSubject) => {
              const isSelected = sub.id === selectedSubjectId;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected ? 'ring-1 shadow-md' : 'hover:border-neutral-700 opacity-85'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : theme.cardBg,
                    borderColor: isSelected ? theme.primaryAccent : theme.borderSubtle,
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{sub.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">({sub.nameAr})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <span className="font-mono">Coeff: {sub.coefficient}</span>
                      <span>•</span>
                      <span>Target: {sub.targetGrade}/20</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono" style={{ color: theme.primaryAccent }}>
                      {sub.revisionPercentage}%
                    </span>
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${sub.revisionPercentage}%`,
                          backgroundColor: theme.primaryAccent,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Units breakdown for selected subject */}
          <div
            className="lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderSubtle,
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{activeSubject.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400 font-mono">
                      {activeSubject.nameAr}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click each unit to toggle revision mastery status. Real-time updates stored offline.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400">Curriculum Mastery</div>
                  <div className="text-xl font-bold font-mono" style={{ color: theme.primaryAccent }}>
                    {activeSubject.revisionPercentage}%
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {activeSubject.units.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => toggleUnitCompleted(activeSubject.id, unit.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      unit.completed
                        ? 'bg-emerald-950/20 border-emerald-900/60 text-neutral-200'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs transition ${
                          unit.completed
                            ? 'bg-emerald-500 border-emerald-500 text-black font-bold'
                            : 'border-neutral-600 bg-neutral-800'
                        }`}
                      >
                        {unit.completed && '✓'}
                      </div>
                      <span className={`text-sm ${unit.completed ? 'line-through text-neutral-400' : 'font-medium'}`}>
                        {unit.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        unit.completed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {unit.completed ? 'Mastered' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Spaced Repetition: Revisit unmastered units every 3 days.</span>
              </span>
              <span className="font-mono">
                {activeSubject.units.filter((u) => u.completed).length} / {activeSubject.units.length} Units Complete
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORMULA NOTES */}
      {activeTab === 'formulas' && (
        <div
          className="p-5 rounded-2xl border space-y-4"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Instant Formula & Rules Cheatsheet</h3>
              <p className="text-xs text-neutral-400">Crucial mathematical theorems and physics laws for immediate reference.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                placeholder="Search formulas or rules..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFormulas.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border bg-neutral-900/60 border-neutral-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{f.title}</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px]">
                    {f.subjectName} • {f.unit}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-neutral-800 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                  {f.latexOrRule}
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-amber-400 font-semibold">Key Condition: </span>
                  {f.keyConditions}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MISTAKES LOGBOOK PREVIEW */}
      {activeTab === 'mistakes' && (
        <div
          className="p-5 rounded-2xl border space-y-4"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">كراس الأخطاء — Baccalaureate Mistakes Index</h3>
              <p className="text-xs text-neutral-400">
                Turn past exam blunders into high-scoring intuition. Mistakes reviewed 3+ times drop recurrence by 92%.
              </p>
            </div>
            {onOpenMistakesLogbook && (
              <button
                onClick={onOpenMistakesLogbook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open Full Logbook</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border space-y-2 transition ${
                  m.needsReview ? 'bg-amber-950/20 border-amber-800/40' : 'bg-neutral-900/40 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{m.exerciseRef}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                      {m.subjectName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        m.mistakeType === 'Formula Forgotten'
                          ? 'bg-rose-900/40 text-rose-300'
                          : m.mistakeType === 'Calculation'
                          ? 'bg-amber-900/40 text-amber-300'
                          : 'bg-blue-900/40 text-blue-300'
                      }`}
                    >
                      {m.mistakeType}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      m.needsReview ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {m.needsReview ? 'Needs Spaced Review' : `Mastered (${m.reviewedTimes}x)`}
                  </span>
                </div>

                <div className="text-xs text-neutral-300">
                  <span className="text-neutral-400 font-medium">Error: </span>
                  {m.errorDescription}
                </div>

                <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="font-semibold text-emerald-400">Correct Method: </span>
                  {m.correctSolution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
