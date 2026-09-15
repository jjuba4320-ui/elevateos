import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  ArrowRight,
  FileText,
  ListTodo,
  Languages,
  HelpCircle,
  Wand2,
  CornerDownLeft,
} from 'lucide-react';
import { useNotionStore } from '../../../stores/useNotionStore';

export function NotionAIAssistantModal() {
  const {
    aiAssistantOpen,
    setAiAssistantOpen,
    activePageId,
    pages,
    addBlock,
    updateBlock,
    themeMode,
    language,
  } = useNotionStore();

  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!aiAssistantOpen) return null;

  const activePage = pages.find((p) => p.id === activePageId);

  const quickActions = [
    {
      id: 'summarize',
      icon: FileText,
      labelAr: 'تلخيص الصفحة الحالية',
      labelEn: 'Summarize this page',
      prompt: 'قم بتلخيص المحتوى الأساسي للصفحة الحالية في 3 نقاط محورية ومركزة.',
    },
    {
      id: 'tasks',
      icon: ListTodo,
      labelAr: 'استخراج قائمة مهام عملية',
      labelEn: 'Extract action items',
      prompt: 'استخرج قائمة مهام محددة وقابلة للتنفيذ فوراً بناءً على هذا المحتوى.',
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      labelAr: 'توليد أسئلة اختبار وبطاقات',
      labelEn: 'Generate study questions',
      prompt: 'اكتب 3 أسئلة نموذجية مع إجاباتها الدقيقة للمراجعة والتكرار المتباعد.',
    },
    {
      id: 'translate',
      icon: Languages,
      labelAr: 'ترجمة وصياغة ثنائية',
      labelEn: 'Translate & Polish',
      prompt: 'أعد صياغة المحتوى بلغة أكاديمية واضحة ومتقنة.',
    },
  ];

  const handleGenerate = (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim()) return;

    setIsGenerating(true);
    setResponse('');

    // Realistic intelligent simulated completion
    setTimeout(() => {
      let result = '';
      if (textToRun.includes('تلخيص') || textToRun.includes('Summarize')) {
        result = isArabic
          ? `📋 ملخص الذكاء الاصطناعي لمحتوى ${activePage?.title || 'الصفحة'}:\n\n1. التركيز على المفاهيم الجوهرية وتثبيت القواعد الأساسية للمادة.\n2. التدرج من الأمثلة البسيطة إلى حل التمارين المركبة ذات المعامل العالي.\n3. تخصيص فترات تكرار متباعد (Spaced Repetition) دورية لتفادي نسيان التفاصيل الدقيقة.`
          : `📋 AI Summary for ${activePage?.title || 'Page'}:\n\n1. Solidify fundamental formulas and definitions before tackling complex scenarios.\n2. Progress step-by-step from core proofs to past exam papers.\n3. Integrate spaced repetition intervals to prevent knowledge decay over time.`;
      } else if (textToRun.includes('مهام') || textToRun.includes('action')) {
        result = isArabic
          ? `✅ خطة العمل التنفيذية:\n\n• [ ] مراجعة القوانين الأساسية لمدة 25 دقيقة (جلسة بومودورو 1)\n• [ ] حل 3 مسائل نموذجية وتدوين أي أخطاء في سجل الهفوات\n• [ ] إنشاء 5 بطاقات استذكار سريعة للمصطلحات الجديدة`
          : `✅ Actionable Task Breakdown:\n\n• [ ] Review core theorem derivations (25m Pomodoro block)\n• [ ] Solve 3 past-year exam questions with error tracking\n• [ ] Generate 5 flashcards for newly learned definitions`;
      } else if (textToRun.includes('أسئلة') || textToRun.includes('questions')) {
        result = isArabic
          ? `❓ أسئلة اختبار للمراجعة الذاتية:\n\nس1: ما هي الشروط الواجب توفرها لتطبيق هذه الخاصية؟\nج1: استمرارية الدالة على المجال المغلق ورتابتها التامة.\n\nس2: كيف نميز بين الحالات الخاصة في التمارين؟\nج2: عن طريق قراءة المعطيات الأولية واستخراج الثوابت الفيزيائية/الرياضية بعناية.`
          : `❓ Self-Testing Quiz:\n\nQ1: What are the necessary conditions for applying this theorem?\nA1: Continuity and strict monotonicity over the bounded interval.\n\nQ2: How to identify edge cases in problem sets?\nA2: By inspecting boundary values and verifying dimensional units systematically.`;
      } else {
        result = isArabic
          ? `✨ تم التحليل والصياغة بنجاح:\n\nاستناداً إلى مساحة العمل الخاصة بك (${activePage?.title})، تم تحسين البنية الأكاديمية وإبراز النقاط ذات الأولوية P1. يمكنك إدراج هذا المحتوى مباشرة في صفحتك الحالية للاستفادة منه أثناء المذاكرة.`
          : `✨ Analysis & Synthesis Complete:\n\nBased on your workspace document (${activePage?.title}), key insights have been structured and prioritized. You can insert this text directly into your active page.`;
      }

      setResponse(result);
      setIsGenerating(false);
    }, 600);
  };

  const handleInsertIntoPage = () => {
    if (!response || !activePage) return;

    // Add as callout block
    const blockId = addBlock(activePage.id, 'callout');
    updateBlock(activePage.id, blockId, {
      content: response,
      icon: '✨',
    });

    setAiAssistantOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDark ? 'bg-[#1f1f1f] border-[#383838]' : 'bg-white border-neutral-200'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <span>Notion AI Copilot</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  v2.5
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isArabic ? 'مساعد الذكاء الاصطناعي المتكامل لصفحاتك ومهامك' : 'Integrated AI assistant for your pages and tasks'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiAssistantOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-6 pt-4 pb-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            {isArabic ? 'إجراءات سريعة بنقرة واحدة:' : 'Quick Actions:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.id}
                  onClick={() => {
                    setPrompt(qa.prompt);
                    handleGenerate(qa.prompt);
                  }}
                  className={`p-2.5 rounded-2xl border text-left rtl:text-right flex flex-col gap-1.5 transition ${
                    isDark
                      ? 'bg-[#181818] border-[#2e2e2e] hover:border-cyan-500/50 hover:bg-[#252525]'
                      : 'bg-neutral-50 border-neutral-200 hover:border-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-bold leading-snug">
                    {isArabic ? qa.labelAr : qa.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Prompt Box */}
        <div className="px-6 py-3">
          <div className="flex items-center gap-2 p-2.5 rounded-2xl border bg-black/30 border-neutral-700 focus-within:border-cyan-400 transition">
            <Wand2 className="w-4 h-4 text-cyan-400 shrink-0 ml-1 rtl:ml-0 rtl:mr-1" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              placeholder={
                isArabic
                  ? 'اطلب أي شيء من الذكاء الاصطناعي (أفكار، مراجعة، تدقيق)...'
                  : 'Ask AI anything about your studies or pages...'
              }
              className="w-full bg-transparent text-xs font-medium focus:outline-none placeholder-neutral-500"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs transition shrink-0"
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="px-6 pb-6 flex-1 min-h-[160px] max-h-[300px] overflow-y-auto">
          {isGenerating ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs text-neutral-400 animate-pulse">
                {isArabic ? 'جارٍ التوليد والتفكير بواسطة Notion AI...' : 'Generating thoughtful response...'}
              </span>
            </div>
          ) : response ? (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                isDark ? 'bg-[#181818] border-[#303030]' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              {response}

              {/* Response action buttons */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ النص' : 'Copy')}</span>
                </button>

                <button
                  onClick={handleInsertIntoPage}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-sm"
                >
                  <span>{isArabic ? 'إدراج في الصفحة ككتلة' : 'Insert into Page'}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 rtl:scale-x-[-1]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              {isArabic
                ? 'اختر أحد الإجراءات السريعة أعلاه أو اكتب طلبك وسيقوم Notion AI بمساعدتك فوراً.'
                : 'Choose a quick action above or type your prompt to generate assistance.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
