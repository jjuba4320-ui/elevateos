export type Language = 'ar' | 'en';
export type UiMode = 'beginner' | 'advanced';

export interface Translations {
  appName: string;
  appSubtitle: string;
  appTagline: string;
  
  // Modes & Language
  simpleMode: string;
  advancedMode: string;
  simpleModeDesc: string;
  advancedModeDesc: string;
  languageName: string;
  switchLanguage: string;
  beginnerBadge: string;
  
  // Nav
  nightComfort: string;
  soundToggle: string;
  themePicker: string;
  analytics: string;
  shareStory: string;
  restartOnboarding: string;
  switchRole: string;
  
  // Roles
  roles: {
    bac_student: string;
    athlete: string;
    professional: string;
    personal: string;
  };
  roleSubtitles: {
    bac_student: string;
    athlete: string;
    professional: string;
    personal: string;
  };

  // Beginner Dashboard
  beginner: {
    greeting: string;
    greetingMorning: string;
    greetingEvening: string;
    subtitle: string;
    dailyTip: string;
    tipText: string;
    quickTimerTitle: string;
    quickTimerDesc: string;
    focusSession: string;
    shortBreak: string;
    longBreak: string;
    startTimer: string;
    pauseTimer: string;
    resetTimer: string;
    timerCompleted: string;
    ambientSound: string;
    soundOff: string;
    soundRain: string;
    soundWhiteNoise: string;
    soundLibrary: string;
    soundCafe: string;
    
    tasksTitle: string;
    tasksDesc: string;
    taskPlaceholder: string;
    addTask: string;
    noTasks: string;
    tasksProgress: string;
    allTasks: string;
    activeTasks: string;
    completedTasks: string;
    clearCompleted: string;
    deleteTask: string;
    
    habitsTitle: string;
    habitsDesc: string;
    addHabit: string;
    habitNamePlaceholder: string;
    streakDays: string;
    todayDone: string;
    markHabitDone: string;
    habitShields: string;
    
    levelTitle: string;
    level: string;
    xp: string;
    rewardsBtn: string;
    rankNovice: string;
    
    breatheTitle: string;
    breatheDesc: string;
    breatheBtn: string;
    
    bacCardTitle: string;
    bacCardDesc: string;
    daysUntilBac: string;
    mistakesBookBtn: string;
    
    wantMoreTools: string;
    switchToAdvanced: string;
  };

  // Breathing Widget
  breathing: {
    title: string;
    desc: string;
    start: string;
    stop: string;
    inhale: string;
    hold: string;
    exhale: string;
    cyclesCompleted: string;
    relaxTip: string;
  };

  // Mistakes Logbook
  mistakes: {
    title: string;
    subtitle: string;
    addNew: string;
    subject: string;
    exerciseRef: string;
    errorDesc: string;
    correctSol: string;
    lesson: string;
    save: string;
    cancel: string;
    empty: string;
    reviewed: string;
    markReviewed: string;
  };

  // Rewards Store
  rewards: {
    title: string;
    subtitle: string;
    balance: string;
    cost: string;
    redeem: string;
    redeemed: string;
    notEnoughXp: string;
  };

  // Common
  close: string;
  save: string;
  delete: string;
  edit: string;
  confirm: string;
  today: string;
  minutes: string;
  seconds: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'مَداك',
    appSubtitle: 'نظام الإنتاجية وتتبع العادات | MadakOS',
    appTagline: 'منصة مَداك الذكية لتنظيم يومك، تعزيز تركيزك، وبناء عادات النجاح والتفوق',
    
    simpleMode: 'الوضع المبسط 🌿',
    advancedMode: 'الوضع المتقدم ⚡',
    simpleModeDesc: 'واجهة هادئة وسهلة للمبتدئين تركز على المهام، المؤقت، والعادات',
    advancedModeDesc: 'أدوات احترافية موسعة مع كانبان، مصفوفة إيزنهاور، وإحصائيات متقدمة',
    languageName: 'العربية',
    switchLanguage: 'English 🇬🇧',
    beginnerBadge: 'مناسب للمبتدئين',
    
    nightComfort: 'حماية العين (إضاءة ليلية)',
    soundToggle: 'الأصوات الهادئة',
    themePicker: 'تغيير المظهر',
    analytics: 'إحصائيات الإنتاجية',
    shareStory: 'مشاركة الإنجاز (ستوري)',
    restartOnboarding: 'إعادة التهيئة',
    switchRole: 'تغيير الملف الشخصي',
    
    roles: {
      bac_student: 'طالب بكالوريا 🎓',
      athlete: 'رياضي ولياقة بدنية 🏋️',
      professional: 'موظف ومهني 💼',
      personal: 'حياة شخصية وتطوير 🌟',
    },
    roleSubtitles: {
      bac_student: 'العد التنازلي للبكالوريا، كراس الأخطاء، ومراجعة المواد',
      athlete: 'سجل التمارين، شرب الماء، وبناء اللياقة البدنية',
      professional: 'مصفوفة الأولويات، تتبع الوقت، ومذكرات الاجتماعات',
      personal: 'توازن الحياة، بناء العادات الإيجابية، والمصروفات',
    },

    beginner: {
      greeting: 'مرحباً بك، {name}!',
      greetingMorning: 'صباح الخير والنشاط، {name}! ☀️',
      greetingEvening: 'مساء الإنجاز والهدوء، {name}! 🌙',
      subtitle: 'واجهتك البسيطة والسهلة. كل ما تحتاجه للتركيز والإنجاز دون أي تعقيد.',
      dailyTip: '💡 نصيحة اليوم',
      tipText: 'ابدأ بمهمة صغيرة واحدة لمدة 25 دقيقة فقط. الاستمرارية تصنع المعجزات!',
      quickTimerTitle: 'مؤقت التركيز السريع',
      quickTimerDesc: 'اضغط ابدأ، وضع هاتفك جانباً، وركز على مهمتك الحالية بكل هدوء.',
      focusSession: 'وقت التركيز (25 د)',
      shortBreak: 'استراحة قصيرة (5 د)',
      longBreak: 'استراحة طويلة (15 د)',
      startTimer: 'ابدأ التركيز 🚀',
      pauseTimer: 'إيقاف مؤقت ⏸️',
      resetTimer: 'إعادة ضبط 🔄',
      timerCompleted: 'أحسنت صنعاً! انتهت جلسة التركيز وحصلت على نقاط خبرة ✨',
      ambientSound: 'صوت هادئ في الخلفية:',
      soundOff: 'بدون صوت',
      soundRain: 'صوت المطر 🌧️',
      soundWhiteNoise: 'ضوضاء بيضاء 🎧',
      soundLibrary: 'أجواء مكتبة 📚',
      soundCafe: 'أجواء مقهى ☕',
      
      tasksTitle: 'قائمة مهام اليوم',
      tasksDesc: 'سجّل ما تريد إنجازه اليوم، واضغط على المربع عند الانتهاء.',
      taskPlaceholder: 'اكتب مهمة جديدة (مثلاً: حل تمرين، قراءة 10 صفحات)...',
      addTask: 'إضافة مهمة',
      noTasks: 'رائع! لا توجد مهام معلقة. أضف أول مهمة لتنطلق 🚀',
      tasksProgress: 'أنجزت {done} من أصل {total} مهام اليوم ({percent}%)',
      allTasks: 'الكل',
      activeTasks: 'المتبقية',
      completedTasks: 'المكتملة ✓',
      clearCompleted: 'مسح المكتملة',
      deleteTask: 'حذف',
      
      habitsTitle: 'عاداتي اليومية',
      habitsDesc: 'اضغط على الدائرة عند إتمام العادة لبناء سلسلة استمرارية لا تنكسر.',
      addHabit: '+ عادة جديدة',
      habitNamePlaceholder: 'اسم العادة (مثلاً: شرب لترين ماء)...',
      streakDays: 'أيام متتالية',
      todayDone: 'تم إنجازها اليوم ✓',
      markHabitDone: 'إتمام اليوم',
      habitShields: 'درع حماية السلسلة',
      
      levelTitle: 'مستواك ونقاطك (XP)',
      level: 'المستوى',
      xp: 'نقطة خبرة',
      rewardsBtn: 'متجر المكافآت 🎁',
      rankNovice: 'مبتدئ طموح',
      
      breatheTitle: 'استراحة وتنفس هادئ (دقيقة واحدة)',
      breatheDesc: 'تمرين 4-7-8 لتهدئة التوتر وإعادة شحن طاقتك الذهنية.',
      breatheBtn: 'ابدأ تمرين التنفس 🫁',
      
      bacCardTitle: 'العد التنازلي للبكالوريا',
      bacCardDesc: 'امتحانات البكالوريا الرسمية',
      daysUntilBac: 'يوماً متبقياً',
      mistakesBookBtn: 'فتح كراس الأخطاء 📓',
      
      wantMoreTools: 'هل تريد أدوات متقدمة أكثر؟ (لوحة كانبان، مصفوفة إيزنهاور، خريطة العادات السنوية، وحاسبة البكالوريا)',
      switchToAdvanced: 'التبديل إلى الوضع المتقدم ⚡',
    },

    breathing: {
      title: 'تمرين التنفس 4-7-8 المهدئ',
      desc: 'شهيق من الأنف 4 ثوانٍ، حبس النفس 7 ثوانٍ، زفير هادئ من الفم 8 ثوانٍ.',
      start: 'بدء دورة التنفس',
      stop: 'إيقاف التمرين',
      inhale: 'خُذ شهيقاً عميقاً من الأنف...',
      hold: 'احبس النفس واسترخِ...',
      exhale: 'أطلق زفيراً بطيئاً وهادئاً...',
      cyclesCompleted: 'دورات مكتملة',
      relaxTip: 'يساعد هذا التمرين على خفض ضربات القلب والتخلص من القلق فوراً.',
    },

    mistakes: {
      title: 'كراس الأخطاء الرقمي 📓',
      subtitle: 'سجّل الأخطاء التي ارتكبتها في التمارين والامتحانات لتتعلم منها ولا تكررها.',
      addNew: '+ تسجيل خطأ جديد',
      subject: 'المادة الدراسية',
      exerciseRef: 'عنوان التمرين / الامتحان',
      errorDesc: 'الخطأ المرتكب بالتفصيل',
      correctSol: 'الحل النموذجي الصحيح',
      lesson: 'القاعدة أو الفائدة المستخلصة',
      save: 'حفظ في الكراس',
      cancel: 'إلغاء',
      empty: 'الكراس فارغ حالياً. تسجيل أخطائك هو أسرع طريق للعلامة الكاملة!',
      reviewed: 'تمت المراجعة ✓',
      markReviewed: 'تأكيد المراجعة',
    },

    rewards: {
      title: 'متجر المكافآت الذاتي 🎁',
      subtitle: 'استبدل نقاط خبرتك بمكافآت تستحقها بعد جلسات التركيز والإنجاز.',
      balance: 'رصيدك الحالي من النقاط:',
      cost: 'التكلفة:',
      redeem: 'استبدال الآن',
      redeemed: 'تمت المكافأة! استمتع بوقتك 🎉',
      notEnoughXp: 'تحتاج المزيد من النقاط',
    },

    close: 'إغلاق',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    confirm: 'تأكيد',
    today: 'اليوم',
    minutes: 'دقيقة',
    seconds: 'ثانية',
  },

  en: {
    appName: 'MadakOS',
    appSubtitle: 'Productivity & Habit Operating System | مَداك',
    appTagline: 'Intelligent operating system designed for focus, habits, and peak academic mastery.',
    
    simpleMode: 'Simple Mode 🌿',
    advancedMode: 'Pro Mode ⚡',
    simpleModeDesc: 'Calm, beginner-friendly view focused on tasks, quick timer, and essential habits',
    advancedModeDesc: 'Full power view with Kanban, Eisenhower matrix, and deep analytics',
    languageName: 'English',
    switchLanguage: 'العربية 🇩🇿 🇸🇦',
    beginnerBadge: 'Beginner Friendly',
    
    nightComfort: 'Eye Comfort (Blue Light Filter)',
    soundToggle: 'Ambient Soundscapes',
    themePicker: 'Theme & Palette',
    analytics: 'Productivity Analytics',
    shareStory: 'Share Story Card',
    restartOnboarding: 'Restart Onboarding',
    switchRole: 'Switch Persona',
    
    roles: {
      bac_student: 'BAC Student 🎓',
      athlete: 'Athlete & Fitness 🏋️',
      professional: 'Professional 💼',
      personal: 'Personal Life 🌟',
    },
    roleSubtitles: {
      bac_student: 'BAC Exam countdown, mistakes logbook, and subject revision',
      athlete: 'Workout logger, hydration, and fitness streaks',
      professional: 'Eisenhower matrix, time tracker, and meeting notes',
      personal: 'Life balance, positive habits, and micro-budgeting',
    },

    beginner: {
      greeting: 'Welcome back, {name}!',
      greetingMorning: 'Good morning, {name}! ☀️',
      greetingEvening: 'Good evening, {name}! 🌙',
      subtitle: 'Your calm, distraction-free space. Everything you need to focus and succeed.',
      dailyTip: '💡 Daily Focus Tip',
      tipText: 'Start with just one single 25-minute focus session. Consistency compounds into mastery!',
      quickTimerTitle: 'Quick Focus Timer',
      quickTimerDesc: 'Hit start, set your phone aside, and immerse in your task with quiet confidence.',
      focusSession: 'Focus (25m)',
      shortBreak: 'Short Break (5m)',
      longBreak: 'Long Break (15m)',
      startTimer: 'Start Focus 🚀',
      pauseTimer: 'Pause ⏸️',
      resetTimer: 'Reset 🔄',
      timerCompleted: 'Great job! Focus session completed and XP gained ✨',
      ambientSound: 'Background Ambience:',
      soundOff: 'Mute',
      soundRain: 'Rain 🌧️',
      soundWhiteNoise: 'White Noise 🎧',
      soundLibrary: 'Library 📚',
      soundCafe: 'Cafe ☕',
      
      tasksTitle: "Today's Checklist",
      tasksDesc: 'Write down what you want to achieve today, and tick items off as you finish.',
      taskPlaceholder: 'Write a new task (e.g., Read Physics chapter 2)...',
      addTask: 'Add Task',
      noTasks: 'All clear! No pending tasks. Add your first goal to get started 🚀',
      tasksProgress: 'Completed {done} of {total} tasks today ({percent}%)',
      allTasks: 'All',
      activeTasks: 'Active',
      completedTasks: 'Completed ✓',
      clearCompleted: 'Clear Completed',
      deleteTask: 'Delete',
      
      habitsTitle: 'Daily Habits',
      habitsDesc: 'Tap the checkmark when finished to build your unbreakable daily streak.',
      addHabit: '+ New Habit',
      habitNamePlaceholder: 'Habit name (e.g. Drink 2L water)...',
      streakDays: 'day streak',
      todayDone: 'Done today ✓',
      markHabitDone: 'Mark Done',
      habitShields: 'Streak Shield',
      
      levelTitle: 'Level & XP Progress',
      level: 'Level',
      xp: 'XP',
      rewardsBtn: 'Reward Store 🎁',
      rankNovice: 'Ambitious Starter',
      
      breatheTitle: '1-Minute Relax & Breathe',
      breatheDesc: '4-7-8 breathing exercise to release tension and restore mental clarity.',
      breatheBtn: 'Start Breathing 🫁',
      
      bacCardTitle: 'BAC Exam Countdown',
      bacCardDesc: 'Official Baccalaureate Examination',
      daysUntilBac: 'days left',
      mistakesBookBtn: 'Open Mistakes Book 📓',
      
      wantMoreTools: 'Looking for advanced tools? (Kanban board, Eisenhower matrix, 36-week habit heatmap, and BAC coefficient calculator)',
      switchToAdvanced: 'Switch to Pro Mode ⚡',
    },

    breathing: {
      title: '4-7-8 Calming Breathwork',
      desc: 'Inhale for 4 seconds through the nose, hold for 7 seconds, exhale smoothly for 8 seconds.',
      start: 'Begin Breathing Cycle',
      stop: 'Stop Exercise',
      inhale: 'Inhale deeply through your nose...',
      hold: 'Hold your breath gently...',
      exhale: 'Slowly exhale through your mouth...',
      cyclesCompleted: 'cycles completed',
      relaxTip: 'This parasympathetic pattern activates your vagus nerve and reduces stress instantly.',
    },

    mistakes: {
      title: 'Digital Mistakes Logbook 📓',
      subtitle: 'Log and catalog your exercise mistakes so you never repeat them on exam day.',
      addNew: '+ Log New Mistake',
      subject: 'Subject',
      exerciseRef: 'Exercise / Exam Reference',
      errorDesc: 'Detailed Mistake Description',
      correctSol: 'Model Solution',
      lesson: 'Core Lesson / Key Takeaway',
      save: 'Save to Logbook',
      cancel: 'Cancel',
      empty: 'Your logbook is empty. Analyzing mistakes is the fastest path to perfection!',
      reviewed: 'Reviewed ✓',
      markReviewed: 'Mark as Reviewed',
    },

    rewards: {
      title: 'Self-Reward Store 🎁',
      subtitle: 'Redeem your earned XP for genuine rewards after deep work sessions.',
      balance: 'Current XP Balance:',
      cost: 'Cost:',
      redeem: 'Redeem Now',
      redeemed: 'Reward Claimed! Enjoy your break 🎉',
      notEnoughXp: 'Not enough XP yet',
    },

    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    today: 'Today',
    minutes: 'mins',
    seconds: 'secs',
  },
};
