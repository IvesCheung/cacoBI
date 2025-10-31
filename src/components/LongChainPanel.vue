<template>
  <div class="chain-panel">
    <div class="panel-header">
      <h2 class="panel-title long-title">🟠 NL-to-DSL using Long-chain</h2>
      <ProgressBar
        :progress-array="progress"
        :time="time"
        :total-tokens="totalTokens"
        :llm-calls="llmCalls"
        start-color="#f59e0b"
      />
    </div>

    <el-scrollbar class="panel-body">
      <LongChainFlow :steps="steps" :short-steps="shortSteps" :optimized-long-steps="optimizedLongSteps" />
    </el-scrollbar>
  </div>
</template>

<script setup>
import ProgressBar from './ProgressBar.vue'
import LongChainFlow from './LongChainFlow.vue'

defineProps({
  steps: {
    type: Object,
    required: true
  },
  progress: {
    type: Array,
    required: true
  },
  time: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  llmCalls: {
    type: Number,
    default: 0
  },
  shortSteps: {
    type: Array,
    default: () => []
  },
  optimizedLongSteps: {
    type: Object,
    default: () => ({})
  }
})
</script><style scoped>
.chain-panel {
  background: linear-gradient(145deg, var(--panel-bg-gradient-from) 0%, var(--panel-bg-gradient-to) 100%);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow:
    0 4px 16px var(--app-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  height: 100%;
  transition: all 0.3s ease;
}

.chain-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px 12px 0 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.long-title {
  color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-body {
  flex: 1;
  min-height: 0;
}

.panel-body :deep(.el-scrollbar__wrap) {
  overflow-x: auto;
  overflow-y: hidden;
}

.panel-body :deep(.el-scrollbar__view) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 220px;
  padding: 20px 0;
}
</style>

