// components/EdgeLabel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EdgeLabelProps {
  x: number;
  y: number;
  label: string;
  onLabelChange: (newLabel: string) => void;
}

const EdgeLabel: React.FC<EdgeLabelProps> = ({ x, y, label, onLabelChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempLabel(label);
  };

  const handleSubmit = () => {
    onLabelChange(tempLabel);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempLabel(label);
    }
  };

  if (isEditing) {
    return (
      <foreignObject x={x - 40} y={y - 10} width={80} height={20}>
        <input
          type="text"
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0 text-xs border border-blue-300 rounded bg-white text-center"
          autoFocus
        />
      </foreignObject>
    );
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <rect
        x={x - (label.length * 3 + 8)}
        y={y - 8}
        width={label.length * 6 + 16}
        height={16}
        rx={8}
        fill="white"
        stroke="#e5e7eb"
        strokeWidth={1}
        className="cursor-pointer"
        onDoubleClick={handleDoubleClick}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        className="text-xs fill-neutral-600 cursor-pointer pointer-events-none"
        onDoubleClick={handleDoubleClick}
      >
        {label || 'Label'}
      </text>
    </motion.g>
  );
};

export default EdgeLabel;
