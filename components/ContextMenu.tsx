// ContextMenu.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onSummarize: () => void;
  onExpandIdea: () => void;
  onTag: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  x,
  y,
  onClose,
  onEdit,
  onSummarize,
  onExpandIdea,
  onTag,
}) => {
  const menuItems = [
    { label: 'Edit', action: onEdit, icon: '✏️' },
    { label: 'Summarize with AI', action: onSummarize, icon: '🤖' },
    { label: 'Expand Idea', action: onExpandIdea, icon: '💡' },
    { label: 'Tag', action: onTag, icon: '🏷️' },
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
          {/* Menu */}
          <motion.div
            className="absolute bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-neutral-100 flex items-center gap-3 text-sm text-neutral-700 transition-colors"
                onClick={() => {
                  item.action();
                  onClose();
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
