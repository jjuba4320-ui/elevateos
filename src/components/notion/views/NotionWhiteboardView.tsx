import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  RotateCcw,
  Download,
  Plus,
  StickyNote,
  Trash2,
  Sparkles,
  Palette,
} from 'lucide-react';
import { useNotionStore } from '../../../stores/useNotionStore';

interface NoteCard {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export function NotionWhiteboardView() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState('#06b6d4');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  const [stickyNotes, setStickyNotes] = useState<NoteCard[]>([
    {
      id: 'n1',
      text: isArabic ? '💡 فكرة: ربط درس التحولات النووية بتمارين البكالوريا 2023' : '💡 Idea: Connect nuclear physics with BAC 2023 exercises',
      x: 60,
      y: 80,
      color: '#fef08a',
    },
    {
      id: 'n2',
      text: isArabic ? '📌 مخطط المذاكرة: صباحاً رياضيات، مساءً فيزياء' : '📌 Plan: Morning Math, Evening Physics',
      x: 320,
      y: 120,
      color: '#fed7aa',
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    canvas.width = canvas.parentElement?.clientWidth || 900;
    canvas.height = 600;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 5;
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addStickyNote = () => {
    const newNote: NoteCard = {
      id: 'sn_' + Date.now(),
      text: isArabic ? 'ملاحظة جديدة...' : 'New thought...',
      x: 100 + (stickyNotes.length % 5) * 40,
      y: 100 + (stickyNotes.length % 5) * 30,
      color: ['#fef08a', '#bbf7d0', '#bae6fd', '#fed7aa', '#fbcfe8'][stickyNotes.length % 5],
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  const updateNoteText = (id: string, text: string) => {
    setStickyNotes(stickyNotes.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((n) => n.id !== id));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'whiteboard-sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = ['#06b6d4', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];

  return (
    <div
      className={`flex-1 overflow-hidden min-h-screen p-6 sm:p-10 flex flex-col transition-colors ${
        isDark ? 'bg-[#191919] text-[#e6e6e6]' : 'bg-white text-[#37352f]'
      }`}
    >
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-3xl sm:text-4xl mb-1">
              <span>🎨</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isArabic ? 'لوحة الأفكار والرسم الحر (Miro & Excalidraw)' : 'Visual Whiteboard & Freeform Canvas (Miro & Excalidraw)'}
              </h1>
            </div>
            <p className="text-xs text-neutral-400">
              {isArabic
                ? 'مساحة عصف ذهني حرة للرسم باليد، تدوين الملاحظات اللاصقة الملونة، وتخطيط الخرائط الذهنية.'
                : 'Infinite visual brainstorming scratchpad for sketches, diagrams, and colored sticky notes.'}
            </p>
          </div>

          {/* Whiteboard Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                tool === 'pen' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
              title="Pen"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'قلم' : 'Pen'}</span>
            </button>

            <button
              onClick={() => setTool('highlighter')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                tool === 'highlighter' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
              title="Highlighter"
            >
              <Highlighter className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'تظليل' : 'Highlighter'}</span>
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                tool === 'eraser' ? 'bg-cyan-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'ممحاة' : 'Eraser'}</span>
            </button>

            {/* Colors */}
            <div className="h-4 w-px bg-neutral-700 mx-1" />
            <div className="flex items-center gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border transition ${
                    color === c ? 'scale-125 border-white' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-neutral-700 mx-1" />

            <button
              onClick={addStickyNote}
              className="p-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition flex items-center gap-1"
            >
              <StickyNote className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'ملصق' : 'Sticky'}</span>
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition"
              title="Clear Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={downloadCanvas}
              className="p-2 rounded-xl text-cyan-400 hover:bg-cyan-500/20 transition"
              title="Download PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Stage */}
        <div
          className={`flex-1 rounded-3xl border relative overflow-hidden shadow-2xl min-h-[500px] ${
            isDark ? 'bg-[#141414] border-[#2c2c2c]' : 'bg-[#fafafa] border-neutral-200'
          }`}
        >
          {/* Subtle Grid dots */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full cursor-crosshair relative z-10"
          />

          {/* Sticky Notes Layer */}
          {stickyNotes.map((note) => (
            <div
              key={note.id}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                backgroundColor: note.color,
              }}
              className="absolute z-20 w-52 p-3 rounded-2xl shadow-xl text-neutral-900 border border-black/10 group cursor-move"
            >
              <div className="flex items-center justify-between mb-1 opacity-70">
                <span className="text-[10px] font-bold uppercase tracking-wider">Note</span>
                <button
                  onClick={() => deleteStickyNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                value={note.text}
                onChange={(e) => updateNoteText(note.id, e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none resize-none text-xs font-semibold focus:outline-none placeholder-neutral-700"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
