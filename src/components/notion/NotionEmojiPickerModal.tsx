import React, { useState } from 'react';
import { X, Smile } from 'lucide-react';
import { POPULAR_NOTION_EMOJIS } from '../../data/notionTemplates';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionEmojiPickerModal() {
  const { emojiPickerOpen, setEmojiPickerOpen, activePageId, updatePage, themeMode, language } =
    useNotionStore();
  const [search, setSearch] = useState('');

  if (!emojiPickerOpen) return null;

  const isDark = themeMode === 'dark';

  const selectEmoji = (emoji: string) => {
    if (activePageId) {
      updatePage(activePageId, { icon: emoji });
      setEmojiPickerOpen(false);
    }
  };

  const removeEmoji = () => {
    if (activePageId) {
      updatePage(activePageId, { icon: '📄' });
      setEmojiPickerOpen(false);
    }
  };

  const filteredEmojis = POPULAR_NOTION_EMOJIS.filter((e) => e.includes(search));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#202020] border-[#333] text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800/60">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Smile className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'اختر رمز الصفحة' : 'Select page icon'}</span>
          </div>
          <button
            onClick={() => setEmojiPickerOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'تصفية الرموز التعبيرية...' : 'Filter emojis...'}
            className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none mb-3 ${
              isDark ? 'bg-[#181818] border-[#383838] text-white' : 'bg-neutral-50 border-neutral-300 text-black'
            }`}
          />

          <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto p-1">
            {filteredEmojis.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectEmoji(emoji)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-neutral-800 transition hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={removeEmoji}
            className="px-3 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition"
          >
            {language === 'ar' ? 'استعادة الرمز الافتراضي' : 'Reset default'}
          </button>
        </div>
      </div>
    </div>
  );
}
