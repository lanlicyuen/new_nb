import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Calendar, DollarSign } from 'lucide-react';

// 接口定义
interface AITool {
  id: number;
  name: string;
  purchase_date: string;
  fee_type: 'monthly' | 'yearly';
  fee_amount: number;
  features: string[];
  created_at: string;
}

interface ToolStats {
  total_tools: number;
  monthly_tools: number;
  yearly_tools: number;
  yearly_total: number;
}

interface APIService {
  getAllTools: () => Promise<AITool[]>;
  deleteTool: (id: number) => Promise<any>;
  getToolsStats: () => Promise<ToolStats>;
  addTool: (tool: Omit<AITool, 'id' | 'created_at'>) => Promise<any>;
}

// 工具卡片组件
const ToolCard = ({ tool, onDelete }: { tool: AITool, onDelete: (id: number) => void }) => {
  // 计算到期日期
  const calculateExpirationDate = () => {
    const date = new Date(tool.purchase_date);
    if (tool.fee_type === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  // 检查是否即将到期（30天内）
  const isExpiringSoon = () => {
    const expDate = new Date(calculateExpirationDate());
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // 检查是否已过期
  const isExpired = () => {
    const expDate = new Date(calculateExpirationDate());
    const today = new Date();
    return expDate < today;
  };

  const expirationDate = calculateExpirationDate();
  const expiringSoon = isExpiringSoon();
  const expired = isExpired();

  return (
    <div className={`tool-card ${expired ? 'expired' : expiringSoon ? 'expiring-soon' : ''}`}>
      <div className="tool-header">
        <h3>{tool.name}</h3>
        <button className="delete-button" onClick={() => onDelete(tool.id)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="tool-info">
        <div className="info-item">
          <Calendar size={14} />
          <span>购买日期: {tool.purchase_date}</span>
        </div>

        <div className="info-item">
          <DollarSign size={14} />
          <span>费用: {tool.fee_amount || 0} ({tool.fee_type === 'monthly' ? '月费' : '年费'})</span>
        </div>

        <div className="info-item expiration">
          <Calendar size={14} />
          <span>
            到期日期: {expirationDate}
            {expired && (
              <span className="status-indicator expired">
                <AlertTriangle size={14} /> 已过期
              </span>
            )}
            {expiringSoon && !expired && (
              <span className="status-indicator expiring-soon">
                <AlertTriangle size={14} /> 即将到期
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="features-list">
        <h4>功能描述:</h4>
        <ul>
          {tool.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 统计面板组件
const StatsPanel = ({ stats }: { stats: ToolStats }) => {
  return (
    <div className="stats-panel">
      <div className="stat-item">
        <div className="stat-value">{stats.total_tools}</div>
        <div className="stat-label">总工具数量</div>
      </div>

      <div className="stat-item">
        <div className="stat-value">{stats.monthly_tools}</div>
        <div className="stat-label">月付工具</div>
      </div>

      <div className="stat-item">
        <div className="stat-value">{stats.yearly_tools}</div>
        <div className="stat-label">年付工具</div>
      </div>

      <div className="stat-item highlight">
        <div className="stat-value">¥{stats.yearly_total.toFixed(2)}</div>
        <div className="stat-label">年度总费用</div>
      </div>
    </div>
  );
};

// 添加工具表单组件
const AddToolForm = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (tool: Omit<AITool, 'id' | 'created_at'>) => Promise<void>; 
}) => {
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [feeType, setFeeType] = useState<'monthly' | 'yearly'>('monthly');
  const [feeAmount, setFeeAmount] = useState('');
  const [features, setFeatures] = useState(['', '']);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 重置表单
  const resetForm = () => {
    setName('');
    setPurchaseDate('');
    setFeeType('monthly');
    setFeeAmount('');
    setFeatures(['', '']);
    setErrors({});
  };

  // 添加功能输入框
  const addFeatureField = () => {
    setFeatures([...features, '']);
  };

  // 删除功能输入框
  const removeFeatureField = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // 更新功能描述
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = '工具名称不能为空';
    }
    
    if (!purchaseDate) {
      newErrors.purchaseDate = '请选择购买日期';
    }
    
    const validFeatures = features.filter(f => f.trim().length > 0);
    if (validFeatures.length === 0) {
      newErrors.features = '至少需要一个功能描述';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const validFeatures = features.filter(f => f.trim().length > 0);
    
    try {
      await onSubmit({
        name,
        purchase_date: purchaseDate,
        fee_type: feeType,
        fee_amount: parseFloat(feeAmount) || 0,
        features: validFeatures
      });
      
      resetForm();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || '添加工具失败' });
    }
  };

  // 关闭模态框
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>添加AI工具</h2>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="tool-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="name">工具名称 *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入AI工具名称"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="purchaseDate">购买日期 *</label>
            <input
              type="date"
              id="purchaseDate"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className={errors.purchaseDate ? 'error' : ''}
            />
            {errors.purchaseDate && <div className="field-error">{errors.purchaseDate}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="feeType">费用类型</label>
              <select
                id="feeType"
                value={feeType}
                onChange={(e) => setFeeType(e.target.value as 'monthly' | 'yearly')}
              >
                <option value="monthly">月付</option>
                <option value="yearly">年付</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feeAmount">费用金额</label>
              <input
                type="number"
                id="feeAmount"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                placeholder="输入费用金额"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>功能描述 *</label>
            {errors.features && <div className="field-error">{errors.features}</div>}
            
            {features.map((feature, index) => (
              <div key={index} className="feature-input">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`功能描述 ${index + 1}`}
                />
                {features.length > 2 && (
                  <button 
                    type="button" 
                    className="remove-feature"
                    onClick={() => removeFeatureField(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-feature"
              onClick={addFeatureField}
            >
              + 添加功能
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>
              取消
            </button>
            <button type="submit" className="submit-button">
              添加工具
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 工具列表组件
const ToolsList = ({ tools, onDelete }: { tools: AITool[], onDelete: (id: number) => void }) => {
  if (tools.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>暂无工具</h3>
        <p>点击右下角的"+"按钮添加您的第一个AI工具</p>
      </div>
    );
  }

  return (
    <div className="tools-grid">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} onDelete={onDelete} />
      ))}
    </div>
  );
};

// 主AI工具管理组件
const AIToolsManager = ({ api }: { api: APIService }) => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [stats, setStats] = useState<ToolStats>({
    total_tools: 0,
    monthly_tools: 0,
    yearly_tools: 0,
    yearly_total: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [toolsData, statsData] = await Promise.all([
        api.getAllTools(),
        api.getToolsStats()
      ]);
      
      setTools(toolsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('加载数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 删除工具
  const handleDeleteTool = async (id: number) => {
    if (!window.confirm('确定要删除此工具吗？')) {
      return;
    }
    
    try {
      await api.deleteTool(id);
      setTools(tools.filter(tool => tool.id !== id));
      await loadData(); // 重新加载数据以更新统计
    } catch (error) {
      console.error('Failed to delete tool:', error);
      setError('删除工具失败，请重试');
    }
  };

  // 添加工具
  const handleAddTool = async (tool: Omit<AITool, 'id' | 'created_at'>) => {
    try {
      await api.addTool(tool);
      await loadData(); // 重新加载数据
    } catch (error: any) {
      console.error('Failed to add tool:', error);
      throw new Error(error.message || '添加工具失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyber-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="ai-tools-container">
      {error && <div className="error-banner">{error}</div>}
      
      <StatsPanel stats={stats} />
      
      <ToolsList tools={tools} onDelete={handleDeleteTool} />
      
      <button 
        className="add-button"
        onClick={() => setShowAddForm(true)}
        title="添加AI工具"
      >
        +
      </button>
      
      <AddToolForm 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddTool}
      />
    </div>
  );
};

export default AIToolsManager;
