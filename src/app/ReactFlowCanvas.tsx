'use client';

import React, { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  getBezierPath,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  EdgeProps,
  NodeProps,
  useNodesState,
  useEdgesState,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

// --- Types ---
interface NodeData {
  label: string;
  type?: 'text' | 'document' | 'note' | 'image' | 'pdf' | 'video' | 'audio' | 'ai';
  description?: string;
  content?: string;
  fileUrl?: string;
  aiModel?: string;
  aiStatus?: 'idle' | 'processing' | 'completed' | 'error';
  aiResponse?: string;
}

interface EdgeData {
  onDelete: (edgeId: string) => void;
}

// --- Custom Node Component ---
const SimpleNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const nodeType = data.type || 'note';
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isEditingContent, setIsEditingContent] = React.useState(false);
  const [editLabel, setEditLabel] = React.useState(data.label);
  const [editContent, setEditContent] = React.useState(data.content || data.description || '');

  // Save label changes
  const saveLabel = () => {
    if (editLabel.trim() !== data.label) {
      const event = new CustomEvent('updateNode', { 
        detail: { nodeId: id, updates: { label: editLabel.trim() } } 
      });
      window.dispatchEvent(event);
    }
    setIsEditingLabel(false);
  };

  // Save content changes
  const saveContent = () => {
    if (editContent.trim() !== (data.content || data.description || '')) {
      const event = new CustomEvent('updateNode', { 
        detail: { nodeId: id, updates: { content: editContent.trim() } } 
      });
      window.dispatchEvent(event);
    }
    setIsEditingContent(false);
  };

  // Handle key presses for editing
  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveLabel();
    } else if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditingLabel(false);
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      saveContent();
    } else if (e.key === 'Escape') {
      setEditContent(data.content || data.description || '');
      setIsEditingContent(false);
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'document': return '📄';
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'ai': return '🤖';
      default: return '📋';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'TEXT NOTE';
      case 'document': return 'PDF DOCUMENT';
      case 'image': return 'IMAGE';
      case 'pdf': return 'PDF FILE';
      case 'video': return 'VIDEO';
      case 'audio': return 'AUDIO';
      case 'ai': return 'AI ASSISTANT';
      default: return 'NOTE';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'document': return 'bg-green-50 text-green-700 border-green-200';
      case 'image': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'pdf': return 'bg-red-50 text-red-700 border-red-200';
      case 'video': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'audio': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'ai': return 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'text': return 'from-blue-500 to-blue-600';
      case 'document': return 'from-green-500 to-green-600';
      case 'image': return 'from-pink-500 to-pink-600';
      case 'pdf': return 'from-red-500 to-red-600';
      case 'video': return 'from-yellow-500 to-yellow-600';
      case 'audio': return 'from-indigo-500 to-indigo-600';
      case 'ai': return 'from-purple-500 via-blue-500 to-cyan-500';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <div className={`
      bg-white rounded-xl border-2 shadow-lg p-6 min-w-[280px] max-w-[320px] 
      transform transition-all duration-300 ease-in-out cursor-pointer
      hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
      ${selected ? 'border-blue-500 shadow-xl shadow-blue-500/30' : 'border-gray-200'}
      group relative
    `}>
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
      )}
      
      {/* Type Badge */}
      <div className="flex items-center gap-3 mb-4 drag-handle cursor-move">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-lg ${getTypeColor(nodeType)} border
          group-hover:scale-110 transition-transform duration-200
        `}>
          <span className="text-lg">{getIcon(nodeType)}</span>
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {getTypeLabel(nodeType)}
          </span>
          <div className="flex gap-1 mt-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-4">
        {/* Editable Label */}
        {isEditingLabel ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={saveLabel}
            onKeyDown={handleLabelKeyDown}
            className="font-bold text-gray-900 text-base mb-3 leading-tight w-full bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className="font-bold text-gray-900 text-base mb-3 leading-tight group-hover:text-gray-700 transition-colors cursor-text hover:bg-gray-50 rounded px-1 py-1"
            onDoubleClick={() => setIsEditingLabel(true)}
            title="Double-click to edit"
          >
            {data.label}
          </h3>
        )}
        
        {/* Special content for different node types */}
        {nodeType === 'image' && data.fileUrl && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={data.fileUrl} 
              alt={data.label}
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        
        {nodeType === 'video' && data.fileUrl && (
          <div className="mb-3 rounded-lg overflow-hidden bg-black">
            <video 
              src={data.fileUrl} 
              className="w-full h-32 object-cover"
              controls
            />
          </div>
        )}
        
        {nodeType === 'audio' && data.fileUrl && (
          <div className="mb-3">
            <audio 
              src={data.fileUrl} 
              className="w-full"
              controls
            />
          </div>
        )}

        {/* AI-specific content */}
        {nodeType === 'ai' && (
          <div className="mb-3">
            {/* AI Model Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-semibold rounded-full">
                {data.aiModel || 'GPT-4'}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                data.aiStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                data.aiStatus === 'completed' ? 'bg-green-500' :
                data.aiStatus === 'error' ? 'bg-red-500' :
                'bg-gray-400'
              }`}></div>
            </div>

            {/* AI Input/Output */}
            {data.content && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">Input:</div>
                <div className="text-xs bg-gray-50 rounded p-2 border-l-2 border-blue-500">
                  {data.content}
                </div>
              </div>
            )}

            {data.aiResponse && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">AI Response:</div>
                <div className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 rounded p-2 border-l-2 border-purple-500">
                  {data.aiResponse}
                </div>
              </div>
            )}

            {data.aiStatus === 'processing' && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="animate-spin w-3 h-3 border border-purple-500 border-t-transparent rounded-full"></div>
                Processing...
              </div>
            )}
          </div>
        )}
        
        {/* Editable Description/Content */}
        {(data.description || data.content || isEditingContent) && (
          <div className="mb-2">
            {isEditingContent ? (
              <div className="border-2 border-blue-500 rounded">
                {/* Simple Formatting Toolbar */}
                <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const textarea = e.currentTarget.parentElement?.nextElementSibling as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = editContent.substring(start, end);
                        const newText = editContent.substring(0, start) + `**${selectedText}**` + editContent.substring(end);
                        setEditContent(newText);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 2, end + 2);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100 font-bold"
                    title="Bold (wrap with **)"
                  >
                    B
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const textarea = e.currentTarget.parentElement?.nextElementSibling as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = editContent.substring(start, end);
                        const newText = editContent.substring(0, start) + `*${selectedText}*` + editContent.substring(end);
                        setEditContent(newText);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 1, end + 1);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100 italic"
                    title="Italic (wrap with *)"
                  >
                    I
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const textarea = e.currentTarget.parentElement?.nextElementSibling as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const lines = editContent.substring(0, start).split('\n');
                        const currentLineStart = editContent.lastIndexOf('\n', start - 1) + 1;
                        const newText = editContent.substring(0, currentLineStart) + '• ' + editContent.substring(currentLineStart);
                        setEditContent(newText);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 2, start + 2);
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
                    title="Add bullet point"
                  >
                    •
                  </button>
                  <div className="flex-1"></div>
                  <span className="text-xs text-gray-500 self-center">Ctrl+Enter to save, Esc to cancel</span>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={saveContent}
                  onKeyDown={handleContentKeyDown}
                  className="w-full text-sm text-gray-600 leading-relaxed bg-transparent p-2 focus:outline-none resize-none"
                  rows={4}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter description or content..."
                />
              </div>
            ) : (
              <p 
                className="text-sm text-gray-600 leading-relaxed cursor-text hover:bg-gray-50 rounded px-1 py-1 min-h-[1.5rem]"
                onDoubleClick={() => setIsEditingContent(true)}
                title="Double-click to edit (Ctrl+Enter to save)"
              >
                {data.description || data.content || 'Double-click to add description...'}
              </p>
            )}
          </div>
        )}
        
        {data.content && data.content !== data.label && nodeType !== 'ai' && (
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
            {data.content}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button className={`
        w-full bg-gradient-to-r ${getGradient(nodeType)} 
        hover:shadow-lg text-white text-sm font-semibold py-3 px-4 rounded-lg 
        transition-all duration-200 flex items-center justify-center gap-2
        transform hover:scale-[1.02] active:scale-[0.98]
      `}>
        <span>�</span>
        Open & Process
      </button>

      {/* Enhanced Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-blue-500 !border-3 !border-white !shadow-lg hover:!scale-125 !transition-transform !duration-200"
        style={{ 
          left: -8,
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}
        id="input"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-green-500 !border-3 !border-white !shadow-lg hover:!scale-125 !transition-transform !duration-200"
        style={{ 
          right: -8,
          background: 'linear-gradient(135deg, #10b981, #047857)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}
        id="output"
      />
      
      {/* Additional Handles for More Connection Points */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !shadow-md hover:!scale-125 !transition-transform !duration-200"
        style={{ 
          top: -6,
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          boxShadow: '0 3px 8px rgba(139, 92, 246, 0.4)'
        }}
        id="input-top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white !shadow-md hover:!scale-125 !transition-transform !duration-200"
        style={{ 
          bottom: -6,
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          boxShadow: '0 3px 8px rgba(249, 115, 22, 0.4)'
        }}
        id="output-bottom"
      />

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm(`Delete "${data.label}" node?`)) {
            // We'll pass the delete function through context or props
            const event = new CustomEvent('deleteNode', { detail: { nodeId: id } });
            window.dispatchEvent(event);
          }
        }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-110 active:scale-95"
        title="Delete node"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
        }}
      >
        ✕
      </button>
    </div>
  );
};

// --- Custom Disconnect Edge Component ---
const DisconnectEdge: React.FC<EdgeProps<EdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Main Edge Path */}
      <path
        id={id}
        style={{
          strokeWidth: selected ? 4 : 3,
          stroke: selected ? '#3b82f6' : '#64748b',
          strokeLinecap: 'round',
          filter: selected ? 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' : 'none',
          transition: 'all 0.2s ease-in-out',
          ...style,
        }}
        className="react-flow__edge-path hover:!stroke-blue-500 transition-colors duration-200"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* Animated Flow Indicator */}
      <circle
        r="4"
        fill={selected ? '#3b82f6' : '#8b5cf6'}
        className="animate-pulse"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        }}
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      
      {/* Delete Button */}
      <foreignObject
        width={32}
        height={32}
        x={labelX - 16}
        y={labelY - 16}
        className="overflow-visible"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button
          onClick={() => data?.onDelete(id)}
          className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer border-2 border-white transform hover:scale-110 active:scale-95"
          type="button"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))',
          }}
        >
          ✕
        </button>
      </foreignObject>
    </>
  );
};

// --- Node and Edge Types ---
const nodeTypes = { simpleNode: SimpleNode };
const edgeTypes = { disconnect: DisconnectEdge };

// --- Initial State ---
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'simpleNode',
    position: { x: 150, y: 150 },
    data: { 
      label: 'Welcome to Project Poppy',
      type: 'note',
      description: 'A comprehensive canvas for building visual workflows with multiple node types.',
      content: 'Start by creating new nodes or uploading files from the toolbar.'
    },
    dragHandle: '.drag-handle',
    selectable: true,
    draggable: true,
  },
  {
    id: '2',
    type: 'simpleNode',
    position: { x: 530, y: 150 },
    data: { 
      label: 'Document Processing',
      type: 'pdf',
      description: 'Handle PDF documents, text files, and various document formats.',
      content: 'Upload PDF files, Word documents, or plain text files.'
    },
    dragHandle: '.drag-handle',
    selectable: true,
    draggable: true,
  },
  {
    id: '3',
    type: 'simpleNode',
    position: { x: 910, y: 150 },
    data: { 
      label: 'Media Gallery',
      type: 'image',
      description: 'Manage images, videos, and audio content in your workflow.',
      content: 'Supports JPG, PNG, MP4, MP3, and more media formats.'
    },
    dragHandle: '.drag-handle',
    selectable: true,
    draggable: true,
  },
];
const initialEdges: Edge<EdgeData>[] = [];

// --- Main Canvas Component ---
function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // Listen for custom deleteNode and updateNode events from nodes
  React.useEffect(() => {
    const deleteHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.nodeId) {
        setNodes((nds) => nds.filter((n) => n.id !== customEvent.detail.nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== customEvent.detail.nodeId && e.target !== customEvent.detail.nodeId));
      }
    };

    const updateHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.nodeId && customEvent.detail.updates) {
        setNodes((nds) => 
          nds.map((node) => 
            node.id === customEvent.detail.nodeId 
              ? { ...node, data: { ...node.data, ...customEvent.detail.updates } }
              : node
          )
        );
      }
    };

    window.addEventListener('deleteNode', deleteHandler);
    window.addEventListener('updateNode', updateHandler);
    
    return () => {
      window.removeEventListener('deleteNode', deleteHandler);
      window.removeEventListener('updateNode', updateHandler);
    };
  }, [setNodes, setEdges]);
  const nodeId = useRef(4); // Start from 4 since we have 3 initial nodes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Create node with different types
  const createNode = useCallback((type: NodeData['type'] = 'note', content: string, fileUrl?: string) => {
    const newId = String(nodeId.current++);
    
    const dimensions = {
      text: { width: 280, height: 200 },
      image: { width: 320, height: 280 },
      pdf: { width: 300, height: 220 },
      video: { width: 350, height: 250 },
      audio: { width: 320, height: 180 },
      document: { width: 300, height: 220 },
      note: { width: 280, height: 200 },
      ai: { width: 360, height: 320 }
    };

    const descriptions = {
      text: 'Simple text content for notes and ideas',
      image: 'Visual content and graphics',
      pdf: 'Document files and references',
      video: 'Video content and multimedia',
      audio: 'Audio files and sound content',
      document: 'Detailed documentation',
      note: 'General notes and information',
      ai: 'AI-powered assistant for intelligent processing'
    };

    const newNode: Node<NodeData> = {
      id: newId,
      type: "simpleNode",
      position: {
        x: 150 + (nodes.length % 3) * 380,
        y: 150 + Math.floor(nodes.length / 3) * 300,
      },
      data: {
        label: content || `New ${type || 'note'}`,
        type: type || 'note',
        description: descriptions[type || 'note'],
        content: content,
        fileUrl: fileUrl,
        ...(type === 'ai' && {
          aiModel: 'GPT-4',
          aiStatus: 'idle' as const,
          aiResponse: ''
        })
      },
      dragHandle: '.drag-handle',
      selectable: true,
      draggable: true,
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    let nodeType: NodeData['type'] = 'document';
    
    if (fileType.startsWith('image/')) {
      nodeType = 'image';
    } else if (fileType === 'application/pdf') {
      nodeType = 'pdf';
    } else if (fileType.startsWith('video/')) {
      nodeType = 'video';
    } else if (fileType.startsWith('audio/')) {
      nodeType = 'audio';
    } else if (fileType.startsWith('text/')) {
      nodeType = 'text';
    }

    // For images, videos, and audio, create a preview URL
    if (nodeType === 'image' || nodeType === 'video' || nodeType === 'audio') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        createNode(nodeType, file.name, fileUrl);
      };
      reader.readAsDataURL(file);
    } else {
      createNode(nodeType, file.name);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [createNode]);

  // Export workspace
  const exportWorkspace = useCallback(() => {
    const data = {
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppy-canvas-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Import workspace
  const handleImportWorkspace = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          // Update nodeId to avoid conflicts
          const maxId = Math.max(...data.nodes.map((n: Node) => parseInt(n.id)), 0);
          nodeId.current = maxId + 1;
        }
      } catch (error) {
        console.error('Failed to import workspace:', error);
        alert('Failed to import workspace. Please check the file format.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  }, [setNodes, setEdges]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (window.confirm('Clear entire canvas? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
      nodeId.current = 1;
    }
  }, [setNodes, setEdges]);

  // Handle edge deletion
  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  // Handle node deletion
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      // Also remove all edges connected to this node
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Handle multiple node deletion
  const deleteSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;

    const selectedNodeIds = selectedNodes.map(node => node.id);
    const nodeNames = selectedNodes.map(node => node.data.label).join(', ');
    
    if (window.confirm(`Delete ${selectedNodes.length} selected node(s): ${nodeNames}?`)) {
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
      setEdges((eds) => eds.filter((e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)));
    }
  }, [nodes, setNodes, setEdges]);

  // Handle node updates (for editing)
  const updateNode = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      setNodes((nds) => 
        nds.map((node) => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Handle keyboard shortcuts for deletion
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      deleteSelectedNodes();
    }
  }, [deleteSelectedNodes]);

  // Add keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle connection creation
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Comprehensive Toolbar */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
        {/* Node Creation Tools */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Create Nodes</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => createNode('text', 'New text node')}
              className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>📝</span>
              <span>Text</span>
            </button>
            
            <button
              onClick={() => createNode('image', 'New image')}
              className="px-3 py-2 text-sm bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>🖼️</span>
              <span>Image</span>
            </button>
            
            <button
              onClick={() => createNode('pdf', 'New PDF document')}
              className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>📄</span>
              <span>PDF</span>
            </button>
            
            <button
              onClick={() => createNode('video', 'New video')}
              className="px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>🎥</span>
              <span>Video</span>
            </button>
            
            <button
              onClick={() => createNode('audio', 'New audio')}
              className="px-3 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>🎵</span>
              <span>Audio</span>
            </button>
            
            <button
              onClick={() => createNode('note', 'New note')}
              className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>📋</span>
              <span>Note</span>
            </button>

            <button
              onClick={() => createNode('ai', 'AI Assistant')}
              className="px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 animate-pulse"
            >
              <span>🤖</span>
              <span>AI</span>
            </button>
          </div>
        </div>

        {/* File Operations */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">File Operations</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>📤</span>
              <span>Upload</span>
            </button>
            
            <button
              onClick={exportWorkspace}
              className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>💾</span>
              <span>Export</span>
            </button>
            
            <button
              onClick={() => importInputRef.current?.click()}
              className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>📂</span>
              <span>Import</span>
            </button>
            
            <button
              onClick={clearCanvas}
              className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
              disabled={nodes.length === 0}
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 px-6 py-4 min-w-[200px]">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Nodes</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{edges.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Edges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Project Header */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌸</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Project Poppy
                <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs font-semibold rounded-full">
                  LIVE
                </span>
              </h1>
              <p className="text-sm text-gray-600">Visual Workflow Canvas</p>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'disconnect',
          style: { 
            strokeWidth: 3, 
            stroke: '#64748b',
            strokeDasharray: '0',
          },
          data: { onDelete: deleteEdge },
        }}
        connectionLineStyle={{ 
          strokeWidth: 3, 
          stroke: '#3b82f6',
          strokeDasharray: '8,8',
          animation: 'dash 1s linear infinite'
        }}
        className="bg-gray-50"
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        snapToGrid={true}
        snapGrid={[20, 20]}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background 
          color="#e2e8f0" 
          gap={24} 
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Controls 
          className="bg-white shadow-lg border border-gray-200 rounded-xl"
          showInteractive={false}
        />
        <MiniMap
          nodeColor="#ffffff"
          nodeStrokeColor="#d1d5db"
          nodeStrokeWidth={2}
          maskColor="rgba(0, 0, 0, 0.05)"
          className="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden"
          style={{ backgroundColor: '#ffffff' }}
        />
      </ReactFlow>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,application/pdf,.txt,.md,.json"
      />
      
      <input
        ref={importInputRef}
        type="file"
        className="hidden"
        onChange={handleImportWorkspace}
        accept=".json"
      />
    </div>
  );
}

// --- Main App Component ---
export default function ReactFlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
