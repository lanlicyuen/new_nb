#!/bin/bash

# 部署验证脚本
echo "🔍 验证1PLab OS部署状态"
echo "======================"

SERVER_URL="http://1.1.1.12:8080"

echo "📊 检查Docker容器状态..."
docker-compose -p 1plab-os ps

echo ""
echo "🌐 检查Web服务响应..."
if curl -s --max-time 10 "$SERVER_URL" > /dev/null; then
    echo "✅ Web服务响应正常"
    echo "🎯 访问地址: $SERVER_URL"
else
    echo "❌ Web服务无响应"
    echo "🔧 请检查容器状态和日志"
fi

echo ""
echo "📋 容器日志（最后10行）:"
docker-compose -p 1plab-os logs --tail=10 frontend

echo ""
echo "🔍 端口占用检查:"
netstat -tlnp | grep :8080 || ss -tlnp | grep :8080

echo ""
echo "📝 如果遇到问题，可以运行:"
echo "  docker-compose -p 1plab-os logs -f frontend  # 查看实时日志"
echo "  docker-compose -p 1plab-os restart           # 重启服务"
echo "  docker-compose -p 1plab-os down && docker-compose -p 1plab-os up -d  # 完全重启"
