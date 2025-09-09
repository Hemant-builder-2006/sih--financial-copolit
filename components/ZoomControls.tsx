// components/ZoomControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';

const ZoomControls: React.FC = () => {
  const { zoom, setZoom, resetView } = useCanvasStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    resetView();
  };

  return (
    <motion.div
      className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex flex-col gap-1 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <button
        onClick={handleZoomIn}
        className="p-2 hover:bg-neutral-100 rounded text-lg font-bold text-neutral-600 transition-colors"
        title="Zoom In (Ctrl + +)"
      >
        +
      </button>
      
      <div className="text-xs text-center text-neutral-500 px-2 py-1 min-w-[3rem]">
        {Math.round(zoom * 100)}%
      </div>
      
      <button
        onClick={handleZoomOut}
        className="p-2 hover:bg-neutral-100 rounded text-lg font-bold text-neutral-600 transition-colors"
        title="Zoom Out (Ctrl + -)"
      >
        −
      </button>
      
      <div className="border-t border-neutral-200 my-1"></div>
      
      <button
        onClick={handleResetZoom}
        className="p-2 hover:bg-neutral-100 rounded text-xs text-neutral-600 transition-colors"
        title="Reset View (Ctrl + 0)"
      >
        ⌂
      </button>
    </motion.div>
  );
};

export default ZoomControls;
