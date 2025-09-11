// components/FileDropZone.tsx
import React, { useCallback, useState } from 'react';

interface FileDropZoneProps {
  onFilesDrop?: (files: File[], position: { x: number; y: number }) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(dragCounter + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, [dragCounter]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(dragCounter - 1);
    if (dragCounter - 1 === 0) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const rect = e.currentTarget.getBoundingClientRect();
    
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (onFilesDrop) {
      onFilesDrop(files, position);
    }
  }, [onFilesDrop]);

  return (
    <>
      {/* File drop overlay */}
      <div
        className="absolute inset-0 z-40"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-4 border-blue-500 border-dashed z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-blue-500">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Drop files here</h3>
            <p className="text-sm text-neutral-600">
              Support for images, PDFs, videos, and text files
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropZone;
