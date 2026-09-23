export type ToolCategory = 'Compress' | 'Resize' | 'Convert' | 'Edit';

export interface ToolDefinition {
  id: string;
  name: string;
  path: string;
  category: ToolCategory;
  shortDescription: string;
  badge?: string;
  icon: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  relatedToolIds: string[];
}

export interface ImageFileInfo {
  file: File;
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

export interface ProcessedImageResult {
  blob: Blob;
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
  reductionPercentage?: number;
  processingTimeMs?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageSEO {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  breadcrumbs: Array<{ name: string; path: string }>;
  faqs?: FAQItem[];
  applicationCategory?: string;
}
