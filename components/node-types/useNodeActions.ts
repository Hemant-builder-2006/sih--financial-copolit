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
      // Simulate AI processing with mock responses (purely frontend)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      let aiResponse: string;
      switch (action.toLowerCase()) {
        case 'analyze':
          aiResponse = `Analysis of "${content}": This content appears to be well-structured and informative. Key themes include innovation, efficiency, and user experience. The tone is professional and engaging, making it suitable for business contexts.`;
          break;
        case 'summarize':
          aiResponse = `Summary of "${content}": ${content.length > 100 ? content.substring(0, 100) + '...' : content} (This is a concise summary highlighting the main points and key takeaways from the original content.)`;
          break;
        case 'expand':
          aiResponse = `Expanded version of "${content}": ${content} Additionally, this topic encompasses various aspects that deserve deeper exploration. The implications extend beyond the immediate scope, offering opportunities for innovation and improvement. Consider the broader context and potential applications in different scenarios.`;
          break;
        default:
          aiResponse = `Mock AI ${action} result for: "${content}" - This is a simulated response demonstrating the AI functionality in frontend-only mode.`;
      }
      
      updateNode({ 
        aiStatus: 'done',
        aiResponse: aiResponse
      });
      
      // Update global AI summary in store
      setAiSummary(`Latest AI Analysis: ${aiResponse}. Generated from ${data.type} node "${data.title}".`);
      
      // Add success alert
      addAlert(`AI ${action} completed successfully`, 'info');
      
    } catch (error) {
      console.error('AI action error:', error);
      
      // Fallback to mock result on error
      const mockResponse = `Mock ${action} completed for: ${data.title} (${error instanceof Error ? error.message : 'AI service unavailable'})`;
      updateNode({ 
        aiStatus: 'done',
        aiResponse: mockResponse
      });
      
      // Update global AI summary in store
      setAiSummary(`Latest AI Analysis: ${mockResponse}. Generated from ${data.type} node "${data.title}".`);
      
      // Add error alert
      addAlert(`AI ${action} failed, using mock result`, 'warning');
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