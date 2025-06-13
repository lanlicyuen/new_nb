#!/bin/bash

echo "🔧 在服务器上部署 1PLAB_OS..."

# 停止现有容器
echo "停止现有容器..."
docker-compose -p 1plab-os down 2>/dev/null || true

# 构建和启动
echo "构建并启动应用..."
docker-compose -p 1plab-os up --build -d

# 显示状态
echo "📊 部署状态:"
docker-compose -p 1plab-os ps

echo "🎉 部署完成！"
echo "访问地址: http://1.1.1.12:8080"
echo ""
echo "🔍 查看日志命令:"
echo "docker-compose -p 1plab-os logs -f frontend"
