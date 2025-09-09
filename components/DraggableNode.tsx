import React, { useState, useRef } from 'react';
import NodeCard from './NodeCard';

interface DraggableNodeProps {
  id: string;
  title: string;
  type: "text" | "pdf" | "image" | "video" | "ai";
  description: string;
  position: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onOpen?: () => void;
  onMore?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({
  id,
  title,
  type,
  description,
  position,
  onPositionChange,
  onOpen,
  onMore,
  isSelected = false,
  onSelect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    setIsDragging(true);
    onSelect?.();
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const canvas = nodeRef.current?.parentElement;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y
    };

    // Keep within canvas bounds
    const maxX = canvasRect.width - 288; // NodeCard width (w-72 = 288px)
    const maxY = canvasRect.height - 200; // Approximate NodeCard height

    newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
    newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));

    onPositionChange?.(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none transition-transform duration-200 ${
        isDragging ? 'z-50 scale-105' : 'z-10'
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-2xl' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        transform: isDragging ? 'rotate(2deg)' : 'rotate(0deg)'
      }}
      onMouseDown={handleMouseDown}
    >
      <NodeCard
        title={title}
        type={type}
        description={description}
        onOpen={onOpen}
        onMore={onMore}
        className={isDragging ? 'shadow-2xl' : ''}
      />
    </div>
  );
};

export default DraggableNode;
