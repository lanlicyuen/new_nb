# AI Tools Manager 🤖✨

一个采用赛博朋克风格设计的AI工具管理器，帮助您追踪和管理您的AI工具订阅。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6-purple.svg)

## 🚀 功能特色

### 核心功能
- 📝 **工具管理** - 添加、编辑、删除AI工具
- 💰 **费用追踪** - 自动计算年度总费用
- 📊 **统计面板** - 实时显示工具数量和费用统计
- ⏰ **到期提醒** - 智能计算工具到期日期
- 💾 **数据持久化** - 使用localStorage保存数据

### 设计特色
- 🎨 **赛博朋克风格** - 深色主题配霓虹色彩
- ✨ **玻璃质感** - 现代化玻璃态设计
- 🌟 **流畅动画** - 丰富的微交互效果
- 📱 **响应式设计** - 完美适配各种设备

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: 自定义CSS + 工具类
- **图标库**: Lucide React
- **动画**: CSS Transitions + Transform
- **数据存储**: LocalStorage

## 🎮 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 📋 使用说明

### 添加AI工具
1. 点击右上角的"添加工具"按钮
2. 填写工具信息：
   - 工具名称（必填）
   - 购买日期（必填）
   - 费用类型（月费/年费）
   - 费用金额（可选）
   - 功能描述（至少一个）
3. 点击"添加工具"完成添加

### 管理工具
- **查看工具**: 在工具列表中查看所有已添加的工具
- **删除工具**: 点击工具卡片上的"删除"按钮
- **实时统计**: 顶部统计面板自动更新数据

### 功能描述管理
- 初始提供两个功能输入框
- 点击底部的蓝色"+"按钮添加更多功能
- 当功能超过2个时显示红色"×"删除按钮

## 🎨 界面预览

### 主界面
- 赛博朋克风格的深色主题
- 玻璃质感的卡片设计
- 渐变色的标题和按钮

### 添加工具表单
- 模态框设计，背景模糊效果
- 表单验证和错误提示
- 动态功能输入管理

### 统计面板
- 总工具数量
- 年度总费用计算
- 月费工具统计

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── AddToolForm.tsx # 添加工具表单
│   ├── Stats.tsx       # 统计面板
│   ├── ToolList.tsx    # 工具列表
│   └── ...
├── types/              # TypeScript类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── index.ts
├── AppStable.tsx       # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 🔧 自定义配置

### 样式自定义
项目使用自定义CSS变量，可以轻松修改主题色彩：

```css
/* 主要颜色 */
.text-cyber-blue { color: #00f5ff; }
.text-cyber-purple { color: #bd00ff; }
.text-cyber-pink { color: #ff0080; }
.text-cyber-green { color: #00ff41; }
```

### 功能扩展
- 添加思维导图视图
- 集成到期提醒通知
- 导出数据功能
- 云端同步

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Lucide](https://lucide.dev/) - 图标库
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

---

<div align="center">
  Made with ❤️ and ☕ by lanlicyuen
</div>
