// @ts-nocheck
import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
// 1. استيراد المكون الرئيسي للتطبيق الفعلي (أو واجهة اللوحة الرئيسية لديك)
import MainLayout from "./components/MainLayout"; // أو المكون الرئيسي للتطبيق لديك مثل Dashboard أو Workspace

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState(null, "", newPath);
    setPath(newPath);
    window.scrollTo(0, 0);
  };

  // عند الدخول إلى المسار /app يتم عرض التطبيق الفعلي مباشرة دون أي تأخير
  if (path === "/app") {
    return <MainLayout navigate={navigate} />;
  }

  return <LandingPage navigate={navigate} />;
}