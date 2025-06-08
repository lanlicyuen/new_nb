// 整合版应用 - 集成MD Note和AI Tools Manager
import { useState, useEffect } from 'react';
import { Plus, Brain, List, BarChart3, FileText, LogIn, LogOut, Settings } from 'lucide-react';

// 通用接口
interface User {
  id: number;
  username: string;
  token: string;
}

// AI工具接口
interface AITool {
  id: number;
  name: string;
  purchase_date: string;
  fee_type: 'monthly' | 'yearly';
  fee_amount: number;
  features: string[];
  created_at: string;
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

// API服务类
class APIService {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An unexpected error occurred'
      }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth API
  login(username: string, password: string) {
    return this.request('/api/auth/login', 'POST', { username, password });
  }

  logout() {
    return this.request('/api/auth/logout', 'POST');
  }

  getProfile() {
    return this.request('/api/auth/profile');
  }

  // AI Tools API
  getAllTools() {
    return this.request('/api/tools');
  }

  addTool(tool: Omit<AITool, 'id' | 'created_at'>) {
    return this.request('/api/tools', 'POST', tool);
  }

  deleteTool(id: number) {
    return this.request(`/api/tools/${id}`, 'DELETE');
  }

  getToolsStats() {
    return this.request('/api/tools/stats');
  }

  // MD Notes API
  getNotes() {
    return this.request('/api/documents');
  }
}

// 简化的认证组件
function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-header">
          <h2 className="text-cyber-blue">登录系统</h2>
        </div>
        <form onSubmit={handleSubmit} className="card-content">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              required
            />
          </div>
          
          <button type="submit" className="cyber-button">
            <LogIn size={16} />
            登录
          </button>
        </form>
      </div>
    </div>
  );
}

// 简化的加载器组件
function Loader() {
  return (
    <div className="loader-container">
      <div className="cyber-spinner"></div>
      <p className="text-cyber-blue">加载中...</p>
    </div>
  );
}

// 主应用组件
function AppIntegrated() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai-tools' | 'md-notes'>('ai-tools');
  const [showAddForm, setShowAddForm] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // API实例
  const api = new APIService('http://localhost:5000');

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          api.setToken(token);
          const userData = await api.getProfile();
          setUser({
            id: userData.id,
            username: userData.username,
            token: token
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        api.clearToken();
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录处理
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login(username, password);
      api.setToken(response.token);
      setUser({
        id: response.user_id,
        username: username,
        token: response.token
      });
      setActiveTab('ai-tools');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 登出处理
  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.clearToken();
      setUser(null);
      setLoading(false);
    }
  };

  // 加载中状态
  if (initializing) {
    return <Loader />;
  }

  // 未登录状态
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 已登录状态 - 将在后续实现AI工具管理和MD文档管理组件
  return (
    <div className="app-container">
      {/* 导航栏 */}
      <nav className="cyber-nav">
        <div className="logo">
          <Brain size={24} />
          <span>赛博朋克管理系统</span>
        </div>
        
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'ai-tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-tools')}
          >
            <BarChart3 size={18} />
            AI工具
          </button>
          
          <button
            className={`tab-button ${activeTab === 'md-notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('md-notes')}
          >
            <FileText size={18} />
            文档管理
          </button>
        </div>
        
        <div className="user-actions">
          <span className="username">
            <Settings size={16} />
            {user.username}
          </span>
          
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            退出
          </button>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="main-content">
        {activeTab === 'ai-tools' ? (
          <div className="ai-tools-container">
            {/* AI工具管理组件将在这里实现 */}
            <h2 className="text-cyber-blue">AI工具管理</h2>
            <p>此部分将集成AI工具管理功能</p>
          </div>
        ) : (
          <div className="md-notes-container">
            {/* MD文档管理组件将在这里实现 */}
            <h2 className="text-cyber-purple">Markdown文档管理</h2>
            <p>此部分将集成MD文档管理功能</p>
            <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer" className="cyber-button">
              <FileText size={16} />
              打开原始MD文档系统
            </a>
          </div>
        )}
      </div>

      {/* 悬浮操作按钮 */}
      <button 
        className="add-button"
        onClick={() => setShowAddForm(true)}
        title={activeTab === 'ai-tools' ? "添加AI工具" : "添加文档"}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

export default AppIntegrated;
