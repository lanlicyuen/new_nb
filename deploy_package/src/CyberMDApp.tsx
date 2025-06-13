// filepath: /Users/lanlic/Desktop/vs_web/src/CyberMDApp.tsx
// 集成版应用 - 1PLab OS - PostgreSQL版本
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Brain, BarChart3, FileText, LogOut, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import AIToolsManagerIntegrated from './components/AIToolsManagerIntegrated';
import MDNoteManager from './components/MDNoteManager';
import { DataMigrationTool } from './components/DataMigrationTool';
import InspirationCapture from './components/InspirationCapture';
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
  const [activeSection, setActiveSection] = useState<'tools' | 'notes' | 'inspiration' | 'migration'>('tools');
  
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
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  }, []);
  
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

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + 数字键快速切换功能
      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveSection('tools');
            showToast('已切换到 AI工具管理', 'info');
            break;
          case '2':
            event.preventDefault();
            setActiveSection('notes');
            showToast('已切换到 MD笔记', 'info');
            break;
          case '3':
            event.preventDefault();
            setActiveSection('inspiration');
            showToast('已切换到 闪灵', 'info');
            break;
          case '4':
            event.preventDefault();
            setActiveSection('migration');
            showToast('已切换到 数据迁移', 'info');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

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
      <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700/50 flex flex-col shadow-2xl relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-pink/10 rounded-full blur-3xl transform -translate-x-16 translate-y-16 pointer-events-none"></div>
        
        {/* Logo 和标题 */}
        <motion.div 
          className="p-6 border-b border-gray-700/50 relative z-10 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setActiveSection('tools')}
          title="返回首页"
        >
          <div className="flex items-center group">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-cyber-blue/50"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent group-hover:from-cyber-purple group-hover:to-cyber-pink transition-all duration-300">
                1PLab OS
              </h1>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">智能工作环境</p>
            </div>
          </div>
        </motion.div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-6">
          {/* 在线状态指示器 */}
          <motion.div 
            className="text-center px-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="bg-cyber-green/20 text-cyber-green text-xs py-2 px-3 rounded-full inline-flex items-center border border-cyber-green/30 status-pulse">
              <span className="mr-2 animate-pulse">●</span> 
              <span className="font-medium">系统在线</span>
            </div>
          </motion.div>

          {/* 导航菜单项 */}
          <ul className="space-y-2 px-2">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('tools')}
                className={`w-full flex items-center px-4 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden sidebar-nav-button ${
                  activeSection === 'tools' 
                  ? 'nav-active text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-700/30 hover:text-white hover:border-gray-600/50 border border-transparent'
                }`}
                title="管理AI工具和服务"
              >
                <BarChart3 className={`w-6 h-6 mr-3 nav-icon transition-colors duration-300 ${
                  activeSection === 'tools' ? 'text-cyber-blue' : 'group-hover:text-cyber-blue'
                }`} />
                <div className="flex-1 text-left">
                  <span className="font-medium block">AI工具管理</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">管理和监控AI服务</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-400 mr-2">Alt+1</span>
                {activeSection === 'tools' && (
                  <motion.div 
                    className="absolute right-2 w-2 h-2 bg-cyber-blue rounded-full status-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('notes')}
                className={`w-full flex items-center px-4 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden sidebar-nav-button ${
                  activeSection === 'notes' 
                  ? 'nav-active text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-700/30 hover:text-white hover:border-gray-600/50 border border-transparent'
                }`}
                title="编写和管理Markdown笔记"
              >
                <FileText className={`w-6 h-6 mr-3 nav-icon transition-colors duration-300 ${
                  activeSection === 'notes' ? 'text-cyber-purple' : 'group-hover:text-cyber-purple'
                }`} />
                <div className="flex-1 text-left">
                  <span className="font-medium block">MD笔记</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">Markdown文档编辑</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-400 mr-2">Alt+2</span>
                {activeSection === 'notes' && (
                  <motion.div 
                    className="absolute right-2 w-2 h-2 bg-cyber-purple rounded-full status-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('inspiration')}
                className={`w-full flex items-center px-4 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden sidebar-nav-button ${
                  activeSection === 'inspiration' 
                  ? 'nav-active text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-700/30 hover:text-white hover:border-gray-600/50 border border-transparent'
                }`}
                title="快速捕捉灵感和创意想法"
              >
                <Zap className={`w-6 h-6 mr-3 nav-icon transition-colors duration-300 ${
                  activeSection === 'inspiration' ? 'text-cyber-pink animate-pulse' : 'group-hover:text-cyber-pink'
                }`} />
                <div className="flex-1 text-left">
                  <span className="font-medium block">闪灵</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">灵感捕捉系统</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">Alt+3</span>
                  <span className="text-xs bg-cyber-pink/20 text-cyber-pink px-2 py-0.5 rounded-full border border-cyber-pink/30">
                    ✨
                  </span>
                </div>
                {activeSection === 'inspiration' && (
                  <motion.div 
                    className="absolute right-2 w-2 h-2 bg-cyber-pink rounded-full status-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <button 
                onClick={() => setActiveSection('migration')}
                className={`w-full flex items-center px-4 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden sidebar-nav-button ${
                  activeSection === 'migration' 
                  ? 'nav-active text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-700/30 hover:text-white hover:border-gray-600/50 border border-transparent'
                }`}
                title="数据库迁移和备份工具"
              >
                <Database className={`w-6 h-6 mr-3 nav-icon transition-colors duration-300 ${
                  activeSection === 'migration' ? 'text-cyber-green' : 'group-hover:text-cyber-green'
                }`} />
                <div className="flex-1 text-left">
                  <span className="font-medium block">数据迁移</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">PostgreSQL数据库</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-400 mr-2">Alt+4</span>
                {activeSection === 'migration' && (
                  <motion.div 
                    className="absolute right-2 w-2 h-2 bg-cyber-green rounded-full status-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            </motion.li>
          </ul>

          {/* 版本信息 */}
          <motion.div 
            className="mt-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <div className="border-t border-gray-700/30 pt-4">
              <div className="text-center mb-3">
                <div className="text-xs text-gray-500 mb-2">1PLab OS</div>
                <div className="text-xs font-medium text-cyber-blue version-badge px-3 py-2 rounded-lg inline-block">
                  v2.0.0 - PostgreSQL
                </div>
              </div>
              
              {/* 快捷键提示 */}
              <motion.div 
                className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <div className="text-xs text-gray-400 mb-2 font-medium">快捷键</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Alt + 1</span>
                    <span>AI工具</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + 2</span>
                    <span>MD笔记</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + 3</span>
                    <span>闪灵</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + 4</span>
                    <span>数据迁移</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </nav>

        {/* 用户信息和登出 */}
        <motion.div 
          className="p-4 border-t border-gray-700/50 bg-gray-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {/* 用户信息卡片 */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-3 border border-gray-700/30 user-avatar">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center mr-3 user-avatar">
                  <span className="text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-400">系统管理员</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 bg-cyber-green rounded-full mr-1 status-pulse">
                  <span className="absolute inset-0 bg-cyber-green rounded-full animate-ping opacity-75"></span>
                </span>
                <span className="text-xs text-cyber-green font-medium">在线</span>
              </div>
            </div>
          </div>

          {/* 登出按钮 */}
          <motion.button 
            onClick={handleLogout}
            className="logout-button flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 w-full bg-gray-800/50 hover:bg-red-500/20 hover:border-red-500/50 p-3 rounded-lg border border-gray-700/30 hover:shadow-lg group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300 group-hover:text-red-400" />
            <span className="font-medium group-hover:text-red-400">安全退出</span>
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
          ) : activeSection === 'inspiration' ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="mr-3 text-cyber-pink" />
                闪灵 - 灵感捕捉
              </h2>
              <InspirationCapture />
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
