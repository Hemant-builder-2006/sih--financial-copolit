// components/FeatureShowcase.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureShowcase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      category: "Core Canvas Features",
      items: [
        "🎨 Interactive whiteboard canvas with grid snapping",
        "📦 Draggable and resizable nodes with smooth animations",
        "🔗 Create connections by dragging from node edges",
        "🖱️ Right-click context menus for quick actions",
        "👆 Double-click nodes to edit content and properties"
      ]
    },
    {
      category: "Navigation & Zoom",
      items: [
        "🔍 Zoom controls with mouse wheel (Ctrl + Wheel)",
        "🎯 Pan canvas with Ctrl + Click and drag",
        "🏠 Reset view with Ctrl + 0 or reset button",
        "🗺️ Mini-map for workspace navigation",
        "⌨️ Comprehensive keyboard shortcuts"
      ]
    },
    {
      category: "Node Types & Content",
      items: [
        "📝 Text nodes for notes and ideas",
        "🖼️ Image nodes with drag-drop support",
        "📄 PDF document nodes",
        "🎥 Video content nodes",
        "✏️ Rich node editor with type selection"
      ]
    },
    {
      category: "Edge & Connection Features",
      items: [
        "🌊 Curved edges with smooth animations",
        "🏷️ Editable edge labels (double-click)",
        "✨ Connection previews while dragging",
        "🎯 Smart connection handles on nodes",
        "💫 Hover effects and visual feedback"
      ]
    },
    {
      category: "File Management",
      items: [
        "📁 Save workspace as JSON file",
        "📂 Load workspace from file",
        "🗃️ Drag and drop files onto canvas",
        "🔄 Auto-detect file types and create appropriate nodes",
        "💾 Local storage for workspace persistence"
      ]
    },
    {
      category: "User Experience",
      items: [
        "⚡ Framer Motion animations throughout",
        "🎨 Modern TailwindCSS styling",
        "📱 Responsive design and touch support",
        "🔧 Advanced state management with Zustand",
        "❓ Built-in help system and shortcuts guide"
      ]
    }
  ];

  return (
    <>
      {/* Feature showcase button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ✨ View All Features
      </motion.button>

      {/* Feature showcase modal */}
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
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                      🎨 Poppy AI Canvas Features
                    </h2>
                    <p className="text-neutral-600">
                      A comprehensive visual workspace for ideas, connections, and creativity
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((category, categoryIndex) => (
                    <motion.div
                      key={categoryIndex}
                      className="bg-neutral-50 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                    >
                      <h3 className="font-semibold text-neutral-800 mb-3 text-lg">
                        {category.category}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            className="text-sm text-neutral-600 flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.2, 
                              delay: categoryIndex * 0.1 + itemIndex * 0.05 
                            }}
                          >
                            <span className="flex-shrink-0">{item.split(' ')[0]}</span>
                            <span>{item.substring(item.indexOf(' ') + 1)}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="text-center">
                    <h4 className="font-semibold text-neutral-800 mb-2">Quick Start Guide</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong>1. Create Nodes</strong><br/>
                        Click anywhere on canvas or use toolbar
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <strong>2. Connect Ideas</strong><br/>
                        Drag from blue edge handles to connect nodes
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <strong>3. Navigate & Edit</strong><br/>
                        Zoom, pan, and double-click to edit content
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Creating! 🚀
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeatureShowcase;
