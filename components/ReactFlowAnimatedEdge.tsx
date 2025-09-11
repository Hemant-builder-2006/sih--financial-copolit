import React from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';

const ReactFlowAnimatedEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const { setEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const deleteEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Deleting edge:', id); // Debug log
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-2 hover:stroke-3 transition-all duration-200"
        d={edgePath}
        markerEnd={markerEnd}
        stroke={`url(#gradient-${id})`}
        strokeWidth={2}
        fill="none"
        filter={`url(#glow-${id})`}
      />

      {/* Animated flowing dots */}
      <circle
        r="3"
        fill="#8b5cf6"
        className="opacity-80"
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      
      <circle
        r="2"
        fill="#c084fc"
        className="opacity-60"
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
          begin="1s"
        />
      </circle>

      {/* Delete button - always visible and easy to click */}
      <g 
        className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200"
        onClick={deleteEdge}
        onMouseDown={deleteEdge}
        style={{ pointerEvents: 'all' }}
      >
        {/* Larger invisible clickable area */}
        <circle
          cx={labelX}
          cy={labelY}
          r="15"
          fill="transparent"
          className="cursor-pointer"
          onClick={deleteEdge}
        />
        {/* Visible delete button */}
        <circle
          cx={labelX}
          cy={labelY}
          r="8"
          fill="white"
          stroke="#ef4444"
          strokeWidth="2"
          className="hover:fill-red-50 cursor-pointer"
        />
        {/* X icon */}
        <path
          d={`M ${labelX - 3} ${labelY - 3} L ${labelX + 3} ${labelY + 3} M ${labelX + 3} ${labelY - 3} L ${labelX - 3} ${labelY + 3}`}
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="pointer-events-none"
        />
      </g>
    </>
  );
};

export default ReactFlowAnimatedEdge;
