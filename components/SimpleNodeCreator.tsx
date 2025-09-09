// components/SimpleNodeCreator.tsx
import React from 'react';
import { useCanvasStore } from '../store/canvasStore';

const SimpleNodeCreator: React.FC = () => {
  const { addNode, snapToGrid } = useCanvasStore();

  const createNode = () => {
    const x = snapToGrid(Math.random() * 500 + 100);
    const y = snapToGrid(Math.random() * 400 + 100);
    addNode({ x, y, width: 180, height: 80, type: 'text', content: 'Test Node' });
  };

  return (
    <button
      onClick={createNode}
      className="fixed top-20 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 z-50"
    >
      ➕ Add Node (Test)
    </button>
  );
};

export default SimpleNodeCreator;
