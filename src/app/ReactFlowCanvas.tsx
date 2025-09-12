
'use client';

import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  OnConnect,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom styles for enhanced connections
const connectionStyles = `
  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      filter: drop-shadow(0 0 3px rgba(139, 92, 246, 0.5));
    }
    50% {
      filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.8));
    }
  }
  
  .react-flow__connection-line {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .react-flow__handle {
    transition: all 0.2s ease;
    border: 2px solid #8b5cf6;
    background: white;
  }
  
  .react-flow__handle:hover {
    transform: scale(1.3);
    border-color: #7c3aed;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
  }
  
  .react-flow__handle.connecting {
    animation: pulse-glow 1s ease-in-out infinite;
    transform: scale(1.2);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = connectionStyles;
  document.head.appendChild(styleSheet);
}

// Import your existing components
import ReactFlowNodeCard from "../../components/ReactFlowNodeCard";
import ReactFlowAnimatedEdge from "../../components/ReactFlowAnimatedEdge";
import ReactFlowConnectionLine from "../../components/ReactFlowConnectionLine";
import { Button } from "../../components/ui/button";
import { Trash2, X, Download, Upload, Save, FileText, Image, FileImage, Video, File } from "lucide-react";

// --- Types ---
interface NodeData {
  title: string;
  type: 'ai' | 'text' | 'pdf' | 'image' | 'video';
  description: string;
  isEditingTitle?: boolean;
  isEditingDesc?: boolean;
  aiStatus?: 'idle' | 'processing' | 'done';
  aiResponse?: string;
  size?: 'small' | 'medium' | 'large' | 'custom';
  width?: number;
  height?: number;
}

// --- Node and Edge Types ---
const nodeTypes = {
  enhancedNode: ReactFlowNodeCard,
};

const edgeTypes = {
  animatedCustom: ReactFlowAnimatedEdge,
};

// --- Initial Data ---
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'enhancedNode',
    position: { x: 250, y: 50 },
    data: { 
      title: 'AI Assistant',
      type: 'ai',
      description: 'Click actions below to test AI features. Double-click title to edit.',
      aiStatus: 'idle',
      size: 'medium',
      width: 320,
      height: 250
    },
  },
  {
    id: '2',
    type: 'enhancedNode',
    position: { x: 100, y: 350 },
    data: { 
      title: 'Research Notes',
      type: 'text',
      description: 'Double-click title or click Open to edit. Click ⋯ to change type.',
      size: 'medium',
      width: 320,
      height: 250
    },
  },
  {
    id: '3',
    type: 'enhancedNode',
    position: { x: 500, y: 350 },
    data: { 
      title: 'Document Analysis',
      type: 'pdf',
      description: 'Drag connection handles to connect nodes. Try changing to different types!',
      size: 'large',
      width: 400,
      height: 320
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'animatedCustom',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'animatedCustom',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
];


// --- Main Component ---
const ReactFlowCanvas: React.FC = () => {
  // State for toolbar dropdown (moved inside component)
  const [showToolbarDropdown, setShowToolbarDropdown] = useState(false);
  
  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle edge click for deletion
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge.id);
    // You can also enable deletion on edge click here if needed
  }, []);

  // Handle connections
  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'animatedCustom',
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  );

  // Add new node
  const addNode = useCallback(() => {
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      type: 'enhancedNode',
      position: { 
        x: Math.random() * 400 + 50, 
        y: Math.random() * 300 + 50 
      },
      data: { 
        title: `New Node ${nodes.length + 1}`,
        type: 'ai',
        description: 'Double-click title to edit, click ⋯ to change type, drag handles to connect',
        aiStatus: 'idle',
        size: 'medium',
        width: 320,
        height: 250
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  // Export workspace
  const exportWorkspace = useCallback(() => {
    const workspace = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(workspace, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `reactflow-workspace-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  // Import workspace
  const importWorkspace = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workspace = JSON.parse(e.target?.result as string);
        
        if (workspace.nodes && workspace.edges) {
          setNodes(workspace.nodes);
          setEdges(workspace.edges);
        } else {
          alert('Invalid workspace file format');
        }
      } catch (error) {
        alert('Error loading workspace file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  }, [setNodes, setEdges]);

  // Clear all nodes and edges
  const clearWorkspace = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire workspace? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  // Import image - creates IMAGE node only
  const importImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const newNode: Node<NodeData> = {
        id: `image-${Date.now()}`,
        type: 'enhancedNode',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: 'image', // Creates IMAGE node
          description: imageUrl,
          width: 300,
          height: 200,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      console.log('Created IMAGE node:', newNode.data.title);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [setNodes]);

  // Import PDF - creates PDF node only
  const importPDF = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newNode: Node<NodeData> = {
        id: `pdf-${Date.now()}`,
        type: 'enhancedNode',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: 'pdf', // Creates PDF node
          description: `PDF Document: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\nUploaded: ${new Date().toLocaleDateString()}`,
          width: 300,
          height: 200,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      console.log('Created PDF node:', newNode.data.title);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [setNodes]);

  // Import Video/Audio - creates VIDEO node only
  const importVideo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      alert('Please select a valid video or audio file (MP4, MP3, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const isVideo = file.type.startsWith('video/');
      const newNode: Node<NodeData> = {
        id: `video-${Date.now()}`,
        type: 'enhancedNode',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: 'video', // Creates VIDEO node
          description: `${isVideo ? 'Video' : 'Audio'} File: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\nDuration: Ready for processing\nUploaded: ${new Date().toLocaleDateString()}`,
          width: 300,
          height: 200,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      console.log('Created VIDEO node:', newNode.data.title);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [setNodes]);

  // Import Documents - creates TEXT node only
  const importDocument = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/rtf',
      'application/rtf'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|doc|docx|rtf)$/i)) {
      alert('Please select a valid document file (TXT, DOC, DOCX, RTF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newNode: Node<NodeData> = {
        id: `text-${Date.now()}`,
        type: 'enhancedNode',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: 'text', // Creates TEXT node
          description: file.type === 'text/plain' ? content.substring(0, 500) + (content.length > 500 ? '...' : '') : `Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type}\nUploaded: ${new Date().toLocaleDateString()}`,
          width: 300,
          height: 200,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      console.log('Created TEXT node:', newNode.data.title);
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, [setNodes]);

  // Listen for node updates, deletions, and edge deletions
  React.useEffect(() => {
    const handleNodeUpdate = (event: CustomEvent) => {
      const { id, data } = event.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    };

    const handleNodeDelete = (event: CustomEvent) => {
      const { id } = event.detail;
      setNodes((nds) => nds.filter((node) => node.id !== id));
      // Also remove any edges connected to this node
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    };

    const handleEdgeDelete = (event: CustomEvent) => {
      const { id } = event.detail;
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    };

    const handleNodeResize = (event: CustomEvent) => {
      const { id, width, height } = event.detail;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              style: {
                ...node.style,
                width,
                height,
              },
            };
          }
          return node;
        })
      );
    };

    window.addEventListener('updateNode', handleNodeUpdate as EventListener);
    window.addEventListener('deleteNode', handleNodeDelete as EventListener);
    window.addEventListener('deleteEdge', handleEdgeDelete as EventListener);
    window.addEventListener('resizeNode', handleNodeResize as EventListener);
    
    return () => {
      window.removeEventListener('updateNode', handleNodeUpdate as EventListener);
      window.removeEventListener('deleteNode', handleNodeDelete as EventListener);
      window.removeEventListener('deleteEdge', handleEdgeDelete as EventListener);
      window.removeEventListener('resizeNode', handleNodeResize as EventListener);
    };
  }, [setNodes, setEdges]);

  return (

    <div className={`w-full h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={ReactFlowConnectionLine}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          attributionPosition="bottom-left"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20} 
            size={1}
            className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
          />
          <Controls className={`border rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`} />
          
          {/* Toolbar positioned at bottom right */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="relative inline-block text-left">
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
                aria-haspopup="true"
                aria-expanded="false"
                id="toolbar-dropdown-button"
                onClick={() => setShowToolbarDropdown((prev) => !prev)}
              >
                Toolbar
                <span className="ml-2">▼</span>
              </Button>
              {showToolbarDropdown && (
                <div className={`origin-bottom-right absolute bottom-full right-0 mb-2 w-56 rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none p-3 border space-y-2 z-50 ${
                  isDarkMode 
                    ? 'bg-gray-800 ring-gray-600 border-gray-700' 
                    : 'bg-white ring-black border-gray-200'
                }`}>
              <Button
                onClick={addNode}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold mb-1"
              >
                + Add Node
              </Button>
              <Button
                onClick={exportWorkspace}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-1 mb-1"
                title="Export workspace"
              >
                <Download size={14} />
                Export
              </Button>
              <label className="w-full cursor-pointer mb-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={importWorkspace}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-1"
                  title="Import workspace"
                  asChild
                >
                  <span>
                    <Upload size={14} />
                    Import
                  </span>
                </Button>
              </label>
              <label className="w-full cursor-pointer mb-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={importImage}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700"
                  title="Import image → Creates IMAGE node"
                  asChild
                >
                  <span>
                    <Image size={14} />
                    Image Node
                  </span>
                </Button>
              </label>
              <label className="w-full cursor-pointer mb-1">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={importPDF}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700"
                  title="Import PDF → Creates PDF node"
                  asChild
                >
                  <span>
                    <FileText size={14} />
                    PDF Node
                  </span>
                </Button>
              </label>
              <label className="w-full cursor-pointer mb-1">
                <input
                  type="file"
                  accept="video/*,audio/*"
                  onChange={importVideo}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700"
                  title="Import video/audio → Creates VIDEO node"
                  asChild
                >
                  <span>
                    <Video size={14} />
                    Video Node
                  </span>
                </Button>
              </label>
              <label className="w-full cursor-pointer mb-1">
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.rtf"
                  onChange={importDocument}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700"
                  title="Import document → Creates TEXT node"
                  asChild
                >
                  <span>
                    <File size={14} />
                    Text Node
                  </span>
                </Button>
              </label>
              <Button
                onClick={clearWorkspace}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Clear workspace"
              >
                <Trash2 size={14} />
                Clear
              </Button>
              <div className="text-xs text-gray-500 pt-1">
                {nodes.length} nodes, {edges.length} connections
              </div>
              </div>
            )}
          </div>
        </div>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowCanvas;