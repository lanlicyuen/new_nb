// 完整功能的MD笔记管理组件 - 赛博朋克风格增强版
import { useState, useEffect } from 'react';
import { FileText, Plus, Folder, Search, Edit3, Trash2, Save, X, FolderPlus, Calendar, Hash, Zap, Star, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MDNote {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface EditingNote extends MDNote {
  newTag?: string;
}

const MDNoteManager = () => {
  const [notes, setNotes] = useState<MDNote[]>([]);
  const [folders, setFolders] = useState<string[]>(['默认', 'AI研究', '项目文档', '学习笔记']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('全部');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // 新建笔记表单状态
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    folder: '默认',
    tags: [] as string[],
    newTag: ''
  });

  // 初始化示例数据
  useEffect(() => {
    const sampleNotes: MDNote[] = [
      {
        id: '1',
        title: 'AI工具对比分析',
        content: `# AI工具对比分析

## ChatGPT vs Claude vs Gemini

### ChatGPT
- **优势**: 生态系统完善，插件丰富
- **劣势**: 有时会产生幻觉
- **适用场景**: 日常对话、代码生成、创意写作

### Claude
- **优势**: 长文本处理能力强，逻辑清晰
- **劣势**: 可用性有限制
- **适用场景**: 文档分析、学术研究

### Gemini
- **优势**: 多模态能力强
- **劣势**: 中文支持相对较弱
- **适用场景**: 图像分析、多媒体处理

## 总结
每个AI工具都有其独特优势，选择时需要根据具体需求来决定。`,
        folder: 'AI研究',
        tags: ['AI', '对比', '工具'],
        created_at: '2025-06-01',
        updated_at: '2025-06-08'
      },
      {
        id: '2',
        title: '1PLab OS 项目规划',
        content: `# 1PLab OS 项目规划

## 项目概述
一个人的实验室操作系统，专注于AI工具管理和知识管理。

## 核心功能
1. **AI工具管理**
   - 订阅追踪
   - 费用计算
   - 到期提醒

2. **Markdown笔记**
   - 富文本编辑
   - 文件夹管理
   - 标签分类

3. **数据可视化**
   - 思维导图
   - 关系图谱
   - 统计图表

## 技术栈
- 前端: React + TypeScript + Tailwind CSS
- 可视化: D3.js
- 动画: Framer Motion

## 开发计划
- Phase 1: AI工具管理 ✅
- Phase 2: Markdown笔记 🚧
- Phase 3: 数据同步 📋`,
        folder: '项目文档',
        tags: ['项目', '规划', '开发'],
        created_at: '2025-06-05',
        updated_at: '2025-06-08'
      },
      {
        id: '3',
        title: 'React Hooks 学习笔记',
        content: `# React Hooks 学习笔记

## useState
用于在函数组件中添加状态。

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
用于处理副作用，如数据获取、订阅等。

\`\`\`javascript
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数
  };
}, [dependencies]);
\`\`\`

## useContext
用于消费 Context 值。

\`\`\`javascript
const value = useContext(MyContext);
\`\`\`

## 自定义 Hooks
可以封装可复用的状态逻辑。

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}
\`\`\``,
        folder: '学习笔记',
        tags: ['React', 'Hooks', '前端'],
        created_at: '2025-06-03',
        updated_at: '2025-06-07'
      }
    ];

    // 从localStorage加载数据
    const savedNotes = localStorage.getItem('md-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(sampleNotes);
      localStorage.setItem('md-notes', JSON.stringify(sampleNotes));
    }

    // 加载文件夹
    const savedFolders = localStorage.getItem('md-folders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // 保存到localStorage
  const saveNotes = (newNotes: MDNote[]) => {
    setNotes(newNotes);
    localStorage.setItem('md-notes', JSON.stringify(newNotes));
  };

  const saveFolders = (newFolders: string[]) => {
    setFolders(newFolders);
    localStorage.setItem('md-folders', JSON.stringify(newFolders));
  };

  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === '全部' || note.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // 创建新笔记
  const handleCreateNote = () => {
    if (!newNote.title.trim()) return;

    const note: MDNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      folder: newNote.folder,
      tags: newNote.tags,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    saveNotes([...notes, note]);
    setNewNote({ title: '', content: '', folder: '默认', tags: [], newTag: '' });
    setIsCreating(false);
  };

  // 删除笔记
  const handleDeleteNote = (id: string) => {
    if (confirm('确定要删除这篇笔记吗？')) {
      saveNotes(notes.filter(note => note.id !== id));
    }
  };

  // 更新笔记
  const handleUpdateNote = () => {
    if (!editingNote) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? { ...editingNote, updated_at: new Date().toISOString().split('T')[0] }
        : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
  };

  // 添加标签
  const addTag = (isNewNote: boolean = true) => {
    const tagValue = isNewNote ? newNote.newTag.trim() : editingNote?.newTag?.trim();
    if (!tagValue) return;

    if (isNewNote) {
      if (!newNote.tags.includes(tagValue)) {
        setNewNote(prev => ({
          ...prev,
          tags: [...prev.tags, tagValue],
          newTag: ''
        }));
      }
    } else if (editingNote) {
      if (!editingNote.tags.includes(tagValue)) {
        setEditingNote(prev => prev ? {
          ...prev,
          tags: [...prev.tags, tagValue],
          newTag: ''
        } : null);
      }
    }
  };

  // 创建新文件夹
  const handleCreateFolder = () => {
    if (!newFolderName.trim() || folders.includes(newFolderName)) return;
    
    saveFolders([...folders, newFolderName]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* 赛博朋克背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523bd00ff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22m0%2040h40v-40h-40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* 动态粒子背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-purple rounded-full opacity-30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 p-6">
        {/* 页面标题 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-blue bg-clip-text text-transparent mb-2 flex items-center">
            <Code className="mr-3 text-cyber-purple" size={32} />
            Markdown 笔记管理系统
          </h1>
          <div className="h-0.5 bg-gradient-to-r from-cyber-purple/50 via-transparent to-cyber-blue/50 rounded-full"></div>
        </motion.div>

        {/* 搜索和控制区 */}
        <motion.div 
          className="mb-6 flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyber-purple transition-colors duration-300" size={18} />
            <input
              type="text"
              placeholder="搜索笔记..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 focus:border-cyber-purple/80 pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple/30 transition-all duration-300 focus:shadow-lg focus:shadow-cyber-purple/20"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-purple/0 via-cyber-purple/5 to-cyber-blue/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* 文件夹筛选 */}
          <div className="relative group">
            <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyber-green transition-colors duration-300" size={16} />
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 focus:border-cyber-green/80 text-white rounded-lg pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-green/30 appearance-none transition-all duration-300 focus:shadow-lg focus:shadow-cyber-green/20"
            >
              <option value="全部">全部文件夹</option>
              {folders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
          
          <motion.button
            onClick={() => setIsCreatingFolder(true)}
            className="cyber-button-secondary px-4 py-3 rounded-lg flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-cyber-green/30"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 135, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FolderPlus size={18} className="mr-2" /> 新建文件夹
          </motion.button>
          
          <motion.button
            onClick={() => setIsCreating(true)}
            className="cyber-button px-6 py-3 rounded-lg flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-cyber-purple/50"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 25px rgba(189, 0, 255, 0.6)',
              textShadow: '0 0 10px rgba(189, 0, 255, 0.8)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} className="mr-2" /> 
            <span className="font-medium">新建笔记</span>
            <Zap size={16} className="ml-2 opacity-70" />
          </motion.button>
        </motion.div>

        {/* 笔记统计 */}
        <motion.div 
          className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { label: '总笔记数', value: notes.length, color: 'cyber-blue', icon: FileText },
            { label: '文件夹数', value: folders.length, color: 'cyber-purple', icon: Folder },
            { label: '标签数', value: Array.from(new Set(notes.flatMap(note => note.tags))).length, color: 'cyber-green', icon: Hash },
            { label: '搜索结果', value: filteredNotes.length, color: 'cyber-pink', icon: Star }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="cyber-card p-6 text-center relative overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 20px -5px var(--${stat.color})`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className={`absolute top-2 right-2 text-${stat.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}>
                <stat.icon size={20} />
              </div>
              <motion.div 
                className={`text-3xl font-bold text-${stat.color} mb-2`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${stat.color}/50 to-transparent`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* 笔记列表 */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div 
                key={note.id}
                className="cyber-card group relative overflow-hidden hover:border-cyber-purple/70 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 25px -5px rgba(189, 0, 255, 0.4)',
                  scale: 1.02
                }}
                layout
              >
                {/* 霓虹边框效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/0 via-cyber-purple/20 to-cyber-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                {/* 顶部装饰条 */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-blue opacity-60"></div>
                
                <div className="p-6 relative z-10">
                  {/* 笔记头部 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-grow">
                      <motion.div
                        className="p-2 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 mr-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <FileText className="text-cyber-purple" size={18} />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyber-purple transition-colors duration-300">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => setEditingNote({ ...note, newTag: '' })}
                        className="p-2 text-gray-400 hover:text-cyber-blue transition-colors duration-200 rounded-lg hover:bg-cyber-blue/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit3 size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-400/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* 文件夹和日期 */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <motion.div 
                      className="flex items-center text-cyber-green bg-cyber-green/10 px-3 py-1 rounded-full border border-cyber-green/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Folder size={14} className="mr-1" />
                      {note.folder}
                    </motion.div>
                    <div className="flex items-center text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
                      <Calendar size={14} className="mr-1" />
                      {note.updated_at}
                    </div>
                  </div>

                  {/* 标签 */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="text-xs bg-cyber-purple/10 text-cyber-purple px-3 py-1 rounded-full border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors duration-200"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: tagIndex * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  
                  {/* 内容预览 */}
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 text-gray-300 text-sm h-32 overflow-hidden relative border border-gray-700/30 group-hover:border-gray-600/50 transition-colors duration-300">
                    {note.content.split('\n').slice(0, 6).map((line, i) => (
                      <div key={i} className={i === 0 && line.startsWith('#') ? "font-semibold text-white mb-1" : "mb-0.5"}>
                        {line || '\u00A0'}
                      </div>
                    ))}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
                    
                    {/* 右下角装饰 */}
                    <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      <Code size={16} className="text-cyber-purple" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 空状态 */}
        {filteredNotes.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="cyber-card max-w-md mx-auto p-8"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <FileText className="mx-auto text-cyber-purple" size={64} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {searchTerm ? '🔍 没有找到匹配的笔记' : '📝 还没有笔记'}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {searchTerm ? '尝试使用不同的搜索词或清空搜索条件' : '创建你的第一篇笔记，开始记录你的想法和灵感'}
              </p>
              {!searchTerm && (
                <motion.button
                  onClick={() => setIsCreating(true)}
                  className="cyber-button px-8 py-3 rounded-lg text-lg font-medium"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 30px rgba(189, 0, 255, 0.6)',
                    textShadow: '0 0 15px rgba(189, 0, 255, 0.8)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Plus size={20} className="mr-2" />
                  创建第一篇笔记
                  <Zap size={18} className="ml-2" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* 创建笔记模态框 */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cyber-modal w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* 模态框装饰边框 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 via-cyber-pink/20 to-cyber-blue/20 rounded-xl blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/10 to-blue-900/10 rounded-xl"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <motion.div
                        className="p-3 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 mr-4"
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Plus className="text-cyber-purple" size={24} />
                      </motion.div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                        新建笔记
                      </h2>
                    </div>
                    <motion.button
                      onClick={() => setIsCreating(false)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={24} />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <FileText size={16} className="mr-2 text-cyber-purple" />
                        标题
                      </label>
                      <input
                        type="text"
                        value={newNote.title}
                        onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                        className="cyber-input w-full px-4 py-3 text-lg font-medium"
                        placeholder="输入笔记标题..."
                        autoFocus
                      />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Folder size={16} className="mr-2 text-cyber-green" />
                          文件夹
                        </label>
                        <select
                          value={newNote.folder}
                          onChange={(e) => setNewNote(prev => ({ ...prev, folder: e.target.value }))}
                          className="cyber-input w-full px-4 py-3"
                        >
                          {folders.map(folder => (
                            <option key={folder} value={folder}>{folder}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Hash size={16} className="mr-2 text-cyber-blue" />
                          标签
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newNote.newTag}
                            onChange={(e) => setNewNote(prev => ({ ...prev, newTag: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && addTag(true)}
                            className="cyber-input flex-grow px-3 py-2"
                            placeholder="添加标签..."
                          />
                          <motion.button
                            onClick={() => addTag(true)}
                            className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 rounded-lg hover:bg-cyber-blue/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Hash size={16} />
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {newNote.tags.map((tag, index) => (
                              <motion.span
                                key={index}
                                className="text-xs bg-cyber-blue/20 text-cyber-blue px-3 py-1 rounded-full border border-cyber-blue/30 flex items-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                #{tag}
                                <button
                                  onClick={() => setNewNote(prev => ({
                                    ...prev,
                                    tags: prev.tags.filter((_, i) => i !== index)
                                  }))}
                                  className="ml-2 hover:text-red-400 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Code size={16} className="mr-2 text-cyber-pink" />
                        内容 (支持 Markdown 语法)
                      </label>
                      <textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                        className="cyber-textarea w-full px-4 py-4 font-mono resize-none"
                        rows={14}
                        placeholder="# 开始写作...

支持 Markdown 语法:
- **粗体文本**
- *斜体文本*
- `代码片段`
- [链接](URL)
- 列表项

```
代码块
```"
                      />
                    </motion.div>

                    <motion.div 
                      className="flex gap-4 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        onClick={handleCreateNote}
                        disabled={!newNote.title.trim()}
                        className="cyber-button flex-1 py-3 px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 0 30px rgba(189, 0, 255, 0.6)',
                          textShadow: '0 0 15px rgba(189, 0, 255, 0.8)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={20} className="mr-2" />
                        保存笔记
                        <Zap size={18} className="ml-2" />
                      </motion.button>
                      <motion.button
                        onClick={() => setIsCreating(false)}
                        className="cyber-button-secondary px-6 py-3 text-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        取消
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 编辑笔记模态框 */}
        <AnimatePresence>
          {editingNote && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cyber-modal w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* 模态框装饰边框 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 via-cyber-purple/20 to-cyber-green/20 rounded-xl blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/10 to-green-900/10 rounded-xl"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <motion.div
                        className="p-3 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 mr-4"
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Edit3 className="text-cyber-blue" size={24} />
                      </motion.div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-green bg-clip-text text-transparent">
                        编辑笔记
                      </h2>
                    </div>
                    <motion.button
                      onClick={() => setEditingNote(null)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={24} />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <FileText size={16} className="mr-2 text-cyber-blue" />
                        标题
                      </label>
                      <input
                        type="text"
                        value={editingNote?.title || ''}
                        onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                        className="cyber-input w-full px-4 py-3 text-lg font-medium"
                      />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Folder size={16} className="mr-2 text-cyber-green" />
                          文件夹
                        </label>
                        <select
                          value={editingNote?.folder || '默认'}
                          onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, folder: e.target.value }) : null)}
                          className="cyber-input w-full px-4 py-3"
                        >
                          {folders.map(folder => (
                            <option key={folder} value={folder}>{folder}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Hash size={16} className="mr-2 text-cyber-blue" />
                          标签
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={editingNote?.newTag || ''}
                            onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, newTag: e.target.value }) : null)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag(false)}
                            className="cyber-input flex-grow px-3 py-2"
                            placeholder="添加标签..."
                          />
                          <motion.button
                            onClick={() => addTag(false)}
                            className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 rounded-lg hover:bg-cyber-blue/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Hash size={16} />
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {editingNote?.tags.map((tag, index) => (
                              <motion.span
                                key={index}
                                className="text-xs bg-cyber-blue/20 text-cyber-blue px-3 py-1 rounded-full border border-cyber-blue/30 flex items-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                #{tag}
                                <button
                                  onClick={() => setEditingNote(prev => prev ? ({
                                    ...prev,
                                    tags: prev.tags.filter((_, i) => i !== index)
                                  }) : null)}
                                  className="ml-2 hover:text-red-400 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Code size={16} className="mr-2 text-cyber-green" />
                        内容 (支持 Markdown 语法)
                      </label>
                      <textarea
                        value={editingNote?.content || ''}
                        onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                        className="cyber-textarea w-full px-4 py-4 font-mono resize-none"
                        rows={14}
                      />
                    </motion.div>

                    <motion.div 
                      className="flex gap-4 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        onClick={handleUpdateNote}
                        className="cyber-button flex-1 py-3 px-6 text-lg font-semibold flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 0 30px rgba(0, 245, 255, 0.6)',
                          textShadow: '0 0 15px rgba(0, 245, 255, 0.8)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.2), rgba(0, 255, 135, 0.2))',
                          borderColor: 'rgba(0, 245, 255, 0.5)',
                          color: '#00f5ff'
                        }}
                      >
                        <Save size={20} className="mr-2" />
                        保存修改
                        <Star size={18} className="ml-2" />
                      </motion.button>
                      <motion.button
                        onClick={() => setEditingNote(null)}
                        className="cyber-button-secondary px-6 py-3 text-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        取消
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 创建文件夹模态框 */}
        <AnimatePresence>
          {isCreatingFolder && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cyber-modal w-full max-w-md relative"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* 模态框装饰边框 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/20 via-cyber-blue/20 to-cyber-purple/20 rounded-xl blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-green-900/10 to-blue-900/10 rounded-xl"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <motion.div
                        className="p-3 rounded-lg bg-cyber-green/20 border border-cyber-green/30 mr-4"
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FolderPlus className="text-cyber-green" size={24} />
                      </motion.div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
                        新建文件夹
                      </h2>
                    </div>
                    <motion.button
                      onClick={() => setIsCreatingFolder(false)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={24} />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Folder size={16} className="mr-2 text-cyber-green" />
                        文件夹名称
                      </label>
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                        className="cyber-input w-full px-4 py-3 text-lg"
                        placeholder="输入文件夹名称..."
                        autoFocus
                      />
                    </motion.div>

                    <motion.div 
                      className="flex gap-4 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim() || folders.includes(newFolderName)}
                        className="cyber-button flex-1 py-3 px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 0 30px rgba(0, 255, 135, 0.6)',
                          textShadow: '0 0 15px rgba(0, 255, 135, 0.8)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: 'linear-gradient(45deg, rgba(0, 255, 135, 0.2), rgba(0, 245, 255, 0.2))',
                          borderColor: 'rgba(0, 255, 135, 0.5)',
                          color: '#00ff87'
                        }}
                      >
                        <FolderPlus size={20} className="mr-2" />
                        创建文件夹
                        <Zap size={18} className="ml-2" />
                      </motion.button>
                      <motion.button
                        onClick={() => setIsCreatingFolder(false)}
                        className="cyber-button-secondary px-6 py-3 text-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        取消
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MDNoteManager;
