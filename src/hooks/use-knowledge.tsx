'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import { Category, Note, Tag, NoteRelation } from '@/types/knowledge';
import { initCategories, initNotes, initRelations } from '@/data/knowledge-init';

export function useKnowledge() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [relations, setRelations] = useState<NoteRelation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKnowledge = async () => {
      try {
        await db.init();
        const [cats, noteList, tagList, rels] = await Promise.all([
          db.getCategories(),
          db.getNotes(),
          db.getTags(),
          db.getRelations(),
        ]);

        // 检查是否需要初始化默认数据（检查是否存在我们的初始化分类）
        const hasInitCategories = cats.some(cat => 
          initCategories.some(initCat => initCat.id === cat.id)
        );
        
        if (!hasInitCategories) {
          try {
            // 使用串行添加，捕获每个单独的错误
            const addedCats: Category[] = [];
            for (const cat of initCategories) {
              try {
                await db.addCategory(cat);
                addedCats.push(cat);
              } catch (catErr) {
                console.warn(`添加分类 ${cat.name} 失败:`, catErr);
              }
            }
            
            const addedNotes: Note[] = [];
            for (const note of initNotes) {
              try {
                await db.addNote(note);
                addedNotes.push(note);
              } catch (noteErr) {
                console.warn(`添加笔记 ${note.title} 失败:`, noteErr);
              }
            }
            
            const addedRels: NoteRelation[] = [];
            for (const rel of initRelations) {
              try {
                await db.addRelation(rel);
                addedRels.push(rel);
              } catch (relErr) {
                console.warn(`添加关联失败:`, relErr);
              }
            }
            
            // 使用成功添加的数据
            setCategories(addedCats.length > 0 ? addedCats : cats);
            setNotes(addedNotes.length > 0 ? addedNotes : noteList);
            setRelations(addedRels.length > 0 ? addedRels : rels);
          } catch (initErr) {
            console.warn('初始化默认数据时出错（可能已有部分数据）:', initErr);
            setCategories(cats);
            setNotes(noteList);
            setRelations(rels);
          }
        } else {
          setCategories(cats);
          setNotes(noteList);
          setRelations(rels);
        }
        
        setTags(tagList);
        setIsInitialized(true);
      } catch (err) {
        console.error('初始化知识库失败:', err);
        setError(err instanceof Error ? err.message : '初始化失败');
        setIsInitialized(true);
      }
    };

    initKnowledge();
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.addCategory(newCategory);
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    const updatedCategory = { ...category, updatedAt: Date.now() };
    await db.updateCategory(updatedCategory);
    setCategories(prev => prev.map(c => c.id === category.id ? updatedCategory : c));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await db.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const addNote = useCallback(async (note: Omit<Note, 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.addNote(newNote);
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback(async (note: Note) => {
    const updatedNote = { ...note, updatedAt: Date.now() };
    await db.updateNote(updatedNote);
    setNotes(prev => prev.map(n => n.id === note.id ? updatedNote : n));
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await db.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const addTag = useCallback(async (tag: Omit<Tag, 'createdAt'>) => {
    const newTag: Tag = {
      ...tag,
      createdAt: Date.now(),
    };
    await db.addTag(newTag);
    setTags(prev => [...prev, newTag]);
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    await db.deleteTag(id);
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const addRelation = useCallback(async (relation: Omit<NoteRelation, 'createdAt'>) => {
    const newRelation: NoteRelation = {
      ...relation,
      createdAt: Date.now(),
    };
    await db.addRelation(newRelation);
    setRelations(prev => [...prev, newRelation]);
  }, []);

  const deleteRelation = useCallback(async (id: string) => {
    await db.deleteRelation(id);
    setRelations(prev => prev.filter(r => r.id !== id));
  }, []);

  const exportData = useCallback(async () => {
    return await db.exportData();
  }, []);

  const importData = useCallback(async (data: Parameters<typeof db.importData>[0]) => {
    await db.importData(data);
    const [cats, noteList, tagList, rels] = await Promise.all([
      db.getCategories(),
      db.getNotes(),
      db.getTags(),
      db.getRelations(),
    ]);
    setCategories(cats);
    setNotes(noteList);
    setTags(tagList);
    setRelations(rels);
  }, []);

  const searchNotes = useCallback((query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [notes]);

  return {
    isInitialized,
    categories,
    notes,
    tags,
    relations,
    error,
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
  };
}
