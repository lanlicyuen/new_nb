// 炫酷的赛博朋克风格登陆页面
import { useState } from 'react';
import { LogIn, Terminal, FileText, Database, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  isLoading: boolean;
  // 我们不添加Toast相关的props，因为Toast通知已经在CyberMDApp中处理
  // 如果登录页面需要显示通知，应在CyberMDApp中处理
}

const LandingPage = ({ onLogin, error, isLoading }: LandingPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center relative overflow-hidden">
      {/* 动态背景粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主要光晕 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-pink/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* 浮动粒子 */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyber-green rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-cyber-blue rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-cyber-pink rounded-full animate-bounce delay-2000"></div>
        
        {/* 扫描线效果 */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent top-1/3 animate-pulse"></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyber-purple/20 to-transparent top-2/3 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* 旋转光环 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyber-blue/10 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyber-purple/10 rounded-full animate-spin-reverse-slow"></div>
      </div>
      
      {/* 炫酷的标题动画 */}
      <motion.div 
        className="mt-16 mb-12 text-center relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 cyberpunk-text relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue/90 via-cyber-purple/80 to-cyber-pink/70 tracking-wide">
            1PLab OS
          </span>
          {/* 更柔和的标题光晕效果 */}
          <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-cyber-blue/10 blur-2xl animate-pulse-slow">
            1PLab OS
          </div>
          {/* 添加细微的边框效果 */}
          <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-cyber-blue/30 via-cyber-purple/20 to-cyber-pink/30 bg-clip-text blur-sm">
            1PLab OS
          </div>
        </h1>
        <motion.div 
          className="text-2xl text-cyber-green glow-text-sm font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          一个人的实验室
        </motion.div>
        <motion.div 
          className="text-sm text-gray-400 mt-2 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Next Generation AI Tools Management Platform
        </motion.div>
      </motion.div>

      {/* 特色功能展示 */}
      {!showLogin && (
        <motion.div 
          className="w-full max-w-4xl mb-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<FileText className="w-8 h-8 text-cyber-blue" />}
              title="Markdown文档"
              description="管理和编辑你的所有Markdown文档"
              status="开发中"
            />
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-cyber-purple" />}
              title="AI工具管理"
              description="追踪你的AI服务订阅和到期时间"
              status="可用"
            />
            <FeatureCard 
              icon={<Terminal className="w-8 h-8 text-cyber-pink" />}
              title="交互式思维导图"
              description="可视化你的AI工具生态系统"
              status="开发中"
            />
            <FeatureCard 
              icon={<Database className="w-8 h-8 text-cyber-green" />}
              title="数据安全性"
              description="所有数据安全加密存储"
              status="规划中"
            />
          </div>
          <div className="text-center mt-6 text-xs text-gray-500">
            注意：部分功能模块仍在开发中，目前仅AI工具管理模块可供完整使用
          </div>
        </motion.div>
      )}

      {/* 登录表单或登录按钮 */}
      <motion.div 
        className="w-full flex justify-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {!showLogin ? (
          <motion.button
            className="py-4 px-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg text-white font-bold text-xl hover:shadow-glow-blue transition-all duration-300 flex items-center justify-center relative overflow-hidden group shadow-2xl hover:shadow-cyber-blue/50"
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: "0 0 40px rgba(0, 245, 255, 0.5), 0 0 80px rgba(189, 0, 255, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
          >
            {/* 按钮内光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* 扫描线效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            
            {/* 边框发光 */}
            <div className="absolute inset-0 border border-cyber-blue/50 rounded-lg group-hover:border-cyber-blue transition-all duration-300"></div>
            
            <LogIn className="mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" size={24} />
            <span className="relative z-10 tracking-wide">进入系统</span>
          </motion.button>
        ) : (
          <motion.div
            className="glassmorphism border border-cyber-blue/40 p-8 rounded-xl shadow-glow-blue w-96 h-auto relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            {/* 登录框背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5 rounded-xl"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-20 rounded-xl"></div>
            
            {/* 闪烁边框 */}
            <div className="absolute inset-0 border border-cyber-blue/20 rounded-xl animate-pulse"></div>
            
            {/* 标题发光效果 */}
            <div className="relative z-10 mb-8">
              <motion.h2 
                className="text-2xl font-semibold text-white text-center relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                系统登录
                <div className="absolute inset-0 text-2xl font-semibold text-cyber-blue/30 blur-md">
                  系统登录
                </div>
              </motion.h2>
              <motion.div 
                className="w-12 h-0.5 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mt-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              ></motion.div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <label htmlFor="username" className="block text-cyber-green mb-2 text-sm font-medium">用户名</label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-800/70 border border-gray-700 focus:border-cyber-blue text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all duration-300 hover:bg-gray-800/90 focus:shadow-glow-sm"
                    placeholder="输入用户名"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <label htmlFor="password" className="block text-cyber-green mb-2 text-sm font-medium">密码</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800/70 border border-gray-700 focus:border-cyber-blue text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all duration-300 hover:bg-gray-800/90 focus:shadow-glow-sm"
                    placeholder="输入密码"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
              
              {/* 验证码输入框 - 预留位置 */}
              {/* 
              <div>
                <label htmlFor="captcha" className="block text-cyber-green mb-2 text-sm font-medium">验证码</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="captcha"
                    className="flex-1 bg-gray-800/50 border border-gray-700 focus:border-cyber-blue text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all duration-300"
                    placeholder="输入验证码"
                    required
                  />
                  <div className="w-24 h-12 bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-center text-xs text-gray-400">
                    验证码
                  </div>
                </div>
              </div>
              */}
              
              {error && (
                <motion.div 
                  className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/30 p-3 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg text-white font-medium text-lg ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-glow-blue hover:shadow-lg"
                } transition-all duration-300 flex items-center justify-center relative overflow-hidden group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {/* 按钮发光背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                {/* 按钮扫描效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">登录中...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">登录</span>
                  </>
                )}
              </motion.button>
            </form>
            
            {/* 返回按钮 */}
            <motion.div 
              className="mt-6 text-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <motion.button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-cyber-blue text-sm transition-all duration-300 hover:underline flex items-center justify-center mx-auto group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1 group-hover:-translate-x-1 transition-transform duration-300">←</span>
                返回首页
              </motion.button>
            </motion.div>
            
            {/* 测试账号提示 */}
            <motion.div 
              className="mt-4 text-center relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:bg-gray-800/70 transition-colors duration-300">
                <div className="text-cyber-green mb-1 font-medium">测试账号：</div>
                <div className="space-y-1">
                  <div>admin / admin123</div>
                  <div>test / test123</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* 页脚 */}
      <footer className="mt-auto py-8 text-center text-gray-400 text-sm relative z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyber-blue"></div>
            <span className="mx-4 text-cyber-blue">◆</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyber-blue"></div>
          </div>
          <p className="mb-2">© 2025 1PLab OS - 一个人的实验室</p>
          <p className="text-xs text-gray-500">Powered by AI • Built with React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
};

// 特色功能卡片组件
const FeatureCard = ({ 
  icon, 
  title, 
  description,
  status = "开发中"
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  status?: "可用" | "开发中" | "规划中";
}) => {
  const getStatusStyle = () => {
    switch(status) {
      case "可用":
        return "bg-cyber-green/20 text-cyber-green border-cyber-green/30";
      case "开发中":
        return "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30";
      case "规划中":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  
  return (
    <motion.div 
      className="glassmorphism border border-gray-700/50 p-6 rounded-xl text-center relative overflow-hidden group"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 0 30px rgba(0, 245, 255, 0.2)' 
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      {/* 卡片背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      {/* 状态标签 */}
      <div className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full border ${getStatusStyle()}`}>
        {status}
      </div>
      
      {/* 图标容器 */}
      <div className="flex justify-center mb-4 relative z-10">
        <div className="p-3 rounded-full bg-gray-800/50 group-hover:bg-gray-700/70 transition-colors duration-300">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3 relative z-10 group-hover:text-cyber-blue transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
      
      {/* 悬停光效 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </motion.div>
  );
};

export default LandingPage;
