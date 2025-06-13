# 1PLAB OS - AI工具管理系统

<img src="https://img.shields.io/badge/Version-2.0-blue" alt="Version"> <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="Database"> <img src="https://img.shields.io/badge/Frontend-React-61DAFB" alt="Frontend"> <img src="https://img.shields.io/badge/Backend-Flask-000000" alt="Backend">

一个集成的赛博朋克风格AI工具和Markdown笔记管理系统，现已升级为PostgreSQL数据库版本！

## ✨ 特性

- 🤖 **AI工具管理** - 完整的CRUD操作，支持月费/年费/一次性费用
- 📝 **Markdown笔记管理** - 支持文件夹分类和标签系统
- 📊 **数据可视化** - 费用统计和图表展示
- 🔄 **数据迁移** - 从localStorage无缝迁移到PostgreSQL
- 🎨 **赛博朋克UI** - 现代化界面设计，支持深色主题
- 💾 **企业级数据持久化** - PostgreSQL数据库支持

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

## 🛠 技术栈

### 前端
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用工具优先的CSS框架
- **Framer Motion** - 动画库
- **D3.js** - 数据可视化
- **Vite** - 快速构建工具

### 后端
- **Flask** - 轻量级Python Web框架
- **SQLAlchemy** - Python SQL工具包和ORM
- **PostgreSQL** - 企业级关系型数据库
- **Flask-CORS** - 跨域资源共享支持

## 📁 项目结构

```
vs_web/
├── src/                      # 前端源码
│   ├── components/          # React组件
│   ├── services/           # API服务
│   └── types/              # TypeScript类型定义
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