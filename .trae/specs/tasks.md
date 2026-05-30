# 魏智纯个人知识管理与求职展示网站 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 初始化Next.js 14项目与基础配置
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 使用Next.js 14+创建项目
  - 配置Tailwind CSS和ShadCN UI组件库
  - 初始化项目目录结构
  - 配置必要的依赖库（TipTap、ECharts、jsPDF、html2canvas等）
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `programmatic` TR-1.1: npm install成功，无依赖冲突
  - `programmatic` TR-1.2: npm run dev能正常启动开发服务器
  - `human-judgement` TR-1.3: 项目目录结构清晰合理
- **Notes**: 确保Next.js配置支持静态导出

## [ ] Task 2: 实现个人首页展示模块
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建首页组件，展示个人基本信息
  - 实现核心技能标签墙
  - 添加快速联系入口（一键复制电话/邮箱、一键发邮件）
  - 使用ECharts实现能力雷达图
  - 内置用户初始化数据
- **Acceptance Criteria Addressed**: [AC-1, AC-6]
- **Test Requirements**:
  - `programmatic` TR-2.1: 页面加载不超过1s
  - `human-judgement` TR-2.2: 视觉效果美观专业
  - `human-judgement` TR-2.3: 响应式布局在不同设备上正常显示
- **Notes**: 使用用户提供的初始化数据

## [ ] Task 3: 实现在线简历与PDF导出功能
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 创建简历页面，分教育背景、实习经历、项目经历、核心技能四个板块
  - 突出数据亮点（如120+测试用例、90%续课率）
  - 实现简历编辑功能，编辑后自动同步
  - 使用jsPDF + html2canvas实现PDF导出
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-3.1: PDF导出功能正常，格式美观
  - `programmatic` TR-3.2: 编辑功能能正确保存到IndexedDB
  - `human-judgement` TR-3.3: 简历展示清晰，重点突出
- **Notes**: PDF导出要符合求职简历标准规范

## [ ] Task 4: 实现项目展示墙模块
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建项目卡片列表页面
  - 实现项目详情页，支持富文本内容
  - 添加项目增删改功能
  - 支持项目公开/私密状态标记
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-4.1: 项目CRUD操作正常
  - `human-judgement` TR-4.2: 卡片hover动画流畅
  - `programmatic` TR-4.3: 公开/私密状态控制正常
- **Notes**: 内置用户的2个初始项目

## [ ] Task 5: 实现知识库分类与笔记管理
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建三个默认分类：计算机本科知识、机器学习知识、新闻传播学知识
  - 实现分类的增删改
  - 使用TipTap实现富文本笔记编辑
  - 实现笔记的增删改查
  - 实现标签系统和学习状态标记
  - 实现全局搜索功能
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-5.1: 分类和笔记的CRUD操作正常
  - `human-judgement` TR-5.2: TipTap编辑器功能完整易用
  - `programmatic` TR-5.3: 搜索功能能正确找到笔记
- **Notes**: 使用IndexedDB存储所有笔记数据

## [ ] Task 6: 实现知识图谱可视化
- **Priority**: P1
- **Depends On**: Task 5
- **Description**: 
  - 实现笔记关联关系管理
  - 使用ECharts实现可视化知识图谱
  - 支持节点点击跳转、缩放、拖拽交互
  - 支持图谱公开/私密控制
- **Acceptance Criteria Addressed**: [AC-1, AC-3]
- **Test Requirements**:
  - `programmatic` TR-6.1: 图谱能正确渲染关联关系
  - `human-judgement` TR-6.2: 交互流畅，视觉效果良好
- **Notes**: 不同颜色标记不同分类的节点

## [ ] Task 7: 实现数据导入导出与备份
- **Priority**: P0
- **Depends On**: Task 5
- **Description**: 
  - 实现全量数据导出为JSON
  - 实现JSON数据导入恢复
  - 实现单篇笔记导出为Markdown/PDF
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-7.1: 导出的JSON数据完整可导入
  - `programmatic` TR-7.2: Markdown/PDF导出功能正常
- **Notes**: 确保导入时不覆盖现有数据（或提示）

## [ ] Task 8: 实现AI增强工具集
- **Priority**: P0
- **Depends On**: Task 1, Task 5
- **Description**: 
  - 实现大模型API配置页面（兼容OpenAI、通义千问、文心一言等）
  - 实现AI笔记助手功能
  - 实现知识库问答功能
  - 实现简历优化助手功能
  - 实现面试模拟助手功能
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-8.1: API配置能正确保存和读取
  - `human-judgement` TR-8.2: AI功能交互友好
  - `programmatic` TR-8.3: 请求使用用户配置的API Key，数据不上传第三方
- **Notes**: 所有AI功能使用用户自配置的API

## [ ] Task 9: 实现本地密码登录保护
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 实现密码设置和修改功能
  - 实现登录验证
  - 控制页面可见性（公开内容访客可见，私密内容需登录）
- **Acceptance Criteria Addressed**: [AC-7]
- **Test Requirements**:
  - `programmatic` TR-9.1: 密码哈希存储，验证正确
  - `programmatic` TR-9.2: 访问控制正确执行
- **Notes**: 使用bcrypt或类似库进行密码哈希

## [ ] Task 10: 实现暗色/亮色主题切换与响应式
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 实现主题切换功能
  - 完善响应式设计，适配桌面、平板、手机
  - 优化加载性能
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `programmatic` TR-10.1: 主题切换流畅，状态保持
  - `human-judgement` TR-10.2: 响应式布局在各设备上美观
  - `programmatic` TR-10.3: 首屏加载时间&lt;1s
- **Notes**: 使用CSS变量和Tailwind暗色模式

## [ ] Task 11: SEO优化与基础功能完善
- **Priority**: P1
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 添加标准meta标签
  - 创建站点地图
  - 实现导航栏和页面路由
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `programmatic` TR-11.1: meta标签正确设置
  - `human-judgement` TR-11.2: 导航流畅易用
- **Notes**: 确保SEO友好

## [ ] Task 12: 编写文档与测试
- **Priority**: P1
- **Depends On**: 所有其他任务
- **Description**: 
  - 编写部署文档（GitHub Pages、Vercel等）
  - 编写用户使用手册
  - 创建.env.example文件
  - 测试所有功能，修复bug
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7]
- **Test Requirements**:
  - `human-judgement` TR-12.1: 文档清晰易懂，步骤详细
  - `programmatic` TR-12.2: 所有功能正常运行，无严重bug
- **Notes**: 文档应适合非技术背景用户
