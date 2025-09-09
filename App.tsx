// --- Custom DisconnectEdge component ---
const DisconnectEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <g>
      <path
        id={id}
        style={{ stroke: '#6366f1', strokeWidth: 2, ...style }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={24}
        height={24}
        x={labelX - 12}
        y={labelY - 12}
        className="overflow-visible"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button
          onClick={() => data?.onDelete?.(id)}
          style={{ width: 24, height: 24, borderRadius: 12, background: '#fff', border: '1.5px solid #e5e7eb', color: '#ef4444', fontWeight: 700, fontSize: 16, boxShadow: '0 1px 4px #0002', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          title="Delete edge"
        >
          ×
        </button>
      </foreignObject>
    </g>
  );
};

import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  Edge,
  Handle,
  Position,
  getBezierPath,
  EdgeProps,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  NodeProps,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

// --- Custom AINode component ---
const AINode: React.FC<NodeProps> = ({ data }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 120, textAlign: 'center' }}>
    <div style={{ fontWeight: 600, color: '#222' }}>{data?.label || 'AI Node'}</div>
    <Handle type="target" position={Position.Left} style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, left: -8, top: '50%', border: '2px solid #fff' }} />
    <Handle type="source" position={Position.Right} style={{ background: '#22c55e', width: 12, height: 12, borderRadius: 6, right: -8, top: '50%', border: '2px solid #fff' }} />
  </div>
);


const initialNodes: Node[] = [
  {
    id: "A",
    position: { x: 100, y: 200 },
    data: { label: "Node A" },
    type: "aiNode",
  },
  {
    id: "B",
    position: { x: 400, y: 200 },
    data: { label: "Node B" },
    type: "aiNode",
  },
];

const initialEdges: Edge[] = [
  {
    id: "A-B",
    source: "A",
    target: "B",
    type: "default",
  },
];


const nodeTypes = { aiNode: AINode };
const edgeTypes = { disconnect: DisconnectEdge };

function FlowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeCount, setNodeCount] = useState(1);

  // Delete edge handler
  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, []);

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  // Custom onConnect to create disconnect edge with delete handler
  const onConnect: OnConnect = useCallback(
    (params) => {
      if (params.source && params.target) {
        setEdges((eds) => [
          ...eds,
          {
            id: `edge-${params.source}-${params.target}-${Date.now()}`,
            source: params.source as string,
            target: params.target as string,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
            type: 'disconnect',
            data: { onDelete: handleDeleteEdge },
          },
        ]);
      }
    },
    [handleDeleteEdge]
  );

  // Add onDelete to initial edge
  const edgesWithDelete = edges.map(e => e.type === 'disconnect' ? e : { ...e, type: 'disconnect', data: { onDelete: handleDeleteEdge } });

  // Add AI Node handler
  const handleAddNode = () => {
    const newId = `ai-${Date.now()}-${nodeCount}`;
    const newNode: Node = {
      id: newId,
      type: 'aiNode',
      position: {
        x: 120 + (nodes.length % 4) * 160,
        y: 100 + Math.floor(nodes.length / 4) * 100,
      },
      data: { label: `AI Node ${nodeCount}` },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCount((c) => c + 1);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Toolbar */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={handleAddNode}
          style={{ padding: '8px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, boxShadow: '0 1px 4px #0002', cursor: 'pointer' }}
        >
          Add AI Node
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithDelete}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        panOnScroll
        zoomOnScroll
        panOnDrag
        zoomOnPinch
      >
        <Background gap={20} color="#e5e7eb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}


export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}


