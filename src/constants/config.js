// 模型配置选项
export const DSL_MODELS = [
  'Qwen3-embedding-0.6B',
  'Qwen3-embedding-4B',
  'Entity-agnostic Qwen3-0.6B',
]

export const LLM_MODELS = ['Qwen2.5-instruct-72B', 'Qwen3-32B', 'Deepseek-v3']

// 默认配置
export const DEFAULT_SHORT_CHAIN_CONFIG = {
  dslModel: 'Qwen3-embedding-0.6B',
  encoder: 'Qwen2.5-instruct-72B',
  templateRecallTopK: 3,
  templateSimilarityThreshold: 0.3,
}

export const DEFAULT_LONG_CHAIN_CONFIG = {
  // 配置解析阶段
  entityRecognitionModel: 'Qwen2.5-instruct-72B',
  questionRewriteModel: 'Qwen2.5-instruct-72B',
  questionClarifyModel: 'Qwen2.5-instruct-72B',
  // 表召回与选择
  tableRecallTopK: 50,
  tableSelectionModel: 'Deepseek-v3',
  // Rerank
  fieldRerankModel: 'Deepseek-v3',
  dimensionRerankModel: 'Deepseek-v3',
  // DSL配置
  measureParseModel: 'Deepseek-v3',
  dimensionParseModel: 'Deepseek-v3',
  filterParseModel: 'Deepseek-v3',
}

// 示例查询
export const EXAMPLE_QUERIES = [
  '包含本体系统的个人分享次数的TOP3，还按年份分组，还把年份分组的总和也列出来, 这些数据中 实际开始时间 在 2021-06-19 到 2029-07-30 之间',
  '查询最近30天的用户活跃度',
  '统计各部门的销售额，按月份分组',
  '分析产品A和产品B的销售对比',
  '查询客户满意度评分Top10',
]

// 配置项说明
export const CONFIG_DESCRIPTIONS = {
  dslModel: '用于将自然语言转换为DSL的模型',
  encoder: '用于向量化文本的编码器模型',
  templateRecallTopK: '从模板库中召回的候选模板数量',
  templateSimilarityThreshold: '模板匹配的最低相似度要求',
  questionDecomposeModel: '将复杂问题拆解为子问题的模型',
  tableRerankModel: '对召回的表进行重新排序的模型',
  metricConfigModel: '配置查询指标的模型',
  dimensionConfigModel: '配置数据维度的模型',
  filterConfigModel: '配置筛选条件的模型',
  tableRecallTopK: '召回相关数据表的数量',
  columnRecallTopK: '召回相关列的数量',
}
