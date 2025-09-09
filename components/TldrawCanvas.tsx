// components/TldrawCanvas.tsx
'use client';

import React from 'react';

// Placeholder component - TldrawCanvas is not used
// Use AICanvas instead for the working AI-powered canvas
interface TldrawCanvasProps {
  className?: string;
}

export const TldrawCanvas: React.FC<TldrawCanvasProps> = ({ className }) => {
  return (
    <div className={`${className} flex items-center justify-center h-full bg-gray-50`}>
      <div className="text-center text-gray-500">
        <h3 className="text-lg font-semibold mb-2">TldrawCanvas (Deprecated)</h3>
        <p>This component is not in use.</p>
        <p>Please use the <strong>AICanvas</strong> component instead.</p>
        <div className="mt-4">
          <a 
            href="/ai-canvas" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go to AI Canvas
          </a>
        </div>
      </div>
    </div>
  );
};
