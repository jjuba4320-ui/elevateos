import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Filter,
} from 'lucide-react';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useNotionStore } from '../../../stores/useNotionStore';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'task' | 'exam' | 'study' | 'habit';
  color: string;
}

export function NotionCalendarView() {
  const { tasks } = useTaskStore();
  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedDay || new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');
  const [eventCategory, setEventCategory] = useState<'task' | 'exam' | 'study' | 'habit'>('study');

  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: isArabic ? 'مراجعة شاملة للفيزياء' : 'Physics Comprehensive Review',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      category: 'study',
      color: '#06b6d4',
    },
    {
      id: 'e2',
      title: isArabic ? 'محاكاة اختبار رياضيات BAC' : 'BAC Math Mock Exam',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '08:30',
      category: 'exam',
      color: '#ef4444',
    },
  ]);

  // Combine tasks that have due dates with custom events
  const allEvents: CalendarEvent[] = [
    ...customEvents,
    ...tasks
      .filter((t) => t.dueDate)
      .map((t) => ({
        id: 'task_' + t.id,
        title: t.title,
        date: t.dueDate!,
        time: t.estimatedMinutes ? `${t.estimatedMinutes}m` : undefined,
        category: 'task' as const,
        color: t.priority === 'P1' ? '#f43f5e' : t.priority === 'P2' ? '#f59e0b' : '#3b82f6',
      })),
  ];

  // Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().toISOString().split('T')[0]);
  };

  // Days array
  const calendarDays: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dayNum: d, dateStr, isCurrentMonth: false });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: true });
  }

  // Next month padding to fill 35 or 42 grid cells
  const remaining = 35 - calendarDays.length;
  if (remaining > 0) {
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: false });
    }
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: 'e_' + Date.now(),
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      category: eventCategory,
      color:
        eventCategory === 'exam'
          ? '#ef4444'
          : eventCategory === 'study'
          ? '#06b6d4'
          : '#10b981',
    };

    setCustomEvents([...customEvents, newEv]);
    setEventTitle('');
    setShowAddModal(false);
  };

  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const selectedDayEvents = allEvents.filter((e) => e.date === selectedDay);

  return (
    <div
      className={`flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 transition-colors ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-4xl sm:text-5xl mb-2">📅</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
              {isArabic ? 'التقويم والجدولة (Notion Calendar)' : 'Calendar & Time Blocking (Notion Calendar)'}
            </h1>
            <p className="text-xs text-neutral-400">
              {isArabic
                ? 'جدول جلسات المذاكرة، مواعيد الامتحانات، والمهام اليومية مع إمكانية التزامن والتخطيط الزمني.'
                : 'Schedule study sessions, exam deadlines, and daily tasks with time blocking.'}
            </p>
          </div>

          {/* Month Navigator & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToToday}
              className="px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-bold transition"
            >
              {isArabic ? 'اليوم' : 'Today'}
            </button>

            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <span className="px-3 text-xs font-bold min-w-[130px] text-center">
                {isArabic ? `${monthNamesAr[month]} ${year}` : `${monthNamesEn[month]} ${year}`}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'موعد جديد' : 'New Event'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid + Side Day Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 1. Calendar Month Grid (3 cols) */}
          <div
            className={`lg:col-span-3 rounded-3xl border p-4 sm:p-6 shadow-xl ${
              isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-3 text-xs font-black text-neutral-400">
              {(isArabic ? dayNamesAr : dayNamesEn).map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((cd, index) => {
                const dayEvents = allEvents.filter((e) => e.date === cd.dateStr);
                const isSelected = selectedDay === cd.dateStr;
                const isToday = cd.dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDay(cd.dateStr)}
                    className={`min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-md'
                        : isDark
                        ? cd.isCurrentMonth
                          ? 'bg-[#1a1a1a] border-[#2d2d2d] hover:border-neutral-600'
                          : 'bg-[#151515] border-[#222] opacity-40'
                        : cd.isCurrentMonth
                        ? 'bg-white border-neutral-200 hover:border-neutral-300'
                        : 'bg-neutral-100 border-neutral-200 opacity-40'
                    }`}
                  >
                    {/* Day number & today marker */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-cyan-500 text-black font-black'
                            : 'text-neutral-400'
                        }`}
                      >
                        {cd.dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>

                    {/* Event pills on day */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold truncate text-white border border-black/20"
                          style={{ backgroundColor: ev.color }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-neutral-400 font-bold px-1">
                          +{dayEvents.length - 2} {isArabic ? 'المزيد' : 'more'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Selected Day Timeline & Details (1 col) */}
          <div
            className={`rounded-3xl border p-5 shadow-xl flex flex-col ${
              isDark ? 'bg-[#202020] border-[#333]' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                  {isArabic ? 'جدول اليوم المحدد' : 'Selected Day'}
                </span>
                <div className="text-sm font-black text-white">{selectedDay || 'اليوم'}</div>
              </div>
              <button
                onClick={() => {
                  setEventDate(selectedDay || new Date().toISOString().split('T')[0]);
                  setShowAddModal(true);
                }}
                className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {selectedDayEvents.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                  {isArabic ? 'لا توجد مواعيد أو مهام مجدولة لهذا اليوم.' : 'No events scheduled for this day.'}
                </div>
              ) : (
                selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-[#181818] border-[#2e2e2e]' : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: ev.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{ev.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                          {ev.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{ev.time}</span>
                            </span>
                          )}
                          <span className="capitalize">{ev.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'}`}>
              <h2 className="text-lg font-black mb-4">{isArabic ? 'إضافة موعد أو جلسة دراسية' : 'Schedule Event'}</h2>
              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'عنوان الموعد أو الحدث' : 'Title'}</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700 focus:outline-none focus:border-cyan-400"
                    placeholder={isArabic ? 'مثال: حصة مراجعة علوم فيزياء' : 'e.g. Physics study block'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'التاريخ' : 'Date'}</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'التوقيت' : 'Time'}</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'النوع' : 'Category'}</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  >
                    <option value="study">{isArabic ? 'جلسة دراسية ومراجعة' : 'Study Session'}</option>
                    <option value="exam">{isArabic ? 'امتحان أو اختبار' : 'Exam Deadline'}</option>
                    <option value="task">{isArabic ? 'مهمة عملية' : 'Action Task'}</option>
                    <option value="habit">{isArabic ? 'عادة يومية' : 'Habit Routine'}</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                  >
                    {isArabic ? 'حفظ الموعد' : 'Save Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
