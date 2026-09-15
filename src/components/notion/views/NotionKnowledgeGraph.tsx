import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  FileText,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { useNotionStore } from '../../../stores/useNotionStore';

interface GraphNode {
  id: string;
  title: string;
  icon: string;
  blockCount: number;
  tags: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export function NotionKnowledgeGraph() {
  const { pages, setActivePageId, themeMode, language } = useNotionStore();
  const isDark = themeMode === 'dark';
  const isArabic = language === 'ar';

  const [search, setSearch] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activePages = pages.filter((p) => !p.isDeleted);

  // Colors palette for nodes
  const nodeColors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  // Construct nodes and links
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);

  useEffect(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const newNodes: GraphNode[] = activePages.map((page, idx) => {
      const angle = (idx / (activePages.length || 1)) * 2 * Math.PI;
      const radius = 120 + (idx % 3) * 60;
      return {
        id: page.id,
        title: page.title || (isArabic ? 'بدون عنوان' : 'Untitled'),
        icon: page.icon || '📄',
        blockCount: page.blocks.length,
        tags: page.isFavorite ? ['Starred'] : ['General'],
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        color: nodeColors[idx % nodeColors.length],
      };
    });

    // Generate links: link sequential pages or parent-child pages
    const newLinks: GraphLink[] = [];
    for (let i = 0; i < newNodes.length; i++) {
      if (i > 0) {
        newLinks.push({ source: newNodes[i - 1].id, target: newNodes[i].id });
      }
      if (i > 2 && i % 2 === 0) {
        newLinks.push({ source: newNodes[0].id, target: newNodes[i].id });
      }
    }

    setNodes(newNodes);
    setLinks(newLinks);
  }, [pages]);

  // Selected node details
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedPage = activePages.find((p) => p.id === selectedNodeId);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const filteredNodes = nodes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

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
              <span>🕸️</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isArabic ? 'شبكة الروابط المعرفية (Obsidian Graph View)' : 'Knowledge Graph View (Obsidian & Roam)'}
              </h1>
            </div>
            <p className="text-xs text-neutral-400">
              {isArabic
                ? 'استكشف الروابط التفاعلية بين جميع صفحات ومذكرات مساحة العمل في شبكة عصبية بصرية ثنائية الاتجاه.'
                : 'Explore bi-directional links and connections between your Notion pages in an interactive visual network.'}
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-black/30 border-white/10 text-xs">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isArabic ? 'بحث في العقد...' : 'Filter nodes...'}
                className="bg-transparent focus:outline-none w-28 sm:w-36 text-xs"
              />
            </div>

            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
              className="p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
              className="p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Graph Canvas Stage */}
        <div
          className={`flex-1 rounded-3xl border relative overflow-hidden flex shadow-2xl min-h-[500px] cursor-grab active:cursor-grabbing ${
            isDark ? 'bg-[#141414] border-[#2c2c2c]' : 'bg-[#fafafa] border-neutral-200'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Subtle Grid Dots Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Links */}
            {links.map((link, idx) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#06b6d4' : isDark ? '#333333' : '#d4d4d4'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? '4 2' : undefined}
                />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const radius = 20 + Math.min(node.blockCount * 2, 14);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  onDoubleClick={() => setActivePageId(node.id)}
                >
                  {/* Glowing halo if selected */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    fill={isDark ? '#222' : '#fff'}
                    stroke={node.color}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition hover:scale-110"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                  />

                  {/* Node Icon */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={radius * 0.9}
                    className="select-none pointer-events-none"
                  >
                    {node.icon}
                  </text>

                  {/* Label */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill={isDark ? '#e0e0e0' : '#222'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none pointer-events-none bg-black"
                  >
                    {node.title.length > 18 ? node.title.substring(0, 16) + '...' : node.title}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Floating Sidebar */}
          {selectedPage && (
            <div
              className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 w-72 rounded-2xl border p-4 shadow-2xl backdrop-blur-md animate-in fade-in duration-150 ${
                isDark ? 'bg-[#1c1c1c]/90 border-[#383838]' : 'bg-white/95 border-neutral-200 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPage.icon || '📄'}</span>
                  <div className="font-bold text-xs truncate max-w-[170px]">{selectedPage.title}</div>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-neutral-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-[11px] text-neutral-400 mb-4">
                <div className="flex justify-between">
                  <span>{isArabic ? 'عدد الكتل:' : 'Blocks:'}</span>
                  <span className="font-bold text-neutral-200">{selectedPage.blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isArabic ? 'الروابط المتصلة:' : 'Connected Links:'}</span>
                  <span className="font-bold text-cyan-400">
                    {links.filter((l) => l.source === selectedPage.id || l.target === selectedPage.id).length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePageId(selectedPage.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-sm"
              >
                <span>{isArabic ? 'فتح وتحرير الصفحة' : 'Open Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Help Tip */}
          <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 text-[10px] text-neutral-500 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-xl border border-white/5 pointer-events-none">
            <Info className="w-3 h-3" />
            <span>
              {isArabic
                ? 'انقر لتحديد عقدة، وانقر نقراً مزدوجاً لفتح الصفحة مباشرة. اسحب للتنقل.'
                : 'Click to inspect node, double click to open page. Drag to pan.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
