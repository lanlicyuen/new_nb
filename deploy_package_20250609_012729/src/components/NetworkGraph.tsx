// 网络化思考图谱组件（Network Graph View）
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { ArrowUpRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Info } from 'lucide-react';

// 节点类型定义
export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'center' | 'tool' | 'category' | 'feature' | 'tag';
  features?: string[];
  description?: string;
  tags?: string[];
  parentId?: string;
  related?: string[];
  size?: number;
  color?: string;
  expirationDate?: string;
}

// 连接类型定义
export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength?: number; // 连接强度
  type?: 'direct' | 'related' | 'tag'; // 连接类型
}

interface NetworkGraphProps {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
}

/**
 * 网络化思考图谱组件
 * 展示AI工具、功能、标签之间的复杂关系网络
 */
export const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onNodeClick, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动计算节点大小和颜色
  const processedData = useMemo(() => {
    const nodeMap = new Map(data.nodes.map(node => [node.id, { ...node }]));
    
    // 为节点添加默认大小和颜色
    const nodes = Array.from(nodeMap.values()).map(node => {
      return {
        ...node,
        size: node.size || (
          node.type === 'center' ? 45 :
          node.type === 'tool' ? 30 :
          node.type === 'category' ? 25 :
          node.type === 'feature' ? 15 :
          12
        ),
        color: node.color || (
          node.type === 'center' ? '#bd00ff' :
          node.type === 'tool' ? '#00f5ff' :
          node.type === 'category' ? '#ff0080' :
          node.type === 'feature' ? '#00ff41' :
          '#ffee00'
        )
      };
    });
    
    return { nodes, links: data.links };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;
    if (!processedData.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    const container = svg.select(".container");
    
    // 获取容器尺寸
    const svgNode = svgRef.current;
    const width = svgNode.clientWidth || 600;
    const height = svgNode.clientHeight || 400;

    // 确保尺寸有效
    if (width <= 0 || height <= 0) {
      console.warn("NetworkGraph: Invalid SVG dimensions", { width, height });
      return;
    }

    console.log("Rendering network graph with dimensions:", { width, height });
    console.log("Nodes:", processedData.nodes.length, "Links:", processedData.links.length);
    
    // 清除之前的内容
    container.selectAll("*").remove();

    // 创建缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
        setTransform({ 
          x: event.transform.x, 
          y: event.transform.y, 
          k: event.transform.k 
        });
      });

    svg.call(zoom);
    
    // 恢复之前的变换
    svg.call(zoom.transform, d3.zoomIdentity
      .translate(transform.x, transform.y)
      .scale(transform.k));

    // 创建模拟
    const simulation = d3.forceSimulation<GraphNode>(processedData.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(processedData.links)
        .id(d => d.id)
        .distance(link => {
          // 根据连接类型设置距离
          if (link.type === 'direct') return 100;
          if (link.type === 'related') return 180;
          if (link.type === 'tag') return 150;
          return 120;
        })
        .strength(link => link.strength || 0.3))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => (d.size || 20) + 10))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // 创建箭头标记
    const defs = container.append("defs");
    
    // 工具连接的箭头
    defs.append("marker")
      .attr("id", "arrow-tool")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#00f5ff")
      .attr("d", "M0,-5L10,0L0,5");
    
    // 相关性连接的箭头
    defs.append("marker")
      .attr("id", "arrow-related")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#ff0080")
      .attr("d", "M0,-5L10,0L0,5");
    
    // 标签连接的箭头  
    defs.append("marker")
      .attr("id", "arrow-tag")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#ffee00")
      .attr("d", "M0,-5L10,0L0,5");

    // 添加连接线
    const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(processedData.links)
      .enter().append("line")
      .attr("stroke", d => {
        switch(d.type) {
          case 'direct': return "#00f5ff";
          case 'related': return "#ff0080";
          case 'tag': return "#ffee00";
          default: return "#aaaaaa";
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => d.strength ? d.strength * 3 : 1)
      .attr("marker-end", d => {
        switch(d.type) {
          case 'direct': return "url(#arrow-tool)";
          case 'related': return "url(#arrow-related)";
          case 'tag': return "url(#arrow-tag)";
          default: return "";
        }
      });

    // 添加节点组
    const nodeGroup = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(processedData.nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (onNodeClick) onNodeClick(d);
      })
      .on("mouseover", (event, d) => {
        // 显示工具提示
        const [x, y] = d3.pointer(event);
        setTooltip({
          x: x + 20,
          y: y - 10,
          node: d
        });
      })
      .on("mouseout", () => {
        setTooltip(null);
      })
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // 绘制光晕效果
    nodeGroup.append("circle")
      .attr("r", d => (d.size || 20) + 5)
      .attr("fill", "transparent")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.5)
      .attr("class", "node-glow");

    // 绘制节点圆圈
    nodeGroup.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", d => d.type === 'center' || d.id === selectedNode?.id ? 3 : 1.5)
      .attr("stroke-opacity", 0.8)
      .attr("class", "node-circle")
      .style("filter", d => `drop-shadow(0 0 10px ${d.color})`);

    // 添加节点标签
    nodeGroup.append("text")
      .text(d => {
        const name = d.name || "";
        return name.length > 15 ? name.substring(0, 15) + '...' : name;
      })
      .attr("text-anchor", "middle")
      .attr("dy", d => d.size ? d.size + 18 : 30)
      .attr("fill", "#ffffff")
      .attr("font-size", d => {
        if (d.type === 'center') return "16px";
        if (d.type === 'tool') return "14px";
        return "12px";
      })
      .attr("font-weight", d => {
        if (d.type === 'center') return "700";
        if (d.type === 'tool') return "600";
        return "400";
      })
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 5px #000000, 0 0 3px #000000");

    // 添加图标标识
    nodeGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-family", "FontAwesome")
      .attr("font-size", d => Math.max(d.size * 0.5, 10))
      .attr("fill", "#ffffff")
      .text(d => {
        switch(d.type) {
          case 'center': return "⚙️"; // 中央节点
          case 'tool': return "🤖"; // AI工具
          case 'category': return "📁"; // 分类
          case 'feature': return "✨"; // 功能
          case 'tag': return "🏷️"; // 标签
          default: return "";
        }
      })
      .style("pointer-events", "none");
    
    // 为过期节点添加警告标记
    nodeGroup.filter(d => {
      if (!d.expirationDate) return false;
      const expDate = new Date(d.expirationDate);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays < 30; // 30天内到期
    })
    .append("circle")
      .attr("r", 8)
      .attr("cx", d => d.size ? d.size - 2 : 20)
      .attr("cy", d => -(d.size ? d.size - 2 : 20))
      .attr("fill", "#ff0000")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0 0 6px #ff0000)");

    // 更新模拟
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x || 0)
        .attr("y1", d => (d.source as GraphNode).y || 0)
        .attr("x2", d => (d.target as GraphNode).x || 0)
        .attr("y2", d => (d.target as GraphNode).y || 0);

      nodeGroup
        .attr("transform", d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [processedData, selectedNode, onNodeClick, transform]);

  // 切换全屏显示
  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
    // 在状态更改后，重新渲染图表以适应新尺寸
    setTimeout(() => {
      if (svgRef.current) {
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        d3.select(svgRef.current).select(".container")
          .attr("transform", `translate(${width/2}, ${height/2}) scale(1) translate(${-width/2}, ${-height/2})`);
      }
    }, 100);
  };

  // 缩放控制
  const handleZoom = (factor: number) => {
    const svg = d3.select(svgRef.current as SVGSVGElement);
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", null);
    
    svg.transition().call(
      zoom.transform,
      d3.zoomIdentity
        .translate(transform.x, transform.y)
        .scale(transform.k * factor)
    );
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className} ${fullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}
      style={{ height: fullscreen ? '100vh' : '80vh', transition: 'all 0.3s ease' }}
    >
      {/* 控制面板 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <motion.button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
        >
          {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>
        <motion.button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoom(1.2)}
        >
          <ZoomIn size={20} />
        </motion.button>
        <motion.button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoom(1/1.2)}
        >
          <ZoomOut size={20} />
        </motion.button>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-gray-800/80 backdrop-blur-sm text-xs text-white">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-cyber-blue mr-2"></div>
          <span>AI工具</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-cyber-purple mr-2"></div>
          <span>中心节点</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-cyber-pink mr-2"></div>
          <span>分类</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-cyber-green mr-2"></div>
          <span>功能</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-cyber-yellow mr-2"></div>
          <span>标签</span>
        </div>
      </div>

      {/* 网络图 */}
      <svg 
        ref={svgRef} 
        className="w-full h-full bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden"
        onClick={() => setSelectedNode(null)}
      >
        <g className="container" transform="translate(0,0)"></g>
      </svg>
      
      {/* 工具提示 */}
      {tooltip && (
        <div 
          className="absolute z-10 p-3 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-700/50 text-white max-w-xs"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(0, -50%)'
          }}
        >
          <div className="text-sm font-semibold mb-1">{tooltip.node.name}</div>
          {tooltip.node.description && (
            <div className="text-xs text-gray-300">{tooltip.node.description}</div>
          )}
          {tooltip.node.type === 'tool' && tooltip.node.expirationDate && (
            <div className="text-xs mt-1 flex items-center">
              <span className="text-cyber-blue mr-1">到期：</span>
              <span>{new Date(tooltip.node.expirationDate).toLocaleDateString('zh-CN')}</span>
            </div>
          )}
        </div>
      )}
      
      {/* 选中节点信息面板 */}
      {selectedNode && (
        <motion.div 
          className="absolute left-4 top-4 z-10 p-4 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-700/50 text-white max-w-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-bold flex items-center">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: selectedNode.color }}
              ></span>
              {selectedNode.name}
            </h3>
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
              {selectedNode.type === 'center' ? '中心' : 
               selectedNode.type === 'tool' ? 'AI工具' : 
               selectedNode.type === 'category' ? '分类' : 
               selectedNode.type === 'feature' ? '功能' : '标签'}
            </span>
          </div>
          
          {selectedNode.description && (
            <p className="text-sm text-gray-300 mb-3">
              {selectedNode.description}
            </p>
          )}
          
          {selectedNode.features && selectedNode.features.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-cyber-green mb-1">功能特性：</h4>
              <ul className="text-xs text-gray-300 pl-4 list-disc">
                {selectedNode.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedNode.tags && selectedNode.tags.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-cyber-yellow mb-1">相关标签：</h4>
              <div className="flex flex-wrap gap-1">
                {selectedNode.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-0.5 bg-cyber-yellow/20 text-cyber-yellow rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {selectedNode.type === 'tool' && selectedNode.expirationDate && (
            <div className="text-xs flex items-center justify-between border-t border-gray-700 pt-2 mt-2">
              <span className="text-cyber-blue">到期日期</span>
              <span>{new Date(selectedNode.expirationDate).toLocaleDateString('zh-CN')}</span>
            </div>
          )}
          
          {/* 查看详情按钮 */}
          <motion.button
            className="mt-3 w-full py-1.5 px-3 text-xs flex items-center justify-center bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue rounded"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onNodeClick) onNodeClick(selectedNode);
            }}
          >
            查看详情 <ArrowUpRight size={14} className="ml-1" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default NetworkGraph;
