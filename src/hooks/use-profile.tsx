'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '@/types';
import { db } from '@/lib/db';
import { useToast } from './use-toast';

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  updateProfile: (updatedProfile: Partial<Profile>) => Promise<void>;
  resetToDefault: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      const data = await db.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      addToast({
        type: 'destructive',
        title: '加载失败',
        description: '无法加载个人信息，请刷新页面重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAndLoad = async () => {
      try {
        await db.init();
        await refreshProfile();
      } catch (error) {
        console.error('Failed to initialize database:', error);
        addToast({
          type: 'destructive',
          title: '初始化失败',
          description: '数据库初始化失败，请刷新页面重试',
        });
      }
    };
    
    initAndLoad();
  }, []);

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!profile) return;
    
    try {
      const newProfile = { ...profile, ...updatedProfile };
      await db.saveProfile(newProfile);
      setProfile(newProfile);
      
      addToast({
        type: 'success',
        title: '保存成功',
        description: '个人信息已更新',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast({
        type: 'destructive',
        title: '保存失败',
        description: '无法保存个人信息，请重试',
      });
    }
  };

  const resetToDefault = async () => {
    try {
      await db.resetToDefaultProfile();
      await refreshProfile();
      
      addToast({
        type: 'success',
        title: '重置成功',
        description: '个人信息已恢复为默认数据',
      });
    } catch (error) {
      console.error('Failed to reset profile:', error);
      addToast({
        type: 'destructive',
        title: '重置失败',
        description: '无法重置个人信息，请重试',
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      addToast({
        type: 'destructive',
        title: '格式错误',
        description: '仅支持 JPG/JPEG/PNG 格式的图片',
      });
      return;
    }

    try {
      const base64 = await compressAndConvertToBase64(file, 256, 256);
      await updateProfile({ avatar: base64 });
      
      addToast({
        type: 'success',
        title: '上传成功',
        description: '头像已更新',
      });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      addToast({
        type: 'destructive',
        title: '上传失败',
        description: '无法上传头像，请重试',
      });
    }
  };

  const compressAndConvertToBase64 = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建画布'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        resetToDefault,
        refreshProfile,
        uploadAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
