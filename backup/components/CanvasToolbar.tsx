import React, { useState } from 'react';

interface CanvasToolbarProps {
  onAddNode: (type: "text" | "pdf" | "image" | "video" | "ai") => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const nodeTypes = [
    { type: 'text' as const, label: 'Text Note', icon: '📝', color: 'text-blue-600' },
    { type: 'pdf' as const, label: 'PDF Doc', icon: '📄', color: 'text-red-600' },
    { type: 'image' as const, label: 'Image', icon: '🖼️', color: 'text-green-600' },
    { type: 'video' as const, label: 'Video', icon: '🎥', color: 'text-purple-600' },
    { type: 'ai' as const, label: 'AI Node', icon: '🤖', color: 'text-fuchsia-600' },
  ];

  return (
    <div className="absolute top-4 left-4 z-30 bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="w-4 h-4">➕</span>
          <span>Add Node</span>
          <span className={`w-2 h-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] py-1 z-50">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => {
                  onAddNode(nodeType.type);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="w-4 h-4">{nodeType.icon}</span>
                <span className={nodeType.color}>{nodeType.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Backdrop to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasToolbar;
