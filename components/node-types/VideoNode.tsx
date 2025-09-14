import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Video, MoreHorizontal, Trash2, Upload, ExternalLink, Play } from 'lucide-react';
import { VideoNodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';

const VideoNode: React.FC<BaseNodeProps<VideoNodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleVideoImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      addAlert('Please select a valid video or audio file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const videoUrl = e.target?.result as string;
      updateNode({
        videoUrl: videoUrl,
        fileName: file.name,
        fileSize: file.size,
        description: data.description || `${file.type.startsWith('video/') ? 'Video' : 'Audio'}: ${file.name}`,
        transcription: 'Transcription will be available after processing...'
      });
      addAlert(`${file.type.startsWith('video/') ? 'Video' : 'Audio'} "${file.name}" loaded successfully`, 'info');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleTranscriptionUpdate = (transcription: string) => {
    updateNode({ transcription });
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
            <div className="p-2 rounded-xl bg-purple-50 flex-shrink-0">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            
            {/* Title and Controls */}
            <div className="flex-1 min-w-0">
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="w-full text-lg font-semibold bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500 text-gray-900"
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
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors truncate"
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
                className="w-full text-sm text-gray-600 bg-transparent border border-purple-300 rounded p-2 focus:outline-none focus:border-purple-500 resize-none"
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
                className="text-sm text-gray-600 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Video Upload/Display Area */}
          {data.videoUrl ? (
            <div className="mb-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden">
                {data.fileName?.toLowerCase().includes('video') || data.videoUrl.startsWith('data:video') ? (
                  <video 
                    src={data.videoUrl} 
                    className="w-full h-32 object-cover"
                    controls
                  />
                ) : (
                  <div className="w-full h-32 bg-purple-100 flex items-center justify-center">
                    <Play className="w-8 h-8 text-purple-600" />
                    <span className="ml-2 text-purple-700">Audio File</span>
                  </div>
                )}
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">{data.fileName}</span>
                    {data.videoUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-auto hover:bg-purple-200"
                        onClick={() => window.open(data.videoUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {data.fileSize && (
                    <div className="text-xs text-purple-600 mt-1">
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
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video/Audio
              </Button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*,audio/*"
                onChange={handleVideoImport}
                className="hidden"
              />
            </div>
          )}

          {/* Transcription Area */}
          {data.videoUrl && (
            <div className="mb-3">
              <label className="text-xs font-medium text-purple-700 block mb-1">Transcription:</label>
              <textarea
                placeholder="Enter or paste transcription here..."
                value={data.transcription || ''}
                onChange={(e) => handleTranscriptionUpdate(e.target.value)}
                className="w-full h-16 text-xs border border-purple-200 rounded p-2 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          )}

          {/* AI Response */}
          {data.aiResponse && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-purple-800 mb-1">AI Analysis</div>
              <div className="text-purple-700 whitespace-pre-wrap">{data.aiResponse}</div>
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

export default VideoNode;