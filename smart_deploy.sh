#!/bin/bash

# AI Tools Manager - 智能部署脚本
# 支持开发模式(热重载)和生产模式(静态构建)

echo "🚀 AI Tools Manager 智能部署脚本"
echo "=================================="

# 配置变量
SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"  # 使用 lanlic 用户
PROJECT_NAME="ai-tools-manager"

echo ""
echo "📋 请选择部署模式:"
echo "1. 🔧 开发模式 - 支持热重载 (推荐用于测试)"
echo "2. 🏭 生产模式 - 静态构建 (推荐用于正式环境)"
echo "3. 📦 仅构建部署包"
echo ""

read -p "选择模式 (1/2/3): " mode

case $mode in
    1)
        echo "🔧 开发模式部署 - 支持热重载"
        COMPOSE_FILE="docker-compose.dev.yml"
        DEPLOY_PORT="5178"
        MODE_NAME="开发模式"
        ;;
    2)
        echo "🏭 生产模式部署 - 静态构建"
        COMPOSE_FILE="docker-compose.yml"
        DEPLOY_PORT="8080"
        MODE_NAME="生产模式"
        ;;
    3)
        echo "📦 仅构建部署包..."
        ./build_for_deploy.sh
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "📦 准备 $MODE_NAME 部署包..."

# 创建部署目录
DEPLOY_DIR="deploy_package_$(date +%Y%m%d_%H%M%S)"
rm -rf deploy_package_*  # 清理旧的部署包
mkdir -p $DEPLOY_DIR

# 复制必要文件
echo "📂 复制项目文件..."
cp -r src $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/ 2>/dev/null || echo "package-lock.json 不存在，跳过"
cp vite.config.ts $DEPLOY_DIR/
cp tsconfig*.json $DEPLOY_DIR/
cp tailwind.config.js $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp index.html $DEPLOY_DIR/
cp $COMPOSE_FILE $DEPLOY_DIR/docker-compose.yml  # 重命名为标准名称

# 根据模式复制不同的文件
if [ "$mode" = "2" ]; then
    cp Dockerfile $DEPLOY_DIR/
    cp nginx.conf $DEPLOY_DIR/
fi

echo "✅ 文件复制完成"

# 创建远程部署脚本
cat > $DEPLOY_DIR/remote_deploy.sh << EOF
#!/bin/bash

echo "🔧 在服务器上部署 AI Tools Manager ($MODE_NAME)..."

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose -p ai-tools-manager down 2>/dev/null || true

if [ "$mode" = "1" ]; then
    echo "🔧 启动开发模式 (支持热重载)..."
    echo "⚠️  注意: 开发模式会在首次启动时安装依赖，可能需要几分钟"
    
    # 开发模式启动
    docker-compose -p ai-tools-manager up -d
    
    echo ""
    echo "🎉 开发模式部署完成！"
    echo "🌐 访问地址: http://$SERVER_IP:$DEPLOY_PORT"
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
    echo "🌐 访问地址: http://$SERVER_IP:$DEPLOY_PORT"
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
if [ "$mode" = "1" ]; then
    echo "  进入容器: docker exec -it ai-tools-dev bash"
fi
EOF

chmod +x $DEPLOY_DIR/remote_deploy.sh

echo ""
echo "📋 部署选项:"
echo "1. 自动部署到服务器 (需要SSH访问)"
echo "2. 手动部署 (复制文件到服务器)"
echo ""

read -p "选择部署方式 (1/2): " deploy_choice

case $deploy_choice in
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
            
            if [ "$mode" = "1" ]; then
                echo ""
                echo "🔧 开发模式使用说明:"
                echo "  - 修改本地代码后，变化会自动同步到服务器"
                echo "  - 无需重启容器，刷新浏览器即可看到更改"
                echo "  - 适合快速测试和迭代开发"
            fi
            
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
echo "📚 $MODE_NAME 特点:"
if [ "$mode" = "1" ]; then
    echo "  ✅ 代码修改自动重载，无需重启"
    echo "  ✅ 适合频繁测试和开发"
    echo "  ⚠️  首次启动较慢 (需要安装依赖)"
    echo "  ⚠️  资源占用稍高"
else
    echo "  ✅ 优化构建，加载速度快"
    echo "  ✅ 资源占用低，运行稳定"
    echo "  ⚠️  代码修改需要重新构建"
fi
