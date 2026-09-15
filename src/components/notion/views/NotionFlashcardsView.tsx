import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Plus,
  Check,
  Brain,
  HelpCircle,
  Eye,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
} from 'lucide-react';
import { useNotionStore } from '../../../stores/useNotionStore';

interface Flashcard {
  id: string;
  deck: string;
  front: string;
  back: string;
  hint?: string;
  intervalDays: number;
  easeFactor: number;
  reviews: number;
}

const INITIAL_DECKS = [
  {
    id: 'deck_math',
    nameAr: 'قوانين ونظريات الرياضيات (بكالوريا)',
    nameEn: 'BAC Mathematics Formulas & Theorems',
    icon: '📐',
  },
  {
    id: 'deck_physics',
    nameAr: 'علاقات وقوانين الفيزياء والكيمياء',
    nameEn: 'Physics & Chemistry Formulas',
    icon: '⚡',
  },
  {
    id: 'deck_philosophy',
    nameAr: 'أقوال ومفاهيم الفلسفة الكبرى',
    nameEn: 'Philosophy Key Quotes & Concepts',
    icon: '🏛️',
  },
];

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'c1',
    deck: 'deck_math',
    front: 'ما هي نهاية lim (ln(x)/x) عندما يؤول x إلى +∞ ؟',
    back: '0 (نهاية شهيرة للتزايد المقارن)',
    hint: 'الدالة الأسية واللوغاريتمية',
    intervalDays: 3,
    easeFactor: 2.5,
    reviews: 4,
  },
  {
    id: 'c2',
    deck: 'deck_math',
    front: 'ما هو حل المعادلة التفاضلية y\' = ay + b ؟',
    back: 'y(x) = C·e^(ax) - b/a  (حيث C عدد حقيقي ثابت)',
    hint: 'تذكر الحل الخاص والحل المتجانس',
    intervalDays: 5,
    easeFactor: 2.6,
    reviews: 6,
  },
  {
    id: 'c3',
    deck: 'deck_physics',
    front: 'ما هي المعادلة التفاضلية لتوتر المكثفة uc(t) أثناء الشحن في دارة RC ؟',
    back: 'uc(t) + RC·(duc/dt) = E',
    hint: 'قانون جمع التوترات',
    intervalDays: 2,
    easeFactor: 2.3,
    reviews: 3,
  },
  {
    id: 'c4',
    deck: 'deck_philosophy',
    front: 'من القائل: "إنني أشك، إذن أنا أفكر، إذن أنا موجود" ؟',
    back: 'رينيه ديكارت (مؤسس العقلانية الحديثة)',
    hint: 'الكوجيتو الديكارتي',
    intervalDays: 7,
    easeFactor: 2.8,
    reviews: 8,
  },
];

export function NotionFlashcardsView() {
  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS);
  const [selectedDeck, setSelectedDeck] = useState('deck_math');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Card state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newHint, setNewHint] = useState('');

  const deckCards = cards.filter((c) => c.deck === selectedDeck);
  const currentCard = deckCards[currentIndex] || deckCards[0];

  const handleRate = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < deckCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: 'c_' + Date.now(),
      deck: selectedDeck,
      front: newFront.trim(),
      back: newBack.trim(),
      hint: newHint.trim(),
      intervalDays: 1,
      easeFactor: 2.5,
      reviews: 0,
    };

    setCards([...cards, newCard]);
    setNewFront('');
    setNewBack('');
    setNewHint('');
    setShowAddModal(false);
  };

  return (
    <div
      className={`flex-1 overflow-y-auto min-h-screen p-6 sm:p-10 transition-colors ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-4xl sm:text-5xl mb-3">🎴</div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {isArabic ? 'بطاقات التكرار المتباعد (Anki & Quizlet)' : 'Spaced Repetition Flashcards (Anki & Quizlet)'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {isArabic
              ? 'احفظ القوانين، التعريفات، والمصطلحات بكفاءة علمية وفق خوارزمية SM-2 مع تقييمات السهولة ومتابعة التقدم.'
              : 'Master formulas, definitions, and concepts scientifically using SM-2 spaced repetition algorithms.'}
          </p>
        </div>

        {/* Deck Selector Tabs & Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-8 border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            {INITIAL_DECKS.map((deck) => {
              const isSelected = deck.id === selectedDeck;
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck.id);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setShowHint(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-md'
                      : isDark
                      ? 'bg-[#222] text-neutral-400 hover:text-white border border-[#333]'
                      : 'bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200'
                  }`}
                >
                  <span className="text-base">{deck.icon}</span>
                  <span>{isArabic ? deck.nameAr : deck.nameEn}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/20">
                    {cards.filter((c) => c.deck === deck.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إضافة بطاقة' : 'Add Card'}</span>
          </button>
        </div>

        {/* Study Arena */}
        {deckCards.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-3xl">
            {isArabic ? 'هذه الحزمة لا تحتوي على بطاقات حالياً. أضف أول بطاقة الآن!' : 'This deck is currently empty. Add your first card!'}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>
                {isArabic ? 'البطاقة' : 'Card'} {currentIndex + 1} {isArabic ? 'من' : 'of'} {deckCards.length}
              </span>
              <span className="font-mono">
                {Math.round(((currentIndex + 1) / deckCards.length) * 100)}% {isArabic ? 'مكتمل' : 'Completed'}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / deckCards.length) * 100}%` }}
              />
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`min-h-[280px] sm:min-h-[340px] rounded-3xl border p-8 sm:p-12 flex flex-col justify-between cursor-pointer shadow-2xl transition-all duration-300 transform hover:scale-[1.01] ${
                isDark
                  ? isFlipped
                    ? 'bg-[#1b2528] border-cyan-500/40'
                    : 'bg-[#202020] border-[#383838]'
                  : isFlipped
                  ? 'bg-cyan-50 border-cyan-300'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider text-cyan-400">
                  <Brain className="w-3.5 h-3.5" />
                  <span>{isFlipped ? (isArabic ? 'الإجابة والحل' : 'Answer') : (isArabic ? 'السؤال والمفهوم' : 'Question')}</span>
                </span>
                <span className="text-[11px] opacity-70">
                  {isArabic ? 'انقر لقلب البطاقة 🔄' : 'Click to flip card 🔄'}
                </span>
              </div>

              {/* Card Content */}
              <div className="my-auto py-6 text-center">
                <p className="text-xl sm:text-2xl font-black leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>

                {!isFlipped && currentCard.hint && (
                  <div className="mt-4">
                    {showHint ? (
                      <p className="text-xs text-amber-400 font-medium">
                        💡 {isArabic ? 'تلميح:' : 'Hint:'} {currentCard.hint}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-[11px] text-neutral-500 hover:text-amber-300 underline"
                      >
                        {isArabic ? 'إظهار التلميح المساعد' : 'Show hint'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-[11px] text-neutral-500">
                {isFlipped
                  ? (isArabic ? 'حدد مدى تذكرك للإجابة أدناه لتحديد موعد المراجعة القادمة' : 'Rate your recall to schedule next review')
                  : (isArabic ? 'فكر في الإجابة ثم انقر للمعاينة' : 'Think of the answer, then click to check')}
              </div>
            </div>

            {/* Anki SM-2 Evaluation Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
                <button
                  onClick={() => handleRate('again')}
                  className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 transition flex flex-col items-center"
                >
                  <span className="font-bold text-xs">{isArabic ? 'إعادة (نسيت)' : 'Again (Forgot)'}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">&lt; 10 min</span>
                </button>

                <button
                  onClick={() => handleRate('hard')}
                  className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition flex flex-col items-center"
                >
                  <span className="font-bold text-xs">{isArabic ? 'صعب' : 'Hard'}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">1 day</span>
                </button>

                <button
                  onClick={() => handleRate('good')}
                  className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition flex flex-col items-center"
                >
                  <span className="font-bold text-xs">{isArabic ? 'جيد' : 'Good'}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">3 days</span>
                </button>

                <button
                  onClick={() => handleRate('easy')}
                  className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition flex flex-col items-center"
                >
                  <span className="font-bold text-xs">{isArabic ? 'سهل جداً' : 'Easy'}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">7 days</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isArabic ? 'إظهار الحل والإجابة (Space)' : 'Show Answer (Space)'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Card Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-neutral-200'}`}>
              <h2 className="text-lg font-black mb-4">{isArabic ? 'إضافة بطاقة تعليمية جديدة' : 'Add Flashcard'}</h2>
              <form onSubmit={handleAddCard} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'وجه البطاقة (السؤال / المصطلح)' : 'Front (Question)'}</label>
                  <textarea
                    required
                    rows={2}
                    value={newFront}
                    onChange={(e) => setNewFront(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                    placeholder={isArabic ? 'مثال: ما هو قانون التناقص الإشعاعي؟' : 'e.g. Formula for radioactive decay'}
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'ظهر البطاقة (الإجابة / القانون)' : 'Back (Answer)'}</label>
                  <textarea
                    required
                    rows={3}
                    value={newBack}
                    onChange={(e) => setNewBack(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                    placeholder={isArabic ? 'N(t) = N0 · e^(-λt)' : 'N(t) = N0 · e^(-λt)'}
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">{isArabic ? 'تلميح مساعد (اختياري)' : 'Hint (Optional)'}</label>
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-black/30 border-neutral-700"
                  />
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
                    {isArabic ? 'إضافة البطاقة' : 'Add Card'}
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
