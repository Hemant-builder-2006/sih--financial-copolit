import React from 'react';
import { NodeProps } from 'reactflow';

// Base node data interface
export interface BaseNodeData {
  title: string;
  description: string;
  isEditingTitle?: boolean;
  isEditingDesc?: boolean;
  aiStatus?: 'idle' | 'processing' | 'done';
  aiResponse?: string;
  size?: 'small' | 'medium' | 'large' | 'custom';
  width?: number;
  height?: number;
}

// Specific node data interfaces
export interface TextNodeData extends BaseNodeData {
  type: 'text';
  content?: string;
  fileName?: string;
  fileSize?: number;
  lastModified?: string;
}

export interface DocumentNodeData extends BaseNodeData {
  type: 'document';
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  documentData?: number[];
  lastModified?: string;
  extractedText?: string;
}

export interface ImageNodeData extends BaseNodeData {
  type: 'image';
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface VideoNodeData extends BaseNodeData {
  type: 'video';
  videoUrl?: string;
  fileName?: string;
  fileSize?: number;
  transcription?: string;
}

export interface AINodeData extends BaseNodeData {
  type: 'ai';
  inputText?: string;
  query?: string;
  url?: string;
}

export interface CompanyNodeData extends BaseNodeData {
  type: 'company';
  companyName?: string;
  industry?: string;
  website?: string;
  businessDescription?: string;
  companyData?: any[]; // For CSV/Excel data
}

export interface ShopifyNodeData extends BaseNodeData {
  type: 'shopify';
  storeUrl?: string;
  shopData?: {
    shop?: {
      name: string;
      email: string;
      domain: string;
      currency: string;
      timezone: string;
      plan_name: string;
      created_at: string;
    };
    products?: {
      count: number;
      recent: Array<{
        id: number;
        title: string;
        vendor: string;
        product_type: string;
        created_at: string;
        status: string;
      }>;
    };
    orders?: {
      count: number;
      recent: Array<{
        id: number;
        name: string;
        email: string;
        total_price: string;
        currency: string;
        financial_status: string;
        fulfillment_status: string;
        created_at: string;
      }>;
    };
  };
  fetchStatus?: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

// Union type for all node data
export type NodeData = TextNodeData | DocumentNodeData | ImageNodeData | VideoNodeData | AINodeData | CompanyNodeData | ShopifyNodeData;

// Base node props
export interface BaseNodeProps<T extends BaseNodeData> extends NodeProps<T> {
  id: string;
  data: T;
}

// Size configurations
export const sizeConfig = {
  small: { width: 200, height: 160 },
  medium: { width: 280, height: 200 },
  large: { width: 360, height: 260 }
};

// AI action types
export type AIAction = 'analyze' ;

// Common node functionality interface
export interface NodeActions {
  updateNode: (updates: Partial<BaseNodeData>) => void;
  deleteNode: () => void;
  handleTitleEdit: () => void;
  handleDescEdit: () => void;
  handleSizeChange: (newSize: 'small' | 'medium' | 'large') => void;
  handleAIAction: (action: AIAction, content: string) => Promise<void>;
}

// File import handlers
export interface FileHandlers {
  handleImageImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePDFImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDocumentImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}