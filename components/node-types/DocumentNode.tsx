import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, MoreHorizontal, Trash2, Upload, ExternalLink } from 'lucide-react';
import { DocumentNodeData, BaseNodeProps, sizeConfig } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';
import { parseCSVFile, parsePDFFile, recalculateKPIs } from '../../lib/api-utils';

const DocumentNode: React.FC<BaseNodeProps<DocumentNodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      addAlert('Please upload PDF, CSV, or Excel files.', 'warning');
      return;
    }

    try {
      updateNode({ aiStatus: 'processing' });

      let result;
      if (file.type === 'application/pdf') {
        result = await parsePDFFile(file, id);
        
        updateNode({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extractedText: result.data.text,
          lastModified: new Date().toISOString(),
          aiStatus: 'done'
        });
      } else if (file.type.includes('csv') || file.type.includes('excel') || file.type.includes('sheet')) {
        result = await parseCSVFile(file, id);
        
        const csvSummary = `CSV with ${result.data.summary.totalRows} rows and ${result.data.summary.totalColumns} columns`;
        updateNode({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extractedText: csvSummary,
          lastModified: new Date().toISOString(),
          aiStatus: 'done'
        });
      }

      addAlert(`Document "${file.name}" processed successfully`, 'info');
      
      // Recalculate KPIs in background
      recalculateKPIs().catch(console.error);
      
    } catch (error) {
      console.error('Document upload error:', error);
      updateNode({ aiStatus: 'idle' });
      addAlert(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`, 'danger');
    }

    event.target.value = '';
  };

  return (
    <>
      <NodeResizer
        color="rgb(239, 68, 68)"
        isVisible={selected}
        minWidth={200}
        minHeight={160}
        onResizeEnd={(event, data) => {
          updateNode({ width: data.width, height: data.height });
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
            <div className="p-2 rounded-xl bg-red-50 flex-shrink-0">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            
            {/* Title and Controls */}
            <div className="flex-1 min-w-0">
              {data.isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={data.title}
                  className="w-full text-lg font-semibold bg-transparent border-b border-red-300 focus:outline-none focus:border-red-500 text-gray-900"
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
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-red-600 transition-colors truncate"
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
                className="w-full text-sm text-gray-600 bg-transparent border border-red-300 rounded p-2 focus:outline-none focus:border-red-500 resize-none"
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
                className="text-sm text-gray-600 cursor-pointer hover:text-red-600 transition-colors"
                onClick={handleDescEdit}
                title="Click to edit description"
              >
                {data.description}
              </p>
            )}
          </div>

          {/* Document Upload */}
          {!data.fileName && (
            <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center hover:border-red-400 transition-colors">
              <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">Upload a document</p>
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Button
                onClick={() => documentInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}

          {/* Document Info */}
          {data.fileName && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">{data.fileName}</span>
                </div>
                <Button
                  onClick={() => documentInputRef.current?.click()}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                >
                  <Upload className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-red-600 space-y-1">
                <div>Size: {data.fileSize ? (data.fileSize / 1024).toFixed(1) : 0}KB</div>
                <div>Type: {data.fileType || 'Unknown'}</div>
                {data.lastModified && (
                  <div>Modified: {new Date(data.lastModified).toLocaleDateString()}</div>
                )}
              </div>
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>
          )}

          {/* AI Response */}
          {data.aiResponse && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <div className="font-medium text-red-800 mb-1">AI Analysis</div>
              <div className="text-red-700 whitespace-pre-wrap">{data.aiResponse}</div>
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

export default DocumentNode;