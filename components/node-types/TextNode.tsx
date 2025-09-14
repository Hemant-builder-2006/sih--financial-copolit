import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, MoreHorizontal, ExternalLink, Trash2, Upload } from 'lucide-react';
import { TextNodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';

const TextNode: React.FC<BaseNodeProps<TextNodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addAlert } = useAppStore();
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

  const handleContentUpdate = (content: string) => {
    updateNode({ content });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a text file
    const allowedTypes = ['text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript', 'application/json'];
    const isTextFile = allowedTypes.includes(file.type) || file.name.match(/\.(txt|md|json|csv|html|css|js|jsx|ts|tsx|xml|log)$/i);
    
    if (!isTextFile) {
      addAlert('Please upload a text file (txt, md, json, csv, html, css, js, etc.)', 'warning');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileSize = file.size;
      const fileName = file.name;
      const lastModified = new Date(file.lastModified).toLocaleString();
      
      updateNode({
        content,
        fileName,
        fileSize,
        lastModified
      });
      
      addAlert(`Text file "${fileName}" uploaded successfully`, 'info');
    };
    
    reader.onerror = () => {
      addAlert('Failed to read the text file.', 'danger');
    };
    
    reader.readAsText(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <NodeResizer 
        minWidth={200} 
        minHeight={160}
        isVisible={selected}
        onResize={(event, { width, height }) => {
          updateNode({ 
            width: Math.round(width), 
            height: Math.round(height),
            size: 'custom'
          });
        }}
      />

      {/* Enhanced NodeCard */}
      <Card 
        className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 group hover:-translate-y-0.5"
        style={{ 
          width: currentWidth, 
          height: currentHeight,
          minHeight: currentHeight,
          maxWidth: currentWidth,
          position: 'relative'
        }}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-3">
            {/* Icon with colored background */}
            <div className="p-2 rounded-xl bg-blue-50 flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            
            {/* Title and Controls */}
            <div className="flex-1 min-w-0">
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="w-full text-lg font-semibold bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 text-gray-900"
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
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
                  onClick={handleTitleEdit}
                  title={data.title}
                >
                  {data.title}
                </h3>
              )}
              
              {/* Node controls */}
              <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-1 overflow-auto">
          {/* Description */}
          <div className="mb-3">
            {data.isEditingDesc ? (
              <textarea
                ref={descInputRef}
                defaultValue={data.description}
                className="w-full text-sm text-gray-600 bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
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
                className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Text Content Area */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <textarea
                placeholder="Enter your text content here or upload a text file..."
                value={data.content || ''}
                onChange={(e) => handleContentUpdate(e.target.value)}
                className="flex-1 h-20 text-sm border border-gray-200 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                title="Upload text file"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.csv,.html,.css,.js,.jsx,.ts,.tsx,.xml,.log,text/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* File info display */}
            {data.fileName && (
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{data.fileName}</span>
                  <span>{data.fileSize ? formatFileSize(data.fileSize) : ''}</span>
                </div>
                {data.lastModified && (
                  <div className="text-gray-500">Uploaded: {data.lastModified}</div>
                )}
              </div>
            )}
          </div>

          {/* AI Response */}
          {data.aiResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-blue-800 mb-1">AI Analysis</div>
              <div className="text-blue-700 whitespace-pre-wrap">{data.aiResponse}</div>
            </div>
          )}
        </CardContent>
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
    </>
  );
};

export default TextNode;