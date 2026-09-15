import { NotionTemplate, NotionPage, NotionDatabase } from '../types/notion';

export const NOTION_COVER_PRESETS = [
  { id: 'grad_1', name: 'Cosmic Cyan', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80' },
  { id: 'grad_2', name: 'Minimal Sand', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80' },
  { id: 'grad_3', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&q=80' },
  { id: 'grad_4', name: 'Nordic Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80' },
  { id: 'grad_5', name: 'Sunset Glow', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&q=80' },
  { id: 'grad_6', name: 'Japanese Architecture', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=80' },
];

export const POPULAR_NOTION_EMOJIS = [
  '📝', '🎓', '🎯', '🚀', '💡', '📚', '⚡', '🌟', '💼', '🔥',
  '☕', '🏆', '🧠', '🌿', '🎨', '📅', '💻', '🧪', '✨', '🪐',
  '📐', '📖', '🏃‍♂️', '🍎', '🛠️', '🧭', '🔖', '📊', '🔑', '💎'
];

export const NOTION_TEMPLATES: NotionTemplate[] = [
  {
    id: 'tmpl_bac_hub',
    title: 'BAC Study Hub & Exam Prep',
    titleAr: 'مركز دراسة وتفوق البكالوريا',
    description: 'Complete revision workspace with subject tracker, mistakes logbook, and weekly agenda.',
    descriptionAr: 'مساحة عمل متكاملة لمراجعة البكالوريا مع جدول المواد، كراس الأخطاء، وقائمة المهام الأسبوعية.',
    icon: '🎓',
    category: 'Study',
    categoryAr: 'دراسة وتفوق',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80',
    createPage: () => {
      const dbId = 'db_bac_subjects_' + Date.now();
      const database: NotionDatabase = {
        id: dbId,
        title: 'جدول المواد والمعاملات الرسمية',
        viewType: 'table',
        properties: [
          { id: 'col_subject', name: 'المادة (Subject)', type: 'text' },
          { id: 'col_coeff', name: 'المعامل', type: 'number' },
          { id: 'col_target', name: 'الهدف المتوقع', type: 'text' },
          {
            id: 'col_status',
            name: 'حالة التقدم',
            type: 'status',
            options: [
              { id: 'st_done', name: 'مكتمل 80%+', color: 'green' },
              { id: 'st_prog', name: 'قيد المراجعة', color: 'blue' },
              { id: 'st_start', name: 'في البداية', color: 'yellow' },
            ],
          },
        ],
        rows: [
          { id: 'r1', values: { col_subject: 'الرياضيات (Mathematics)', col_coeff: 7, col_target: '18.5/20', col_status: 'مكتمل 80%+' } },
          { id: 'r2', values: { col_subject: 'العلوم الفيزيائية (Physics)', col_coeff: 6, col_target: '18.0/20', col_status: 'قيد المراجعة' } },
          { id: 'r3', values: { col_subject: 'علوم الطبيعة والحياة (Biology)', col_coeff: 6, col_target: '17.0/20', col_status: 'قيد المراجعة' } },
          { id: 'r4', values: { col_subject: 'الفلسفة واللغات (Languages)', col_coeff: 5, col_target: '16.0/20', col_status: 'في البداية' } },
        ],
      };

      const page: Omit<NotionPage, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'مركز دراسة وتفوق البكالوريا 🎓',
        icon: '🎓',
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80',
        isFavorite: true,
        isFullWidth: false,
        blocks: [
          {
            id: 'b1',
            type: 'callout',
            content: '🎯 الهدف الأسمى: الحصول على معدل 17.5+ في البكالوريا مع الانضباط اليومي، حل مواضيع البكالوريا الرسمية، وتدوين الأخطاء بدقة.',
            icon: '💡',
            color: 'blue',
          },
          {
            id: 'b2',
            type: 'heading1',
            content: '📊 متابعة تقدم المواد والوحدات',
          },
          {
            id: 'b3',
            type: 'database',
            content: '',
            databaseId: dbId,
          },
          {
            id: 'b4',
            type: 'heading2',
            content: '📓 كراس الأخطاء الذكي (Mistakes Logbook)',
          },
          {
            id: 'b5',
            type: 'toggle',
            content: '⚠️ خطأ فيزياء: نسيان تحويل الميكروفاراد (µF) في الدارة RC',
            collapsed: false,
            children: [
              {
                id: 'b5_1',
                type: 'text',
                content: 'الحل الدقيق: سعة المكثفة يجب أن تحول دائماً إلى الفاراد (F) بضرب القيمة في 10^-6 قبل التعويض في ثنائي القطب tau = R * C.',
              },
            ],
          },
          {
            id: 'b6',
            type: 'toggle',
            content: '⚠️ خطأ رياضيات: نسيان تحديد الربع في عمدة العدد المركب',
            collapsed: false,
            children: [
              {
                id: 'b6_1',
                type: 'text',
                content: 'الحل الدقيق: لا تعتمد فقط على الآلة الحاسبة، انتبه لإشارة cos(theta) و sin(theta) لتحديد ما إذا كانت الزاوية في الربع الأول، الثاني، الثالث، أو الرابع.',
              },
            ],
          },
          {
            id: 'b7',
            type: 'divider',
            content: '',
          },
          {
            id: 'b8',
            type: 'heading2',
            content: '✅ مهام المراجعة المكثفة لهذا الأسبوع',
          },
          {
            id: 'b9',
            type: 'todo',
            content: 'حل تمرين الدالة الأسية من بكالوريا 2023 علوم تجريبية',
            checked: true,
          },
          {
            id: 'b10',
            type: 'todo',
            content: 'مراجعة معادلات السقوط الشاقولي وحل مسألة القذيفة في الفيزياء',
            checked: false,
          },
          {
            id: 'b11',
            type: 'todo',
            content: 'حفظ وفهم مقالة الفلسفة: هل تنطبق نتائج العلوم الدقيقة على العلوم الإنسانية؟',
            checked: false,
          },
        ],
      };

      return { page, database };
    },
  },
  {
    id: 'tmpl_habit_tracker',
    title: 'Weekly Habit Tracker',
    titleAr: 'متتبع العادات الأسبوعي',
    description: 'Track daily habits, streaks, and personal consistency effortlessly.',
    descriptionAr: 'تتبع عاداتك اليومية واستمراريتك الأسبوعية بكل سهولة وسلاسة.',
    icon: '🎯',
    category: 'Productivity',
    categoryAr: 'إنتاجية وعادات',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
    createPage: () => {
      const dbId = 'db_habits_' + Date.now();
      const database: NotionDatabase = {
        id: dbId,
        title: 'سجل العادات الأسبوعي',
        viewType: 'table',
        properties: [
          { id: 'c_habit', name: 'العادة اليومية', type: 'text' },
          { id: 'c_target', name: 'الهدف اليومي', type: 'text' },
          { id: 'c_sat', name: 'السبت', type: 'checkbox' },
          { id: 'c_sun', name: 'الأحد', type: 'checkbox' },
          { id: 'c_mon', name: 'الاثنين', type: 'checkbox' },
          { id: 'c_tue', name: 'الثلاثاء', type: 'checkbox' },
          { id: 'c_wed', name: 'الأربعاء', type: 'checkbox' },
          { id: 'c_thu', name: 'الخميس', type: 'checkbox' },
          { id: 'c_fri', name: 'الجمعة', type: 'checkbox' },
        ],
        rows: [
          { id: 'h1', values: { c_habit: '💧 شرب 2.5 لتر ماء', c_target: 'طوال اليوم', c_sat: true, c_sun: true, c_mon: true, c_tue: true, c_wed: false, c_thu: false, c_fri: false } },
          { id: 'h2', values: { c_habit: '📖 قراءة 20 صفحة', c_target: 'قبل النوم', c_sat: true, c_sun: true, c_mon: false, c_tue: true, c_wed: false, c_thu: false, c_fri: false } },
          { id: 'h3', values: { c_habit: '🧘 تمرين التركيز والتنفس 4-7-8', c_target: 'صباحاً 10د', c_sat: true, c_sun: true, c_mon: true, c_tue: true, c_wed: true, c_thu: false, c_fri: false } },
          { id: 'h4', values: { c_habit: '🏃 ممارسة المشي أو الرياضة', c_target: '30 دقيقة', c_sat: false, c_sun: true, c_mon: false, c_tue: true, c_wed: false, c_thu: false, c_fri: false } },
        ],
      };

      const page: Omit<NotionPage, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'متتبع العادات الأسبوعي 🎯',
        icon: '🎯',
        coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
        isFavorite: true,
        blocks: [
          {
            id: 'hb_1',
            type: 'callout',
            content: '🌿 "نحن ما نكرره كل يوم؛ التميز إذن ليس فعلاً منفرداً بل عادة مستمرة." — أرسطو',
            icon: '✨',
            color: 'green',
          },
          {
            id: 'hb_2',
            type: 'heading1',
            content: '📅 جدول إنجاز العادات الأسبوعية',
          },
          {
            id: 'hb_3',
            type: 'database',
            content: '',
            databaseId: dbId,
          },
          {
            id: 'hb_4',
            type: 'quote',
            content: 'حدد مكافأة صغيرة لنفسك في نهاية الأسبوع إذا حققت نسبة إنجاز تفوق 80% في جدول عاداتك!',
          },
        ],
      };

      return { page, database };
    },
  },
  {
    id: 'tmpl_kanban_tasks',
    title: 'Project Sprint & Kanban Board',
    titleAr: 'إدارة المهام ولوحة كانبان',
    description: 'Visual Kanban board with drag & drop stages: To Do, In Progress, Done.',
    descriptionAr: 'لوحة كانبان تفاعلية لتنظيم المشاريع في مراحل: قيد الانتظار، قيد التنفيذ، ومكتمل.',
    icon: '🚀',
    category: 'Work',
    categoryAr: 'مشاريع وعمل',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&q=80',
    createPage: () => {
      const dbId = 'db_kanban_' + Date.now();
      const database: NotionDatabase = {
        id: dbId,
        title: 'لوحة المهام السريعة',
        viewType: 'board',
        properties: [
          { id: 't_task', name: 'عنوان المهمة', type: 'text' },
          {
            id: 't_status',
            name: 'الحالة',
            type: 'status',
            options: [
              { id: 'todo', name: 'قيد الانتظار (To Do)', color: 'gray' },
              { id: 'in_progress', name: 'قيد الإنجاز (In Progress)', color: 'blue' },
              { id: 'done', name: 'مكتمل بنجاح (Done)', color: 'green' },
            ],
          },
          {
            id: 't_priority',
            name: 'الأولوية',
            type: 'select',
            options: [
              { id: 'p1', name: 'عالية جداً 🔥', color: 'rose' },
              { id: 'p2', name: 'متوسطة ⚡', color: 'yellow' },
              { id: 'p3', name: 'عادية 🌿', color: 'gray' },
            ],
          },
        ],
        rows: [
          { id: 'k1', values: { t_task: 'تصميم واجهة المستخدم الجديدة على نوشن', t_status: 'قيد الإنجاز (In Progress)', t_priority: 'عالية جداً 🔥' } },
          { id: 'k2', values: { t_task: 'كتابة ملخص درس المتتاليات العددية', t_status: 'قيد الانتظار (To Do)', t_priority: 'عالية جداً 🔥' } },
          { id: 'k3', values: { t_task: 'مراجعة المصطلحات التاريخية للوحدة الأولى', t_status: 'قيد الإنجاز (In Progress)', t_priority: 'متوسطة ⚡' } },
          { id: 'k4', values: { t_task: 'تثبيت ومزامنة إعدادات المتصفح وقوائم المهام', t_status: 'مكتمل بنجاح (Done)', t_priority: 'عادية 🌿' } },
          { id: 'k5', values: { t_task: 'تصدير نسخة احتياطية من الملاحظات', t_status: 'مكتمل بنجاح (Done)', t_priority: 'عادية 🌿' } },
        ],
      };

      const page: Omit<NotionPage, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'إدارة المهام ولوحة كانبان 🚀',
        icon: '🚀',
        coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&q=80',
        isFavorite: false,
        isFullWidth: true,
        blocks: [
          {
            id: 'kb_1',
            type: 'callout',
            content: '📌 يمكنك نقل البطاقات بسهولة بين الأعمدة لتحديث حالة المهام بضغطة زر واحدة.',
            icon: '⚡',
            color: 'yellow',
          },
          {
            id: 'kb_2',
            type: 'heading1',
            content: 'لوحة كانبان النشطة',
          },
          {
            id: 'kb_3',
            type: 'database',
            content: '',
            databaseId: dbId,
          },
        ],
      };

      return { page, database };
    },
  },
  {
    id: 'tmpl_daily_journal',
    title: 'Daily Journal & Reflection',
    titleAr: 'دفتر اليوميات والتأمل',
    description: 'Capture daily memories, gratitude, and clear your thoughts with peace.',
    descriptionAr: 'سجل أفكارك اليومية، 3 أشياء أنت ممتن لها، وتأملاتك الصباحية والمسائية.',
    icon: '📝',
    category: 'Personal',
    categoryAr: 'حياة شخصية',
    coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80',
    createPage: () => {
      const page: Omit<NotionPage, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'دفتر اليوميات والأفكار 📝',
        icon: '📝',
        coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80',
        isFavorite: false,
        blocks: [
          {
            id: 'j1',
            type: 'quote',
            content: 'اليوم بداية جديدة. كل لحظة تركيز تبني مستقبلك الذي تحلم به.',
          },
          {
            id: 'j2',
            type: 'heading2',
            content: '✨ 3 نعم أنا ممتن لها اليوم (Gratitude)',
          },
          {
            id: 'j3',
            type: 'bullet',
            content: 'القدرة على التعلم والتركيز بهدوء في غرفتي',
          },
          {
            id: 'j4',
            type: 'bullet',
            content: 'كوب قهوة دافئ وبداية يوم منظم ومشرق',
          },
          {
            id: 'j5',
            type: 'bullet',
            content: 'دعم العائلة وتشجيعهم المستمر لي',
          },
          {
            id: 'j6',
            type: 'divider',
            content: '',
          },
          {
            id: 'j7',
            type: 'heading2',
            content: '🎯 أهم 3 انتصارات أود تحقيقها اليوم',
          },
          {
            id: 'j8',
            type: 'todo',
            content: 'إنهاء جلسة دراسة مركزة لمدة 45 دقيقة بدون أي مقاطعة',
            checked: true,
          },
          {
            id: 'j9',
            type: 'todo',
            content: 'المشي في الهواء الطلق لمدة 20 دقيقة لاستعادة النشاط',
            checked: false,
          },
          {
            id: 'j10',
            type: 'todo',
            content: 'مراجعة ما حفظته اليوم قبل النوم لمدة 15 دقيقة',
            checked: false,
          },
          {
            id: 'j11',
            type: 'divider',
            content: '',
          },
          {
            id: 'j12',
            type: 'heading2',
            content: '💡 أفكار وتأملات حرة (Free Writing)',
          },
          {
            id: 'j13',
            type: 'text',
            content: 'شعرت اليوم براحة كبيرة بعد تطبيق تقنية بومودورو للتركيز. تقسيم الوقت إلى فترات 25 دقيقة يزيل ثقل المهمة ويجعل البدء أسهل بكثير.',
          },
        ],
      };
      return { page };
    },
  },
];
