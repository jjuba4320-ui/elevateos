import React, { useState, FormEvent } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Sparkles,
  Clock,
  ArrowRight,
  Check,
  Filter,
  Layers,
  AlertCircle,
  Flag,
  RotateCcw,
  List,
  Columns,
  Grid,
} from 'lucide-react';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useNotionStore } from '../../../stores/useNotionStore';
import { TaskPriority, TaskStatus, Task } from '../../../types';
import { parseNaturalLanguageTask } from '../../../services/nlpTaskParser';

export function NotionTaskHub() {
  const {
    tasks,
    filterTag,
    filterPriority,
    searchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    rolloverUnfinishedTasks,
    setFilterTag,
    setFilterPriority,
  } = useTaskStore();

  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'eisenhower'>('list');
  const [nlpInput, setNlpInput] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual Add Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPriority, setManualPriority] = useState<TaskPriority>('P2');
  const [manualDueDate, setManualDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualTag, setManualTag] = useState('');

  const isArabic = language === 'ar';

  const handleNlpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;

    const parsed = parseNaturalLanguageTask(nlpInput);
    addTask({
      title: parsed.title,
      description: '',
      priority: parsed.priority,
      status: 'todo',
      dueDate: parsed.dueDate,
      estimatedMinutes: parsed.estimatedMinutes || 25,
      actualMinutes: 0,
      tags: parsed.tags,
      subtasks: [],
      recurrence: 'none',
      rolloverEnabled: true,
      subjectTag: parsed.tags[0] || 'General',
    });

    setNlpInput('');
  };

  const handleManualAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    addTask({
      title: manualTitle.trim(),
      description: manualDesc.trim(),
      priority: manualPriority,
      status: 'todo',
      dueDate: manualDueDate,
      estimatedMinutes: Number(manualMinutes) || 30,
      actualMinutes: 0,
      tags: manualTag ? [manualTag] : ['General'],
      subtasks: [],
      recurrence: 'none',
      rolloverEnabled: true,
      subjectTag: manualTag || 'General',
    });

    setManualTitle('');
    setManualDesc('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterTag && !task.tags.includes(filterTag)) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const priorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'P1':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">P1 {isArabic ? 'عاجل' : 'Urgent'}</span>;
      case 'P2':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">P2 {isArabic ? 'هام' : 'High'}</span>;
      case 'P3':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">P3 {isArabic ? 'متوسط' : 'Med'}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-500/20 text-neutral-400 border border-neutral-500/30">P4 {isArabic ? 'عادي' : 'Low'}</span>;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 transition-colors ${
      isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header (Notion Style) */}
        <div className="mb-6">
          <div className="text-4xl sm:text-5xl mb-3">✅</div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {isArabic ? 'مركز المهام والمشاريع (Todoist & Things)' : 'Tasks & Project Hub (Todoist & Things 3)'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {isArabic
              ? 'نظام مهام فائق القوة يدمج إدارة الأولويات P1-P4، مصفوفة أيزنهاور، قوائم كانبان، والتفريغ السريع بالذكاء الاصطناعي.'
              : 'Advanced task management combining Todoist priorities, Eisenhower Matrix, Kanban boards, and smart NLP input.'}
          </p>
        </div>

        {/* Quick NLP Task Input Bar (Todoist Style) */}
        <div className={`p-4 rounded-2xl border mb-6 shadow-sm ${
          isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <form onSubmit={handleNlpSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl border bg-black/20 border-white/10">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder={
                  isArabic
                    ? 'أدخل مهمة ذكياً: "حل تمرين فيزياء غداً 45 دقيقة P1 #بكالوريا" ...'
                    : 'Smart quick add: "Review differential equations tomorrow 45m P1 #Physics"...'
                }
                className="w-full bg-transparent text-xs font-medium focus:outline-none placeholder-neutral-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة سريعة' : 'Quick Add'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                  isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-white'
                }`}
              >
                {isArabic ? 'تفاصيل...' : 'Detailed...'}
              </button>
            </div>
          </form>
        </div>

        {/* Notion View Switcher & Filters Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-6 border-neutral-800">
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{isArabic ? 'قائمة المهام' : 'List View'}</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'kanban'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isArabic ? 'لوحة كانبان (Kanban)' : 'Kanban Board'}</span>
            </button>

            <button
              onClick={() => setViewMode('eisenhower')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'eisenhower'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مصفوفة أيزنهاور' : 'Eisenhower'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500">{isArabic ? 'الأولوية:' : 'Priority:'}</span>
              {(['all', 'P1', 'P2', 'P3'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    filterPriority === p
                      ? 'bg-cyan-500 text-black'
                      : isDark
                      ? 'bg-neutral-800 text-neutral-400 hover:text-white'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {p === 'all' ? (isArabic ? 'الكل' : 'All') : p}
                </button>
              ))}
            </div>

            {/* Rollover Tasks Action */}
            <button
              onClick={() => rolloverUnfinishedTasks()}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition"
              title={isArabic ? 'ترحيل المهام غير المكتملة إلى اليوم' : 'Rollover unfinished tasks'}
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">{isArabic ? 'ترحيل إلى اليوم' : 'Rollover'}</span>
            </button>
          </div>
        </div>

        {/* 1. LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                {isArabic ? 'لا توجد مهام مطابقة للمحددات حالياً. أضف مهمة جديدة!' : 'No tasks match current filters. Add a new task above!'}
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition group ${
                      isDark
                        ? isCompleted
                          ? 'bg-[#1a1a1a]/60 border-[#2b2b2b] opacity-60'
                          : 'bg-[#212121] border-[#303030] hover:border-neutral-600'
                        : isCompleted
                        ? 'bg-neutral-100 border-neutral-200 opacity-60'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-neutral-500 hover:border-cyan-400'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${
                                isCompleted ? 'line-through text-neutral-500' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                            {priorityBadge(task.priority)}
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {task.description && (
                            <p className="text-xs text-neutral-400 mt-1">{task.description}</p>
                          )}

                          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-neutral-500">
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-neutral-400" />
                                <span>{task.dueDate}</span>
                              </span>
                            )}
                            {task.estimatedMinutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                <span>{task.estimatedMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
                              </span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-neutral-400" />
                                <span>
                                  {task.subtasks.filter((s) => s.completed).length} / {task.subtasks.length}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Delete */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtasks Section */}
                    {task.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/60 pl-8 rtl:pl-0 rtl:pr-8 space-y-1.5">
                        {task.subtasks.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between text-xs group/sub">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sub.completed}
                                onChange={() => toggleSubtask(task.id, sub.id)}
                                className="w-3.5 h-3.5 rounded border-neutral-600 accent-cyan-500"
                              />
                              <span className={sub.completed ? 'line-through text-neutral-500' : 'text-neutral-300'}>
                                {sub.title}
                              </span>
                            </label>
                            <button
                              onClick={() => deleteSubtask(task.id, sub.id)}
                              className="opacity-0 group-hover/sub:opacity-100 text-neutral-600 hover:text-rose-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. KANBAN BOARD VIEW */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: To Do */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e1e1e] border-[#303030]' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>{isArabic ? 'قيد الانتظار' : 'To Do'}</span>
                  <span className="text-neutral-500 text-[10px]">({todoTasks.length})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {todoTasks.map((t) => (
                  <div key={t.id} className={`p-3 rounded-xl border ${isDark ? 'bg-[#252525] border-[#383838]' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="text-xs font-bold mb-1.5">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      {priorityBadge(t.priority)}
                      <button
                        onClick={() => setTaskStatus(t.id, 'in_progress')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{isArabic ? 'بدء' : 'Start'}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e1e1e] border-[#303030]' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{isArabic ? 'قيد التنفيذ' : 'In Progress'}</span>
                  <span className="text-neutral-500 text-[10px]">({inProgressTasks.length})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {inProgressTasks.map((t) => (
                  <div key={t.id} className={`p-3 rounded-xl border ${isDark ? 'bg-[#252525] border-[#383838]' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="text-xs font-bold mb-1.5">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      {priorityBadge(t.priority)}
                      <button
                        onClick={() => setTaskStatus(t.id, 'completed')}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{isArabic ? 'إتمام' : 'Complete'}</span>
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e1e1e] border-[#303030]' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>{isArabic ? 'مكتملة' : 'Completed'}</span>
                  <span className="text-neutral-500 text-[10px]">({completedTasks.length})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {completedTasks.map((t) => (
                  <div key={t.id} className={`p-3 rounded-xl border opacity-75 ${isDark ? 'bg-[#252525] border-[#383838]' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="text-xs font-bold line-through text-neutral-400 mb-1.5">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      {priorityBadge(t.priority)}
                      <span className="text-emerald-400 font-bold">✓ {isArabic ? 'تم' : 'Done'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. EISENHOWER MATRIX */}
        {viewMode === 'eisenhower' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Q1: Urgent & Important (P1) */}
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/10">
              <div className="font-black text-xs text-rose-400 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Q1: {isArabic ? 'عاجل وهام (افعل فوراً)' : 'Do Immediately (Urgent & Important)'}</span>
              </div>
              <div className="space-y-2 mt-3">
                {filteredTasks.filter((t) => t.priority === 'P1').map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-xs font-bold flex justify-between items-center">
                    <span>{t.title}</span>
                    <button onClick={() => toggleTaskStatus(t.id)} className="text-cyan-400 text-[10px]">
                      {t.status === 'completed' ? '✓' : 'إتمام'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Q2: Not Urgent, Important (P2) */}
            <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/10">
              <div className="font-black text-xs text-cyan-400 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Q2: {isArabic ? 'هام وغير عاجل (جدول وخطط)' : 'Schedule & Plan (Important, Not Urgent)'}</span>
              </div>
              <div className="space-y-2 mt-3">
                {filteredTasks.filter((t) => t.priority === 'P2').map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-xs font-bold flex justify-between items-center">
                    <span>{t.title}</span>
                    <button onClick={() => toggleTaskStatus(t.id)} className="text-cyan-400 text-[10px]">
                      {t.status === 'completed' ? '✓' : 'إتمام'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3: Urgent, Not Important (P3) */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10">
              <div className="font-black text-xs text-amber-400 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Q3: {isArabic ? 'عاجل وغير هام (فوض أو اختصر)' : 'Delegate / Batch (Urgent, Not Important)'}</span>
              </div>
              <div className="space-y-2 mt-3">
                {filteredTasks.filter((t) => t.priority === 'P3').map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs font-bold flex justify-between items-center">
                    <span>{t.title}</span>
                    <button onClick={() => toggleTaskStatus(t.id)} className="text-cyan-400 text-[10px]">
                      {t.status === 'completed' ? '✓' : 'إتمام'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Q4: Neither (P4) */}
            <div className="p-4 rounded-2xl border border-neutral-700 bg-neutral-900/30">
              <div className="font-black text-xs text-neutral-400 mb-1 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Q4: {isArabic ? 'غير عاجل وغير هام (احذف وتخلص)' : 'Eliminate / Low Priority'}</span>
              </div>
              <div className="space-y-2 mt-3">
                {filteredTasks.filter((t) => t.priority === 'P4').map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-black/40 border border-neutral-700 text-xs font-bold flex justify-between items-center">
                    <span>{t.title}</span>
                    <button onClick={() => toggleTaskStatus(t.id)} className="text-cyan-400 text-[10px]">
                      {t.status === 'completed' ? '✓' : 'إتمام'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'}`}>
              <h2 className="text-lg font-black mb-4">{isArabic ? 'إضافة مهمة جديدة مفصلة' : 'Add Detailed Task'}</h2>
              <form onSubmit={handleManualAdd} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">{isArabic ? 'عنوان المهمة' : 'Title'}</label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/30 border-neutral-700 focus:outline-none focus:border-cyan-400"
                    placeholder={isArabic ? 'مثال: مراجعة الدالات اللوغاريتمية' : 'e.g. Review calculus problem set'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">{isArabic ? 'الوصف والملاحظات' : 'Description'}</label>
                  <textarea
                    rows={2}
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/30 border-neutral-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">{isArabic ? 'الأولوية' : 'Priority'}</label>
                    <select
                      value={manualPriority}
                      onChange={(e) => setManualPriority(e.target.value as TaskPriority)}
                      className="w-full px-2 py-2 text-xs rounded-xl border bg-black/30 border-neutral-700 focus:outline-none"
                    >
                      <option value="P1">P1 {isArabic ? 'عاجل' : 'Urgent'}</option>
                      <option value="P2">P2 {isArabic ? 'هام' : 'High'}</option>
                      <option value="P3">P3 {isArabic ? 'متوسط' : 'Med'}</option>
                      <option value="P4">P4 {isArabic ? 'عادي' : 'Low'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">{isArabic ? 'تاريخ الاستحقاق' : 'Due Date'}</label>
                    <input
                      type="date"
                      value={manualDueDate}
                      onChange={(e) => setManualDueDate(e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-xl border bg-black/30 border-neutral-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">{isArabic ? 'المدة (دقيقة)' : 'Minutes'}</label>
                    <input
                      type="number"
                      value={manualMinutes}
                      onChange={(e) => setManualMinutes(Number(e.target.value))}
                      className="w-full px-2 py-2 text-xs rounded-xl border bg-black/30 border-neutral-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                  >
                    {isArabic ? 'حفظ المهمة' : 'Save Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
