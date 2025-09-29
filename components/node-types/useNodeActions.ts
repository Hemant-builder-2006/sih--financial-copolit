import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useAppStore } from '../../store/useAppStore';
import { NodeData, AIAction } from './interfaces';

export const useNodeActions = (id: string, data: NodeData) => {
  const { setNodes } = useReactFlow();
  const { setAiSummary, addAlert } = useAppStore();

  const updateNode = useCallback((updates: Partial<NodeData>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [id, setNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleTitleEdit = useCallback(() => {
    updateNode({ isEditingTitle: true });
  }, [updateNode]);

  const handleDescEdit = useCallback(() => {
    updateNode({ isEditingDesc: true });
  }, [updateNode]);

  const handleSizeChange = useCallback((newSize: 'small' | 'medium' | 'large') => {
    const sizeConfig = {
      small: { width: 240, height: 200 },
      medium: { width: 320, height: 250 },
      large: { width: 400, height: 320 }
    };
    
    const config = sizeConfig[newSize];
    updateNode({ 
      size: newSize,
      width: config.width,
      height: config.height
    });
  }, [updateNode]);

  const handleAIAction = useCallback(async (action: AIAction, content: string) => {
    if (!content.trim()) {
      addAlert('Please provide content for AI analysis', 'warning');
      return;
    }

    updateNode({ aiStatus: 'processing' });

    try {
      // Call our secure backend API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: content, 
          action: action.toLowerCase() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.result || 'No response received from AI service.';
      
      updateNode({ 
        aiStatus: 'done',
        aiResponse: aiResponse
      });
      
      // Update global AI summary in store
      setAiSummary(`Latest AI Analysis: ${aiResponse.substring(0, 200)}${aiResponse.length > 200 ? '...' : ''} Generated from ${data.type} node "${data.title}".`);
      
      // Add success alert
      addAlert(`AI ${action} completed successfully`, 'info');
      
    } catch (error) {
      console.error('AI action error:', error);
      
      // Fallback to mock result on error
      const mockResponse = `Mock ${action} completed for: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}" (${error instanceof Error ? error.message : 'AI service unavailable'})`;
      updateNode({ 
        aiStatus: 'done',
        aiResponse: mockResponse
      });
      
      // Update global AI summary in store
      setAiSummary(`Latest AI Analysis: ${mockResponse}. Generated from ${data.type} node "${data.title}".`);
      
      // Add error alert
      addAlert(`AI ${action} failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'warning');
    }
  }, [updateNode, data.type, data.title, setAiSummary, addAlert]);

  return {
    updateNode,
    deleteNode,
    handleTitleEdit,
    handleDescEdit,
    handleSizeChange,
    handleAIAction
  };
};