import React from 'react';

const Test: React.FC = () => {
  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a' }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个，说明React基本渲染正常！</p>
      <button onClick={() => alert('按钮点击正常!')}>
        点击测试
      </button>
    </div>
  );
};

export default Test;
