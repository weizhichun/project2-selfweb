'use client';

import { useState } from 'react';
import { Note, Category } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from './RichTextEditor';

interface NoteManagerProps {
  notes: Note[];
  categories: Category[];
  selectedCategoryId: string | null;
  onAddNote: (note: Omit<Note, 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateNote: (note: Note) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export function NoteManager({
  notes,
  categories,
  selectedCategoryId,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NoteManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [learningStatus, setLearningStatus] = useState<'not-started' | 'learning' | 'completed'>('not-started');

  const filteredNotes = selectedCategoryId
    ? notes.filter(note => note.categoryId === selectedCategoryId)
    : notes;

  const handleSave = async () => {
    if (!title.trim() || !categoryId) return;

    if (editingNote) {
      await onUpdateNote({
        ...editingNote,
        title,
        content,
        categoryId,
        tags,
        learningStatus,
      });
    } else {
      await onAddNote({
        id: `note-${Date.now()}`,
        title,
        content,
        categoryId,
        tags,
        learningStatus,
      });
    }

    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategoryId(note.categoryId);
    setTags(note.tags);
    setLearningStatus(note.learningStatus);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategoryId(categories[0]?.id || '');
    setTags([]);
    setTagInput('');
    setLearningStatus('not-started');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'learning': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'learning': return '学习中';
      default: return '未开始';
    }
  };

  const getCategory = (id: string) => categories.find(cat => cat.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedCategoryId
            ? `${getCategory(selectedCategoryId)?.name} (${filteredNotes.length})`
            : `全部笔记 (${filteredNotes.length})`}
        </h3>
        <Button size="sm" onClick={() => {
          setCategoryId(selectedCategoryId || categories[0]?.id || '');
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          添加笔记
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredNotes.map((note) => {
          const category = getCategory(note.categoryId);
          return (
            <Card key={note.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(note.learningStatus)}
                    <h4 className="font-semibold truncate">{note.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {category && (
                      <Badge style={{ backgroundColor: category.color }}>
                        {category.name}
                      </Badge>
                    )}
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant="outline">
                      {getStatusText(note.learningStatus)}
                    </Badge>
                  </div>
                  <div
                    className="text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(note)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNote(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无笔记，点击上方按钮添加</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {editingNote ? '编辑笔记' : '添加笔记'}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="输入笔记标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">学习状态</label>
                <select
                  value={learningStatus}
                  onChange={(e) => setLearningStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="not-started">未开始</option>
                  <option value="learning">学习中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="输入标签后按回车"
                  />
                  <Button onClick={handleAddTag}>添加</Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">内容</label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="开始撰写笔记..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={resetForm}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  保存
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
