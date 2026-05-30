# 知识库页面修复说明

## 问题描述
用户访问知识库页面时出现错误：`net::ERR_ABORTED http://localhost:3000/knowledge?_rsc=rxx9e`

## 根本原因
缺失关键文件 `src/hooks/use-knowledge.tsx`，导致知识库页面无法加载。

## 解决方案
已创建完整的 `use-knowledge.tsx` hook文件，提供以下功能：
- 知识库状态管理（categories, notes, tags, relations）
- CRUD操作方法（添加、更新、删除分类/笔记/标签/关系）
- 数据导入导出功能
- 笔记搜索功能

## 当前状态
开发服务器已在端口 3001 上启动（端口 3000 被占用）。

## 如何测试

### 方法一：浏览器直接访问
在浏览器中打开以下URL：
- http://localhost:3001/knowledge

### 方法二：等待自动刷新
如果您正在浏览器中查看网站，Next.js的热重载会自动更新页面。

## 注意事项
- 知识库页面首次加载时需要初始化数据库，请耐心等待
- 如果页面仍然无法加载，请尝试清除浏览器缓存后重试
- 所有数据都存储在浏览器的IndexedDB中，不会影响其他网站

## 技术栈
- React 19 + Next.js 15
- IndexedDB 本地存储
- TipTap 富文本编辑器
- ECharts 知识图谱
- jsPDF + html2canvas 导出功能

## 文件清单
已创建/更新的文件：
- ✅ `src/hooks/use-knowledge.tsx` - 核心hook
- ✅ `src/types/knowledge.ts` - 类型定义（已存在）
- ✅ `src/components/knowledge/*` - UI组件（已存在）
- ✅ `src/lib/db.ts` - 数据库操作（已存在）

## 联系方式
如有问题，请检查控制台错误信息。
