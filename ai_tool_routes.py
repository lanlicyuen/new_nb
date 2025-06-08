from flask import Blueprint, request, jsonify, current_app, g
from app.models.user import User
from app import db
from app.models.ai_tool import AITool, AIToolFeature
from datetime import datetime
from functools import wraps
import jwt

ai_tools_bp = Blueprint('ai_tools', __name__)

# 验证令牌的装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # 移除Bearer前缀
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            g.current_user = current_user
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(*args, **kwargs)
    return decorated

# 获取所有工具
@ai_tools_bp.route('/api/tools', methods=['GET'])
@token_required
def get_all_tools():
    tools = AITool.query.filter_by(user_id=g.current_user.id).all()
    return jsonify([tool.to_dict() for tool in tools])

# 添加新工具
@ai_tools_bp.route('/api/tools', methods=['POST'])
@token_required
def add_tool():
    data = request.get_json()
    
    # 验证必填字段
    if not data or not data.get('name') or not data.get('purchase_date') or not data.get('fee_type'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    # 解析日期
    try:
        purchase_date = datetime.fromisoformat(data.get('purchase_date').split('T')[0])
    except ValueError:
        return jsonify({'message': 'Invalid date format'}), 400
        
    # 创建工具
    new_tool = AITool(
        name=data.get('name'),
        purchase_date=purchase_date,
        fee_type=data.get('fee_type'),
        fee_amount=data.get('fee_amount'),
        user_id=g.current_user.id
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
    
    return jsonify({'message': 'Tool added successfully', 'tool': new_tool.to_dict()}), 201

# 删除工具
@ai_tools_bp.route('/api/tools/<int:tool_id>', methods=['DELETE'])
@token_required
def delete_tool(tool_id):
    tool = AITool.query.filter_by(id=tool_id, user_id=g.current_user.id).first_or_404()
    
    db.session.delete(tool)
    db.session.commit()
    
    return jsonify({'message': 'Tool deleted successfully'})

# 获取统计信息
@ai_tools_bp.route('/api/tools/stats', methods=['GET'])
@token_required
def get_stats():
    # 总工具数
    total_tools = AITool.query.filter_by(user_id=g.current_user.id).count()
    
    # 月费工具数量
    monthly_tools = AITool.query.filter_by(user_id=g.current_user.id, fee_type='monthly').count()
    
    # 年费工具数量
    yearly_tools = AITool.query.filter_by(user_id=g.current_user.id, fee_type='yearly').count()
    
    # 年度总费用
    yearly_total = 0
    tools = AITool.query.filter_by(user_id=g.current_user.id).all()
    
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
