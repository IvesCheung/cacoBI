<template>
  <div class="data-query-view">
    <div class="container">
      <!-- 左侧：链路展示区 -->
      <div class="left-section">
        <ShortChainPanel
          :steps="shortSteps"
          :progress="shortProgress"
          :time="shortChainTime"
          :total-tokens="shortChainTokens"
          :llm-calls="shortLLMCalls"
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

      <!-- 中间：配置面板 -->
      <div class="middle-section">
        <ShortChainConfig
          v-model="shortChainConfig"
          class="config-wrapper"
        />

        <LongChainConfig
          v-model="longChainConfig"
          class="config-wrapper"
        />
      </div>

      <!-- 右侧：查询面板 -->
      <div class="right-section">
        <QueryPanel
          v-model:query-text="queryText"
          v-model:cost-agent-enabled="costAgentEnabled"
          :is-executing="isExecuting"
          :short-completed="shortCompleted"
          :long-completed="longCompleted"
          :short-progress="shortProgress"
          :long-progress="longProgress"
          :query-result="queryResult"
          @execute="handleExecute"
          @clear-logs="clearLogs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShortChainPanel from '@/components/ShortChainPanel.vue'
import LongChainPanel from '@/components/LongChainPanel.vue'
import ShortChainConfig from '@/components/config/ShortChainConfig.vue'
import LongChainConfig from '@/components/config/LongChainConfig.vue'
import QueryPanel from '@/components/QueryPanel.vue'
import { useBIQuery } from '@/composables/useBIQuery'

// 使用状态管理
const {
  isExecuting,
  costAgentEnabled,
  shortChainTime,
  longChainTime,
  shortCompleted,
  longCompleted,
  queryText,
  queryResult,
  shortChainConfig,
  longChainConfig,
  shortSteps,
  longSteps,
  shortProgress,
  longProgress,
  shortChainTokens,
  longChainTokens,
  shortLLMCalls,
  longLLMCalls,
  executeQuery,
  clearLogs
} = useBIQuery()

// 执行查询
const handleExecute = async () => {
  await executeQuery()
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
  grid-template-columns: 1.1fr 400px 0.9fr;
  grid-template-rows: auto auto;
  gap: 12px;
  height: 100%;
  max-width: 1920px;
  margin: 0 auto;
  grid-template-areas:
    "short-chain short-config query"
    "long-chain long-config query";
}

/* 左侧：链路展示区 */
.left-section {
  display: contents;
}

.chain-panel-wrapper:first-child {
  grid-area: short-chain;
}

.chain-panel-wrapper:last-child {
  grid-area: long-chain;
}

/* 中间：配置面板 */
.middle-section {
  display: contents;
}

.config-wrapper:first-child {
  grid-area: short-config;
}

.config-wrapper:last-child {
  grid-area: long-config;
}

/* 右侧：查询面板 */
.right-section {
  grid-area: query;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

/* 滚动条样式 */
.chain-panel-wrapper::-webkit-scrollbar,
.middle-section::-webkit-scrollbar {
  width: 4px;
}

.chain-panel-wrapper::-webkit-scrollbar-track,
.middle-section::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 2px;
}

.chain-panel-wrapper::-webkit-scrollbar-thumb,
.middle-section::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.8);
  border-radius: 2px;
}

.chain-panel-wrapper::-webkit-scrollbar-thumb:hover,
.middle-section::-webkit-scrollbar-thumb:hover {
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
