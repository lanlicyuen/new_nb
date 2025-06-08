#!/bin/bash

# 实时同步开发脚本
# 本地开发，实时同步到远程服务器

echo "🔄 实时同步开发模式"
echo "==================="

SERVER_IP="1.1.1.12"
SERVER_USER="lanlic"  # 使用 lanlic 用户
REMOTE_PATH="/tmp/ai-tools-sync"

echo "🚀 启动本地开发服务器..."

# 在后台启动本地开发服务器
npm run dev &
LOCAL_DEV_PID=$!

echo "✅ 本地服务器已启动 (PID: $LOCAL_DEV_PID)"
echo "🌐 本地访问: http://localhost:5178"

echo ""
echo "🔄 设置远程同步..."

# 检查SSH连接
if ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    echo "✅ SSH连接正常"
    
    # 创建远程目录
    ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_PATH"
    
    echo "📤 首次同步文件..."
    rsync -avz --exclude node_modules --exclude .git --exclude dist . $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
    
    echo "🚀 在远程服务器启动开发模式..."
    ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_PATH && docker-compose -f docker-compose.dev.yml -p ai-tools-sync up -d" &
    
    sleep 5
    
    echo ""
    echo "🎉 双模式开发环境已启动！"
    echo ""
    echo "📍 访问地址:"
    echo "  本地开发: http://localhost:5178"
    echo "  远程测试: http://$SERVER_IP:5178"
    echo ""
    echo "🔄 实时同步监控中..."
    echo "按 Ctrl+C 停止监控"
    echo ""
    
    # 使用 fswatch 监控文件变化并同步 (macOS)
    if command -v fswatch >/dev/null 2>&1; then
        fswatch -o . | while read f; do
            echo "📁 检测到文件变化，同步中..."
            rsync -avz --exclude node_modules --exclude .git --exclude dist . $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
            echo "✅ 同步完成 $(date)"
        done
    else
        echo "⚠️  未安装 fswatch，使用定时同步模式"
        echo "💡 安装命令: brew install fswatch"
        echo ""
        
        # 定时同步模式
        while true; do
            sleep 10
            echo "🔄 定时同步... $(date)"
            rsync -avz --exclude node_modules --exclude .git --exclude dist . $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
        done
    fi
    
else
    echo "❌ 无法连接到服务器，仅启动本地开发模式"
    echo "🌐 本地访问: http://localhost:5178"
    wait $LOCAL_DEV_PID
fi

# 清理函数
cleanup() {
    echo ""
    echo "🛑 停止服务..."
    kill $LOCAL_DEV_PID 2>/dev/null
    if [ ! -z "$SERVER_USER" ] && [ ! -z "$SERVER_IP" ]; then
        ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_PATH && docker-compose -f docker-compose.dev.yml -p ai-tools-sync down" 2>/dev/null
    fi
    echo "✅ 清理完成"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM
