import React, { useState, useEffect, useRef } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  ChevronRight,
  Quote,
  AlertCircle,
  Minus,
  Code,
  Table,
  Kanban,
} from 'lucide-react';
import { BlockType } from '../../types/notion';
import { useNotionStore } from '../../stores/useNotionStore';

interface NotionSlashMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

interface MenuItem {
  type: BlockType;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'basic' | 'list' | 'advanced';
}

const MENU_ITEMS: MenuItem[] = [
  {
    type: 'text',
    title: 'Text',
    titleAr: 'نص عادي',
    desc: 'Just start writing with plain text.',
    descAr: 'اكتب نصاً عادياً أو فقرة جديدة.',
    icon: Type,
    category: 'basic',
  },
  {
    type: 'heading1',
    title: 'Heading 1',
    titleAr: 'عنوان رئيسي (H1)',
    desc: 'Big section heading.',
    descAr: 'عنوان رئيسي كبير للأقسام.',
    icon: Heading1,
    category: 'basic',
  },
  {
    type: 'heading2',
    title: 'Heading 2',
    titleAr: 'عنوان فرعي (H2)',
    desc: 'Medium section heading.',
    descAr: 'عنوان فرعي متوسط الحجم.',
    icon: Heading2,
    category: 'basic',
  },
  {
    type: 'heading3',
    title: 'Heading 3',
    titleAr: 'عنوان فرعي صغير (H3)',
    desc: 'Small section heading.',
    descAr: 'عنوان فرعي صغير للنقاط التابعة.',
    icon: Heading3,
    category: 'basic',
  },
  {
    type: 'todo',
    title: 'To-do list',
    titleAr: 'قائمة مهام (To-do)',
    desc: 'Track tasks with a to-do checkbox.',
    descAr: 'تتبع المهام بمربعات الاختيار والإنجاز.',
    icon: CheckSquare,
    category: 'list',
  },
  {
    type: 'bullet',
    title: 'Bulleted list',
    titleAr: 'قائمة نقطية',
    desc: 'Create a simple bulleted list.',
    descAr: 'إنشاء قائمة نقطية غير مرتبة.',
    icon: List,
    category: 'list',
  },
  {
    type: 'number',
    title: 'Numbered list',
    titleAr: 'قائمة مرقمة',
    desc: 'Create a list with numbering.',
    descAr: 'إنشاء قائمة تسلسلية مرقمة.',
    icon: ListOrdered,
    category: 'list',
  },
  {
    type: 'toggle',
    title: 'Toggle list',
    titleAr: 'قائمة قابلة للطي (Toggle)',
    desc: 'Toggles can hide and show content inside.',
    descAr: 'إخفاء وإظهار الملاحظات والتفاصيل داخل سهم.',
    icon: ChevronRight,
    category: 'list',
  },
  {
    type: 'quote',
    title: 'Quote',
    titleAr: 'اقتباس مميز',
    desc: 'Capture a quote or highlight phrase.',
    descAr: 'إبراز مقولة أو عبارة ملهمة بخط جانبي.',
    icon: Quote,
    category: 'basic',
  },
  {
    type: 'callout',
    title: 'Callout block',
    titleAr: 'مربع تنبيه ملون (Callout)',
    desc: 'Make writing stand out with an emoji & color.',
    descAr: 'مربع ملفت للانتباه مع أيقونة وخلفية ملونة.',
    icon: AlertCircle,
    category: 'basic',
  },
  {
    type: 'divider',
    title: 'Divider',
    titleAr: 'خط فاصل',
    desc: 'Visually divide blocks with a thin line.',
    descAr: 'فصل الأقسام بخط أفقي رفيع.',
    icon: Minus,
    category: 'basic',
  },
  {
    type: 'code',
    title: 'Code snippet',
    titleAr: 'كتلة كود برمجية',
    desc: 'Capture code snippet with syntax container.',
    descAr: 'كتابة شيفرة برمجية مع زر للنسخ.',
    icon: Code,
    category: 'advanced',
  },
  {
    type: 'database',
    title: 'Inline Table',
    titleAr: 'جدول بيانات متكامل',
    desc: 'Interactive database table with properties.',
    descAr: 'جدول بيانات تفاعلي مع أعمدة وحالات مختلفة.',
    icon: Table,
    category: 'advanced',
  },
];

export function NotionSlashMenu({ onSelect, onClose }: NotionSlashMenuProps) {
  const { language, themeMode } = useNotionStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleAr.includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.descAr.includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, onSelect, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isDark = themeMode === 'dark';

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 w-72 sm:w-80 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
        isDark
          ? 'bg-[#252525] border-[#383838] text-neutral-200'
          : 'bg-white border-neutral-200 text-neutral-800'
      }`}
    >
      <div className={`p-2 border-b ${isDark ? 'border-[#333]' : 'border-neutral-100'}`}>
        <input
          autoFocus
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'ar' ? 'ابحث عن نوع الكتلة أو الأمر...' : 'Filter commands...'}
          className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none ${
            isDark ? 'bg-[#1e1e1e] text-white placeholder-neutral-500' : 'bg-neutral-50 text-black placeholder-neutral-400'
          }`}
        />
      </div>

      <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-neutral-500">
            {language === 'ar' ? 'لا توجد كتل مطابقة' : 'No matching blocks'}
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onSelect(item.type)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${
                  isSelected
                    ? isDark
                      ? 'bg-[#333333] text-white'
                      : 'bg-neutral-100 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isDark
                      ? 'bg-[#1d1d1d] border-[#333] text-neutral-300'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold leading-tight">
                    {language === 'ar' ? item.titleAr : item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {language === 'ar' ? item.descAr : item.desc}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
