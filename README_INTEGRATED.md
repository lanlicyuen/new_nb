# 集成版赛博朋克管理系统 🤖✨

一个融合AI工具管理和Markdown文档管理功能的赛博朋克风格系统。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)

## 🚀 功能特色

### 核心功能
- 📝 **AI工具管理** - 添加、编辑、删除AI工具
- 📄 **MD文档管理** - 上传、浏览、编辑MD文档
- 💰 **费用追踪** - 自动计算年度总费用
- 📊 **统计面板** - 实时显示工具数量和费用统计
- ⏰ **到期提醒** - 智能计算工具到期日期
- 🔐 **用户认证** - 安全的登录系统
- 💾 **数据库存储** - 使用PostgreSQL持久化数据

### 设计特色
- 🎨 **赛博朋克风格** - 深色主题配霓虹色彩
- ✨ **玻璃质感** - 现代化玻璃态设计
- 🌟 **流畅动画** - 丰富的微交互效果
- 📱 **响应式设计** - 完美适配各种设备

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: 自定义CSS + 工具类
- **图标库**: Lucide React
- **动画**: CSS Transitions + Transform

### 后端
- **框架**: Flask (Python)
- **数据库**: PostgreSQL
- **身份验证**: Flask-Login
- **模板引擎**: Jinja2
- **ORM**: SQLAlchemy

### 部署
- **容器化**: Docker + Docker Compose
- **Web服务器**: Nginx
- **WSGI服务器**: Gunicorn

## 🔧 整合架构

本项目将两个独立的应用程序整合在一起：
1. **AI工具管理器**（赛博朋克风格的AI订阅追踪系统）
2. **MD文档管理系统**（基于Flask的Markdown文档管理系统）

整合方案采用：
- **统一前端**：使用React作为前端框架
- **统一认证**：共享MD Note的用户认证系统
- **统一存储**：共享PostgreSQL数据库
- **统一部署**：使用Docker Compose编排服务

## 🚀 部署指南

### 前提条件
- 已安装Docker和Docker Compose
- 已运行的md_note容器
- PostgreSQL数据库

### 步骤1：准备后端
```bash
# 在服务器上运行整合脚本
chmod +x integrate_md_note.sh
./integrate_md_note.sh
```

### 步骤2：构建和运行
```bash
# 构建并启动容器
docker compose up -d --build
```

### 步骤3：访问应用
打开浏览器访问 `http://服务器IP:8080`

## 🖥️ 开发指南

### 本地开发环境设置
```bash
# 克隆代码库
git clone <仓库URL>
cd <项目目录>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### API端点
- `/api/auth/login` - 用户登录
- `/api/auth/logout` - 用户登出
- `/api/tools` - AI工具管理
- `/api/documents` - 文档管理

## 📝 使用说明

1. **登录系统**：使用现有MD Note系统的用户凭据
2. **AI工具管理**：
   - 点击右下角的"+"按钮添加新工具
   - 填写名称、购买日期、费用类型等信息
   - 查看工具列表和到期提醒
3. **文档管理**：
   - 上传、查看和编辑Markdown文档
   - 支持版本历史和回滚

## 🔗 相关资源

- [MD Note项目文档](https://github.com/your-username/md-note)
- [AI工具管理器文档](https://github.com/your-username/ai-tools-manager)

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。
