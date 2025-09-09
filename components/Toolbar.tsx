// Toolbar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import SaveLoad from './SaveLoad';

interface ToolbarProps {
  onAddTextNode: () => void;
  onAddImageNode: () => void;
  onClearCanvas: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddTextNode, onAddImageNode, onClearCanvas }) => {
  const tools = [
    { label: 'Text Node', action: onAddTextNode, icon: '📝' },
    { label: 'Image Node', action: onAddImageNode, icon: '🖼️' },
  ];

  return (
    <motion.div
      className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex gap-2 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {tools.map((tool, index) => (
        <motion.button
          key={index}
          className="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-2 transition-colors"
          onClick={tool.action}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{tool.icon}</span>
          {tool.label}
        </motion.button>
      ))}
      
      <div className="border-l border-neutral-200 mx-1"></div>
      
      <SaveLoad />
    </motion.div>
  );
};

export default Toolbar;
