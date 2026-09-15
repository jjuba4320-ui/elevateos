import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Star,
  Share2,
  MoreHorizontal,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  Trash2,
  Download,
  Check,
  Globe,
  Sliders,
  Sparkles,
  Plus,
  Play,
  Pause,
} from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';
import { useFocusStore } from '../../stores/useFocusStore';
import { MadakLogo } from '../common/MadakLogo';

export function NotionTopNav() {
  const {
    sidebarOpen,
    toggleSidebar,
    activePageId,
    activeView,
    setActiveView,
    setAiAssistantOpen,
    setQuickTaskModalOpen,
    workspaces,
    activeWorkspaceId,
    pages,
    updatePage,
    deletePage,
    toggleFavorite,
    themeMode,
    language,
    toggleLanguage,
  } = useNotionStore();

  const {
    timeLeftSeconds,
    isRunning,
    startTimer,
    pauseTimer,
  } = useFocusStore();

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activePage = pages.find((p) => p.id === activePageId);
  const isDark = themeMode === 'dark';

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreMenu]);

  if (!activePage) return null;

  const copyPageShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const exportAsMarkdown = () => {
    let md = `# ${activePage.title}\n\n`;
    activePage.blocks.forEach((b) => {
      if (b.type === 'heading1') md += `# ${b.content}\n\n`;
      else if (b.type === 'heading2') md += `## ${b.content}\n\n`;
      else if (b.type === 'heading3') md += `### ${b.content}\n\n`;
      else if (b.type === 'todo') md += `- [${b.checked ? 'x' : ' '}] ${b.content}\n`;
      else if (b.type === 'bullet') md += `- ${b.content}\n`;
      else if (b.type === 'number') md += `1. ${b.content}\n`;
      else if (b.type === 'quote') md += `> ${b.content}\n\n`;
      else if (b.type === 'code') md += `\`\`\`${b.language || ''}\n${b.content}\n\`\`\`\n\n`;
      else if (b.type === 'divider') md += `---\n\n`;
      else if (b.type === 'callout') md += `> 💡 ${b.content}\n\n`;
      else md += `${b.content}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePage.title.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
  };

  // Word count & Char count
  const totalWords = activePage.blocks.reduce((acc, b) => {
    return acc + (b.content ? b.content.trim().split(/\s+/).length : 0);
  }, 0);

  return (
    <header
      className={`sticky top-0 z-30 h-14 flex items-center justify-between px-3 sm:px-5 border-b backdrop-blur-md transition-colors ${
        isDark
          ? 'bg-[#191919]/95 border-[#2b2b2b] text-neutral-300'
          : 'bg-white/95 border-neutral-200 text-neutral-800'
      }`}
    >
      {/* Start: Sidebar Toggle (Menu), Madak Brand & Breadcrumbs */}
      <div className="flex items-center min-w-0 flex-1 me-2 sm:me-4">
        {/* Expanded 3-lines Menu Button with large touch target and dedicated margin */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 me-3 sm:me-4 shrink-0 flex items-center justify-center rounded-xl transition cursor-pointer border shadow-xs ${
            sidebarOpen
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25 ring-2 ring-cyan-500/20'
              : 'bg-neutral-800/70 border-white/10 text-neutral-100 hover:text-white hover:bg-neutral-800 active:scale-95'
          }`}
          title={
            sidebarOpen
              ? (language === 'ar' ? 'طي القائمة الجانبية' : 'Collapse sidebar')
              : (language === 'ar' ? 'فتح القائمة الجانبية' : 'Open sidebar')
          }
          aria-label={language === 'ar' ? 'القائمة الجانبية' : 'Sidebar Menu'}
        >
          <Menu className="w-5 h-5 stroke-[2.3]" />
        </button>

        {/* Official Madak Brand in Header */}
        <div
          onClick={() => setActiveView('page')}
          className="flex items-center shrink-0 cursor-pointer hover:opacity-90 transition me-2 sm:me-3"
          title="مَداك | MadakOS"
        >
          <MadakLogo size={32} showText={true} />
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-neutral-700/40 shrink-0 hidden md:block me-2 sm:me-3" />

        {/* Breadcrumb path - gracefully hidden on small mobile to prevent any pressure on header */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium truncate min-w-0">
          {(() => {
            const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
            return (
              <button
                type="button"
                onClick={() => setActiveView('page')}
                className="hover:text-white transition cursor-pointer flex items-center gap-1 truncate max-w-[110px] sm:max-w-[140px]"
              >
                <span className="shrink-0">{activeWs?.icon || '⚡'}</span>
                <span className="truncate">{language === 'ar' ? activeWs?.name : activeWs?.nameEn}</span>
              </button>
            );
          })()}
          <span className="text-neutral-600 shrink-0">/</span>
          {activeView === 'page' ? (
            <div className="flex items-center gap-1 text-white font-semibold truncate max-w-[130px] sm:max-w-[180px]">
              <span className="shrink-0">{activePage.icon || '📄'}</span>
              <span className="truncate">
                {activePage.title || (language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-cyan-400 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
              <span className="truncate">
                {activeView === 'tasks'
                  ? '✅ ' + (language === 'ar' ? 'المهام' : 'Tasks')
                  : activeView === 'calendar'
                  ? '📅 ' + (language === 'ar' ? 'التقويم' : 'Calendar')
                  : activeView === 'focus'
                  ? '⏳ ' + (language === 'ar' ? 'محطة التركيز' : 'Focus Studio')
                  : activeView === 'graph'
                  ? '🕸️ ' + (language === 'ar' ? 'شبكة المعرفة' : 'Graph')
                  : activeView === 'flashcards'
                  ? '🎴 ' + (language === 'ar' ? 'بطاقات' : 'Decks')
                  : activeView === 'habits'
                  ? '📊 ' + (language === 'ar' ? 'العادات' : 'Habits')
                  : '🎨 ' + (language === 'ar' ? 'لوحة الرسم' : 'Canvas')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* End: Actions (Live Focus Pill, Ask AI, Quick Task, Language, More) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative ms-auto">
        {/* Live Focus Timer Pill - Visually separated standalone capsule */}
        <div className="flex items-center bg-black/40 border border-cyan-500/35 rounded-xl p-1 text-xs shadow-xs shrink-0 me-1">
          <button
            onClick={() => setActiveView('focus')}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-300 hover:text-white transition cursor-pointer"
            title={language === 'ar' ? 'فتح محطة التركيز' : 'Open Focus Studio'}
          >
            <span>⏳</span>
            <span className="tracking-wide">{formatTimer(timeLeftSeconds)}</span>
          </button>
          <button
            onClick={() => (isRunning ? pauseTimer() : startTimer())}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            }`}
            title={isRunning ? (language === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (language === 'ar' ? 'تشغيل' : 'Start')}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>

        {/* Quick Add Task Button */}
        <button
          type="button"
          onClick={() => setQuickTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-sm cursor-pointer shrink-0"
          title={language === 'ar' ? 'التقاط مهمة سريعة' : 'Quick task capture'}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">{language === 'ar' ? 'مهمة' : 'Task'}</span>
        </button>

        {/* Ask AI Button */}
        <button
          type="button"
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer shrink-0"
          title="Madak AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline">Madak AI</span>
        </button>

        {activePage.isLocked && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[11px] font-bold shrink-0"
            title={language === 'ar' ? 'هذه الصفحة مقفلة ضد التعديل' : 'Page locked'}
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'ar' ? 'مقفلة' : 'Locked'}</span>
          </span>
        )}

        {/* Prominent Language Switcher Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition border shadow-sm shrink-0 ${
            language === 'ar'
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
          }`}
          title={language === 'ar' ? 'التحويل إلى اللغة الإنجليزية (Switch to English)' : 'Switch interface to Arabic (التحويل إلى العربية)'}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-extrabold">{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Share Button (hidden on narrow screens to prevent crowding, accessible in more menu) */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition border shrink-0 ${
            isDark
              ? 'border-[#333] hover:bg-[#252525] text-neutral-300 hover:text-white'
              : 'border-neutral-200 hover:bg-neutral-100 text-neutral-800'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{language === 'ar' ? 'مشاركة' : 'Share'}</span>
        </button>

        {/* Star / Favorite Toggle */}
        <button
          type="button"
          onClick={() => toggleFavorite(activePage.id)}
          className={`hidden sm:flex p-1.5 rounded-lg transition shrink-0 ${
            activePage.isFavorite
              ? 'text-amber-400 hover:bg-amber-950/30'
              : 'text-neutral-500 hover:text-white hover:bg-neutral-800/50'
          }`}
          title={language === 'ar' ? 'إضافة إلى المفضلة' : 'Favorite page'}
        >
          <Star className={`w-4 h-4 ${activePage.isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* More Options (...) */}
        <button
          type="button"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent hover:border-white/10 transition shrink-0"
          title={language === 'ar' ? 'المزيد من الخيارات' : 'More options'}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* More Options Dropdown */}
        {showMoreMenu && (
          <div
            ref={menuRef}
            className={`absolute top-full right-0 rtl:right-auto rtl:left-0 mt-1 z-50 w-64 rounded-2xl border p-1.5 shadow-2xl animate-in fade-in duration-100 ${
              isDark ? 'bg-[#222] border-[#363636] text-neutral-200' : 'bg-white border-neutral-200 text-black'
            }`}
          >
            {/* Full width toggle */}
            <button
              type="button"
              onClick={() => updatePage(activePage.id, { isFullWidth: !activePage.isFullWidth })}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-neutral-800/60 transition"
            >
              <div className="flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>{language === 'ar' ? 'عرض الصفحة بالكامل' : 'Full width'}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">
                {activePage.isFullWidth
                  ? language === 'ar' ? 'مفعل' : 'ON'
                  : language === 'ar' ? 'معطل' : 'OFF'}
              </span>
            </button>

            {/* Small text toggle */}
            <button
              type="button"
              onClick={() => updatePage(activePage.id, { isSmallText: !activePage.isSmallText })}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-neutral-800/60 transition"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                <span>{language === 'ar' ? 'تصغير حجم الخط' : 'Small text'}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">
                {activePage.isSmallText
                  ? language === 'ar' ? 'مفعل' : 'ON'
                  : language === 'ar' ? 'معطل' : 'OFF'}
              </span>
            </button>

            {/* Lock Page toggle */}
            <button
              type="button"
              onClick={() => updatePage(activePage.id, { isLocked: !activePage.isLocked })}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-neutral-800/60 transition"
            >
              <div className="flex items-center gap-2">
                {activePage.isLocked ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>{language === 'ar' ? 'قفل الصفحة ضد التعديل' : 'Lock page'}</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">
                {activePage.isLocked
                  ? language === 'ar' ? 'مقفلة' : 'Locked'
                  : language === 'ar' ? 'مفتوحة' : 'Unlocked'}
              </span>
            </button>

            <div className={`my-1 border-t ${isDark ? 'border-[#333]' : 'border-neutral-100'}`} />

            {/* Export as Markdown */}
            <button
              type="button"
              onClick={exportAsMarkdown}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-neutral-800/60 transition"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>{language === 'ar' ? 'تصدير كمستند Markdown (.md)' : 'Export as Markdown'}</span>
            </button>

            {/* Delete page */}
            <button
              type="button"
              onClick={() => {
                deletePage(activePage.id);
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نقل إلى سلة المحذوفات' : 'Move to trash'}</span>
            </button>

            {/* Page statistics */}
            <div className="mt-2 pt-2 border-t border-neutral-800 px-3 py-1 text-[10px] text-neutral-500 flex justify-between">
              <span>{language === 'ar' ? 'عدد الكلمات:' : 'Words:'} {totalWords}</span>
              <span>{language === 'ar' ? 'الكتل:' : 'Blocks:'} {activePage.blocks.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl p-5 ${
              isDark ? 'bg-[#202020] border-[#383838] text-white' : 'bg-white border-neutral-200 text-black'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? 'مشاركة ونشر الصفحة' : 'Share to Web'}</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              {language === 'ar'
                ? 'يمكنك نسخ رابط الصفحة لمشاركته أو معاينته مباشرة في أي وقت.'
                : 'Anyone with this link can view this page in read-only mode.'}
            </p>

            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value={window.location.href}
                className={`flex-1 px-3 py-2 text-xs rounded-xl border ${
                  isDark ? 'bg-[#181818] border-[#333] text-neutral-400' : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                }`}
              />
              <button
                type="button"
                onClick={copyPageShareLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'نسخ الرابط' : 'Copy link'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
