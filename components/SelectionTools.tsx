// components/SelectionTools.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectionToolsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onGroupSelected: () => void;
  onUngroupSelected: () => void;
  onDuplicateSelected: () => void;
  onAlignNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeNodes: (direction: 'horizontal' | 'vertical') => void;
  className?: string;
}

export const SelectionTools: React.FC<SelectionToolsProps> = ({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onGroupSelected,
  onUngroupSelected,
  onDuplicateSelected,
  onAlignNodes,
  onDistributeNodes,
  className,
}) => {
  const [showAlignMenu, setShowAlignMenu] = useState(false);

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 ${className}`}
        >
          <div className="flex items-center gap-3">
            {/* Selection Info */}
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded text-sm">
              <span className="font-semibold text-blue-800">{selectedCount}</span>
              <span className="text-blue-600">selected</span>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-1">
              <button
                onClick={onDuplicateSelected}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Duplicate (Ctrl/Cmd + D)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button
                onClick={onDeleteSelected}
                className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                title="Delete (Delete/Backspace)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {selectedCount > 1 && (
              <>
                <div className="w-px h-6 bg-gray-300"></div>
                
                {/* Alignment Tools */}
                <div className="relative">
                  <button
                    onClick={() => setShowAlignMenu(!showAlignMenu)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Alignment Tools"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showAlignMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px] z-50"
                      >
                        <div className="text-xs text-gray-500 mb-2 px-2">Align</div>
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <button
                            onClick={() => { onAlignNodes('left'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Left"
                          >
                            ⬅️
                          </button>
                          <button
                            onClick={() => { onAlignNodes('center'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Center"
                          >
                            ↔️
                          </button>
                          <button
                            onClick={() => { onAlignNodes('right'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Right"
                          >
                            ➡️
                          </button>
                          <button
                            onClick={() => { onAlignNodes('top'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Top"
                          >
                            ⬆️
                          </button>
                          <button
                            onClick={() => { onAlignNodes('middle'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Middle"
                          >
                            ↕️
                          </button>
                          <button
                            onClick={() => { onAlignNodes('bottom'); setShowAlignMenu(false); }}
                            className="p-2 hover:bg-gray-100 rounded text-xs"
                            title="Align Bottom"
                          >
                            ⬇️
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-2 px-2">Distribute</div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { onDistributeNodes('horizontal'); setShowAlignMenu(false); }}
                            className="flex-1 p-2 hover:bg-gray-100 rounded text-xs"
                            title="Distribute Horizontally"
                          >
                            ↔️ H
                          </button>
                          <button
                            onClick={() => { onDistributeNodes('vertical'); setShowAlignMenu(false); }}
                            className="flex-1 p-2 hover:bg-gray-100 rounded text-xs"
                            title="Distribute Vertically"
                          >
                            ↕️ V
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Group Tools */}
                <button
                  onClick={onGroupSelected}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Group Selected (Ctrl/Cmd + G)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </button>
              </>
            )}
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Selection Actions */}
            <button
              onClick={onSelectAll}
              className="px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
              title="Select All (Ctrl/Cmd + A)"
            >
              All
            </button>
            
            <button
              onClick={onDeselectAll}
              className="px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
              title="Deselect All (Escape)"
            >
              None
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
