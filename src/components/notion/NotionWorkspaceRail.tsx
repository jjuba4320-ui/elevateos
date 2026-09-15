import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Globe, Moon, Sun, Sparkles, Layers, Check } from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';
import { MadakLogo } from '../common/MadakLogo';

export function NotionWorkspaceRail() {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    setWorkspaceModalOpen,
    language,
    toggleLanguage,
    themeMode,
    toggleTheme,
  } = useNotionStore();

  const [hoveredWsId, setHoveredWsId] = useState<string | null>(null);
  const [langTooltipOpen, setLangTooltipOpen] = useState(false);
  const [themeTooltipOpen, setThemeTooltipOpen] = useState(false);

  const isArabic = language === 'ar';
  const isDark = themeMode === 'dark';

  return (
    <nav
      aria-label={isArabic ? 'شريط مساحات العمل الجانبي' : 'Workspaces Navigation Rail'}
      className={`hidden md:flex w-14 h-screen shrink-0 border-e flex-col justify-between items-center py-3 select-none z-45 transition-colors duration-200 ${
        isDark ? 'bg-[#181818] border-[#292929] text-neutral-300' : 'bg-[#ededeb] border-neutral-200/90 text-neutral-800'
      }`}
    >
      {/* TOP: Brand Emblem & Workspaces Stack */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* App Logo Button */}
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.94 }}
            className="cursor-pointer"
            title="مَداك | MadakOS"
          >
            <MadakLogo size={36} />
          </motion.div>
        </div>

        {/* Divider */}
        <div className={`w-6 h-[1px] ${isDark ? 'bg-[#303030]' : 'bg-neutral-300'}`} />

        {/* Workspaces List */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            const isHovered = hoveredWsId === ws.id;

            return (
              <div
                key={ws.id}
                className="relative flex items-center justify-center w-full"
                onMouseEnter={() => setHoveredWsId(ws.id)}
                onMouseLeave={() => setHoveredWsId(null)}
              >
                {/* Active Indicator Bar (Glides smoothly with spring layoutId) */}
                {isActive && (
                  <motion.div
                    layoutId="activeWorkspaceRailPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className={`absolute w-1 h-5 rounded-full ${
                      isArabic ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'
                    }`}
                    style={{ backgroundColor: ws.color || '#06b6d4' }}
                  />
                )}

                {/* Workspace Icon Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all relative ${
                    isActive
                      ? isDark
                        ? 'bg-[#2a2a2a] shadow-md border border-neutral-700/80 ring-1'
                        : 'bg-white shadow-md border border-neutral-300 ring-1 ring-neutral-400/20'
                      : isDark
                      ? 'bg-[#202020] hover:bg-[#282828] text-neutral-400 hover:text-white border border-transparent'
                      : 'bg-neutral-200/70 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-transparent'
                  }`}
                  style={isActive ? { ringColor: ws.color } : {}}
                  aria-label={isArabic ? ws.name : ws.nameEn}
                >
                  <span>{ws.icon}</span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#181818]"
                      style={{ backgroundColor: ws.color || '#06b6d4' }}
                    />
                  )}
                </motion.button>

                {/* Notion Floating Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`absolute z-50 pointer-events-none whitespace-nowrap px-3 py-2 rounded-xl text-xs shadow-xl border ${
                        isArabic ? 'right-13' : 'left-13'
                      } ${
                        isDark
                          ? 'bg-[#222222] border-[#363636] text-white shadow-black/60'
                          : 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-300/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{ws.icon}</span>
                        <div className="font-bold text-xs">{isArabic ? ws.name : ws.nameEn}</div>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: (ws.color || '#06b6d4') + '25',
                            color: ws.color || '#06b6d4',
                          }}
                        >
                          {isArabic ? ws.planAr : ws.plan}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5 max-w-[200px] truncate">
                        {isArabic ? ws.description : ws.descriptionEn}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Add New Workspace Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setWorkspaceModalOpen(true)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border border-dashed ${
              isDark
                ? 'border-neutral-700 hover:border-cyan-400 hover:bg-neutral-800/80 text-neutral-400 hover:text-cyan-300'
                : 'border-neutral-300 hover:border-cyan-600 hover:bg-white text-neutral-500 hover:text-cyan-700'
            }`}
            title={isArabic ? 'إنشاء مساحة عمل جديدة (+)' : 'Create new workspace (+)'}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* BOTTOM: Language Switcher, Theme Toggle & Quick Controls */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2">
        <div className={`w-6 h-[1px] ${isDark ? 'bg-[#303030]' : 'bg-neutral-300'}`} />

        {/* Smooth Language Toggle Button */}
        <div
          className="relative flex items-center justify-center w-full"
          onMouseEnter={() => setLangTooltipOpen(true)}
          onMouseLeave={() => setLangTooltipOpen(false)}
        >
          <motion.button
            type="button"
            onClick={toggleLanguage}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center transition border shadow-xs ${
              isDark
                ? 'bg-[#222222] hover:bg-[#2c2c2c] border-[#363636] text-cyan-300'
                : 'bg-white hover:bg-neutral-100 border-neutral-300 text-cyan-700'
            }`}
            aria-label={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <motion.div
              key={language}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="flex items-center justify-center flex-col"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black tracking-tight leading-none mt-0.5">
                {isArabic ? 'EN' : 'عربي'}
              </span>
            </motion.div>
          </motion.button>

          {/* Language Tooltip */}
          <AnimatePresence>
            {langTooltipOpen && (
              <motion.div
                initial={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg text-xs shadow-lg border ${
                  isArabic ? 'right-13' : 'left-13'
                } ${
                  isDark ? 'bg-[#222] border-[#363636] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                {isArabic ? 'التحويل إلى English' : 'Switch to العربية'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Button */}
        <div
          className="relative flex items-center justify-center w-full"
          onMouseEnter={() => setThemeTooltipOpen(true)}
          onMouseLeave={() => setThemeTooltipOpen(false)}
        >
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border ${
              isDark
                ? 'bg-[#222222] hover:bg-[#2c2c2c] border-[#363636] text-amber-300'
                : 'bg-white hover:bg-neutral-100 border-neutral-300 text-amber-600'
            }`}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
          >
            <motion.div
              key={themeMode}
              initial={{ rotate: 90, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </motion.button>

          {/* Theme Tooltip */}
          <AnimatePresence>
            {themeTooltipOpen && (
              <motion.div
                initial={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isArabic ? -6 : 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg text-xs shadow-lg border ${
                  isArabic ? 'right-13' : 'left-13'
                } ${
                  isDark ? 'bg-[#222] border-[#363636] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                {isDark ? (isArabic ? 'الوضع الفاتح' : 'Light Mode') : isArabic ? 'الوضع الليلي' : 'Dark Mode'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
