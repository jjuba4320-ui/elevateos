import { useState, FormEvent } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Mic,
  MicOff,
  Sparkles,
  Layers,
  Grid,
  List,
  Clock,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { parseNaturalLanguageTask } from '../../services/nlpTaskParser';
import { TaskPriority, TaskStatus, Task } from '../../types';

export function TaskKanbanAndEisenhower() {
  const {
    tasks,
    filterTag,
    filterPriority,
    searchQuery,
    autoRolloverActive,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    toggleAutoRollover,
    rolloverUnfinishedTasks,
    setFilterTag,
    setFilterPriority,
  } = useTaskStore();

  const { theme } = useThemeStore();

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'eisenhower'>('list');
  const [nlpInput, setNlpInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<Record<string, string>>({});

  // Voice recognition via Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser environment. You can type naturally into the NLP input box.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNlpInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;

    const parsed = parseNaturalLanguageTask(nlpInput);
    addTask({
      title: parsed.title,
      priority: parsed.priority,
      status: 'todo',
      estimatedMinutes: parsed.estimatedMinutes,
      actualMinutes: 0,
      tags: parsed.tags.length > 0 ? parsed.tags : ['Focus'],
      subtasks: [],
      recurrence: 'none',
      rolloverEnabled: true,
      dueDate: parsed.dueDate || new Date().toISOString().split('T')[0],
    });

    setNlpInput('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterTag && !t.tags.includes(filterTag)) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Priority styling
  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'P1':
        return { text: 'P1 Urgent', bg: 'bg-rose-950/60', textCol: 'text-rose-400', border: 'border-rose-800' };
      case 'P2':
        return { text: 'P2 High', bg: 'bg-amber-950/60', textCol: 'text-amber-400', border: 'border-amber-800' };
      case 'P3':
        return { text: 'P3 Medium', bg: 'bg-blue-950/60', textCol: 'text-blue-400', border: 'border-blue-800' };
      case 'P4':
        return { text: 'P4 Low', bg: 'bg-neutral-800', textCol: 'text-neutral-400', border: 'border-neutral-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Natural Language Task Input Bar & Voice Input */}
      <div
        className="p-5 rounded-2xl border shadow-xl space-y-4"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-lg text-white">Execution Command & Task Matrix</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Natural language parser automatically tags #modules, dates, duration, and priority (e.g. <i>"Solve BAC Physics 45m tomorrow p1 #BAC"</i>)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoRollover}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                autoRolloverActive
                  ? 'bg-cyan-950/40 border-cyan-700 text-cyan-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
              title="Automatically push unfinished tasks to the next morning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Auto-Rollover: {autoRolloverActive ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={rolloverUnfinishedTasks}
              className="px-2.5 py-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs"
              title="Trigger Rollover Now"
            >
              Roll Now
            </button>
          </div>
        </div>

        {/* NLP Input Field */}
        <form onSubmit={handleQuickAdd} className="relative flex items-center gap-2">
          <input
            type="text"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            placeholder="Type task: 'Solve Physics mock exam 90m tomorrow p1 #BAC_Physics' or speak..."
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-400"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Voice-to-Task Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!nlpInput.trim()}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-black disabled:opacity-40 transition"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              Add
            </button>
          </div>
        </form>

        {/* View Switchers: List vs Kanban vs Eisenhower */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            {[
              { id: 'list', label: 'Detailed List', icon: List },
              { id: 'kanban', label: 'Kanban Board', icon: Layers },
              { id: 'eisenhower', label: 'Eisenhower Matrix', icon: Grid },
            ].map((v) => {
              const Icon = v.icon;
              const isSel = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as typeof viewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                    isSel ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="P1">P1 Urgent</option>
              <option value="P2">P2 High</option>
              <option value="P3">P3 Medium</option>
              <option value="P4">P4 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: DETAILED LIST WITH SUBTASK HIERARCHY */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const badge = getPriorityBadge(task.priority);
            const completedSubs = task.subtasks.filter((s) => s.completed).length;
            const totalSubs = task.subtasks.length;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted ? 'bg-neutral-900/30 border-neutral-800/80 opacity-75' : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 transition ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-cyan-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div>
                      <h3 className={`text-sm font-semibold ${isCompleted ? 'line-through text-neutral-500' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-neutral-400 mt-0.5">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${badge.bg} ${badge.textCol} ${badge.border}`}>
                          {badge.text}
                        </span>

                        {task.estimatedMinutes && (
                          <span className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedMinutes}m est</span>
                          </span>
                        )}

                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </span>
                        )}

                        {task.tags.map((tg) => (
                          <span key={tg} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:text-rose-400 transition"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtask Hierarchy with Progress Meters */}
                {totalSubs > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-neutral-800/80 pl-9 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Subtask Progress ({completedSubs}/{totalSubs})</span>
                      <span className="font-mono">{Math.round((completedSubs / totalSubs) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${(completedSubs / totalSubs) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {task.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => toggleSubtask(task.id, sub.id)}
                          className="flex items-center justify-between text-xs text-neutral-300 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                                sub.completed ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'border-neutral-600'
                              }`}
                            >
                              {sub.completed && '✓'}
                            </div>
                            <span className={sub.completed ? 'line-through text-neutral-500' : ''}>
                              {sub.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSubtask(task.id, sub.id);
                            }}
                            className="text-neutral-600 hover:text-rose-400 opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Add Subtask Input */}
                <div className="mt-2.5 pl-9 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="+ Add subtask step..."
                    value={newSubtaskTitle[task.id] || ''}
                    onChange={(e) => setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newSubtaskTitle[task.id];
                        if (val && val.trim()) {
                          addSubtask(task.id, val.trim());
                          setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: '' });
                        }
                      }
                    }}
                    className="w-full text-xs px-2.5 py-1 rounded bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'todo', title: 'To Do', colTasks: tasks.filter((t) => t.status === 'todo') },
            { id: 'in_progress', title: 'In Progress', colTasks: tasks.filter((t) => t.status === 'in_progress') },
            { id: 'completed', title: 'Completed', colTasks: tasks.filter((t) => t.status === 'completed') },
          ].map((col) => (
            <div
              key={col.id}
              className="p-4 rounded-xl border bg-neutral-900/40 border-neutral-800 space-y-3 min-h-[360px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h4 className="font-semibold text-sm text-white">{col.title}</h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {col.colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {col.colTasks.map((t) => {
                  const badge = getPriorityBadge(t.priority);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg border bg-neutral-900 border-neutral-800 space-y-2 hover:border-neutral-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{t.title}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${badge.bg} ${badge.textCol} ${badge.border}`}>
                          {t.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[10px]">
                        <span className="text-neutral-500 font-mono">{t.estimatedMinutes}m</span>
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => setTaskStatus(t.id, 'todo')}
                              className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                            >
                              ← ToDo
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              onClick={() => setTaskStatus(t.id, 'in_progress')}
                              className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                            >
                              InProg
                            </button>
                          )}
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => setTaskStatus(t.id, 'completed')}
                              className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                            >
                              Done ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: EISENHOWER MATRIX (Urgent vs Important) */}
      {viewMode === 'eisenhower' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Do First (Urgent & Important - P1)',
              tasks: tasks.filter((t) => t.priority === 'P1' && t.status !== 'completed'),
              border: 'border-rose-800/80',
              bg: 'bg-rose-950/20',
              badge: 'P1',
            },
            {
              title: 'Schedule (Important, Not Urgent - P2)',
              tasks: tasks.filter((t) => t.priority === 'P2' && t.status !== 'completed'),
              border: 'border-amber-800/80',
              bg: 'bg-amber-950/20',
              badge: 'P2',
            },
            {
              title: 'Delegate / Quick Batch (Urgent, Less Important - P3)',
              tasks: tasks.filter((t) => t.priority === 'P3' && t.status !== 'completed'),
              border: 'border-blue-800/80',
              bg: 'bg-blue-950/20',
              badge: 'P3',
            },
            {
              title: 'Eliminate / Backlog (Low Priority - P4)',
              tasks: tasks.filter((t) => t.priority === 'P4' && t.status !== 'completed'),
              border: 'border-neutral-700',
              bg: 'bg-neutral-900/40',
              badge: 'P4',
            },
          ].map((quad, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${quad.border} ${quad.bg} space-y-3 min-h-[200px]`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h4 className="font-semibold text-xs text-white uppercase tracking-wider">{quad.title}</h4>
                <span className="text-xs font-mono font-bold text-neutral-400">{quad.tasks.length}</span>
              </div>

              <div className="space-y-2">
                {quad.tasks.length === 0 ? (
                  <div className="text-xs text-neutral-500 italic py-4 text-center">No tasks in this quadrant</div>
                ) : (
                  quad.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskStatus(t.id)}
                      className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 hover:border-cyan-400 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded border border-neutral-600" />
                        <span>{t.title}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">{t.estimatedMinutes}m</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
