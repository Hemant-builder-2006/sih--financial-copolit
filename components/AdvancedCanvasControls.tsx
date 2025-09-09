// components/AdvancedCanvasControls.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedCanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen: () => void;
  onToggleGrid: () => void;
  showGrid: boolean;
  onToggleMinimap: () => void;
  showMinimap: boolean;
  className?: string;
}

export const AdvancedCanvasControls: React.FC<AdvancedCanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  onToggleGrid,
  showGrid,
  onToggleMinimap,
  showMinimap,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 ${className}`}
    >
      {/* Zoom Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded text-sm">
          <span className="text-gray-600">Zoom:</span>
          <span className="font-mono font-semibold">{Math.round(zoom * 100)}%</span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In (Ctrl/Cmd + +)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out (Ctrl/Cmd + -)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
          
          <button
            onClick={onResetZoom}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Reset Zoom (Ctrl/Cmd + 0)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={onFitToScreen}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Fit to Screen (F)"
        >
          📐 Fit All
        </button>
        
        <hr className="border-gray-200" />
        
        {/* View Controls */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onToggleGrid}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              showGrid 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Toggle Grid (G)"
          >
            {showGrid ? '🟢' : '⚫'} Grid
          </button>
          
          <button
            onClick={onToggleMinimap}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              showMinimap 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Toggle Minimap (M)"
          >
            {showMinimap ? '🟢' : '⚫'} Map
          </button>
        </div>
      </div>
    </motion.div>
  );
};
