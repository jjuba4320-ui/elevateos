import React, { useRef } from 'react';
import { Image, Smile, Plus, Sparkles } from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';
import { NotionBlockItem } from './NotionBlockItem';

export function NotionPageCanvas() {
  const {
    activePageId,
    pages,
    updatePage,
    addBlock,
    setCoverPickerOpen,
    setEmojiPickerOpen,
    setTemplatesModalOpen,
    themeMode,
    language,
  } = useNotionStore();

  const titleInputRef = useRef<HTMLInputElement>(null);

  const activePage = pages.find((p) => p.id === activePageId && !p.isDeleted);
  const isDark = themeMode === 'dark';

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-neutral-800 flex items-center justify-center text-3xl mb-4 shadow-lg">
          📝
        </div>
        <h2 className="text-lg font-bold text-neutral-300">
          {language === 'ar' ? 'لم يتم تحديد أي صفحة' : 'No page selected'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          {language === 'ar'
            ? 'اختر صفحة من الشريط الجانبي أو أنشئ صفحة جديدة أو اختر قالباً جاهزاً.'
            : 'Select a page from the sidebar or choose a ready-made template.'}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTemplatesModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition"
          >
            {language === 'ar' ? 'استعراض القوالب' : 'Browse templates'}
          </button>
        </div>
      </div>
    );
  }

  const maxWidthClass = activePage.isFullWidth ? 'max-w-6xl' : 'max-w-3xl';
  const textSizeClass = activePage.isSmallText ? 'text-sm' : 'text-base';

  return (
    <main
      className={`flex-1 overflow-y-auto min-h-screen transition-colors ${
        isDark ? 'bg-[#191919] text-neutral-200' : 'bg-white text-neutral-900'
      }`}
    >
      {/* 1. Page Cover Banner */}
      {activePage.coverUrl && (
        <div className="group relative w-full h-48 sm:h-64 overflow-hidden">
          <img
            src={activePage.coverUrl}
            alt="Page Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Cover Edit Controls (Hover) */}
          {!activePage.isLocked && (
            <div className="absolute bottom-3 right-4 rtl:right-auto rtl:left-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setCoverPickerOpen(true)}
                className="px-2.5 py-1 rounded-lg text-white hover:bg-white/20 transition font-medium"
              >
                {language === 'ar' ? 'تغيير الغلاف' : 'Change cover'}
              </button>
              <button
                type="button"
                onClick={() => updatePage(activePage.id, { coverUrl: undefined })}
                className="px-2.5 py-1 rounded-lg text-rose-300 hover:bg-rose-950/50 transition font-medium"
              >
                {language === 'ar' ? 'إزالة' : 'Remove'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Page Body Container */}
      <div className={`mx-auto px-6 sm:px-12 py-8 sm:py-12 ${maxWidthClass} ${textSizeClass}`}>
        {/* Top hover options (if no cover/icon) */}
        {!activePage.isLocked && (
          <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500">
            {!activePage.coverUrl && (
              <button
                type="button"
                onClick={() => setCoverPickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-neutral-800/40 hover:text-neutral-300 transition"
              >
                <Image className="w-3.5 h-3.5 text-neutral-400" />
                <span>{language === 'ar' ? 'إضافة غلاف' : 'Add cover'}</span>
              </button>
            )}

            {!activePage.icon && (
              <button
                type="button"
                onClick={() => setEmojiPickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-neutral-800/40 hover:text-neutral-300 transition"
              >
                <Smile className="w-3.5 h-3.5 text-neutral-400" />
                <span>{language === 'ar' ? 'إضافة أيقونة' : 'Add icon'}</span>
              </button>
            )}
          </div>
        )}

        {/* 3. Page Icon (Emoji) */}
        {activePage.icon && (
          <div className="group relative inline-block mb-3">
            <button
              type="button"
              disabled={activePage.isLocked}
              onClick={() => setEmojiPickerOpen(true)}
              className="text-5xl sm:text-6xl hover:scale-105 transition-transform cursor-pointer p-1 -m-1 rounded-2xl"
              title={language === 'ar' ? 'تغيير الرمز' : 'Change icon'}
            >
              {activePage.icon}
            </button>
          </div>
        )}

        {/* 4. Page Title */}
        <div className="mb-6">
          <input
            ref={titleInputRef}
            type="text"
            disabled={activePage.isLocked}
            value={activePage.title}
            onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addBlock(activePage.id, 'text');
              }
            }}
            placeholder={language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled'}
            className={`w-full font-black text-3xl sm:text-4xl sm:leading-tight bg-transparent border-none focus:outline-none tracking-tight ${
              isDark ? 'text-white placeholder-neutral-700' : 'text-neutral-900 placeholder-neutral-300'
            }`}
          />
        </div>

        {/* 5. Stream of Notion Blocks */}
        <div className="space-y-1 min-h-[300px]">
          {activePage.blocks.map((block, idx) => (
            <NotionBlockItem
              key={block.id}
              pageId={activePage.id}
              block={block}
              blockIndex={idx}
              isLocked={activePage.isLocked}
            />
          ))}
        </div>

        {/* 6. Click area at bottom to add block */}
        {!activePage.isLocked && (
          <div
            onClick={() => addBlock(activePage.id, 'text')}
            className="h-32 mt-4 cursor-text opacity-40 hover:opacity-100 flex items-start pt-2 text-xs text-neutral-500 transition"
          >
            {activePage.blocks.length === 0 && (
              <span>
                {language === 'ar'
                  ? 'اضغط هنا للبدء بالكتابة، أو اكتب "/" لإظهار قائمة الكتل والأوامر...'
                  : 'Click to start writing, or type "/" for commands...'}
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
