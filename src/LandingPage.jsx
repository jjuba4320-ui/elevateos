// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Monitor, Smartphone, Apple, CheckCircle, Star, Clock, ListTodo,
  KanbanSquare, StickyNote, ChevronRight, Zap, Shield, Target,
  ArrowRight, X, Play, BookOpen, Brain, Trophy, Users, Timer,
  GraduationCap, Sparkles, LayoutDashboard, FileText, BarChart3,
  Moon, Sun, Menu
} from "lucide-react";

/* ─── Design tokens ─── */
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
  },
};

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
      <rect x="30" y="290" width="140" height="28" rx="14" fill={color} opacity="0.9" />
      <text x="100" y="309" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" fontWeight="600">فتح التطبيق</text>
    </svg>
  );
}

function DesktopMockup({ color }) {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", maxWidth: 320, margin: "0 auto", display: "block" }}>
      <rect x="2" y="2" width="316" height="196" rx="10" fill={C.surface2} stroke={C.glassBorder} strokeWidth="1" />
      <rect x="2" y="2" width="316" height="20" rx="10" fill={C.surface3} />
      {[10, 18, 26].map((x, i) => (
        <circle key={i} cx={x} cy={12} r="3" fill={["#ff5f57", "#febc2e", "#28c840"][i]} />
      ))}
      <rect x="60" y="5" width="200" height="14" rx="7" fill={C.surface2} />
      <text x="160" y="15" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="system-ui">madakos.app</text>
      <rect x="10" y="28" width="80" height="164" rx="6" fill={C.surface3} opacity="0.6" />
      {["📋 المهام", "⏱ مؤقت", "📌 كانبان", "📝 ملاحظات", "📊 إحصاء"].map((label, i) => (
        <g key={i}>
          <rect x="14" y={36 + i * 30} width="72" height="22" rx="6" fill={i === 0 ? color : "transparent"} opacity={i === 0 ? 0.3 : 1} />
          <text x="50" y={51 + i * 30} textAnchor="middle" fill={i === 0 ? color : C.textMuted} fontSize="7.5" fontFamily="system-ui">{label}</text>
        </g>
      ))}
      <rect x="100" y="28" width="212" height="164" rx="6" fill={C.surface0} opacity="0.8" />
      <text x="206" y="95" textAnchor="middle" fill={color} fontSize="14" fontFamily="system-ui" fontWeight="700">MadakOS</text>
      <text x="206" y="110" textAnchor="middle" fill={C.textSecondary} fontSize="7" fontFamily="system-ui">جاهز للتفوق في البكالوريا</text>
    </svg>
  );
}

const reviews = [
  { name: "أمينة بن علي", grade: "بكالوريا علوم — 18.5/20", text: "MadakOS غيّر طريقة مذاكرتي كلياً. مؤقت البومودورو ساعدني أركز ساعتين متواصلتين بدون تشتت.", avatar: "أ" },
  { name: "كريم زروقي", grade: "بكالوريا رياضيات — 17/20", text: "اللوحة الكانبانية أروع شيء. صنّفت كل مواد البكالوريا وتتبعت تقدمي يوم بيوم حتى الامتحان.", avatar: "ك" },
  { name: "سارة مزيان", grade: "بكالوريا أدب — 16/20", text: "الملاحظات المرتبة بالمواد وقّتلي وقت كثير. كل شيء في مكان واحد، ما بقيتش نلوّح في الدفاتر.", avatar: "س" },
];

const features = [
  { icon: ListTodo, title: "قائمة المهام", desc: "رتّب مهامك الدراسية بالأولوية والمادة والتاريخ. لا تنسى أي درس قبل الامتحان.", color: "#6366f1" },
  { icon: KanbanSquare, title: "لوحة كانبان", desc: "اسحب وأفلت مواضيعك من 'لم أبدأ' إلى 'أتقنت'. شوف تقدّمك البصري كل يوم.", color: "#06b6d4" },
  { icon: Timer, title: "مؤقت بومودورو", desc: "25 دقيقة تركيز ثم 5 دقائق راحة. الأسلوب العلمي المثبت للحفظ والمذاكرة.", color: "#f59e0b" },
];

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
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 24px", background: "rgba(10,10,20,0.85)",
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.glassBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18 }}><span style={{ color: C.indigoLight }}>Madak</span>OS</span>
        </div>
        <button onClick={() => navigate("/app")} style={{
          padding: "8px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none", borderRadius: 30, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          فتح التطبيق
        </button>
      </nav>

      <section style={{ padding: "100px 24px 80px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 62px)", fontWeight: 900, margin: "0 0 24px" }}>
          نظّم وقتك واحكم <br />
          <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            البكالوريا بجدارة
          </span>
        </h1>
        <p style={{ color: C.textSecondary, fontSize: 18, marginBottom: 44 }}>
          منصتك الذكية لتنظيم الوقت، تتبع المهام، والمراجعة الفعّالة.
        </p>
        <button onClick={() => navigate("/app")} style={{
          padding: "16px 40px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          border: "none", borderRadius: 50, color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer",
        }}>
          فتح التطبيق مباشرةً
        </button>
      </section>
    </div>
  );
}