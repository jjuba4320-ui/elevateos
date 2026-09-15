import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Check,
  Copy,
  Trash2,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { NotionBlock, BlockType } from '../../types/notion';
import { useNotionStore } from '../../stores/useNotionStore';
import { NotionSlashMenu } from './NotionSlashMenu';
import { NotionDatabaseView } from './NotionDatabaseView';

interface NotionBlockItemProps {
  key?: string;
  pageId: string;
  block: NotionBlock;
  blockIndex: number;
  isLocked?: boolean;
}

export function NotionBlockItem({ pageId, block, blockIndex, isLocked }: NotionBlockItemProps) {
  const { updateBlock, deleteBlock, addBlock, themeMode, language } = useNotionStore();
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const blockMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = themeMode === 'dark';

  // Auto-resize textarea height to content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  // Handle keys: Enter to create new block, Backspace on empty to delete, / to open slash
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (isLocked) return;

    if (e.key === '/' && block.content === '') {
      setShowSlashMenu(true);
    } else if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();
      addBlock(pageId, 'text', block.id);
    } else if (e.key === 'Backspace' && block.content === '' && block.type !== 'text') {
      e.preventDefault();
      updateBlock(pageId, block.id, { type: 'text' });
    }
  };

  const handleSlashSelect = (newType: BlockType) => {
    setShowSlashMenu(false);
    updateBlock(pageId, block.id, { type: newType });
  };

  const copyCode = () => {
    if (block.content) {
      navigator.clipboard.writeText(block.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Close block menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (blockMenuRef.current && !blockMenuRef.current.contains(e.target as Node)) {
        setShowBlockMenu(false);
      }
    };
    if (showBlockMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showBlockMenu]);

  return (
    <div className="group relative flex items-start my-1 transition-all">
      {/* Notion Hover Controls (Add Block '+' & Drag Handle '⋮⋮') */}
      {!isLocked && (
        <div className="absolute -left-14 rtl:-left-auto rtl:-right-14 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-neutral-400">
          <button
            type="button"
            onClick={() => addBlock(pageId, 'text', block.id)}
            className="p-1 rounded hover:bg-neutral-800/60 hover:text-white transition"
            title={language === 'ar' ? 'إضافة كتلة جديدة أسفل' : 'Add block below'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowBlockMenu(!showBlockMenu)}
            className="p-1 rounded hover:bg-neutral-800/60 hover:text-white transition cursor-grab"
            title={language === 'ar' ? 'خيارات الكتلة' : 'Block options'}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          {/* Block Options Popover */}
          {showBlockMenu && (
            <div
              ref={blockMenuRef}
              className={`absolute top-full left-0 z-50 w-44 rounded-xl border p-1 shadow-2xl ${
                isDark ? 'bg-[#252525] border-[#383838] text-neutral-200' : 'bg-white border-neutral-200 text-black'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  deleteBlock(pageId, block.id);
                  setShowBlockMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'حذف الكتلة' : 'Delete block'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* RENDER BY BLOCK TYPE */}
      <div className="w-full min-w-0">
        {/* 1. PARAGRAPH / TEXT */}
        {block.type === 'text' && (
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={isLocked}
            value={block.content}
            onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={
              blockIndex === 0
                ? language === 'ar'
                  ? 'اكتب نصاً أو اضغط على "/" للأوامر والخيارات...'
                  : "Type something, or press '/' for commands..."
                : ''
            }
            className={`w-full resize-none overflow-hidden bg-transparent border-none focus:outline-none text-base leading-relaxed ${
              isDark ? 'text-neutral-200 placeholder-neutral-600' : 'text-neutral-800 placeholder-neutral-400'
            }`}
          />
        )}

        {/* 2. HEADING 1 */}
        {block.type === 'heading1' && (
          <input
            type="text"
            disabled={isLocked}
            value={block.content}
            onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={language === 'ar' ? 'عنوان رئيسي كبير...' : 'Heading 1'}
            className={`w-full bg-transparent border-none focus:outline-none font-black text-2xl sm:text-3xl tracking-tight mt-4 mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          />
        )}

        {/* 3. HEADING 2 */}
        {block.type === 'heading2' && (
          <input
            type="text"
            disabled={isLocked}
            value={block.content}
            onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={language === 'ar' ? 'عنوان فرعي متوسط...' : 'Heading 2'}
            className={`w-full bg-transparent border-none focus:outline-none font-extrabold text-xl sm:text-2xl tracking-tight mt-3 mb-1.5 ${
              isDark ? 'text-neutral-100' : 'text-neutral-900'
            }`}
          />
        )}

        {/* 4. HEADING 3 */}
        {block.type === 'heading3' && (
          <input
            type="text"
            disabled={isLocked}
            value={block.content}
            onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={language === 'ar' ? 'عنوان صغير...' : 'Heading 3'}
            className={`w-full bg-transparent border-none focus:outline-none font-bold text-lg sm:text-xl tracking-tight mt-2 mb-1 ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            }`}
          />
        )}

        {/* 5. TO-DO LIST ITEM */}
        {block.type === 'todo' && (
          <div className="flex items-start gap-2.5 py-0.5">
            <input
              type="checkbox"
              disabled={isLocked}
              checked={Boolean(block.checked)}
              onChange={(e) => updateBlock(pageId, block.id, { checked: e.target.checked })}
              className="w-4 h-4 mt-1 rounded text-cyan-600 focus:ring-0 cursor-pointer"
            />
            <input
              type="text"
              disabled={isLocked}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'مهمة جديدة...' : 'To-do item'}
              className={`w-full bg-transparent border-none focus:outline-none text-base ${
                block.checked
                  ? isDark
                    ? 'line-through text-neutral-500'
                    : 'line-through text-neutral-400'
                  : isDark
                  ? 'text-neutral-200'
                  : 'text-neutral-800'
              }`}
            />
          </div>
        )}

        {/* 6. BULLETED LIST */}
        {block.type === 'bullet' && (
          <div className="flex items-start gap-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2.5 shrink-0" />
            <input
              type="text"
              disabled={isLocked}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'عنصر في القائمة...' : 'List item'}
              className={`w-full bg-transparent border-none focus:outline-none text-base ${
                isDark ? 'text-neutral-200' : 'text-neutral-800'
              }`}
            />
          </div>
        )}

        {/* 7. NUMBERED LIST */}
        {block.type === 'number' && (
          <div className="flex items-start gap-2.5 py-0.5">
            <span className="text-xs font-mono text-neutral-400 mt-1 shrink-0 w-4">
              {blockIndex + 1}.
            </span>
            <input
              type="text"
              disabled={isLocked}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'عنصر مرقم...' : 'Numbered item'}
              className={`w-full bg-transparent border-none focus:outline-none text-base ${
                isDark ? 'text-neutral-200' : 'text-neutral-800'
              }`}
            />
          </div>
        )}

        {/* 8. TOGGLE LIST */}
        {block.type === 'toggle' && (
          <div className="space-y-1.5 py-0.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateBlock(pageId, block.id, { collapsed: !block.collapsed })}
                className="p-1 rounded hover:bg-neutral-800/60 text-neutral-400 hover:text-white transition"
              >
                {block.collapsed ? (
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <input
                type="text"
                disabled={isLocked}
                value={block.content}
                onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder={language === 'ar' ? 'عنوان القائمة القابلة للطي...' : 'Toggle header'}
                className={`w-full bg-transparent border-none focus:outline-none font-semibold text-base ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              />
            </div>

            {!block.collapsed && block.children && block.children.length > 0 && (
              <div className="pl-6 rtl:pl-0 rtl:pr-6 border-l rtl:border-l-0 rtl:border-r border-neutral-800 space-y-1 mt-1">
                {block.children.map((child, cIdx) => (
                  <div key={child.id} className="text-sm text-neutral-300 py-0.5">
                    {child.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. QUOTE */}
        {block.type === 'quote' && (
          <div className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-cyan-500 pl-4 rtl:pl-0 rtl:pr-4 py-1 my-1">
            <textarea
              ref={textareaRef}
              rows={1}
              disabled={isLocked}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'اكتب اقتباساً ملهماً...' : 'Empty quote'}
              className={`w-full resize-none overflow-hidden bg-transparent border-none focus:outline-none italic text-base ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            />
          </div>
        )}

        {/* 10. CALLOUT BLOCK */}
        {block.type === 'callout' && (
          <div
            className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-3 my-2 border transition ${
              isDark
                ? 'bg-[#22272b] border-[#2c363f] text-neutral-200'
                : 'bg-blue-50/80 border-blue-200 text-blue-950'
            }`}
          >
            <span className="text-xl shrink-0 mt-0.5">{block.icon || '💡'}</span>
            <textarea
              ref={textareaRef}
              rows={1}
              disabled={isLocked}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'اكتب ملاحظة مميزة أو تنبيهاً...' : 'Callout text'}
              className="w-full resize-none overflow-hidden bg-transparent border-none focus:outline-none text-sm leading-relaxed"
            />
          </div>
        )}

        {/* 11. DIVIDER */}
        {block.type === 'divider' && (
          <div className="py-3">
            <hr className={`border-t ${isDark ? 'border-[#303030]' : 'border-neutral-200'}`} />
          </div>
        )}

        {/* 12. CODE BLOCK */}
        {block.type === 'code' && (
          <div
            className={`rounded-2xl border my-2 overflow-hidden ${
              isDark ? 'bg-[#141414] border-[#2c2c2c]' : 'bg-neutral-900 text-neutral-200 border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/80 text-xs text-neutral-400">
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {block.language || 'javascript'}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 hover:text-white transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              disabled={isLocked}
              rows={3}
              value={block.content}
              onChange={(e) => updateBlock(pageId, block.id, { content: e.target.value })}
              placeholder="// Write code here..."
              className="w-full p-4 font-mono text-xs bg-transparent border-none focus:outline-none text-emerald-400 resize-y"
            />
          </div>
        )}

        {/* 13. EMBEDDED DATABASE */}
        {block.type === 'database' && block.databaseId && (
          <NotionDatabaseView databaseId={block.databaseId} />
        )}

        {/* Slash Command Popover Menu */}
        {showSlashMenu && (
          <NotionSlashMenu
            onSelect={handleSlashSelect}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </div>
    </div>
  );
}
