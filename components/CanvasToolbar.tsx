import React from 'react';
import { Button } from './ui/button';
import { Plus, FileText, File, Image, Video, Bot } from 'lucide-react';
import { Dropdown, DropdownItem } from './ui/dropdown';

interface CanvasToolbarProps {
  onAddNode: (type: "text" | "pdf" | "image" | "video" | "ai") => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onAddNode }) => {


  return (
    <div className="absolute top-4 left-4 z-30 bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
      <Dropdown
        label={
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Add Node</span>
          </span>
        }
      >
        <DropdownItem onClick={() => onAddNode('text')}>
          <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" />Text Note</span>
        </DropdownItem>
        <DropdownItem onClick={() => onAddNode('pdf')}>
          <span className="flex items-center gap-2"><File className="w-4 h-4 text-red-600" />PDF Doc</span>
        </DropdownItem>
        <DropdownItem onClick={() => onAddNode('image')}>
          <span className="flex items-center gap-2"><Image className="w-4 h-4 text-green-600" />Image</span>
        </DropdownItem>
        <DropdownItem onClick={() => onAddNode('video')}>
          <span className="flex items-center gap-2"><Video className="w-4 h-4 text-purple-600" />Video</span>
        </DropdownItem>
        <DropdownItem onClick={() => onAddNode('ai')}>
          <span className="flex items-center gap-2"><Bot className="w-4 h-4 text-fuchsia-600" />AI Node</span>
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default CanvasToolbar;
