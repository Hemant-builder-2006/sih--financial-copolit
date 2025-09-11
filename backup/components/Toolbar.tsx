// Toolbar.tsx
import React from 'react';

interface ToolbarProps {
  onAddTextNode: () => void;
  onAddImageNode: () => void;
  onClearCanvas: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddTextNode, onAddImageNode, onClearCanvas }) => {
  const tools = [
    { label: 'AI Node', action: onAddTextNode, icon: '🤖' },
    { label: 'AI Analyzer', action: onAddImageNode, icon: '🔍' },
  ];

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex gap-2 z-30">
      {tools.map((tool, index) => (
        <button
          key={index}
          className="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-2 transition-colors"
          onClick={tool.action}
        >
          <span>{tool.icon}</span>
          {tool.label}
        </button>
      ))}
      
      <div className="border-l border-neutral-200 mx-1"></div>
      
      {/* Save/Load placeholder - would need SaveLoad component */}
      <button
        onClick={onClearCanvas}
        className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
      >
        🗑️ Clear
      </button>
    </div>
  );
};

export default Toolbar;
