# CacoBI 项目安装和运行指南

## 项目概述

这是一个基于 Vue 3 + Element Plus 的 BI 数据查询配置系统。主要功能包括:

- **短链路配置**: DSL改写模型、Encoder、模板召回Top-k、相似度阈值等
- **长链路配置**: 问题拆解、表重排、指标配置、维度配置、筛选条件等模型配置
- **数据查询界面**: 支持自然语言查询输入和Cost Agent开关

## 目录结构

```
src/
├── components/
│   └── config/
│       ├── ModelSelector.vue      # 模型选择器组件
│       ├── SliderInput.vue        # 滑块输入组件
│       ├── StepperInput.vue       # 步进器输入组件
│       ├── ShortChainConfig.vue   # 短链路配置组件
│       └── LongChainConfig.vue    # 长链路配置组件
├── views/
│   └── DataQueryView.vue          # 主查询页面
├── router/
│   └── index.js                   # 路由配置
├── App.vue                        # 主应用组件
└── main.js                        # 应用入口
```

## 安装步骤

### 1. 安装依赖

请确保你已经安装了 Node.js (版本 20.19.0 或 22.12.0+)

```bash
npm install
```

### 2. 安装 Element Plus 图标 (重要!)

```bash
npm install @element-plus/icons-vue
```

## 运行项目

### 开发模式

```bash
npm run dev
```

项目将在 http://localhost:5173 启动

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 主要特性

### 1. 短链路配置

- DSL改写模型选择
- Encoder模型选择
- 模板召回Top-k调整 (1-100)
- 模板相似度阈值滑块 (0-1)

### 2. 长链路配置

- 问题拆解模型
- 表重排模型
- 指标配置模型
- 维度配置模型
- 筛选条件配置模型
- 表召回Top-k (1-100)
- 列召回Top-k (1-100)

### 3. 查询功能

- 自然语言查询输入
- Cost Agent 开关
- 执行查询按钮
- 查询耗时显示

## 组件使用说明

### ModelSelector 组件

```vue
<ModelSelector v-model="selectedModel" label="模型名称" :models="['model1', 'model2', 'model3']" />
```

### SliderInput 组件

```vue
<SliderInput v-model="value" label="相似度阈值" :min="0" :max="1" :step="0.01" :precision="2" />
```

### StepperInput 组件

```vue
<StepperInput v-model="count" label="召回Top-k" :min="1" :max="100" :step="1" />
```

## 样式主题

项目使用深色主题，主要颜色:

- 主题色: `#2563EB` (蓝色)
- 背景色: `#0A0E1A` (深蓝黑)
- 卡片背景: `linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%)`
- 边框色: `rgba(59, 130, 246, 0.3)`
- 文字色: `#FFFFFF` (主文字), `#BABABA` (次要文字), `#C0C0C0` (标签)

## 配置项说明

### 可用的 DSL 模型

- Qwen3-embedding-0.6B
- Qwen3-embedding-4B
- Entity-agnostic Qwen3-0.6B

### 可用的 LLM 模型

- Qwen2.5-instruct-72B
- Qwen3-32B
- Deepseek-v3

## 开发建议

1. 配置组件采用 Vue 3 Composition API
2. 使用 Element Plus 组件库保持UI一致性
3. 所有配置项使用 v-model 双向绑定
4. 响应式设计支持大屏幕显示 (1200px+)

## 问题排查

如果遇到图标不显示的问题:

```bash
npm install @element-plus/icons-vue
```

如果遇到样式问题:

```bash
npm install element-plus
```

## API 集成

当前为前端演示版本,查询功能模拟API调用。要集成真实后端:

1. 在 `DataQueryView.vue` 的 `handleQuery` 方法中替换模拟代码
2. 添加 axios 或 fetch 进行实际API调用
3. 处理实际的响应数据和错误

示例:

```javascript
const handleQuery = async () => {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryText.value,
        useCostAgent: useCostAgent.value,
        shortChain: shortChainConfig,
        longChain: longChainConfig,
      }),
    })
    const data = await response.json()
    // 处理返回数据
  } catch (error) {
    ElMessage.error('查询失败')
  }
}
```

## 联系方式

如有问题请联系开发团队。
