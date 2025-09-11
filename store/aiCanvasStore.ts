// store/aiCanvasStore.ts
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { AINode, AIEdge, CanvasState, AIAction } from '../types/canvas';

interface AICanvasStore extends CanvasState {
  // Canvas view state
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showMinimap: boolean;
  
  // Node operations
  addNode: (nodeData: Omit<AINode, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNode: (id: string, updates: Partial<AINode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string) => void;
  selectMultipleNodes: (ids: string[]) => void;
  deselectAll: () => void;
  selectAll: () => void;
  duplicateSelected: () => void;
  
  // Enhanced node operations
  alignNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeNodes: (direction: 'horizontal' | 'vertical') => void;
  groupNodes: (nodeIds: string[]) => void;
  ungroupNodes: (groupId: string) => void;
  
  // Canvas view operations
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  toggleGrid: () => void;
  toggleMinimap: () => void;
  resetView: () => void;
  fitToScreen: () => void;
  
  // Edge operations
  addEdge: (edgeData: Omit<AIEdge, 'id' | 'createdAt'>) => string;
  updateEdge: (id: string, updates: Partial<AIEdge>) => void;
  deleteEdge: (id: string) => void;
  
  // AI operations
  executeAIAction: (action: AIAction) => Promise<void>;
  summarizeNode: (nodeId: string) => Promise<void>;
  expandNode: (nodeId: string) => Promise<void>;
  tagNode: (nodeId: string, tags: string[]) => void;
  transcribeMedia: (nodeId: string, file: File) => Promise<void>;
  
  // Canvas operations
  clearCanvas: () => void;
  loadWorkspace: (data: { nodes: AINode[]; edges: AIEdge[] }) => void;
  exportWorkspace: () => { nodes: AINode[]; edges: AIEdge[] };
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
}

// Mock AI service functions (replace with real API calls)
const mockAIService = {
  async summarize(content: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Summary: ${content.substring(0, 100)}...`;
  },
  
  async expand(content: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Expanded: ${content} - This could be developed further with additional context...`;
  },
  
  async generateTags(content: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return ['ai-generated', 'summary', 'idea'];
  },
  
  async transcribe(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `Transcription of ${file.name}: This is a mock transcription...`;
  }
};

export const useAICanvasStore = create<AICanvasStore>()((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  isLoading: false,
  error: undefined,
  
  // Canvas view state
  zoom: 1,
  panX: 0,
  panY: 0,
  showGrid: true,
  showMinimap: false,

  // Node operations
  addNode: (nodeData) => {
        const id = nanoid();
        const now = new Date();
        const newNode: AINode = {
          ...nodeData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          nodes: [...state.nodes, newNode],
        }));
        
        return id;
      },
      
      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id
              ? { ...node, ...updates, updatedAt: new Date() }
              : node
          ),
        }));
      },
      
      deleteNode: (id) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter((edge) => 
            edge.fromNodeId !== id && edge.toNodeId !== id
          ),
          selectedNodeIds: state.selectedNodeIds.filter((nodeId) => nodeId !== id),
        }));
      },
      
      selectNode: (id) => {
        set({ selectedNodeIds: [id] });
      },
      
      selectMultipleNodes: (ids) => {
        set({ selectedNodeIds: ids });
      },
      
      deselectAll: () => {
        set({ selectedNodeIds: [] });
      },
      
      // Edge operations
      addEdge: (edgeData) => {
        const id = nanoid();
        const newEdge: AIEdge = {
          ...edgeData,
          id,
          createdAt: new Date(),
        };
        
        set((state) => ({
          edges: [...state.edges, newEdge],
        }));
        
        return id;
      },
      
      updateEdge: (id, updates) => {
        set((state) => ({
          edges: state.edges.map((edge) =>
            edge.id === id ? { ...edge, ...updates } : edge
          ),
        }));
      },
      
      deleteEdge: (id) => {
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== id),
        }));
      },
      
      // AI operations
      executeAIAction: async (action) => {
        const { setLoading, setError } = get();
        
        try {
          setLoading(true);
          setError(undefined);
          
          switch (action.type) {
            case 'summarize':
              await get().summarizeNode(action.nodeId);
              break;
            case 'expand':
              await get().expandNode(action.nodeId);
              break;
            case 'transcribe':
              await get().transcribeMedia(action.nodeId, action.payload.file);
              break;
            default:
              throw new Error(`Unknown AI action: ${action.type}`);
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      },
      
      summarizeNode: async (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (!node) return;
        
        const summary = await mockAIService.summarize(node.content);
        
        get().updateNode(nodeId, {
          metadata: {
            ...node.metadata,
            summary,
          },
        });
      },
      
      expandNode: async (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (!node) return;
        
        const expanded = await mockAIService.expand(node.content);
        
        // Create a new node with expanded content
        get().addNode({
          type: 'text',
          title: 'Expanded: ' + node.title,
          content: expanded,
          x: node.x + 250,
          y: node.y,
          width: 300,
          height: 150,
        });
      },
      
      tagNode: (nodeId, tags) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (!node) return;
        
        get().updateNode(nodeId, {
          metadata: {
            ...node.metadata,
            tags,
          },
        });
      },
      
      transcribeMedia: async (nodeId, file) => {
        const transcript = await mockAIService.transcribe(file);
        
        get().updateNode(nodeId, {
          content: transcript,
          metadata: {
            sourceFile: file.name,
            transcript,
          },
        });
      },
      
      // Canvas operations
      clearCanvas: () => {
        set({
          nodes: [],
          edges: [],
          selectedNodeIds: [],
        });
      },
      
      loadWorkspace: (data) => {
        set({
          nodes: data.nodes,
          edges: data.edges,
          selectedNodeIds: [],
        });
      },
      
      exportWorkspace: () => {
        const { nodes, edges } = get();
        return { nodes, edges };
      },
      
      // Utility
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      // Enhanced selection operations
      selectAll: () => {
        const { nodes } = get();
        set({ selectedNodeIds: nodes.map(node => node.id) });
      },
      
      duplicateSelected: () => {
        const { nodes, selectedNodeIds, addNode } = get();
        const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id));
        const newNodeIds: string[] = [];
        
        selectedNodes.forEach(node => {
          const newNodeId = addNode({
            ...node,
            x: node.x + 20,
            y: node.y + 20,
          });
          newNodeIds.push(newNodeId);
        });
        
        set({ selectedNodeIds: newNodeIds });
      },
      
      // Alignment operations
      alignNodes: (alignment) => {
        const { nodes, selectedNodeIds } = get();
        if (selectedNodeIds.length < 2) return;
        
        const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id));
        
        let targetValue: number;
        
        switch (alignment) {
          case 'left':
            targetValue = Math.min(...selectedNodes.map(node => node.x));
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { x: targetValue });
            });
            break;
          case 'right':
            targetValue = Math.max(...selectedNodes.map(node => node.x + node.width));
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { x: targetValue - node.width });
            });
            break;
          case 'center':
            const avgX = selectedNodes.reduce((sum, node) => sum + node.x + node.width / 2, 0) / selectedNodes.length;
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { x: avgX - node.width / 2 });
            });
            break;
          case 'top':
            targetValue = Math.min(...selectedNodes.map(node => node.y));
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { y: targetValue });
            });
            break;
          case 'bottom':
            targetValue = Math.max(...selectedNodes.map(node => node.y + node.height));
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { y: targetValue - node.height });
            });
            break;
          case 'middle':
            const avgY = selectedNodes.reduce((sum, node) => sum + node.y + node.height / 2, 0) / selectedNodes.length;
            selectedNodes.forEach(node => {
              get().updateNode(node.id, { y: avgY - node.height / 2 });
            });
            break;
        }
      },
      
      distributeNodes: (direction) => {
        const { nodes, selectedNodeIds } = get();
        if (selectedNodeIds.length < 3) return;
        
        const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id));
        
        if (direction === 'horizontal') {
          selectedNodes.sort((a, b) => a.x - b.x);
          const totalWidth = selectedNodes[selectedNodes.length - 1].x - selectedNodes[0].x;
          const spacing = totalWidth / (selectedNodes.length - 1);
          
          selectedNodes.forEach((node, index) => {
            if (index > 0 && index < selectedNodes.length - 1) {
              get().updateNode(node.id, { x: selectedNodes[0].x + spacing * index });
            }
          });
        } else {
          selectedNodes.sort((a, b) => a.y - b.y);
          const totalHeight = selectedNodes[selectedNodes.length - 1].y - selectedNodes[0].y;
          const spacing = totalHeight / (selectedNodes.length - 1);
          
          selectedNodes.forEach((node, index) => {
            if (index > 0 && index < selectedNodes.length - 1) {
              get().updateNode(node.id, { y: selectedNodes[0].y + spacing * index });
            }
          });
        }
      },
      
      groupNodes: (nodeIds) => {
        // TODO: Implement grouping logic
        console.log('Grouping nodes:', nodeIds);
      },
      
      ungroupNodes: (groupId) => {
        // TODO: Implement ungrouping logic
        console.log('Ungrouping:', groupId);
      },
      
      // Canvas view operations
      setZoom: (zoom: number) => {
        set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
      },
      
      setPan: (panX: number, panY: number) => {
        set({ panX, panY });
      },
      
      toggleGrid: () => {
        set(state => ({ showGrid: !state.showGrid }));
      },
      
      toggleMinimap: () => {
        set(state => ({ showMinimap: !state.showMinimap }));
      },
      
      resetView: () => {
        set({ zoom: 1, panX: 0, panY: 0 });
      },
      
      fitToScreen: () => {
        const { nodes } = get();
        if (nodes.length === 0) return;
        
        const minX = Math.min(...nodes.map(node => node.x));
        const minY = Math.min(...nodes.map(node => node.y));
        const maxX = Math.max(...nodes.map(node => node.x + node.width));
        const maxY = Math.max(...nodes.map(node => node.y + node.height));
        
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        
        // Assume canvas size of 1200x800 for now
        const canvasWidth = 1200;
        const canvasHeight = 800;
        
        const zoomX = canvasWidth / (contentWidth + 100);
        const zoomY = canvasHeight / (contentHeight + 100);
        const zoom = Math.min(zoomX, zoomY, 1);
        
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        set({
          zoom,
          panX: canvasWidth / 2 - centerX * zoom,
          panY: canvasHeight / 2 - centerY * zoom,
        });
      },
    }));
