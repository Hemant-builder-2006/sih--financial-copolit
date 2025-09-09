// components/NodeInspector.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAICanvasStore } from '../store/aiCanvasStore';
import { AINode } from '../types/canvas';

interface NodeInspectorProps {
  nodeId: string;
  className?: string;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ nodeId, className }) => {
  const { nodes, updateNode, executeAIAction, isLoading } = useAICanvasStore();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const node = nodes.find((n) => n.id === nodeId);
  
  if (!node) return null;

  const handleContentChange = (newContent: string) => {
    updateNode(nodeId, { content: newContent });
  };

  const handleTypeChange = (newType: AINode['type']) => {
    updateNode(nodeId, { type: newType });
  };

  const aiActions = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: '🤖',
      action: () => executeAIAction({ type: 'summarize', nodeId }),
    },
    {
      id: 'expand',
      label: 'Expand Idea',
      icon: '💡',
      action: () => executeAIAction({ type: 'expand', nodeId }),
    },
  ];

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg border border-neutral-200 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
          <span className="text-lg">
            {node.type === 'text' && '📝'}
            {node.type === 'image' && '🖼️'}
            {node.type === 'pdf' && '📄'}
            {node.type === 'video' && '🎥'}
            {node.type === 'audio' && '🎵'}
          </span>
          Node Inspector
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="p-4 space-y-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Node Type Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Node Type
              </label>
              <select
                value={node.type}
                onChange={(e) => handleTypeChange(e.target.value as AINode['type'])}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">📝 Text</option>
                <option value="image">🖼️ Image</option>
                <option value="pdf">📄 PDF</option>
                <option value="video">🎥 Video</option>
                <option value="audio">🎵 Audio</option>
              </select>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Content
              </label>
              <textarea
                value={node.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Enter node content..."
              />
            </div>

            {/* Position & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Position
                </label>
                <div className="text-sm text-neutral-500">
                  x: {Math.round(node.x)}, y: {Math.round(node.y)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Size
                </label>
                <div className="text-sm text-neutral-500">
                  {node.width} × {node.height}
                </div>
              </div>
            </div>

            {/* AI Actions */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                AI Actions
              </label>
              <div className="flex gap-2">
                {aiActions.map((action) => (
                  <motion.button
                    key={action.id}
                    onClick={action.action}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1">{action.icon}</span>
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      action.label
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Metadata */}
            {node.metadata && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Metadata
                </label>
                
                {/* Summary */}
                {node.metadata.summary && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-neutral-600 mb-1">
                      AI Summary
                    </div>
                    <div className="text-sm text-neutral-700 bg-blue-50 p-2 rounded">
                      {node.metadata.summary}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {node.metadata.tags && node.metadata.tags.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-neutral-600 mb-1">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {node.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source File */}
                {node.metadata.sourceFile && (
                  <div>
                    <div className="text-xs font-medium text-neutral-600 mb-1">
                      Source File
                    </div>
                    <div className="text-sm text-neutral-700">
                      {node.metadata.sourceFile}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Creation Date */}
            <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-200">
              Created: {new Date(node.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
