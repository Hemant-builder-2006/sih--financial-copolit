// components/KeyboardShortcuts.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Click', action: 'Add node' },
    { key: 'Ctrl + Click', action: 'Pan canvas' },
    { key: 'Ctrl + Wheel', action: 'Zoom in/out' },
    { key: 'Ctrl + 0', action: 'Reset view' },
    { key: 'Ctrl + +', action: 'Zoom in' },
    { key: 'Ctrl + -', action: 'Zoom out' },
    { key: 'Right Click', action: 'Context menu' },
    { key: 'Drag from edge', action: 'Create connection' },
    { key: 'Double-click edge', action: 'Edit label' },
    { key: '?', action: 'Show shortcuts' },
  ];

  return (
    <>
      {/* Help button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-neutral-800 text-white p-3 rounded-full shadow-lg hover:bg-neutral-700 transition-colors z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        title="Keyboard Shortcuts (?)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </motion.button>

      {/* Shortcuts modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-800">Keyboard Shortcuts</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <span className="text-sm text-neutral-600">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded font-mono">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center">
                    Press <kbd className="px-1 bg-neutral-100 rounded">Esc</kbd> to close this dialog
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
