import { useState, useEffect } from 'react';
import { Plus, Brain } from 'lucide-react';
import type { AITool } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/minimal';

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

  console.log('App渲染中，工具数量:', tools.length);

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
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gradient mb-4">工具统计</h2>
          <p className="text-gray-400">总工具数量: {tools.length}</p>
          <p className="text-gray-400">总费用: ${tools.reduce((sum, tool) => sum + tool.cost, 0)}</p>
        </div>

        <div className="mt-8 glass-card p-6">
          <h2 className="text-xl font-bold text-gradient mb-4">工具列表</h2>
          {tools.length === 0 ? (
            <p className="text-gray-400">暂无工具</p>
          ) : (
            <div className="space-y-4">
              {tools.map(tool => (
                <div key={tool.id} className="border border-cyber-blue/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyber-blue">{tool.name}</h3>
                  <p className="text-gray-400">费用: ${tool.cost} ({tool.feeType})</p>
                  <p className="text-gray-400">到期: {tool.expirationDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
