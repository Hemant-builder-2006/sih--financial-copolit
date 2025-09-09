// components/AIContextMenu.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAICanvasStore } from '../store/aiCanvasStore';
import { ContextMenuAction } from '../types/canvas';

interface AIContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  nodeId: string;
  onClose: () => void;
}

export const AIContextMenu: React.FC<AIContextMenuProps> = ({
  isOpen,
  x,
  y,
  nodeId,
  onClose,
}) => {
  const { executeAIAction, deleteNode, isLoading } = useAICanvasStore();

  const contextActions: ContextMenuAction[] = [
    {
      id: 'summarize',
      label: 'Summarize with AI',
      icon: '🤖',
      action: async (id) => {
        await executeAIAction({ type: 'summarize', nodeId: id });
        onClose();
      },
      disabled: isLoading,
    },
    {
      id: 'expand',
      label: 'Expand Idea',
      icon: '💡',
      action: async (id) => {
        await executeAIAction({ type: 'expand', nodeId: id });
        onClose();
      },
      disabled: isLoading,
    },
    {
      id: 'tag',
      label: 'Auto-tag',
      icon: '🏷️',
      action: (id) => {
        // Auto-generate tags
        executeAIAction({ type: 'tag', nodeId: id });
        onClose();
      },
      disabled: isLoading,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      action: (id) => {
        deleteNode(id);
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Context Menu */}
          <motion.div
            className="fixed bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50 min-w-[200px]"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {contextActions.map((action, index) => (
              <motion.button
                key={action.id}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-neutral-100 transition-colors flex items-center gap-3 ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${action.id === 'delete' ? 'text-red-600 hover:bg-red-50' : 'text-neutral-700'}`}
                onClick={() => !action.disabled && action.action(nodeId)}
                disabled={action.disabled}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
              >
                <span className="text-base">{action.icon}</span>
                <span>{action.label}</span>
                {action.disabled && isLoading && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
