# 魏智纯个人知识管理与求职展示网站 - Product Requirement Document

## Overview
- **Summary**: 为魏智纯开发一个集跨学科知识管理、求职展示、AI辅助工具于一体的个人网站，所有数据本地存储，无后端依赖，部署简单。
- **Purpose**: 帮助用户沉淀跨计算机、机器学习、新闻传播学的知识，并打造差异化的个人品牌，助力2027暑期实习求职。
- **Target Users**: 
  - 用户本人（知识管理、AI辅助）
  - 求职过程中的HR、面试官（个人能力展示）

## Goals
- 打造美观专业的个人求职展示页面
- 构建易用的跨学科知识管理系统
- 集成AI辅助功能提升学习和求职效率
- 确保数据本地存储，隐私安全，部署简单

## Non-Goals (Out of Scope)
- 后端服务器开发
- 多用户协作功能
- 实时数据同步
- 复杂的用户权限管理

## Background & Context
- 用户为安徽师范大学皖江学院计算机科学与技术专业本科生，同时在学习机器学习和新闻传播学
- 有丰富的实习和项目经历，需要良好的方式进行展示
- 偏好无后端、全静态的解决方案，降低部署和维护成本

## Functional Requirements
- **FR-1**: 个人求职展示（首页、在线简历、项目展示墙）
- **FR-2**: 跨学科知识库（分类管理、笔记编辑、知识图谱）
- **FR-3**: AI增强工具（笔记助手、知识库问答、简历优化、面试模拟、大模型配置）
- **FR-4**: 数据导入导出与备份
- **FR-5**: 本地密码登录保护
- **FR-6**: 暗色/亮色主题切换
- **FR-7**: 响应式设计

## Non-Functional Requirements
- **NFR-1**: 首屏加载时间 &lt; 1s
- **NFR-2**: 所有数据本地存储（IndexedDB + localStorage）
- **NFR-3**: 兼容主流浏览器（Chrome、Firefox、Safari、Edge）
- **NFR-4**: 支持PDF导出功能
- **NFR-5**: 符合无障碍设计标准

## Constraints
- **Technical**: Next.js 14+、Tailwind CSS、ShadCN UI、TipTap、ECharts、IndexedDB
- **Business**: 2027暑期实习前完成，无后端依赖
- **Dependencies**: 无外部依赖（AI功能使用用户自配置的API）

## Assumptions
- 用户有基本的前端知识，能完成部署
- 用户有大模型API Key用于AI功能
- 数据完全存储在用户本地浏览器中

## Acceptance Criteria

### AC-1: 个人首页展示
- **Given**: 访问网站首页
- **When**: 访客或用户查看首页
- **Then**: 显示个人基本信息、核心技能标签、快速联系入口、能力雷达图
- **Verification**: `human-judgment`

### AC-2: 在线简历查看与编辑
- **Given**: 用户登录后进入简历页面
- **When**: 用户编辑简历内容
- **Then**: 编辑后的内容同步更新到在线展示和PDF下载
- **Verification**: `programmatic`

### AC-3: 笔记管理功能
- **Given**: 用户登录后
- **When**: 用户创建、编辑、删除笔记
- **Then**: 操作成功，数据保存在IndexedDB中
- **Verification**: `programmatic`

### AC-4: AI笔记助手
- **Given**: 用户已配置API Key
- **When**: 用户输入零散内容，请求AI整理
- **Then**: AI生成结构化笔记并可保存
- **Verification**: `human-judgment`

### AC-5: 数据导入导出
- **Given**: 用户有备份数据
- **When**: 用户执行导入/导出操作
- **Then**: 数据成功导出为JSON或导入恢复
- **Verification**: `programmatic`

### AC-6: 响应式设计
- **Given**: 用户使用不同设备访问
- **When**: 窗口大小变化
- **Then**: 页面布局自适应调整
- **Verification**: `human-judgment`

### AC-7: 本地密码登录
- **Given**: 用户已设置登录密码
- **When**: 访客访问需要权限的功能
- **Then**: 提示输入密码，验证通过后才能操作
- **Verification**: `programmatic`

## Open Questions
- [ ] 用户希望的具体AI模型优先级是什么？
- [ ] 是否需要添加更多自定义页面？
