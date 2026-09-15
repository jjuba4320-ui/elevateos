import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotionWorkspaceRail } from './NotionWorkspaceRail';
import { NotionSidebar } from './NotionSidebar';
import { NotionTopNav } from './NotionTopNav';
import { NotionPageCanvas } from './NotionPageCanvas';
import { NotionSearchModal } from './NotionSearchModal';
import { NotionTemplatesModal } from './NotionTemplatesModal';
import { NotionCoverPickerModal } from './NotionCoverPickerModal';
import { NotionEmojiPickerModal } from './NotionEmojiPickerModal';
import { NotionTrashModal } from './NotionTrashModal';
import { NotionAIAssistantModal } from './modals/NotionAIAssistantModal';
import { NotionQuickTaskModal } from './modals/NotionQuickTaskModal';
import { NotionNewWorkspaceModal } from './modals/NotionNewWorkspaceModal';

import { NotionTaskHub } from './views/NotionTaskHub';
import { NotionCalendarView } from './views/NotionCalendarView';
import { NotionFocusStudio } from './views/NotionFocusStudio';
import { NotionKnowledgeGraph } from './views/NotionKnowledgeGraph';
import { NotionFlashcardsView } from './views/NotionFlashcardsView';
import { NotionHabitsView } from './views/NotionHabitsView';
import { NotionWhiteboardView } from './views/NotionWhiteboardView';

import { useNotionStore } from '../../stores/useNotionStore';

export function NotionWorkspace() {
  const { themeMode, language, activeView } = useNotionStore();
  const isDark = themeMode === 'dark';

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen w-full flex overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-[#ffffff] text-[#37352f]'
      }`}
    >
      {/* 1. Notion Workspaces Rail (Simple Notion-style sidebar to navigate between workspaces) */}
      <NotionWorkspaceRail />

      {/* 2. Notion Collapsible Page/Docs Sidebar */}
      <NotionSidebar />

      {/* 3. Main Workspace Area (Top Nav + Active Hub/Canvas) with smooth language transition */}
      <motion.div
        key={language}
        initial={{ opacity: 0.88, filter: 'blur(1px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden"
      >
        <NotionTopNav />

        {/* Dynamic View Router */}
        {activeView === 'page' && <NotionPageCanvas />}
        {activeView === 'tasks' && <NotionTaskHub />}
        {activeView === 'calendar' && <NotionCalendarView />}
        {activeView === 'focus' && <NotionFocusStudio />}
        {activeView === 'graph' && <NotionKnowledgeGraph />}
        {activeView === 'flashcards' && <NotionFlashcardsView />}
        {activeView === 'habits' && <NotionHabitsView />}
        {activeView === 'whiteboard' && <NotionWhiteboardView />}
      </motion.div>

      {/* Global Notion Modals */}
      <NotionSearchModal />
      <NotionTemplatesModal />
      <NotionCoverPickerModal />
      <NotionEmojiPickerModal />
      <NotionTrashModal />
      <NotionAIAssistantModal />
      <NotionQuickTaskModal />
      <NotionNewWorkspaceModal />
    </div>
  );
}


