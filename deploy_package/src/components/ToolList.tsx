import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import type { AITool } from '../types';
import { ToolCard } from './ToolCard';
import { cn } from '../utils';

interface ToolListProps {
  tools: AITool[];
  onEditTool: (tool: AITool) => void;
  onDeleteTool: (id: string) => void;
}

type SortOption = 'name' | 'purchaseDate' | 'expirationDate' | 'feeType';
type FilterOption = 'all' | 'monthly' | 'yearly' | 'expiring' | 'expired';

export const ToolList: React.FC<ToolListProps> = ({ tools, onEditTool, onDeleteTool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('expirationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedTools = React.useMemo(() => {
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;

      switch (filterBy) {
        case 'monthly':
          return tool.feeType === 'monthly';
        case 'yearly':
          return tool.feeType === 'yearly';
        case 'expiring': {
          const expiry = new Date(tool.expirationDate);
          const today = new Date();
          const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        }
        case 'expired':
          return new Date(tool.expirationDate) < new Date();
        default:
          return true;
      }
    });

    // Sort tools
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'purchaseDate':
          comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
          break;
        case 'expirationDate':
          comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
          break;
        case 'feeType':
          comparison = a.feeType.localeCompare(b.feeType);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tools, searchTerm, sortBy, sortOrder, filterBy]);

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  const filterOptions = [
    { value: 'all', label: '全部', count: tools.length },
    { value: 'monthly', label: '月費', count: tools.filter(t => t.feeType === 'monthly').length },
    { value: 'yearly', label: '年費', count: tools.filter(t => t.feeType === 'yearly').length },
    { value: 'expiring', label: '即將到期', count: tools.filter(t => {
      const expiry = new Date(t.expirationDate);
      const today = new Date();
      const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return days <= 7 && days >= 0;
    }).length },
    { value: 'expired', label: '已過期', count: tools.filter(t => new Date(t.expirationDate) < new Date()).length }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="glass-card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋工具名稱或功能..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full pl-10"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                showFilters 
                  ? "bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50"
                  : "bg-gray-600/20 text-gray-300 border border-gray-500/50 hover:border-cyber-blue/50"
              )}
            >
              <Filter className="w-4 h-4" />
              篩選
            </button>

            {/* Quick filters */}
            {!showFilters && filterOptions.slice(0, 3).map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterBy(option.value as FilterOption)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  filterBy === option.value
                    ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50"
                    : "bg-gray-600/20 text-gray-300 border border-gray-500/50 hover:border-cyber-purple/50"
                )}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Sort controls */}
          <div className="flex gap-2">
            {(['name', 'expirationDate', 'purchaseDate'] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => toggleSort(option)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  sortBy === option
                    ? "bg-cyber-green/20 text-cyber-green border border-cyber-green/50"
                    : "bg-gray-600/20 text-gray-300 border border-gray-500/50 hover:border-cyber-green/50"
                )}
              >
                {option === 'name' && '名稱'}
                {option === 'expirationDate' && '到期日'}
                {option === 'purchaseDate' && '購買日'}
                {sortBy === option && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterBy(option.value as FilterOption)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    filterBy === option.value
                      ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50"
                      : "bg-gray-600/20 text-gray-300 border border-gray-500/50 hover:border-cyber-purple/50"
                  )}
                >
                  {option.label}
                  <span className="ml-1 text-xs opacity-75">({option.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          顯示 {filteredAndSortedTools.length} / {tools.length} 個工具
        </span>
        {searchTerm && (
          <span>
            搜尋: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Tool cards grid */}
      {filteredAndSortedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm ? '未找到匹配的工具' : '暫無工具數據'}
          </h3>
          <p className="text-gray-400">
            {searchTerm ? '試試調整搜尋條件或篩選器' : '點擊上方按鈕添加第一個AI工具'}
          </p>
        </div>
      )}
    </div>
  );
};
