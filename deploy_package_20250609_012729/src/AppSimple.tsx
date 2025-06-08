import React from 'react';

function App() {
  console.log('App组件正在渲染...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '20px',
        color: '#00f5ff'
      }}>
        AI Tools Manager - 测试版本
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        如果你能看到这个页面，说明React渲染正常！
      </p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid rgba(0, 245, 255, 0.3)'
      }}>
        <h2>基本功能测试</h2>
        <p>当前时间: {new Date().toLocaleString()}</p>
        <button 
          onClick={() => alert('按钮点击正常!')}
          style={{
            background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.2), rgba(189, 0, 255, 0.2))',
            border: '1px solid rgba(0, 245, 255, 0.5)',
            color: '#00f5ff',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          测试点击
        </button>
      </div>
    </div>
  );
}

export default App;
