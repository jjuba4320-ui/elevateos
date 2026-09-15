import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage'; 

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

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

  // إذا تم توجيه المستخدم إلى التطبيق
  if (path === '/app') {
    return (
      <div style={{ backgroundColor: '#0a0a14', height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>هنا سيظهر تطبيق MadakOS الأساسي لاحقاً 🚀</h2>
        <button onClick={() => navigate('/')} style={{ marginLeft: '20px', padding: '10px', cursor: 'pointer' }}>العودة</button>
      </div>
    );
  }

  // الصفحة الرئيسية تعرض صفحة الهبوط
  return <LandingPage navigate={navigate} />;
}
