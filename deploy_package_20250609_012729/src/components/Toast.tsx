// 炫酷的通知Toast组件
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

const Toast = ({ message, type, duration = 3000, onClose, isVisible }: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const progressIntervalRef = useRef<number | null>(null);
  
  // 设置自动关闭计时器和进度条
  useEffect(() => {
    if (isVisible && duration > 0) {
      // 重置进度
      setProgress(100);
      
      // 设置进度条更新的间隔
      const intervalStep = 10; // 每10ms更新一次
      const decrementAmount = (intervalStep / duration) * 100;
      
      // 启动进度条
      const intervalId = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.max(prev - decrementAmount, 0);
          return newProgress;
        });
      }, intervalStep);
      
      // 存储interval ID以便清理
      progressIntervalRef.current = intervalId;
      
      // 设置关闭计时器
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isVisible, duration, onClose]);

  // 根据类型设置不同样式
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-cyber-green/20 border-cyber-green',
          icon: <Check className="w-5 h-5 text-cyber-green" />,
          text: 'text-cyber-green'
        };
      case 'error':
        return {
          bg: 'bg-red-500/20 border-red-500',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          text: 'text-red-500'
        };
      case 'info':
        return {
          bg: 'bg-cyber-blue/20 border-cyber-blue',
          icon: <Info className="w-5 h-5 text-cyber-blue" />,
          text: 'text-cyber-blue'
        };
      default:
        return {
          bg: 'bg-cyber-blue/20 border-cyber-blue',
          icon: <Info className="w-5 h-5 text-cyber-blue" />,
          text: 'text-cyber-blue'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <div className={`${styles.bg} border glassmorphism px-6 py-4 rounded-lg shadow-glow-sm flex items-center relative overflow-hidden`}>
            {/* 背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-20"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 闪光边框效果 */}
            <div className="absolute inset-0 border border-white/10 rounded-lg"></div>
            <div className="absolute inset-0 animate-pulse-slow opacity-30 rounded-lg" style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'pulse 2s infinite'
            }}></div>
            
            {/* 进度条 */}
            <div className="absolute bottom-0 left-0 h-1 bg-gray-700/50 w-full">
              <motion.div 
                className={`h-full ${type === 'success' ? 'bg-cyber-green' : type === 'error' ? 'bg-red-500' : 'bg-cyber-blue'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
            
            {/* 内容 */}
            <div className="mr-3 relative z-10">
              {styles.icon}
            </div>
            <p className={`${styles.text} font-medium relative z-10`}>{message}</p>
            <button
              onClick={onClose}
              className="ml-6 text-gray-400 hover:text-white focus:outline-none relative z-10 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
