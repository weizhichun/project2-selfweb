# 代码风格规范与最佳实践

## 📋 目录

- [概述](#概述)
- [TypeScript 规范](#typescript-规范)
- [React/Next.js 规范](#reactnextjs-规范)
- [样式与 CSS 规范](#样式与-css-规范)
- [命名规范](#命名规范)
- [文件组织规范](#文件组织规范)
- [Git 提交规范](#git-提交规范)
- [ESLint 检查](#eslint-检查)

---

## 概述

本文档定义了项目的代码风格规范和最佳实践，旨在确保代码库的一致性、可读性和可维护性。

### 为什么要遵循代码规范？

✅ **一致性**：团队成员可以轻松阅读和理解彼此的代码  
✅ **可维护性**：减少bug，降低维护成本  
✅ **代码质量**：自动化的代码检查，提高代码质量  
✅ **协作效率**：减少代码审查中的风格争论  

---

## TypeScript 规范

### 1. 类型定义

#### ✅ 推荐写法

```typescript
// 使用接口定义对象类型
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;  // 可选属性
}

// 使用类型别名定义联合类型
type Status = 'pending' | 'active' | 'inactive';

// 使用枚举定义常量集合
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}
```

#### ❌ 避免写法

```typescript
// 避免使用 any 类型
const data: any = fetchData();  // ❌

// 使用 unknown 并进行类型检查
const data: unknown = fetchData();
if (typeof data === 'string') {
  console.log(data.toUpperCase());
}  // ✅
```

### 2. 函数定义

#### ✅ 推荐写法

```typescript
// 使用箭头函数定义短函数
const add = (a: number, b: number): number => {
  return a + b;
};

// 明确定义返回类型
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json());
}

// 使用 async/await
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}
```

#### ❌ 避免写法

```typescript
// 避免没有返回类型的函数
function processData(data: any) {  // ❌
  // 处理逻辑
}

// 避免隐式返回
const getName = (user) => user.name;  // ❌
const getName = (user: User) => user.name;  // ✅
```

### 3. 导入导出

#### ✅ 推荐写法

```typescript
// 命名导出（推荐）
export const API_BASE_URL = 'https://api.example.com';
export function fetchData() { /* ... */ }

// 默认导出（仅在必要时使用）
export default function App() { /* ... */ }

// 类型导出
export type { User, UserRole };
```

#### ❌ 避免写法

```typescript
// 避免批量导入（除非是类型）
import * as utils from './utils';  // ❌
import { formatDate, formatCurrency } from './utils';  // ✅

// 避免循环依赖
// moduleA.ts -> moduleB.ts -> moduleA.ts  // ❌
```

### 4. 空值处理

#### ✅ 推荐写法

```typescript
// 使用可选链操作符
const userName = user?.profile?.name ?? 'Anonymous';

// 使用空值合并运算符
const displayName = user.name || 'Anonymous';  // ❌
const displayName = user.name ?? 'Anonymous';  // ✅

// 明确处理 null 和 undefined
function greet(name: string | null): string {
  if (name === null) {
    return 'Hello, guest!';
  }
  return `Hello, ${name}!`;
}
```

---

## React/Next.js 规范

### 1. 组件定义

#### ✅ 推荐写法

```typescript
// 使用函数组件（推荐）
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const baseClass = variant === 'primary' 
    ? 'bg-blue-500 text-white' 
    : 'bg-gray-200 text-gray-800';
  
  return (
    <button
      className={`px-4 py-2 rounded ${baseClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

#### ❌ 避免写法

```typescript
// 避免使用 class 组件
class Button extends React.Component {  // ❌
  render() {
    return <button>{this.props.children}</button>;
  }
}

// 避免内联函数定义
export function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>  // ❌
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// 优化：使用 useCallback 或提取函数
export function List({ items }) {
  const handleClick = useCallback((id: string) => {
    // 处理逻辑
  }, []);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}  // ✅
```

### 2. Hooks 使用

#### ✅ 推荐写法

```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId]);

  // 使用 useMemo 缓存计算结果
  const displayName = useMemo(() => {
    return profile?.name ?? 'Anonymous';
  }, [profile]);

  // 使用 useCallback 缓存函数
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const updated = await updateUserProfile(userId, updates);
    setProfile(updated);
  }, [userId]);

  return { profile, loading, error, displayName, updateProfile };
}
```

### 3. Next.js 特定规范

#### ✅ 推荐写法

```typescript
// App Router - Server Components
// app/page.tsx
export default async function HomePage() {
  const data = await fetchData();  // 服务端直接获取数据
  
  return <main>{/* ... */}</main>;
}

// 使用 Suspense 进行流式渲染
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DynamicComponent />
    </Suspense>
  );
}
```

#### ❌ 避免写法

```typescript
// 避免在 Server Components 中使用 useState
export default function Page() {
  const [count, setCount] = useState(0);  // ❌
  // Server Components 不能使用 hooks
  return <div>{count}</div>;
}
```

### 4. Props 类型定义

#### ✅ 推荐写法

```typescript
// 分离 Props 接口（推荐用于复杂组件）
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ModalFooterProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <h2>{title}</h2>
      <div className="modal-content">{children}</div>
    </div>
  );
}
```

---

## 样式与 CSS 规范

### 1. Tailwind CSS 使用

#### ✅ 推荐写法

```tsx
// 使用 Tailwind 类名
export function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}

// 使用条件类名
const buttonClass = clsx(
  'px-4 py-2 rounded font-medium transition-colors',
  {
    'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
    'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
  },
  disabled && 'opacity-50 cursor-not-allowed'
);
```

#### ❌ 避免写法

```tsx
// 避免内联样式（除非是动态值）
<div style={{ color: 'red', fontSize: '16px' }}>  // ❌
  Text
</div>

// 避免过多的 Tailwind 类名（考虑提取组件）
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  {/* 内容 */}
</div>  // ❌ 考虑提取为 Card 或 Container 组件
```

### 2. 响应式设计

#### ✅ 推荐写法

```tsx
// 使用 Tailwind 响应式前缀
<div className="
  w-full            // 移动端
  md:w-1/2         // 平板
  lg:w-1/3         // 桌面
">
  Content
</div>

// 条件样式
<div className={clsx(
  'p-4',
  'md:p-6',
  'lg:p-8'
)}>
  Content
</div>
```

---

## 命名规范

### 1. 文件命名

#### ✅ 推荐写法

```bash
# 组件文件：PascalCase
UserProfile.tsx
Button.tsx
ModalDialog.tsx

# Hooks 文件：camelCase，前缀 use
useAuth.ts
useUserData.ts
useLocalStorage.ts

# 工具函数：camelCase
formatDate.ts
validationUtils.ts
apiClient.ts

# 类型定义：PascalCase
types/
  User.ts
  ApiResponse.ts
  index.ts
```

#### ❌ 避免写法

```bash
# 避免 kebab-case
user-profile.tsx  # ❌
button-component.tsx  # ❌

# 避免混合大小写
UserProfilecomponent.tsx  # ❌
```

### 2. 变量和函数命名

#### ✅ 推荐写法

```typescript
// 变量：camelCase
const userName = 'John Doe';
const isLoading = false;
const hasPermission = true;

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// 函数：camelCase，动词前缀
function fetchUser() {}
function updateUserData() {}
function validateEmail() {}
function calculateTotal() {}

// 布尔值：is/has/should/can 前缀
const isActive = true;
const hasPermission = true;
const shouldUpdate = false;
const canEdit = true;

// React 组件：PascalCase
function UserProfile() {}
function ModalDialog() {}
```

#### ❌ 避免写法

```typescript
// 避免缩写
const usrNm = 'John';  // ❌
const usr = { name: 'John' };  // ❌

// 避免无意义的名称
const data = fetchData();  // ❌
const userData = fetchUserData();  // ✅

// 避免使用单个字母（循环变量除外）
const x = 10;  // ❌
for (let i = 0; i < 10; i++) {  // ✅ 循环变量允许
  // ...
}
```

### 3. 接口和类型命名

#### ✅ 推荐写法

```typescript
// 接口：PascalCase，前缀 I（可选）
interface User {
  id: string;
  name: string;
}

// 类型别名：PascalCase
type UserStatus = 'active' | 'inactive' | 'pending';
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// 枚举：PascalCase
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
```

---

## 文件组织规范

### 1. 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 页面组件
│   ├── layout.tsx         # 布局组件
│   ├── loading.tsx        # 加载状态
│   ├── error.tsx          # 错误边界
│   └── [id]/              # 动态路由
│       └── page.tsx
├── components/             # 可复用组件
│   ├── ui/                # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── features/           # 功能组件
│   │   ├── UserProfile/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserProfileHeader.tsx
│   │   │   └── index.ts
│   │   └── Dashboard/
├── hooks/                  # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── lib/                    # 工具库
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
├── types/                  # 类型定义
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
└── styles/                 # 全局样式
    └── globals.css
```

### 2. 导入顺序

```typescript
// 1. React 和 Next.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. 外部库
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';

// 3. 内部组件
import { Button } from '@/components/ui';
import { Modal } from '@/components/features/Modal';

// 4. Hooks
import { useAuth } from '@/hooks';

// 5. 工具函数
import { formatDate, validateEmail } from '@/lib/utils';

// 6. 类型定义
import type { User, UserProfile } from '@/types';

// 7. 样式
import './Component.module.css';
```

---

## Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

```
feat:     新功能
fix:      缺陷修复
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构（既不是新功能也不是修复）
perf:     性能优化
test:     测试相关
chore:    构建/工具相关
```

### 示例

```bash
# 功能提交
git commit -m "feat(auth): add password reset functionality"

# 修复提交
git commit -m "fix(profile): correct email validation regex"

# 文档提交
git commit -m "docs(readme): update installation instructions"

# 重构提交
git commit -m "refactor(hooks): extract common logic to useAuth hook"
```

---

## ESLint 检查

### 运行检查

```bash
# 检查所有文件
npm run lint

# 自动修复可自动修复的问题
npm run lint -- --fix

# 检查特定文件
npx eslint src/components/Button.tsx
```

### 配置说明

项目使用以下 ESLint 配置：

```json
{
  "extends": [
    "next/core-web-vitals",  // Next.js 核心 Web Vitals 规则
    "next/typescript"        // TypeScript 特定规则
  ]
}
```

### 常见规则

#### ✅ 已启用规则

1. **TypeScript 相关**
   - `@typescript-eslint/no-explicit-any`：禁止使用 `any`
   - `@typescript-eslint/no-unused-vars`：禁止未使用的变量
   - `@typescript-eslint/consistent-type-imports`：一致的类型导入

2. **React 相关**
   - `react/react-in-jsx-scope`：不强制在 JSX 中导入 React
   - `react-hooks/exhaustive-deps`：Hooks 依赖完整性检查

3. **Next.js 相关**
   - `@next/next/no-html-link-for-pages`：避免使用 `<a>` 标签导航

### 自定义规则

如需添加自定义规则，请编辑 `.eslintrc.json`：

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    // 添加自定义规则
    "no-console": "warn",  // 控制台警告
    "prefer-const": "error"  // 优先使用 const
  }
}
```

---

## 附录：常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 自动修复
npm run lint -- --fix

# TypeScript 类型检查
npx tsc --noEmit
```

---

## 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-05-30 | 1.0 | 初始版本 |

---

**文档版本**：1.0  
**最后更新**：2026-05-30  
**维护者**：项目团队
