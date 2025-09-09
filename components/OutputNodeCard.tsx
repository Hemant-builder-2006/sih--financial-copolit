import React from 'react';
import { Youtube, Linkedin, Twitter, FileText, BookOpen, Lightbulb, FileSearch } from 'lucide-react';

const nodeTypes = {
  youtube: {
    label: 'YouTube',
    icon: Youtube,
    color: 'from-red-500 to-yellow-400',
    bg: 'bg-gradient-to-r from-red-50 to-yellow-50',
  },
  linkedin: {
    label: 'LinkedIn Post',
    icon: Linkedin,
    color: 'from-blue-700 to-blue-400',
    bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
  },
  twitter: {
    label: 'Twitter Post',
    icon: Twitter,
    color: 'from-blue-400 to-cyan-400',
    bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
  },
  blog: {
    label: 'Blog Article',
    icon: FileText,
    color: 'from-pink-500 to-purple-400',
    bg: 'bg-gradient-to-r from-pink-50 to-purple-50',
  },
  research: {
    label: 'Research Summary',
    icon: FileSearch,
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
  },
  brainstorm: {
    label: 'Brainstorm',
    icon: Lightbulb,
    color: 'from-yellow-400 to-orange-400',
    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
  },
  book: {
    label: 'Book/Longform',
    icon: BookOpen,
    color: 'from-indigo-500 to-purple-700',
    bg: 'bg-gradient-to-r from-indigo-50 to-purple-50',
  },
};

export type OutputNodeType = keyof typeof nodeTypes;

export interface OutputNodeCardProps {
  type: OutputNodeType;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const OutputNodeCard: React.FC<OutputNodeCardProps> = ({ type, title, isSelected, onClick }) => {
  const config = nodeTypes[type];
  const Icon = config.icon;
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-md border-2 border-transparent cursor-pointer transition-all duration-200 ${config.bg} ${isSelected ? 'ring-2 ring-offset-2 ring-purple-400 border-purple-400' : ''}`}
      onClick={onClick}
      style={{ minWidth: 220 }}
    >
      <div className={`p-2 rounded-full bg-gradient-to-r ${config.color} text-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-800 text-base truncate">{title || config.label}</span>
    </div>
  );
};

export default OutputNodeCard;
