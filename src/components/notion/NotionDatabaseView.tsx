import React, { useState } from 'react';
import {
  Table as TableIcon,
  Kanban as KanbanIcon,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import { useNotionStore } from '../../stores/useNotionStore';
import { NotionDatabase } from '../../types/notion';

interface NotionDatabaseViewProps {
  databaseId: string;
}

export function NotionDatabaseView({ databaseId }: NotionDatabaseViewProps) {
  const { databases, updateDatabase, addRow, updateRow, deleteRow, themeMode, language } =
    useNotionStore();
  const db: NotionDatabase | undefined = databases[databaseId];

  const [newRowText, setNewRowText] = useState('');
  const [activeView, setActiveView] = useState<'table' | 'board'>('table');

  if (!db) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-neutral-700 text-xs text-neutral-500 text-center">
        {language === 'ar' ? 'قاعدة البيانات غير موجودة أو تم حذفها' : 'Database not found'}
      </div>
    );
  }

  const isDark = themeMode === 'dark';

  const handleAddNewRow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const primaryProp = db.properties[0]?.id || 'title';
    const statusProp = db.properties.find((p) => p.type === 'status')?.id || 'status';

    const values: Record<string, any> = {
      [primaryProp]: newRowText.trim() || (language === 'ar' ? 'عنصر جديد' : 'New page item'),
    };
    if (statusProp) {
      values[statusProp] = language === 'ar' ? 'قيد التنفيذ' : 'In progress';
    }

    addRow(databaseId, values);
    setNewRowText('');
  };

  const getStatusColor = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('done') || s.includes('مكتمل') || s.includes('نجاح')) {
      return isDark
        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
        : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (s.includes('progress') || s.includes('تنفيذ') || s.includes('مراجعة')) {
      return isDark
        ? 'bg-blue-950/70 text-blue-300 border-blue-800/60'
        : 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (s.includes('wait') || s.includes('انتظار') || s.includes('بداية')) {
      return isDark
        ? 'bg-amber-950/70 text-amber-300 border-amber-800/60'
        : 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return isDark
      ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
      : 'bg-neutral-100 text-neutral-700 border-neutral-200';
  };

  return (
    <div
      className={`my-4 rounded-2xl border transition-all overflow-hidden ${
        isDark ? 'bg-[#1e1e1e] border-[#303030]' : 'bg-white border-neutral-200 shadow-sm'
      }`}
    >
      {/* Database Title & Controls Bar */}
      <div
        className={`p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 border-b ${
          isDark ? 'border-[#2d2d2d] bg-[#222222]' : 'border-neutral-100 bg-neutral-50/70'
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={db.title}
            onChange={(e) => updateDatabase(databaseId, { title: e.target.value })}
            className={`font-bold text-sm bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-neutral-500 rounded px-1 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          />

          {/* View Switcher Tabs: Table vs Board */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-[#181818] border-[#333]' : 'bg-neutral-200/70 border-neutral-300'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                activeView === 'table'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-white shadow-sm'
                    : 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'جدول' : 'Table'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                activeView === 'board'
                  ? isDark
                    ? 'bg-[#2a2a2a] text-white shadow-sm'
                    : 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'لوحة كانبان' : 'Board'}</span>
            </button>
          </div>
        </div>

        {/* Quick Add Row Input */}
        <form onSubmit={handleAddNewRow} className="flex items-center gap-1.5">
          <input
            type="text"
            value={newRowText}
            onChange={(e) => setNewRowText(e.target.value)}
            placeholder={language === 'ar' ? '+ إضافة عنصر جديد...' : '+ New item...'}
            className={`px-3 py-1 text-xs rounded-lg border focus:outline-none transition ${
              isDark
                ? 'bg-[#161616] border-[#383838] text-white placeholder-neutral-500 focus:border-cyan-500'
                : 'bg-white border-neutral-300 text-black placeholder-neutral-400 focus:border-cyan-600'
            }`}
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition text-xs font-bold"
            title={language === 'ar' ? 'إضافة' : 'Add'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* TABLE VIEW */}
      {activeView === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#2d2d2d] text-neutral-400' : 'border-neutral-100 text-neutral-500'}`}>
                {db.properties.map((prop) => (
                  <th key={prop.id} className="p-3 font-semibold text-[11px] uppercase tracking-wider">
                    {prop.name}
                  </th>
                ))}
                <th className="p-3 w-12 text-center">{language === 'ar' ? 'حذف' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#282828]' : 'divide-neutral-100'}`}>
              {db.rows.map((row) => (
                <tr
                  key={row.id}
                  className={`group transition ${
                    isDark ? 'hover:bg-[#262626]' : 'hover:bg-neutral-50'
                  }`}
                >
                  {db.properties.map((prop) => {
                    const val = row.values[prop.id];

                    if (prop.type === 'checkbox') {
                      return (
                        <td key={prop.id} className="p-3">
                          <input
                            type="checkbox"
                            checked={Boolean(val)}
                            onChange={(e) =>
                              updateRow(databaseId, row.id, { [prop.id]: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                      );
                    }

                    if (prop.type === 'status' || prop.type === 'select') {
                      return (
                        <td key={prop.id} className="p-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColor(
                              String(val || '')
                            )}`}
                          >
                            {String(val || (language === 'ar' ? 'لم يحدد' : 'Not set'))}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={prop.id} className="p-3">
                        <input
                          type={prop.type === 'number' ? 'number' : 'text'}
                          value={val ?? ''}
                          onChange={(e) =>
                            updateRow(databaseId, row.id, { [prop.id]: e.target.value })
                          }
                          className={`w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1 py-0.5 ${
                            isDark ? 'text-neutral-200' : 'text-neutral-800'
                          }`}
                        />
                      </td>
                    );
                  })}

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(databaseId, row.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-400 transition text-neutral-500"
                      title={language === 'ar' ? 'حذف هذا السطر' : 'Delete row'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer: Add row shortcut */}
          <div
            onClick={() => handleAddNewRow()}
            className={`p-2.5 px-4 text-xs font-medium cursor-pointer flex items-center gap-2 border-t transition ${
              isDark
                ? 'border-[#282828] text-neutral-400 hover:bg-[#252525] hover:text-white'
                : 'border-neutral-100 text-neutral-600 hover:bg-neutral-50 hover:text-black'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة سطر جديد...' : 'New row...'}</span>
          </div>
        </div>
      )}

      {/* BOARD (KANBAN) VIEW */}
      {activeView === 'board' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
          {[
            { id: 'todo', name: language === 'ar' ? 'قيد الانتظار (To Do)' : 'To Do', color: 'border-neutral-600' },
            { id: 'in_progress', name: language === 'ar' ? 'قيد الإنجاز (In Progress)' : 'In Progress', color: 'border-blue-500' },
            { id: 'done', name: language === 'ar' ? 'مكتمل بنجاح (Done)' : 'Done', color: 'border-emerald-500' },
          ].map((col) => {
            const statusProp = db.properties.find((p) => p.type === 'status')?.id || 'status';
            const primaryProp = db.properties[0]?.id || 'title';

            const columnRows = db.rows.filter((r) => {
              const val = String(r.values[statusProp] || '').toLowerCase();
              if (col.id === 'todo') return val.includes('todo') || val.includes('انتظار') || val.includes('بداية') || val === '';
              if (col.id === 'in_progress') return val.includes('progress') || val.includes('تنفيذ') || val.includes('مراجعة');
              if (col.id === 'done') return val.includes('done') || val.includes('مكتمل') || val.includes('نجاح');
              return false;
            });

            return (
              <div
                key={col.id}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[220px] ${
                  isDark ? 'bg-[#181818] border-[#2c2c2c]' : 'bg-neutral-50/90 border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                    <span className="text-xs font-bold text-neutral-300">{col.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                      {columnRows.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {columnRows.map((row) => (
                      <div
                        key={row.id}
                        className={`p-3 rounded-xl border shadow-sm transition group ${
                          isDark
                            ? 'bg-[#242424] border-[#363636] text-white hover:border-neutral-500'
                            : 'bg-white border-neutral-200 text-black hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold leading-snug">
                            {row.values[primaryProp] || (language === 'ar' ? 'عنصر بدون عنوان' : 'Untitled item')}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteRow(databaseId, row.id)}
                            className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Move card shortcuts */}
                        <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                          {col.id !== 'todo' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(databaseId, row.id, {
                                  [statusProp]: language === 'ar' ? 'قيد الانتظار' : 'To Do',
                                })
                              }
                              className="hover:text-white flex items-center gap-0.5"
                            >
                              <span>←</span> {language === 'ar' ? 'انتظار' : 'To Do'}
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(databaseId, row.id, {
                                  [statusProp]: language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
                                })
                              }
                              className="hover:text-cyan-400 flex items-center gap-0.5"
                            >
                              <span>⚡</span> {language === 'ar' ? 'تنفيذ' : 'Progress'}
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(databaseId, row.id, {
                                  [statusProp]: language === 'ar' ? 'مكتمل بنجاح' : 'Done',
                                })
                              }
                              className="hover:text-emerald-400 flex items-center gap-0.5"
                            >
                              <span>✓</span> {language === 'ar' ? 'إنجاز' : 'Done'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const statusName =
                      col.id === 'todo'
                        ? language === 'ar' ? 'قيد الانتظار' : 'To Do'
                        : col.id === 'in_progress'
                        ? language === 'ar' ? 'قيد التنفيذ' : 'In progress'
                        : language === 'ar' ? 'مكتمل' : 'Done';
                    addRow(databaseId, {
                      [primaryProp]: language === 'ar' ? 'مهمة جديدة' : 'New task',
                      [statusProp]: statusName,
                    });
                  }}
                  className="mt-3 py-1.5 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1 border border-dashed border-neutral-800 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'بطاقة جديدة' : 'Add card'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
