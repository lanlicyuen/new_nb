import React from 'react';
import { Calendar, Clock, AlertTriangle, Zap } from 'lucide-react';
import type { AITool } from '../types';
import { formatDate, getDaysUntilExpiration, isExpiringSoon, isExpired, cn } from '../utils';

interface ToolCardProps {
  tool: AITool;
  onEdit?: (tool: AITool) => void;
  onDelete?: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onEdit, onDelete }) => {
  const daysUntilExpiry = getDaysUntilExpiration(tool.expirationDate);
  const expiringSoon = isExpiringSoon(tool.expirationDate);
  const expired = isExpired(tool.expirationDate);

  return (
    <div className={cn(
      "glass-card p-6 transition-all duration-300 hover:scale-105 group relative overflow-hidden",
      expiringSoon && !expired && "border-yellow-500/50 shadow-yellow-500/20",
      expired && "border-red-500/50 shadow-red-500/20"
    )}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Status indicator */}
      {(expiringSoon || expired) && (
        <div className="absolute top-4 right-4">
          <div className={cn(
            "w-3 h-3 rounded-full animate-pulse",
            expired ? "bg-red-500" : "bg-yellow-500"
          )} />
        </div>
      )}

      <div className="relative z-10">
        {/* Tool name */}
        <h3 className="text-xl font-semibold text-gradient mb-3 group-hover:neon-text transition-all duration-300">
          {tool.name}
        </h3>

        {/* Purchase and expiration info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-cyber-blue" />
            購買日期: {formatDate(tool.purchaseDate)}
          </div>
          
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="w-4 h-4 mr-2 text-cyber-purple" />
            到期日期: {formatDate(tool.expirationDate)}
          </div>

          <div className="flex items-center text-sm">
            <Zap className="w-4 h-4 mr-2 text-cyber-green" />
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              tool.feeType === 'yearly' 
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            )}>
              {tool.feeType === 'yearly' ? '年費' : '月費'}
            </span>
          </div>
        </div>

        {/* Expiration warning */}
        {(expiringSoon || expired) && (
          <div className={cn(
            "flex items-center text-sm font-medium mb-3 p-2 rounded-lg",
            expired 
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          )}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            {expired 
              ? `已過期 ${Math.abs(daysUntilExpiry)} 天`
              : `${daysUntilExpiry} 天後到期`
            }
          </div>
        )}

        {/* Features */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">功能:</p>
          <div className="flex flex-wrap gap-2">
            {tool.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 rounded-full text-xs hover:bg-cyber-blue/20 transition-colors duration-200"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          {onEdit && (
            <button
              onClick={() => onEdit(tool)}
              className="flex-1 cyber-button text-sm py-2"
            >
              編輯
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tool.id)}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/30 hover:border-red-500 transition-all duration-300"
            >
              刪除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
