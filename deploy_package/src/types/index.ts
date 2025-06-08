export interface AITool {
  id: string;
  name: string;
  purchaseDate: string;
  feeType: 'monthly' | 'yearly';
  expirationDate: string;
  features: string[];
  cost?: number;
}

export interface MindMapNode {
  id: string;
  name: string;
  type: 'tool' | 'feature';
  parentId?: string;
  x?: number;
  y?: number;
  features?: string[];
}

export interface MindMapLink {
  source: string;
  target: string;
}

export type ViewMode = 'list' | 'mindmap';
