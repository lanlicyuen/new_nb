#!/bin/bash
# 此脚本用于将AI工具管理功能集成到现有的MD Note项目中

set -e

# 检查MD Note容器是否存在
echo "检查MD Note容器状态..."
if ! docker ps -q -f name=md_note >/dev/null; then
    echo "错误: md_note容器未运行!"
    exit 1
fi

echo "创建AI工具模型文件..."
cat > ai_tool_model.py << 'EOL'
from app import db
from datetime import datetime

class AITool(db.Model):
    __tablename__ = 'ai_tools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    fee_type = db.Column(db.String(50), nullable=False)  # monthly/yearly
    fee_amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # 关联关系
    features = db.relationship('AIToolFeature', backref='tool', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<AITool {self.name}>"
        
    # 转换为JSON
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'purchase_date': self.purchase_date.isoformat(),
            'fee_type': self.fee_type,
            'fee_amount': self.fee_amount,
            'features': [feature.description for feature in self.features],
            'created_at': self.created_at.isoformat()
        }

class AIToolFeature(db.Model):
    __tablename__ = 'ai_tool_features'
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    tool_id = db.Column(db.Integer, db.ForeignKey('ai_tools.id'), nullable=False)
    
    def __repr__(self):
        return f"<AIToolFeature {self.description}>"
EOL

echo "创建AI工具路由文件..."
cat > ai_tool_routes.py << 'EOL'
from flask import Blueprint, request, jsonify, current_app, g
from app.models.user import User
from app import db
from app.models.ai_tool import AITool, AIToolFeature
from datetime import datetime
from functools import wraps
import jwt
from flask_login import login_required, current_user

ai_tools_bp = Blueprint('ai_tools', __name__)

# API接口 - 获取所有工具
@ai_tools_bp.route('/api/tools', methods=['GET'])
@login_required
def get_all_tools():
    tools = AITool.query.filter_by(user_id=current_user.id).all()
    return jsonify([tool.to_dict() for tool in tools])

# API接口 - 添加新工具
@ai_tools_bp.route('/api/tools', methods=['POST'])
@login_required
def add_tool():
    data = request.get_json()
    
    # 验证必填字段
    if not data or not data.get('name') or not data.get('purchase_date') or not data.get('fee_type'):
        return jsonify({'message': '缺少必填字段'}), 400
        
    # 解析日期
    try:
        purchase_date = datetime.fromisoformat(data.get('purchase_date').split('T')[0])
    except ValueError:
        return jsonify({'message': '日期格式无效'}), 400
        
    # 创建工具
    new_tool = AITool(
        name=data.get('name'),
        purchase_date=purchase_date,
        fee_type=data.get('fee_type'),
        fee_amount=data.get('fee_amount'),
        user_id=current_user.id
    )
    
    # 添加功能
    features = data.get('features', [])
    for feature_desc in features:
        if feature_desc.strip():
            feature = AIToolFeature(description=feature_desc)
            new_tool.features.append(feature)
    
    # 保存到数据库
    db.session.add(new_tool)
    db.session.commit()
    
    return jsonify({'message': '工具添加成功', 'tool': new_tool.to_dict()}), 201

# API接口 - 删除工具
@ai_tools_bp.route('/api/tools/<int:tool_id>', methods=['DELETE'])
@login_required
def delete_tool(tool_id):
    tool = AITool.query.filter_by(id=tool_id, user_id=current_user.id).first_or_404()
    
    db.session.delete(tool)
    db.session.commit()
    
    return jsonify({'message': '工具删除成功'})

# API接口 - 获取统计信息
@ai_tools_bp.route('/api/tools/stats', methods=['GET'])
@login_required
def get_stats():
    # 总工具数
    total_tools = AITool.query.filter_by(user_id=current_user.id).count()
    
    # 月费工具数量
    monthly_tools = AITool.query.filter_by(user_id=current_user.id, fee_type='monthly').count()
    
    # 年费工具数量
    yearly_tools = AITool.query.filter_by(user_id=current_user.id, fee_type='yearly').count()
    
    # 年度总费用
    yearly_total = 0
    tools = AITool.query.filter_by(user_id=current_user.id).all()
    
    for tool in tools:
        if tool.fee_amount:
            if tool.fee_type == 'monthly':
                yearly_total += tool.fee_amount * 12
            else:
                yearly_total += tool.fee_amount
    
    return jsonify({
        'total_tools': total_tools,
        'monthly_tools': monthly_tools,
        'yearly_tools': yearly_tools,
        'yearly_total': round(yearly_total, 2)
    })
EOL

# 将文件复制到md_note容器中
echo "将模型和路由文件复制到md_note容器..."
docker cp ai_tool_model.py md_note:/app/models/ai_tool.py
docker cp ai_tool_routes.py md_note:/app/routes/ai_tool_routes.py

# 创建初始化文件
echo "创建初始化文件..."
cat > init_script.py << 'EOL'
# 导入需要的模块
from app import db, create_app
from alembic import command
from alembic.config import Config
import os

# 创建应用实例
app = create_app()

with app.app_context():
    # 更新__init__.py文件以注册新的蓝图
    init_file_path = os.path.join(app.root_path, 'routes', '__init__.py')
    with open(init_file_path, 'r') as f:
        content = f.read()
    
    # 如果尚未导入AI工具蓝图，则添加导入语句
    if 'from app.routes.ai_tool_routes import ai_tools_bp' not in content:
        new_content = content + '\n# AI Tools Blueprint\nfrom app.routes.ai_tool_routes import ai_tools_bp\n'
        with open(init_file_path, 'w') as f:
            f.write(new_content)
    
    # 更新主__init__.py文件以注册新的蓝图
    main_init_file_path = os.path.join(app.root_path, '__init__.py')
    with open(main_init_file_path, 'r') as f:
        main_content = f.read()
    
    # 如果尚未注册AI工具蓝图，则添加注册语句
    if 'app.register_blueprint(ai_tools_bp)' not in main_content:
        # 找到最后一个register_blueprint行
        lines = main_content.split('\n')
        insert_idx = None
        for i, line in enumerate(lines):
            if 'register_blueprint' in line:
                insert_idx = i + 1
        
        if insert_idx:
            lines.insert(insert_idx, '    app.register_blueprint(ai_tools_bp)')
            new_main_content = '\n'.join(lines)
            with open(main_init_file_path, 'w') as f:
                f.write(new_main_content)
    
    # 创建新的数据库表
    print('Creating AI Tools tables...')
    db.create_all()
    
    print('Initialization complete!')
EOL

# 将初始化脚本复制到容器并执行
echo "将初始化脚本复制到容器并执行..."
docker cp init_script.py md_note:/app/
docker exec -it md_note python /app/init_script.py

# 重启md_note容器以应用更改
echo "重启md_note容器以应用更改..."
docker restart md_note

# 清理临时文件
echo "清理临时文件..."
rm ai_tool_model.py ai_tool_routes.py init_script.py

echo "集成完成! AI工具管理功能已成功添加到MD Note项目。"
