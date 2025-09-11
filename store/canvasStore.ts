// Zustand store for nodes and edges
import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type NodeType = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'text' | 'image' | 'pdf' | 'video' | 'ai' | 'document' | 'note' | 'audio';
  content: string;
  aiStatus?: 'idle' | 'processing' | 'done';
  aiResponse?: string;
};

export type EdgeType = {
  id: string;
  from: string; // node id
  to: string;   // node id
  label?: string;
};

interface CanvasState {
  nodes: NodeType[];
  edges: EdgeType[];
  gridSize: number;
  zoom: number;
  panX: number;
  panY: number;
  addNode: (node: Omit<NodeType, 'id'>) => void;
  updateNode: (id: string, updates: Partial<NodeType>) => void;
  addEdge: (from: string, to: string) => void;
  updateEdge: (id: string, updates: Partial<EdgeType>) => void;
  clearCanvas: () => void;
  snapToGrid: (value: number) => number;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  nodes: [],
  edges: [],
  gridSize: 20,
  zoom: 1,
  panX: 0,
  panY: 0,
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, { ...node, id: nanoid() }],
  })),
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((n) => n.id === id ? { ...n, ...updates } : n),
  })),
  addEdge: (from, to) => set((state) => ({
    edges: [...state.edges, { id: nanoid(), from, to }],
  })),
  updateEdge: (id, updates) => set((state) => ({
    edges: state.edges.map((e) => e.id === id ? { ...e, ...updates } : e),
  })),
  clearCanvas: () => set(() => ({
    nodes: [],
    edges: [],
  })),
  snapToGrid: (value) => {
    const gridSize = 20;
    return Math.round(value / gridSize) * gridSize;
  },
  setZoom: (zoom) => set(() => ({ zoom })),
  setPan: (panX, panY) => set(() => ({ panX, panY })),
  resetView: () => set(() => ({ zoom: 1, panX: 0, panY: 0 })),
}));
