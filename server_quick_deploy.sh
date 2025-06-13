#!/bin/bash

# 服务器端快速部署脚本
# 用于解压并部署最新的1PLab OS更新

echo "🚀 1PLab OS 服务器端快速部署"
echo "================================"

# 检查是否有部署包
if [ -f "deploy_package_latest.tar.gz" ]; then
    echo "📦 发现部署包: deploy_package_latest.tar.gz"
    
    # 解压部署包
    echo "📂 解压部署包..."
    tar -xzf deploy_package_latest.tar.gz
    
    if [ $? -eq 0 ]; then
        echo "✅ 解压成功"
        
        # 进入部署目录
        cd deploy_package
        
        # 确保脚本可执行
        chmod +x remote_deploy.sh
        
        # 执行部署
        echo "🚀 开始部署..."
        ./remote_deploy.sh
        
        echo ""
        echo "🎉 部署完成！"
        echo "🌐 访问地址: http://1.1.1.12:8080"
        echo ""
        echo "📊 如需查看状态和日志:"
        echo "  docker-compose -p 1plab-os ps"
        echo "  docker-compose -p 1plab-os logs -f"
        
    else
        echo "❌ 解压失败，请检查文件完整性"
        exit 1
    fi
    
elif [ -d "deploy_package" ]; then
    echo "📂 发现解压后的部署目录"
    
    # 进入部署目录
    cd deploy_package
    
    # 确保脚本可执行
    chmod +x remote_deploy.sh
    
    # 执行部署
    echo "🚀 开始部署..."
    ./remote_deploy.sh
    
else
    echo "❌ 未找到部署包或部署目录"
    echo ""
    echo "请确保以下文件之一存在:"
    echo "  - deploy_package_latest.tar.gz (压缩包)"
    echo "  - deploy_package/ (解压后的目录)"
    echo ""
    echo "如果需要重新下载，请联系管理员"
    exit 1
fi
