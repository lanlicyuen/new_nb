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
    user = db.relationship('User', backref='ai_tools', lazy=True)
    
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
