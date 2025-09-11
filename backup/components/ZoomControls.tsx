// components/ZoomControls.tsx
import React from 'react';

interface ZoomControlsProps {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ 
  zoom = 1, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom 
}) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex flex-col gap-1 z-30">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-neutral-100 rounded text-lg font-bold text-neutral-600 transition-colors"
        title="Zoom In (Ctrl + +)"
      >
        +
      </button>
      
      <div className="text-xs text-center text-neutral-500 px-2 py-1 min-w-[3rem]">
        {Math.round(zoom * 100)}%
      </div>
      
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-neutral-100 rounded text-lg font-bold text-neutral-600 transition-colors"
        title="Zoom Out (Ctrl + -)"
      >
        −
      </button>
      
      <div className="border-t border-neutral-200 my-1"></div>
      
      <button
        onClick={onResetZoom}
        className="p-2 hover:bg-neutral-100 rounded text-xs text-neutral-600 transition-colors"
        title="Reset View (Ctrl + 0)"
      >
        ⌂
      </button>
    </div>
  );
};

export default ZoomControls;
