import { useState, useEffect } from 'react';
import { Plus, Brain } from 'lucide-react';
import type { AITool } from './types';
import { ToolList } from './components/ToolList';
import { AddToolForm } from './components/AddToolForm';
import { Stats } from './components/Stats';
import { saveToLocalStorage, loadFromLocalStorage } from './utils';

// Sample data
const sampleTools: AITool[] = [
  {
    id: '1',
    name: 'x.com Premium',
    purchaseDate: '2025-06-07',
    feeType: 'yearly',
    expirationDate: '2026-06-07',
    features: ['繪圖', '寫程式碼', '搜尋新聞', '過濾帖子'],
    cost: 96
  },
  {
    id: '2',
    name: 'Cursor',
    purchaseDate: '2025-05-01',
    feeType: 'monthly',
    expirationDate: '2025-06-01',
    features: ['程式設計', 'AI 輔助程式碼生成', '智能補全'],
    cost: 20
  }
];

function App() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTools = loadFromLocalStorage<AITool[]>('ai-tools', sampleTools);
    setTools(savedTools);
  }, []);

  // Save to localStorage whenever tools change
  useEffect(() => {
    if (tools.length > 0) {
      saveToLocalStorage('ai-tools', tools);
    }
  }, [tools]);

  const handleAddTool = (tool: AITool) => {
    if (editingTool) {
      setTools(prev => prev.map(t => t.id === tool.id ? tool : t));
      setEditingTool(null);
    } else {
      setTools(prev => [...prev, tool]);
    }
    setShowAddForm(false);
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setShowAddForm(true);
  };

  const handleDeleteTool = (id: string) => {
    if (window.confirm('確定要刪除這個工具嗎？')) {
      setTools(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingTool(null);
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
              {/* Add tool button */}
              <button
                onClick={() => setShowAddForm(true)}
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
        {/* Stats */}
        <Stats tools={tools} />

        {/* Tool List */}
        <div className="mt-8">
          <ToolList
            tools={tools}
            onEditTool={handleEditTool}
            onDeleteTool={handleDeleteTool}
          />
        </div>
      </main>

      {/* Add/Edit Tool Form Modal */}
      <AddToolForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        onSubmit={handleAddTool}
        editingTool={editingTool}
      />
    </div>
  );
}

export default App;
