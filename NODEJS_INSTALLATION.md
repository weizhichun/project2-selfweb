# Node.js 安装指南

本指南将帮助您在不同的操作系统上安装 Node.js，以便能够运行和开发本项目。

## 📋 目录

- [Windows 系统安装](#windows-系统安装)
- [macOS 系统安装](#macos-系统安装)
- [Linux 系统安装](#linux-系统安装)
- [验证安装](#验证安装)
- [常见问题](#常见问题)

---

## Windows 系统安装

### 方法一：使用安装包（推荐新手）

#### 步骤 1：下载安装包

1. 打开浏览器访问 Node.js 官网：https://nodejs.org/
2. 点击绿色的 **LTS（长期支持版）** 按钮下载
3. 安装包文件名类似：`node-v20.x.x-x64.msi`

#### 步骤 2：运行安装程序

1. 双击下载的 `.msi` 文件
2. 如果出现"用户账户控制"提示，点击 **是**
3. 在安装向导中，点击 **Next**
4. 阅读并同意许可协议，点击 **Next**
5. 选择安装路径（建议使用默认路径），点击 **Next**
6. 点击 **Next** 使用默认配置
7. 点击 **Install** 开始安装
8. 安装完成后，点击 **Finish**

#### 步骤 3：验证安装

打开 PowerShell 或命令提示符，输入：

```powershell
node -v
npm -v
```

如果显示版本号（如 `v20.10.0` 和 `10.2.4`），说明安装成功！

### 方法二：使用 Chocolatey（适合开发者）

如果您已经安装了 Chocolatey 包管理器，可以运行：

```powershell
choco install nodejs-lts
```

### 方法三：使用 nvm-windows（推荐高级用户）

nvm-windows 允许您同时安装多个 Node.js 版本，便于版本切换。

#### 步骤 1：下载 nvm-windows

从 https://github.com/coreybutler/nvm-windows/releases 下载最新版本的 `nvm-setup.exe`

#### 步骤 2：安装 nvm-windows

1. 双击 `nvm-setup.exe`
2. 选择安装路径（建议使用默认）
3. 选择 Node.js 符号链接的安装路径
4. 完成安装

#### 步骤 3：使用 nvm 安装 Node.js

打开 PowerShell 或命令提示符：

```powershell
# 安装最新 LTS 版本
nvm install lts

# 使用 LTS 版本
nvm use lts

# 验证
node -v
npm -v
```

---

## macOS 系统安装

### 方法一：使用安装包（推荐新手）

#### 步骤 1：下载安装包

1. 打开浏览器访问 Node.js 官网：https://nodejs.org/
2. 点击绿色的 **LTS（长期支持版）** 按钮下载
3. 安装包文件名类似：`node-v20.x.x.pkg`

#### 步骤 2：运行安装程序

1. 双击下载的 `.pkg` 文件
2. 在安装向导中，点击 **Continue**
3. 阅读并同意许可协议，点击 **Continue**
4. 选择安装位置，点击 **Install**
5. 输入您的管理员密码
6. 点击 **Close** 完成安装

#### 步骤 3：验证安装

打开终端（Terminal），输入：

```bash
node -v
npm -v
```

### 方法二：使用 Homebrew（推荐开发者）

如果您已经安装了 Homebrew 包管理器：

```bash
# 更新 Homebrew
brew update

# 安装 Node.js LTS 版本
brew install node

# 验证
node -v
npm -v
```

### 方法三：使用 nvm（推荐高级用户）

```bash
# 安装 nvm（如果没有）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell 配置
source ~/.zshrc  # 如果使用 zsh
# 或
source ~/.bash_profile  # 如果使用 bash

# 安装 Node.js LTS 版本
nvm install lts

# 使用 LTS 版本
nvm use lts

# 验证
node -v
npm -v
```

---

## Linux 系统安装

### Ubuntu / Debian

#### 方法一：使用 apt（推荐）

```bash
# 更新软件包列表
sudo apt update

# 安装 Node.js（会安装 npm）
sudo apt install nodejs npm

# 验证
node -v
npm -v
```

#### 方法二：使用 NodeSource（推荐安装特定版本）

```bash
# 安装 Node.js 20.x 版本
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v
npm -v
```

### CentOS / RHEL / Fedora

```bash
# 安装 Node.js 20.x 版本
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证
node -v
npm -v
```

### Arch Linux

```bash
# 使用 pacman 安装
sudo pacman -S nodejs npm

# 验证
node -v
npm -v
```

### 使用 nvm（各发行版通用）

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc

# 安装并使用 Node.js LTS
nvm install lts
nvm use lts

# 验证
node -v
npm -v
```

---

## 验证安装

无论使用哪种安装方法，都需要验证 Node.js 和 npm 是否正确安装。

### 基本验证

打开终端（Windows 上使用 PowerShell 或命令提示符），依次运行：

```bash
# 检查 Node.js 版本
node -v
# 应显示：v20.x.x 或更高版本

# 检查 npm 版本
npm -v
# 应显示：10.x.x 或更高版本

# 检查 Node.js 和 npm 是否可用
node -e "console.log('Node.js works!')"
# 应输出：Node.js works!
```

### 高级验证

```bash
# 检查 Node.js 可执行文件位置
which node  # macOS / Linux
where node  # Windows

# 检查 npm 配置
npm config list

# 检查 npm 的全局目录
npm root -g
```

---

## 常见问题

### ❓ Q1: 安装后提示"npm 不是内部或外部命令"

**原因**：PATH 环境变量没有正确配置

**解决方法**：

**Windows**：
1. 右键点击"此电脑"，选择"属性"
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"系统变量"中找到 `Path`，双击编辑
5. 确保包含以下路径（如果没有就添加）：
   - `C:\Program Files\nodejs\`
   - `%APPDATA%\npm`
6. 点击"确定"保存
7. **重新打开** PowerShell 或命令提示符

**macOS / Linux**：
1. 打开终端
2. 编辑 `~/.bash_profile` 或 `~/.zshrc`：
   ```bash
   export PATH="/usr/local/bin:$PATH"
   ```
3. 保存文件并运行：
   ```bash
   source ~/.bash_profile  # 或 source ~/.zshrc
   ```

---

### ❓ Q2: npm install 报错 "EACCES: permission denied"

**原因**：没有足够的权限写入全局目录

**解决方法**：

**方案一：修复 npm 全局目录权限**

```bash
# 创建全局目录
mkdir ~/.npm-global

# 配置 npm 使用这个目录
npm config set prefix '~/.npm-global'

# 添加到 PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**方案二：使用 sudo（不推荐）**

```bash
sudo npm install -g package-name
```

---

### ❓ Q3: 安装失败或安装后无法运行

**解决方法**：

1. **卸载 Node.js**：
   - **Windows**：在"控制面板" → "程序和功能"中卸载
   - **macOS**：运行 `sudo rm -rf /usr/local/lib/node_modules`
   - **Linux**：运行 `sudo apt remove nodejs npm`

2. **清理残留文件**：
   ```bash
   # macOS / Linux
   sudo rm -rf ~/.npm
   sudo rm -rf ~/.node-gyp
   
   # Windows PowerShell
   rmdir -Recurse -Force $env:APPDATA\npm
   ```

3. **重新安装**：按照上面的安装步骤重新安装

---

### ❓ Q4: 需要不同版本的 Node.js

**解决方法**：使用 nvm（Node Version Manager）

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc  # 或 ~/.zshrc

# 安装多个版本
nvm install 18   # 安装 Node.js 18
nvm install 20   # 安装 Node.js 20
nvm install 22   # 安装 Node.js 22

# 切换版本
nvm use 18        # 使用 Node.js 18
nvm use 20        # 使用 Node.js 20

# 设置默认版本
nvm alias default 20
```

---

### ❓ Q5: npm 太慢了

**解决方法**：使用国内镜像

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
# 应显示：https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
```

---

### ❓ Q6: Windows 上长时间按安装无响应

**解决方法**：

1. 结束安装进程
2. 使用 PowerShell 以管理员身份运行：
   ```powershell
   # 清理缓存
   Remove-Item "$env:TEMP\npm-*" -Recurse -ErrorAction SilentlyContinue
   
   # 清除 npm 缓存
   npm cache clean --force
   
   # 重新安装
   choco install nodejs-lts -y
   ```

---

## 📚 相关资源

- [Node.js 官网](https://nodejs.org/)
- [npm 官网](https://www.npmjs.com/)
- [nvm-windows GitHub](https://github.com/coreybutler/nvm-windows)
- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [Node.js 中文文档](https://nodejs.cn/)

---

## ✅ 接下来

安装完成后，您可以：

1. [启动开发服务器](../README.md#快速开始)
2. [查看项目结构](../README.md#项目结构)
3. [阅读使用手册](../USER_GUIDE.md)

如果您在安装过程中遇到任何问题，请参考本指南的常见问题部分，或在项目 Issues 中提问。

**祝您安装顺利！🎉**
