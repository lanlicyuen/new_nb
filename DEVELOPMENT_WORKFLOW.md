# 🚀 AI Tools Manager 开发工作流指南

## 推荐开发模式：本地开发 + 自动同步

### 📋 日常开发流程：

#### 1. 本地开发环境启动
```bash
cd /Users/lanlic/Desktop/vs_web
npm run dev
```
- **本地访问**: http://localhost:5178
- **网络访问**: http://1.1.1.31:5178 (其他设备测试)

#### 2. 代码修改和测试
- 使用VS Code进行开发
- 本地实时热重载测试
- Git版本控制管理

#### 3. 部署到测试服务器
```bash
# 快速部署（推荐）
./auto_deploy.sh

# 或手动部署
./smart_deploy.sh production
```
- **测试服务器访问**: http://1.1.1.12:8080

#### 4. 验证和迭代
- 在测试服务器验证功能
- 收集反馈后回到本地继续开发

### 🛠️ 可用的部署工具：

1. **auto_deploy.sh** - 全自动部署（推荐）
   - 自动文件传输
   - 自动Docker构建
   - 自动容器重启

2. **smart_deploy.sh** - 智能部署
   - 多种模式选择
   - 详细的部署日志

3. **dev_sync.sh** - 开发同步
   - 实时文件同步
   - 适合频繁小改动

4. **restart_1plab_os.sh** - 快速重启
   - 仅重启容器
   - 不重新构建

### 🔄 实时同步选项（可选）：

如果需要更频繁的同步，可以设置文件监控：
```bash
# 监控文件变化并自动部署
./dev_sync.sh
```

### 📊 两种环境对比：

| 环境 | 地址 | 用途 | 优点 |
|------|------|------|------|
| 本地开发 | 1.1.1.31:5178 | 开发调试 | 快速、便利、热重载 |
| 测试服务器 | 1.1.1.12:8080 | 生产测试 | 真实环境、外部访问 |

### 🎯 推荐工作节奏：

1. **快速迭代**: 本地开发 → 本地测试
2. **阶段验证**: 部署到测试服务器 → 功能验证
3. **最终确认**: 测试服务器 → 用户体验测试

---

**当前状态**: ✅ 本地开发环境就绪，测试服务器部署成功
**推荐模式**: 本地开发为主，定期同步到测试服务器
