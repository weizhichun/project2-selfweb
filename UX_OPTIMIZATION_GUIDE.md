# 用户体验优化指南

## 📋 目录

- [加载状态优化](#加载状态优化)
- [表单验证与反馈](#表单验证与反馈)
- [交互细节打磨](#交互细节打磨)
- [错误处理增强](#错误处理增强)

---

## 加载状态优化

### 🎯 目标

确保用户在所有异步操作和数据加载过程中都能获得流畅、一致的反馈。

### 1. 统一加载组件

#### 创建 LoadingSpinner 组件

```typescript
// src/components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizeClasses[size]
        )}
      />
    </div>
  );
}
```

#### 创建 LoadingOverlay 组件

```typescript
// src/components/ui/LoadingOverlay.tsx
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = '加载中...' 
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">{message}</p>
        </div>
      )}
    </div>
  );
}
```

### 2. 骨架屏组件

#### 创建 Skeleton 组件

```typescript
// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

// 预定义骨架屏组件
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </div>
  );
}

export function NoteListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 3. 页面级加载状态

#### 首页加载状态

```typescript
// src/app/page.tsx
import { useState, useEffect } from 'react';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { useProfile } from '@/hooks/use-profile';

export default function HomePage() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="container py-12">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-destructive">加载失败: {error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* 页面内容 */}
    </div>
  );
}
```

### 4. 异步操作加载状态

```typescript
// src/hooks/use-async-action.ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncAction<T>(
  asyncFn: () => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, [asyncFn]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
```

### 5. 优化建议

#### 渐进式加载

```typescript
// 优先加载关键内容
const [criticalData, setCriticalData] = useState(null);
const [fullData, setFullData] = useState(null);

useEffect(() => {
  // 立即加载关键数据
  fetchCriticalData().then(setCriticalData);
  
  // 延迟加载完整数据
  const timer = setTimeout(() => {
    fetchFullData().then(setFullData);
  }, 100);
  
  return () => clearTimeout(timer);
}, []);
```

#### 缓存优化

```typescript
// 使用 SWR 或 React Query 进行数据缓存
import useSWR from 'swr';

const { data, error, isLoading } = useSWR('/api/profile', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1分钟内不重复请求
});
```

---

## 表单验证与反馈

### 🎯 目标

提供实时、准确、友好的表单验证和操作反馈。

### 1. 表单验证 Hook

```typescript
// src/hooks/use-form-validation.ts
import { useState, useCallback } from 'react';

interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
  rules: ValidationRule[];
}

export function useFormValidation<T extends Record<string, FormField>>(
  initialFields: T
) {
  const [fields, setFields] = useState<T>(initialFields);

  const validateField = useCallback((name: keyof T, value: unknown) => {
    const field = fields[name];
    if (!field.rules) return null;

    for (const rule of field.rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  }, [fields]);

  const handleChange = useCallback((name: keyof T, value: unknown) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: value as string,
        touched: true,
        error: validateField(name, value),
      },
    }));
  }, [validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    const field = fields[name];
    const error = validateField(name, field.value);
    
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        error,
      },
    }));
  }, [fields, validateField]);

  const validateAll = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(fields).forEach(key => {
      const error = validateField(key as keyof T, fields[key as keyof T].value);
      if (error) {
        errors[key as keyof T] = error;
        isValid = false;
      }
    });

    setFields(prev => {
      const updated = { ...prev };
      Object.keys(errors).forEach(key => {
        updated[key as keyof T] = {
          ...prev[key as keyof T],
          touched: true,
          error: errors[key as keyof T] || null,
        };
      });
      return updated;
    });

    return isValid;
  }, [fields, validateField]);

  const reset = useCallback(() => {
    setFields(initialFields);
  }, [initialFields]);

  return {
    fields,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.values(fields).every(f => !f.error),
  };
}
```

### 2. 常用验证规则

```typescript
// src/lib/validation-rules.ts

export const validationRules = {
  required: (message = '此字段必填') => ({
    validate: (value: unknown) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  phone: (message = '请输入有效的手机号码') => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return false;
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(value.replace(/\D/g, ''));
    },
    message,
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return false;
      return value.length >= min;
    },
    message: message || `至少需要 ${min} 个字符`,
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return false;
      return value.length <= max;
    },
    message: message || `最多 ${max} 个字符`,
  }),

  pattern: (regex: RegExp, message: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return false;
      return regex.test(value);
    },
    message,
  }),

  match: (matchField: string, message?: string) => ({
    validate: (value: unknown, formData?: Record<string, unknown>) => {
      return value === formData?.[matchField];
    },
    message: message || `必须与 ${matchField} 相同`,
  }),
};
```

### 3. 表单组件集成

```typescript
// src/components/ui/FormField.tsx
import { Input } from './input';
import { Label } from './label';

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  error: string | null;
  touched: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  name,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  required,
}: FormFieldProps) {
  const showError = touched && error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          showError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      {showError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

---

## 交互细节打磨

### 🎯 目标

提供流畅、自然、愉悦的用户交互体验。

### 1. 按钮交互优化

```typescript
// 按钮状态管理
interface ButtonStates {
  default: string;
  hover: string;
  active: string;
  disabled: string;
  loading: string;
}

const primaryButtonStates: ButtonStates = {
  default: 'bg-blue-500 text-white',
  hover: 'bg-blue-600 shadow-lg',
  active: 'bg-blue-700 scale-95',
  disabled: 'bg-blue-300 cursor-not-allowed opacity-50',
  loading: 'bg-blue-500 cursor-wait',
};

// 按钮组件增强
export function Button({ 
  children, 
  isLoading, 
  disabled,
  variant = 'primary',
  ...props 
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'px-4 py-2 rounded font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        isLoading && 'cursor-wait',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="inline mr-2" />
          {children}
        </>
      ) : children}
    </button>
  );
}
```

### 2. 页面切换动画

```typescript
// src/components/layout/PageTransition.tsx
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. 列表项动画

```typescript
// src/components/ui/ListItem.tsx
import { motion } from 'framer-motion';

interface ListItemProps {
  children: React.ReactNode;
  index: number;
}

export function ListItem({ children, index }: ListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 4. 成功/失败反馈

```typescript
// src/hooks/use-toast.ts (已存在)

// 增强的成功反馈
export function useSuccessToast() {
  const { toast } = useToast();
  
  return (title: string, description?: string) => {
    toast({
      title: `✅ ${title}`,
      description,
      variant: 'success',
      duration: 3000,
    });
  };
}

// 增强的错误反馈
export function useErrorToast() {
  const { toast } = useToast();
  
  return (title: string, description?: string) => {
    toast({
      title: `❌ ${title}`,
      description,
      variant: 'destructive',
      duration: 5000,
    });
  };
}
```

### 5. 键盘导航支持

```typescript
// src/components/ui/KeyboardNav.tsx
export function KeyboardNav() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: 全局搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }

      // Escape: 关闭模态框
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          const lastModal = modals[modals.length - 1] as HTMLElement;
          lastModal.focus();
          // 触发关闭逻辑
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
```

---

## 错误处理增强

### 🎯 目标

优雅地处理所有错误场景，提供清晰的错误信息和恢复方案。

### 1. 统一错误处理

```typescript
// src/lib/error-handler.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field: string) {
    super(message, 'VALIDATION_ERROR', 400, { field });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource });
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'STORAGE_ERROR', 500, details);
    this.name = 'StorageError';
  }
}
```

### 2. IndexedDB 错误处理

```typescript
// src/lib/db-error-handler.ts
import { StorageError } from './error-handler';

export async function handleIndexedDBError<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('IndexedDB error:', error);
    
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'QuotaExceededError':
          throw new StorageError(
            '存储空间不足，请清理部分数据或导出备份',
            { error: error.name }
          );
        case 'VersionError':
          throw new StorageError(
            '数据库版本冲突，请刷新页面',
            { error: error.name }
          );
        case 'NotAllowedError':
          throw new StorageError(
            '无法访问存储，请检查浏览器权限设置',
            { error: error.name }
          );
        default:
          throw new StorageError(
            '数据存储失败，请重试',
            { error: error.name, message: error.message }
          );
      }
    }
    
    throw new StorageError(
      '数据操作失败',
      { error: String(error) }
    );
  }
}

// 检查 IndexedDB 支持性
export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

// 检查存储配额
export async function checkStorageQuota(): Promise<{
  quota: number;
  usage: number;
  usagePercentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        usagePercentage: estimate.quota 
          ? (estimate.usage / estimate.quota) * 100 
          : 0,
      };
    } catch (error) {
      console.warn('无法获取存储配额:', error);
    }
  }
  return { quota: 0, usage: 0, usagePercentage: 0 };
}
```

### 3. API 错误处理

```typescript
// src/lib/api-error-handler.ts
import { AppError } from './error-handler';

interface APIErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export async function handleAPIError(response: Response): Promise<never> {
  const data: APIErrorResponse = await response.json().catch(() => ({
    error: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  }));

  switch (response.status) {
    case 400:
      throw new AppError(
        data.message || 'Invalid request',
        'BAD_REQUEST',
        400,
        data.details
      );
    case 401:
      throw new AppError(
        'Authentication required',
        'UNAUTHORIZED',
        401
      );
    case 403:
      throw new AppError(
        'Access denied',
        'FORBIDDEN',
        403
      );
    case 404:
      throw new AppError(
        data.message || 'Resource not found',
        'NOT_FOUND',
        404
      );
    case 429:
      throw new AppError(
        'Too many requests, please try again later',
        'RATE_LIMITED',
        429
      );
    case 500:
      throw new AppError(
        'Server error',
        'SERVER_ERROR',
        500
      );
    default:
      throw new AppError(
        data.message || 'Unknown error',
        'UNKNOWN_ERROR',
        response.status
      );
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && 
    error.message.includes('Failed to fetch');
}

export function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && 
    error.name === 'AbortError' &&
    error.message.includes('timeout');
}
```

### 4. 用户友好的错误消息

```typescript
// src/lib/error-messages.ts

export const errorMessages = {
  // 通用错误
  generic: {
    title: '操作失败',
    description: '发生了未知错误，请稍后重试。',
  },

  // 网络错误
  network: {
    title: '网络连接失败',
    description: '请检查您的网络连接，然后重试。',
    action: '重试',
  },

  // 存储错误
  storage: {
    quotaExceeded: {
      title: '存储空间不足',
      description: '您的浏览器存储空间已满，请清理部分数据或导出备份。',
      action: '导出备份',
    },
    unavailable: {
      title: '存储不可用',
      description: '浏览器存储功能不可用，部分功能可能无法正常使用。',
      action: '刷新页面',
    },
  },

  // API 错误
  api: {
    unauthorized: {
      title: '未授权',
      description: '请检查您的 API Key 是否正确配置。',
      action: '检查配置',
    },
    rateLimited: {
      title: '请求过于频繁',
      description: 'API 请求频率超限，请稍后重试。',
      action: '稍后重试',
    },
    serverError: {
      title: '服务器错误',
      description: 'AI 服务暂时不可用，请稍后重试。',
      action: '重试',
    },
  },

  // 表单错误
  validation: {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的手机号码',
    url: '请输入有效的网址',
    minLength: (min: number) => `至少需要 ${min} 个字符`,
    maxLength: (max: number) => `最多 ${max} 个字符`,
  },
};
```

---

## 📋 实施清单

### Task 3.1: 加载状态优化

- [ ] 创建 LoadingSpinner 组件
- [ ] 创建 LoadingOverlay 组件
- [ ] 创建 Skeleton 组件
- [ ] 为主页面添加骨架屏
- [ ] 为列表页面添加骨架屏
- [ ] 优化加载动画样式

### Task 3.2: 表单验证与反馈

- [ ] 创建 useFormValidation hook
- [ ] 创建验证规则库
- [ ] 创建 FormField 组件
- [ ] 优化错误提示样式
- [ ] 添加成功操作 Toast 提示

### Task 3.3: 交互细节打磨

- [ ] 优化按钮交互效果
- [ ] 添加页面切换动画
- [ ] 添加列表项动画
- [ ] 添加键盘导航支持
- [ ] 优化触摸交互

### Task 4.1-4.3: 错误处理增强

- [ ] 创建统一错误类型
- [ ] 增强 IndexedDB 错误处理
- [ ] 增强 API 错误处理
- [ ] 增强导入导出错误处理
- [ ] 创建用户友好的错误消息
- [ ] 添加错误恢复方案

---

**文档版本**：1.0  
**最后更新**：2026-05-30  
**维护者**：项目团队
