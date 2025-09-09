// components/AIToolbar.tsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAICanvasStore } from '../store/aiCanvasStore';
import { AINode } from '../types/canvas';

interface AIToolbarProps {
  className?: string;
}

export const AIToolbar: React.FC<AIToolbarProps> = ({ className }) => {
  const { addNode, loadWorkspace, exportWorkspace, clearCanvas, nodes } = useAICanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNode = (type: AINode['type'], content: string) => {
    const x = Math.random() * 400 + 100;
    const y = Math.random() * 300 + 100;
    
    const dimensions = {
      text: { width: 200, height: 100 },
      image: { width: 250, height: 180 },
      pdf: { width: 220, height: 140 },
      video: { width: 300, height: 200 },
      audio: { width: 280, height: 120 },
    };

    addNode({
      type,
      content,
      x,
      y,
      ...dimensions[type],
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    let nodeType: AINode['type'] = 'text';
    
    if (fileType.startsWith('image/')) {
      nodeType = 'image';
    } else if (fileType === 'application/pdf') {
      nodeType = 'pdf';
    } else if (fileType.startsWith('video/')) {
      nodeType = 'video';
    } else if (fileType.startsWith('audio/')) {
      nodeType = 'audio';
    }

    // For images, create a preview URL
    if (nodeType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        createNode(nodeType, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      createNode(nodeType, file.name);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportData = () => {
    const data = exportWorkspace();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-canvas-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        loadWorkspace(data);
      } catch (error) {
        console.error('Failed to import workspace:', error);
      }
    };
    reader.readAsText(file);
  };

  const tools = [
    {
      id: 'text',
      label: 'Text Node',
      icon: '📝',
      action: () => createNode('text', 'New text node'),
    },
    {
      id: 'image',
      label: 'Image Node',
      icon: '🖼️',
      action: () => createNode('image', 'Image placeholder'),
    },
    {
      id: 'pdf',
      label: 'PDF Node',
      icon: '📄',
      action: () => createNode('pdf', 'PDF document'),
    },
    {
      id: 'video',
      label: 'Video Node',
      icon: '🎥',
      action: () => createNode('video', 'Video content'),
    },
    {
      id: 'audio',
      label: 'Audio Node',
      icon: '🎵',
      action: () => createNode('audio', 'Audio content'),
    },
  ];

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg border border-neutral-200 p-3 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap gap-2 items-center">
        {/* Node Creation Tools */}
        <div className="flex gap-1">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={tool.action}
              className="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={tool.label}
            >
              <span>{tool.icon}</span>
              <span className="hidden sm:inline">{tool.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="w-px h-6 bg-neutral-300 mx-2" />

        {/* File Operations */}
        <div className="flex gap-1">
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Upload File"
          >
            <span>📤</span>
            <span className="hidden sm:inline">Upload</span>
          </motion.button>

          <motion.button
            onClick={exportData}
            className="px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-md flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Export Workspace"
          >
            <span>💾</span>
            <span className="hidden sm:inline">Export</span>
          </motion.button>

          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Import Workspace"
          >
            <span>📂</span>
            <span className="hidden sm:inline">Import</span>
          </motion.button>
        </div>

        <div className="w-px h-6 bg-neutral-300 mx-2" />

        {/* Clear Canvas */}
        <motion.button
          onClick={() => {
            if (confirm('Clear entire canvas? This cannot be undone.')) {
              clearCanvas();
            }
          }}
          className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md flex items-center gap-2 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Clear Canvas"
          disabled={nodes.length === 0}
        >
          <span>🗑️</span>
          <span className="hidden sm:inline">Clear</span>
        </motion.button>

        {/* Node Count */}
        <div className="text-xs text-neutral-500 ml-2">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,application/pdf,.txt,.md,.json"
      />
    </motion.div>
  );
};
