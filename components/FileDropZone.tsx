// components/FileDropZone.tsx
import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';

const FileDropZone: React.FC = () => {
  const { addNode, snapToGrid } = useCanvasStore();
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
    
    files.forEach((file, index) => {
      const x = snapToGrid(e.clientX - rect.left + (index * 20));
      const y = snapToGrid(e.clientY - rect.top + (index * 20));
      
      let nodeType: 'text' | 'image' | 'pdf' | 'video' = 'text';
      let content = file.name;
      
      // Determine node type based on file extension
      if (file.type.startsWith('image/')) {
        nodeType = 'image';
      } else if (file.type === 'application/pdf') {
        nodeType = 'pdf';
      } else if (file.type.startsWith('video/')) {
        nodeType = 'video';
      }
      
      // For images, create a preview URL
      if (nodeType === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          addNode({
            x,
            y,
            width: 200,
            height: 150,
            type: nodeType,
            content: imageUrl,
          });
        };
        reader.readAsDataURL(file);
      } else {
        addNode({
          x,
          y,
          width: 180,
          height: 100,
          type: nodeType,
          content,
        });
      }
    });
  }, [addNode, snapToGrid]);

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
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            className="absolute inset-0 bg-blue-500 bg-opacity-10 border-4 border-blue-500 border-dashed z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 shadow-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 text-blue-500">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Drop files here</h3>
              <p className="text-sm text-neutral-600">
                Support for images, PDFs, videos, and text files
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FileDropZone;
