// types/canvas.ts
export interface AINode {
  id: string;
  type: 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'code' | 'link';
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  metadata?: {
    summary?: string;
    tags?: string[];
    embeddings?: number[];
    sourceFile?: string;
    transcript?: string;
    duration?: string;
    pageCount?: number;
    url?: string;
    aiGenerated?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  metadata?: {
    relationshipType?: 'causal' | 'temporal' | 'semantic' | 'hierarchical';
    confidence?: number;
  };
  createdAt: Date;
}

export interface CanvasState {
  nodes: AINode[];
  edges: AIEdge[];
  selectedNodeIds: string[];
  isLoading: boolean;
  error?: string;
}

export interface AIAction {
  type: 'summarize' | 'expand' | 'tag' | 'transcribe' | 'embed';
  nodeId: string;
  payload?: any;
}

export interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  action: (nodeId: string) => void;
  disabled?: boolean;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}
