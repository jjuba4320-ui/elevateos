import React from 'react';
import { X, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionTrashModal() {
  const {
    trashModalOpen,
    setTrashModalOpen,
    pages,
    restorePage,
    permanentlyDeletePage,
    themeMode,
    language,
  } = useNotionStore();

  if (!trashModalOpen) return null;

  const isDark = themeMode === 'dark';
  const deletedPages = pages.filter((p) => p.isDeleted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#202020] border-[#333] text-white' : 'bg-white border-neutral-200 text-black'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
            <Trash2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'سلة المحذوفات' : 'Trash'}</span>
          </div>
          <button
            onClick={() => setTrashModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {deletedPages.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              {language === 'ar' ? 'سلة المحذوفات فارغة حالياً' : 'Trash is currently empty'}
            </div>
          ) : (
            deletedPages.map((page) => (
              <div
                key={page.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDark ? 'bg-[#262626] border-[#383838]' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{page.icon || '📄'}</span>
                  <span className="text-xs font-bold truncate">
                    {page.title || (language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled')}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => restorePage(page.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60 transition"
                    title={language === 'ar' ? 'استعادة' : 'Restore'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'استعادة' : 'Restore'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => permanentlyDeletePage(page.id)}
                    className="p-1.5 rounded-xl hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 transition"
                    title={language === 'ar' ? 'حذف نهائي' : 'Delete permanently'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
