"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, RotateCcw, Upload, Trash2, Check, AlertCircle } from "lucide-react";
import { Profile as ProfileType } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "@/components/auth/LoginModal";
import { SetPasswordModal } from "@/components/auth/SetPasswordModal";
import { useRouter } from "next/navigation";
import { useConfirm, ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ProfileEditPage() {
  const { profile, isLoading, updateProfile, resetToDefault } = useProfile();
  const { isAuthenticated, hasPassword, isLoading: isAuthLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const { confirm, ConfirmDialog: ResetConfirmDialog } = useConfirm();
  
  const [formData, setFormData] = useState<Partial<ProfileType> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // 表单验证
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = "姓名不能为空";
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }
    
    if (formData?.phone && !/^1[3-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "请输入有效的手机号码";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = async () => {
    if (!formData || !validateForm()) return;
    
    setIsSaving(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      addToast({
        type: "destructive",
        title: "保存失败",
        description: error instanceof Error ? error.message : "无法保存个人信息，请重试",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 头像上传处理
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "destructive",
        title: "文件过大",
        description: "头像文件大小不能超过 5MB",
      });
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      addToast({
        type: "destructive",
        title: "文件类型错误",
        description: "请上传图片文件",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 400;
          const maxHeight = 400;
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
            
            setFormData({ ...formData!, avatar: compressedDataUrl });
            addToast({
              type: "success",
              title: "头像上传成功",
              description: "头像已更新，点击保存后生效",
            });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        addToast({
          type: "destructive",
          title: "头像上传失败",
          description: "无法读取图片文件，请重试",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      addToast({
        type: "destructive",
        title: "头像上传失败",
        description: error instanceof Error ? error.message : "上传过程出错，请重试",
      });
    }
  };

  const handleResetAvatar = () => {
    setFormData({ ...formData!, avatar: "" });
  };

  const handleReset = async () => {
    const confirmed = await confirm({
      title: "确认重置",
      description: "此操作将删除所有个人信息更改并恢复为默认数据，不可撤销。",
      confirmText: "确认重置",
      variant: "destructive",
    });

    if (confirmed) {
      try {
        await resetToDefault();
      } catch (error) {
        addToast({
          type: "destructive",
          title: "重置失败",
          description: error instanceof Error ? error.message : "无法重置个人信息，请重试",
        });
      }
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!hasPassword) {
    return <SetPasswordModal />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  if (isLoading || !formData) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">个人信息设置</h1>
        </div>
        <p className="mt-2 text-gray-600">编辑个人基本信息，更改后会同步到全站所有页面</p>
      </div>

      <div className="grid gap-6">
        {/* 头像设置 */}
        <Card>
          <CardHeader>
            <CardTitle>头像设置</CardTitle>
            <CardDescription>上传或修改个人头像</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="头像"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-100">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    上传头像
                  </Button>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                {formData.avatar && (
                  <Button variant="outline" size="sm" onClick={handleResetAvatar}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    重置头像
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>编辑您的个人基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-red-600" : ""}>
                  姓名 *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入姓名"
                  className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">年龄</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  placeholder="请输入年龄"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <select
                  id="gender"
                  value={formData.gender || "female"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="female">女</option>
                  <option value="male">男</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">求职意向</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入求职意向"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <textarea
                id="bio"
                dir="ltr"
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                placeholder="请输入个人简介"
              />
            </div>
          </CardContent>
        </Card>

        {/* 联系方式 */}
        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
            <CardDescription>您的联系信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={errors.email ? "text-red-600" : ""}>
                  邮箱 *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={errors.phone ? "text-red-600" : ""}>
                  电话
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入电话"
                  className={errors.phone ? "border-red-500 focus:ring-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">现居地</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="请输入现居地"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">Gitee</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.github || ""}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="Gitee 链接"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 技能编辑 */}
        <Card>
          <CardHeader>
            <CardTitle>技能管理</CardTitle>
            <CardDescription>编辑您的技能大类和具体技能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData?.skillCategories?.map((category, catIndex) => (
              <div key={category.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCategories = [...(formData.skillCategories || [])];
                      newCategories.splice(catIndex, 1);
                      setFormData({ ...formData, skillCategories: newCategories });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>大类描述</Label>
                  <Input
                    value={category.description}
                    onChange={(e) => {
                      const newCategories = [...(formData.skillCategories || [])];
                      newCategories[catIndex] = { ...category, description: e.target.value };
                      setFormData({ ...formData, skillCategories: newCategories });
                    }}
                    placeholder="请输入大类描述"
                  />
                </div>
                <div className="space-y-2">
                  <Label>技能标签（用逗号分隔）</Label>
                  <Input
                    value={category.tags.join(", ")}
                    onChange={(e) => {
                      const newTags = e.target.value.split(",").map(t => t.trim()).filter(t => t);
                      const newCategories = [...(formData.skillCategories || [])];
                      newCategories[catIndex] = { ...category, tags: newTags };
                      setFormData({ ...formData, skillCategories: newCategories });
                    }}
                    placeholder="C/C++, Java, Python"
                  />
                </div>
                <div className="space-y-2">
                  <Label>亮点描述（每行一条）</Label>
                  <textarea
                    dir="ltr"
                    value={category.highlights?.join("\n") || ""}
                    onChange={(e) => {
                      const newHighlights = e.target.value.split("\n").filter(h => h.trim());
                      const newCategories = [...(formData.skillCategories || [])];
                      newCategories[catIndex] = { ...category, highlights: newHighlights };
                      setFormData({ ...formData, skillCategories: newCategories });
                    }}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                    placeholder="每行输入一个亮点描述"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newCategory = {
                  id: `skill-${Date.now()}`,
                  title: "新技能大类",
                  description: "请输入描述",
                  tags: [],
                  highlights: []
                };
                setFormData({
                  ...formData,
                  skillCategories: [...(formData?.skillCategories || []), newCategory]
                });
              }}
            >
              + 添加技能大类
            </Button>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                variant="destructive"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                重置为默认数据
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存更改
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResetConfirmDialog />
    </div>
  );
}
