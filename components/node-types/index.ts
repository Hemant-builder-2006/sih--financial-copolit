// Export all node components
export { default as TextNode } from './TextNode';
export { default as DocumentNode } from './DocumentNode';
export { default as ImageNode } from './ImageNode';
export { default as VideoNode } from './VideoNode';
export { default as CompanyNode } from './CompanyNode';
export { default as AINode } from './AINode';
export { default as ShopifyNode } from './ShopifyNode';

// Export interfaces and hooks
export * from './interfaces';
export { useNodeActions } from './useNodeActions';

// Node type registry for ReactFlow
import TextNode from './TextNode';
import DocumentNode from './DocumentNode';
import ImageNode from './ImageNode';
import VideoNode from './VideoNode';
import CompanyNode from './CompanyNode';
import AINode from './AINode';
import ShopifyNode from './ShopifyNode';

export const nodeTypes = {
  text: TextNode,
  document: DocumentNode,
  image: ImageNode,
  video: VideoNode,
  company: CompanyNode,
  ai: AINode,
  shopify: ShopifyNode,
};