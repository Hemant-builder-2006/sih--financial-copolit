import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { FileText, File, Image, Video, MoreHorizontal, ExternalLink, Bot } from 'lucide-react';

interface NodeCardProps {
  title: string;
  type: "text" | "pdf" | "image" | "video" | "ai";
  description: string;
  onOpen?: () => void;
  onMore?: () => void;
  className?: string;
}

const NodeCard: React.FC<NodeCardProps> = ({ 
  title, 
  type, 
  description, 
  onOpen, 
  onMore,
  className = ""
}) => {
  // Icon and type label mapping
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

  const config = nodeTypeConfig[type];
  const IconComponent = config.icon;

  return (
    <Card className={`w-72 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 group hover:-translate-y-0.5 ${className}`}>
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
            
            {/* Title */}
            <h3 className="font-bold text-gray-900 text-base leading-tight overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-2">
        <div className="flex items-center gap-2 w-full">
          {/* Open button */}
          <Button
            variant="default"
            size="sm"
            onClick={onOpen}
            className="flex-1 h-9 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
          
          {/* More options button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onMore}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 rounded-lg"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NodeCard;
