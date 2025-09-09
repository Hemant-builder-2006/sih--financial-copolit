'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DraggableNode from './DraggableNode';
import CanvasToolbar from './CanvasToolbar';
import OutputNodeCard, { OutputNodeType } from './OutputNodeCard';


// Card Component for content items
interface ContentCardProps {
  type: 'video' | 'document' | 'text';
  title: string;
  content: string;
  stats?: { views?: string; duration?: string };
  position: { x: number; y: number };
  isSelected?: boolean;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  type,
  title,
  content,
  stats,
  position,
  isSelected = false,
  onClick
}) => {
  const getCardTheme = () => {
    switch (type) {
      case 'video':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-pink-50',
          border: 'border-red-200',
          accent: 'bg-red-500',
          icon: '▶️'
        };
      case 'document':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50',
          border: 'border-orange-200',
          accent: 'bg-orange-500',
          icon: '📄'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          accent: 'bg-blue-500',
          icon: '📝'
        };
    }
  };

  const theme = getCardTheme();

  return (
    <motion.div
      className={`absolute bg-white rounded-xl shadow-lg border ${theme.border} cursor-pointer group hover:shadow-xl transition-all duration-200 ${
        isSelected ? 'ring-2 ring-purple-500 ring-opacity-50 shadow-purple-200' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: 280,
        height: type === 'video' ? 320 : 280,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Status indicator */}
      <div className={`absolute top-3 right-3 w-3 h-3 ${theme.accent} rounded-full opacity-80`}></div>

      {type === 'video' ? (
        <div className="w-full h-full relative overflow-hidden">
          {/* Video thumbnail area */}
          <div className="h-32 bg-gradient-to-r from-red-400 to-pink-500 relative flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-red-500 text-xl">{theme.icon}</span>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Content area */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
              {title}
            </h3>
            
            {stats && (
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                {stats.views && <span>👀 {stats.views}</span>}
                {stats.duration && <span>⏱️ {stats.duration}</span>}
              </div>
            )}
            
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors">
                Watch
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                💬
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 ${theme.accent} rounded-lg flex items-center justify-center text-white text-sm`}>
              {theme.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                {title}
              </h3>
              <p className="text-xs text-gray-500">
                {type === 'document' ? 'PDF Document' : 'Text Note'}
              </p>
            </div>
          </div>
          
          {/* Preview content */}
          <div className="flex-1 text-sm text-gray-600 line-clamp-4 mb-3">
            {content}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button className={`flex-1 px-3 py-1.5 ${theme.accent} text-white text-xs rounded-lg hover:opacity-90 transition-opacity`}>
              Open
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors">
              ⋯
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Types
interface ContentItem {
  id: string;
  type: "text" | "pdf" | "image" | "video" | "ai";
  title: string;
  content: string;
  position: { x: number; y: number };
}

// Main AI Canvas Component
const AICanvas: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [aiHubHighlighted, setAIHubHighlighted] = useState(false);
  const actions = [
    { label: 'Summarize', key: 'summarize', color: 'from-purple-500 to-pink-500' },
    { label: 'Key Insights', key: 'insights', color: 'from-blue-500 to-cyan-500' },
    { label: 'Generate Ideas', key: 'ideas', color: 'from-green-500 to-lime-500' },
  ];
  const [aiHubActions, setAIHubActions] = useState(actions);

  // Output nodes state
  const [outputNodes, setOutputNodes] = useState<{
    id: string;
    type: OutputNodeType;
    title: string;
    y: number;
  }[]>([]);
  const [selectedOutputNode, setSelectedOutputNode] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'text',
      title: 'AI Canvas Project Ideas',
      content: 'Brainstorm and organize your creative projects with AI assistance. Connect ideas, expand concepts, and build comprehensive workflows.',
      position: { x: 100, y: 100 }
    },
    {
      id: '2',
      type: 'pdf',
      title: 'Feature Development Roadmap',
      content: 'Plan and track feature development across your applications. Use AI to suggest improvements and optimize user experience.',
      position: { x: 450, y: 150 }
    },
    {
      id: '3',
      type: 'text',
      title: 'Collaboration Workspace',
      content: 'Real-time collaboration tools enable teams to work together seamlessly. Share ideas, provide feedback, and iterate quickly.',
      position: { x: 200, y: 450 }
    }
  ]);

  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    setContentItems(items =>
      items.map(item =>
        item.id === id ? { ...item, position: newPosition } : item
      )
    );
  };

  const handleAddNode = (type: "text" | "pdf" | "image" | "video" | "ai") => {
    const typeTemplates = {
      text: {
        title: 'New Text Note',
        content: 'Add your thoughts, ideas, or notes here. This is a flexible text node for capturing any kind of textual information.'
      },
      pdf: {
        title: 'New PDF Document',
        content: 'Upload and analyze PDF documents. Extract key insights and connect them to your canvas workflow.'
      },
      image: {
        title: 'New Image Node',
        content: 'Add images, diagrams, or visual references. Perfect for mood boards, wireframes, or visual documentation.'
      },
      video: {
        title: 'New Video/Audio',
        content: 'Upload video or audio content with automatic transcription and key moment extraction.'
      },
      ai: {
        title: 'AI Node',
        content: '',
      },
    };

    const template = typeTemplates[type];
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      title: template.title,
      content: template.content,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 }
    };

    setContentItems(items => [...items, newNode]);
  };

  // Center position for AI Hub
  const canvasWidth = 1200;
  const canvasHeight = 700;
  const aiHubPos = { x: canvasWidth / 2, y: canvasHeight / 2 };

  // Helper to get node center
  const getNodeCenter = (pos: { x: number; y: number }) => ({ x: pos.x + 144, y: pos.y + 80 });

  // Edge gradient
  const edgeGradient = 'url(#edge-gradient)';

  // Handle AI Hub actions
  // Map action to output node type
  const actionToOutputType: Record<string, OutputNodeType> = {
    summarize: 'research',
    insights: 'research',
    ideas: 'brainstorm',
  };

  // Output node vertical layout
  const outputStartY = 180;
  const outputSpacing = 80;

  const handleAIHubAction = (action: string) => {
    // Create output node if not already present for this action
    const type = actionToOutputType[action] || 'blog';
    const id = `output-${type}`;
    if (!outputNodes.find((n) => n.id === id)) {
      setOutputNodes((prev) => [
        ...prev,
        {
          id,
          type,
          title:
            type === 'research' && action === 'insights'
              ? 'Key Insights'
              : type === 'research'
              ? 'Summary'
              : type === 'brainstorm'
              ? 'Brainstorm'
              : 'Blog Article',
          y: outputStartY + prev.length * outputSpacing,
        },
      ]);
    }
    setSelectedOutputNode(id);
  };

  return (
    <div className="w-full h-screen bg-gray-50 relative overflow-hidden flex">
      {/* Main Canvas Area */}
      <div className="flex-1 relative" style={{ minWidth: canvasWidth, minHeight: canvasHeight }}>
        {/* Canvas Background */}
        <div
          className="w-full h-full relative"
          style={{
            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            minWidth: canvasWidth,
            minHeight: canvasHeight,
          }}
        >
          {/* Animated SVG Edges from input nodes to AI Hub */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="output-edge-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" />
              </marker>
            </defs>
            {/* Input node edges */}
            {contentItems.map((item) => {
              const from = getNodeCenter(item.position);
              const to = { x: aiHubPos.x, y: aiHubPos.y };
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const qx = from.x + dx * 0.5 + (dy > 0 ? 60 : -60);
              const qy = from.y + dy * 0.5;
              return (
                <path
                  key={item.id}
                  d={`M ${from.x} ${from.y} Q ${qx} ${qy} ${to.x} ${to.y}`}
                  stroke="url(#edge-gradient)"
                  strokeWidth="4"
                  fill="none"
                  markerEnd="url(#arrow)"
                  style={{ filter: 'drop-shadow(0 0 8px #a78bfa88)' }}
                />
              );
            })}
            {/* Output node edges (dashed, animated) */}
            {outputNodes.map((node, i) => {
              const from = { x: aiHubPos.x + 180, y: aiHubPos.y };
              const to = { x: aiHubPos.x + 380, y: node.y + 40 };
              const qx = from.x + 80;
              const qy = from.y + (to.y - from.y) * 0.5;
              return (
                <path
                  key={node.id}
                  d={`M ${from.x} ${from.y} Q ${qx} ${qy} ${to.x} ${to.y}`}
                  stroke="url(#output-edge-gradient)"
                  strokeWidth="4"
                  fill="none"
                  markerEnd="url(#arrow)"
                  strokeDasharray="10 8"
                  style={{ filter: 'drop-shadow(0 0 8px #38bdf888)', animation: 'dashmove 2s linear infinite' }}
                />
              );
            })}
          </svg>

          {/* Draggable Node Cards */}
          {contentItems.map((item) => (
            <DraggableNode
              key={item.id}
              id={item.id}
              title={item.title}
              type={item.type}
              description={item.content}
              position={item.position}
              onPositionChange={handlePositionChange}
              isSelected={selectedCard === item.id}
              onSelect={() => {
                setSelectedCard(item.id);
                setAIHubHighlighted(true);
                if (item.type === 'pdf') setAIHubActions([{ label: 'Summarize', key: 'summarize', color: 'from-purple-500 to-pink-500' }, { label: 'Key Insights', key: 'insights', color: 'from-blue-500 to-cyan-500' }]);
                else if (item.type === 'text') setAIHubActions([{ label: 'Summarize', key: 'summarize', color: 'from-purple-500 to-pink-500' }, { label: 'Generate Ideas', key: 'ideas', color: 'from-green-500 to-lime-500' }]);
                else if (item.type === 'image') setAIHubActions([{ label: 'Key Insights', key: 'insights', color: 'from-blue-500 to-cyan-500' }]);
                else if (item.type === 'video') setAIHubActions([{ label: 'Summarize', key: 'summarize', color: 'from-purple-500 to-pink-500' }]);
                else setAIHubActions(actions);
              }}
              onOpen={() => console.log(`Opening ${item.title}`)}
              onMore={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
            />
          ))}

          {/* Output Nodes (vertical layout) */}
          <div className="absolute top-0 right-0 flex flex-col items-center" style={{ left: aiHubPos.x + 340, top: outputStartY - 40 }}>
            {outputNodes.map((node, i) => (
              <div key={node.id} style={{ position: 'absolute', top: node.y, left: 0, zIndex: 20 }}>
                <OutputNodeCard
                  type={node.type}
                  title={node.title}
                  isSelected={selectedOutputNode === node.id}
                  onClick={() => setSelectedOutputNode(node.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Toolbar */}
        <CanvasToolbar onAddNode={handleAddNode} />
      </div>

  {/* (Right-side assistant panel removed) */}
    </div>
  );
};

export default AICanvas;
