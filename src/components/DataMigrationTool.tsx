import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart3, FileText, DollarSign, Zap } from 'lucide-react';
import { postgresAPI } from '../services/PostgreSQLAPI';

interface MigrationStatus {
  status: 'idle' | 'checking' | 'migrating' | 'success' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

interface DatabaseStats {
  ai_tools_count: number;
  md_notes_count: number;
  total_costs: {
    monthly: number;
    yearly: number;
    one_time: number;
  };
}

export const DataMigrationTool: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    status: 'idle',
    message: '准备检查数据库连接...'
  });

  const [dbHealth, setDbHealth] = useState<{
    connected: boolean;
    message: string;
  }>({
    connected: false,
    message: '未检查'
  });

  // 检查数据库连接
  const checkDatabaseConnection = async () => {
    setMigrationStatus({
      status: 'checking',
      message: '正在检查数据库连接...'
    });

    try {
      const isConnected = await postgresAPI.testConnection();
      if (isConnected) {
        const health = await postgresAPI.healthCheck();
        setDbHealth({
          connected: true,
          message: '数据库连接正常'
        });
        setMigrationStatus({
          status: 'idle',
          message: '数据库连接成功，可以开始迁移数据',
          details: health.data
        });
      } else {
        setDbHealth({
          connected: false,
          message: '数据库连接失败'
        });
        setMigrationStatus({
          status: 'error',
          message: '无法连接到数据库，请检查后端服务是否启动'
        });
      }
    } catch (error) {
      setDbHealth({
        connected: false,
        message: '连接检查出错'
      });
      setMigrationStatus({
        status: 'error',
        message: `数据库连接检查失败: ${error}`
      });
    }
  };

  // 执行数据迁移
  const performMigration = async () => {
    setMigrationStatus({
      status: 'migrating',
      message: '正在迁移 localStorage 数据到 PostgreSQL...'
    });

    try {
      const result = await postgresAPI.migrateFromLocalStorage();
      
      if (result.data) {
        setMigrationStatus({
          status: 'success',
          message: '数据迁移完成！',
          details: result.data
        });
      } else {
        setMigrationStatus({
          status: 'error',
          message: result.error || '迁移过程中发生未知错误'
        });
      }
    } catch (error) {
      setMigrationStatus({
        status: 'error',
        message: `迁移失败: ${error}`
      });
    }
  };

  // 获取统计信息
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const fetchStats = async () => {
    try {
      const result = await postgresAPI.getStats();
      if (result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  useEffect(() => {
    if (dbHealth.connected) {
      fetchStats();
    }
  }, [dbHealth.connected]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-cyber-green';
      case 'error': return 'text-cyber-pink';
      case 'checking':
      case 'migrating': return 'text-cyber-blue';
      default: return 'text-cyber-purple';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'checking':
      case 'migrating': return '🔄';
      default: return '📊';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle': return '准备就绪';
      case 'checking': return '检查中';
      case 'migrating': return '迁移中';
      case 'success': return '迁移成功';
      case 'error': return '迁移失败';
      default: return '未知状态';
    }
  };

  return (
    <div className="space-y-6">
      {/* 功能说明卡片 */}
      <motion.div 
        className="glassmorphism border border-cyber-blue/30 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Database className="w-8 h-8 text-cyber-blue mr-3" />
          <div>
            <h3 className="text-xl font-bold text-white">数据库迁移工具</h3>
            <p className="text-gray-400 text-sm">将本地存储升级到PostgreSQL数据库</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h4 className="text-cyber-blue font-semibold mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              功能特点
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• 🔄 自动数据迁移</li>
              <li>• 📊 数据完整性检查</li>
              <li>• 💾 原数据备份保护</li>
              <li>• ⚡ 零停机时间升级</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h4 className="text-cyber-green font-semibold mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              安全保障
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• 🛡️ 数据不会丢失</li>
              <li>• 🔒 加密传输保护</li>
              <li>• 📋 详细操作日志</li>
              <li>• 🚫 防重复迁移</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* 连接状态卡片 */}
      <motion.div 
        className="glassmorphism border border-gray-700/50 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-cyber-blue" />
          数据库连接状态
        </h4>
        
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
          <div className="flex items-center">
            {dbHealth.connected ? (
              <CheckCircle className="w-6 h-6 text-cyber-green mr-3" />
            ) : (
              <XCircle className="w-6 h-6 text-cyber-pink mr-3" />
            )}
            <div>
              <div className={`font-medium ${dbHealth.connected ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                {dbHealth.connected ? 'PostgreSQL 已连接' : 'PostgreSQL 未连接'}
              </div>
              <div className="text-gray-400 text-sm">{dbHealth.message}</div>
            </div>
          </div>
          
          <button
            onClick={checkDatabaseConnection}
            disabled={migrationStatus.status === 'checking' || migrationStatus.status === 'migrating'}
            className="bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/50 rounded-lg py-2 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${migrationStatus.status === 'checking' ? 'animate-spin' : ''}`} />
            检查连接
          </button>
        </div>
      </motion.div>

      {/* 迁移状态卡片 */}
      <motion.div 
        className="glassmorphism border border-gray-700/50 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-cyber-purple" />
          迁移状态与进度
        </h4>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">当前状态:</span>
            <span className={`font-medium ${getStatusColor(migrationStatus.status)}`}>
              {getStatusIcon(migrationStatus.status)} {getStatusText(migrationStatus.status)}
            </span>
          </div>
          
          {migrationStatus.message && (
            <div className="text-gray-400 text-sm bg-gray-900/50 rounded p-3 mt-3">
              {migrationStatus.message}
            </div>
          )}
          
          {migrationStatus.status === 'migrating' && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>迁移进度</span>
                <span>处理中...</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <button
            onClick={performMigration}
            disabled={!dbHealth.connected || migrationStatus.status === 'checking' || migrationStatus.status === 'migrating'}
            className="flex-1 bg-gradient-to-r from-cyber-green/20 to-cyber-blue/20 hover:from-cyber-green/30 hover:to-cyber-blue/30 text-white border border-cyber-green/50 rounded-lg py-3 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {migrationStatus.status === 'migrating' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                迁移进行中...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                开始数据迁移
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 数据统计卡片 */}
      <AnimatePresence>
        {stats && (
          <motion.div 
            className="glassmorphism border border-gray-700/50 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyber-green" />
              数据库统计信息
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyber-blue/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-cyber-blue text-2xl font-bold">{stats.ai_tools_count}</div>
                    <div className="text-gray-400 text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      AI工具数量
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyber-purple/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-cyber-purple text-2xl font-bold">{stats.md_notes_count}</div>
                    <div className="text-gray-400 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      笔记数量
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyber-green/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-cyber-green text-2xl font-bold">
                      ${(stats.total_costs.monthly + stats.total_costs.yearly + stats.total_costs.one_time).toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      总成本
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
              <h5 className="text-white font-medium mb-2">成本详情</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-cyber-blue font-semibold">${stats.total_costs.monthly}</div>
                  <div className="text-gray-400">月费</div>
                </div>
                <div className="text-center">
                  <div className="text-cyber-purple font-semibold">${stats.total_costs.yearly}</div>
                  <div className="text-gray-400">年费</div>
                </div>
                <div className="text-center">
                  <div className="text-cyber-green font-semibold">${stats.total_costs.one_time}</div>
                  <div className="text-gray-400">一次性</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 迁移成功提示 */}
      <AnimatePresence>
        {migrationStatus.status === 'success' && (
          <motion.div 
            className="glassmorphism border border-cyber-green/50 rounded-lg p-6 bg-cyber-green/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-cyber-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cyber-green mb-2">迁移成功完成！</h3>
              <p className="text-gray-300 mb-4">
                您的数据已成功迁移到PostgreSQL数据库。系统现在将使用新的数据库存储。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/50 rounded-lg py-3 px-6 transition-all duration-300 flex items-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新页面应用更改
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 迁移失败提示 */}
      <AnimatePresence>
        {migrationStatus.status === 'error' && (
          <motion.div 
            className="glassmorphism border border-cyber-pink/50 rounded-lg p-6 bg-cyber-pink/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <XCircle className="w-16 h-16 text-cyber-pink mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cyber-pink mb-2">迁移失败</h3>
              <p className="text-gray-300 mb-4">
                数据迁移过程中出现了问题。请检查数据库连接并重试。
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={checkDatabaseConnection}
                  className="bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/50 rounded-lg py-2 px-4 transition-all duration-300 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新检查连接
                </button>
                <button
                  onClick={performMigration}
                  disabled={!dbHealth.connected}
                  className="bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/50 rounded-lg py-2 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Database className="w-4 h-4 mr-2" />
                  重试迁移
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 注意事项 */}
      <motion.div 
        className="glassmorphism border border-yellow-600/30 rounded-lg p-6 bg-yellow-900/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          重要说明
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-200 text-sm">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              迁移过程会将localStorage中的数据安全复制到PostgreSQL
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              原始localStorage数据将保留作为备份，不会被删除
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              重复运行迁移不会产生重复数据，系统有防重机制
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              迁移完成后，系统将自动切换到PostgreSQL存储
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
