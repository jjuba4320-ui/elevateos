import React, { useState } from 'react';
import { X, Image, Link, Check } from 'lucide-react';
import { NOTION_COVER_PRESETS } from '../../data/notionTemplates';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionCoverPickerModal() {
  const { coverPickerOpen, setCoverPickerOpen, activePageId, updatePage, themeMode, language } =
    useNotionStore();
  const [customUrl, setCustomUrl] = useState('');

  if (!coverPickerOpen) return null;

  const isDark = themeMode === 'dark';

  const selectCover = (url: string) => {
    if (activePageId) {
      updatePage(activePageId, { coverUrl: url });
      setCoverPickerOpen(false);
    }
  };

  const removeCover = () => {
    if (activePageId) {
      updatePage(activePageId, { coverUrl: undefined });
      setCoverPickerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#202020] border-[#333] text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800/60">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Image className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'اختر غلاف الصفحة' : 'Select page cover'}</span>
          </div>
          <button
            onClick={() => setCoverPickerOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Preset gallery */}
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 block">
              {language === 'ar' ? 'معرض الصور والتدرجات المميزة' : 'Featured Gradients & Covers'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {NOTION_COVER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => selectCover(preset.url)}
                  className="group relative h-20 rounded-xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-cyan-500 transition"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-end p-2">
                    <span className="text-[11px] font-medium text-white truncate drop-shadow">
                      {preset.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 block mb-2">
              {language === 'ar' ? 'أو أدخل رابط صورة مخصص (URL)' : 'Or paste an image URL'}
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-[#181818] border-[#383838] text-white focus:border-cyan-500'
                    : 'bg-neutral-50 border-neutral-300 text-black focus:border-cyan-600'
                }`}
              />
              <button
                type="button"
                onClick={() => customUrl && selectCover(customUrl)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
              >
                {language === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={removeCover}
            className="px-4 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition font-medium"
          >
            {language === 'ar' ? 'إزالة الغلاف الحالي' : 'Remove current cover'}
          </button>
        </div>
      </div>
    </div>
  );
}
