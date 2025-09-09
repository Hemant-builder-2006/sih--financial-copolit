// components/NodeEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeType, useCanvasStore } from '../store/canvasStore';

interface NodeEditorProps {
  node: NodeType;
  isOpen: boolean;
  onClose: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, isOpen, onClose }) => {
  const [content, setContent] = useState(node.content);
  const [nodeType, setNodeType] = useState(node.type);
  const [isEditing, setIsEditing] = useState(false);
  const { updateNode } = useCanvasStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isOpen]);

  const handleSave = () => {
    updateNode(node.id, { content, type: nodeType });
    setIsEditing(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const nodeTypeOptions = [
    { value: 'text', label: '📝 Text', color: 'bg-blue-100' },
    { value: 'image', label: '🖼️ Image', color: 'bg-green-100' },
    { value: 'pdf', label: '📄 PDF', color: 'bg-red-100' },
    { value: 'video', label: '🎥 Video', color: 'bg-purple-100' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          {/* Editor Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-96 max-w-[90vw]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Node</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {/* Node Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {nodeTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNodeType(option.value as NodeType['type'])}
                    className={`p-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      nodeType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${option.color}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter node content..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Save
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
              Press Ctrl+Enter to save, Esc to cancel
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeEditor;
