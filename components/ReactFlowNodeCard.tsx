import React, { useState, useRef } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { FileText, File, Image, Video, Bot, MoreHorizontal, ExternalLink, Trash2, Maximize2, Minimize2, Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface NodeData {
  title: string;
  type: 'ai' | 'text' | 'pdf' | 'image' | 'video';
  description: string;
  isEditingTitle?: boolean;
  isEditingDesc?: boolean;
  aiStatus?: 'idle' | 'processing' | 'done';
  aiResponse?: string;
  size?: 'small' | 'medium' | 'large' | 'custom';
  width?: number;
  height?: number;
}

const ReactFlowNodeCard: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showSizeControls, setShowSizeControls] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Store actions
  const { setAiSummary, addAlert } = useAppStore();
  
  // File input refs for each node type
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeConfig = {
    small: { width: 240, height: 200 },
    medium: { width: 320, height: 250 },
    large: { width: 400, height: 320 }
  };

  const currentSize = data.size || 'medium';
  const currentWidth = data.width || (currentSize !== 'custom' ? sizeConfig[currentSize as keyof typeof sizeConfig].width : 320);
  const currentHeight = data.height || (currentSize !== 'custom' ? sizeConfig[currentSize as keyof typeof sizeConfig].height : 250);

  React.useEffect(() => {
    if (data.isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [data.isEditingTitle]);

  React.useEffect(() => {
    if (data.isEditingDesc && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [data.isEditingDesc]);

  const updateNode = (updates: Partial<NodeData>) => {
    const updateEvent = new CustomEvent('updateNode', {
      detail: { id, data: { ...data, ...updates } }
    });
    window.dispatchEvent(updateEvent);
  };

  const deleteNode = () => {
    const deleteEvent = new CustomEvent('deleteNode', {
      detail: { id }
    });
    window.dispatchEvent(deleteEvent);
  };

  const handleTypeChange = (newType: NodeData['type']) => {
    updateNode({ type: newType });
    setShowTypeSelector(false);
  };

  const handleTitleSave = () => {
    updateNode({ isEditingTitle: false });
  };

  const handleDescSave = () => {
    updateNode({ isEditingDesc: false });
  };

  const handleAIAction = (action: string) => {
    updateNode({ aiStatus: 'processing' });
    
    // Add alert that AI processing started
    addAlert(`AI ${action} started for ${data.title}`, 'info');
    
    setTimeout(() => {
      const aiResponse = `AI ${action} completed for: ${data.title}`;
      updateNode({ 
        aiStatus: 'done',
        aiResponse: aiResponse
      });
      
      // Update global AI summary in store
      setAiSummary(`Latest AI Analysis: ${aiResponse}. Generated from ${data.type} node "${data.title}".`);
      
      // Add success alert
      addAlert(`AI ${action} completed successfully`, 'info');
      
    }, 2000);
  };

  const handleSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    const config = sizeConfig[newSize];
    updateNode({ 
      size: newSize, 
      width: config.width, 
      height: config.height 
    });
    setShowSizeControls(false);
    
    // Dispatch resize event for ReactFlow
    const resizeEvent = new CustomEvent('resizeNode', {
      detail: { id, width: config.width, height: config.height }
    });
    window.dispatchEvent(resizeEvent);
  };

  const handleCustomResize = (width: number, height: number) => {
    updateNode({ width, height, size: 'custom' });
    
    // Dispatch resize event for ReactFlow
    const resizeEvent = new CustomEvent('resizeNode', {
      detail: { id, width, height }
    });
    window.dispatchEvent(resizeEvent);
  };

  // File import handlers for each node type
  const handleImageImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateNode({ 
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: imageUrl,
        type: 'image'
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePDFImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateNode({ 
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `PDF Document: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\nUploaded: ${new Date().toLocaleDateString()}`,
        type: 'pdf'
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleVideoImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      alert('Please select a valid video or audio file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const isVideo = file.type.startsWith('video/');
      updateNode({ 
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `${isVideo ? 'Video' : 'Audio'} File: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\nUploaded: ${new Date().toLocaleDateString()}`,
        type: 'video'
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDocumentImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/rtf'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|doc|docx|rtf)$/i)) {
      alert('Please select a valid document file (TXT, DOC, DOCX, RTF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      updateNode({ 
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: file.type === 'text/plain' ? content.substring(0, 500) + (content.length > 500 ? '...' : '') : `Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nUploaded: ${new Date().toLocaleDateString()}`,
        type: 'text'
      });
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // Node type configuration
  const nodeTypeConfig = {
    text: {
      icon: FileText,
      label: "Text Note",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    pdf: {
      icon: File,
      label: "PDF Document",
      iconColor: "text-red-600",
      bgColor: "bg-red-50"
    },
    image: {
      icon: Image,
      label: "Image Node",
      iconColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    video: {
      icon: Video,
      label: "Video/Audio Transcript",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    ai: {
      icon: Bot,
      label: "AI Node",
      iconColor: "text-fuchsia-600",
      bgColor: "bg-fuchsia-50"
    }
  };

  const config = nodeTypeConfig[data.type];
  const IconComponent = config.icon;

  const typeOptions = [
    { type: 'ai', icon: Bot, label: 'AI Node', color: 'text-fuchsia-600' },
    { type: 'text', icon: FileText, label: 'Text Note', color: 'text-blue-600' },
    { type: 'pdf', icon: File, label: 'PDF Document', color: 'text-red-600' },
    { type: 'image', icon: Image, label: 'Image Node', color: 'text-green-600' },
    { type: 'video', icon: Video, label: 'Video Node', color: 'text-purple-600' },
  ];

  return (
    <div className="relative">
      {/* Node Resizer - allows manual resizing */}
      {selected && (
        <NodeResizer
          minWidth={200}
          minHeight={150}
          maxWidth={600}
          maxHeight={500}
          onResize={(event, { width, height }) => {
            handleCustomResize(width, height);
          }}
          handleStyle={{
            backgroundColor: '#8b5cf6',
            border: '2px solid white',
            borderRadius: '50%',
            width: '8px',
            height: '8px',
          }}
          lineStyle={{
            borderColor: '#8b5cf6',
            borderWidth: '2px',
          }}
        />
      )}

      {/* Delete Button - Always visible when selected or on hover */}
      <button
        onClick={deleteNode}
        className={`absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        title="Delete node"
      >
        <Trash2 size={12} />
      </button>

      {/* Connection Handles - Same colors for inputs and outputs */}
      {/* Left side - 1 input, 1 output */}
      <Handle
        id="left-input"
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !shadow-lg hover:!scale-125 !transition-all !duration-200"
        style={{ left: -6, top: '35%' }}
        isConnectable={true}
      />
      <Handle
        id="left-output"
        type="source"
        position={Position.Left}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !shadow-lg hover:!scale-125 !transition-all !duration-200"
        style={{ left: -6, top: '65%' }}
        isConnectable={true}
      />
      
      {/* Right side - 1 input, 1 output */}
      <Handle
        id="right-input"
        type="target"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !shadow-lg hover:!scale-125 !transition-all !duration-200"
        style={{ right: -6, top: '35%' }}
        isConnectable={true}
      />
      <Handle
        id="right-output"
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !shadow-lg hover:!scale-125 !transition-all !duration-200"
        style={{ right: -6, top: '65%' }}
        isConnectable={true}
      />

      {/* Type Selector Dropdown */}
      {showTypeSelector && (
        <div className="absolute -top-12 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-48">
          <div className="text-xs font-medium text-gray-500 mb-2">Change node type:</div>
          <div className="grid grid-cols-1 gap-1">
            {typeOptions.map((option) => (
              <button
                key={option.type}
                className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-50 rounded text-sm transition-colors"
                onClick={() => handleTypeChange(option.type as NodeData['type'])}
              >
                <option.icon className={`w-4 h-4 ${option.color}`} />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Control Dropdown */}
      {showSizeControls && (
        <div className="absolute -top-16 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-48">
          <div className="text-xs font-medium text-gray-500 mb-2">Node size:</div>
          <div className="grid grid-cols-1 gap-1">
            {[
              { size: 'small', label: 'Small (240×200)', icon: Minimize2 },
              { size: 'medium', label: 'Medium (320×250)', icon: MoreHorizontal },
              { size: 'large', label: 'Large (400×320)', icon: Maximize2 },
            ].map((option) => (
              <button
                key={option.size}
                className={`flex items-center gap-2 w-full p-2 text-left hover:bg-gray-50 rounded text-sm transition-colors ${
                  currentSize === option.size ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleSizeChange(option.size as 'small' | 'medium' | 'large')}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="text-xs text-gray-500 mb-1">Current: {currentWidth}×{currentHeight}</div>
          </div>
        </div>
      )}

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
            <div className={`p-2 rounded-xl ${config.bgColor} flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Node type label */}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {config.label}
              </p>
              
              {/* Title - editable */}
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={data.title}
                  onChange={(e) => updateNode({ title: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                  }}
                  onBlur={handleTitleSave}
                  className="font-bold text-gray-900 text-base leading-tight bg-transparent border-none outline-none w-full"
                />
              ) : (
                <h3 
                  className="font-bold text-gray-900 text-base leading-tight overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                  onDoubleClick={() => updateNode({ isEditingTitle: true })}
                >
                  {data.title}
                </h3>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {/* Special content for images */}
          {data.type === 'image' && data.description.startsWith('data:image') ? (
            <div className="mb-2">
              <img 
                src={data.description} 
                alt={data.title}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                style={{ maxHeight: '128px' }}
              />
            </div>
          ) : null}
          
          {/* Special content for PDFs */}
          {data.type === 'pdf' ? (
            <div className="mb-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">PDF Document</span>
              </div>
            </div>
          ) : null}
          
          {/* Special content for videos */}
          {data.type === 'video' ? (
            <div className="mb-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Video/Audio File</span>
              </div>
            </div>
          ) : null}
          
          {/* Special content for documents */}
          {data.type === 'text' && data.description.includes('Document:') ? (
            <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Text Document</span>
              </div>
            </div>
          ) : null}
          
          {/* Description - editable */}
          {data.isEditingDesc ? (
            <textarea
              ref={descInputRef}
              value={data.type === 'image' && data.description.startsWith('data:image') ? 'Image content' : data.description}
              onChange={(e) => updateNode({ description: data.type === 'image' && data.description.startsWith('data:image') ? data.description : e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleDescSave();
                }
              }}
              onBlur={handleDescSave}
              className="text-sm text-gray-600 leading-relaxed bg-transparent border-none outline-none w-full resize-none"
              rows={3}
              readOnly={data.type === 'image' && data.description.startsWith('data:image')}
            />
          ) : (
            <p 
              className="text-sm text-gray-600 leading-relaxed overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
              onClick={() => updateNode({ isEditingDesc: true })}
            >
              {data.type === 'image' && data.description.startsWith('data:image') ? 'Image content (click to view full size)' : data.description}
            </p>
          )}

          {/* AI Response */}
          {data.aiResponse && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-medium text-purple-600 mb-1">AI Response:</p>
              <p className="text-sm text-purple-800">{data.aiResponse}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-2">
          <div className="flex items-center gap-2 w-full">
            {/* Open/Process button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => updateNode({ isEditingDesc: true })}
              className="flex-1 h-9 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
              disabled={data.aiStatus === 'processing'}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {data.aiStatus === 'processing' ? 'Processing...' : 'Open'}
            </Button>
            
            {/* More options button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
              title="Change type"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </Button>

            {/* Size control button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSizeControls(!showSizeControls)}
              className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
              title="Resize node"
            >
              <Maximize2 className="w-4 h-4 text-gray-500" />
            </Button>

            {/* Import button - specific to node type */}
            {data.type === 'image' && (
              <label className="cursor-pointer">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-green-200 hover:bg-green-50 text-green-600"
                  title="Import image"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                </Button>
              </label>
            )}

            {data.type === 'pdf' && (
              <label className="cursor-pointer">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-red-200 hover:bg-red-50 text-red-600"
                  title="Import PDF"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                </Button>
              </label>
            )}

            {data.type === 'video' && (
              <label className="cursor-pointer">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*,audio/*"
                  onChange={handleVideoImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-purple-200 hover:bg-purple-50 text-purple-600"
                  title="Import video/audio"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                </Button>
              </label>
            )}

            {data.type === 'text' && (
              <label className="cursor-pointer">
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".txt,.doc,.docx,.rtf"
                  onChange={handleDocumentImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-blue-200 hover:bg-blue-50 text-blue-600"
                  title="Import document"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                </Button>
              </label>
            )}
          </div>

          {/* AI Actions for AI nodes */}
          {data.type === 'ai' && (
            <div className="flex gap-1 mt-2 w-full">
              {['Analyze', 'Summarize', 'Expand'].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIAction(action)}
                  className="flex-1 h-7 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={data.aiStatus === 'processing'}
                >
                  {action}
                </Button>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReactFlowNodeCard;
