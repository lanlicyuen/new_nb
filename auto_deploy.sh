#!/bin/bash

# 自动化部署脚本 - 使用sshpass
echo "🚀 自动部署 AI Tools Manager 到 1.1.1.12..."

SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"
SERVER_PASS="98605831aAqQ"
DEPLOY_DIR="deploy_package"

echo "📤 复制文件到服务器..."
sshpass -p "$SERVER_PASS" scp -o StrictHostKeyChecking=no -r $DEPLOY_DIR $SERVER_USER@$SERVER_IP:/tmp/

echo "🚀 在服务器上执行部署..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /tmp/deploy_package

echo "🔧 停止现有容器..."
docker-compose -p 1plab-os down 2>/dev/null || true

echo "🔨 清理旧镜像..."
docker images | grep 1plab-os | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

echo "🚀 构建并启动应用..."
docker-compose -p 1plab-os up --build -d

echo "⏳ 等待容器启动..."
sleep 10

echo "📊 部署状态:"
docker-compose -p 1plab-os ps

echo "🔍 容器日志:"
docker-compose -p 1plab-os logs frontend | tail -20

echo "🎉 部署完成！"
echo "访问地址: http://1.1.1.12:8080"
ENDSSH

echo "✅ 自动部署完成！"
echo "🌐 请访问: http://1.1.1.12:8080"
