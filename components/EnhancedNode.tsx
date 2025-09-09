import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AINode } from '../types/canvas';
import { useAICanvasStore } from '../store/aiCanvasStore';

interface EnhancedNodeProps {
  node: AINode;
  isSelected: boolean;
  onSelect: (nodeId: string, multiSelect?: boolean) => void;
  onUpdate: (nodeId: string, updates: Partial<AINode>) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onConnectionStart: (nodeId: string, handle: string) => void;
  onConnectionEnd: (nodeId: string) => void;
  isConnecting: boolean;
  zoom: number;
}

export const EnhancedNode: React.FC<EnhancedNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onContextMenu,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
  zoom,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  
    const { 
    updateNode, 
    deleteNode, 
    summarizeNode, 
    expandNode, 
    tagNode, 
    isLoading 
  } = useAICanvasStore();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = (e.clientX - dragStartPos.current.x) / zoom;
      const deltaY = (e.clientY - dragStartPos.current.y) / zoom;
      
      onUpdate(node.id, {
        x: node.x + deltaX,
        y: node.y + deltaY,
      });
      
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDragging, node, onUpdate, zoom]);

  const getNodeIcon = () => {
    switch (node.type) {
      case 'text': return '📝';
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      case 'code': return '💻';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  const getNodeColors = () => {
    switch (node.type) {
      case 'video': return { 
        bg: 'bg-gradient-to-br from-red-50 to-pink-50', 
        border: 'border-red-200', 
        accent: 'bg-gradient-to-r from-red-500 to-pink-500',
        text: 'text-red-700'
      };
      case 'pdf': return { 
        bg: 'bg-gradient-to-br from-orange-50 to-yellow-50', 
        border: 'border-orange-200', 
        accent: 'bg-gradient-to-r from-orange-500 to-yellow-500',
        text: 'text-orange-700'
      };
      case 'image': return { 
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-50', 
        border: 'border-purple-200', 
        accent: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        text: 'text-purple-700'
      };
      case 'audio': return { 
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50', 
        border: 'border-green-200', 
        accent: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-green-700'
      };
      case 'code': return { 
        bg: 'bg-gradient-to-br from-gray-50 to-slate-50', 
        border: 'border-gray-200', 
        accent: 'bg-gradient-to-r from-gray-500 to-slate-500',
        text: 'text-gray-700'
      };
      case 'link': return { 
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', 
        border: 'border-blue-200', 
        accent: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        text: 'text-blue-700'
      };
      default: return { 
        bg: 'bg-gradient-to-br from-gray-50 to-white', 
        border: 'border-gray-200', 
        accent: 'bg-gradient-to-r from-gray-400 to-gray-500',
        text: 'text-gray-700'
      };
    }
  };

  const colors = getNodeColors();

  const handleAIAction = async (action: 'summarize' | 'expand' | 'tag') => {
    try {
      switch (action) {
        case 'summarize':
          await summarizeNode(node.id);
          break;
        case 'expand':
          await expandNode(node.id);
          break;
        case 'tag':
          await tagNode(node.id, ['tag']);
          break;
      }
    } catch (error) {
      console.error(`AI ${action} failed:`, error);
    }
    setShowAIOptions(false);
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case 'video':
        return (
          <div className="space-y-3">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-0 h-0 border-l-6 border-r-0 border-t-4 border-b-4 border-l-white border-t-transparent border-b-transparent ml-1" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {node.metadata?.duration || '0:00'}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{node.content}</p>
          </div>
        );
        
      case 'pdf':
        return (
          <div className="space-y-3">
            <div className="h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg border-2 border-dashed border-orange-300 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl">📄</span>
                <p className="text-xs text-orange-600 mt-1">PDF Document</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{node.content}</p>
            {node.metadata?.pageCount && (
              <p className="text-xs text-gray-500">{node.metadata.pageCount} pages</p>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-3">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl">🖼️</span>
                <p className="text-xs text-purple-600 mt-1">Image</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{node.content}</p>
          </div>
        );
        
      case 'audio':
        return (
          <div className="space-y-3">
            <div className="h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center relative">
              <div className="flex items-center gap-1">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 30 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <span className="absolute text-2xl">🎵</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{node.content}</p>
          </div>
        );
        
      case 'code':
        return (
          <div className="space-y-2">
            <div className="bg-gray-900 rounded-lg p-3 text-xs text-green-400 font-mono overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <pre className="line-clamp-4">{node.content || '// Your code here...'}</pre>
            </div>
          </div>
        );
        
      case 'link':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔗</span>
                <span className="text-sm font-medium text-blue-700">Link</span>
              </div>
              <p className="text-xs text-blue-600 truncate">{node.metadata?.url || 'No URL'}</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{node.content}</p>
          </div>
        );
        
      default:
        return (
          <div className="h-full">
            <textarea
              className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
              value={node.content}
              onChange={(e) => onUpdate(node.id, { content: e.target.value })}
              placeholder="Enter your content here..."
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      className={`absolute cursor-move select-none ${colors.bg} ${colors.border} border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-200' : ''
      } ${isConnecting ? 'hover:ring-2 hover:ring-green-500 hover:shadow-green-200' : ''} ${
        isDragging ? 'shadow-2xl scale-105' : ''
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        zIndex: isSelected ? 20 : isDragging ? 30 : 10,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id, e.ctrlKey || e.metaKey);
      }}
      onContextMenu={(e) => onContextMenu(e, node.id)}
      onMouseUp={() => isConnecting && onConnectionEnd(node.id)}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ y: -2 }}
      layout
    >
      {/* Node Header */}
      <div className={`${colors.accent} text-white p-3 rounded-t-xl flex items-center gap-3 relative`}>
        <span className="text-lg">{getNodeIcon()}</span>
        {isEditing ? (
          <input
            className="flex-1 bg-white text-black px-3 py-1 rounded-md text-sm font-medium"
            value={node.title}
            onChange={(e) => onUpdate(node.id, { title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
          />
        ) : (
          <h3
            className="flex-1 font-semibold text-sm truncate cursor-text"
            onDoubleClick={() => setIsEditing(true)}
            title={node.title}
          >
            {node.title || 'Untitled'}
          </h3>
        )}
        
        {/* AI Badge */}
        {node.metadata?.aiGenerated && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">AI</span>
          </div>
        )}

        {/* AI Actions Button */}
        <button
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowAIOptions(!showAIOptions);
          }}
          title="AI Actions"
        >
          <span className="text-sm">🤖</span>
        </button>

        {/* AI Options Dropdown */}
        <AnimatePresence>
          {showAIOptions && (
            <motion.div
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[140px]"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
            >
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                onClick={() => handleAIAction('summarize')}
                disabled={isLoading}
              >
                <span>📝</span>
                Summarize
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                onClick={() => handleAIAction('expand')}
                disabled={isLoading}
              >
                <span>🔍</span>
                Expand
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                onClick={() => handleAIAction('tag')}
                disabled={isLoading}
              >
                <span>🏷️</span>
                Auto Tag
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Node Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {renderNodeContent()}
      </div>

      {/* Node Footer with Tags and Metadata */}
      <div className="px-4 pb-3">
        {/* Tags */}
        {node.metadata?.tags && node.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {node.metadata.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 ${colors.text} bg-opacity-20 text-xs rounded-full border`}
                style={{ backgroundColor: `${colors.accent.replace('bg-gradient-to-r', '').split(' ')[1]}20` }}
              >
                #{tag}
              </span>
            ))}
            {node.metadata.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{node.metadata.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Summary */}
        {node.metadata?.summary && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-300">
            <strong>AI Summary:</strong> {node.metadata.summary}
          </div>
        )}

        {/* Timestamps */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {node.metadata?.createdAt && (
            <span>Created {new Date(node.metadata.createdAt).toLocaleDateString()}</span>
          )}
          {node.metadata?.updatedAt && (
            <span>Updated {new Date(node.metadata.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <div className="absolute inset-0 pointer-events-none">
        {['top', 'right', 'bottom', 'left'].map((position) => (
          <button
            key={position}
            className={`absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full pointer-events-auto hover:scale-125 transition-all duration-200 opacity-0 group-hover:opacity-100 ${
              isConnecting ? 'animate-pulse bg-green-500 opacity-100' : ''
            } ${isSelected ? 'opacity-100' : ''}`}
            style={{
              ...(position === 'top' && { top: -8, left: '50%', transform: 'translateX(-50%)' }),
              ...(position === 'right' && { right: -8, top: '50%', transform: 'translateY(-50%)' }),
              ...(position === 'bottom' && { bottom: -8, left: '50%', transform: 'translateX(-50%)' }),
              ...(position === 'left' && { left: -8, top: '50%', transform: 'translateY(-50%)' }),
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onConnectionStart(node.id, position);
            }}
            title={`Connect from ${position}`}
          />
        ))}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 hover:opacity-100 group-hover:opacity-70 transition-opacity"
        onMouseDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = node.width;
          const startHeight = node.height;

          const handleResize = (e: MouseEvent) => {
            const deltaX = (e.clientX - startX) / zoom;
            const deltaY = (e.clientY - startY) / zoom;
            
            onUpdate(node.id, {
              width: Math.max(200, startWidth + deltaX),
              height: Math.max(150, startHeight + deltaY),
            });
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleResize);
          document.addEventListener('mouseup', handleMouseUp);
        }}
        title="Resize node"
      >
        <svg
          className="w-full h-full text-gray-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 14H20V12H22V14Z" />
        </svg>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">AI Processing...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
