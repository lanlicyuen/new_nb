#!/bin/bash

# 简单的构建和部署脚本
# 用于快速部署到测试服务器

echo "🔨 构建应用..."

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建生产版本
echo "🏗️ 构建生产版本..."
npm run build

echo "✅ 构建完成！"
echo ""
echo "📋 部署选项："
echo "1. 本地预览构建结果: npm run preview"
echo "2. 复制 dist/ 文件夹到测试服务器的 web 目录"
echo "3. 使用 Docker 部署: ./deploy_to_server.sh"
echo ""
echo "🌐 如果直接复制到服务器，确保:"
echo "  - 服务器有 HTTP 服务器 (nginx/apache)"
echo "  - 将 dist/ 内容复制到 web 根目录"
echo "  - 配置服务器在 http://1.1.1.12:8080 提供服务"
