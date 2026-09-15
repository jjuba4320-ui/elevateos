import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionSearchModal() {
  const {
    searchModalOpen,
    setSearchModalOpen,
    pages,
    setActivePageId,
    themeMode,
    language,
  } = useNotionStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  // Global Ctrl+K or Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      } else if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const isDark = themeMode === 'dark';
  const q = query.trim().toLowerCase();

  // Search through non-deleted pages: title and block content
  const activePages = pages.filter((p) => !p.isDeleted);
  const results = activePages.filter((page) => {
    if (!q) return true;
    if (page.title.toLowerCase().includes(q)) return true;
    const matchBlock = page.blocks.some((b) => b.content.toLowerCase().includes(q));
    return matchBlock;
  });

  const handleSelectPage = (pageId: string) => {
    setActivePageId(pageId);
    setSearchModalOpen(false);
  };

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#202020] border-[#333] text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث في العناوين والصفحات والمحتوى... (Ctrl+K)'
                : 'Search pages and content... (Ctrl+K)'
            }
            className={`w-full bg-transparent border-none text-sm font-medium focus:outline-none placeholder:text-neutral-500 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              {language === 'ar' ? 'لم يتم العثور على أي نتائج مطابقة' : 'No matching results found'}
            </div>
          ) : (
            results.map((page) => {
              // Find matching snippet if in block
              const matchingBlock = q ? page.blocks.find((b) => b.content.toLowerCase().includes(q)) : null;

              return (
                <button
                  key={page.id}
                  onClick={() => handleSelectPage(page.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition group ${
                    isDark ? 'hover:bg-[#282828]' : 'hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{page.icon || '📄'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">
                        {page.title || (language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled')}
                      </div>
                      {matchingBlock && (
                        <div className="text-xs text-neutral-400 truncate mt-0.5 font-mono">
                          "...{matchingBlock.content.substring(0, 60)}..."
                        </div>
                      )}
                    </div>
                  </div>

                  <Arrow className="w-4 h-4 text-neutral-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-neutral-950/40 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span>{language === 'ar' ? 'استخدم الأسهم للتنقل و Enter للاختيار' : 'Use arrows to navigate, Enter to select'}</span>
          <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px]">
            ESC
          </kbd>
        </div>
      </div>
    </div>
  );
}
