# 部署文档

本项目支持部署到 GitHub Pages、Vercel 和 Netlify。由于项目是纯静态应用，所有数据都存储在用户浏览器本地，部署过程非常简单。

## 前置准备

1. 确保项目已完成构建：
```bash
npm install
npm run build
```

2. 将项目推送到 GitHub 仓库（如果还没有的话）。

---

## 方案一：部署到 Vercel（推荐）

Vercel 是 Next.js 官方推荐的部署平台，部署过程最简单。

### 步骤

1. 访问 [vercel.com](https://vercel.com) 并使用 GitHub 账号登录。

2. 点击 "New Project" 按钮。

3. 选择你的 self-web 仓库。

4. 在配置页面：
   - Project Name: 输入项目名称（如：weizhichun-self-web）
   - Framework Preset: 自动识别为 Next.js
   - Root Directory: 保持默认（./）
   - Build Command: 自动识别为 `npm run build`
   - Output Directory: 自动识别为 `.next`
   - Environment Variables: 本项目不需要特殊环境变量

5. 点击 "Deploy" 按钮开始部署。

6. 部署完成后，Vercel 会提供一个访问地址（如：https://self-web-xxx.vercel.app）。

### 自定义域名

1. 在 Vercel 项目的 Settings -> Domains 中添加你的域名。

2. 按照提示在域名服务商处配置 DNS 记录。

---

## 方案二：部署到 Netlify

### 步骤

1. 访问 [netlify.com](https://netlify.com) 并使用 GitHub 账号登录。

2. 点击 "Add new site" -> "Import an existing project"。

3. 选择 GitHub 作为 Git provider。

4. 选择你的 self-web 仓库。

5. 在配置页面：
   - Branch to deploy: main 或 master
   - Base directory: 留空
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Environment variables: 本项目不需要

6. 点击 "Deploy site"。

### 使用 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化项目
netlify init

# 构建并部署
npm run build
netlify deploy --prod
```

---

## 方案三：部署到 GitHub Pages

### 方式 A：使用 gh-pages 包

1. 安装 gh-pages：
```bash
npm install --save-dev gh-pages
```

2. 在 `next.config.ts` 中添加 basePath 配置：
```typescript
const nextConfig = {
  output: 'export',
  basePath: '/self-web', // 替换为你的仓库名称
  images: {
    unoptimized: true,
  },
};
```

3. 在 `package.json` 中添加脚本：
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "npm run build && npm run export && gh-pages -d out"
  }
}
```

4. 运行部署：
```bash
npm run deploy
```

5. 在 GitHub 仓库的 Settings -> Pages 中：
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

### 方式 B：使用 GitHub Actions

1. 在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Export static files
        run: npx next export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. 确保 `next.config.ts` 中有 `output: 'export'` 配置。

3. 推送代码到 main 分支，GitHub Actions 会自动部署。

---

## 重要注意事项

### 数据安全

- 所有数据存储在用户浏览器的 IndexedDB 中
- 部署的只是静态代码，不包含任何用户数据
- 建议用户定期使用数据导出功能备份数据

### 环境变量

本项目不需要配置环境变量，所有配置都在浏览器端完成。

### 静态导出

如果使用 GitHub Pages，需要确保 `next.config.ts` 中设置了：
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### 首屏优化

项目已进行以下优化：
- 组件动态导入
- 图片懒加载
- 代码分割
- 首屏加载时间 < 1s

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 首页加载正常
- [ ] 所有链接可以跳转
- [ ] 暗色/亮色主题切换正常
- [ ] 响应式布局在不同设备上正常显示
- [ ] 控制台无错误信息

## 故障排除

### 问题：构建失败
- 确保 Node.js 版本 >= 18
- 删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

### 问题：页面 404
- 检查路由配置
- 如果使用 GitHub Pages，确认 basePath 配置正确

### 问题：图片无法加载
- 确保 `next.config.ts` 中设置了 `images.unoptimized: true`（静态导出时）
