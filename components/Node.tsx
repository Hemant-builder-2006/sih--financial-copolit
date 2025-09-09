// Node.tsx
import React, { useRef } from 'react';
import { NodeType, useCanvasStore } from '../store/canvasStore';
import { motion } from 'framer-motion';

interface NodeProps {
  node: NodeType;
  onEdgeStart?: (e: React.MouseEvent) => void;
  onEdgeDrop?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}

const Node: React.FC<NodeProps> = ({ node, onEdgeStart, onEdgeDrop, onContextMenu, onDoubleClick }) => {
  const { updateNode, snapToGrid } = useCanvasStore();
  const nodeRef = useRef<HTMLDivElement>(null);

  // Drag logic for Framer Motion (PanInfo gives offset)
  const handleDragEnd = (_: MouseEvent | PointerEvent | TouchEvent, info: any) => {
    // info.point gives the absolute position - snap to grid
    const x = snapToGrid(info.point.x - node.width / 2);
    const y = snapToGrid(info.point.y - node.height / 2);
    updateNode(node.id, { x, y });
  };

  // If an edge is being dragged, allow drop
  const handleMouseUp = (e: React.MouseEvent) => {
    console.log('Node mouse up:', node.id, 'onEdgeDrop available:', !!onEdgeDrop);
    if (onEdgeDrop) {
      e.stopPropagation();
      console.log('Calling onEdgeDrop for node:', node.id);
      onEdgeDrop();
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      className="absolute bg-white rounded-lg shadow-md border border-neutral-200 select-none flex items-center justify-center cursor-move group"
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        zIndex: 10,
      }}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onMouseUp={handleMouseUp}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Edge drag handle (right side) */}
      {onEdgeStart && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform cursor-crosshair z-20"
          style={{ transform: 'translateY(-50%) translateX(50%)' }}
          onMouseDown={(e) => {
            console.log('Edge handle clicked on node:', node.id);
            if (onEdgeStart) onEdgeStart(e);
          }}
          title="Create connection"
        />
      )}

      {/* Node Content based on type */}
      <div className="w-full h-full p-2 flex flex-col justify-center">
        {node.type === 'text' && (
          <div className="text-neutral-700 text-sm text-center break-words">
            {node.content}
          </div>
        )}
        
        {node.type === 'image' && (
          <div className="w-full h-full flex flex-col">
            {node.content.startsWith('data:') ? (
              <img 
                src={node.content} 
                alt="Node content"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 rounded">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-xs text-neutral-600 text-center break-words">
                  {node.content}
                </span>
              </div>
            )}
          </div>
        )}
        
        {node.type === 'pdf' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 rounded">
            <span className="text-2xl mb-1">📄</span>
            <span className="text-xs text-neutral-600 text-center break-words">
              {node.content}
            </span>
          </div>
        )}
        
        {node.type === 'video' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 rounded">
            <span className="text-2xl mb-1">🎥</span>
            <span className="text-xs text-neutral-600 text-center break-words">
              {node.content}
            </span>
          </div>
        )}
      </div>

      {/* Node type indicator */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-xs shadow-sm">
        {node.type === 'text' && '📝'}
        {node.type === 'image' && '🖼️'}
        {node.type === 'pdf' && '📄'}
        {node.type === 'video' && '🎥'}
      </div>
    </motion.div>
  );
};

export default Node;
