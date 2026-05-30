'use client';

import { useState } from 'react';
import { useKnowledge } from '@/hooks/use-knowledge';
import { CategoryManager } from '@/components/knowledge/CategoryManager';
import { NoteManager } from '@/components/knowledge/NoteManager';
import { KnowledgeGraph } from '@/components/knowledge/KnowledgeGraph';
import { ImportExport } from '@/components/knowledge/ImportExport';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Note } from '@/types/knowledge';

export default function KnowledgePage() {
  const {
    isInitialized,
    categories,
    notes,
    tags,
    relations,
    addCategory,
    updateCategory,
    deleteCategory,
    addNote,
    updateNote,
    deleteNote,
    addTag,
    deleteTag,
    addRelation,
    deleteRelation,
    exportData,
    importData,
    searchNotes,
  } = useKnowledge();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGraph, setShowGraph] = useState(false);

  const filteredNotes = searchQuery.trim() ? searchNotes(searchQuery) : (
    selectedCategoryId ? notes.filter(note => note.categoryId === selectedCategoryId) : notes
  );

  if (!isInitialized) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">知识库</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索笔记..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {showGraph ? '隐藏图谱' : '显示图谱'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CategoryManager
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
          <ImportExport
            notes={notes}
            categories={categories}
            tags={tags}
            relations={relations}
            onExport={exportData}
            onImport={importData}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          {showGraph && (
            <KnowledgeGraph
              notes={notes}
              categories={categories}
              relations={relations}
            />
          )}
          <NoteManager
            notes={filteredNotes}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>
    </div>
  );
}
