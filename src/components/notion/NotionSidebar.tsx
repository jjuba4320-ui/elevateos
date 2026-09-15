import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  LayoutTemplate,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Star,
  MoreHorizontal,
  Moon,
  Sun,
  Globe,
  PanelLeftClose,
  FileText,
  Folder,
  Sparkles,
  CheckSquare,
  Calendar,
  Clock,
  Share2,
  Brain,
  Flame,
  Palette,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';

export function NotionSidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    setWorkspaceModalOpen,
    pages,
    activePageId,
    setActivePageId,
    activeView,
    setActiveView,
    setAiAssistantOpen,
    setQuickTaskModalOpen,
    createPage,
    deletePage,
    toggleFavorite,
    setSearchModalOpen,
    setTemplatesModalOpen,
    setTrashModalOpen,
    themeMode,
    toggleTheme,
    language,
    toggleLanguage,
  } = useNotionStore();

  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const [menuOpenPageId, setMenuOpenPageId] = useState<string | null>(null);
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const pageMenuRef = useRef<HTMLDivElement>(null);
  const wsDropdownRef = useRef<HTMLDivElement>(null);

  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const currentWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || {
      id: 'ws_default',
      name: 'مساحة العمل',
      nameEn: 'Workspace',
      icon: '⚡',
      color: '#06b6d4',
      plan: 'Pro',
      planAr: 'احترافي',
    };

  // Close context menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pageMenuRef.current && !pageMenuRef.current.contains(e.target as Node)) {
        setMenuOpenPageId(null);
      }
      if (wsDropdownRef.current && !wsDropdownRef.current.contains(e.target as Node)) {
        setWsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!sidebarOpen) return null;

  const activePages = pages.filter((p) => !p.isDeleted);
  const favoritePages = activePages.filter((p) => p.isFavorite);
  const regularPages = activePages;

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div
        onClick={toggleSidebar}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        aria-hidden="true"
      />
      <aside
        className={`fixed md:relative inset-y-0 start-0 w-72 h-screen shrink-0 border-e flex flex-col justify-between transition-colors z-50 md:z-40 select-none shadow-2xl md:shadow-none ${
          isDark
            ? 'bg-[#202020] border-[#2c2c2c] text-neutral-300'
            : 'bg-[#f7f7f5] border-neutral-200 text-neutral-800'
        }`}
      >
      {/* 1. Workspace Header & Quick Actions */}
      <div>
        {/* Workspace Brand Selector & Switcher Dropdown */}
        <div
          ref={wsDropdownRef}
          className={`relative p-2.5 flex items-center justify-between border-b ${
            isDark ? 'border-[#292929]' : 'border-neutral-200/60'
          }`}
        >
          <button
            type="button"
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            className={`flex-1 flex items-center justify-between gap-2 p-1.5 rounded-xl transition text-start ${
              isDark ? 'hover:bg-[#282828]' : 'hover:bg-neutral-200/60'
            }`}
            title={isArabic ? 'تبديل مساحة العمل' : 'Switch workspace'}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-xs shrink-0 font-bold"
                style={{
                  backgroundColor: (currentWorkspace.color || '#06b6d4') + '22',
                  borderWidth: 1,
                  borderColor: (currentWorkspace.color || '#06b6d4') + '60',
                }}
              >
                {currentWorkspace.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white truncate block">
                    {isArabic ? currentWorkspace.name : currentWorkspace.nameEn}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 truncate block">
                  {isArabic ? currentWorkspace.planAr : currentWorkspace.plan} • MadakOS
                </span>
              </div>
            </div>

            <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 ms-1 rounded-lg hover:bg-neutral-800/60 text-neutral-400 hover:text-white transition shrink-0"
            title={isArabic ? 'طي الشريط الجانبي' : 'Collapse sidebar'}
          >
            <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Notion Workspace Switcher Dropdown Menu */}
          <AnimatePresence>
            {wsDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className={`absolute top-14 start-2 end-2 z-50 rounded-2xl shadow-2xl border p-2 ${
                  isDark
                    ? 'bg-[#222222] border-[#363636] text-neutral-200 shadow-black/70'
                    : 'bg-white border-neutral-200 text-neutral-800 shadow-neutral-300/80'
                }`}
              >
                {/* Account info snippet */}
                <div className="px-2.5 py-1.5 border-b border-neutral-700/20 text-[11px] text-neutral-400 mb-1">
                  <div className="font-bold text-xs text-white">مَداك | MadakOS</div>
                  <div className="text-[10px] text-neutral-400 truncate">jjuba4320@gmail.com</div>
                </div>

                {/* Section title */}
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {isArabic ? 'مساحات العمل' : 'Workspaces'}
                </div>

                {/* List of Workspaces */}
                <div className="space-y-0.5 max-h-52 overflow-y-auto">
                  {workspaces.map((ws) => {
                    const isSelected = ws.id === activeWorkspaceId;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          setActiveWorkspaceId(ws.id);
                          setWsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                          isSelected
                            ? isDark
                              ? 'bg-[#2d2d2d] text-white font-bold'
                              : 'bg-neutral-100 text-neutral-900 font-bold'
                            : isDark
                            ? 'hover:bg-[#282828] text-neutral-300'
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{ws.icon}</span>
                          <div className="text-start min-w-0">
                            <div className="truncate font-semibold text-xs">
                              {isArabic ? ws.name : ws.nameEn}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {isArabic ? ws.planAr : ws.plan} • {ws.membersCount} {isArabic ? 'عضو' : 'member'}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Create New Workspace button */}
                <div className="pt-1.5 mt-1 border-t border-neutral-700/20">
                  <button
                    type="button"
                    onClick={() => {
                      setWsDropdownOpen(false);
                      setWorkspaceModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition ${
                      isDark
                        ? 'hover:bg-[#2a2a2a] text-cyan-400'
                        : 'hover:bg-neutral-100 text-cyan-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isArabic ? 'إنشاء مساحة عمل جديدة' : 'New Workspace'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Quick Action Links */}
        <div className="p-2 space-y-0.5 text-xs font-medium">
          {/* Quick Find (Ctrl+K) */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
              isDark ? 'hover:bg-[#282828] text-neutral-300' : 'hover:bg-neutral-200/70 text-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>{language === 'ar' ? 'بحث سريع' : 'Quick Find'}</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 font-mono text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* Templates Library */}
          <button
            type="button"
            onClick={() => setTemplatesModalOpen(true)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition ${
              isDark ? 'hover:bg-[#282828] text-neutral-300' : 'hover:bg-neutral-200/70 text-neutral-700'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'ar' ? 'قوالب نوشن الجاهزة' : 'Templates'}</span>
          </button>

          {/* Trash */}
          <button
            type="button"
            onClick={() => setTrashModalOpen(true)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition ${
              isDark ? 'hover:bg-[#282828] text-neutral-300' : 'hover:bg-neutral-200/70 text-neutral-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'ar' ? 'سلة المحذوفات' : 'Trash'}</span>
          </button>
        </div>

        {/* PRODUCTIVITY SUITE APPS (Notion Hub) */}
        <div className="px-2 mt-2">
          <div className="px-2 mb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'ar' ? 'أجنحة الإنتاجية العالمية' : 'Productivity Suite'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">ALL-IN-1</span>
          </div>

          <div className="space-y-0.5 text-xs font-medium">
            {/* Notion AI */}
            <button
              type="button"
              onClick={() => setAiAssistantOpen(true)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition group ${
                isDark ? 'hover:bg-[#282828] text-cyan-300' : 'hover:bg-cyan-50 text-cyan-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-bold">Notion AI Copilot</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                AI
              </span>
            </button>

            {/* Todoist / Tasks */}
            <button
              type="button"
              onClick={() => setActiveView('tasks')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'tasks'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ar' ? 'مركز المهام والمشاريع' : 'Tasks & Projects'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Todoist</span>
            </button>

            {/* Calendar */}
            <button
              type="button"
              onClick={() => setActiveView('calendar')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'calendar'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? 'التقويم والجدولة' : 'Calendar & Schedule'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Cron</span>
            </button>

            {/* Pomodoro Focus & Sounds */}
            <button
              type="button"
              onClick={() => setActiveView('focus')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'focus'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'ar' ? 'محطة التركيز والأصوات' : 'Focus & Ambient'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Forest</span>
            </button>

            {/* Obsidian Knowledge Graph */}
            <button
              type="button"
              onClick={() => setActiveView('graph')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'graph'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'شبكة الروابط المعرفية' : 'Knowledge Graph'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Obsidian</span>
            </button>

            {/* Anki Flashcards */}
            <button
              type="button"
              onClick={() => setActiveView('flashcards')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'flashcards'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'ar' ? 'بطاقات التكرار المتباعد' : 'Flashcards Deck'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Anki</span>
            </button>

            {/* Habits & Streaks */}
            <button
              type="button"
              onClick={() => setActiveView('habits')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'habits'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ar' ? 'متتبع العادات والـ Streaks' : 'Habits & Heatmap'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Habitica</span>
            </button>

            {/* Whiteboard Miro */}
            <button
              type="button"
              onClick={() => setActiveView('whiteboard')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                activeView === 'whiteboard'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : isDark
                  ? 'hover:bg-[#282828] text-neutral-300'
                  : 'hover:bg-neutral-200/70 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'ar' ? 'لوحة الأفكار والرسم الحر' : 'Visual Whiteboard'}</span>
              </div>
              <span className="text-[10px] text-neutral-500">Miro</span>
            </button>
          </div>
        </div>

        {/* 2. Hierarchical Pages Section */}
        <div className="px-2 mt-3 max-h-[calc(100vh-420px)] overflow-y-auto space-y-4 scrollbar-thin">
          {/* FAVORITES */}
          {favoritePages.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
              </div>
              <div className="space-y-0.5">
                {favoritePages.map((page) => (
                  <button
                    key={'fav_' + page.id}
                    type="button"
                    onClick={() => setActivePageId(page.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activePageId === page.id
                        ? isDark
                          ? 'bg-[#2b2b2b] text-white'
                          : 'bg-neutral-200 text-black'
                        : isDark
                        ? 'text-neutral-400 hover:text-white hover:bg-[#262626]'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
                    }`}
                  >
                    <span className="text-sm shrink-0">{page.icon || '📄'}</span>
                    <span className="truncate">
                      {page.title || (language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ALL PAGES */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'ar' ? 'صفحات مساحة العمل' : 'Workspace Pages'}
              </span>
              <button
                type="button"
                onClick={() => createPage()}
                className="p-0.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                title={language === 'ar' ? 'إضافة صفحة جديدة' : 'Add page'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {regularPages.map((page) => {
                const isActive = activePageId === page.id;
                const isHovered = hoveredPageId === page.id;

                return (
                  <div
                    key={page.id}
                    onMouseEnter={() => setHoveredPageId(page.id)}
                    onMouseLeave={() => setHoveredPageId(null)}
                    className="relative"
                  >
                    <div
                      onClick={() => setActivePageId(page.id)}
                      className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition ${
                        isActive
                          ? isDark
                            ? 'bg-[#2b2b2b] text-white font-bold'
                            : 'bg-neutral-200 text-black font-bold'
                          : isDark
                          ? 'text-neutral-400 hover:text-white hover:bg-[#262626]'
                          : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">{page.icon || '📄'}</span>
                        <span className="truncate">
                          {page.title || (language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled')}
                        </span>
                      </div>

                      {/* Hover Actions: Quick Subpage '+' and Options '...' */}
                      {(isHovered || menuOpenPageId === page.id) && (
                        <div
                          className="flex items-center gap-0.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => createPage(page.id)}
                            className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                            title={language === 'ar' ? 'إضافة صفحة فرعية' : 'Add sub-page'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setMenuOpenPageId(menuOpenPageId === page.id ? null : page.id)
                            }
                            className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                            title={language === 'ar' ? 'المزيد' : 'More'}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Page Context Menu */}
                    {menuOpenPageId === page.id && (
                      <div
                        ref={pageMenuRef}
                        className={`absolute top-full right-2 rtl:right-auto rtl:left-2 z-50 w-48 rounded-xl border p-1 shadow-2xl animate-in fade-in duration-100 ${
                          isDark ? 'bg-[#252525] border-[#383838] text-neutral-200' : 'bg-white border-neutral-200 text-black'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            toggleFavorite(page.id);
                            setMenuOpenPageId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-neutral-800 transition"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {page.isFavorite
                              ? language === 'ar' ? 'إزالة من المفضلة' : 'Remove favorite'
                              : language === 'ar' ? 'إضافة إلى المفضلة' : 'Add to favorite'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            deletePage(page.id);
                            setMenuOpenPageId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'حذف الصفحة' : 'Delete page'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Utility Bar: New Page, Theme & Language */}
      <div
        className={`p-3 border-t space-y-2 ${
          isDark ? 'border-[#292929] bg-[#1a1a1a]' : 'border-neutral-200 bg-[#f0f0ed]'
        }`}
      >
        {/* + Add New Page Button */}
        <button
          type="button"
          onClick={() => createPage()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'صفحة جديدة' : 'New page'}</span>
        </button>

        {/* Toggles: Dark/Light Mode + Language Switcher */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-neutral-400">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition ${
              isDark
                ? 'border-[#333] hover:bg-[#252525] text-neutral-300'
                : 'border-neutral-300 hover:bg-white text-neutral-700'
            }`}
            title={language === 'ar' ? 'تبديل المظهر' : 'Toggle theme'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            <span className="text-[11px] font-semibold">
              {isDark ? (language === 'ar' ? 'نهاري' : 'Light') : (language === 'ar' ? 'ليلي' : 'Dark')}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition ${
              isDark
                ? 'border-[#333] hover:bg-[#252525] text-neutral-300'
                : 'border-neutral-300 hover:bg-white text-neutral-700'
            }`}
            title={language === 'ar' ? 'تبديل اللغة' : 'Toggle language'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold">
              {language === 'ar' ? 'English' : 'عربي'}
            </span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
