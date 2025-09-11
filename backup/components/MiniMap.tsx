// components/MiniMap.tsx
import React from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

interface MiniMapProps {
  nodes?: Node[];
  edges?: Edge[];
  zoom?: number;
  panX?: number;
  panY?: number;
  onMapClick?: (x: number, y: number) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ 
  nodes = [], 
  edges = [], 
  zoom = 1, 
  panX = 0, 
  panY = 0, 
  onMapClick 
}) => {
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const SCALE_FACTOR = 0.1;

  // Calculate bounds of all nodes
  const bounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height),
    }),
    { minX: 0, minY: 0, maxX: 1000, maxY: 1000 }
  );

  const handleMiniMapClick = (e: React.MouseEvent) => {
    if (!onMapClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / SCALE_FACTOR;
    const y = (e.clientY - rect.top) / SCALE_FACTOR;
    
    onMapClick(x, y);
  };

  if (nodes.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 z-30">
      <div className="text-xs text-neutral-600 mb-2 font-medium">Mini Map</div>
      
      <div
        className="relative bg-neutral-50 rounded border border-neutral-200 cursor-pointer"
        style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
        onClick={handleMiniMapClick}
      >
        {/* Canvas viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 rounded"
          style={{
            left: Math.max(0, Math.min(MINIMAP_WIDTH - 50, (-panX / zoom) * SCALE_FACTOR)),
            top: Math.max(0, Math.min(MINIMAP_HEIGHT - 30, (-panY / zoom) * SCALE_FACTOR)),
            width: Math.min(MINIMAP_WIDTH, (window.innerWidth / zoom) * SCALE_FACTOR),
            height: Math.min(MINIMAP_HEIGHT, (window.innerHeight / zoom) * SCALE_FACTOR),
          }}
        />

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute bg-neutral-400 rounded"
            style={{
              left: (node.x - bounds.minX) * SCALE_FACTOR,
              top: (node.y - bounds.minY) * SCALE_FACTOR,
              width: Math.max(4, node.width * SCALE_FACTOR),
              height: Math.max(3, node.height * SCALE_FACTOR),
            }}
          />
        ))}

        {/* Edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
        >
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            const x1 = (fromNode.x + fromNode.width / 2 - bounds.minX) * SCALE_FACTOR;
            const y1 = (fromNode.y + fromNode.height / 2 - bounds.minY) * SCALE_FACTOR;
            const x2 = (toNode.x + toNode.width / 2 - bounds.minX) * SCALE_FACTOR;
            const y2 = (toNode.y + toNode.height / 2 - bounds.minY) * SCALE_FACTOR;
            
            return (
              <line
                key={edge.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9ca3af"
                strokeWidth={1}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="text-xs text-neutral-500 mt-1 text-center">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default MiniMap;
