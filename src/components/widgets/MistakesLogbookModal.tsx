import { useState, FormEvent } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  X,
  Search,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { useBacStore } from '../../stores/useBacStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { BacMistakeEntry } from '../../types';

export function MistakesLogbookModal({ onClose }: { onClose: () => void }) {
  const { mistakes, subjects, addMistake, toggleMistakeReviewed, deleteMistake } = useBacStore();
  const { theme } = useThemeStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // New mistake state
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub_phys');
  const [exerciseRef, setExerciseRef] = useState('');
  const [mistakeType, setMistakeType] = useState<BacMistakeEntry['mistakeType']>('Calculation');
  const [errorDesc, setErrorDesc] = useState('');
  const [correctSol, setCorrectSol] = useState('');
  const [lesson, setLesson] = useState('');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!exerciseRef.trim() || !errorDesc.trim()) return;

    const sub = subjects.find((s) => s.id === selectedSubjectId);
    addMistake({
      subjectId: selectedSubjectId,
      subjectName: sub ? sub.name : 'Physics',
      exerciseRef: exerciseRef.trim(),
      mistakeType,
      errorDescription: errorDesc.trim(),
      correctSolution: correctSol.trim() || 'Refer to theoretical textbook model step.',
      lessonLearned: lesson.trim() || 'Double-check units and initial boundary assumptions.',
      needsReview: true,
    });

    setExerciseRef('');
    setErrorDesc('');
    setCorrectSol('');
    setLesson('');
    setShowAddForm(false);
  };

  const filtered = mistakes.filter((m) => {
    if (filterType !== 'all' && m.mistakeType !== filterType) return false;
    if (
      search &&
      !m.exerciseRef.toLowerCase().includes(search.toLowerCase()) &&
      !m.errorDescription.toLowerCase().includes(search.toLowerCase()) &&
      !m.subjectName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="max-w-2xl w-full rounded-2xl border p-6 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              ك
            </span>
            <h2 className="text-xl font-bold text-white">كراس الأخطاء (Digital Mistakes Logbook)</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Index every exam blotted step. Reviewing errors spaced over time is the #1 proven scientific technique for achieving top BAC rankings.
          </p>
        </div>

        {/* Controls: Search, Filter, Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search mistakes by exercise or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Calculation">Calculation</option>
              <option value="Formula Forgotten">Formula Forgotten</option>
              <option value="Conceptual">Conceptual</option>
              <option value="Question Misread">Question Misread</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 transition hover:opacity-90"
            style={{ backgroundColor: theme.primaryAccent }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Exam Error</span>
          </button>
        </div>

        {/* New Mistake Form */}
        {showAddForm && (
          <form
            onSubmit={handleAdd}
            className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-3 text-xs"
          >
            <h4 className="font-bold text-white uppercase">Record New Mistake</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">BAC Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Exercise Source / Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAC 2024 Math Ex 3 part B"
                  value={exerciseRef}
                  onChange={(e) => setExerciseRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Error Classification</label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value as BacMistakeEntry['mistakeType'])}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              >
                <option value="Calculation">Calculation (Wrong arithmetic/units)</option>
                <option value="Formula Forgotten">Formula Forgotten / Misstated</option>
                <option value="Conceptual">Conceptual misunderstanding</option>
                <option value="Question Misread">Question Misread / Skipped condition</option>
                <option value="Time Management">Time Management (Ran out of time)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">What went wrong?</label>
              <textarea
                rows={2}
                required
                placeholder="Exact step where the blunder occurred..."
                value={errorDesc}
                onChange={(e) => setErrorDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Correct Solution / Method</label>
              <textarea
                rows={2}
                placeholder="The rigorous mathematical / physical derivation..."
                value={correctSol}
                onChange={(e) => setCorrectSol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Lesson Learned for Next Exam</label>
              <input
                type="text"
                placeholder="Actionable reminder (e.g. Circle units in red)"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg font-bold text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Commit to Logbook
              </button>
            </div>
          </form>
        )}

        {/* Mistakes List */}
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border space-y-2.5 transition ${
                m.needsReview ? 'bg-neutral-900/80 border-amber-800/60' : 'bg-neutral-900/40 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{m.exerciseRef}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                    {m.subjectName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/60 text-cyan-300">
                    {m.mistakeType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMistakeReviewed(m.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition ${
                      m.needsReview
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.needsReview ? 'Mark Reviewed' : `Mastered (${m.reviewedTimes}x)`}</span>
                  </button>
                  <button
                    onClick={() => deleteMistake(m.id)}
                    className="p-1 rounded text-neutral-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-neutral-300">
                <span className="text-neutral-400 font-semibold">Mistake: </span>
                {m.errorDescription}
              </div>

              <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/50">
                <span className="font-semibold text-emerald-400">Correct Method: </span>
                {m.correctSolution}
              </div>

              {m.lessonLearned && (
                <div className="text-xs text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-900/50 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{m.lessonLearned}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
