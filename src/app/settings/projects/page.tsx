"use client";

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Github, 
  ExternalLink, 
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Project } from '@/types';

export default function ProjectsManagementPage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    period: '',
    details: '',
    githubUrl: '',
    demoUrl: '',
    tags: [] as string[],
    isPublic: true,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        period: editingProject.period || '',
        details: editingProject.details || '',
        githubUrl: editingProject.githubUrl || '',
        demoUrl: editingProject.demoUrl || '',
        tags: editingProject.tags || [],
        isPublic: editingProject.isPublic ?? true,
      });
      setTagInput('');
    }
  }, [editingProject]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!formData.title.trim()) {
      addToast({
        type: 'destructive',
        title: '保存失败',
        description: '项目名称不能为空',
      });
      return;
    }

    const projects = profile.projects || [];
    
    if (isAddingNew) {
      // Add new project
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        period: formData.period,
        details: formData.details,
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl,
        tags: formData.tags,
        isPublic: formData.isPublic,
      };
      
      await updateProfile({ projects: [...projects, newProject] });
      addToast({
        type: 'success',
        title: '添加成功',
        description: '新项目已添加',
      });
    } else if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map(p =>
        p.id === editingProject.id
          ? {
              ...p,
              title: formData.title,
              description: formData.description,
              period: formData.period,
              details: formData.details,
              githubUrl: formData.githubUrl,
              demoUrl: formData.demoUrl,
              tags: formData.tags,
              isPublic: formData.isPublic,
            }
          : p
      );
      
      await updateProfile({ projects: updatedProjects });
      addToast({
        type: 'success',
        title: '保存成功',
        description: '项目已更新',
      });
    }

    setIsEditing(false);
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (projectId: string) => {
    if (!profile) return;
    
    const updatedProjects = (profile.projects || []).filter(p => p.id !== projectId);
    await updateProfile({ projects: updatedProjects });
    
    addToast({
      type: 'success',
      title: '删除成功',
      description: '项目已删除',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingProject(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      description: '',
      period: '',
      details: '',
      githubUrl: '',
      demoUrl: '',
      tags: [],
      isPublic: true,
    });
    setTagInput('');
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setIsEditing(true);
    setEditingProject({
      id: '',
      title: '',
      description: '',
      period: '',
      details: '',
      githubUrl: '',
      demoUrl: '',
      tags: [],
      isPublic: true,
    });
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddingNew(false);
    setIsEditing(true);
  };

  if (isLoading || !profile) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const projects = profile.projects || [];

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">项目管理</h1>
            <p className="text-muted-foreground mt-1">管理您的项目作品集</p>
          </div>
          {!isEditing && (
            <Button onClick={startAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              添加项目
            </Button>
          )}
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>{isAddingNew ? '添加新项目' : '编辑项目'}</CardTitle>
              <CardDescription>
                {isAddingNew ? '填写项目信息来添加新项目' : '修改项目信息'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">项目名称 *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：个人博客系统"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">项目描述 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简要描述项目功能和特点"
                  className="w-full px-3 py-2 border rounded-md min-h-[100px] bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">时间周期</label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="例如：2024.01 - 2024.06"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">是否公开</label>
                  <div className="flex items-center gap-4 h-[42px]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPublic: true })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        formData.isPublic
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-input'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      公开
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPublic: false })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        !formData.isPublic
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-input'
                      }`}
                    >
                      <EyeOff className="h-4 w-4" />
                      私密
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">项目详情</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="详细描述项目的技术架构、核心功能、遇到的技术难点等"
                  className="w-full px-3 py-2 border rounded-md min-h-[120px] bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Github className="h-4 w-4 inline mr-1" />
                    GitHub 地址
                  </label>
                  <Input
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    在线演示地址
                  </label>
                  <Input
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">技术标签</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="输入技术标签"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                保存
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">暂无项目</p>
                  <Button onClick={startAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加第一个项目
                  </Button>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          {!project.isPublic && (
                            <Badge variant="outline" className="gap-1">
                              <EyeOff className="h-3 w-3" />
                              私密
                            </Badge>
                          )}
                        </div>
                        {project.period && (
                          <p className="text-sm text-muted-foreground mb-2">{project.period}</p>
                        )}
                        <p className="text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(project)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
