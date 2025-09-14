import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, MoreHorizontal, Trash2, ExternalLink, Globe } from 'lucide-react';
import { CompanyNodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';

const CompanyNode: React.FC<BaseNodeProps<CompanyNodeData>> = ({ id, data, selected }) => {
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

  const handleFieldUpdate = (field: keyof CompanyNodeData, value: string) => {
    updateNode({ [field]: value });
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
            <div className="p-2 rounded-xl bg-orange-50 flex-shrink-0">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
            
            {/* Title and Controls */}
            <div className="flex-1 min-w-0">
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="w-full text-lg font-semibold bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-500 text-gray-900"
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
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors truncate"
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
                className="w-full text-sm text-gray-600 bg-transparent border border-orange-300 rounded p-2 focus:outline-none focus:border-orange-500 resize-none"
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
                className="text-sm text-gray-600 cursor-pointer hover:text-orange-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Company Details */}
          <div className="space-y-3 mb-3">
            {/* Company Name */}
            <div>
              <label className="text-xs font-medium text-orange-700 block mb-1">Company Name:</label>
              <input
                type="text"
                placeholder="Enter company name..."
                value={data.companyName || ''}
                onChange={(e) => handleFieldUpdate('companyName', e.target.value)}
                className="w-full text-sm border border-orange-200 rounded p-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="text-xs font-medium text-orange-700 block mb-1">Industry:</label>
              <input
                type="text"
                placeholder="e.g., Technology, Healthcare, Finance..."
                value={data.industry || ''}
                onChange={(e) => handleFieldUpdate('industry', e.target.value)}
                className="w-full text-sm border border-orange-200 rounded p-2 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="text-xs font-medium text-orange-700 block mb-1">Website:</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={data.website || ''}
                  onChange={(e) => handleFieldUpdate('website', e.target.value)}
                  className="flex-1 text-sm border border-orange-200 rounded p-2 focus:outline-none focus:border-orange-500"
                />
                {data.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-orange-100"
                    onClick={() => window.open(data.website, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="text-xs font-medium text-orange-700 block mb-1">Business Description:</label>
              <textarea
                placeholder="Describe the company's business, products, services..."
                value={data.businessDescription || ''}
                onChange={(e) => handleFieldUpdate('businessDescription', e.target.value)}
                className="w-full h-16 text-sm border border-orange-200 rounded p-2 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* AI Response */}
          {data.aiResponse && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-orange-800 mb-1">AI Analysis</div>
              <div className="text-orange-700 whitespace-pre-wrap">{data.aiResponse}</div>
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

export default CompanyNode;