import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Bot, ExternalLink, Trash2 } from 'lucide-react';
import { AINodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';

const AINode: React.FC<BaseNodeProps<AINodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  
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

  const performAIAction = async (action: string) => {
    const content = data.query || '';
    if (!content.trim()) {
      return;
    }
    await handleAIAction(action as any, content);
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
          {/* AI Action - Only Analyze Button */}
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm bg-indigo-50 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400 text-indigo-700"
              onClick={() => performAIAction('analyze')}
              disabled={data.aiStatus === 'processing' || !data.query?.trim()}
            >
              {data.aiStatus === 'processing' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
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