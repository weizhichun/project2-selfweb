'use client';

import { useRef, useCallback } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/use-profile';
import { ImagePlus } from 'lucide-react';

interface AvatarUploaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
  xl: 'h-28 w-28',
};

export function AvatarUploader({ className = '', size = 'lg' }: AvatarUploaderProps) {
  const { profile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadAvatar(file);
      }
      // Reset input to allow re-uploading the same file
      if (e.target) {
        e.target.value = '';
      }
    },
    [uploadAvatar]
  );

  return (
    <div className="relative">
      <Avatar
        className={`${sizeClasses[size]} border-3 border-primary cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        onClick={handleAvatarClick}
      >
        <AvatarImage src={profile?.avatar} alt={profile?.name || '头像'} />
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer">
        <ImagePlus className="h-6 w-6 text-white" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
