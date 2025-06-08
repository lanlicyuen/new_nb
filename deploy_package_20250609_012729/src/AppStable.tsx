import { useState, useEffect } from 'react';
import { Plus, Brain, List, BarChart3 } from 'lucide-react';

// 简化的工具接口
interface SimpleTool {
  id: string;
  name: string;
  purchaseDate: string;
  feeType: 'monthly' | 'yearly';
  expirationDate: string;
  features: string[];
  cost?: number;
}

// 工具函数
function calculateExpirationDate(purchaseDate: string, feeType: 'monthly' | 'yearly'): string {
  const date = new Date(purchaseDate);
  if (feeType === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().split('T')[0];
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

// 简化的添加工具表单组件
function AddToolForm({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tool: SimpleTool) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    feeType: 'monthly' as 'monthly' | 'yearly',
    features: ['', ''], // 初始显示两个输入框
    cost: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('请输入工具名称');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      alert('请至少添加一个功能');
      return;
    }

    const expirationDate = calculateExpirationDate(formData.purchaseDate, formData.feeType);

    const tool: SimpleTool = {
      id: generateId(),
      name: formData.name.trim(),
      purchaseDate: formData.purchaseDate,
      feeType: formData.feeType,
      expirationDate,
      features: validFeatures,
      cost: formData.cost || undefined
    };

    onSubmit(tool);
    
    // Reset form
    setFormData({
      name: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      feeType: 'monthly',
      features: ['', ''], // 重置时也显示两个输入框
      cost: 0
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 2) { // 至少保留两个输入框
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">添加 AI 工具</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              工具名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="cyber-input w-full"
              placeholder="例如: ChatGPT Plus, Cursor..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              购买日期 *
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              className="cyber-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              费用类型 *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="monthly"
                  checked={formData.feeType === 'monthly'}
                  onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value as 'monthly' | 'yearly' }))}
                  className="mr-2 accent-cyber-blue"
                />
                <span className="text-gray-300">月费</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yearly"
                  checked={formData.feeType === 'yearly'}
                  onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value as 'monthly' | 'yearly' }))}
                  className="mr-2 accent-cyber-blue"
                />
                <span className="text-gray-300">年费</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              费用 (可选)
            </label>
            <input
              type="number"
              value={formData.cost || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
              className="cyber-input w-full"
              placeholder="输入费用金额..."
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              功能描述 *
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="cyber-input flex-1"
                    placeholder="例如: 程式码生成, 图像创作..."
                  />
                  {/* 删除按钮 */}
                  {formData.features.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      title="删除功能"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={addFeature}
              className="w-12 h-12 flex items-center justify-center bg-cyber-blue/20 border border-cyber-blue/50 rounded-lg text-cyber-blue hover:bg-cyber-blue/30 hover:border-cyber-blue transition-all duration-200"
              title="添加功能"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cyber-cancel-button"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 cyber-button"
            >
              添加工具
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [tools, setTools] = useState<SimpleTool[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Load tools from localStorage
  useEffect(() => {
    const savedTools = loadFromLocalStorage<SimpleTool[]>('ai-tools', []);
    
    if (savedTools.length === 0) {
      const sampleTools: SimpleTool[] = [
        {
          id: 'sample-1',
          name: 'ChatGPT Plus',
          purchaseDate: '2024-01-15',
          feeType: 'monthly',
          expirationDate: '2025-01-15',
          features: ['程式码生成', '文本创作', '问题解答', '语言翻译'],
          cost: 20
        },
        {
          id: 'sample-2',
          name: 'Cursor Pro',
          purchaseDate: '2024-06-01',
          feeType: 'monthly',
          expirationDate: '2025-06-01',
          features: ['AI程式码补全', '智能重构', '程式码解释', '调试辅助'],
          cost: 20
        }
      ];
      setTools(sampleTools);
      saveToLocalStorage('ai-tools', sampleTools);
    } else {
      setTools(savedTools);
    }
  }, []);

  // Save tools to localStorage
  useEffect(() => {
    saveToLocalStorage('ai-tools', tools);
  }, [tools]);

  const handleAddTool = (tool: SimpleTool) => {
    setTools(prev => [...prev, tool]);
    setIsAddFormOpen(false);
  };

  const handleDeleteTool = (toolId: string) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
  };

  const totalCost = tools.reduce((sum, tool) => {
    if (!tool.cost) return sum;
    return sum + (tool.feeType === 'monthly' ? tool.cost * 12 : tool.cost);
  }, 0);

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* Header */}
      <header className="glass-card border-b border-cyber-blue/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">AI 工具管理器</h1>
                <p className="text-sm text-gray-400">数字化智能工具笔记本</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddFormOpen(true)}
              className="cyber-button flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加工具
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gradient mb-4">工具统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyber-blue">{tools.length}</p>
              <p className="text-sm text-gray-400">总工具数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyber-green">${totalCost}</p>
              <p className="text-sm text-gray-400">年度总费用</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyber-purple">{tools.filter(t => t.feeType === 'monthly').length}</p>
              <p className="text-sm text-gray-400">月费工具</p>
            </div>
          </div>
        </div>

        {/* Tools List */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gradient mb-4">工具列表</h2>
          
          {tools.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">还没有添加任何工具</p>
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="mt-4 cyber-button"
              >
                添加第一个工具
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map((tool) => (
                <div key={tool.id} className="border border-cyber-blue/30 rounded-lg p-4 hover:border-cyber-blue/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-cyber-blue mb-2">{tool.name}</h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>费用: ${tool.cost || 0} ({tool.feeType === 'monthly' ? '月费' : '年费'})</p>
                        <p>到期: {tool.expirationDate}</p>
                        <p>功能: {tool.features.join(', ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      className="px-3 py-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Tool Form */}
      <AddToolForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddTool}
      />
    </div>
  );
}

export default App;
