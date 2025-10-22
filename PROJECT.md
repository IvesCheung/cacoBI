# CacoBI - BI 数据查询配置系统

## 📊 项目介绍

CacoBI 是一个现代化的 BI (商业智能) 数据查询配置系统，基于 Vue 3 和 Element Plus 构建。系统提供了直观的用户界面来配置和管理数据查询的短链路和长链路参数。

![项目截图](./ignore/mockup/你的截图.png)

## ✨ 主要功能

### 🔧 配置管理

#### 短链路配置

- **DSL改写模型**: 选择数据查询语言改写使用的模型
- **Encoder**: 配置向量编码器
- **模板召回Top-k**: 调整召回模板的数量 (1-100)
- **模板相似度阈值**: 设置相似度匹配阈值 (0-1)

#### 长链路配置

- **问题拆解模型**: 将复杂查询拆解为多个子问题
- **表重排模型**: 优化表的查询顺序
- **指标配置模型**: 配置查询指标
- **维度配置模型**: 设置数据维度
- **筛选条件配置模型**: 配置数据筛选规则
- **表召回Top-k**: 召回相关表的数量 (1-100)
- **列召回Top-k**: 召回相关列的数量 (1-100)

### 🔍 查询功能

- 自然语言查询输入
- Cost Agent 智能代理开关
- 实时查询执行
- 查询耗时统计

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **UI组件库**: Element Plus
- **图标**: @element-plus/icons-vue
- **路由**: Vue Router 4
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 📦 项目结构

```
cacoBI/
├── src/
│   ├── components/
│   │   └── config/              # 配置组件
│   │       ├── ModelSelector.vue      # 模型选择器
│   │       ├── SliderInput.vue        # 滑块输入
│   │       ├── StepperInput.vue       # 步进器
│   │       ├── ShortChainConfig.vue   # 短链路配置
│   │       └── LongChainConfig.vue    # 长链路配置
│   ├── views/
│   │   └── DataQueryView.vue    # 数据查询主页面
│   ├── router/
│   │   └── index.js             # 路由配置
│   ├── assets/                  # 静态资源
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口
├── ignore/mockup/               # 墨刀原型文件
├── public/                      # 公共资源
├── package.json                 # 项目配置
├── vite.config.js              # Vite配置
└── SETUP.md                    # 安装文档
```

## 🚀 快速开始

### 前置要求

- Node.js >= 20.19.0 或 >= 22.12.0
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd cacoBI

# 安装依赖
npm install

# 安装 Element Plus 图标
npm install @element-plus/icons-vue
```

### 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 使用快速启动脚本 (Windows)

```powershell
.\start.ps1
```

## 🎨 设计特点

### UI/UX

- 🌙 深色主题设计
- 💎 现代化渐变卡片
- 📱 响应式布局
- ⚡ 流畅的交互动画

### 配色方案

```css
主题色: #2563EB (蓝色)
背景色: #0A0E1A (深蓝黑)
卡片背景: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%)
边框色: rgba(59, 130, 246, 0.3)
主文字: #FFFFFF
次要文字: #BABABA
标签色: #C0C0C0
```

## 📝 组件说明

### ModelSelector 模型选择器

用于选择各种AI模型，支持下拉选择。

```vue
<ModelSelector v-model="selectedModel" label="选择模型" :models="['model1', 'model2']" />
```

### SliderInput 滑块输入

用于精确调整数值参数，如相似度阈值。

```vue
<SliderInput v-model="threshold" label="相似度阈值" :min="0" :max="1" :step="0.01" :precision="2" />
```

### StepperInput 步进器

用于调整整数参数，如召回数量。

```vue
<StepperInput v-model="topK" label="Top-K" :min="1" :max="100" />
```

## 🔌 API 集成

项目目前为前端演示版本。要集成后端 API:

1. 在 `DataQueryView.vue` 的 `handleQuery` 方法中添加 API 调用
2. 使用 axios 或 fetch 发送请求
3. 处理响应数据和错误

```javascript
// 示例代码
const handleQuery = async () => {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      body: JSON.stringify({
        query: queryText.value,
        shortChain: shortChainConfig,
        longChain: longChainConfig,
      }),
    })
    const data = await response.json()
    // 处理数据
  } catch (error) {
    ElMessage.error('查询失败')
  }
}
```

## 📊 可用模型

### DSL 改写模型

- Qwen3-embedding-0.6B
- Qwen3-embedding-4B
- Entity-agnostic Qwen3-0.6B

### LLM 模型

- Qwen2.5-instruct-72B
- Qwen3-32B
- Deepseek-v3

## 🧪 测试

```bash
# 运行单元测试
npm run test:unit

# 运行 E2E 测试
npm run test:e2e
```

## 📋 代码规范

```bash
# 检查代码
npm run lint

# 格式化代码
npm run format
```

## 🔧 配置文件

- `vite.config.js` - Vite 构建配置
- `eslint.config.js` - ESLint 代码检查配置
- `playwright.config.js` - Playwright E2E 测试配置
- `vitest.config.js` - Vitest 单元测试配置

## 📱 响应式支持

项目支持以下屏幕尺寸:

- 桌面端: >= 1200px (双列布局)
- 平板端: < 1200px (单列布局)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目使用 MIT 许可证。

## 👥 团队

- 开发者: [Your Name]
- 设计: [Designer Name]

## 📞 联系方式

如有问题或建议，请联系:

- Email: your.email@example.com
- Issues: [项目 Issues 页面]

## 🎯 路线图

- [ ] 添加更多模型选项
- [ ] 集成后端 API
- [ ] 添加查询结果可视化
- [ ] 支持查询历史记录
- [ ] 添加配置导出/导入功能
- [ ] 多语言支持

## 📚 相关资源

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)

---

⭐ 如果这个项目对你有帮助，请给我们一个 Star!
