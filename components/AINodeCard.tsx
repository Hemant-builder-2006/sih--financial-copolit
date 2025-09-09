import React, { useState } from 'react';
import { Bot, Loader, CheckCircle } from 'lucide-react';

export type AIStatus = 'idle' | 'processing' | 'done';

export interface AINodeCardProps {
  id: string;
  title: string;
  onAction: (action: string) => void;
  output: string;
  status: AIStatus;
}

const statusMap = {
  idle: { color: 'bg-gray-300', label: 'Idle', icon: null },
  processing: { color: 'bg-yellow-400 animate-pulse', label: 'Processing', icon: <Loader className="w-4 h-4 animate-spin" /> },
  done: { color: 'bg-green-500', label: 'Done', icon: <CheckCircle className="w-4 h-4" /> },
};

const actions = [
  { label: 'Summarize', key: 'summarize' },
  { label: 'Key Insights', key: 'insights' },
  { label: 'Generate Ideas', key: 'ideas' },
];

const AINodeCard: React.FC<AINodeCardProps> = ({ id, title, onAction, output, status }) => {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gradient-to-r from-purple-100 to-blue-50 rounded-t-2xl">
        <div className="p-2 bg-purple-500 text-white rounded-full"><Bot className="w-5 h-5" /></div>
        <div className="font-bold text-gray-800 flex-1 truncate">{title}</div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[status].color} text-white`}>
          {statusMap[status].icon}
          {statusMap[status].label}
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-2 px-4 py-2 border-b border-gray-100">
        {actions.map((action) => (
          <button
            key={action.key}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold hover:scale-105 transition-transform"
            onClick={() => onAction(action.key)}
          >
            {action.label}
          </button>
        ))}
      </div>
      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700 min-h-[60px] max-h-40">
        {output || <span className="text-gray-400">No output yet.</span>}
      </div>
    </div>
  );
};

export default AINodeCard;
