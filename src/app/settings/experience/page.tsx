'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GraduationCap,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  X,
  Check,
} from 'lucide-react';
import { Education, Experience } from '@/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type TabType = 'education' | 'experience';

interface ExperienceFormData {
  id?: string;
  school?: string;
  degree?: string;
  major?: string;
  company?: string;
  position?: string;
  period: string;
  description: string[];
  achievements?: string[];
}

export default function ExperienceManagementPage() {
  const { profile, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>('education');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | Experience | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    period: '',
    description: [''],
    achievements: [''],
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleOpenModal = (item?: Education | Experience) => {
    if (item) {
      setEditingItem(item);
      if ('school' in item) {
        setFormData({
          id: item.id,
          school: item.school,
          degree: item.degree,
          major: item.major,
          period: item.period,
          description: item.description ? [item.description] : [''],
        });
      } else {
        setFormData({
          id: item.id,
          company: item.company,
          position: item.position,
          period: item.period,
          description: [...item.description],
          achievements: item.achievements ? [...item.achievements] : [''],
        });
      }
    } else {
      setEditingItem(null);
      setFormData({
        period: '',
        description: [''],
        achievements: [''],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      period: '',
      description: [''],
      achievements: [''],
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    if (activeTab === 'education') {
      if (!formData.school || !formData.period) return;

      const newEducation: Education = {
        id: editingItem?.id || `edu-${Date.now()}`,
        school: formData.school,
        degree: formData.degree || '',
        major: formData.major || '',
        period: formData.period,
        description: formData.description[0] || undefined,
        sortOrder: editingItem?.sortOrder || (profile.education.length + 1),
      };

      let updatedEducation: Education[];
      if (editingItem) {
        updatedEducation = profile.education.map((e) =>
          e.id === editingItem.id ? newEducation : e
        );
      } else {
        updatedEducation = [...profile.education, newEducation];
      }

      await updateProfile({ education: updatedEducation });
    } else {
      if (!formData.company || !formData.position || !formData.period) return;

      const newExperience: Experience = {
        id: editingItem?.id || `exp-${Date.now()}`,
        company: formData.company,
        position: formData.position,
        period: formData.period,
        description: formData.description.filter((d) => d.trim()),
        achievements: formData.achievements?.filter((a) => a.trim()) || undefined,
        sortOrder: editingItem?.sortOrder || (profile.experience.length + 1),
      };

      let updatedExperience: Experience[];
      if (editingItem) {
        updatedExperience = profile.experience.map((e) =>
          e.id === editingItem.id ? newExperience : e
        );
      } else {
        updatedExperience = [...profile.experience, newExperience];
      }

      await updateProfile({ experience: updatedExperience });
    }

    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (!profile) return;

    if (activeTab === 'education') {
      const updatedEducation = profile.education.filter((e) => e.id !== id);
      await updateProfile({ education: updatedEducation });
    } else {
      const updatedExperience = profile.experience.filter((e) => e.id !== id);
      await updateProfile({ experience: updatedExperience });
    }
    setDeleteConfirm(null);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (!profile) return;

    if (activeTab === 'education') {
      const updatedEducation = [...profile.education];
      const [removed] = updatedEducation.splice(fromIndex, 1);
      updatedEducation.splice(toIndex, 0, removed);
      updatedEducation.forEach((e, i) => {
        e.sortOrder = i + 1;
      });
      await updateProfile({ education: updatedEducation });
    } else {
      const updatedExperience = [...profile.experience];
      const [removed] = updatedExperience.splice(fromIndex, 1);
      updatedExperience.splice(toIndex, 0, removed);
      updatedExperience.forEach((e, i) => {
        e.sortOrder = i + 1;
      });
      await updateProfile({ experience: updatedExperience });
    }
  };

  const addDescriptionItem = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ''],
    }));
  };

  const updateDescriptionItem = (index: number, value: string) => {
    setFormData((prev) => {
      const newDescription = [...prev.description];
      newDescription[index] = value;
      return { ...prev, description: newDescription };
    });
  };

  const removeDescriptionItem = (index: number) => {
    if (formData.description.length > 1) {
      setFormData((prev) => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index),
      }));
    }
  };

  const addAchievementItem = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ''],
    }));
  };

  const updateAchievementItem = (index: number, value: string) => {
    setFormData((prev) => {
      const newAchievements = [...(prev.achievements || [])];
      newAchievements[index] = value;
      return { ...prev, achievements: newAchievements };
    });
  };

  const removeAchievementItem = (index: number) => {
    if ((formData.achievements?.length || 0) > 1) {
      setFormData((prev) => ({
        ...prev,
        achievements: (prev.achievements || []).filter((_, i) => i !== index),
      }));
    }
  };

  const educationList = profile?.education.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const experienceList = profile?.experience.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">经历管理</h1>

      {/* Tab切换 */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'education' ? 'default' : 'outline'}
          onClick={() => setActiveTab('education')}
          className="flex items-center gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          教育经历
        </Button>
        <Button
          variant={activeTab === 'experience' ? 'default' : 'outline'}
          onClick={() => setActiveTab('experience')}
          className="flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4" />
          实习经历
        </Button>
      </div>

      {/* 添加按钮 */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          添加经历
        </Button>
      </div>

      {/* 列表 */}
      <Card>
        <CardContent className="p-0">
          {activeTab === 'education' ? (
            <div className="space-y-0">
              {educationList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂无教育经历，点击上方按钮添加</p>
                </div>
              ) : (
                educationList.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                  >
                    <button
                      className="cursor-grab hover:text-primary active:cursor-grabbing"
                      onClick={() => {
                        const newIndex = index === 0 ? educationList.length - 1 : index - 1;
                        handleReorder(index, newIndex);
                      }}
                    >
                      <GripVertical className="h-5 w-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{edu.school}</h3>
                      <p className="text-xs text-muted-foreground">
                        {edu.degree} · {edu.major} · {edu.period}
                      </p>
                      {edu.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(edu)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {experienceList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂无实习经历，点击上方按钮添加</p>
                </div>
              ) : (
                experienceList.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                  >
                    <button
                      className="cursor-grab hover:text-primary active:cursor-grabbing"
                      onClick={() => {
                        const newIndex = index === 0 ? experienceList.length - 1 : index - 1;
                        handleReorder(index, newIndex);
                      }}
                    >
                      <GripVertical className="h-5 w-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{exp.company}</h3>
                      <p className="text-xs text-muted-foreground">
                        {exp.position} · {exp.period}
                      </p>
                      <div className="mt-2">
                        {exp.description.map((desc, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            • {desc}
                          </p>
                        ))}
                      </div>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">成果数据：</p>
                          {exp.achievements.map((achievement, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              • {achievement}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(exp)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {editingItem ? '编辑经历' : '添加经历'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === 'education' ? (
                <>
                  <div>
                    <Label htmlFor="school">学校名称 *</Label>
                    <Input
                      id="school"
                      value={formData.school || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, school: e.target.value }))
                      }
                      placeholder="输入学校名称"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="degree">学历</Label>
                      <Input
                        id="degree"
                        value={formData.degree || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, degree: e.target.value }))
                        }
                        placeholder="本科/硕士等"
                      />
                    </div>
                    <div>
                      <Label htmlFor="major">专业</Label>
                      <Input
                        id="major"
                        value={formData.major || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, major: e.target.value }))
                        }
                        placeholder="输入专业名称"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="period">时间 *</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, period: e.target.value }))
                      }
                      placeholder="2020-09 ~ 2024-06"
                    />
                  </div>
                  <div>
                    <Label>描述（可选）</Label>
                    <textarea
                      value={formData.description[0] || ''}
                      onChange={(e) => updateDescriptionItem(0, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="描述您的学习经历"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="company">公司名称 *</Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      placeholder="输入公司名称"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">职位 *</Label>
                    <Input
                      id="position"
                      value={formData.position || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, position: e.target.value }))
                      }
                      placeholder="输入职位名称"
                    />
                  </div>
                  <div>
                    <Label htmlFor="period">时间 *</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, period: e.target.value }))
                      }
                      placeholder="2024-06 ~ 2024-09"
                    />
                  </div>
                  <div>
                    <Label>工作描述 *</Label>
                    <div className="space-y-2">
                      {formData.description.map((desc, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={desc}
                            onChange={(e) => updateDescriptionItem(index, e.target.value)}
                            placeholder={`工作职责 ${index + 1}`}
                          />
                          {formData.description.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDescriptionItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addDescriptionItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        添加职责
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>成果数据（可选）</Label>
                    <div className="space-y-2">
                      {(formData.achievements || []).map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievementItem(index, e.target.value)}
                            placeholder={`成果 ${index + 1}，如：提升效率30%`}
                          />
                          {(formData.achievements?.length || 0) > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievementItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addAchievementItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        添加成果
                      </Button>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Check className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="确认删除"
        description="确定要删除这条经历吗？此操作无法撤销。"
      />
    </div>
  );
}
