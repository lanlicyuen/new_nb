import { useState, useEffect } from 'react';
import { Plus, Brain, BarChart3, List } from 'lucide-react';
import { AddToolForm } from './components/AddToolForm';
import { Stats } from './components/Stats';
import { ToolList } from './components/ToolList';
import type { AITool, ViewMode } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './utils';

function App() {
  console.log('App组件开始渲染（使用CSS类版本）...');

  const [tools, setTools] = useState<AITool[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingTool, setEditingTool] = useState<AITool | null>(null);

  // Load tools from localStorage on component mount
  useEffect(() => {
    const savedTools = loadFromLocalStorage<AITool[]>('ai-tools', []);
    console.log('从localStorage加载工具:', savedTools);
    
    // If no saved tools, add some sample data
    if (savedTools.length === 0) {
      const sampleTools: AITool[] = [
        {
          id: 'sample-1',
          name: 'ChatGPT Plus',
          purchaseDate: '2024-01-15',
          feeType: 'monthly',
          expirationDate: '2025-01-15',
          features: ['程式碼生成', '文本創作', '問題解答', '語言翻譯'],
          cost: 20
        },
        {
          id: 'sample-2',
          name: 'Cursor Pro',
          purchaseDate: '2024-06-01',
          feeType: 'monthly',
          expirationDate: '2025-06-01',
          features: ['AI程式碼補全', '智能重構', '程式碼解釋', '調試輔助'],
          cost: 20
        }
      ];
      setTools(sampleTools);
      saveToLocalStorage('ai-tools', sampleTools);
    } else {
      setTools(savedTools);
    }
  }, []);

  // Save tools to localStorage whenever tools change
  useEffect(() => {
    console.log('保存工具到localStorage:', tools);
    saveToLocalStorage('ai-tools', tools);
  }, [tools]);

  const handleAddTool = (tool: AITool) => {
    if (editingTool) {
      // Update existing tool
      setTools(prev => prev.map(t => t.id === tool.id ? tool : t));
      setEditingTool(null);
    } else {
      // Add new tool
      setTools(prev => [...prev, tool]);
    }
    setIsAddFormOpen(false);
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setIsAddFormOpen(true);
  };

  const handleDeleteTool = (toolId: string) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
  };

  const openAddForm = () => {
    setEditingTool(null);
    setIsAddFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* Header */}
      <header className="glass-card border-b border-cyber-blue/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">AI 工具管理器</h1>
                <p className="text-sm text-gray-400">數字化智能工具筆記本</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-cyber-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mindmap')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'mindmap' 
                      ? 'bg-cyber-blue text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={openAddForm}
                className="cyber-button flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加工具
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Panel */}
        <Stats tools={tools} />

        {/* Tools View */}
        <div className="mt-6">
          {viewMode === 'list' ? (
            <ToolList 
              tools={tools}
              onEditTool={handleEditTool}
              onDeleteTool={handleDeleteTool}
            />
          ) : (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gradient mb-4">思維導圖視圖</h2>
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>思維導圖功能開發中...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Tool Form */}
      <AddToolForm
        isOpen={isAddFormOpen}
        onClose={() => {
          setIsAddFormOpen(false);
          setEditingTool(null);
        }}
        onSubmit={handleAddTool}
        editingTool={editingTool}
      />
    </div>
  );
}

export default App;
