import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { useNotionStore } from '../../../stores/useNotionStore';

const PRESET_ICONS = ['🎓', '⚡', '🌿', '🔬', '💼', '🚀', '💡', '🎨', '📚', '🏆', '☕', '🌌'];
const PRESET_COLORS = [
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#f43f5e', name: 'Rose' },
];

export function NotionNewWorkspaceModal() {
  const {
    workspaceModalOpen,
    setWorkspaceModalOpen,
    addWorkspace,
    language,
    themeMode,
  } = useNotionStore();

  const isArabic = language === 'ar';
  const isDark = themeMode === 'dark';

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⚡');
  const [selectedColor, setSelectedColor] = useState('#06b6d4');
  const [plan, setPlan] = useState<'Personal' | 'Pro' | 'Education'>('Personal');

  if (!workspaceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (isArabic ? 'مساحة عمل جديدة' : 'New Workspace');
    const finalNameEn = nameEn.trim() || name.trim() || 'New Workspace';

    addWorkspace({
      name: finalName,
      nameEn: finalNameEn,
      icon: selectedIcon,
      color: selectedColor,
      description: isArabic ? 'مساحة عمل مخصصة للملاحظات والمهام' : 'Custom workspace for notes and tasks',
      descriptionEn: 'Custom workspace for notes and tasks',
      plan,
      planAr: plan === 'Education' ? 'تعليمي' : plan === 'Pro' ? 'احترافي' : 'شخصي',
      membersCount: 1,
    });

    setName('');
    setNameEn('');
    setWorkspaceModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
            isDark ? 'bg-[#202020] border-[#303030] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between border-neutral-700/30">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: selectedColor + '25', borderColor: selectedColor, borderWidth: 1 }}
              >
                {selectedIcon}
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  {isArabic ? 'إنشاء مساحة عمل جديدة' : 'Create New Workspace'}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isArabic ? 'خصص مساحتك للدراسة، المشاريع أو الحياة اليومية' : 'Customize your space for study, projects or daily life'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWorkspaceModalOpen(false)}
              className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Name Input (Arabic & English) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold block text-neutral-400">
                {isArabic ? 'اسم مساحة العمل (بالعربية)' : 'Workspace Name (Arabic)'}
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isArabic ? 'مثال: مساحة هندسة البرمجيات' : 'e.g. Software Engineering Hub'}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-hidden transition ${
                  isDark
                    ? 'bg-[#181818] border-[#333] text-white focus:border-cyan-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-cyan-600'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold block text-neutral-400">
                {isArabic ? 'اسم مساحة العمل (بالإنجليزية)' : 'Workspace Name (English)'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Software Engineering Hub"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-hidden transition ${
                  isDark
                    ? 'bg-[#181818] border-[#333] text-white focus:border-cyan-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-cyan-600'
                }`}
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold block text-neutral-400">
                {isArabic ? 'أيقونة مساحة العمل' : 'Workspace Icon'}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`h-9 rounded-xl flex items-center justify-center text-base border transition ${
                      selectedIcon === emoji
                        ? 'border-cyan-500 bg-cyan-500/20 scale-105'
                        : isDark
                        ? 'border-[#2d2d2d] bg-[#1a1a1a] hover:bg-[#252525]'
                        : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Accent Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold block text-neutral-400">
                {isArabic ? 'اللون المميز' : 'Accent Color'}
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white transition hover:scale-110 shadow"
                    title={color.name}
                  >
                    {selectedColor === color.hex && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Tier Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold block text-neutral-400">
                {isArabic ? 'نوع الخطة' : 'Plan Type'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['Personal', 'Education', 'Pro'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                      plan === p
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-400 font-bold'
                        : isDark
                        ? 'border-[#2d2d2d] bg-[#1a1a1a] text-neutral-400 hover:text-white'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {p === 'Personal'
                      ? isArabic
                        ? 'شخصي'
                        : 'Personal'
                      : p === 'Education'
                      ? isArabic
                        ? 'تعليمي'
                        : 'Education'
                      : isArabic
                      ? 'احترافي'
                      : 'Pro'}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-700/20">
              <button
                type="button"
                onClick={() => setWorkspaceModalOpen(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
                }`}
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إنشاء مساحة العمل' : 'Create Workspace'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
