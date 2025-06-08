#!/bin/bash

# AI Tools Manager - 部署到测试服务器脚本
# 这个脚本会将应用部署到测试服务器，让其他设备可以独立访问

echo "🚀 AI Tools Manager 部署脚本"
echo "================================"

# 配置变量
SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"  # 使用 lanlic 用户
PROJECT_NAME="1PLAB_OS"
DEPLOY_PORT="8080"

echo "📦 准备部署包..."

# 创建部署目录
DEPLOY_DIR="deploy_package"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 复制必要文件
cp -r src $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/ 2>/dev/null || echo "package-lock.json 不存在，跳过"
cp vite.config.ts $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp tsconfig.app.json $DEPLOY_DIR/
cp tsconfig.node.json $DEPLOY_DIR/
cp tailwind.config.js $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp index.html $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp nginx.conf $DEPLOY_DIR/

echo "✅ 部署包准备完成"

# 创建远程部署脚本
cat > $DEPLOY_DIR/remote_deploy.sh << 'EOF'
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
EOF

chmod +x $DEPLOY_DIR/remote_deploy.sh

echo "📋 部署选项:"
echo "1. 自动部署到服务器 (需要SSH访问)"
echo "2. 手动部署 (复制文件到服务器)"
echo ""

read -p "选择部署方式 (1/2): " choice

case $choice in
    1)
        echo "🔄 正在自动部署到服务器..."
        
        # 检查SSH连接
        if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
            echo "✅ SSH连接正常"
            
            # 复制文件到服务器
            echo "📤 复制文件到服务器..."
            scp -r $DEPLOY_DIR $SERVER_USER@$SERVER_IP:/tmp/
            
            # 在服务器上执行部署
            echo "🚀 在服务器上执行部署..."
            ssh $SERVER_USER@$SERVER_IP "cd /tmp/$DEPLOY_DIR && chmod +x remote_deploy.sh && ./remote_deploy.sh"
            
            echo ""
            echo "🎉 自动部署完成！"
            echo "🌐 应用访问地址: http://$SERVER_IP:$DEPLOY_PORT"
            
        else
            echo "❌ 无法连接到服务器 $SERVER_USER@$SERVER_IP"
            echo "请检查:"
            echo "  - 服务器IP地址是否正确"
            echo "  - SSH服务是否运行"
            echo "  - 用户名和权限是否正确"
            echo ""
            echo "📦 部署包已准备在: $DEPLOY_DIR/"
            echo "🔧 请手动复制到服务器并运行 remote_deploy.sh"
        fi
        ;;
    2)
        echo "📦 手动部署说明:"
        echo ""
        echo "1. 将 '$DEPLOY_DIR' 文件夹复制到服务器"
        echo "2. 在服务器上进入该文件夹"
        echo "3. 运行: chmod +x remote_deploy.sh && ./remote_deploy.sh"
        echo ""
        echo "🌐 部署完成后访问: http://$SERVER_IP:$DEPLOY_PORT"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "📚 部署后的管理命令:"
echo "  查看状态: docker-compose -p 1plab-os ps"
echo "  查看日志: docker-compose -p 1plab-os logs -f"
echo "  停止服务: docker-compose -p 1plab-os down"
echo "  重启服务: docker-compose -p 1plab-os restart"
