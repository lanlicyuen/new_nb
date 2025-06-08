// 网络化思考视图组件 (修复版本)
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Share2, Info, X } from 'lucide-react';
// 从修复后的NetworkGraph组件导入正确的类型和组件
import NetworkGraph from './NetworkGraph.fixed';
import type { GraphNode, GraphLink } from './NetworkGraph.fixed';

interface AITool {
  id: string;
  name: string;
  purchaseDate: string;
  feeType: 'monthly' | 'yearly';
  expirationDate: string;
  features: string[];
  cost?: number;
}

interface GraphViewProps {
  tools: AITool[];
  className?: string;
}

/**
 * 网络化思考视图组件 - 以图谱形式展示AI工具生态系统
 */
export const GraphView: React.FC<GraphViewProps> = ({ tools, className = '' }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    showTools: true,
    showFeatures: true,
    showTags: true,
    showRelated: true,
  });
  const [infoVisible, setInfoVisible] = useState(false);

  // 将工具数据转换为图谱数据
  const graphData = useMemo(() => {
    // 节点列表
    const nodes: GraphNode[] = [];
    
    // 连接列表
    const links: GraphLink[] = [];
    
    // 如果没有工具数据，返回一个简单的空图表
    if (!tools || tools.length === 0) {
      return {
        nodes: [{ 
          id: 'empty', 
          name: '没有数据', 
          type: 'center',
          description: '没有可显示的AI工具数据'
        } as GraphNode],
        links: []
      };
    }
    
    console.log("Processing tools for graph:", tools.length);
    
    // 分类和标签收集器
    const categories = new Set<string>();
    const allTags = new Set<string>();
    const featureSet = new Set<string>();
    const featureToToolMap: Record<string, string[]> = {};
    const toolsWithSameFeatures: Record<string, Set<string>> = {};

    // 从工具中提取标签和特性
    tools.forEach(tool => {
      // 提取标签（从功能描述中提取关键词）
      const toolTags: string[] = [];
      
      // 收集所有特性并建立映射关系
      tool.features.forEach(feature => {
        featureSet.add(feature);
        
        // 建立特性到工具的映射
        if (!featureToToolMap[feature]) {
          featureToToolMap[feature] = [];
        }
        featureToToolMap[feature].push(tool.id);
        
        // 提取关键词作为标签
        const words = feature.split(' ');
        words.forEach(word => {
          const normalizedWord = word.toLowerCase();
          if (normalizedWord.length > 4 && !toolTags.includes(normalizedWord)) {
            toolTags.push(normalizedWord);
            allTags.add(normalizedWord);
          }
        });
      });
      
      // 工具分类（按到期日期的季度分类）
      const expDate = new Date(tool.expirationDate);
      const quarter = Math.floor(expDate.getMonth() / 3) + 1;
      const categoryName = `${expDate.getFullYear()}年Q${quarter}`;
      categories.add(categoryName);
    });
    
    // 寻找具有相同特性的工具之间的关系
    tools.forEach(toolA => {
      toolsWithSameFeatures[toolA.id] = new Set<string>();
      
      tools.forEach(toolB => {
        if (toolA.id !== toolB.id) {
          // 如果两个工具有共同的特性，建立关系
          const commonFeatures = toolA.features.filter(feature => 
            toolB.features.includes(feature)
          );
          
          if (commonFeatures.length > 0) {
            toolsWithSameFeatures[toolA.id].add(toolB.id);
          }
        }
      });
    });

    // 创建中心节点
    nodes.push({
      id: 'center',
      name: 'AI工具生态系统',
      type: 'center',
      description: `总计 ${tools.length} 个AI工具，${categories.size} 个分类，${featureSet.size} 个功能特性`,
    } as GraphNode);

    // 创建分类节点
    Array.from(categories).forEach(category => {
      nodes.push({
        id: `category-${category}`,
        name: category,
        type: 'category',
        description: `在 ${category} 到期的AI工具`,
      } as GraphNode);
      
      // 连接分类到中心节点
      links.push({
        source: 'center',
        target: `category-${category}`,
        type: 'direct',
        strength: 0.7
      });
    });
    
    // 创建功能分组节点
    if (featureSet.size > 0) {
      nodes.push({
        id: 'features-group',
        name: '功能特性',
        type: 'category',
        description: `${featureSet.size}个主要功能特性`,
      } as GraphNode);
      
      // 连接功能分组到中心节点
      links.push({
        source: 'center',
        target: 'features-group',
        type: 'direct',
        strength: 0.7
      });
    }
    
    // 创建标签分组节点
    if (allTags.size > 0) {
      nodes.push({
        id: 'tags-group',
        name: '标签分类',
        type: 'category',
        description: `${allTags.size}个相关标签`,
      } as GraphNode);
      
      // 连接标签分组到中心节点
      links.push({
        source: 'center',
        target: 'tags-group',
        type: 'direct',
        strength: 0.7
      });
    }

    // 创建工具节点和功能节点
    tools.forEach(tool => {
      // 计算到期天数，用于视觉区分
      const expirationDate = new Date(tool.expirationDate);
      const today = new Date();
      const daysLeft = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // 根据到期时间给工具节点设置不同颜色
      let nodeColor = '#00f5ff'; // 默认蓝色
      if (daysLeft < 0) {
        nodeColor = '#ff3333'; // 已过期
      } else if (daysLeft <= 30) {
        nodeColor = '#ffcc00'; // 即将到期
      }
      
      // 提取标签
      const toolTags: string[] = [];
      tool.features.forEach(feature => {
        const words = feature.split(' ');
        words.forEach(word => {
          if (word.length > 4 && !toolTags.includes(word)) {
            toolTags.push(word);
          }
        });
      });
      
      // 获取工具分类
      const expDate = new Date(tool.expirationDate);
      const quarter = Math.floor(expDate.getMonth() / 3) + 1;
      const categoryName = `${expDate.getFullYear()}年Q${quarter}`;
      
      // 创建工具节点
      nodes.push({
        id: tool.id,
        name: tool.name,
        type: 'tool',
        color: nodeColor,
        description: `${tool.feeType === 'monthly' ? '月付' : '年付'}，${
          daysLeft < 0 ? `已过期 ${Math.abs(daysLeft)} 天` : 
          daysLeft === 0 ? '今日到期' : 
          `剩余 ${daysLeft} 天`
        }`,
        features: tool.features,
        tags: toolTags,
        expirationDate: tool.expirationDate,
      } as GraphNode);
      
      // 连接工具到分类
      links.push({
        source: tool.id,
        target: `category-${categoryName}`,
        type: 'direct',
        strength: 0.5
      });
      
      // 添加工具特性节点
      tool.features.forEach(feature => {
        const featureId = `feature-${feature.replace(/\s+/g, '_').toLowerCase()}`;
        
        // 如果特性节点不存在，创建新节点
        if (!nodes.some(node => node.id === featureId)) {
          nodes.push({
            id: featureId,
            name: feature,
            type: 'feature',
            description: `${featureToToolMap[feature]?.length || 0} 个工具具备此功能`,
          } as GraphNode);
          
          // 连接特性节点到功能分组
          if (featureSet.size > 0) {
            links.push({
              source: 'features-group',
              target: featureId,
              type: 'direct',
              strength: 0.3
            });
          }
        }
        
        // 连接工具到特性
        links.push({
          source: tool.id,
          target: featureId,
          type: 'direct',
          strength: 0.4
        });
      });
      
      // 添加标签节点
      toolTags.forEach(tag => {
        const tagId = `tag-${tag.replace(/\s+/g, '_').toLowerCase()}`;
        
        // 如果标签节点不存在，创建新节点
        if (!nodes.some(node => node.id === tagId)) {
          nodes.push({
            id: tagId,
            name: tag,
            type: 'tag',
            description: '关键词标签',
          } as GraphNode);
          
          // 连接标签到标签分组
          if (allTags.size > 0) {
            links.push({
              source: 'tags-group',
              target: tagId,
              type: 'tag',
              strength: 0.2
            });
          }
        }
        
        // 连接工具到标签
        links.push({
          source: tool.id,
          target: tagId,
          type: 'tag',
          strength: 0.2
        });
      });
    });
    
    // 创建相关性连接 - 连接有共同特性的工具
    Object.entries(toolsWithSameFeatures).forEach(([toolId, relatedTools]) => {
      relatedTools.forEach(relatedToolId => {
        links.push({
          source: toolId,
          target: relatedToolId,
          type: 'related',
          strength: 0.3
        });
      });
    });

    // 应用筛选条件
    let filteredNodes = nodes;
    let filteredLinks = links;
    
    if (!filterOptions.showFeatures) {
      filteredNodes = filteredNodes.filter(node => node.type !== 'feature');
      filteredLinks = filteredLinks.filter(link => 
        !filteredNodes.some(node => 
          node.type === 'feature' && (typeof link.source === 'string' ? link.source : link.source.id) === node.id ||
          node.type === 'feature' && (typeof link.target === 'string' ? link.target : link.target.id) === node.id
        )
      );
    }
    
    if (!filterOptions.showTags) {
      filteredNodes = filteredNodes.filter(node => node.type !== 'tag');
      filteredLinks = filteredLinks.filter(link => 
        !filteredNodes.some(node => 
          node.type === 'tag' && (typeof link.source === 'string' ? link.source : link.source.id) === node.id ||
          node.type === 'tag' && (typeof link.target === 'string' ? link.target : link.target.id) === node.id
        )
      );
    }
    
    if (!filterOptions.showRelated) {
      filteredLinks = filteredLinks.filter(link => link.type !== 'related');
    }
    
    // 应用搜索筛选
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      // 找到匹配的节点ID
      const matchNodeIds = filteredNodes
        .filter(node => 
          node.name.toLowerCase().includes(lowerQuery) || 
          node.description?.toLowerCase().includes(lowerQuery) ||
          (node.tags && node.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
          (node.features && node.features.some(feature => feature.toLowerCase().includes(lowerQuery)))
        )
        .map(node => node.id);
      
      // 只保留匹配的节点和它们的连接
      filteredNodes = filteredNodes.filter(node => 
        matchNodeIds.includes(node.id) ||
        // 为匹配的节点保留父节点（如工具的分类）
        filteredLinks.some(link => 
          (typeof link.target === 'string' ? link.target : link.target.id) === node.id && 
          matchNodeIds.includes(typeof link.source === 'string' ? link.source : link.source.id)
        ) ||
        // 为匹配的节点保留子节点（如工具的功能）
        filteredLinks.some(link => 
          (typeof link.source === 'string' ? link.source : link.source.id) === node.id && 
          matchNodeIds.includes(typeof link.target === 'string' ? link.target : link.target.id)
        )
      );
      
      // 只保留连接匹配节点的连接
      filteredLinks = filteredLinks.filter(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        return filteredNodes.some(node => node.id === sourceId) && 
               filteredNodes.some(node => node.id === targetId);
      });
    }

    console.log("Generated graph data:", {
      nodes: filteredNodes.length,
      links: filteredLinks.length
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  }, [tools, filterOptions, searchQuery]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const toggleFilterOption = (option: keyof typeof filterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`bg-gray-800/30 glassmorphism border border-gray-700/50 rounded-lg ${className}`}>
      {/* 控制面板 */}
      <div className="p-4 border-b border-gray-700/50 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white mr-3">网络化思考视图</h2>
          <button 
            className="text-gray-400 hover:text-white transition-colors" 
            onClick={() => setInfoVisible(!infoVisible)}
          >
            <Info size={18} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 ml-auto">
          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索节点..."
              className="py-1.5 pl-8 pr-3 rounded-md bg-gray-900/60 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyber-blue w-48"
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-gray-500" />
          </div>
          
          {/* 筛选器按钮 */}
          <div className="relative flex items-center gap-1">
            <button
              className={`px-2.5 py-1.5 rounded-md text-sm ${filterOptions.showFeatures ? 'bg-cyber-green/20 text-cyber-green' : 'bg-gray-700/50 text-gray-400'}`}
              onClick={() => toggleFilterOption('showFeatures')}
            >
              功能
            </button>
            <button
              className={`px-2.5 py-1.5 rounded-md text-sm ${filterOptions.showTags ? 'bg-cyber-yellow/20 text-cyber-yellow' : 'bg-gray-700/50 text-gray-400'}`}
              onClick={() => toggleFilterOption('showTags')}
            >
              标签
            </button>
            <button
              className={`px-2.5 py-1.5 rounded-md text-sm ${filterOptions.showRelated ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-gray-700/50 text-gray-400'}`}
              onClick={() => toggleFilterOption('showRelated')}
            >
              关联
            </button>
          </div>
        </div>
      </div>

      {/* 信息提示面板 */}
      <AnimatePresence>
        {infoVisible && (
          <motion.div 
            className="p-4 bg-gray-700/30 border-b border-gray-700/50 text-sm text-gray-300"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">关于网络化思考视图</h3>
              <button onClick={() => setInfoVisible(false)} className="text-gray-400">
                <X size={16} />
              </button>
            </div>
            <p className="mb-2">
              此视图展示了您的AI工具、功能及关键词之间的关系网络。通过这种网络化思考方式，您可以发现工具之间的潜在联系。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-800/50 p-3 rounded-md">
                <h4 className="font-medium text-white mb-1">交互提示</h4>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  <li>拖动节点可以调整布局</li>
                  <li>点击节点可以查看详细信息</li>
                  <li>滚轮或触控板可进行缩放</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-md">
                <h4 className="font-medium text-white mb-1">节点含义</h4>
                <ul className="text-xs space-y-1">
                  <li><span className="inline-block w-2 h-2 rounded-full bg-cyber-purple mr-1"></span> 中心 - 整个AI工具生态系统</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-cyber-blue mr-1"></span> 工具 - AI工具</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-cyber-pink mr-1"></span> 分类 - 到期日期分组</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-cyber-green mr-1"></span> 功能 - 工具功能</li>
                  <li><span className="inline-block w-2 h-2 rounded-full bg-cyber-yellow mr-1"></span> 标签 - 关键词标签</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图谱可视化区域 */}
      <div className="relative">
        <NetworkGraph 
          data={graphData} 
          onNodeClick={handleNodeClick}
          className="h-[600px]" 
        />
        
        {/* 选中节点信息面板 */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              className="absolute top-4 right-4 w-72 bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{selectedNode.name}</h3>
                  <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {selectedNode.type === 'center' ? '中心节点' : 
                   selectedNode.type === 'tool' ? 'AI工具' : 
                   selectedNode.type === 'category' ? '分类' : 
                   selectedNode.type === 'feature' ? '功能特性' : '标签'}
                </div>
              </div>
              
              <div className="p-4 text-sm text-gray-300">
                {selectedNode.description && <p className="mb-3">{selectedNode.description}</p>}
                
                {selectedNode.type === 'tool' && selectedNode.features && selectedNode.features.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-400 mb-1.5">功能特性：</h4>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                      {selectedNode.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                      {selectedNode.features.length > 5 && <li>...更多 {selectedNode.features.length - 5} 项</li>}
                    </ul>
                  </div>
                )}
                
                {selectedNode.type === 'tool' && selectedNode.expirationDate && (
                  <div className="text-xs text-gray-400">
                    到期日期：{new Date(selectedNode.expirationDate).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 底部控制栏 */}
      <div className="p-3 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-400">
        <div>
          共显示 {graphData.nodes.length} 个节点和 {graphData.links.length} 个连接
        </div>
        <div className="flex items-center">
          <button className="flex items-center hover:text-white transition-colors">
            <Share2 size={14} className="mr-1" />
            分享
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphView;
