import React from 'react';
import { TrendingUp, Calendar, AlertTriangle, DollarSign } from 'lucide-react';
import type { AITool } from '../types';
import { isExpiringSoon, isExpired, getDaysUntilExpiration } from '../utils';

interface StatsProps {
  tools: AITool[];
}

export const Stats: React.FC<StatsProps> = ({ tools }) => {
  const totalTools = tools.length;
  const expiringSoon = tools.filter(tool => isExpiringSoon(tool.expirationDate)).length;
  const expired = tools.filter(tool => isExpired(tool.expirationDate)).length;
  
  const monthlyTools = tools.filter(tool => tool.feeType === 'monthly');
  const yearlyTools = tools.filter(tool => tool.feeType === 'yearly');
  
  const monthlyTotal = monthlyTools.reduce((sum, tool) => sum + (tool.cost || 0), 0);
  const yearlyTotal = yearlyTools.reduce((sum, tool) => sum + (tool.cost || 0), 0);
  const totalCost = monthlyTotal * 12 + yearlyTotal;

  const nextExpiring = tools
    .filter(tool => !isExpired(tool.expirationDate))
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())[0];

  const stats = [
    {
      title: '總工具數',
      value: totalTools,
      icon: TrendingUp,
      color: 'cyber-blue',
      gradient: 'from-cyber-blue/20 to-cyber-blue/5'
    },
    {
      title: '即將到期',
      value: expiringSoon,
      icon: AlertTriangle,
      color: 'yellow-500',
      gradient: 'from-yellow-500/20 to-yellow-500/5',
      alert: expiringSoon > 0
    },
    {
      title: '已過期',
      value: expired,
      icon: Calendar,
      color: 'red-500',
      gradient: 'from-red-500/20 to-red-500/5',
      alert: expired > 0
    },
    {
      title: '年度總費用',
      value: `$${totalCost.toFixed(0)}`,
      icon: DollarSign,
      color: 'cyber-green',
      gradient: 'from-cyber-green/20 to-cyber-green/5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`glass-card p-4 relative overflow-hidden group hover:scale-105 transition-all duration-300 ${
              stat.alert ? 'border-red-500/50 animate-pulse-slow' : ''
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                {stat.alert && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost Breakdown */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold text-gradient mb-4">費用分析</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">月費工具 ({monthlyTools.length})</span>
              <span className="text-cyber-blue font-medium">${monthlyTotal.toFixed(2)}/月</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">年費工具 ({yearlyTools.length})</span>
              <span className="text-cyber-purple font-medium">${yearlyTotal.toFixed(2)}/年</span>
            </div>
            <div className="border-t border-white/10 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">預估年度總費用</span>
                <span className="text-cyber-green font-bold text-lg">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Expiring */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold text-gradient mb-4">下一個到期</h3>
          {nextExpiring ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{nextExpiring.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  nextExpiring.feeType === 'yearly' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {nextExpiring.feeType === 'yearly' ? '年費' : '月費'}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm">
                到期日期: {new Date(nextExpiring.expirationDate).toLocaleDateString('zh-CN')}
              </p>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  getDaysUntilExpiration(nextExpiring.expirationDate) <= 7 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-green-500'
                }`} />
                <span className="text-sm text-gray-400">
                  {getDaysUntilExpiration(nextExpiring.expirationDate)} 天後到期
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">暫無工具數據</p>
          )}
        </div>
      </div>
    </div>
  );
};
