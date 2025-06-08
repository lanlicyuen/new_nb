// 简化版网络图组件
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface AITool {
  id: string;
  name: string;
  purchaseDate: string;
  feeType: 'monthly' | 'yearly';
  expirationDate: string;
  features: string[];
  cost?: number;
}

interface SimpleGraphViewProps {
  tools: AITool[];
  className?: string;
}

const SimpleGraphView: React.FC<SimpleGraphViewProps> = ({ tools, className = '' }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 当工具数据变化时重新渲染图表
  useEffect(() => {
    if (!svgRef.current || !tools.length) return;

    console.log("渲染简化版网络图, 工具数量:", tools.length);
    
    // 清除之前的内容
    d3.select(svgRef.current).selectAll("*").remove();
    
    // 构建一个简单的节点链接图
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;
    
    // 创建一个中心节点和围绕它的工具节点
    const nodes = [
      { id: 'center', name: 'AI工具生态', type: 'center' },
      ...tools.map(tool => ({
        id: tool.id,
        name: tool.name,
        type: 'tool',
        expirationDate: tool.expirationDate,
        features: tool.features
      }))
    ];
    
    // 创建链接 - 所有工具连接到中心
    const links = tools.map(tool => ({
      source: 'center',
      target: tool.id
    }));
    
    // 为工具之间创建额外链接 (如果它们有共同功能)
    tools.forEach((toolA, i) => {
      tools.forEach((toolB, j) => {
        if (i < j) {
          // 检查是否有共同功能
          const commonFeatures = toolA.features.filter(f => 
            toolB.features.includes(f)
          );
          
          if (commonFeatures.length > 0) {
            links.push({
              source: toolA.id,
              target: toolB.id
            });
          }
        }
      });
    });
    
    // 创建颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(['center', 'tool'])
      .range(['#bd00ff', '#00f5ff']);
      
    // 根据到期日期为工具节点添加不同颜色
    const getToolColor = (tool: any) => {
      if (!tool.expirationDate) return '#00f5ff';
      
      const expDate = new Date(tool.expirationDate);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return '#ff3333'; // 已过期
      if (diffDays < 30) return '#ffcc00'; // 即将到期
      return '#00f5ff'; // 正常
    };

    // 创建力模型
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links as any).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // 创建SVG容器
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // 添加箭头定义
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("fill", "#aaa")
      .attr("d", "M0,-5L10,0L0,5");

    // 添加链接
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.source === 'center' || d.target === 'center' ? "#bd00ff" : "#00f5ff")
      .attr("stroke-opacity", 0)  // 开始时不可见
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)")
      .style("stroke-dasharray", "4, 2")  // 虚线效果
      // 添加动画效果
      .transition()
      .duration(1000)
      .delay((d: any, i: number) => 500 + i * 30)
      .attr("stroke-opacity", 0.7);

    // 添加节点
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d.id);
      })
      .call((selection: any) => {
        const drag = d3.drag()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          });

        selection.call(drag as any);
      });

    // 添加节点圆圈
    // 添加节点边框光晕
    node.append("circle")
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        if (d.type === 'center') return '#bd00ff';
        if (!d.expirationDate) return '#00f5ff';
        const expDate = new Date(d.expirationDate);
        const now = new Date();
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return '#ff3333';
        if (diffDays < 30) return '#ffcc00';
        return '#00f5ff';
      })
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5)
      .transition()
      .duration(1000)
      .delay((d: any, i: number) => i * 50)
      .attr("r", (d: any) => d.type === 'center' ? 40 : 28);
      
    // 添加节点圆圈
    node.append("circle")
      .attr("r", 0) // 开始时半径为0
      .attr("fill", (d: any) => {
        if (d.type === 'center') return '#bd00ff';
        // 根据到期日期添加不同颜色
        if (!d.expirationDate) return '#00f5ff';
        const expDate = new Date(d.expirationDate);
        const now = new Date();
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return '#ff3333'; // 已过期
        if (diffDays < 30) return '#ffcc00'; // 即将到期
        return '#00f5ff'; // 正常
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", (d: any) => d.type === 'center' ? 'drop-shadow(0 0 8px #bd00ff)' : 'drop-shadow(0 0 5px #00f5ff)')
      .transition()
      .duration(800)
      .delay((d: any, i: number) => i * 50)
      .attr("r", (d: any) => d.type === 'center' ? 30 : 20);

    // 添加节点文本
    node.append("text")
      .text((d: any) => {
        const name = d.name || "";
        return name.length > 15 ? name.substring(0, 15) + '...' : name;
      })
      .attr("x", 0)
      .attr("y", (d: any) => d.type === 'center' ? 45 : 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff");

    // 更新力模型
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as any).x)
        .attr("y1", (d: any) => (d.source as any).y)
        .attr("x2", (d: any) => (d.target as any).x)
        .attr("y2", (d: any) => (d.target as any).y);

      node
        .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // 添加缩放功能
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom as any);

  }, [tools]);

  return (
    <div className={`bg-gray-800/30 glassmorphism border border-gray-700/50 rounded-lg ${className}`}>
      {/* 标题和说明 */}
      <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink text-transparent bg-clip-text">AI工具网络图谱</h2>
          <p className="text-sm text-gray-400 mt-1">
            显示 {tools.length} 个工具之间的关系和连接网络
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyber-purple mr-2"></div>
            <span className="text-xs text-gray-300">中心节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyber-blue mr-2"></div>
            <span className="text-xs text-gray-300">正常工具</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-xs text-gray-300">即将到期</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-300">已过期</span>
          </div>
        </div>
      </div>
      
      {/* 图形容器 */}
      <div className="relative" style={{ height: "600px" }}>
        <svg 
          ref={svgRef}
          className="w-full h-full"
          onClick={() => setSelectedNode(null)}
        />
        
        {/* 选中节点信息 */}
        {selectedNode && selectedNode !== 'center' && (
          <motion.div 
            className="absolute top-4 right-4 w-64 bg-gray-900/90 backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="font-bold text-white">
                {tools.find(t => t.id === selectedNode)?.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-300">
                <div className="mb-2">
                  <span className="text-cyber-blue">到期日期：</span> 
                  {new Date(tools.find(t => t.id === selectedNode)?.expirationDate || "").toLocaleDateString('zh-CN')}
                </div>
                <div>
                  <span className="text-cyber-blue">付费类型：</span>
                  {tools.find(t => t.id === selectedNode)?.feeType === 'monthly' ? '月付' : '年付'}
                </div>
                
                <div className="mt-3">
                  <span className="text-cyber-blue block mb-1">功能：</span>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    {tools.find(t => t.id === selectedNode)?.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// 确保同时导出命名导出和默认导出
export { SimpleGraphView };
export default SimpleGraphView;
