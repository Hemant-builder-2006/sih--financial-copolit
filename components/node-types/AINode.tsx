import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Bot, ExternalLink, Trash2 } from 'lucide-react';
import { AINodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';
import { sendAIAnalysis, recalculateKPIs } from '../../lib/api-utils';

const AINode: React.FC<BaseNodeProps<AINodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const { setAiSummary, addAlert } = useAppStore();
  const {
    updateNode,
    deleteNode,
    handleTitleEdit,
    handleDescEdit,
    handleSizeChange,
    handleAIAction
  } = useNodeActions(id, data);
  const currentSize = data.size || 'medium';
  const currentWidth = data.width || sizeConfig[currentSize as keyof typeof sizeConfig].width;
  const currentHeight = data.height || sizeConfig[currentSize as keyof typeof sizeConfig].height;

  // Use ReactFlow hook to get nodes and edges
  const { getNodes, getEdges } = useReactFlow();

  React.useEffect(() => {
    if (data.isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
    if (data.isEditingDesc && descInputRef.current) {
      descInputRef.current.focus();
      descInputRef.current.select();
    }
  }, [data.isEditingTitle, data.isEditingDesc]);

  const handleTitleSubmit = (value: string) => {
    updateNode({ title: value, isEditingTitle: false });
  };

  const handleDescSubmit = (value: string) => {
    updateNode({ description: value, isEditingDesc: false });
  };

  // Helper to get all connected node data
  const getAllConnectedNodes = () => {
    const edges = getEdges();
    const nodes = getNodes();
    
    // Find all incoming edges to this AI node
    const incomingEdges = edges.filter((e: any) => e.target === id);
    
    const connectedNodes: Array<{id: string, type: string, content: string}> = [];
    
    incomingEdges.forEach((edge: any) => {
      const sourceNode = nodes.find((n: any) => n.id === edge.source);
      if (!sourceNode) return;
      
      let content = '';
      
      // Extract content based on node type
      switch (sourceNode.type) {
        case 'text':
          content = sourceNode.data.content || '';
          break;
          
        case 'document':
          // Prefer extractedText if available (Excel/CSV/text)
          if (sourceNode.data.extractedText && sourceNode.data.extractedText.trim().length > 0) {
            content = sourceNode.data.extractedText;
          }
          // Try to decode documentData for text/CSV files
          else if (
            sourceNode.data.documentData &&
            sourceNode.data.fileType &&
            (sourceNode.data.fileType.startsWith('text') || sourceNode.data.fileType === 'text/csv')
          ) {
            try {
              const uint8 = new Uint8Array(sourceNode.data.documentData);
              content = new TextDecoder('utf-8').decode(uint8);
            } catch {
              content = sourceNode.data.fileName || '';
            }
          }
          // Fallback to file info
          else {
            content = `[Document: ${sourceNode.data.fileName || 'Unknown'} - ${sourceNode.data.fileType || 'Unknown type'}]`;
          }
          break;
          
        case 'image':
          content = `[Image: ${sourceNode.data.fileName || 'Unknown'} - ${sourceNode.data.description || 'No description'}]`;
          break;
          
        case 'video':
          content = sourceNode.data.transcription || 
                   `[Video: ${sourceNode.data.fileName || 'Unknown'} - ${sourceNode.data.description || 'No description'}]`;
          break;
          
        case 'company':
          content = `[Company: ${sourceNode.data.companyName || 'Unknown'} - ${sourceNode.data.industry || 'Unknown industry'} - ${sourceNode.data.businessDescription || 'No description'}]`;
          break;
          
        case 'shopify':
          if (sourceNode.data.shopData) {
            const shop = sourceNode.data.shopData.shop;
            const products = sourceNode.data.shopData.products;
            const orders = sourceNode.data.shopData.orders;
            
            let shopifyContent = `[Shopify Store Data]`;
            
            if (shop) {
              shopifyContent += `\n\nStore Information:
- Name: ${shop.name}
- Domain: ${shop.domain}
- Email: ${shop.email}
- Currency: ${shop.currency}
- Timezone: ${shop.timezone}
- Plan: ${shop.plan_name}
- Created: ${new Date(shop.created_at).toLocaleDateString()}`;
            }
            
            if (products) {
              shopifyContent += `\n\nProducts Overview:
- Total Products: ${products.count}`;
              if (products.recent.length > 0) {
                shopifyContent += `\n- Recent Products:`;
                products.recent.forEach((product: any) => {
                  shopifyContent += `\n  • ${product.title} (${product.vendor}) - ${product.status}`;
                });
              }
            }
            
            if (orders) {
              shopifyContent += `\n\nOrders Overview:
- Total Orders: ${orders.count}`;
              if (orders.recent.length > 0) {
                shopifyContent += `\n- Recent Orders:`;
                orders.recent.forEach((order: any) => {
                  shopifyContent += `\n  • ${order.name}: ${order.total_price} ${order.currency} - ${order.financial_status}`;
                });
              }
            }
            
            content = shopifyContent;
          } else {
            content = `[Shopify Store: ${sourceNode.data.storeUrl || 'No data fetched yet'}]`;
          }
          break;
          
        default:
          content = sourceNode.data.title || sourceNode.data.description || `[${sourceNode.type} node]`;
      }
      
      if (content.trim()) {
        connectedNodes.push({
          id: sourceNode.id,
          type: sourceNode.type || 'unknown',
          content: content
        });
      }
    });
    
    return connectedNodes;
  };

  // Legacy helper for backwards compatibility
  const getConnectedNodeContent = () => {
    const connectedNodes = getAllConnectedNodes();
    return connectedNodes.length > 0 ? connectedNodes[0].content : '';
  };

  const performAIAction = async (action: string) => {
    // Get all connected nodes
    const connectedNodes = getAllConnectedNodes();
    
    // If we have connected nodes, use the new multi-node format
    if (connectedNodes.length > 0) {
      updateNode({ aiStatus: 'processing' });
      
      try {
        // Call backend API with multi-node format and save insights
        const aiResponse = await sendAIAnalysis(connectedNodes, action.toLowerCase(), id);
        
        updateNode({ 
          aiStatus: 'done',
          aiResponse: aiResponse
        });
        
        // Update global AI summary in store
        if (setAiSummary) {
          setAiSummary(`Latest AI Analysis: ${aiResponse.substring(0, 200)}${aiResponse.length > 200 ? '...' : ''} Generated from ${connectedNodes.length} connected nodes.`);
        }
        
        // Add success alert
        if (addAlert) {
          addAlert(`AI ${action} completed successfully on ${connectedNodes.length} nodes`, 'info');
        }

        // Recalculate KPIs in background after AI analysis
        recalculateKPIs().catch(console.error);
        
      } catch (error) {
        console.error('AI action error:', error);
        
        // Fallback to mock result on error
        const mockResponse = `Mock ${action} completed on ${connectedNodes.length} connected nodes (${error instanceof Error ? error.message : 'AI service unavailable'})`;
        updateNode({ 
          aiStatus: 'done',
          aiResponse: mockResponse
        });
        
        // Add error alert
        if (addAlert) {
          addAlert(`AI ${action} failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'danger');
        }
      }
    }
    // Fallback to legacy single-prompt format if no connections
    else {
      const content = data.query || '';
      if (!content.trim()) {
        return;
      }
      await handleAIAction(action as any, content);
    }
  };

  return (
    <>
      <NodeResizer
        color="rgb(99, 102, 241)"
        isVisible={selected}
        minWidth={200}
        minHeight={160}
        onResizeEnd={(event, data) => {
          updateNode({ width: data.width, height: data.height });
        }}
      />
      
      <div style={{ position: 'relative', width: currentWidth, height: currentHeight }}>
        <Card 
          className={`
            border-2 transition-all duration-200 bg-white shadow-md relative z-10
            ${selected ? 'border-indigo-500 shadow-lg' : 'border-indigo-300'}
            hover:shadow-lg hover:border-indigo-400
          `}
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'relative',
            overflow: 'visible'
          }}
        >
        <CardHeader className="p-3 pb-2 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Bot className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="flex-1 text-sm font-medium bg-transparent border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                  onBlur={(e) => handleTitleSubmit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSubmit(e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      updateNode({ isEditingTitle: false });
                    }
                  }}
                />
              ) : (
                <h3 
                  className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:text-indigo-600 transition-colors flex-1"
                  onClick={handleTitleEdit}
                  title={data.title}
                >
                  {data.title}
                </h3>
              )}
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-1 ml-2">
              {data.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-indigo-100"
                  onClick={() => window.open(data.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                onClick={deleteNode}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

        </CardHeader>

        <CardContent className="p-3 pt-2 flex-1 overflow-auto">
          {/* Description */}
          <div className="mb-3">
            {data.isEditingDesc ? (
              <textarea
                ref={descInputRef}
                defaultValue={data.description}
                className="w-full text-sm text-gray-600 bg-transparent border border-indigo-300 rounded p-2 focus:outline-none focus:border-indigo-500 resize-none"
                rows={2}
                onBlur={(e) => handleDescSubmit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleDescSubmit(e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    updateNode({ isEditingDesc: false });
                  }
                }}
              />
            ) : (
              <p 
                className="text-sm text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* AI Query Input */}
          <div className="mb-3">
            <textarea
              placeholder="Enter your prompt or question for AI analysis..."
              value={data.query || ''}
              onChange={(e) => updateNode({ query: e.target.value })}
              className="w-full text-sm bg-indigo-50 border border-indigo-200 rounded p-3 focus:outline-none focus:border-indigo-500 resize-none min-h-[80px]"
              rows={3}
            />
          </div>

          {/* AI Response */}
          {data.aiResponse && (
            <div className="mt-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-700">AI Analysis</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {data.aiResponse}
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {data.aiStatus === 'processing' && (
            <div className="flex items-center gap-2 mt-3 text-indigo-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 pt-2">
          {/* AI Actions - Multiple Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-indigo-50 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400 text-indigo-700"
                onClick={() => performAIAction('analyze')}
                disabled={data.aiStatus === 'processing' || !data.query?.trim()}
              >
                {data.aiStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-1"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 mr-1" />
                    Analyze
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-400 text-blue-700"
                onClick={() => performAIAction('summarize')}
                disabled={data.aiStatus === 'processing' || !data.query?.trim()}
              >
                📝 Summarize
              </Button>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400 text-green-700"
                onClick={() => performAIAction('expand')}
                disabled={data.aiStatus === 'processing' || !data.query?.trim()}
              >
                🔍 Expand
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-purple-50 border-purple-300 hover:bg-purple-100 hover:border-purple-400 text-purple-700"
                onClick={() => performAIAction('improve')}
                disabled={data.aiStatus === 'processing' || !data.query?.trim()}
              >
                ✨ Improve
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Connection Handles - Input and Output on both sides */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-left"
        style={{ 
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          left: '-6px',
          top: '30%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="output-left"
        style={{ 
          background: '#10b981',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          left: '-6px',
          top: '70%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="input-right"
        style={{ 
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          right: '-6px',
          top: '30%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-right"
        style={{ 
          background: '#10b981',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          right: '-6px',
          top: '70%',
          transform: 'translateY(-50%)'
        }}
      />
      </div>
    </>
  );
};

export default AINode;