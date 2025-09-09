// components/ConnectionTester.tsx
import React from 'react';
import { useCanvasStore } from '../store/canvasStore';

const ConnectionTester: React.FC = () => {
  const { nodes, addEdge } = useCanvasStore();

  const createTestConnection = () => {
    if (nodes.length >= 2) {
      const fromNode = nodes[0];
      const toNode = nodes[1];
      console.log('Creating test connection from:', fromNode.id, 'to:', toNode.id);
      addEdge(fromNode.id, toNode.id);
    } else {
      alert('Please create at least 2 nodes first, then try this button');
    }
  };

  return (
    <button
      onClick={createTestConnection}
      className="fixed top-32 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600 z-50"
      disabled={nodes.length < 2}
    >
      🔗 Connect First 2 Nodes
    </button>
  );
};

export default ConnectionTester;
