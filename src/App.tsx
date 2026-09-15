// @ts-nocheck
import React, { useState, useEffect } from "react";
// تحديد امتداد الملف .jsx بدقة لمنع خطأ Vite
import LandingPage from "./components/LandingPage.jsx";
import NotionWorkspace from "./components/notion/NotionWorkspace";

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

  if (path === "/app") {
    return <NotionWorkspace navigate={navigate} />;
  }

  return <LandingPage navigate={navigate} />;
}