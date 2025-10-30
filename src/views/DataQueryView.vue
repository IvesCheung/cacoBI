<template>
  <div class="data-query-view">
    <div class="container">
      <!-- 左侧：链路展示区 -->
      <div class="left-section">
        <OptimizedChainPanel
          :short-steps="shortSteps"
          :long-steps="longOptimizeSteps"
          :hit-cache="hitCache"
          :short-time="shortOptimizeChainTime"
          :long-time="longOptimizeChainTime"
          :short-tokens="shortOptimizeChainTokens"
          :long-tokens="longOptimizeChainTokens"
          :short-l-l-m-calls="shortOptimizeLLMCalls"
          :long-l-l-m-calls="longOptimizeLLMCalls"
          class="chain-panel-wrapper"
        />

        <LongChainPanel
          :steps="longSteps"
          :progress="longProgress"
          :time="longChainTime"
          :total-tokens="longChainTokens"
          :llm-calls="longLLMCalls"
          class="chain-panel-wrapper"
        />
      </div>

      <!-- 右侧：查询面板 -->
      <div class="right-section">
        <QueryPanel
          v-model:query-text="queryText"
          v-model:cost-agent-enabled="costAgentEnabled"
          v-model:short-chain-config="shortChainConfig"
          v-model:long-chain-config="longChainConfig"
          :is-executing="isExecuting"
          :short-completed="shortOptimizeCompleted"
          :long-completed="longOptimizeCompleted"
          :short-progress="shortOptimizeProgress"
          :long-progress="longOptimizeProgress"
          :query-result="queryResult"
          :current-example-id="currentExampleId"
          @execute="handleExecute"
          @clear-logs="clearLogs"
          @example-change="handleExampleChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import OptimizedChainPanel from '@/components/OptimizedChainPanel.vue'
import LongChainPanel from '@/components/LongChainPanel.vue'
import QueryPanel from '@/components/QueryPanel.vue'
import { useBIQuery } from '@/composables/useBIQuery'

// 使用状态管理
const {
  isExecuting,
  costAgentEnabled,
  hitCache,

  // 优化链路
  shortOptimizeChainTime,
  shortOptimizeChainTokens,
  shortOptimizeLLMCalls,
  shortOptimizeCompleted,
  longOptimizeChainTime,
  longOptimizeChainTokens,
  longOptimizeLLMCalls,
  longOptimizeCompleted,

  // 原始长链路
  longChainTime,
  longChainTokens,
  longLLMCalls,
  longCompleted,

  queryText,
  queryResult,
  shortChainConfig,
  longChainConfig,
  shortSteps,
  longSteps,
  longOptimizeSteps,
  shortOptimizeProgress,
  longOptimizeProgress,
  longProgress,
  currentExampleId,
  executeQuery,
  clearLogs,
  loadQueryExample
} = useBIQuery()

// 执行查询
const handleExecute = async () => {
  await executeQuery()
}

// 处理示例切换
const handleExampleChange = (exampleId) => {
  loadQueryExample(exampleId)
}
</script>

<style scoped>
.data-query-view {
  height: 100vh;
  background: var(--app-bg-color);
  padding: 12px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.container {
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 12px;
  height: 100%;
  max-width: 95%;
  margin: 0 auto;
  grid-template-areas:
    "optimized-chain query"
    "long-chain query";
}

/* 左侧：链路展示区 */
.left-section {
  display: contents;
}

.chain-panel-wrapper:first-child {
  grid-area: optimized-chain;
}

.chain-panel-wrapper:last-child {
  grid-area: long-chain;
}

/* 右侧：查询面板 */
.right-section {
  grid-area: query;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

/* 滚动条样式 */
.chain-panel-wrapper::-webkit-scrollbar {
  width: 4px;
}

.chain-panel-wrapper::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 2px;
}

.chain-panel-wrapper::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.8);
  border-radius: 2px;
}

.chain-panel-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.9);
}

/* 响应式设计 */
@media (max-width: 1600px) {
  .container {
    flex-wrap: wrap;
  }

  .left-section {
    flex: 0 0 100%;
    max-height: 500px;
  }

  .middle-section {
    flex: 0 0 calc(40% - 12px);
  }

  .right-section {
    flex: 0 0 calc(60% - 12px);
  }
}

@media (max-width: 1200px) {
  .middle-section,
  .right-section {
    flex: 0 0 100%;
  }
}
</style>
