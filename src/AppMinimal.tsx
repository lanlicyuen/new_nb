import { useState } from 'react';
import { Plus, Brain } from 'lucide-react';

function App() {
  console.log('App组件开始渲染...');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #00f5ff, #bd00ff)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #00f5ff, #bd00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                AI 工具管理器
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>數字化智能工具筆記本</p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => alert('添加工具功能')}
            style={{
              background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.2), rgba(189, 0, 255, 0.2))',
              border: '1px solid rgba(0, 245, 255, 0.5)',
              color: '#00f5ff',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <Plus size={20} />
            添加工具
          </button>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #00f5ff, #bd00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            工具统计
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>总工具数量: 2</p>
          <p style={{ color: '#9ca3af' }}>总费用: $116</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #00f5ff, #bd00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            工具列表
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Tool 1 */}
            <div style={{
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#00f5ff', marginBottom: '8px' }}>
                x.com Premium
              </h3>
              <p style={{ color: '#9ca3af', margin: '4px 0' }}>费用: $96 (yearly)</p>
              <p style={{ color: '#9ca3af', margin: '4px 0' }}>到期: 2026-06-07</p>
            </div>

            {/* Tool 2 */}
            <div style={{
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#00f5ff', marginBottom: '8px' }}>
                Cursor
              </h3>
              <p style={{ color: '#9ca3af', margin: '4px 0' }}>费用: $20 (monthly)</p>
              <p style={{ color: '#9ca3af', margin: '4px 0' }}>到期: 2025-06-01</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
