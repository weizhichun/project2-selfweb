'use client';

import { useRef, useCallback, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/use-profile';
import { ImagePlus, Loader2, User } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadButton?: boolean;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32',
};

export function AvatarUploader({ 
  className = '', 
  size = 'lg',
  showUploadButton = false
}: AvatarUploaderProps) {
  const { profile, uploadAvatar, refreshProfile } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          await uploadAvatar(file);
          await refreshProfile();
        } catch (error) {
          console.error('Upload error:', error);
          addToast({
            type: 'destructive',
            title: '上传失败',
            description: error instanceof Error ? error.message : '请重试',
          });
        } finally {
          setIsUploading(false);
        }
      }
      if (e.target) {
        e.target.value = '';
      }
    },
    [uploadAvatar, refreshProfile, addToast]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar
          className={`${sizeClasses[size]} border-4 border-primary/20 cursor-pointer hover:border-primary/40 transition-all ${className}`}
          onClick={handleAvatarClick}
        >
          <AvatarImage 
            src={profile?.avatar} 
            alt={profile?.name || '头像'} 
            className="object-cover"
          />
          <AvatarFallback className="bg-muted">
            <User className="h-1/2 w-1/2" />
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
          onClick={handleAvatarClick}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <div className="flex flex-col items-center">
              <ImagePlus className="h-8 w-8 text-white mb-1" />
              <span className="text-xs text-white font-medium">点击上传</span>
            </div>
          )}
        </div>
      </div>

      {showUploadButton && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAvatarClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              更换头像
            </>
          )}
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
