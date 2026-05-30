'use client';

import { useState } from 'react';
import { Category } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: (category: Omit<Category, 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16',
];

export function CategoryManager({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSave = async () => {
    if (!name.trim()) return;

    if (editingCategory) {
      await onUpdateCategory({
        ...editingCategory,
        name,
        description,
        color,
      });
    } else {
      await onAddCategory({
        id: `cat-${Date.now()}`,
        name,
        description,
        color,
      });
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setColor(category.color);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setColor('#3b82f6');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">分类管理</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加分类
        </Button>
      </div>

      <div className="space-y-2">
        <Button
          variant={selectedCategoryId === null ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onSelectCategory(null)}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          全部笔记
        </Button>

        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2">
            <Button
              variant={selectedCategoryId === category.id ? 'default' : 'ghost'}
              className="flex-1 justify-start"
              onClick={() => onSelectCategory(category.id)}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteCategory(category.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {editingCategory ? '编辑分类' : '添加分类'}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">分类名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="输入分类名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                dir="ltr"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="输入分类描述（可选）"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">颜色</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              </div>
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
