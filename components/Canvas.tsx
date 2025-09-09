// Canvas.tsx
import React, { MouseEvent, useRef, useState, useEffect, useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import Node from './Node';
import Edge from './Edge';
import ContextMenu from './ContextMenu';
import Toolbar from './Toolbar';
import ZoomControls from './ZoomControls';
import KeyboardShortcuts from './KeyboardShortcuts';
import FileDropZone from './FileDropZone';
import MiniMap from './MiniMap';
import NodeEditor from './NodeEditor';
import FeatureShowcase from './FeatureShowcase';
import SimpleNodeCreator from './SimpleNodeCreator';
import ConnectionTester from './ConnectionTester';


const Canvas: React.FC = () => {
  const { nodes, edges, addNode, addEdge, clearCanvas, snapToGrid, zoom, panX, panY, setZoom, setPan } = useCanvasStore();
  const [edgeStart, setEdgeStart] = useState<string | null>(null);
  const [edgePreview, setEdgePreview] = useState<{ x: number; y: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    console.log('Canvas clicked!', { target: e.target, currentTarget: e.currentTarget, isPanning });
    if (e.target === e.currentTarget && !isPanning) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = snapToGrid((e.clientX - rect.left - panX) / zoom);
      const y = snapToGrid((e.clientY - rect.top - panY) / zoom);
      console.log('Creating node at:', { x, y, zoom, panX, panY });
      addNode({ x, y, width: 180, height: 80, type: 'text', content: 'New Node' });
    }
    // Close context menu when clicking outside
    setContextMenu(null);
  };

  // Handle panning
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+click
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(panX + deltaX, panY + deltaY);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, panX, panY, setPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(Math.max(0.1, Math.min(3, zoom * delta)));
    }
  }, [zoom, setZoom]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case '0':
          e.preventDefault();
          setPan(0, 0);
          setZoom(1);
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoom(Math.min(zoom * 1.2, 3));
          break;
        case '-':
          e.preventDefault();
          setZoom(Math.max(zoom / 1.2, 0.1));
          break;
      }
    }
  }, [zoom, setZoom, setPan]);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleKeyDown, handleMouseMove, handleMouseUp, isPanning]);

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenu({
        nodeId,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle node editing
  const handleEditNode = (nodeId: string) => {
    setEditingNode(nodeId);
    setContextMenu(null);
  };

  // Toolbar actions
  const handleAddTextNode = () => {
    const x = snapToGrid(Math.random() * 400 + 100);
    const y = snapToGrid(Math.random() * 300 + 100);
    console.log('Adding text node via toolbar at:', { x, y });
    addNode({ x, y, width: 180, height: 80, type: 'text', content: 'Text Node' });
  };

  const handleAddImageNode = () => {
    const x = snapToGrid(Math.random() * 400 + 100);
    const y = snapToGrid(Math.random() * 300 + 100);
    console.log('Adding image node via toolbar at:', { x, y });
    addNode({ x, y, width: 200, height: 120, type: 'image', content: 'Image Node' });
  };


  // Called when user starts dragging from a node's edge handle
  const handleEdgeStart = (nodeId: string) => (e: React.MouseEvent) => {
    console.log('Edge start from node:', nodeId);
    e.stopPropagation();
    setEdgeStart(nodeId);
    setEdgePreview({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleEdgeDrag as EventListener);
    window.addEventListener('mouseup', handleEdgeEnd as EventListener);
  };

  // Update preview line as user drags
  const handleEdgeDrag = (e: MouseEvent | Event) => {
    // Support both MouseEvent and Event (from addEventListener)
    const evt = e as MouseEvent;
    setEdgePreview({ x: evt.clientX, y: evt.clientY });
  };

  // Complete edge creation if mouse is released over a node
  const handleEdgeEnd = (e: MouseEvent | Event) => {
    console.log('Edge end - no target found');
    setEdgePreview(null);
    setEdgeStart(null);
    window.removeEventListener('mousemove', handleEdgeDrag as EventListener);
    window.removeEventListener('mouseup', handleEdgeEnd as EventListener);
  };

  // Called by Node when mouse is released over a node
  const handleEdgeDrop = (targetNodeId: string) => {
    console.log('Edge drop on target node:', targetNodeId, 'from:', edgeStart);
    if (edgeStart && edgeStart !== targetNodeId) {
      console.log('Creating edge between:', edgeStart, '->', targetNodeId);
      addEdge(edgeStart, targetNodeId);
    }
    setEdgePreview(null);
    setEdgeStart(null);
    window.removeEventListener('mousemove', handleEdgeDrag as EventListener);
    window.removeEventListener('mouseup', handleEdgeEnd as EventListener);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-neutral-50 cursor-crosshair overflow-hidden"
      style={{ 
        minHeight: 600,
        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panX}px ${panY}px`
      }}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
    >
      {/* Toolbar */}
      <Toolbar
        onAddTextNode={handleAddTextNode}
        onAddImageNode={handleAddImageNode}
        onClearCanvas={clearCanvas}
      />

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Simple Node Creator for Testing */}
      <SimpleNodeCreator />

      {/* Connection Tester */}
      <ConnectionTester />

      {/* Zoom Controls */}
      <ZoomControls />

      {/* Mini Map */}
      <MiniMap />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* File Drop Zone */}
      <FileDropZone />

      {/* Canvas Content with zoom and pan transform */}
      <div
        style={{
          transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Edges */}
        {edges.map((edge) => (
          <Edge key={edge.id} edge={edge} />
        ))}
        
        {/* Edge preview while dragging */}
        {edgeStart && edgePreview && (() => {
          const fromNode = nodes.find((n) => n.id === edgeStart);
          if (!fromNode) return null;
          const x1 = fromNode.x + fromNode.width / 2;
          const y1 = fromNode.y + fromNode.height / 2;
          const rect = canvasRef.current?.getBoundingClientRect();
          const x2 = (edgePreview.x - (rect?.left || 0) - panX) / zoom;
          const y2 = (edgePreview.y - (rect?.top || 0) - panY) / zoom;
          return (
            <svg className="absolute pointer-events-none" style={{ left: 0, top: 0, width: '100%', height: '100%', zIndex: 2 }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#888" strokeWidth={2} strokeDasharray="4 2" />
            </svg>
          );
        })()}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onEdgeStart={(e) => handleEdgeStart(node.id)(e)}
            onEdgeDrop={edgeStart ? () => handleEdgeDrop(node.id) : undefined}
            onContextMenu={(e) => handleContextMenu(e, node.id)}
            onDoubleClick={() => handleEditNode(node.id)}
          />
        ))}
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={!!contextMenu}
        x={contextMenu?.x || 0}
        y={contextMenu?.y || 0}
        onClose={() => setContextMenu(null)}
        onEdit={() => contextMenu && handleEditNode(contextMenu.nodeId)}
        onSummarize={() => console.log('Summarize with AI:', contextMenu?.nodeId)}
        onExpandIdea={() => console.log('Expand Idea:', contextMenu?.nodeId)}
        onTag={() => console.log('Tag:', contextMenu?.nodeId)}
      />

      {/* Node Editor */}
      {editingNode && (
        <NodeEditor
          node={nodes.find(n => n.id === editingNode)!}
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
        />
      )}
    </div>
  );
};

export default Canvas;
