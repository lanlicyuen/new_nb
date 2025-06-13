// filepath: /Users/lanlic/Desktop/vs_web/src/CyberMDApp.tsx
// 集成版应用 - 1PLab OS - PostgreSQL版本
import { useState, useEffect, useMemo } from 'react';
import { Brain, BarChart3, FileText, LogOut, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AIToolsManagerIntegrated from './components/AIToolsManagerIntegrated';
import MDNoteManager from './components/MDNoteManager';
import DataMigrationTool from './components/DataMigrationTool';
import Toast from './components/Toast';

// 通用接口
interface User {
  id: number;
  username: string;
  token: string;
}

// 简化的认证服务
class AuthService {
  private token: string | null;

  constructor() {
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

  async login(username: string, password: string): Promise<User> {
    // 模拟API调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          const user = {
            id: 1,
            username: username,
            token: 'mock-jwt-token-' + Date.now()
          };
          this.setToken(user.token);
          localStorage.setItem('current_user', JSON.stringify(user));
          resolve(user);
        } else if (username === 'test' && password === 'test123') {
          const user = {
            id: 2,
            username: username,
            token: 'mock-jwt-token-' + Date.now()
          };
          this.setToken(user.token);
          localStorage.setItem('current_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('用户名或密码错误'));
        }
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.clearToken();
        localStorage.removeItem('current_user');
        resolve();
      }, 300);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;
    
    try {
      if (this.token.startsWith('mock-jwt-token-')) {
        const storedUser = localStorage.getItem('current_user');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
        this.clearToken();
        return null;
      }
      return null;
    } catch (error) {
      console.error("获取当前用户失败:", error);
      this.clearToken();
      return null;
    }
  }
}

// 主应用组件
function CyberMDApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'tools' | 'notes' | 'migration'>('tools');
  
  // Toast通知状态
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false
  });

  // 创建认证服务实例
  const authService = useMemo(() => new AuthService(), []);

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authService]);

  // 显示Toast通知
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };
  
  // 关闭Toast通知
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // 处理登录
  const handleLogin = async (username: string, password: string) => {
    setLoginError(null);
    setLoading(true);
    
    try {
      const user = await authService.login(username, password);
      setUser(user);
      // 显示登录成功的提示，包含更丰富的信息
      const currentTime = new Date();
      const greeting = currentTime.getHours() < 12 ? '早上好' : 
                       currentTime.getHours() < 18 ? '下午好' : '晚上好';
      showToast(`${greeting}，${username}！登录成功 · 1PLab OS 已准备就绪`, 'success');
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("登录失败，请检查用户名和密码");
      // 登录失败时显示错误通知
      showToast("登录失败，请检查用户名和密码", 'error');
      // 确保登录失败时不会跳转到主页
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      const username = user?.username;
      await authService.logout();
      setUser(null);
      setActiveSection('tools');
      // 显示登出成功的通知
      showToast(`${username || '用户'}已安全登出系统`, 'info');
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("登出失败，请稍后重试", 'error');
    }
  };

  // 如果正在加载，显示加载界面
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-cyber-blue text-2xl">
          <svg className="animate-spin mr-3 h-10 w-10 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </div>
      </div>
    );
  }

  // 如果未登录，显示登录页面
  if (!user) {
    return (
      <>
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
          duration={4000}
        />
        <LandingPage
          onLogin={handleLogin}
          error={loginError}
          isLoading={loading}
        />
      </>
    );
  }

  // 已登录用户界面
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Toast通知 */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
      
      {/* 侧边导航 */}
      <div className="w-16 md:w-64 bg-gray-800/50 glassmorphism border-r border-gray-700/50 flex flex-col">
        {/* Logo */}
        <motion.div 
          className="p-4 border-b border-gray-700/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple hidden md:block">
            1PLab OS
          </h1>
          <div className="flex justify-center md:hidden">
            <Brain className="text-cyber-blue" />
          </div>
        </motion.div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4">
          <motion.div 
            className="text-center px-4 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="bg-cyber-green/20 text-cyber-green text-xs py-1 px-2 rounded-full inline-flex items-center">
              <span className="mr-1 animate-pulse">●</span> 在线
            </div>
          </motion.div>
          <ul>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('tools')}
                className={`w-full flex items-center p-3 md:px-6 md:py-3 ${
                  activeSection === 'tools' 
                  ? 'bg-cyber-blue/20 border-l-2 border-cyber-blue text-white shadow-glow-sm' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                } transition-all duration-300`}
              >
                <BarChart3 className="w-5 h-5 md:mr-3" />
                <span className="hidden md:inline">AI工具管理</span>
              </button>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('notes')}
                className={`w-full flex items-center p-3 md:px-6 md:py-3 ${
                  activeSection === 'notes' 
                  ? 'bg-cyber-purple/20 border-l-2 border-cyber-purple text-white shadow-glow-sm' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                } transition-all duration-300`}
              >
                <FileText className="w-5 h-5 md:mr-3" />
                <span className="hidden md:inline">MD笔记</span>
              </button>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('migration')}
                className={`w-full flex items-center p-3 md:px-6 md:py-3 ${
                  activeSection === 'migration' 
                  ? 'bg-cyber-pink/20 border-l-2 border-cyber-pink text-white shadow-glow-sm' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                } transition-all duration-300`}
              >
                <Database className="w-5 h-5 md:mr-3" />
                <span className="hidden md:inline">数据迁移</span>
              </button>
            </motion.li>
          </ul>
          <motion.div 
            className="mt-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="border-t border-gray-700/30 pt-4 text-xs text-center text-gray-500">
              1PLab OS v2.0.0 - PostgreSQL
            </div>
          </motion.div>
        </nav>

        {/* 用户信息 */}
        <motion.div 
          className="p-4 border-t border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <div className="hidden md:flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-sm text-cyber-green font-medium">
                {user.username} 
              </span>
              <span className="inline-block w-2 h-2 bg-cyber-green rounded-full ml-1.5 relative">
                <span className="absolute inset-0 bg-cyber-green rounded-full animate-ping opacity-75"></span>
              </span>
            </div>
            <span className="text-xs bg-cyber-green/20 text-cyber-green px-2 py-0.5 rounded-full border border-cyber-green/30">在线</span>
          </div>
          <motion.button 
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-white transition-all duration-300 w-full justify-center md:justify-start bg-gray-800/50 hover:bg-gray-700/80 p-2 rounded hover:shadow-glow-sm group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 md:mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden md:inline">退出登录</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        {/* 根据当前选择的部分显示不同内容 */}
        <div className="p-6">
          {activeSection === 'tools' ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">AI工具管理</h2>
              <AIToolsManagerIntegrated />
            </div>
          ) : activeSection === 'notes' ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Markdown笔记</h2>
              <MDNoteManager />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">数据迁移工具</h2>
              <DataMigrationTool />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CyberMDApp;
