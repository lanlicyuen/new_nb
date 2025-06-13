# 1PLAB OS - Next Generation AI Tools Management Platform

<img src="https://img.shields.io/badge/Version-2.0.0-blue" alt="Version"> <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="Database"> <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB" alt="Frontend"> <img src="https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC" alt="UI"> <img src="https://img.shields.io/badge/Deploy-Docker-2496ED" alt="Deploy">

🚀 **全新v2.0.0版本** - 一个完全重构的赛博朋克风格AI工具管理平台，带来革命性的用户界面和体验！

## 🌟 v2.0.0 重大更新

### 🎨 全新界面设计
- **320px宽侧边导航** - 清晰的功能分组和视觉层次
- **Logo点击导航** - 直观的返回首页功能
- **键盘快捷键** - Alt+1~4快速切换功能模块
- **赛博朋克视觉** - 统一的未来科技美学

### 🛠️ 重构的核心功能
- **数据迁移工具** - 完全重写，提供详细的功能说明和安全保障
- **智能工作流** - 优化的用户操作路径和状态管理
- **动画系统** - Framer Motion驱动的流畅交互效果

## ✨ 核心特性

- 🤖 **AI工具管理** - 完整的CRUD操作，支持多种计费模式
- 📝 **Markdown笔记** - 文件夹分类和标签系统
- 💡 **闪灵模块** - 快速想法捕获和整理
- 📊 **数据可视化** - 费用统计和交互式图表
- 🔄 **数据迁移** - 安全的PostgreSQL迁移工具
- 🎨 **现代UI/UX** - 玻璃形态效果和动态渐变
- 💾 **企业级存储** - PostgreSQL数据库支持

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.8+
- PostgreSQL 15+
- Homebrew (macOS)

### 一键启动

```bash
# 克隆项目
git clone <repository-url>
cd vs_web

# 安装依赖
npm install
pip install -r backend/requirements.txt

# 一键启动（自动启动数据库、后端、前端）
./start_1plab_os.sh
```

### 手动启动

1. **启动PostgreSQL**
   ```bash
   brew services start postgresql@15
   ```

2. **启动后端API**
   ```bash
   cd backend
   python -c "from app import app; app.run(debug=True, port=5001)"
   ```

3. **启动前端**
   ```bash
   npm run dev
   ```

### 访问应用

- 🎨 **前端界面:** http://localhost:5180
- 🔧 **后端API:** http://localhost:5001
- 📊 **数据库:** PostgreSQL (localhost:5432)

## 🛠 技术架构

### 🎨 前端技术栈
- **React 18** - 现代化Hooks和函数组件
- **TypeScript** - 严格类型检查和智能提示
- **Tailwind CSS** - 实用工具优先的样式系统
- **Framer Motion** - 专业级动画和交互效果
- **Lucide React** - 一致性图标库
- **Vite** - 极速开发构建工具

### 🔧 后端技术栈
- **Flask** - 轻量级Python Web框架
- **SQLAlchemy** - 强大的Python ORM
- **PostgreSQL 15+** - 企业级关系型数据库
- **Flask-CORS** - 跨域资源共享支持

### 🚀 部署技术
- **Docker** - 容器化部署方案
- **Nginx** - 高性能Web服务器
- **Docker Compose** - 多容器编排工具

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄──►│   Flask API     │◄──►│  PostgreSQL DB  │
│   (Port 5180)   │    │   (Port 5001)   │    │   (Port 5432)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
    ┌──────────┐            ┌──────────┐            ┌──────────┐
    │ Tailwind │            │   ORM    │            │  Tables  │
    │   +      │            │SQLAlchemy│            │ai_tools  │
    │ Framer   │            │          │            │md_notes  │
    │ Motion   │            │          │            │   ...    │
    └──────────┘            └──────────┘            └──────────┘
```

## 📁 项目结构

```
1PLab_OS/
├── 🎨 前端 (React + TypeScript)
│   ├── src/
│   │   ├── components/          # 核心组件
│   │   │   ├── AIToolsManager*  # AI工具管理模块
│   │   │   ├── DataMigration*   # 数据迁移工具
│   │   │   ├── MDNoteManager*   # Markdown笔记管理
│   │   │   └── InspirationCapture* # 闪灵想法捕获
│   │   ├── services/            # API服务层
│   │   ├── types/               # TypeScript类型定义
│   │   └── utils/               # 工具函数
│   └── public/                  # 静态资源
├── 🔧 后端 (Flask + PostgreSQL)
│   ├── backend/
│   │   ├── app.py              # Flask应用主文件
│   │   └── requirements.txt    # Python依赖
│   └── init-db.sql             # 数据库初始化脚本
├── 🚀 部署配置
│   ├── docker-compose.yml      # 容器编排配置
│   ├── Dockerfile              # 容器构建文件
│   ├── nginx.conf              # Web服务器配置
│   └── deploy_package/         # 生产部署包
└── 📋 文档
    ├── README.md               # 项目说明
    ├── SERVER_UPDATE_GUIDE.md  # 服务器更新指南
    └── manual_deploy_*.md      # 部署文档
├── backend/                 # 后端源码
│   ├── app.py              # Flask应用主文件
│   └── requirements.txt    # Python依赖
├── init-db.sql             # 数据库初始化脚本
├── start_1plab_os.sh       # 一键启动脚本
└── docker-compose.postgresql.yml  # Docker配置
```

## 🔧 API端点

### AI工具管理
- `GET /api/ai-tools` - 获取所有AI工具
- `POST /api/ai-tools` - 创建新AI工具
- `PUT /api/ai-tools/:id` - 更新AI工具
- `DELETE /api/ai-tools/:id` - 删除AI工具

### MD笔记管理
- `GET /api/md-notes` - 获取所有笔记
- `POST /api/md-notes` - 创建新笔记
- `PUT /api/md-notes/:id` - 更新笔记
- `DELETE /api/md-notes/:id` - 删除笔记

### 系统功能
- `GET /api/health` - 健康检查
- `GET /api/stats` - 获取统计信息
- `POST /api/migrate-data` - 数据迁移

## 📊 数据迁移

从localStorage迁移到PostgreSQL：

1. 打开应用并进入"数据迁移工具"
2. 点击"从localStorage迁移数据"
3. 系统会自动将现有数据迁移到PostgreSQL

或使用API：
```bash
curl -X POST http://localhost:5001/api/migrate-data \
  -H "Content-Type: application/json" \
  -d '{"ai_tools": [...], "md_notes": [...]}'
```

## 🐳 Docker部署

```bash
# 使用Docker Compose启动完整环境
docker-compose -f docker-compose.postgresql.yml up -d
```

## 🧪 测试

```bash
# 健康检查
curl http://localhost:5001/api/health

# 获取统计信息
curl http://localhost:5001/api/stats

# 测试AI工具API
curl http://localhost:5001/api/ai-tools
```

## 📈 版本历史

### v2.0 (2025-06-09)
- ✅ 升级到PostgreSQL数据库
- ✅ 完整的后端API实现
- ✅ 数据迁移功能
- ✅ TypeScript类型系统完善
- ✅ 企业级数据持久化

### v1.0
- 基于localStorage的本地存储版本
- 基础的AI工具和笔记管理功能

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关文档

- [PostgreSQL迁移成功报告](./POSTGRESQL_MIGRATION_SUCCESS.md)
- [开发工作流程](./DEVELOPMENT_WORKFLOW.md)
- [部署指南](./DEPLOYMENT_SUCCESS_REPORT.md)

---

**🎉 现在就开始体验企业级的1PLAB OS吧！**