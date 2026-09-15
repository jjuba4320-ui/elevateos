import React, { useState } from 'react';
import { X, LayoutTemplate, Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { NOTION_TEMPLATES } from '../../data/notionTemplates';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionTemplatesModal() {
  const {
    templatesModalOpen,
    setTemplatesModalOpen,
    createPage,
    themeMode,
    language,
  } = useNotionStore();

  const [selectedTemplateId, setSelectedTemplateId] = useState(NOTION_TEMPLATES[0].id);

  if (!templatesModalOpen) return null;

  const isDark = themeMode === 'dark';
  const selectedTemplate =
    NOTION_TEMPLATES.find((t) => t.id === selectedTemplateId) || NOTION_TEMPLATES[0];

  const handleUseTemplate = () => {
    createPage(null, selectedTemplate.id);
    setTemplatesModalOpen(false);
  };

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] ${
          isDark ? 'bg-[#1e1e1e] border-[#333] text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        {/* Left / Sidebar: Templates List */}
        <div
          className={`w-full md:w-72 p-4 border-b md:border-b-0 md:border-r border-neutral-800 shrink-0 flex flex-col justify-between ${
            isDark ? 'bg-[#181818]' : 'bg-neutral-50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm">
                <LayoutTemplate className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? 'قوالب نوشن الجاهزة' : 'Notion Templates'}</span>
              </div>
              <button
                onClick={() => setTemplatesModalOpen(false)}
                className="md:hidden p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
              {NOTION_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition ${
                      isSelected
                        ? isDark
                          ? 'bg-[#2b2b2b] text-white border border-neutral-700 shadow-sm'
                          : 'bg-white text-black border border-neutral-200 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl shrink-0">{tmpl.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-snug truncate">
                        {language === 'ar' ? tmpl.titleAr : tmpl.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {language === 'ar' ? tmpl.categoryAr : tmpl.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Template Preview & Action */}
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            <div className="hidden md:flex justify-end mb-2">
              <button
                onClick={() => setTemplatesModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Cover banner */}
            <div className="h-32 rounded-2xl overflow-hidden relative border border-neutral-800 mb-4 shadow">
              <img
                src={selectedTemplate.coverUrl}
                alt={selectedTemplate.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-3 left-4 rtl:left-auto rtl:right-4 w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-2xl shadow-lg">
                {selectedTemplate.icon}
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-black">
                {language === 'ar' ? selectedTemplate.titleAr : selectedTemplate.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {language === 'ar' ? selectedTemplate.descriptionAr : selectedTemplate.description}
              </p>

              <div className="mt-4 p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 text-xs space-y-2">
                <div className="font-bold text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'ما يحتويه هذا القالب:' : 'Included in this template:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[11px]">
                  <li>{language === 'ar' ? 'هيكل كتل كامل مع أيقونة وغلاف منسق' : 'Full block structure with styled cover & icon'}</li>
                  <li>{language === 'ar' ? 'قواعد بيانات وجداول بيانات تفاعلية' : 'Interactive databases, tables, and views'}</li>
                  <li>{language === 'ar' ? 'جاهز للتخصيص والإضافة فوراً' : 'Ready to customize and add your personal notes'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setTemplatesModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleUseTemplate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs text-black bg-cyan-400 hover:bg-cyan-300 transition shadow-lg"
            >
              <span>{language === 'ar' ? 'استخدم هذا القالب' : 'Use this template'}</span>
              <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
