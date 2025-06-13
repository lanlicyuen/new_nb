# 手动部署最新更新到服务器

## 📋 部署步骤

### 1. 复制部署包到服务器
```bash
# 将整个 deploy_package 文件夹上传到服务器
# 可以使用以下方法之一：

# 方法1: 使用scp (如果SSH可用)
scp -r deploy_package lanlic@1.1.1.12:/tmp/

# 方法2: 使用FTP/SFTP工具上传 deploy_package 文件夹
# 方法3: 压缩后上传
tar -czf deploy_package.tar.gz deploy_package
# 然后上传 deploy_package.tar.gz 到服务器并解压
```

### 2. 在服务器上执行部署
登录到服务器后运行：

```bash
# 进入部署目录
cd /tmp/deploy_package

# 给脚本执行权限
chmod +x remote_deploy.sh

# 执行部署
./remote_deploy.sh
```

### 3. 验证部署
部署完成后，访问 `http://1.1.1.12:8080` 应该能看到最新的界面更新。

## 🔧 如果遇到问题

### 检查容器状态
```bash
docker-compose -p 1plab-os ps
```

### 查看日志
```bash
docker-compose -p 1plab-os logs -f frontend
```

### 重新构建和启动
```bash
docker-compose -p 1plab-os down
docker-compose -p 1plab-os up --build -d
```

## 📁 部署包内容确认
当前部署包 `deploy_package/` 包含：
- ✅ 最新的 CyberMDApp.tsx (包含320px侧边栏等所有界面优化)
- ✅ 最新的 DataMigrationTool.tsx (完全重构的数据迁移工具)
- ✅ 所有界面优化的CSS样式
- ✅ Docker配置文件
- ✅ 自动部署脚本

## 🎯 期望结果
部署成功后，`http://1.1.1.12:8080` 应该显示与 `http://localhost:5180` 相同的界面：
- 320px宽的侧边导航栏
- Logo点击返回首页功能
- 优化的数据迁移工具界面
- 键盘快捷键支持 (Alt+1~4)
- 所有视觉增强效果
