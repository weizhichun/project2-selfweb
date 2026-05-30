export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  learningStatus: 'not-started' | 'learning' | 'completed';
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface NoteRelation {
  id: string;
  sourceNoteId: string;
  targetNoteId: string;
  relationType: 'related' | 'prerequisite' | 'extension';
  description?: string;
  createdAt: number;
}

import { Profile } from './index';

export interface KnowledgeExport {
  categories: Category[];
  notes: Note[];
  tags: Tag[];
  relations: NoteRelation[];
  profile?: Profile; // 可选的个人信息
  exportTime: number;
  version: string;
}
