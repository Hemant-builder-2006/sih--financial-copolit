import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Image, MoreHorizontal, Trash2, Upload, ExternalLink } from 'lucide-react';
import { ImageNodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';

const ImageNode: React.FC<BaseNodeProps<ImageNodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleImageImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addAlert('Please select a valid image file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateNode({
        imageUrl: imageUrl,
        fileName: file.name,
        fileSize: file.size,
        description: data.description || `Image: ${file.name}`
      });
      addAlert(`Image "${file.name}" loaded successfully`, 'info');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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
          minHeight: currentHeight 
        }}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-3">
            {/* Icon with colored background */}
            <div className="p-2 rounded-xl bg-green-50 flex-shrink-0">
              <Image className="w-5 h-5 text-green-600" />
            </div>
            
            {/* Title and Controls */}
            <div className="flex-1 min-w-0">
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="w-full text-lg font-semibold bg-transparent border-b border-green-300 focus:outline-none focus:border-green-500 text-gray-900"
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
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-green-600 transition-colors truncate"
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
                className="w-full text-sm text-gray-600 bg-transparent border border-green-300 rounded p-2 focus:outline-none focus:border-green-500 resize-none"
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
                className="text-sm text-gray-600 cursor-pointer hover:text-green-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Image Upload/Display Area */}
          {data.imageUrl ? (
            <div className="mb-3">
              <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                <img 
                  src={data.imageUrl} 
                  alt={data.fileName || "Uploaded image"}
                  className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(data.imageUrl, '_blank')}
                />
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{data.fileName}</span>
                    {data.imageUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-auto hover:bg-green-200"
                        onClick={() => window.open(data.imageUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {data.fileSize && (
                    <div className="text-xs text-green-600 mt-1">
                      Size: {formatFileSize(data.fileSize)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-green-200 text-green-600 hover:bg-green-50"
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageImport}
                className="hidden"
              />
            </div>
          )}

          {/* AI Response */}
          {data.aiResponse && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-green-800 mb-1">AI Analysis</div>
              <div className="text-green-700 whitespace-pre-wrap">{data.aiResponse}</div>
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

export default ImageNode;