#!/bin/bash

echo "🔧 在服务器上部署 AI Tools Manager (开发模式)..."

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose -p ai-tools-manager down 2>/dev/null || true

if [ "1" = "1" ]; then
    echo "🔧 启动开发模式 (支持热重载)..."
    echo "⚠️  注意: 开发模式会在首次启动时安装依赖，可能需要几分钟"
    
    # 开发模式启动
    docker-compose -p ai-tools-manager up -d
    
    echo ""
    echo "🎉 开发模式部署完成！"
    echo "🌐 访问地址: http://1.1.1.12:5178"
    echo ""
    echo "✨ 开发模式特性:"
    echo "  - ✅ 代码修改自动重载"
    echo "  - ✅ 无需重启容器"
    echo "  - ✅ 实时看到变化"
    echo ""
    echo "🔍 查看实时日志:"
    echo "docker-compose -p ai-tools-manager logs -f frontend-dev"
    
else
    echo "🏭 启动生产模式 (静态构建)..."
    
    # 生产模式构建和启动
    docker-compose -p ai-tools-manager up --build -d
    
    echo ""
    echo "🎉 生产模式部署完成！"
    echo "🌐 访问地址: http://1.1.1.12:5178"
    echo ""
    echo "✨ 生产模式特性:"
    echo "  - ✅ 优化的静态文件"
    echo "  - ✅ 更快的加载速度"
    echo "  - ✅ 更稳定的运行"
    echo ""
    echo "🔍 查看日志:"
    echo "docker-compose -p ai-tools-manager logs -f frontend"
fi

# 显示状态
echo ""
echo "📊 容器状态:"
docker-compose -p ai-tools-manager ps

echo ""
echo "🛠️  管理命令:"
echo "  查看日志: docker-compose -p ai-tools-manager logs -f"
echo "  重启服务: docker-compose -p ai-tools-manager restart"
echo "  停止服务: docker-compose -p ai-tools-manager down"
if [ "1" = "1" ]; then
    echo "  进入容器: docker exec -it ai-tools-dev bash"
fi
