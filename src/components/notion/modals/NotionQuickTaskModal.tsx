import React, { useState } from 'react';
import { X, Check, Calendar, Flag, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useNotionStore } from '../../../stores/useNotionStore';
import { TaskPriority } from '../../../types';

export function NotionQuickTaskModal() {
  const { quickTaskModalOpen, setQuickTaskModalOpen, themeMode, language } = useNotionStore();
  const { addTask } = useTaskStore();

  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('P2');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tag, setTag] = useState('General');

  if (!quickTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: '',
      priority,
      status: 'todo',
      dueDate,
      estimatedMinutes: 25,
      actualMinutes: 0,
      tags: [tag],
      subtasks: [],
      recurrence: 'none',
      rolloverEnabled: true,
      subjectTag: tag,
    });

    setTitle('');
    setQuickTaskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 ${
          isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
              +
            </div>
            <h3 className="text-sm font-black">
              {isArabic ? 'التقاط مهمة سريع (Quick Capture)' : 'Quick Task Capture'}
            </h3>
          </div>
          <button
            onClick={() => setQuickTaskModalOpen(false)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <input
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isArabic
                  ? 'ما الذي تريد إنجازه؟ (مثال: تلخيص وحدة المناعة)...'
                  : 'What needs to be done?...'
              }
              className="w-full px-3.5 py-2.5 rounded-2xl border bg-black/30 border-neutral-700 font-medium focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'الأولوية' : 'Priority'}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-2 py-1.5 rounded-xl border bg-black/30 border-neutral-700"
              >
                <option value="P1">P1 {isArabic ? 'عاجل' : 'Urgent'}</option>
                <option value="P2">P2 {isArabic ? 'هام' : 'High'}</option>
                <option value="P3">P3 {isArabic ? 'متوسط' : 'Med'}</option>
                <option value="P4">P4 {isArabic ? 'عادي' : 'Low'}</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'التاريخ' : 'Date'}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border bg-black/30 border-neutral-700"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'الوسم' : 'Tag'}</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border bg-black/30 border-neutral-700"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuickTaskModalOpen(false)}
              className="px-4 py-2 text-neutral-400 hover:text-white"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-md"
            >
              {isArabic ? 'إضافة المهمة' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
