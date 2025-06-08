#!/bin/bash

# 简化的密码部署脚本
echo "🚀 使用密码部署到 1.1.1.12..."

SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"
DEPLOY_DIR="deploy_package"

echo "📤 复制文件到服务器..."
scp -r $DEPLOY_DIR $SERVER_USER@$SERVER_IP:/tmp/

echo "🚀 在服务器上执行部署..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /tmp/deploy_package

echo "🔧 停止现有容器..."
docker-compose -p 1plab-os down 2>/dev/null || true

echo "🔨 清理并重新构建..."
docker system prune -f 2>/dev/null || true

echo "🚀 构建并启动应用..."
docker-compose -p 1plab-os up --build -d

echo "📊 部署状态:"
docker-compose -p 1plab-os ps

echo "🔍 容器日志:"
docker-compose -p 1plab-os logs frontend

echo "🎉 部署完成！"
echo "访问地址: http://1.1.1.12:8080"
ENDSSH

echo "✅ 部署脚本执行完成！"
