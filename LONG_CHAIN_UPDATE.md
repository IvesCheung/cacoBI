# 长链路流程重构说明

## 更新时间

2025-10-23

## 更新内容

### 1. 新增组件

#### ChainStepNode.vue

- 步骤节点组件，支持两种类型：
  - **LLM步骤** (蓝色主题): 需要调用LLM，有Token消耗和时间开销
  - **传统计算步骤** (紫色主题): 传统计算过程，无Token消耗
- 详细信息改为悬停/点击显示，界面更简洁
- 支持锁定显示状态（点击节点锁定详情面板）

#### ParallelChainFlow.vue

- 并行流程图组件，支持多阶段流程展示
- 自动识别并行执行的步骤组（虚线框标识）
- 紧凑布局，适应一屏显示
- 阶段间用箭头连接，清晰展示流程顺序

### 2. 更新的长链路流程

根据真实业务场景，新的长链路包含7个阶段：

#### 阶段1: 配置解析 (并行执行)

- 实体识别 (LLM)
- 问题改写 (LLM)
- 问题澄清 (LLM)

#### 阶段2: 表召回 (并行执行)

- 主体召回表 (传统计算)
- 字段召回表 (传统计算)
- 业务术语召回表 (传统计算)

#### 阶段3: 选表

- 选表 (N→1) (LLM)

#### 阶段4: 单表知识召回 (并行执行)

- 学段召回 (传统计算)
- 业务术语 (传统计算)
- 表规则 (传统计算)
- 维度维值召回 (传统计算)

#### 阶段5: 召回Rerank (并行执行)

- 学段召回Rerank (LLM)
- 维值Rerank (LLM)

#### 阶段6: 配置解析 (并行执行)

- 指标解析 (LLM)
- 维度解析 (LLM)
- 筛选解析 (LLM)

#### 阶段7: DSL配置转换

- DSL配置转换 (传统计算)

### 3. 配置项更新

`LongChainConfig.vue` 新增配置项：

- **配置解析阶段**
  - 实体识别模型
  - 问题改写模型
  - 问题澄清模型
- **表召回与选择**
  - 表召回Top-k
  - 选表模型
- **召回Rerank**
  - 学段Rerank模型
  - 维值Rerank模型
- **DSL配置**
  - 指标解析模型
  - 维度解析模型
  - 筛选解析模型

### 4. 数据结构变更

`useBIQuery.js` 中的 `longSteps` 从数组改为对象结构：

```javascript
longSteps = {
  stage1: { title, parallel, steps: [] },
  stage2: { title, parallel, steps: [] },
  // ...
}
```

每个 step 包含：

- `id`: 唯一标识
- `title`: 步骤名称
- `type`: 'llm' 或 'compute'
- `status`: 'inactive', 'active', 'completed'
- `tokens`: Token消耗 (仅LLM步骤)
- `duration`: 耗时 (仅LLM步骤)
- `details`: 详细信息数组

### 5. UI优化

- 节点更紧凑，尺寸从 180-280px 缩减到 120-160px
- 阶段间距缩小，从 20px 减到 12px
- 详情信息默认隐藏，悬停/点击显示
- 添加流畅的动画过渡效果
- 并行执行用虚线框和橙色标签标识
- LLM步骤和传统计算步骤用不同颜色区分

## 使用说明

1. 启动应用后，点击"执行查询"按钮
2. 长链路将按阶段顺序执行
3. 并行步骤会同时开始和完成
4. 悬停或点击节点查看详细信息
5. 点击详情面板的关闭按钮或再次点击节点关闭详情

## 技术特点

- ✅ 支持并行执行可视化
- ✅ 区分LLM和传统计算步骤
- ✅ 紧凑布局，一屏显示
- ✅ 详情按需显示，不影响整体视图
- ✅ 使用Element Plus图标库
- ✅ 响应式设计
- ✅ 流畅的动画效果
- ✅ 无Linting错误

## 文件清单

新增文件：

- `src/components/ChainStepNode.vue` - 步骤节点组件
- `src/components/ParallelChainFlow.vue` - 并行流程图组件

修改文件：

- `src/components/LongChainPanel.vue` - 使用新的流程图组件
- `src/components/config/LongChainConfig.vue` - 新增配置项
- `src/composables/useBIQuery.js` - 更新数据结构和执行逻辑
- `src/constants/config.js` - 更新默认配置
- `src/views/DataQueryView.vue` - 移除废弃的props

## 后续优化建议

1. 可考虑添加流程图缩放功能
2. 可添加节点搜索和过滤功能
3. 可支持导出流程图为图片
4. 可添加更多的执行统计数据
