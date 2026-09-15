export type BlockType =
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'todo'
  | 'bullet'
  | 'number'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'code'
  | 'database';

export interface NotionBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // for todo
  collapsed?: boolean; // for toggle
  icon?: string; // for callout
  color?: string; // for callout highlight (e.g. 'blue', 'yellow', 'green', 'rose', 'gray')
  language?: string; // for code block (e.g. 'javascript', 'python', 'sql', 'html')
  databaseId?: string; // for embedded database
  children?: NotionBlock[]; // for toggle sub-blocks
}

export type PropertyType =
  | 'text'
  | 'status'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'number'
  | 'checkbox';

export interface PropertyOption {
  id: string;
  name: string;
  color: string;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: PropertyOption[];
}

export interface DatabaseRow {
  id: string;
  values: Record<string, any>;
}

export interface NotionDatabase {
  id: string;
  title: string;
  viewType: 'table' | 'board' | 'list';
  properties: DatabaseProperty[];
  rows: DatabaseRow[];
}

export interface NotionPage {
  id: string;
  title: string;
  icon: string;
  coverUrl?: string;
  parentId?: string | null;
  isFavorite: boolean;
  isLocked?: boolean;
  isFullWidth?: boolean;
  isSmallText?: boolean;
  blocks: NotionBlock[];
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface NotionWorkspaceItem {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  descriptionEn: string;
  plan: 'Education' | 'Pro' | 'Personal' | 'Team';
  planAr: string;
  membersCount: number;
}

export interface NotionTemplate {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: 'Study' | 'Productivity' | 'Personal' | 'Work';
  categoryAr: string;
  coverUrl: string;
  createPage: () => { page: Omit<NotionPage, 'id' | 'createdAt' | 'updatedAt'>; database?: NotionDatabase };
}
