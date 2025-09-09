// components/SaveLoad.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../store/canvasStore';

const SaveLoad: React.FC = () => {
  const { nodes, edges, clearCanvas, addNode, addEdge } = useCanvasStore();
  const [showMenu, setShowMenu] = useState(false);

  const saveWorkspace = () => {
    const workspace = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(workspace, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `canvas-workspace-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowMenu(false);
  };

  const loadWorkspace = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workspace = JSON.parse(e.target?.result as string);
        
        // Clear current workspace
        clearCanvas();
        
        // Load nodes
        workspace.nodes?.forEach((node: any) => {
          addNode({
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            type: node.type,
            content: node.content
          });
        });
        
        // Load edges (need to wait for nodes to be created)
        setTimeout(() => {
          workspace.edges?.forEach((edge: any) => {
            addEdge(edge.from, edge.to);
          });
        }, 100);
        
        setShowMenu(false);
      } catch (error) {
        console.error('Error loading workspace:', error);
        alert('Error loading workspace file. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-white border border-neutral-200 hover:bg-neutral-50 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 shadow-sm transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        💾 Save/Load
      </motion.button>

      {showMenu && (
        <motion.div
          className="absolute top-full mt-2 left-0 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 min-w-[150px] z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={saveWorkspace}
            className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            📁 Save Workspace
          </button>
          
          <label className="w-full block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer">
            📂 Load Workspace
            <input
              type="file"
              accept=".json"
              onChange={loadWorkspace}
              className="hidden"
            />
          </label>
          
          <div className="border-t border-neutral-200 my-1"></div>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear the entire workspace?')) {
                clearCanvas();
              }
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            🗑️ Clear All
          </button>
        </motion.div>
      )}
      
      {/* Backdrop to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default SaveLoad;
