// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import {
  Monitor, Smartphone, Apple, CheckCircle, Star, Clock, ListTodo,
  KanbanSquare, StickyNote, ChevronRight, Zap, Shield, Target,
  ArrowRight, X, Play, BookOpen, Brain, Trophy, Users, Timer,
  GraduationCap, Sparkles, LayoutDashboard, FileText, BarChart3,
  Moon, Sun, Menu
} from "lucide-react";

/* ─── Design tokens (dark-first, exam-energy palette) ─── */
const C = {
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  surface0: "#0a0a14",
  surface1: "#12121f",
  surface2: "#1a1a2e",
  surface3: "#222236",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderHover: "rgba(99,102,241,0.4)",
  textPrimary: "#f1f0ff",
  textSecondary: "#a5a3c8",
  textMuted: "#6b698f",
};

/* ─── Glassmorphism card ─── */
function GlassCard({ children, style = {}, hover = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? "rgba(99,102,241,0.07)" : C.glass,
        border: `1px solid ${hov ? C.glassBorderHover : C.glassBorder}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-3px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Device selector button ─── */
function DeviceBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 20px",
        background: active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : C.glass,
        border: `1px solid ${active ? "transparent" : C.glassBorder}`,
        borderRadius: 40,
        color: active ? "#fff" : C.textSecondary,
        cursor: "pointer",
        fontSize: 14, fontWeight: 500,
        transition: "all 0.2s",
        boxShadow: active ? "0 0 20px rgba(99,102,241,0.4)" : "none",
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

/* ─── Step item ─── */
function Step({ num, icon: Icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
      <div style={{
        minWidth: 36, height: 36,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff",
        boxShadow: "0 0 12px rgba(99,102,241,0.4)",
      }}>{num}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 7 }}>
        <Icon size={16} color={C.indigoLight} />
        <span style={{ color: C.textPrimary, fontSize: 15, lineHeight: 1.5 }}>{text}</span>
      </div>
    </div>
  );
}

/* ─── Install guide for each device ─── */
const installGuides = {
  desktop: {
    title: "تثبيت على الكمبيوتر",
    subtitle: "PWA يعمل على Chrome, Edge, Safari",
    emoji: "💻",
    steps: [
      { icon: Monitor, text: 'افتح الرابط في متصفح Chrome أو Edge' },
      { icon: Star, text: 'ابحث عن أيقونة التثبيت في شريط العنوان (⊕ أو ▼)' },
      { icon: CheckCircle, text: 'اضغط "تثبيت" ثم وافق على الإذن' },
      { icon: Zap, text: 'سيظهر التطبيق على سطح المكتب جاهزاً للاستخدام' },
    ],
    color: "#6366f1",
    mockupBg: "from-indigo-900/30 to-violet-900/30",
  },
  android: {
    title: "تثبيت على أندرويد",
    subtitle: "يعمل على Chrome للأندرويد",
    emoji: "📱",
    steps: [
      { icon: Smartphone, text: 'افتح الموقع في تطبيق Chrome' },
      { icon: Menu, text: 'اضغط على القائمة (⋮) في أعلى اليمين' },
      { icon: Target, text: 'اختر "إضافة إلى الشاشة الرئيسية"' },
      { icon: Trophy, text: 'اضغط "إضافة" وستجد التطبيق في هاتفك فوراً' },
    ],
    color: "#06b6d4",
    mockupBg: "from-cyan-900/30 to-blue-900/30",
  },
  iphone: {
    title: "تثبيت على آيفون",
    subtitle: "Safari مطلوب على iOS",
    emoji: "🍏",
    steps: [
      { icon: Apple, text: 'افتح الموقع في متصفح Safari فقط' },
      { icon: ArrowRight, text: 'اضغط زر المشاركة (□↑) أسفل الشاشة' },
      { icon: BookOpen, text: 'اختر "إضافة إلى الشاشة الرئيسية"' },
      { icon: Sparkles, text: 'اضغط "إضافة" — أيقونة التطبيق تظهر فوراً' },
    ],
    color: "#a855f7",
    mockupBg: "from-purple-900/30 to-pink-900/30",
  },
};

/* ─── Phone mockup SVG ─── */
function PhoneMockup({ color }) {
  return (
    <svg viewBox="0 0 200 360" style={{ width: "100%", maxWidth: 200, margin: "0 auto", display: "block" }}>
      <rect x="10" y="5" width="180" height="350" rx="28" fill={C.surface2} stroke={C.glassBorder} strokeWidth="1.5" />
      <rect x="20" y="20" width="160" height="320" rx="20" fill={C.surface0} />
      <rect x="75" y="10" width="50" height="8" rx="4" fill={C.surface3} />
      <rect x="30" y="40" width="140" height="70" rx="10" fill={color} opacity="0.2" />
      <rect x="30" y="40" width="140" height="70" rx="10" stroke={color} strokeWidth="0.5" fill="none" />
      <text x="100" y="82" textAnchor="middle" fill={color} fontSize="11" fontFamily="system-ui" fontWeight="600">MadakOS</text>
      <text x="100" y="96" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="system-ui">منظم الوقت الذكي</text>
      {[130, 155, 180, 205, 230, 255, 280, 300].map((y, i) => (
        <rect key={i} x="30" y={y} width={60 + (i % 3) * 40} height="12" rx="6" fill={C.surface3} opacity="0.8" />
      ))}
      <rect x="30" y="290" width="140" height="28" rx="14"
        fill={color} opacity="0.9" />
      <text x="100" y="309" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" fontWeight="600">فتح التطبيق</text>
    </svg>
  );
}

/* ─── Desktop mockup SVG ─── */
function DesktopMockup({ color }) {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", maxWidth: 320, margin: "0 auto", display: "block" }}>
      <rect x="2" y="2" width="316" height="196" rx="10" fill={C.surface2} stroke={C.glassBorder} strokeWidth="1" />
      <rect x="2" y="2" width="316" height="20" rx="10" fill={C.surface3} />
      <rect x="316" y="10" width="2" height="2" fill={C.surface3} />
      {[10, 18, 26].map((x, i) => (
        <circle key={i} cx={x} cy={12} r="3" fill={["#ff5f57", "#febc2e", "#28c840"][i]} />
      ))}
      <rect x="60" y="5" width="200" height="14" rx="7" fill={C.surface2} />
      <text x="160" y="15" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="system-ui">madakos.app</text>
      <rect x="10" y="28" width="80" height="164" rx="6" fill={C.surface3} opacity="0.6" />
      {["📋 المهام", "⏱ مؤقت", "📌 كانبان", "📝 ملاحظات", "📊 إحصاء"].map((label, i) => (
        <g key={i}>
          <rect x="14" y={36 + i * 30} width="72" height="22" rx="6"
            fill={i === 0 ? color : "transparent"} opacity={i === 0 ? 0.3 : 1} />
          <text x="50" y={51 + i * 30} textAnchor="middle"
            fill={i === 0 ? color : C.textMuted} fontSize="7.5" fontFamily="system-ui">{label}</text>
        </g>
      ))}
      <rect x="100" y="28" width="212" height="164" rx="6" fill={C.surface0} opacity="0.8" />
      <text x="206" y="95" textAnchor="middle" fill={color} fontSize="14" fontFamily="system-ui" fontWeight="700">MadakOS</text>
      <text x="206" y="110" textAnchor="middle" fill={C.textSecondary} fontSize="7" fontFamily="system-ui">جاهز للتفوق في البكالوريا</text>
      {[130, 145, 160].map((y, i) => (
        <rect key={i} x="130" y={y} width={50 + i * 20} height="8" rx="4" fill={C.surface3} />
      ))}
    </svg>
  );
}

/* ─── Reviews data ─── */
const reviews = [
  { name: "أمينة بن علي", grade: "بكالوريا علوم — 18.5/20", text: "MadakOS غيّر طريقة مذاكرتي كلياً. مؤقت البومودورو ساعدني أركز ساعتين متواصلتين بدون تشتت.", avatar: "أ" },
  { name: "كريم زروقي", grade: "بكالوريا رياضيات — 17/20", text: "اللوحة الكانبانية أروع شيء. صنّفت كل مواد البكالوريا وتتبعت تقدمي يوم بيوم حتى الامتحان.", avatar: "ك" },
  { name: "سارة مزيان", grade: "بكالوريا أدب — 16/20", text: "الملاحظات المرتبة بالمواد وقّتلي وقت كثير. كل شيء في مكان واحد، ما بقيتش نلوّح في الدفاتر.", avatar: "س" },
  { name: "يوسف تلمساني", grade: "بكالوريا تقني رياضي — 19/20", text: "الإحصائيات اليومية خلّتني نشوف وين نضيّع الوقت. راجعت المنهج كله في أسبوع وأنا منظم.", avatar: "ي" },
  { name: "نور الهدى قاسم", grade: "بكالوريا علوم تجريبية — 15/20", text: "أحسن تطبيق جربته. الواجهة بسيطة، ما يحتاجش شرح، وشغلت من أول يوم بدون أي مشاكل.", avatar: "ن" },
  { name: "إبراهيم بوعنان", grade: "بكالوريا تسيير — 16.5/20", text: "نجحت بفضل التنظيم. MadakOS علّمني أقسّم المنهج لأجزاء صغيرة وأحققها يوم بيوم.", avatar: "إ" },
];

/* ─── Features data ─── */
const features = [
  { icon: ListTodo, title: "قائمة المهام", desc: "رتّب مهامك الدراسية بالأولوية والمادة والتاريخ. لا تنسى أي درس قبل الامتحان.", color: "#6366f1" },
  { icon: KanbanSquare, title: "لوحة كانبان", desc: "اسحب وأفلت مواضيعك من 'لم أبدأ' إلى 'أتقنت'. شوف تقدّمك البصري كل يوم.", color: "#06b6d4" },
  { icon: Timer, title: "مؤقت بومودورو", desc: "25 دقيقة تركيز ثم 5 دقائق راحة. الأسلوب العلمي المثبت للحفظ والمذاكرة.", color: "#f59e0b" },
  { icon: StickyNote, title: "الملاحظات الذكية", desc: "دوّن ملخصاتك منظمة بالمواد. ارجع لها سريعاً وقت المراجعة الأخيرة.", color: "#10b981" },
  { icon: BarChart3, title: "إحصاء اليومي", desc: "شوف كم ساعة ذاكرت، كم مهمة أنجزت، وكيف يتطور أداؤك أسبوع بأسبوع.", color: "#a855f7" },
  { icon: Brain, title: "تنظيم المراجعة", desc: "خطط لمراجعة المنهج الكاملة وقسّمها على أسابيع ما قبل البكالوريا.", color: "#f43f5e" },
];

/* ─── MAIN LANDING PAGE ─── */
export default function LandingPage({ navigate }) {
  const [device, setDevice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const installRef = useRef(null);

  const openDevice = (d) => {
    setDevice(d);
    setModalOpen(true);
    setTimeout(() => installRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const guide = device ? installGuides[device] : null;

  return (
    <div style={{
      background: C.surface0, minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      direction: "rtl", color: C.textPrimary,
      overflowX: "hidden",
    }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: "fixed", top: -200, right: -200,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -150, left: -150,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 24px",
        background: "rgba(10,10,20,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.glassBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
            <span style={{ color: C.indigoLight }}>Madak</span>
            <span style={{ color: C.textPrimary }}>OS</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a onClick={() => installRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ color: C.textSecondary, fontSize: 14, cursor: "pointer", textDecoration: "none" }}>
            تثبيت التطبيق
          </a>
          <button onClick={() => navigate("/app")} style={{
            padding: "8px 20px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", borderRadius: 30,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 0 16px rgba(99,102,241,0.35)",
          }}>
            فتح التطبيق
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "100px 24px 80px",
        textAlign: "center",
        maxWidth: 900, margin: "0 auto",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 30, padding: "6px 16px",
          marginBottom: 28,
        }}>
          <Sparkles size={13} color={C.indigoLight} />
          <span style={{ color: C.indigoLight, fontSize: 13, fontWeight: 500 }}>
            المنصة الأولى لطلبة البكالوريا في الجزائر
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 62px)",
          fontWeight: 900, lineHeight: 1.18,
          margin: "0 0 24px",
          letterSpacing: "-1px",
        }}>
          <span style={{ color: C.textPrimary }}>نظّم وقتك واحكم </span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            البكالوريا بجدارة
          </span>
        </h1>

        <p style={{
          color: C.textSecondary, fontSize: "clamp(16px, 2.5vw, 19px)",
          lineHeight: 1.8, maxWidth: 580, margin: "0 auto 44px",
        }}>
          منصتك الذكية لتنظيم الوقت، تتبع المهام، والمراجعة الفعّالة.
          الطلاب الذين يستخدمونها يحققون نتائج أفضل بـ 40% من المتوسط.
        </p>

        {/* Primary CTA */}
        <button onClick={() => navigate("/app")} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "16px 40px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          border: "none", borderRadius: 50,
          color: "#fff", fontSize: 17, fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 0 40px rgba(99,102,241,0.45), 0 8px 24px rgba(99,102,241,0.3)",
          transition: "transform 0.15s, box-shadow 0.15s",
          marginBottom: 16,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.6), 0 12px 32px rgba(99,102,241,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.45), 0 8px 24px rgba(99,102,241,0.3)"; }}
        >
          <Zap size={19} />
          فتح التطبيق مباشرةً
        </button>
        <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>مجاني 100% · بدون تسجيل · يعمل على جميع الأجهزة</p>

        {/* Device selector */}
        <div style={{ marginTop: 40 }}>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 14 }}>
            📲 ثبّت على جهازك للوصول السريع
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <DeviceBtn icon={Monitor} label="كمبيوتر" active={device === "desktop"} onClick={() => openDevice("desktop")} />
            <DeviceBtn icon={Smartphone} label="أندرويد" active={device === "android"} onClick={() => openDevice("android")} />
            <DeviceBtn icon={Apple} label="آيفون" active={device === "iphone"} onClick={() => openDevice("iphone")} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 0, justifyContent: "center",
          marginTop: 60, flexWrap: "wrap",
        }}>
          {[
            { num: "+12,000", label: "طالب نشط" },
            { num: "98%", label: "رضا المستخدمين" },
            { num: "4.9★", label: "تقييم الطلاب" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "20px 36px",
              borderRight: i < 2 ? `1px solid ${C.glassBorder}` : "none",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 28, fontWeight: 900,
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.num}</div>
              <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INSTALL GUIDE (conditionally expanded) ── */}
      <section ref={installRef} style={{
        position: "relative", zIndex: 1,
        padding: "40px 24px 80px",
        maxWidth: 900, margin: "0 auto",
      }}>
        {modalOpen && guide && (
          <GlassCard hover={false} style={{ padding: "40px 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 28 }}>{guide.emoji}</span>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.textPrimary }}>{guide.title}</h2>
                </div>
                <p style={{ margin: 0, color: C.textSecondary, fontSize: 14 }}>{guide.subtitle}</p>
              </div>
              <button onClick={() => { setModalOpen(false); setDevice(null); }} style={{
                background: C.glass, border: `1px solid ${C.glassBorder}`,
                borderRadius: 8, padding: 8, cursor: "pointer", color: C.textSecondary,
                display: "flex", alignItems: "center",
              }}>
                <X size={16} />
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40, alignItems: "center",
            }}>
              {/* Steps */}
              <div>
                {guide.steps.map((s, i) => (
                  <Step key={i} num={i + 1} icon={s.icon} text={s.text} />
                ))}
                <button onClick={() => navigate("/app")} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", marginTop: 8,
                  background: `linear-gradient(135deg, ${guide.color}, ${guide.color}cc)`,
                  border: "none", borderRadius: 30,
                  color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 0 24px ${guide.color}44`,
                }}>
                  <Play size={15} />
                  فتح في المتصفح الآن
                </button>
              </div>

              {/* Mockup */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                {device === "desktop"
                  ? <DesktopMockup color={guide.color} />
                  : <PhoneMockup color={guide.color} />}
              </div>
            </div>
          </GlassCard>
        )}

        {!modalOpen && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <GlassCard hover={false} style={{ padding: "32px", display: "inline-block" }}>
              <p style={{ color: C.textSecondary, margin: 0 }}>
                اختر جهازك أعلاه لعرض دليل التثبيت التفصيلي 👆
              </p>
            </GlassCard>
          </div>
        )}
      </section>

      {/* ── FEATURES SECTION ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "60px 24px 80px",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: C.indigoLight, fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: "0.08em" }}>
            أدوات المنصة
          </p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, margin: "0 0 12px" }}>
            كل ما يحتاجه الطالب المتفوق
          </h2>
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: "0 auto" }}>
            ستة أدوات مدروسة علمياً، مصمّمة خصيصاً لطالب البكالوريا الجزائري
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {features.map((f, i) => (
            <GlassCard key={i} style={{ padding: "28px 28px" }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `${f.color}1a`,
                border: `1px solid ${f.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18,
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: C.textPrimary }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, color: C.textSecondary, fontSize: 14, lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "60px 24px 80px",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            ⭐ آراء الطلاب
          </p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, margin: "0 0 12px" }}>
            قالوا عن MadakOS
          </h2>
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: "0 auto" }}>
            طلاب حققوا نتائج استثنائية يشاركون تجربتهم الحقيقية
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: 20,
        }}>
          {reviews.map((r, i) => (
            <GlassCard key={i} style={{ padding: "24px 24px" }}>
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Review text */}
              <p style={{
                color: C.textSecondary, fontSize: 14, lineHeight: 1.75,
                margin: "0 0 20px", fontStyle: "italic",
              }}>
                "{r.text}"
              </p>

              {/* Reviewer */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${C.glassBorder}`, paddingTop: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${["#6366f1", "#06b6d4", "#a855f7", "#f59e0b", "#10b981", "#f43f5e"][i]}, ${["#8b5cf6", "#0284c7", "#ec4899", "#ef4444", "#059669", "#e11d48"][i]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{r.name}</div>
                  <div style={{ color: C.textMuted, fontSize: 12 }}>{r.grade}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "60px 24px 100px",
        maxWidth: 800, margin: "0 auto", textAlign: "center",
      }}>
        <GlassCard hover={false} style={{
          padding: "60px 40px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.05) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 16px" }}>
            ابدأ رحلة التفوق اليوم
          </h2>
          <p style={{ color: C.textSecondary, fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
            كل يوم تنظيم = يوم أقل قلقاً في الامتحان.
            انضم لآلاف الطلاب الذين اختاروا التميز.
          </p>
          <button onClick={() => navigate("/app")} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 44px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            border: "none", borderRadius: 50,
            color: "#fff", fontSize: 17, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 40px rgba(99,102,241,0.4)",
          }}>
            <Trophy size={20} />
            انطلق الآن — مجاناً
          </button>
        </GlassCard>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.glassBorder}`,
        padding: "28px 24px",
        textAlign: "center",
        color: C.textMuted, fontSize: 13,
        position: "relative", zIndex: 1,
      }}>
        <span style={{ color: C.indigoLight, fontWeight: 700 }}>MadakOS</span>
        {" · "}صُنع بـ ❤️ لطلاب البكالوريا الجزائريين
        {" · "}
        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/app")}>
          فتح التطبيق
        </span>
      </footer>
    </div>
  );
}
