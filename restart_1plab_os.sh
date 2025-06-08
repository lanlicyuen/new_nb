#!/bin/bash

# 1PLAB_OS - 快速重启脚本
# 用于代码修改后快速重新部署

echo "🔄 1PLAB_OS 快速重启脚本"
echo "========================"

SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"  # 使用 lanlic 用户
PROJECT_NAME="1plab-os"

echo "🚀 准备重新部署 1PLAB_OS..."

# 创建部署目录
DEPLOY_DIR="deploy_package_$(date +%H%M%S)"
rm -rf deploy_package_* 2>/dev/null  # 清理旧的部署包
mkdir -p $DEPLOY_DIR

echo "📂 复制更新的文件..."
# 复制最新的源代码和配置文件
cp -r src $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/ 2>/dev/null || echo "package-lock.json 不存在，跳过"
cp vite.config.ts $DEPLOY_DIR/
cp tsconfig*.json $DEPLOY_DIR/
cp tailwind.config.js $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp index.html $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp nginx.conf $DEPLOY_DIR/

echo "✅ 文件复制完成"

# 创建远程重启脚本
cat > $DEPLOY_DIR/remote_restart.sh << 'EOF'
#!/bin/bash

echo "🔄 重启 1PLAB_OS 服务..."

# 停止现有容器
echo "🛑 停止现有服务..."
docker-compose -p 1plab-os down

# 清理旧镜像 (可选，加快重建速度)
echo "🧹 清理旧镜像..."
docker system prune -f

# 重新构建和启动
echo "🏗️ 重新构建并启动..."
docker-compose -p 1plab-os up --build -d

# 显示状态
echo ""
echo "📊 服务状态:"
docker-compose -p 1plab-os ps

echo ""
echo "🎉 1PLAB_OS 重启完成！"
echo "🌐 访问地址: http://1.1.1.12:8080"

# 显示最新日志
echo ""
echo "📋 最新日志 (按 Ctrl+C 退出):"
echo "================================"
docker-compose -p 1plab-os logs -f --tail=20
EOF

chmod +x $DEPLOY_DIR/remote_restart.sh

echo ""
echo "🔄 正在执行快速重启..."

# 检查SSH连接
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    echo "✅ SSH连接正常"
    
    # 复制文件到服务器
    echo "📤 上传最新代码..."
    scp -r $DEPLOY_DIR $SERVER_USER@$SERVER_IP:/tmp/
    
    # 在服务器上执行重启
    echo "🚀 执行重启..."
    ssh $SERVER_USER@$SERVER_IP "cd /tmp/$DEPLOY_DIR && chmod +x remote_restart.sh && ./remote_restart.sh"
    
    echo ""
    echo "🎉 1PLAB_OS 重启完成！"
    echo "🌐 应用访问地址: http://$SERVER_IP:8080"
    
else
    echo "❌ 无法连接到服务器 $SERVER_USER@$SERVER_IP"
    echo "请检查网络连接或手动部署"
    echo ""
    echo "📦 重启包已准备在: $DEPLOY_DIR/"
    echo "🔧 手动步骤:"
    echo "  1. 复制 $DEPLOY_DIR 到服务器"
    echo "  2. 运行: chmod +x remote_restart.sh && ./remote_restart.sh"
fi

# 清理本地临时文件
rm -rf $DEPLOY_DIR

echo ""
echo "🛠️  后续管理命令:"
echo "  查看状态: ssh $SERVER_USER@$SERVER_IP 'docker-compose -p 1plab-os ps'"
echo "  查看日志: ssh $SERVER_USER@$SERVER_IP 'docker-compose -p 1plab-os logs -f'"
echo "  停止服务: ssh $SERVER_USER@$SERVER_IP 'docker-compose -p 1plab-os down'"
