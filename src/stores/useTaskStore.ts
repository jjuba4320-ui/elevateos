import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, YearlyGoal, RecurrencePattern } from '../types';
import { soundscapeEngine } from '../services/audioService';
import { useGamificationStore } from './useGamificationStore';

const SAMPLE_TASKS_AR: Task[] = [
  {
    id: 'tsk_1',
    title: 'حل موضوع فيزياء بكالوريا 2023 (الاهتزازات والنووي)',
    description: 'التركيز على تحليل منحنى السؤال الثالث وخطوات انحفاظ الطاقة الميكانيكية',
    priority: 'P1',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 60,
    actualMinutes: 0,
    tags: ['فيزياء_بكالوريا', 'امتحانات_سابقة'],
    subtasks: [
      { id: 'sub_1', title: 'مراجعة المعادلة التفاضلية لدارة RC والحل النموذجي', completed: true },
      { id: 'sub_2', title: 'حل الجزء الأول بدون النظر إلى عناصر الإجابة', completed: false },
      { id: 'sub_3', title: 'تدوين هفوة الخطوة الرابعة في كراس الأخطاء الذكي', completed: false },
    ],
    recurrence: 'none',
    rolloverEnabled: true,
    subjectTag: 'الفيزياء',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_2',
    title: 'حفظ ومراجعة أقوال الفلسفة: الرياضيات والعلوم التجريبية',
    description: 'تلخيص 4 حجج أساسية للمقالة المقارنة والتركيب الفلسفي',
    priority: 'P2',
    status: 'in_progress',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 35,
    actualMinutes: 15,
    tags: ['فلسفة', 'تحضير_بكالوريا'],
    subtasks: [
      { id: 'sub_4', title: 'كتابة المقدمة وضبط الإشكالية بدقة', completed: true },
      { id: 'sub_5', title: 'صياغة الموقف الأول مع أمثلة واقعية', completed: false },
    ],
    recurrence: 'daily',
    rolloverEnabled: true,
    subjectTag: 'الفلسفة',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_3',
    title: 'تمارين إطالة واسترخاء بعد 4 جلسات تركيز بومودورو',
    description: 'تخفيف إجهاد الرقبة والظهر لاستعادة كامل النشاط الذهني',
    priority: 'P3',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 20,
    actualMinutes: 20,
    tags: ['صحة', 'استرخاء'],
    subtasks: [],
    recurrence: 'daily',
    rolloverEnabled: false,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_4',
    title: 'رياضيات: حل تمارين الأعداد المركبة والتحويلات النقطية',
    description: 'التدريب على الشكل الأسي واستخراج زوايا الدوران والتشابه',
    priority: 'P1',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 90,
    actualMinutes: 0,
    tags: ['رياضيات_بكالوريا', 'أولوية_قصوى'],
    subtasks: [
      { id: 'sub_6', title: 'إثبات دساتير أويلر والتحويلات المثلثية', completed: true },
      { id: 'sub_7', title: 'حل 5 مسائل شاملة من دورات البكالوريا السابقة', completed: false },
    ],
    recurrence: 'weekly',
    rolloverEnabled: true,
    subjectTag: 'الرياضيات',
    createdAt: new Date().toISOString(),
  },
];

const SAMPLE_TASKS_EN: Task[] = [
  {
    id: 'tsk_1',
    title: 'Solve 2023 BAC Physics Session (Oscillations & Nuclear)',
    description: 'Focus on question 3 graph analysis and energy conservation steps',
    priority: 'P1',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 60,
    actualMinutes: 0,
    tags: ['BAC_Physics', 'ExamPractice'],
    subtasks: [
      { id: 'sub_1', title: 'Review differential equation of RC circuit', completed: true },
      { id: 'sub_2', title: 'Solve part A without looking at solution', completed: false },
      { id: 'sub_3', title: 'Annotate mistake logbook with step 4 correction', completed: false },
    ],
    recurrence: 'none',
    rolloverEnabled: true,
    subjectTag: 'Physics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_2',
    title: 'Memorize Philosophy Quotations: Science vs Philosophy',
    description: 'Summarize 4 arguments for dialectical synthesis',
    priority: 'P2',
    status: 'in_progress',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 35,
    actualMinutes: 15,
    tags: ['Philosophy', 'BAC_Prep'],
    subtasks: [
      { id: 'sub_4', title: 'Write intro hook', completed: true },
      { id: 'sub_5', title: 'Contrast Bacon vs Descartes arguments', completed: false },
    ],
    recurrence: 'daily',
    rolloverEnabled: true,
    subjectTag: 'Philosophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_3',
    title: 'Post-Study Mobility & Core Stretch',
    description: 'Alleviate neck tension and lower back strain after 4 focus blocks',
    priority: 'P3',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 20,
    actualMinutes: 20,
    tags: ['Fitness', 'Wellness'],
    subtasks: [],
    recurrence: 'daily',
    rolloverEnabled: false,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_4',
    title: 'Math: Complex Numbers Exam Series Unit 3',
    description: 'Practice transformation matrix and exponential form',
    priority: 'P1',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 90,
    actualMinutes: 0,
    tags: ['BAC_Math', 'HighPriority'],
    subtasks: [
      { id: 'sub_6', title: 'Euler formula derivations', completed: true },
      { id: 'sub_7', title: 'Solve 5 past BAC exercises', completed: false },
    ],
    recurrence: 'weekly',
    rolloverEnabled: true,
    subjectTag: 'Mathematics',
    createdAt: new Date().toISOString(),
  },
];

const SAMPLE_YEARLY_GOALS_AR: YearlyGoal[] = [
  {
    id: 'yg_1',
    year: 2026,
    title: 'النجاح في البكالوريا بتقدير ممتاز (معدل >= 17.5 / 20)',
    category: 'Academics',
    targetDate: '2026-06-15',
    progress: 68,
    milestones: [
      { id: 'ms_1', yearlyGoalId: 'yg_1', title: 'إتقان 100% من برنامجي الرياضيات والفيزياء للفصل الأول', targetMonth: 'ديسمبر', completed: true, progressPercent: 100 },
      { id: 'ms_2', yearlyGoalId: 'yg_1', title: 'حل 30 موضوع بكالوريا رسمي شامل مع التوقيت', targetMonth: 'أفريل', completed: false, progressPercent: 65 },
      { id: 'ms_3', yearlyGoalId: 'yg_1', title: 'صفر أخطاء حسابية أو تحويلية في الامتحانات التجريبية', targetMonth: 'ماي', completed: false, progressPercent: 40 },
    ],
  },
  {
    id: 'yg_2',
    year: 2026,
    title: 'بناء لياقة بدنية عالية وجري 5 كم في أقل من 22 دقيقة',
    category: 'Fitness',
    targetDate: '2026-08-30',
    progress: 52,
    milestones: [
      { id: 'ms_4', yearlyGoalId: 'yg_2', title: 'الجري 3 مرات أسبوعياً بانتظام', targetMonth: 'مارس', completed: true, progressPercent: 100 },
      { id: 'ms_5', yearlyGoalId: 'yg_2', title: 'تحقيق وتيرة 4:30 د/كم في سباق 3 كم', targetMonth: 'مايو', completed: false, progressPercent: 45 },
    ],
  },
];

const SAMPLE_YEARLY_GOALS_EN: YearlyGoal[] = [
  {
    id: 'yg_1',
    year: 2026,
    title: 'Pass Baccalaureate with Highest Distinction (Mention Très Bien >= 17/20)',
    category: 'Academics',
    targetDate: '2026-06-15',
    progress: 68,
    milestones: [
      { id: 'ms_1', yearlyGoalId: 'yg_1', title: 'Master 100% of Term 1 Math & Physics Curricula', targetMonth: 'December', completed: true, progressPercent: 100 },
      { id: 'ms_2', yearlyGoalId: 'yg_1', title: 'Complete 30 Full Past BAC Exam Papers', targetMonth: 'April', completed: false, progressPercent: 65 },
      { id: 'ms_3', yearlyGoalId: 'yg_1', title: 'Zero Formula Blunders in Mock Exams', targetMonth: 'May', completed: false, progressPercent: 40 },
    ],
  },
  {
    id: 'yg_2',
    year: 2026,
    title: 'Build Peak Stamina & 5km Run in under 22 Minutes',
    category: 'Fitness',
    targetDate: '2026-08-30',
    progress: 52,
    milestones: [
      { id: 'ms_4', yearlyGoalId: 'yg_2', title: 'Consistent 3x Weekly Interval Sprints', targetMonth: 'March', completed: true, progressPercent: 100 },
      { id: 'ms_5', yearlyGoalId: 'yg_2', title: 'Pacing Check: 4:25 min/km for 3km Run', targetMonth: 'May', completed: false, progressPercent: 45 },
    ],
  },
];

const isEnglish = typeof localStorage !== 'undefined' && localStorage.getItem('notion_lang') === 'en';
const DEFAULT_TASKS = isEnglish ? SAMPLE_TASKS_EN : SAMPLE_TASKS_AR;
const DEFAULT_GOALS = isEnglish ? SAMPLE_YEARLY_GOALS_EN : SAMPLE_YEARLY_GOALS_AR;

interface TaskStore {
  tasks: Task[];
  yearlyGoals: YearlyGoal[];
  filterTag: string | null;
  filterPriority: TaskPriority | 'all';
  searchQuery: string;
  autoRolloverActive: boolean;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleAutoRollover: () => void;
  rolloverUnfinishedTasks: () => void;
  setFilterTag: (tag: string | null) => void;
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  setSearchQuery: (query: string) => void;
}

const savedTasks = typeof localStorage !== 'undefined' ? localStorage.getItem('elevate_tasks') : null;
const initialTasks = savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS;

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  yearlyGoals: DEFAULT_GOALS,
  filterTag: null,
  filterPriority: 'all',
  searchQuery: '',
  autoRolloverActive: true,

  addTask: (taskData) => {
    set((state) => {
      const newTask: Task = {
        ...taskData,
        id: 'tsk_' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      const next = [newTask, ...state.tasks];
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  updateTask: (id, updates) => {
    set((state) => {
      const next = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const next = state.tasks.filter((t) => t.id !== id);
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  toggleTaskStatus: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const isCompleting = task.status !== 'completed';
    const nextStatus: TaskStatus = isCompleting ? 'completed' : 'todo';

    if (isCompleting) {
      soundscapeEngine.playTaskCompleteSound();
      useGamificationStore.getState().recordTaskCompleted();
    }

    set((state) => {
      const next = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: nextStatus,
              completedAt: isCompleting ? new Date().toISOString() : undefined,
            }
          : t
      );
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  setTaskStatus: (id, status) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const isCompleting = status === 'completed' && task.status !== 'completed';
    if (isCompleting) {
      soundscapeEngine.playTaskCompleteSound();
      useGamificationStore.getState().recordTaskCompleted();
    }

    set((state) => {
      const next = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            }
          : t
      );
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => {
      const next = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubs = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubs };
      });
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  addSubtask: (taskId, title) => {
    set((state) => {
      const next = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newSub = {
          id: 'sub_' + Date.now(),
          title: title.trim(),
          completed: false,
        };
        return { ...t, subtasks: [...t.subtasks, newSub] };
      });
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  deleteSubtask: (taskId, subtaskId) => {
    set((state) => {
      const next = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
      });
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  toggleAutoRollover: () => {
    set((state) => ({ autoRolloverActive: !state.autoRolloverActive }));
  },

  rolloverUnfinishedTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => {
      const next = state.tasks.map((t) => {
        if (t.status !== 'completed' && t.rolloverEnabled && t.dueDate && t.dueDate < today) {
          return { ...t, dueDate: today };
        }
        return t;
      });
      localStorage.setItem('elevate_tasks', JSON.stringify(next));
      return { tasks: next };
    });
  },

  setFilterTag: (tag) => set({ filterTag: tag }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
