// 闪灵 - 灵感捕捉组件
import { useState, useEffect, useRef } from 'react';
import { Zap, Lightbulb, Save, Trash2, Search, Clock, Plus, Sparkles, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 接口定义
interface Inspiration {
  id: string;
  content: string;
  title?: string;
  tags: string[];
  type: 'text' | 'idea' | 'quote' | 'thought' | 'todo';
  mood: 'excited' | 'calm' | 'urgent' | 'creative' | 'focused';
  created_at: string;
  updated_at: string;
}

// 表单数据接口
interface QuickFormData {
  content: string;
  title: string;
  type: 'text' | 'idea' | 'quote' | 'thought' | 'todo';
  mood: 'excited' | 'calm' | 'urgent' | 'creative' | 'focused';
  tags: string[];
  newTag: string;
}

interface InspirationStats {
  total: number;
  today: number;
  thisWeek: number;
  byType: Record<string, number>;
  byMood: Record<string, number>;
}

// 类型配置接口
interface TypeConfig {
  icon: React.ReactNode;
  color: string;
  name: string;
}

interface MoodConfig {
  color: string;
  name: string;
  emoji: string;
}

export function InspirationCapture() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [stats, setStats] = useState<InspirationStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    byType: {},
    byMood: {}
  });
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'idea' | 'quote' | 'thought' | 'todo'>('all');
  const [filterMood, setFilterMood] = useState<'all' | 'excited' | 'calm' | 'urgent' | 'creative' | 'focused'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type' | 'mood'>('newest');
  const [loading, setLoading] = useState(true);

  // 快速捕捉表单状态
  const [quickForm, setQuickForm] = useState<QuickFormData>({
    content: '',
    title: '',
    type: 'idea' as const,
    mood: 'creative' as const,
    tags: [] as string[],
    newTag: ''
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 类型配置
  const typeConfig: Record<string, TypeConfig> = {
    text: { icon: <Lightbulb />, color: 'cyber-blue', name: '文字' },
    idea: { icon: <Sparkles />, color: 'cyber-purple', name: '创意' },
    quote: { icon: <Wind />, color: 'cyber-pink', name: '引言' },
    thought: { icon: <Zap />, color: 'cyber-green', name: '思考' },
    todo: { icon: <Clock />, color: 'cyber-yellow', name: '待办' }
  };

  const moodConfig: Record<string, MoodConfig> = {
    excited: { color: 'red-500', name: '兴奋', emoji: '🔥' },
    calm: { color: 'blue-500', name: '平静', emoji: '🌊' },
    urgent: { color: 'orange-500', name: '紧急', emoji: '⚡' },
    creative: { color: 'purple-500', name: '创意', emoji: '🎨' },
    focused: { color: 'green-500', name: '专注', emoji: '🎯' }
  };

  // 从localStorage加载数据
  useEffect(() => {
    const loadInspirations = () => {
      try {
        const saved = localStorage.getItem('inspirations');
        if (saved) {
          const data: Inspiration[] = JSON.parse(saved);
          setInspirations(data);
          calculateStats(data);
        } else {
          // 如果没有保存的数据，创建一些示例数据
          const sampleData: Inspiration[] = [
            {
              id: 'sample-1',
              content: '在赛博朋克的霓虹灯下，每一个灵感都像是数据流中的闪光点，瞬间即逝却又永恒存在。',
              title: '数字世界的诗意',
              tags: ['赛博朋克', '诗意', '科技'],
              type: 'quote',
              mood: 'creative',
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
              updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'sample-2',
              content: '开发一个AI助手来自动整理每日的创意想法，并能够根据心情和类型进行智能分类。',
              title: '创意管理系统',
              tags: ['AI', '创意', '自动化'],
              type: 'idea',
              mood: 'excited',
              created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5小时前
              updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'sample-3',
              content: '记住要在下次会议前准备关于用户体验优化的提案，重点关注交互动画和视觉反馈。',
              tags: ['会议', 'UX', '动画'],
              type: 'todo',
              mood: 'focused',
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
              updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'sample-4',
              content: '技术不应该冷冰冰地存在，而应该像温暖的光，照亮人们的生活，让复杂的事情变得简单而美好。',
              title: '技术的温度',
              tags: ['人文', '技术', '哲学'],
              type: 'thought',
              mood: 'calm',
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
              updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setInspirations(sampleData);
          calculateStats(sampleData);
        }
      } catch (error) {
        console.error('加载灵感数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInspirations();
  }, []);

  // 计算统计信息
  const calculateStats = (data: Inspiration[]) => {
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: InspirationStats = {
      total: data.length,
      today: data.filter(i => new Date(i.created_at).toDateString() === today).length,
      thisWeek: data.filter(i => new Date(i.created_at) >= weekAgo).length,
      byType: {},
      byMood: {}
    };

    data.forEach(inspiration => {
      stats.byType[inspiration.type] = (stats.byType[inspiration.type] || 0) + 1;
      stats.byMood[inspiration.mood] = (stats.byMood[inspiration.mood] || 0) + 1;
    });

    setStats(stats);
  };

  // 保存到localStorage
  const saveInspirations = (data: Inspiration[]) => {
    localStorage.setItem('inspirations', JSON.stringify(data));
    setInspirations(data);
    calculateStats(data);
  };

  // 处理快速捕捉
  const handleQuickCapture = () => {
    if (!quickForm.content.trim()) return;

    const newInspiration: Inspiration = {
      id: Date.now().toString(),
      content: quickForm.content.trim(),
      title: quickForm.title.trim() || undefined,
      type: quickForm.type,
      mood: quickForm.mood,
      tags: quickForm.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedInspirations = [newInspiration, ...inspirations];
    saveInspirations(updatedInspirations);

    // 重置表单
    setQuickForm({
      content: '',
      title: '',
      type: 'idea',
      mood: 'creative',
      tags: [],
      newTag: ''
    });
    setShowQuickCapture(false);

    // 显示成功提示
    showSuccessToast('灵感已捕捉！✨');
  };

  // 删除灵感
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个灵感吗？')) {
      const updatedInspirations = inspirations.filter(i => i.id !== id);
      saveInspirations(updatedInspirations);
    }
  };

  // 添加标签
  const addTag = () => {
    if (quickForm.newTag.trim() && !quickForm.tags.includes(quickForm.newTag.trim())) {
      setQuickForm(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  // 移除标签
  const removeTag = (tag: string) => {
    setQuickForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 导出数据
  const exportData = () => {
    const dataStr = JSON.stringify(inspirations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspirations_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccessToast('数据导出成功！📁');
  };

  // 导入数据
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          const confirmed = confirm(`即将导入 ${importedData.length} 条灵感记录，是否继续？`);
          if (confirmed) {
            saveInspirations([...importedData, ...inspirations]);
            showSuccessToast(`成功导入 ${importedData.length} 条灵感记录！🎉`);
          }
        }
      } catch (error) {
        console.error('导入失败:', error);
        showSuccessToast('导入失败，请检查文件格式！❌');
      }
    };
    reader.readAsText(file);
  };

  // 成功提示（简化版）
  const showSuccessToast = (message: string) => {
    // 这里可以集成到主应用的Toast系统中
    console.log(message);
  };

  // 过滤和排序
  const filteredAndSortedInspirations = inspirations
    .filter(inspiration => {
      const matchesSearch = 
        inspiration.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inspiration.title && inspiration.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inspiration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'all' || inspiration.type === filterType;
      const matchesMood = filterMood === 'all' || inspiration.mood === filterMood;
      
      return matchesSearch && matchesType && matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'mood':
          return a.mood.localeCompare(b.mood);
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + I 快速打开灵感捕捉
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        setShowQuickCapture(true);
      }
      // ESC 关闭弹窗
      if (event.key === 'Escape' && showQuickCapture) {
        setShowQuickCapture(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showQuickCapture]);

  // 自动调整textarea高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [quickForm.content]);

  // 加载中显示
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-cyber-blue">
          <Sparkles className="animate-spin mr-3 h-10 w-10 inline" />
          正在唤醒灵感空间...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Sparkles />} 
          title="总灵感" 
          value={stats.total.toString()} 
          color="purple" 
        />
        <StatsCard 
          icon={<Zap />} 
          title="今日灵感" 
          value={stats.today.toString()} 
          color="blue" 
        />
        <StatsCard 
          icon={<Wind />} 
          title="本周灵感" 
          value={stats.thisWeek.toString()} 
          color="pink" 
        />
        <StatsCard 
          icon={<Lightbulb />} 
          title="活跃度" 
          value={stats.total > 0 ? Math.round((stats.thisWeek / 7) * 10) / 10 + '/天' : '0/天'} 
          color="green" 
        />
      </div>

      {/* 快速捕捉按钮 */}
      <motion.div className="flex justify-center relative">
        <motion.button
          onClick={() => setShowQuickCapture(true)}
          className="bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-blue text-white px-8 py-4 rounded-full shadow-glow flex items-center space-x-3 text-lg font-medium relative overflow-hidden"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(189, 0, 255, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="animate-pulse" />
          <span>闪灵一瞬</span>
          <Zap className="animate-bounce" />
          
          {/* 键盘快捷键提示 */}
          <motion.div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-gray-300 text-xs px-3 py-1 rounded-lg opacity-0 pointer-events-none"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            Ctrl+Shift+I
          </motion.div>
        </motion.button>
      </motion.div>

      {/* 搜索和过滤区 */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索灵感内容、标题或标签..."
            className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-purple pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            className="bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyber-purple"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          >
            <option value="all">所有类型</option>
            {Object.entries(typeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
          
          <select
            className="bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyber-purple"
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value as typeof filterMood)}
          >
            <option value="all">所有心情</option>
            {Object.entries(moodConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.emoji} {config.name}</option>
            ))}
          </select>
          
          <select
            className="bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyber-purple"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最早优先</option>
            <option value="type">按类型</option>
            <option value="mood">按心情</option>
          </select>

          {/* 导入导出按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={exportData}
              className="bg-cyber-green/20 border border-cyber-green/50 text-cyber-green px-4 py-3 rounded-lg hover:bg-cyber-green/30 transition-all duration-200 flex items-center"
              title="导出数据"
            >
              📤
            </button>
            <label className="bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue px-4 py-3 rounded-lg hover:bg-cyber-blue/30 transition-all duration-200 flex items-center cursor-pointer" title="导入数据">
              📥
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 灵感列表 */}
      <AnimatePresence>
        {filteredAndSortedInspirations.length === 0 ? (
          <motion.div 
            className="text-center py-20 glassmorphism border border-gray-700/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-gray-400 text-xl mb-4">
              <Lightbulb className="mx-auto mb-4" size={64} />
              暂无灵感记录
            </div>
            <p className="text-gray-500">点击"闪灵一瞬"开始捕捉您的灵感吧！</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedInspirations.map((inspiration, index) => (
              <InspirationCard 
                key={inspiration.id}
                inspiration={inspiration}
                index={index}
                onDelete={handleDelete}
                typeConfig={typeConfig}
                moodConfig={moodConfig}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 快速捕捉弹窗 */}
      <AnimatePresence>
        {showQuickCapture && (
          <QuickCaptureModal
            form={quickForm}
            setForm={setQuickForm}
            onSave={handleQuickCapture}
            onCancel={() => setShowQuickCapture(false)}
            addTag={addTag}
            removeTag={removeTag}
            typeConfig={typeConfig}
            moodConfig={moodConfig}
            textareaRef={textareaRef}
          />
        )}
      </AnimatePresence>

      {/* 全局浮动快速捕捉按钮 */}
      <motion.button
        onClick={() => setShowQuickCapture(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-full shadow-glow flex items-center justify-center z-40 hover:scale-110 transition-transform duration-300"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 25px rgba(189, 0, 255, 0.8)',
          rotate: 5
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        title="快速捕捉灵感 (Ctrl+Shift+I)"
      >
        <Zap className="text-white animate-pulse" size={24} />
      </motion.button>
    </div>
  );
}

// 统计卡片组件
const StatsCard = ({ icon, title, value, color }: {
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
      className={`glassmorphism ${colorMap[color].bg} ${colorMap[color].border} border rounded-lg p-6 flex items-center`}
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${colorMap[color].bg} p-3 rounded-lg ${colorMap[color].text} mr-4`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-400 text-sm">{title}</div>
        <div className={`text-2xl font-bold ${colorMap[color].text}`}>{value}</div>
      </div>
    </motion.div>
  );
};

// 灵感卡片组件
const InspirationCard = ({ 
  inspiration, 
  index, 
  onDelete, 
  typeConfig, 
  moodConfig 
}: {
  inspiration: Inspiration;
  index: number;
  onDelete: (id: string) => void;
  typeConfig: Record<string, TypeConfig>;
  moodConfig: Record<string, MoodConfig>;
}) => {
  const config = typeConfig[inspiration.type];
  const mood = moodConfig[inspiration.mood];

  return (
    <motion.div
      className="glassmorphism border border-gray-700/50 rounded-lg overflow-hidden group"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 20px -5px var(--${config.color})` 
      }}
    >
      <div className="p-6">
        {/* 头部 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-${config.color}/20 text-${config.color}`}>
              {config.icon}
            </div>
            <div>
              <span className={`text-${config.color} text-sm font-medium`}>
                {config.name}
              </span>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <span className={`mr-2`}>{mood.emoji}</span>
                <span>{mood.name}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDelete(inspiration.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-400/10"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* 标题 */}
        {inspiration.title && (
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
            {inspiration.title}
          </h3>
        )}

        {/* 内容 */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-6">
          {inspiration.content}
        </p>

        {/* 标签 */}
        {inspiration.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {inspiration.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className={`px-2 py-1 bg-${config.color}/10 text-${config.color} text-xs rounded-full border border-${config.color}/30`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 时间 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{new Date(inspiration.created_at).toLocaleString('zh-CN')}</span>
          </div>
          
          {/* 快速操作 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(inspiration.content);
                // 这里可以添加复制成功的提示
              }}
              className="p-1 text-gray-400 hover:text-cyber-blue transition-colors duration-200 rounded"
              title="复制内容"
            >
              📋
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 这里可以添加编辑功能
              }}
              className="p-1 text-gray-400 hover:text-cyber-green transition-colors duration-200 rounded"
              title="编辑"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 快速捕捉弹窗组件
const QuickCaptureModal = ({
  form,
  setForm,
  onSave,
  onCancel,
  addTag,
  removeTag,
  typeConfig,
  moodConfig,
  textareaRef
}: {
  form: QuickFormData;
  setForm: React.Dispatch<React.SetStateAction<QuickFormData>>;
  onSave: () => void;
  onCancel: () => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  typeConfig: Record<string, TypeConfig>;
  moodConfig: Record<string, MoodConfig>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Enter 保存
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  // 自动聚焦到内容输入框
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);
  return (
    <motion.div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl glassmorphism border border-cyber-purple/30 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="border-b border-gray-700/50 p-6 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="mr-3 text-cyber-purple" />
              捕捉灵感瞬间
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 标题输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标题 (可选)
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="为这个灵感起个标题..."
              className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-purple text-white rounded-lg px-4 py-3 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* 内容输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              灵感内容 *
            </label>
            <textarea
              ref={textareaRef}
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="记录下您的灵感..."
              className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyber-purple text-white rounded-lg px-4 py-3 focus:outline-none transition-all duration-300 resize-none min-h-[120px] max-h-[300px]"
              rows={4}
            />
          </div>

          {/* 类型和心情选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                类型
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(typeConfig).map(([key, config]: [string, TypeConfig]) => (
                  <button
                    key={key}
                    onClick={() => setForm(prev => ({ ...prev, type: key as Inspiration['type'] }))}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                      form.type === key
                        ? `bg-${config.color}/20 border-${config.color}/50 text-${config.color}`
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="mr-2">{config.icon}</span>
                    <span className="text-sm">{config.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                心情
              </label>
              <div className="space-y-2">
                {Object.entries(moodConfig).map(([key, config]: [string, MoodConfig]) => (
                  <button
                    key={key}
                    onClick={() => setForm(prev => ({ ...prev, mood: key as Inspiration['mood'] }))}
                    className={`w-full p-2 rounded-lg border transition-all duration-200 flex items-center ${
                      form.mood === key
                        ? `bg-${config.color}/20 border-${config.color}/50 text-white`
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="mr-3 text-lg">{config.emoji}</span>
                    <span className="text-sm">{config.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 标签输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={form.newTag}
                onChange={(e) => setForm(prev => ({ ...prev, newTag: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="添加标签..."
                className="flex-1 bg-gray-800/50 border border-gray-700 focus:border-cyber-purple text-white rounded-lg px-4 py-2 focus:outline-none transition-all duration-300"
              />
              <button
                onClick={addTag}
                className="bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple px-4 py-2 rounded-lg hover:bg-cyber-purple/30 transition-all duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyber-purple/20 text-cyber-purple text-sm rounded-full border border-cyber-purple/30 flex items-center"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-cyber-purple/70 hover:text-cyber-purple"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span>💡 Ctrl+Enter 保存</span>
              <span>🔄 Esc 取消</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
              >
                取消
              </button>
              <motion.button
                onClick={onSave}
                disabled={!form.content.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-pink text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="inline mr-2" size={16} />
                保存灵感
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InspirationCapture;
