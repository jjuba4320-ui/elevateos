import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flame,
  Award,
  BookOpen,
  Wind,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { useUserStore } from '../../stores/useUserStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useFocusStore } from '../../stores/useFocusStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useHabitStore } from '../../stores/useHabitStore';
import { useGamificationStore, calculateLevel } from '../../stores/useGamificationStore';
import { useBacStore } from '../../stores/useBacStore';
import { soundscapeEngine } from '../../services/audioService';

interface BeginnerDashboardProps {
  onOpenMistakesLogbook: () => void;
  onOpenRewardStore: () => void;
}

export function BeginnerDashboard({
  onOpenMistakesLogbook,
  onOpenRewardStore,
}: BeginnerDashboardProps) {
  const { t, language, dir, toggleUiMode } = useLanguageStore();
  const { profile } = useUserStore();
  const { theme } = useThemeStore();
  const {
    timeLeftSeconds,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    setMode,
    activeAmbient,
    setAmbientSound,
  } = useFocusStore();
  const { tasks, addTask, toggleTaskStatus, deleteTask } = useTaskStore();
  const { habits, checkInHabit, uncheckHabit, addHabit } = useHabitStore();
  const { xp, level } = useGamificationStore();
  const { examDate } = useBacStore();

  const levelStats = calculateLevel(xp);
  const countdownDays = Math.max(
    0,
    Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  // Local states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breatheSeconds, setBreatheSeconds] = useState(4);
  const [isBreatheRunning, setIsBreatheRunning] = useState(false);

  // Focus Timer Tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickTimer]);

  // Breathing interval
  useEffect(() => {
    let breatheTimer: NodeJS.Timeout | null = null;
    if (isBreatheRunning) {
      breatheTimer = setInterval(() => {
        setBreatheSeconds((prev) => {
          if (prev <= 1) {
            if (breathePhase === 'inhale') {
              setBreathePhase('hold');
              return 7;
            } else if (breathePhase === 'hold') {
              setBreathePhase('exhale');
              return 8;
            } else {
              setBreathePhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (breatheTimer) clearInterval(breatheTimer);
    };
  }, [isBreatheRunning, breathePhase]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === 'active') return task.status !== 'completed';
    if (taskFilter === 'completed') return task.status === 'completed';
    return true;
  });

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const taskProgressPercent =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Handle adding task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      status: 'todo',
      subtasks: [],
      recurrence: 'none',
      priority: 'P2',
      tags: ['Daily'],
      rolloverEnabled: true,
    });
    setNewTaskTitle('');
    soundscapeEngine.playTaskCompleteSound();
  };

  // Handle adding habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit({
      title: newHabitTitle.trim(),
      category: 'General',
      frequency: 'daily',
      icon: 'sparkles',
      targetPerDay: 1,
      unit: 'times',
      timeOfDay: 'morning',
      color: theme.primaryAccent,
      archived: false,
      streakShields: 1,
    });
    setNewHabitTitle('');
    setShowAddHabit(false);
    soundscapeEngine.playTaskCompleteSound();
  };

  // Greeting time
  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12
      ? t.beginner.greetingMorning.replace('{name}', profile.name)
      : t.beginner.greetingEvening.replace('{name}', profile.name);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir={dir}>
      {/* 1. Welcoming & Friendly Header Banner */}
      <div
        className="p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.borderSubtle,
        }}
      >
        <div
          className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: theme.primaryAccent }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-black shadow-sm"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                {t.beginnerBadge}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                {t.roles[profile.role]}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greetingText}
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              {t.beginner.subtitle}
            </p>
          </div>

          {/* Quick Level & XP Pill */}
          <div
            onClick={onOpenRewardStore}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-base shadow"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              {level}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.beginner.level} {level}</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {xp} / {levelStats.nextLevelXp} XP
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Tip Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900/40 p-3 rounded-xl">
          <span className="font-bold text-amber-400 whitespace-nowrap">{t.beginner.dailyTip}:</span>
          <span className="text-neutral-300">{t.beginner.tipText}</span>
        </div>
      </div>

      {/* 2. Flagship BAC Exam Countdown (shown specifically if student) */}
      {profile.role === 'bac_student' && (
        <div
          className="p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-extrabold shadow shrink-0"
              style={{ backgroundColor: theme.primaryAccent }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{t.beginner.bacCardTitle}</h3>
              <p className="text-xs text-neutral-400">{t.beginner.bacCardDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-center sm:text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                {countdownDays}
              </span>{' '}
              <span className="text-xs text-neutral-400 font-medium">{t.beginner.daysUntilBac}</span>
            </div>

            <button
              onClick={onOpenMistakesLogbook}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{t.beginner.mistakesBookBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Grid: Simple Focus Timer + Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: Simple Focus Timer (5 cols) */}
        <div
          className="lg:col-span-5 p-6 rounded-3xl border shadow-xl flex flex-col justify-between"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  {t.beginner.quickTimerTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{t.beginner.quickTimerDesc}</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Presets: 25m, 15m, 5m */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => setMode('pomodoro')}
                className="py-2 px-1 rounded-xl text-xs font-semibold text-center border transition hover:opacity-90"
                style={{
                  backgroundColor: `${theme.primaryAccent}20`,
                  borderColor: theme.primaryAccent,
                  color: theme.primaryAccent,
                }}
              >
                25 {t.minutes}
              </button>
              <button
                onClick={() => setMode('short_break')}
                className="py-2 px-1 rounded-xl text-xs font-semibold text-center border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white transition"
              >
                5 {t.minutes}
              </button>
              <button
                onClick={() => setMode('long_break')}
                className="py-2 px-1 rounded-xl text-xs font-semibold text-center border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white transition"
              >
                15 {t.minutes}
              </button>
            </div>

            {/* Big Digit Display */}
            <div className="my-6 text-center py-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 relative shadow-inner">
              <div
                className="text-6xl sm:text-7xl font-black font-mono tracking-tight"
                style={{ color: isRunning ? theme.primaryAccent : '#ffffff' }}
              >
                {formatTime(timeLeftSeconds)}
              </div>
              <p className="text-xs text-neutral-400 mt-2 font-medium">
                {isRunning
                  ? language === 'ar'
                    ? 'جلسة التركيز جارية...'
                    : 'Focusing in progress...'
                  : language === 'ar'
                  ? 'جاهز للانطلاق'
                  : 'Ready to start'}
              </p>
            </div>

            {/* Timer Actions: Big Start / Pause & Reset */}
            <div className="flex items-center gap-3">
              {isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white bg-amber-600 hover:bg-amber-500 transition shadow-lg"
                >
                  <Pause className="w-5 h-5" />
                  <span>{t.beginner.pauseTimer}</span>
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm text-black transition shadow-lg hover:opacity-95"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t.beginner.startTimer}</span>
                </button>
              )}

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                title={t.beginner.resetTimer}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ambient Soundscape selector */}
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
              <span>{t.beginner.ambientSound}</span>
              <span className="font-mono text-[10px] text-cyan-400 capitalize">{activeAmbient}</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['off', 'rain', 'white_noise', 'library', 'cafe'] as const).map((snd) => (
                <button
                  key={snd}
                  onClick={() => setAmbientSound(snd)}
                  className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap border transition ${
                    activeAmbient === snd
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:text-white'
                  }`}
                >
                  {snd === 'off' && t.beginner.soundOff}
                  {snd === 'rain' && t.beginner.soundRain}
                  {snd === 'white_noise' && t.beginner.soundWhiteNoise}
                  {snd === 'library' && t.beginner.soundLibrary}
                  {snd === 'cafe' && t.beginner.soundCafe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Bottom: Simple Daily Tasks (7 cols) */}
        <div
          className="lg:col-span-7 p-6 rounded-3xl border shadow-xl flex flex-col justify-between"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  {t.beginner.tasksTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{t.beginner.tasksDesc}</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    taskFilter === 'all'
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {t.beginner.allTasks} ({totalTasksCount})
                </button>
                <button
                  onClick={() => setTaskFilter('active')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    taskFilter === 'active'
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {t.beginner.activeTasks}
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    taskFilter === 'completed'
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {t.beginner.completedTasks}
                </button>
              </div>
            </div>

            {/* Task Progress Bar */}
            {totalTasksCount > 0 && (
              <div className="mb-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">
                    {t.beginner.tasksProgress
                      .replace('{done}', String(completedTasksCount))
                      .replace('{total}', String(totalTasksCount))
                      .replace('{percent}', String(taskProgressPercent))}
                  </span>
                  <span className="font-bold text-emerald-400">{taskProgressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${taskProgressPercent}%`,
                      backgroundColor: theme.primaryAccent,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Quick Add Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t.beginner.taskPlaceholder}
                className="flex-1 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition shadow-inner placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl font-bold text-sm text-black transition shadow flex items-center gap-1 hover:opacity-90"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.beginner.addTask}</span>
              </button>
            </form>

            {/* Task Items List */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-800 text-neutral-500 text-xs">
                  {t.beginner.noTasks}
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`group p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isDone
                          ? 'bg-neutral-950/40 border-neutral-900 text-neutral-500'
                          : 'bg-neutral-900/80 border-neutral-800/90 text-white hover:border-neutral-700'
                      }`}
                    >
                      <button
                        onClick={() => {
                          toggleTaskStatus(task.id);
                          if (!isDone) soundscapeEngine.playTaskCompleteSound();
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 shrink-0 transition" />
                        )}
                        <span
                          className={`text-sm font-medium transition ${
                            isDone ? 'line-through text-neutral-500' : 'text-neutral-100'
                          }`}
                        >
                          {task.title}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
                        title={t.beginner.deleteTask}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Daily Habits + 1-Minute Breathing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habits Checklist (7 cols) */}
        <div
          className="lg:col-span-7 p-6 rounded-3xl border shadow-xl"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white tracking-tight">
                {t.beginner.habitsTitle}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">{t.beginner.habitsDesc}</p>
            </div>

            <button
              onClick={() => setShowAddHabit(!showAddHabit)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-300 hover:text-white transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.beginner.addHabit}</span>
            </button>
          </div>

          {/* Quick Add Habit Form */}
          {showAddHabit && (
            <form onSubmit={handleAddHabit} className="flex gap-2 mb-4 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder={t.beginner.habitNamePlaceholder}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-black"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                {t.save}
              </button>
            </form>
          )}

          {/* Habit Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits.slice(0, 4).map((habit) => {
              const todayKey = new Date().toISOString().split('T')[0];
              const isLoggedToday = Boolean(habit.logs[todayKey]);

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                    isLoggedToday
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-white leading-snug">
                      {habit.title}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400 shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{habit.streak}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                    <span className="text-[11px] text-neutral-400">
                      {habit.streak} {t.beginner.streakDays}
                    </span>

                    <button
                      onClick={() => {
                        if (isLoggedToday) {
                          uncheckHabit(habit.id);
                        } else {
                          checkInHabit(habit.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        isLoggedToday
                          ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isLoggedToday ? t.beginner.todayDone : t.beginner.markHabitDone}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Minute Relax & Calming Breathing (5 cols) */}
        <div
          className="lg:col-span-5 p-6 rounded-3xl border shadow-xl flex flex-col justify-between"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.borderSubtle }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-lg text-white tracking-tight">
                {t.beginner.breatheTitle}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              {t.beginner.breatheDesc}
            </p>

            {/* Visual Pulsing Breathing Circle */}
            <div className="flex flex-col items-center justify-center py-6">
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-1000 ${
                  isBreatheRunning
                    ? breathePhase === 'inhale'
                      ? 'scale-110 border-cyan-400 bg-cyan-950/40'
                      : breathePhase === 'hold'
                      ? 'scale-105 border-amber-400 bg-amber-950/40'
                      : 'scale-90 border-emerald-400 bg-emerald-950/40'
                    : 'border-neutral-800 bg-neutral-900/60'
                }`}
              >
                <span className="text-3xl font-black font-mono text-white">
                  {isBreatheRunning ? breatheSeconds : '4-7-8'}
                </span>
                <span className="text-xs text-neutral-300 font-bold mt-1">
                  {isBreatheRunning ? (
                    breathePhase === 'inhale'
                      ? t.breathing.inhale
                      : breathePhase === 'hold'
                      ? t.breathing.hold
                      : t.breathing.exhale
                  ) : (
                    t.breathing.relaxTip
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsBreatheRunning(!isBreatheRunning)}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
              isBreatheRunning
                ? 'bg-rose-900/80 border border-rose-700 text-rose-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>{isBreatheRunning ? t.breathing.stop : t.beginner.breatheBtn}</span>
          </button>
        </div>
      </div>

      {/* 5. Helpful Transition Banner to Advanced Mode */}
      <div
        className="p-5 rounded-3xl border border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-lg shrink-0">
            ⚡
          </span>
          <p className="text-xs text-neutral-400">
            {t.beginner.wantMoreTools}
          </p>
        </div>

        <button
          onClick={toggleUiMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700 shrink-0"
        >
          <span>{t.beginner.switchToAdvanced}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
