#!/bin/bash

# 服务器端部署脚本
echo "🔧 开始在服务器上部署..."

# 停止现有容器
echo "⏹️ 停止现有容器..."
docker-compose -p 1plab-os down 2>/dev/null || true

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker images | grep 1plab-os | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# 构建并启动
echo "🚀 构建并启动应用..."
docker-compose -p 1plab-os up --build -d

# 等待启动
echo "⏳ 等待容器启动..."
sleep 15

# 检查状态
echo "📊 部署状态:"
docker-compose -p 1plab-os ps

echo "🔍 容器日志:"
docker-compose -p 1plab-os logs frontend | tail -20

echo "🎉 部署完成！访问地址: http://1.1.1.12:8080"
