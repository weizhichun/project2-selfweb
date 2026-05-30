# Tasks

- [x] Task 1: 更新技能类型定义
  - [x] SubTask 1.1: 在 `src/types/index.ts` 中定义新的技能大类类型
  - [x] SubTask 1.2: 定义技能大类数据结构（包含标题、描述、技能标签列表）

- [x] Task 2: 更新技能初始化数据
  - [x] SubTask 2.1: 在 `src/data/profile.ts` 中替换原有的 skills 数组为新的分大类技能数据
  - [x] SubTask 2.2: 更新 radarSkills 和 radarValues 为新的5个维度数据
  - [x] SubTask 2.3: 添加技能大类描述信息（包含数据亮点）

- [x] Task 3: 更新首页技能展示
  - [x] SubTask 3.1: 修改技能标签墙组件，改为分大类展示
  - [x] SubTask 3.2: 每个大类显示标题和具体技能标签
  - [x] SubTask 3.3: 更新技能雷达图配置，使用新的维度和得分
  - [x] SubTask 3.4: 确保响应式布局正常

- [x] Task 4: 更新在线简历页面
  - [x] SubTask 4.1: 修改技能板块，改为分大类展示
  - [x] SubTask 4.2: 每个大类显示标题+技能描述+数据亮点
  - [x] SubTask 4.3: 确保PDF导出时技能部分排版正确

- [x] Task 5: 新增技能编辑功能
  - [x] SubTask 5.1: 在个人设置页面添加技能编辑模块
  - [x] SubTask 5.2: 支持添加、修改、删除技能大类
  - [x] SubTask 5.3: 支持在每个大类下添加、修改、删除具体技能
  - [x] SubTask 5.4: 修改后自动保存到IndexedDB
  - [x] SubTask 5.5: 修改后自动同步到所有相关页面

- [x] Task 6: 更新使用文档
  - [x] SubTask 6.1: 在 USER_GUIDE.md 中添加技能编辑功能使用说明
  - [x] SubTask 6.2: 说明技能数据的本地存储逻辑

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 5]
