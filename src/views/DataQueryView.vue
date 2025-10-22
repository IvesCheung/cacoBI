<template>
  <div class="data-query-view">
    <div class="container">
      <!-- 左侧：链路展示区 -->
      <div class="left-section">
        <ShortChainPanel
          :steps="shortSteps"
          :progress="shortProgress"
          :time="shortChainTime"
          class="chain-panel-wrapper"
        />

        <LongChainPanel
          :steps="longSteps"
          :progress="longProgress"
          :time="longChainTime"
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
          @execute="handleExecute"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
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
  shortChainConfig,
  longChainConfig,
  shortSteps,
  longSteps,
  shortProgress,
  longProgress,
  executeQuery
} = useBIQuery()

// 执行查询
const handleExecute = async () => {
  await executeQuery()
}
</script>

<style scoped>
.data-query-view {
  min-height: 100vh;
  background: #0f172a;
  padding: 24px;
}

.container {
  display: flex;
  gap: 24px;
  height: calc(100vh - 48px);
  max-width: 1920px;
  margin: 0 auto;
}

/* 左侧：链路展示区 */
.left-section {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.chain-panel-wrapper {
  flex-shrink: 0;
}

/* 中间：配置面板 */
.middle-section {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.config-wrapper {
  flex-shrink: 0;
}

/* 右侧：查询面板 */
.right-section {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

/* 滚动条样式 */
.left-section::-webkit-scrollbar,
.middle-section::-webkit-scrollbar,
.right-section::-webkit-scrollbar {
  width: 6px;
}

.left-section::-webkit-scrollbar-track,
.middle-section::-webkit-scrollbar-track,
.right-section::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 3px;
}

.left-section::-webkit-scrollbar-thumb,
.middle-section::-webkit-scrollbar-thumb,
.right-section::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.8);
  border-radius: 3px;
}

.left-section::-webkit-scrollbar-thumb:hover,
.middle-section::-webkit-scrollbar-thumb:hover,
.right-section::-webkit-scrollbar-thumb:hover {
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
