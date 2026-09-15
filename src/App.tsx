// @ts-nocheck
import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';

export default function App() {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState(null, '', newPath);
    setPath(newPath);
    window.scrollTo(0, 0);
  };

  if (path === '/app') {
    return (
      <div
        style={{
          backgroundColor: '#0a0a14',
          minHeight: '100vh',
          color: '#f1f0ff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          direction: 'rtl',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>
          مرحباً بك في تطبيق <span style={{ color: '#818cf8' }}>MadakOS</span> 🚀
        </h1>
        <p style={{ color: '#a5a3c8', marginBottom: '24px', maxWidth: '400px' }}>
          جاري إعداد مساحة العمل الخاصة بك للتنظيم والتفوق...
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 28px',
            cursor: 'pointer',
            borderRadius: '30px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            boxShadow: '0 0 15px rgba(99,102,241,0.4)',
            transition: 'transform 0.2s',
          }}
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return <LandingPage navigate={navigate} />;
}
