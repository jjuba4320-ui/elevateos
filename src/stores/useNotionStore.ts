import { create } from 'zustand';
import { NotionPage, NotionBlock, NotionDatabase, BlockType, NotionWorkspaceItem } from '../types/notion';
import { NOTION_TEMPLATES } from '../data/notionTemplates';

export type ProductivityView =
  | 'page'
  | 'tasks'
  | 'calendar'
  | 'focus'
  | 'graph'
  | 'flashcards'
  | 'habits'
  | 'whiteboard';

export const DEFAULT_WORKSPACES: NotionWorkspaceItem[] = [
  {
    id: 'ws_study',
    name: 'مساحة البكالوريا والتفوق الدراسي',
    nameEn: 'Academic & BAC Excellence',
    icon: '🎓',
    color: '#06b6d4',
    description: 'جداول المراجعة، ملخصات المواد، وبطاقات الاستذكار',
    descriptionEn: 'Revision schedules, subject summaries, and flashcards',
    plan: 'Education',
    planAr: 'تعليمي',
    membersCount: 1,
  },
  {
    id: 'ws_personal',
    name: 'مساحة المشاريع والإنتاجية',
    nameEn: 'Personal & Productivity Lab',
    icon: '⚡',
    color: '#3b82f6',
    description: 'إدارة المهام، الأهداف السنوية، والمشاريع الشخصية',
    descriptionEn: 'Task management, yearly goals, and side projects',
    plan: 'Pro',
    planAr: 'احترافي',
    membersCount: 3,
  },
  {
    id: 'ws_wellness',
    name: 'مساحة العادات والحياة المتوازنة',
    nameEn: 'Life & Wellness Hub',
    icon: '🌿',
    color: '#10b981',
    description: 'متتبع العادات اليومية، التمارين، وساعات النوم الهادئ',
    descriptionEn: 'Daily habit tracking, fitness, and calm sleep logs',
    plan: 'Personal',
    planAr: 'شخصي',
    membersCount: 1,
  },
  {
    id: 'ws_research',
    name: 'مختبر الأبحاث والملاحظات',
    nameEn: 'Research & Knowledge Lab',
    icon: '🔬',
    color: '#a855f7',
    description: 'شبكة الملاحظات المترابطة، القراءات، والخرائط الذهنية',
    descriptionEn: 'Obsidian graph notes, reading summaries, and mind maps',
    plan: 'Team',
    planAr: 'فريق',
    membersCount: 4,
  },
];

interface NotionStoreState {
  workspaces: NotionWorkspaceItem[];
  activeWorkspaceId: string;
  workspaceModalOpen: boolean;
  pages: NotionPage[];
  databases: Record<string, NotionDatabase>;
  activePageId: string;
  activeView: ProductivityView;
  sidebarOpen: boolean;
  searchModalOpen: boolean;
  templatesModalOpen: boolean;
  trashModalOpen: boolean;
  coverPickerOpen: boolean;
  emojiPickerOpen: boolean;
  aiAssistantOpen: boolean;
  quickTaskModalOpen: boolean;
  themeMode: 'dark' | 'light';
  language: 'ar' | 'en';

  // Navigation & UI
  setActiveWorkspaceId: (id: string) => void;
  addWorkspace: (ws: Omit<NotionWorkspaceItem, 'id'>) => string;
  updateWorkspace: (id: string, updates: Partial<NotionWorkspaceItem>) => void;
  setWorkspaceModalOpen: (open: boolean) => void;
  setActiveView: (view: ProductivityView) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setQuickTaskModalOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setTrashModalOpen: (open: boolean) => void;
  setCoverPickerOpen: (open: boolean) => void;
  setEmojiPickerOpen: (open: boolean) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;

  // Pages CRUD
  setActivePageId: (id: string) => void;
  createPage: (parentId?: string | null, templateId?: string) => string;
  updatePage: (id: string, updates: Partial<NotionPage>) => void;
  deletePage: (id: string) => void;
  restorePage: (id: string) => void;
  permanentlyDeletePage: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Blocks CRUD
  addBlock: (pageId: string, type: BlockType, afterBlockId?: string) => string;
  updateBlock: (pageId: string, blockId: string, updates: Partial<NotionBlock>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlock: (pageId: string, fromIndex: number, toIndex: number) => void;

  // Database CRUD
  getDatabase: (id: string) => NotionDatabase | undefined;
  updateDatabase: (id: string, updates: Partial<NotionDatabase>) => void;
  addRow: (dbId: string, values?: Record<string, any>) => void;
  updateRow: (dbId: string, rowId: string, values: Record<string, any>) => void;
  deleteRow: (dbId: string, rowId: string) => void;
}

// Initial Seed Data if empty
const buildInitialSeed = () => {
  const initialDatabases: Record<string, NotionDatabase> = {};
  const initialPages: NotionPage[] = [];

  NOTION_TEMPLATES.forEach((tmpl, idx) => {
    const { page, database } = tmpl.createPage();
    const pageId = 'page_' + tmpl.id;
    if (database) {
      initialDatabases[database.id] = database;
    }
    initialPages.push({
      ...page,
      id: pageId,
      createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    });
  });

  return { initialPages, initialDatabases };
};

const loadSavedPages = (): { pages: NotionPage[]; databases: Record<string, NotionDatabase> } => {
  try {
    const savedP = localStorage.getItem('notion_pages_v1');
    const savedD = localStorage.getItem('notion_databases_v1');
    if (savedP) {
      const parsedPages: NotionPage[] = JSON.parse(savedP);
      const parsedDbs = savedD ? JSON.parse(savedD) : {};
      if (parsedPages.length > 0) {
        return { pages: parsedPages, databases: parsedDbs };
      }
    }
  } catch {
    // fallback to seed
  }
  const seed = buildInitialSeed();
  return { pages: seed.initialPages, databases: seed.initialDatabases };
};

const { pages: seedPages, databases: seedDatabases } = loadSavedPages();

const loadSavedWorkspaces = (): { workspaces: NotionWorkspaceItem[]; activeWorkspaceId: string } => {
  try {
    const saved = localStorage.getItem('notion_workspaces_v1');
    const active = localStorage.getItem('notion_active_ws_v1');
    if (saved) {
      const parsed: NotionWorkspaceItem[] = JSON.parse(saved);
      if (parsed.length > 0) {
        return {
          workspaces: parsed,
          activeWorkspaceId: active && parsed.some((w) => w.id === active) ? active : parsed[0].id,
        };
      }
    }
  } catch {
    // fallback
  }
  return { workspaces: DEFAULT_WORKSPACES, activeWorkspaceId: DEFAULT_WORKSPACES[0].id };
};

const { workspaces: seedWorkspaces, activeWorkspaceId: initialWorkspaceId } = loadSavedWorkspaces();

const initialTheme = (localStorage.getItem('notion_theme') as 'dark' | 'light') || 'dark';
const initialLang = (localStorage.getItem('notion_lang') as 'ar' | 'en') || 'ar';

if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLang;
}

export const useNotionStore = create<NotionStoreState>((set, get) => ({
  workspaces: seedWorkspaces,
  activeWorkspaceId: initialWorkspaceId,
  workspaceModalOpen: false,
  pages: seedPages,
  databases: seedDatabases,
  activePageId: seedPages[0]?.id || '',
  activeView: 'page',
  sidebarOpen: true,
  searchModalOpen: false,
  templatesModalOpen: false,
  trashModalOpen: false,
  coverPickerOpen: false,
  emojiPickerOpen: false,
  aiAssistantOpen: false,
  quickTaskModalOpen: false,
  themeMode: initialTheme,
  language: initialLang,

  setActiveWorkspaceId: (id) => {
    set((s) => {
      localStorage.setItem('notion_active_ws_v1', id);
      const wsPages = s.pages.filter((p) => !p.isDeleted && (p.workspaceId === id || !p.workspaceId));
      const fallbackId = wsPages[0]?.id || s.pages.find((p) => !p.isDeleted)?.id || s.activePageId;
      return { activeWorkspaceId: id, activePageId: fallbackId };
    });
  },

  addWorkspace: (ws) => {
    const newId = 'ws_' + Date.now();
    const newWs: NotionWorkspaceItem = { ...ws, id: newId };
    set((s) => {
      const next = [...s.workspaces, newWs];
      localStorage.setItem('notion_workspaces_v1', JSON.stringify(next));
      localStorage.setItem('notion_active_ws_v1', newId);
      return { workspaces: next, activeWorkspaceId: newId, workspaceModalOpen: false };
    });
    return newId;
  },

  updateWorkspace: (id, updates) => {
    set((s) => {
      const next = s.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w));
      localStorage.setItem('notion_workspaces_v1', JSON.stringify(next));
      return { workspaces: next };
    });
  },

  setWorkspaceModalOpen: (open) => set({ workspaceModalOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
  setAiAssistantOpen: (open) => set({ aiAssistantOpen: open }),
  setQuickTaskModalOpen: (open) => set({ quickTaskModalOpen: open }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setTemplatesModalOpen: (open) => set({ templatesModalOpen: open }),
  setTrashModalOpen: (open) => set({ trashModalOpen: open }),
  setCoverPickerOpen: (open) => set({ coverPickerOpen: open }),
  setEmojiPickerOpen: (open) => set({ emojiPickerOpen: open }),

  toggleTheme: () => {
    set((s) => {
      const next = s.themeMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('notion_theme', next);
      return { themeMode: next };
    });
  },

  toggleLanguage: () => {
    set((s) => {
      const nextLang: 'ar' | 'en' = s.language === 'ar' ? 'en' : 'ar';
      localStorage.setItem('notion_lang', nextLang);
      if (typeof document !== 'undefined') {
        document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextLang;
      }
      return { language: nextLang };
    });
  },

  setActivePageId: (id) => set({ activePageId: id, activeView: 'page' }),

  createPage: (parentId = null, templateId) => {
    let newPage: NotionPage;
    let newDb: NotionDatabase | undefined;

    if (templateId) {
      const tmpl = NOTION_TEMPLATES.find((t) => t.id === templateId);
      if (tmpl) {
        const res = tmpl.createPage();
        const id = 'page_' + Date.now();
        if (res.database) {
          newDb = res.database;
        }
        newPage = {
          ...res.page,
          id,
          parentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        };
      } else {
        const id = 'page_' + Date.now();
        newPage = {
          id,
          title: get().language === 'ar' ? 'صفحة بدون عنوان' : 'Untitled',
          icon: '📝',
          parentId,
          isFavorite: false,
          blocks: [
            {
              id: 'b_' + Date.now(),
              type: 'text',
              content: '',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        };
      }
    } else {
      const id = 'page_' + Date.now();
      newPage = {
        id,
        title: get().language === 'ar' ? 'صفحة جديدة' : 'Untitled',
        icon: '📝',
        parentId,
        isFavorite: false,
        blocks: [
          {
            id: 'b_' + Date.now(),
            type: 'text',
            content: '',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      };
    }

    set((state) => {
      const updatedPages = [newPage, ...state.pages];
      const updatedDatabases = newDb
        ? { ...state.databases, [newDb.id]: newDb }
        : state.databases;

      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      localStorage.setItem('notion_databases_v1', JSON.stringify(updatedDatabases));

      return {
        pages: updatedPages,
        databases: updatedDatabases,
        activePageId: newPage.id,
      };
    });

    return newPage.id;
  },

  updatePage: (id, updates) => {
    set((state) => {
      const updatedPages = state.pages.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  deletePage: (id) => {
    set((state) => {
      const updatedPages = state.pages.map((p) =>
        p.id === id ? { ...p, isDeleted: true, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));

      // If active page was deleted, switch to next available active page
      let nextActive = state.activePageId;
      if (state.activePageId === id) {
        const remaining = updatedPages.filter((p) => !p.isDeleted);
        nextActive = remaining[0]?.id || '';
      }

      return { pages: updatedPages, activePageId: nextActive };
    });
  },

  restorePage: (id) => {
    set((state) => {
      const updatedPages = state.pages.map((p) =>
        p.id === id ? { ...p, isDeleted: false, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages, activePageId: id };
    });
  },

  permanentlyDeletePage: (id) => {
    set((state) => {
      const updatedPages = state.pages.filter((p) => p.id !== id);
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  toggleFavorite: (id) => {
    set((state) => {
      const updatedPages = state.pages.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      );
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  // Blocks Actions
  addBlock: (pageId, type, afterBlockId) => {
    const newBlockId = 'b_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    let extraProps: Partial<NotionBlock> = {};

    if (type === 'callout') {
      extraProps = { icon: '💡', color: 'blue' };
    } else if (type === 'code') {
      extraProps = { language: 'javascript' };
    } else if (type === 'toggle') {
      extraProps = { collapsed: false, children: [] };
    } else if (type === 'todo') {
      extraProps = { checked: false };
    } else if (type === 'database') {
      // Create a default inline table database
      const newDbId = 'db_' + Date.now();
      const newDb: NotionDatabase = {
        id: newDbId,
        title: get().language === 'ar' ? 'جدول بيانات' : 'Database Table',
        viewType: 'table',
        properties: [
          { id: 'p_name', name: get().language === 'ar' ? 'الاسم' : 'Name', type: 'text' },
          { id: 'p_status', name: get().language === 'ar' ? 'الحالة' : 'Status', type: 'status', options: [
            { id: 'opt_1', name: get().language === 'ar' ? 'لم يبدأ' : 'Not started', color: 'gray' },
            { id: 'opt_2', name: get().language === 'ar' ? 'قيد التنفيذ' : 'In progress', color: 'blue' },
            { id: 'opt_3', name: get().language === 'ar' ? 'مكتمل' : 'Done', color: 'green' },
          ]},
          { id: 'p_date', name: get().language === 'ar' ? 'التاريخ' : 'Date', type: 'date' },
        ],
        rows: [
          { id: 'r_1', values: { p_name: get().language === 'ar' ? 'عنصر جديد' : 'New item', p_status: get().language === 'ar' ? 'قيد التنفيذ' : 'In progress', p_date: new Date().toISOString().split('T')[0] } },
        ],
      };
      extraProps = { databaseId: newDbId };

      set((s) => {
        const nextDbs = { ...s.databases, [newDbId]: newDb };
        localStorage.setItem('notion_databases_v1', JSON.stringify(nextDbs));
        return { databases: nextDbs };
      });
    }

    const newBlock: NotionBlock = {
      id: newBlockId,
      type,
      content: '',
      ...extraProps,
    };

    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.id !== pageId) return p;
        let newBlocks = [...p.blocks];
        if (afterBlockId) {
          const index = newBlocks.findIndex((b) => b.id === afterBlockId);
          if (index !== -1) {
            newBlocks.splice(index + 1, 0, newBlock);
          } else {
            newBlocks.push(newBlock);
          }
        } else {
          newBlocks.push(newBlock);
        }
        return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
      });

      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });

    return newBlockId;
  },

  updateBlock: (pageId, blockId, updates) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.id !== pageId) return p;
        const newBlocks = p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b));
        return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
      });
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  deleteBlock: (pageId, blockId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.id !== pageId) return p;
        // Never allow 0 blocks on a page, keep at least one empty text block
        let newBlocks = p.blocks.filter((b) => b.id !== blockId);
        if (newBlocks.length === 0) {
          newBlocks = [{ id: 'b_' + Date.now(), type: 'text', content: '' }];
        }
        return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
      });
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  moveBlock: (pageId, fromIndex, toIndex) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.id !== pageId) return p;
        const newBlocks = [...p.blocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, moved);
        return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
      });
      localStorage.setItem('notion_pages_v1', JSON.stringify(updatedPages));
      return { pages: updatedPages };
    });
  },

  // Database Actions
  getDatabase: (id) => get().databases[id],

  updateDatabase: (id, updates) => {
    set((state) => {
      const current = state.databases[id];
      if (!current) return state;
      const next = { ...current, ...updates };
      const nextDbs = { ...state.databases, [id]: next };
      localStorage.setItem('notion_databases_v1', JSON.stringify(nextDbs));
      return { databases: nextDbs };
    });
  },

  addRow: (dbId, values = {}) => {
    set((state) => {
      const db = state.databases[dbId];
      if (!db) return state;
      const newRow = {
        id: 'r_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        values,
      };
      const nextDb = { ...db, rows: [...db.rows, newRow] };
      const nextDbs = { ...state.databases, [dbId]: nextDb };
      localStorage.setItem('notion_databases_v1', JSON.stringify(nextDbs));
      return { databases: nextDbs };
    });
  },

  updateRow: (dbId, rowId, values) => {
    set((state) => {
      const db = state.databases[dbId];
      if (!db) return state;
      const nextRows = db.rows.map((r) =>
        r.id === rowId ? { ...r, values: { ...r.values, ...values } } : r
      );
      const nextDb = { ...db, rows: nextRows };
      const nextDbs = { ...state.databases, [dbId]: nextDb };
      localStorage.setItem('notion_databases_v1', JSON.stringify(nextDbs));
      return { databases: nextDbs };
    });
  },

  deleteRow: (dbId, rowId) => {
    set((state) => {
      const db = state.databases[dbId];
      if (!db) return state;
      const nextRows = db.rows.filter((r) => r.id !== rowId);
      const nextDb = { ...db, rows: nextRows };
      const nextDbs = { ...state.databases, [dbId]: nextDb };
      localStorage.setItem('notion_databases_v1', JSON.stringify(nextDbs));
      return { databases: nextDbs };
    });
  },
}));
