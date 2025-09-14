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
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

// Import all node types
import AINode from "../../components/node-types/AINode";
import TextNode from "../../components/node-types/TextNode";
import DocumentNode from "../../components/node-types/DocumentNode";
import ImageNode from "../../components/node-types/ImageNode";
import VideoNode from "../../components/node-types/VideoNode";
import CompanyNode from "../../components/node-types/CompanyNode";

// Import custom components
import ReactFlowAnimatedEdge from "../../components/ReactFlowAnimatedEdge";
import ReactFlowConnectionLine from "../../components/ReactFlowConnectionLine";

// Import UI components
import { Button } from "../../components/ui/button";
import { Plus, FileText, Image, Video, File, FileImage, Trash2, Download, Upload } from "lucide-react";

// Import types
import { NodeData, AINodeData, TextNodeData, DocumentNodeData, ImageNodeData, VideoNodeData, CompanyNodeData } from "../../components/node-types/interfaces";

// Node types configuration
const nodeTypes = {
  ai: AINode,
  text: TextNode,
  document: DocumentNode,
  image: ImageNode,
  video: VideoNode,
  company: CompanyNode,
};

// Edge types configuration
const edgeTypes = {
  animatedCustom: ReactFlowAnimatedEdge,
};

// Initial nodes with clean setup
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'ai',
    position: { x: 200, y: 200 },
    data: { 
      title: 'AI Assistant',
      type: 'ai',
      description: 'Click actions below to test AI features. Double-click title to edit.',
      aiStatus: 'idle',
      size: 'medium',
      width: 280,
      height: 200
    },
  },
  {
    id: '2',
    type: 'text',
    position: { x: 550, y: 200 },
    data: { 
      title: 'Text Editor',
      type: 'text',
      description: 'Double-click to start writing and editing text content.',
      content: '',
      size: 'medium',
      width: 280,
      height: 200
    },
  },
  {
    id: '3',
    type: 'document',
    position: { x: 375, y: 450 },
    data: { 
      title: 'Document Upload',
      type: 'document',
      description: 'Upload and analyze PDF, Word, Excel, CSV, RTF, or text documents.',
      fileType: '',
      documentData: undefined,
      lastModified: undefined,
      size: 'medium',
      width: 280,
      height: 200
    },
  },
];

// Initial edges - empty for clean start
const initialEdges: Edge[] = [];

// Main ReactFlow Canvas Component
const ReactFlowCanvas: React.FC = () => {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showToolbarDropdown, setShowToolbarDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection - sync with main app
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Generate unique ID for new nodes
  const generateNodeId = () => {
    return Date.now().toString();
  };

  // Handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        type: 'animatedCustom',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // Handle edge deletion
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    if (event.detail === 2) { // Double click to delete
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  // Add new AI node
  const addAINode = useCallback(() => {
    const newNode: Node<AINodeData> = {
      id: generateNodeId(),
      type: 'ai',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'AI Assistant',
        type: 'ai',
        description: 'AI-powered analysis and insights',
        aiStatus: 'idle',
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

  // Add new text node
  const addTextNode = useCallback(() => {
    const newNode: Node<TextNodeData> = {
      id: generateNodeId(),
      type: 'text',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'Text Node',
        type: 'text',
        description: 'Add your text content here',
        content: '',
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

  // Add new document node
  const addDocumentNode = useCallback(() => {
    const newNode: Node<DocumentNodeData> = {
      id: generateNodeId(),
      type: 'document',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'Document Upload',
        type: 'document',
        description: 'Upload and analyze PDF, Word, Excel, CSV, RTF, or text documents',
        fileType: '',
        documentData: undefined,
        lastModified: undefined,
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

  // Add new image node
  const addImageNode = useCallback(() => {
    const newNode: Node<ImageNodeData> = {
      id: generateNodeId(),
      type: 'image',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'Image Node',
        type: 'image',
        description: 'Upload and analyze images',
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

  // Add new video node
  const addVideoNode = useCallback(() => {
    const newNode: Node<VideoNodeData> = {
      id: generateNodeId(),
      type: 'video',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'Video Node',
        type: 'video',
        description: 'Upload and analyze video content',
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

  // Add new company node
  const addCompanyNode = useCallback(() => {
    const newNode: Node<CompanyNodeData> = {
      id: generateNodeId(),
      type: 'company',
      position: { 
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        title: 'Company Data',
        type: 'company',
        description: 'Business intelligence and company analysis',
        size: 'medium',
        width: 280,
        height: 200
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowToolbarDropdown(false);
  }, [setNodes]);

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

  // Clear workspace
  const clearWorkspace = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire workspace? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowToolbarDropdown(false);
    };

    if (showToolbarDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showToolbarDropdown]);

  return (
    <div className={`w-full h-screen relative ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ minHeight: '100vh' }}>
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
          connectionMode={ConnectionMode.Loose}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.5}
          maxZoom={2}
          attributionPosition="bottom-left"
          panOnScroll={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          deleteKeyCode={["Backspace", "Delete"]}
          selectionKeyCode={["Shift"]}
          multiSelectionKeyCode={["Meta", "Control"]}
          snapToGrid={false}
          snapGrid={[15, 15]}
          className="no-scrollbar"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20} 
            size={1}
            color={isDarkMode ? '#374151' : '#d1d5db'}
          />
          <Controls 
            position="bottom-right"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />

          {/* Floating Action Button */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="relative">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToolbarDropdown(!showToolbarDropdown);
                }}
                className="rounded-full w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                title="Add new node"
              >
                <Plus size={20} />
              </Button>

              {/* Dropdown Menu */}
              {showToolbarDropdown && (
                <div className={`absolute bottom-14 left-0 rounded-lg shadow-xl border p-2 min-w-48 z-20 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Add Node:</div>
                  
                  <Button
                    onClick={addAINode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-1 ${
                      isDarkMode 
                        ? 'bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border-indigo-800'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    <span>🤖</span>
                    AI Assistant
                  </Button>

                  <Button
                    onClick={addTextNode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-1 ${
                      isDarkMode 
                        ? 'bg-blue-900/50 hover:bg-blue-800 text-blue-300 border-blue-800'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    <File size={14} />
                    Text Node
                  </Button>

                  <Button
                    onClick={addDocumentNode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-1 ${
                      isDarkMode 
                        ? 'bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 border-yellow-800'
                        : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    <File size={14} />
                    Document Node
                  </Button>

                  <Button
                    onClick={addImageNode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-1 ${
                      isDarkMode 
                        ? 'bg-green-900/50 hover:bg-green-800 text-green-300 border-green-800'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    <Image size={14} />
                    Image Node
                  </Button>

                  <Button
                    onClick={addVideoNode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-1 ${
                      isDarkMode 
                        ? 'bg-purple-900/50 hover:bg-purple-800 text-purple-300 border-purple-800'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                    }`}
                  >
                    <Video size={14} />
                    Video Node
                  </Button>

                  <Button
                    onClick={addCompanyNode}
                    variant="outline"
                    size="sm"
                    className={`w-full flex items-center gap-2 mb-2 ${
                      isDarkMode 
                        ? 'bg-orange-900/50 hover:bg-orange-800 text-orange-300 border-orange-800'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                    }`}
                  >
                    <FileImage size={14} />
                    Company Data
                  </Button>

                  <div className="border-t border-gray-200 pt-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">Workspace:</div>
                    
                    <Button
                      onClick={exportWorkspace}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2 mb-1"
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
                        className="w-full flex items-center gap-2"
                        asChild
                      >
                        <span>
                          <Upload size={14} />
                          Import
                        </span>
                      </Button>
                    </label>

                    <Button
                      onClick={clearWorkspace}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Clear
                    </Button>

                    <div className="text-xs text-gray-500 pt-1">
                      {nodes.length} nodes, {edges.length} connections
                    </div>
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