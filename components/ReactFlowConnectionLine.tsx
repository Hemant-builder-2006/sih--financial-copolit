import React from 'react';

interface CustomConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  connectionLineStyle?: React.CSSProperties;
}

const ReactFlowConnectionLine: React.FC<CustomConnectionLineProps> = ({ 
  fromX, 
  fromY, 
  toX, 
  toY, 
  connectionLineStyle 
}) => {
  return (
    <g>
      <defs>
        <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
        </linearGradient>
        <filter id="connection-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Animated connection line */}
      <path
        d={`M${fromX},${fromY} C ${fromX + 50},${fromY} ${toX - 50},${toY} ${toX},${toY}`}
        stroke="url(#connection-gradient)"
        strokeWidth={3}
        fill="none"
        strokeDasharray="8,4"
        strokeLinecap="round"
        filter="url(#connection-glow)"
        style={{
          animation: 'dash 1.5s linear infinite',
        }}
      />
      
      {/* Animated dot at the cursor end */}
      <circle
        cx={toX}
        cy={toY}
        r="4"
        fill="#8b5cf6"
        style={{
          animation: 'pulse-glow 1s ease-in-out infinite',
        }}
      />
    </g>
  );
};

export default ReactFlowConnectionLine;
