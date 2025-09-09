// components/NodeTemplates.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AINode } from '../types/canvas';

interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodeData: Omit<AINode, 'id' | 'createdAt' | 'updatedAt'>;
  category: 'basic' | 'ai' | 'media' | 'workflow';
}

const templates: NodeTemplate[] = [
  // Basic Templates
  {
    id: 'text-note',
    name: 'Text Note',
    description: 'Simple text note for ideas',
    icon: '📝',
    category: 'basic',
    nodeData: {
      type: 'text',
      content: 'Your idea here...',
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    },
  },
  {
    id: 'task-card',
    name: 'Task Card',
    description: 'Structured task with status',
    icon: '✅',
    category: 'basic',
    nodeData: {
      type: 'text',
      content: '## Task\n\n- [ ] Step 1\n- [ ] Step 2\n- [ ] Step 3\n\n**Status:** Not Started\n**Priority:** Medium',
      x: 0,
      y: 0,
      width: 250,
      height: 180,
    },
  },
  {
    id: 'decision-node',
    name: 'Decision Point',
    description: 'Decision making template',
    icon: '🤔',
    category: 'workflow',
    nodeData: {
      type: 'text',
      content: '## Decision\n\n**Question:** What should we do?\n\n**Options:**\n1. Option A\n2. Option B\n\n**Criteria:**\n- Impact\n- Effort\n- Risk',
      x: 0,
      y: 0,
      width: 280,
      height: 200,
    },
  },
  // AI Templates
  {
    id: 'ai-brainstorm',
    name: 'AI Brainstorm',
    description: 'AI-powered idea generation',
    icon: '🧠',
    category: 'ai',
    nodeData: {
      type: 'text',
      content: '## AI Brainstorm Session\n\n**Topic:** [Enter your topic]\n\n*Ready for AI expansion and ideation*',
      x: 0,
      y: 0,
      width: 300,
      height: 150,
      metadata: {
        tags: ['brainstorm', 'ai-ready'],
      },
    },
  },
  {
    id: 'meeting-summary',
    name: 'Meeting Summary',
    description: 'AI-enhanced meeting notes',
    icon: '📊',
    category: 'ai',
    nodeData: {
      type: 'text',
      content: '## Meeting Summary\n\n**Date:** Today\n**Attendees:** \n\n**Key Points:**\n- \n\n**Action Items:**\n- \n\n*AI will enhance this summary*',
      x: 0,
      y: 0,
      width: 320,
      height: 220,
      metadata: {
        tags: ['meeting', 'summary', 'ai-enhance'],
      },
    },
  },
  // Media Templates
  {
    id: 'image-placeholder',
    name: 'Image Node',
    description: 'Placeholder for images',
    icon: '🖼️',
    category: 'media',
    nodeData: {
      type: 'image',
      content: 'Drop your image here or paste URL',
      x: 0,
      y: 0,
      width: 250,
      height: 200,
    },
  },
  {
    id: 'video-placeholder',
    name: 'Video Node',
    description: 'Video content with AI transcription',
    icon: '🎥',
    category: 'media',
    nodeData: {
      type: 'video',
      content: 'Upload video for AI transcription',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      metadata: {
        tags: ['video', 'transcribe-ready'],
      },
    },
  },
];

interface NodeTemplatesProps {
  onCreateNode: (template: NodeTemplate) => void;
  className?: string;
}

export const NodeTemplates: React.FC<NodeTemplatesProps> = ({
  onCreateNode,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'basic', name: 'Basic', icon: '📝' },
    { id: 'ai', name: 'AI', icon: '🤖' },
    { id: 'media', name: 'Media', icon: '🎨' },
    { id: 'workflow', name: 'Workflow', icon: '⚡' },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className={`relative ${className}`}>
      {/* Templates Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-lg shadow-lg border transition-all ${
          isOpen 
            ? 'bg-blue-500 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-semibold">Templates</span>
        </div>
      </motion.button>

      {/* Templates Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[400px] max-w-[500px] z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Node Templates</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {filteredTemplates.map(template => (
                <motion.button
                  key={template.id}
                  onClick={() => {
                    onCreateNode(template);
                    setIsOpen(false);
                  }}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{template.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-800 truncate">{template.name}</h4>
                      <p className="text-sm text-gray-600 leading-tight">{template.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-3xl mb-2 block">🎭</span>
                No templates in this category
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
