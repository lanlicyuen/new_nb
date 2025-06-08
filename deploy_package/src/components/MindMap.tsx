import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { AITool } from '../types';
import { cn } from '../utils';

interface MindMapNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'center' | 'tool' | 'feature';
  features?: string[];
  parentId?: string;
}

interface MindMapLink extends d3.SimulationLinkDatum<MindMapNode> {
  source: string | MindMapNode;
  target: string | MindMapNode;
}

interface MindMapProps {
  tools: AITool[];
  className?: string;
}

export const MindMap: React.FC<MindMapProps> = ({ tools, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: MindMapNode } | null>(null);

  useEffect(() => {
    if (!svgRef.current || tools.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create nodes and links
    const nodes: MindMapNode[] = [];
    const links: MindMapLink[] = [];

    // Center node
    const centerNode: MindMapNode = {
      id: 'center',
      name: 'AI 工具管理',
      type: 'tool',
      x: width / 2,
      y: height / 2
    };
    nodes.push(centerNode);

    // Add tool nodes and feature nodes
    tools.forEach((tool, toolIndex) => {
      const angle = (toolIndex * 2 * Math.PI) / tools.length;
      const radius = 200;
      const toolX = width / 2 + Math.cos(angle) * radius;
      const toolY = height / 2 + Math.sin(angle) * radius;

      const toolNode: MindMapNode = {
        id: tool.id,
        name: tool.name,
        type: 'tool',
        x: toolX,
        y: toolY,
        features: tool.features
      };
      nodes.push(toolNode);

      // Link tool to center
      links.push({
        source: 'center',
        target: tool.id
      });

      // Add feature nodes
      tool.features.forEach((feature, featureIndex) => {
        const featureAngle = angle + ((featureIndex - (tool.features.length - 1) / 2) * 0.3);
        const featureRadius = 80;
        const featureX = toolX + Math.cos(featureAngle) * featureRadius;
        const featureY = toolY + Math.sin(featureAngle) * featureRadius;

        const featureNode: MindMapNode = {
          id: `${tool.id}-${featureIndex}`,
          name: feature,
          type: 'feature',
          parentId: tool.id,
          x: featureX,
          y: featureY
        };
        nodes.push(featureNode);

        // Link feature to tool
        links.push({
          source: tool.id,
          target: featureNode.id
        });
      });
    });

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<MindMapNode, MindMapLink>(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Add links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#00f5ff")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 3px #00f5ff)");

    // Add nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer");

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d) => d.type === 'tool' ? (d.id === 'center' ? 40 : 25) : 15)
      .attr("fill", (d) => {
        if (d.id === 'center') return "#bd00ff";
        return d.type === 'tool' ? "#00f5ff" : "#00ff41";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("filter", (d) => {
        const color = d.id === 'center' ? '#bd00ff' : d.type === 'tool' ? '#00f5ff' : '#00ff41';
        return `drop-shadow(0 0 10px ${color})`;
      });

    // Add labels
    node.append("text")
      .text((d) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.type === 'tool' ? (d.id === 'center' ? 50 : 35) : 25)
      .attr("fill", "#ffffff")
      .attr("font-size", (d) => d.type === 'tool' ? (d.id === 'center' ? "14px" : "12px") : "10px")
      .attr("font-weight", (d) => d.type === 'tool' ? "600" : "400")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 5px currentColor");

    // Add hover effects
    node
      .on("mouseenter", (event, d) => {
        if (d.id === 'center') return;
        
        const [x, y] = d3.pointer(event, svgRef.current);
        setTooltip({ x, y, node: d });
        
        // Highlight connected links
        link
          .style("stroke-opacity", (l) => {
            const source = typeof l.source === 'string' ? l.source : (l.source as MindMapNode)?.id;
            const target = typeof l.target === 'string' ? l.target : (l.target as MindMapNode)?.id;
            return source === d.id || target === d.id ? 1 : 0.2;
          })
          .style("stroke-width", (l) => {
            const source = typeof l.source === 'string' ? l.source : (l.source as MindMapNode)?.id;
            const target = typeof l.target === 'string' ? l.target : (l.target as MindMapNode)?.id;
            return source === d.id || target === d.id ? 3 : 2;
          });

        // Highlight node
        d3.select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.type === 'tool' ? 30 : 18);
      })
      .on("mouseleave", () => {
        setTooltip(null);
        
        // Reset links
        link
          .style("stroke-opacity", 0.6)
          .style("stroke-width", 2);

        // Reset node
        node.select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => d.type === 'tool' ? 25 : 15);
      })
      .on("click", (_event, d) => {
        if (d.id !== 'center') {
          setSelectedNode(d);
        }
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => {
          const source = d.source as MindMapNode;
          return source.x || 0;
        })
        .attr("y1", (d) => {
          const source = d.source as MindMapNode;
          return source.y || 0;
        })
        .attr("x2", (d) => {
          const target = d.target as MindMapNode;
          return target.x || 0;
        })
        .attr("y2", (d) => {
          const target = d.target as MindMapNode;
          return target.y || 0;
        });

      node
        .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [tools]);

  const handleCloseDetails = () => {
    setSelectedNode(null);
  };

  return (
    <div className={cn("relative w-full h-full min-h-[600px]", className)}>
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        className="glass-card border-cyber-blue/30"
        viewBox="0 0 800 600"
      >
        {/* Background pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f5ff" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 glass-card p-3 pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
        >
          <h4 className="font-semibold text-cyber-blue mb-1">{tooltip.node.name}</h4>
          <p className="text-xs text-gray-300">
            {tooltip.node.type === 'tool' ? '工具' : '功能'}
          </p>
          {tooltip.node.features && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">功能:</p>
              <div className="flex flex-wrap gap-1">
                {tooltip.node.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="text-xs bg-cyber-blue/20 text-cyber-blue px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {tooltip.node.features.length > 3 && (
                  <span className="text-xs text-gray-400">...</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Node details panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 glass-card p-4 w-64 z-20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-cyber-blue">{selectedNode.name}</h3>
            <button
              onClick={handleCloseDetails}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-gray-300 mb-2">
            類型: {selectedNode.type === 'tool' ? '工具' : '功能'}
          </p>
          
          {selectedNode.features && (
            <div>
              <p className="text-sm text-gray-400 mb-2">功能列表:</p>
              <div className="space-y-1">
                {selectedNode.features.map((feature, index) => (
                  <div key={index} className="text-xs bg-cyber-green/20 text-cyber-green px-2 py-1 rounded">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 glass-card p-3 text-xs text-gray-400">
        <p>💡 懸停節點查看詳情，點擊節點查看完整信息</p>
      </div>
    </div>
  );
};
