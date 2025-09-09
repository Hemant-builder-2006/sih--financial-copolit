// Edge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { EdgeType, useCanvasStore } from '../store/canvasStore';
import EdgeLabel from './EdgeLabel';

interface EdgeProps {
  edge: EdgeType;
}

const Edge: React.FC<EdgeProps> = ({ edge }) => {
  const { nodes, updateEdge } = useCanvasStore();
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);
  
  if (!fromNode || !toNode) return null;

  // Calculate connection points
  const x1 = fromNode.x + fromNode.width / 2;
  const y1 = fromNode.y + fromNode.height / 2;
  const x2 = toNode.x + toNode.width / 2;
  const y2 = toNode.y + toNode.height / 2;

  // Calculate curved path
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Control points for smooth curve
  const curvature = 0.3;
  const controlOffset = distance * curvature;
  
  const cx1 = x1 + (dx > 0 ? controlOffset : -controlOffset);
  const cy1 = y1;
  const cx2 = x2 - (dx > 0 ? controlOffset : -controlOffset);
  const cy2 = y2;

  const pathData = `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;

  // Calculate midpoint for label
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const handleLabelChange = (newLabel: string) => {
    if (updateEdge) {
      updateEdge(edge.id, { label: newLabel });
    }
  };

  return (
    <svg className="absolute pointer-events-none" style={{ left: 0, top: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
        </marker>
        <marker id="arrow-hover" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
        </marker>
      </defs>
      
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group"
      >
        {/* Edge path */}
        <path
          d={pathData}
          stroke="#6b7280"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow)"
          className="pointer-events-auto hover:stroke-blue-500 cursor-pointer transition-colors"
          style={{ 
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          }}
        />
        
        {/* Invisible thicker path for easier hover/click */}
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth={12}
          fill="none"
          className="pointer-events-auto cursor-pointer"
        />
      </motion.g>

      {/* Edge Label */}
      <EdgeLabel
        x={midX}
        y={midY}
        label={edge.label || ''}
        onLabelChange={handleLabelChange}
      />
    </svg>
  );
};

export default Edge;
