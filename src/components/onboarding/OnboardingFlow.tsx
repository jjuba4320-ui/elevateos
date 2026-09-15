import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Dumbbell,
  Briefcase,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  Target,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { UserRole, ThemePreset } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import { useThemeStore, THEME_PRESETS } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { soundscapeEngine } from '../../services/audioService';
import { MadakLogo } from '../common/MadakLogo';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { completeOnboarding, profile } = useUserStore();
  const { theme, setPreset, setPrimaryAccent } = useThemeStore();
  const { language, toggleLanguage, dir, t } = useLanguageStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(profile.name || (language === 'ar' ? 'أمين بن علي' : 'Amine Benali'));
  const [age, setAge] = useState<number>(profile.age || 18);
  const [mainGoal, setMainGoal] = useState(
    profile.mainGoal ||
      (language === 'ar'
        ? 'الحصول على معدل 17+ في البكالوريا والتفوق في المواد الأساسية'
        : 'Score 17.5+ in BAC & Master Physics and Mathematics')
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>('bac_student');

  const ROLE_OPTIONS: {
    role: UserRole;
    title: string;
    subtitle: string;
    badge: string;
    icon: typeof GraduationCap;
    highlights: string[];
  }[] = [
    {
      role: 'bac_student',
      title: language === 'ar' ? 'طالب بكالوريا (BAC)' : 'BAC / High School Student',
      subtitle:
        language === 'ar'
          ? 'مترشحو شهادة البكالوريا النظاميون والأحرار'
          : 'Algerian & International Baccalaureate Candidates',
      badge: language === 'ar' ? 'الأكثر طلباً 🎓' : 'Flagship Priority',
      icon: GraduationCap,
      highlights:
        language === 'ar'
          ? [
              'العد التنازلي المباشر لامتحان البكالوريا',
              'كراس الأخطاء الذكي لحفظ وتصحيح العثرات',
              'حاسبة معدل البكالوريا بالمعاملات',
              'مؤقت بومودورو للتركيز العميق بدون تشتت',
            ]
          : [
              'BAC Exam Real-time Countdown',
              'Mistakes Logbook (كراس الأخطاء)',
              'Subject Revision & Grade Calculator',
              'Strict Focus Pomodoro Timer',
            ],
    },
    {
      role: 'athlete',
      title: language === 'ar' ? 'رياضي ولياقة بدنية' : 'Athlete & Fitness Enthusiast',
      subtitle:
        language === 'ar'
          ? 'بناء القوة، اللياقة البدنية، ومتابعة التمارين'
          : 'Physical performance, conditioning, & habit stacking',
      badge: language === 'ar' ? 'طاقة ونشاط ⚡' : 'High Energy',
      icon: Dumbbell,
      highlights:
        language === 'ar'
          ? [
              'سجل تمارين القوة (المجموعات والتكرارات)',
              'عداد شرب الماء ومؤقت الراحة بين التمارين',
              'تتبع استمرارية التمارين الأسبوعية',
              'حساب السعرات والعادات الصحية',
            ]
          : [
              'Workout Sets, Reps & Volume Logger',
              'Hydration Counter & Rest Timers',
              'Workout Streaks & Recovery Monitoring',
              'Calorie & Nutrition Tracking',
            ],
    },
    {
      role: 'professional',
      title: language === 'ar' ? 'موظف ومهني ومحترف' : 'Professional & Knowledge Worker',
      subtitle:
        language === 'ar'
          ? 'تنظيم المشاريع، إدارة الأولويات، والتركيز العالي'
          : 'Execution mastery, deep focus & task matrices',
      badge: language === 'ar' ? 'إنتاجية 💼' : 'Productivity',
      icon: Briefcase,
      highlights:
        language === 'ar'
          ? [
              'مصفوفة إيزنهاور لتحديد العاجل والمهم',
              'لوحة كانبان لمتابعة تدفق المشاريع',
              'مذكرات الاجتماعات وتتبع ساعات العمل',
              'إحصائيات ذروة الإنتاجية اليومية',
            ]
          : [
              'Eisenhower Matrix (Urgent / Important)',
              'Kanban Board with Drag & Drop States',
              'Sessional Time Tracking & Meeting Notes',
              'Focus Score & Peak Productivity Analytics',
            ],
    },
    {
      role: 'personal',
      title: language === 'ar' ? 'حياة يومية وتطوير الذات' : 'Personal & Life Optimizer',
      subtitle:
        language === 'ar'
          ? 'توازن الحياة، بناء العادات، وإدارة المصروفات'
          : 'Mindfulness, habit rings, journaling & lifestyle balance',
      badge: language === 'ar' ? 'سكينة وتوازن 🌿' : 'Wellbeing',
      icon: User,
      highlights:
        language === 'ar'
          ? [
              'حلقات العادات الصباحية والمسائية',
              'مذكرة الامتنان وتتبع الحالة المزاجية',
              'تتبع المصروفات والميزانية الشخصية',
              'تمرين التنفس 4-7-8 لتفريغ التوتر',
            ]
          : [
              'Morning & Evening Habit Rings',
              'Mood & 3-Thing Gratitude Journal',
              'Micro-Budget & Expense Tracker',
              'Stress Relief 4-7-8 Breathing Circle',
            ],
    },
  ];

  const ACCENT_PALETTE = [
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Orange', hex: '#f97316' },
  ];

  const handleNextStep = () => {
    soundscapeEngine.playTaskCompleteSound();
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      completeOnboarding({
        name: name.trim() || (language === 'ar' ? 'بطل الإنتاجية' : 'Elite Operator'),
        age: Number(age) || 18,
        mainGoal: mainGoal.trim() || (language === 'ar' ? 'تحقيق أهدافي العليا' : 'Excel in my highest aspirations'),
        role: selectedRole,
      });
      if (onComplete) onComplete();
    }
  };

  const NextArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div
      id="onboarding-root"
      dir={dir}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: theme.bgDark, color: theme.textPrimary }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: theme.primaryAccent }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: theme.secondaryAccent }}
      />

      <div className="w-full max-w-3xl z-10">
        {/* Header Progress Bar & Language Switcher */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <MadakLogo size={34} />
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight">{t.appName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  MadakOS
                </span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 font-medium hidden sm:inline">
                {t.beginnerBadge}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher on Onboarding */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900/90 text-xs font-bold text-neutral-200 hover:text-white hover:border-neutral-500 transition shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <div className="text-xs font-mono text-neutral-400">
                {language === 'ar' ? `المرحلة ${step} من 3` : `STEP ${step} OF 3`}
              </div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.primaryAccent }}
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Dynamic Card Body */}
        <div
          id="onboarding-card"
          className="p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.borderSubtle,
          }}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: IDENTITY & CORE GOAL */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {language === 'ar' ? 'أهلاً بك في مَداك! لنبدأ بتعريف بسيط 🌟' : 'Welcome to MadakOS • Initialize Your Space'}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 mt-1.5 leading-relaxed">
                    {language === 'ar'
                      ? 'خطوتك الأولى لتنظيم وقتك، تتبع عاداتك، وبناء انضباط يومي هادئ وفعال.'
                      : 'Calibrate your personalized operating system for peak focus, habit stacking, and mastery.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      {language === 'ar' ? 'اسمك أو اللقب المفضل لديك' : 'Your Full Name or Codename'}
                    </label>
                    <input
                      id="input-user-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثلاً: أمين بن علي' : 'e.g. Amine Benali'}
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-900/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                      style={{ borderColor: name ? theme.primaryAccent : undefined }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                        {language === 'ar' ? 'العمر' : 'Age'}
                      </label>
                      <input
                        id="input-user-age"
                        type="number"
                        min={12}
                        max={99}
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-900/80 border border-neutral-700 text-white focus:outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                        {language === 'ar' ? 'هدفك الأسمى أو طموحك الحالي' : 'Main Mission / Pinnacle Goal'}
                      </label>
                      <div className="relative">
                        <Target className={`w-4 h-4 text-neutral-500 absolute top-3.5 ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'}`} />
                        <input
                          id="input-main-goal"
                          type="text"
                          value={mainGoal}
                          onChange={(e) => setMainGoal(e.target.value)}
                          placeholder={
                            language === 'ar'
                              ? 'مثلاً: الحصول على معدل 17 في البكالوريا والتفوق'
                              : 'e.g. Score 17.5+ in BAC & Master Physics'
                          }
                          className={`w-full py-3 rounded-2xl bg-neutral-900/80 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none transition ${
                            dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="btn-step1-next"
                    onClick={handleNextStep}
                    disabled={!name.trim()}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:opacity-95"
                    style={{ backgroundColor: theme.primaryAccent }}
                  >
                    <span>{language === 'ar' ? 'متابعة لاختيار النمط المناسب' : 'Proceed to Persona Selection'}</span>
                    <NextArrow className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROLE SELECTION */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {language === 'ar' ? 'ما هو مجالك أو نمطك الأساسي؟' : 'Select Your Operating Mode'}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 mt-1.5">
                    {language === 'ar'
                      ? 'اختر النمط الأنسب لك لتهيئة الأدوات المناسبة ليومك (يمكنك تغييره دائماً بنقرة واحدة).'
                      : 'Your choice tailors the dashboard widgets, focus tools, and analytics algorithms.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROLE_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <div
                        id={`role-card-${item.role}`}
                        key={item.role}
                        onClick={() => setSelectedRole(item.role)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'ring-2 shadow-xl'
                            : 'hover:border-neutral-600 opacity-90'
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                          borderColor: isSelected ? theme.primaryAccent : theme.borderSubtle,
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
                              style={{
                                backgroundColor: isSelected ? theme.primaryAccent : '#262626',
                                color: isSelected ? '#000' : '#fff',
                              }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                              style={{
                                backgroundColor: isSelected ? `${theme.primaryAccent}22` : '#262626',
                                color: isSelected ? theme.primaryAccent : '#a3a3a3',
                              }}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <h2 className="font-bold text-base sm:text-lg text-white">{item.title}</h2>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.subtitle}</p>

                          <ul className="mt-3.5 space-y-1.5">
                            {item.highlights.map((h, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isSelected && (
                          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.primaryAccent }}>
                            <Check className="w-4 h-4" />
                            <span>{language === 'ar' ? 'تم الاختيار' : 'Active Selection'}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    id="btn-step2-back"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-neutral-300 hover:text-white border border-neutral-700 transition font-medium text-xs"
                  >
                    <BackArrow className="w-4 h-4" />
                    <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>

                  <button
                    id="btn-step2-next"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-black transition-all cursor-pointer shadow-xl hover:opacity-95"
                    style={{ backgroundColor: theme.primaryAccent }}
                  >
                    <span>{language === 'ar' ? 'تخصيص المظهر' : 'Configure Visual Engine'}</span>
                    <NextArrow className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: THEME PREFERENCE */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {language === 'ar' ? 'اختر مظهرك المريح للعينين' : 'Custom Visual Atmosphere'}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 mt-1.5">
                    {language === 'ar'
                      ? 'اختر النمط اللوني الذي يناسبك، كل الألوان مصممة لراحة العين والتركيز الطويل.'
                      : 'Select an aesthetic preset or customize your primary accent tone.'}
                  </p>
                </div>

                {/* Preset Options */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2.5">
                    {language === 'ar' ? 'سمات المظهر الجاهزة' : 'Theme Atmospheres'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                      const item = THEME_PRESETS[key];
                      const isSelected = theme.preset === key;
                      return (
                        <div
                          id={`theme-preset-${key}`}
                          key={key}
                          onClick={() => setPreset(key)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected ? 'ring-2' : 'hover:border-neutral-600'
                          }`}
                          style={{
                            backgroundColor: item.colors.cardBg,
                            borderColor: isSelected ? theme.primaryAccent : item.colors.borderSubtle,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-white/20 shadow"
                              style={{ backgroundColor: item.colors.primaryAccent }}
                            />
                            <div>
                              <div className="font-bold text-sm text-white">{item.name}</div>
                              <div className="text-xs text-neutral-400 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4" style={{ color: theme.primaryAccent }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Accent Palette */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-neutral-300">
                      {language === 'ar' ? 'اللون التفاعلي المفضل' : 'Primary Accent Tint'}
                    </label>
                    <span className="text-xs font-mono text-neutral-400">{theme.primaryAccent}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {ACCENT_PALETTE.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setPrimaryAccent(c.hex)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 ${
                          theme.primaryAccent === c.hex ? 'ring-2 ring-white scale-105' : ''
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {theme.primaryAccent === c.hex && <Check className="w-4 h-4 text-black stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview Pill */}
                <div
                  className="p-4 rounded-2xl border flex items-center justify-between"
                  style={{ backgroundColor: theme.bgDark, borderColor: theme.borderSubtle }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-sm shadow"
                      style={{ backgroundColor: theme.primaryAccent }}
                    >
                      {name ? name.slice(0, 2).toUpperCase() : 'EO'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{name || 'أمين بن علي'}</div>
                      <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                        <span>{t.roles[selectedRole]}</span>
                        <span>•</span>
                        <span>{t.beginnerBadge}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="text-xs px-3 py-1 rounded-full font-bold"
                    style={{ backgroundColor: `${theme.primaryAccent}25`, color: theme.primaryAccent }}
                  >
                    {language === 'ar' ? 'جاهز للانطلاق 🚀' : 'READY TO LAUNCH'}
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    id="btn-step3-back"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-neutral-300 hover:text-white border border-neutral-700 transition font-medium text-xs"
                  >
                    <BackArrow className="w-4 h-4" />
                    <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>

                  <button
                    id="btn-launch-elevateos"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-black transition-all cursor-pointer shadow-xl hover:opacity-95"
                    style={{ backgroundColor: theme.primaryAccent }}
                  >
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'دخول مَداك وبدء الإنجاز 🚀' : 'Launch MadakOS'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security & Offline-First Badge */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'تخزين مشفر ومحلي 100% يعمل بدون إنترنت' : 'Offline-First Encrypted Cache'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>{language === 'ar' ? 'واجهة مريحة وسهلة للمبتدئين' : 'Beginner Friendly Interface'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
