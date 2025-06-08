// 调试工具 - 检查GraphView组件数据流
import React, { useEffect } from 'react';

interface DebuggerProps {
  data: any;
  label: string;
}

// 简单的日志组件，仅用于开发环境
export const DataDebugger: React.FC<DebuggerProps> = ({ data, label }) => {
  useEffect(() => {
    console.log(`[${label}]`, data);
  }, [data, label]);
  
  // 这个组件不渲染任何内容，只是记录到控制台
  return null;
};

export default DataDebugger;
