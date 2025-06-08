// 集成版AI工具管理器组件
import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Calendar, DollarSign, Plus, Search, Filter, Clock, Tag, List, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import SimpleGraphView from './SimpleGraphView';
import { DataDebugger } from './DataDebugger';

// 接口定义
interface AITool {
  id: number;
  name: string;
  purchase_date: string;
  fee_type: 'monthly' | 'yearly';
  fee_amount: number | null;
  features: string[];
  created_at: string;
}

interface ToolStats {
  total_tools: number;
  monthly_tools: number;
  yearly_tools: number;
  yearly_total: number;
}

interface NewToolData {
  name: string;
  purchase_date: string;
  fee_type: 'monthly' | 'yearly';
  fee_amount: number | null;
  features: string[];
}

interface AIToolsManagerProps {
  apiService: {
    getAllTools: () => Promise<AITool[]>;
    addTool: (tool: NewToolData) => Promise<AITool>;
    deleteTool: (id: number) => Promise<void>;
    getToolsStats: () => Promise<ToolStats>;
  };
}

export function AIToolsManagerIntegrated({ apiService }: AIToolsManagerProps) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [stats, setStats] = useState<ToolStats>({
    total_tools: 0,
    monthly_tools: 0,
    yearly_tools: 0,
    yearly_total: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'graph'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'expiration'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 加载工具和统计信息
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [toolsData, statsData] = await Promise.all([
          apiService.getAllTools(),
          apiService.getToolsStats()
        ]);
        setTools(toolsData);
        setStats(statsData);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiService]);

  // 处理工具删除
  const handleDeleteTool = async (id: number) => {
    if (confirm('确定要删除这个工具吗？')) {
      try {
        await apiService.deleteTool(id);
        setTools(tools.filter(tool => tool.id !== id));
        
        // 更新统计信息
        const deletedTool = tools.find(tool => tool.id === id);
        if (deletedTool) {
          setStats(prev => ({
            ...prev,
            total_tools: prev.total_tools - 1,
            monthly_tools: deletedTool.fee_type === 'monthly' ? prev.monthly_tools - 1 : prev.monthly_tools,
            yearly_tools: deletedTool.fee_type === 'yearly' ? prev.yearly_tools - 1 : prev.yearly_tools,
            yearly_total: prev.yearly_total - (deletedTool.fee_type === 'monthly' ? 
              (deletedTool.fee_amount || 0) * 12 : (deletedTool.fee_amount || 0))
          }));
        }
      } catch (error) {
        console.error("删除工具失败:", error);
      }
    }
  };

  // 处理添加新工具
  const handleAddTool = async (newTool: Omit<AITool, 'id' | 'created_at'>) => {
    try {
      const addedTool = await apiService.addTool(newTool);
      setTools([...tools, addedTool]);
      setShowAddForm(false);
      
      // 更新统计信息
      setStats(prev => ({
        ...prev,
        total_tools: prev.total_tools + 1,
        monthly_tools: newTool.fee_type === 'monthly' ? prev.monthly_tools + 1 : prev.monthly_tools,
        yearly_tools: newTool.fee_type === 'yearly' ? prev.yearly_tools + 1 : prev.yearly_tools,
        yearly_total: prev.yearly_total + (newTool.fee_type === 'monthly' ? 
          (newTool.fee_amount || 0) * 12 : (newTool.fee_amount || 0))
      }));
    } catch (error) {
      console.error("添加工具失败:", error);
    }
  };

  // 计算到期日期
  const calculateExpirationDate = (purchaseDate: string, feeType: 'monthly' | 'yearly'): string => {
    const date = new Date(purchaseDate);
    if (feeType === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  // 计算剩余天数
  const calculateDaysLeft = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 过滤和排序工具
  const filteredAndSortedTools = tools
    .filter(tool => {
      // 搜索过滤
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 类型过滤
      const matchesFilter = filterType === 'all' || tool.fee_type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // 排序逻辑
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
          : new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime();
      } else { // expiration
        const aExpDate = calculateExpirationDate(a.purchase_date, a.fee_type);
        const bExpDate = calculateExpirationDate(b.purchase_date, b.fee_type);
        return sortOrder === 'asc' 
          ? new Date(aExpDate).getTime() - new Date(bExpDate).getTime()
          : new Date(bExpDate).getTime() - new Date(aExpDate).getTime();
      }
    });

  // 加载中显示
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-cyber-blue">
          <svg className="animate-spin mr-3 h-10 w-10 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<DollarSign />} title="年度总费用" value={`¥${stats.yearly_total.toFixed(2)}`} color="blue" />
        <StatsCard icon={<Tag />} title="工具总数" value={stats.total_tools.toString()} color="purple" />
        <StatsCard icon={<Calendar />} title="月付工具" value={stats.monthly_tools.toString()} color="pink" />
        <StatsCard icon={<Calendar />} title="年付工具" value={stats.yearly_tools.toString()} color="green" />
      </div>

      {/* 搜索和控制区 */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索工具名称或功能..."
            className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-blue pl-10 pr-4 py-2 rounded-md text-white focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            className="bg-gray-800/50 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-cyber-blue"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'monthly' | 'yearly')}
          >
            <option value="all">所有类型</option>
            <option value="monthly">月付</option>
            <option value="yearly">年付</option>
          </select>
          
          <select
            className="bg-gray-800/50 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-cyber-blue"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as 'name' | 'date' | 'expiration');
              setSortOrder(order as 'asc' | 'desc');
            }}
          >
            <option value="name-asc">按名称 ↑</option>
            <option value="name-desc">按名称 ↓</option>
            <option value="date-asc">按购买日期 ↑</option>
            <option value="date-desc">按购买日期 ↓</option>
            <option value="expiration-asc">按到期日期 ↑</option>
            <option value="expiration-desc">按到期日期 ↓</option>
          </select>
          
          <button 
            className={`px-3 py-2 rounded-md flex items-center ${viewMode === 'card' ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50' : 'bg-gray-800/50 border border-gray-700 text-white'}`}
            onClick={() => setViewMode('card')}
          >
            <Filter size={18} className="mr-1" /> 卡片
          </button>
          
          <button 
            className={`px-3 py-2 rounded-md flex items-center ${viewMode === 'list' ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50' : 'bg-gray-800/50 border border-gray-700 text-white'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} className="mr-1" /> 列表
          </button>
          
          <button 
            className={`px-3 py-2 rounded-md flex items-center ${viewMode === 'graph' ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50' : 'bg-gray-800/50 border border-gray-700 text-white'}`}
            onClick={() => setViewMode('graph')}
          >
            <Network size={18} className="mr-1" /> 图谱
          </button>
        </div>
        
        <motion.button
          className="ml-auto bg-gradient-to-r from-cyber-blue to-cyber-purple text-white px-4 py-2 rounded-md flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={18} className="mr-2" /> 添加工具
        </motion.button>
      </div>

      {/* 工具展示区 */}
      {filteredAndSortedTools.length === 0 ? (
        <div className="text-center py-16 glassmorphism border border-gray-700/50 rounded-lg">
          <div className="text-gray-400 text-lg">暂无AI工具</div>
          <p className="text-gray-500 mt-2">点击"添加工具"开始管理您的AI订阅</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onDelete={handleDeleteTool} 
              calculateExpirationDate={calculateExpirationDate}
              calculateDaysLeft={calculateDaysLeft}
            />
          ))}
        </div>
      ) : viewMode === 'graph' ? (
        <motion.div 
          className="glassmorphism border border-gray-700/50 rounded-lg p-4 min-h-[600px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <>
            <DataDebugger 
              label="GraphView tools data" 
              data={filteredAndSortedTools.map(tool => ({
                id: tool.id.toString(),
                name: tool.name,
                purchaseDate: tool.purchase_date,
                feeType: tool.fee_type,
                features: tool.features || [],
                expirationDate: calculateExpirationDate(tool.purchase_date, tool.fee_type),
                cost: tool.fee_amount || 0
              }))} 
            />
            <SimpleGraphView 
              tools={filteredAndSortedTools.map(tool => ({
                id: tool.id.toString(),
                name: tool.name,
                purchaseDate: tool.purchase_date,
                feeType: tool.fee_type,
                features: tool.features || [],
                expirationDate: calculateExpirationDate(tool.purchase_date, tool.fee_type),
                cost: tool.fee_amount || 0
              }))}
              className="w-full h-[600px]"
            />
          </>
          {/* 使用简化版图表视图，解决空白问题 */}
        </motion.div>
      ) : (
        <div className="glassmorphism border border-gray-700/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-700/50 bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">名称</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">购买日期</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">付费类型</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">费用</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">到期日期</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTools.map(tool => {
                const expirationDate = calculateExpirationDate(tool.purchase_date, tool.fee_type);
                const daysLeft = calculateDaysLeft(expirationDate);
                
                return (
                  <tr key={tool.id} className="border-b border-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{tool.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {tool.features && tool.features.length > 0 
                          ? tool.features.slice(0, 2).join(', ') + (tool.features.length > 2 ? '...' : '') 
                          : '无特性描述'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(tool.purchase_date).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.fee_type === 'monthly' ? 'bg-cyber-blue/20 text-cyber-blue' : 'bg-cyber-green/20 text-cyber-green'
                      }`}>
                        {tool.fee_type === 'monthly' ? '月付' : '年付'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {tool.fee_amount ? `¥${tool.fee_amount.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`text-sm ${
                        daysLeft < 0 ? 'text-red-400' : 
                        daysLeft <= 30 ? 'text-yellow-400' : 
                        'text-gray-300'
                      }`}>
                        {new Date(expirationDate).toLocaleDateString('zh-CN')}
                        <div className="text-xs mt-1">
                          {daysLeft < 0 ? `已过期 ${Math.abs(daysLeft)} 天` : 
                           daysLeft === 0 ? '今日到期' : 
                           `剩余 ${daysLeft} 天`}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleDeleteTool(tool.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 添加工具弹窗 */}
      {showAddForm && (
        <AddToolForm 
          onAdd={handleAddTool}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

// 统计卡片组件
const StatsCard = ({ 
  icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string;
  color: 'blue' | 'purple' | 'pink' | 'green';
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-cyber-blue/10',
      border: 'border-cyber-blue/30',
      text: 'text-cyber-blue',
    },
    purple: {
      bg: 'bg-cyber-purple/10',
      border: 'border-cyber-purple/30',
      text: 'text-cyber-purple',
    },
    pink: {
      bg: 'bg-cyber-pink/10',
      border: 'border-cyber-pink/30',
      text: 'text-cyber-pink',
    },
    green: {
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30',
      text: 'text-cyber-green',
    },
  };

  return (
    <motion.div 
      className={`glassmorphism ${colorMap[color].bg} ${colorMap[color].border} border rounded-lg p-4 flex items-center`}
      whileHover={{ y: -5 }}
    >
      <div className={`${colorMap[color].bg} p-3 rounded-lg ${colorMap[color].text}`}>
        {icon}
      </div>
      <div className="ml-4">
        <div className="text-gray-400 text-sm">{title}</div>
        <div className={`text-xl font-medium ${colorMap[color].text}`}>{value}</div>
      </div>
    </motion.div>
  );
};

// 工具卡片组件
const ToolCard = ({ 
  tool, 
  onDelete,
  calculateExpirationDate,
  calculateDaysLeft
}: { 
  tool: AITool; 
  onDelete: (id: number) => void;
  calculateExpirationDate: (purchaseDate: string, feeType: 'monthly' | 'yearly') => string;
  calculateDaysLeft: (expirationDate: string) => number;
}) => {
  const expirationDate = calculateExpirationDate(tool.purchase_date, tool.fee_type);
  const daysLeft = calculateDaysLeft(expirationDate);
  
  return (
    <motion.div 
      className="glassmorphism border border-gray-700/50 rounded-lg overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px -5px rgba(0, 245, 255, 0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white truncate mr-2">{tool.name}</h3>
          <button 
            onClick={() => onDelete(tool.id)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="mt-3 flex items-center text-sm">
          <Calendar size={14} className="text-gray-400 mr-2" />
          <span className="text-gray-300">
            购买: {new Date(tool.purchase_date).toLocaleDateString('zh-CN')}
          </span>
        </div>
        
        <div className={`mt-2 flex items-center text-sm ${
          daysLeft < 0 ? 'text-red-400' : 
          daysLeft <= 30 ? 'text-yellow-400' : 
          'text-gray-300'
        }`}>
          <Clock size={14} className="mr-2" />
          <span>
            到期: {new Date(expirationDate).toLocaleDateString('zh-CN')}
            {daysLeft < 0 ? ` (已过期 ${Math.abs(daysLeft)} 天)` : 
             daysLeft === 0 ? ' (今日到期)' : 
             ` (剩余 ${daysLeft} 天)`}
          </span>
        </div>
        
        {tool.fee_amount && (
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <DollarSign size={14} className="text-gray-400 mr-2" />
            <span>
              {tool.fee_type === 'monthly' ? `¥${tool.fee_amount.toFixed(2)}/月` : `¥${tool.fee_amount.toFixed(2)}/年`}
            </span>
          </div>
        )}
        
        <div className="flex mt-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            tool.fee_type === 'monthly' ? 'bg-cyber-blue/20 text-cyber-blue' : 'bg-cyber-green/20 text-cyber-green'
          }`}>
            {tool.fee_type === 'monthly' ? '月付' : '年付'}
          </span>
        </div>
        
        {tool.features && tool.features.length > 0 && (
          <div className="mt-4 border-t border-gray-700/50 pt-3">
            <h4 className="text-xs uppercase text-gray-400 mb-2">功能特性</h4>
            <ul className="space-y-1">
              {tool.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-cyber-blue mr-2">•</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {daysLeft <= 30 && daysLeft >= 0 && (
        <div className="bg-yellow-400/10 border-t border-yellow-400/30 px-4 py-2 flex items-center">
          <AlertTriangle size={14} className="text-yellow-400 mr-2" />
          <span className="text-yellow-400 text-xs">即将到期，请注意续费</span>
        </div>
      )}
      
      {daysLeft < 0 && (
        <div className="bg-red-500/10 border-t border-red-500/30 px-4 py-2 flex items-center">
          <AlertTriangle size={14} className="text-red-400 mr-2" />
          <span className="text-red-400 text-xs">已过期，请尽快续费</span>
        </div>
      )}
    </motion.div>
  );
};

// 添加工具表单
const AddToolForm = ({ onAdd, onCancel }: { 
  onAdd: (tool: {
    name: string;
    purchase_date: string;
    fee_type: 'monthly' | 'yearly';
    fee_amount: number | null;
    features: string[];
  }) => void; 
  onCancel: () => void 
}) => {
  const [form, setForm] = useState<{
    name: string;
    purchase_date: string;
    fee_type: 'monthly' | 'yearly';
    fee_amount: string;
    features: string[];
  }>({
    name: '',
    purchase_date: new Date().toISOString().split('T')[0],
    fee_type: 'monthly',
    fee_amount: '',
    features: ['']
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm(prev => ({ ...prev, features: newFeatures }));
  };
  
  const addFeatureField = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };
  
  const removeFeatureField = (index: number) => {
    if (form.features.length > 1) {
      const newFeatures = [...form.features];
      newFeatures.splice(index, 1);
      setForm(prev => ({ ...prev, features: newFeatures }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 过滤掉空的功能特性
    const filteredFeatures = form.features.filter(f => f.trim() !== '');
    
    onAdd({
      ...form,
      fee_amount: form.fee_amount ? parseFloat(form.fee_amount) : null,
      features: filteredFeatures
    });
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="w-full max-w-lg glassmorphism border border-cyber-blue/30 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="border-b border-gray-700/50 p-4 bg-gray-800/50">
          <h3 className="text-xl font-medium text-white">添加AI工具</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">工具名称</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-md px-4 py-2 focus:outline-none"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-300 mb-1">购买日期</label>
            <input 
              type="date" 
              id="purchase_date" 
              name="purchase_date"
              value={form.purchase_date}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-md px-4 py-2 focus:outline-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fee_type" className="block text-sm font-medium text-gray-300 mb-1">费用类型</label>
              <select 
                id="fee_type" 
                name="fee_type"
                value={form.fee_type}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-md px-4 py-2 focus:outline-none"
              >
                <option value="monthly">月付</option>
                <option value="yearly">年付</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="fee_amount" className="block text-sm font-medium text-gray-300 mb-1">费用金额</label>
              <input 
                type="number" 
                step="0.01" 
                id="fee_amount" 
                name="fee_amount"
                value={form.fee_amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-md px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">功能特性</label>
            {form.features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <input 
                  type="text" 
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`特性 ${index + 1}`}
                  className="flex-grow bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-md px-4 py-2 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={() => removeFeatureField(index)}
                  disabled={form.features.length === 1}
                  className={`ml-2 p-2 rounded-md ${
                    form.features.length === 1 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-red-400 hover:bg-red-400/10'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            <button 
              type="button"
              onClick={addFeatureField}
              className="mt-2 text-sm text-cyber-blue flex items-center"
            >
              <Plus size={16} className="mr-1" /> 添加特性
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700/50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-md"
            >
              添加工具
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AIToolsManagerIntegrated;
