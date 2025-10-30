<template>
  <div class="chain-panel">
    <div class="panel-header">
      <h2 class="panel-title optimized-title">🔀 Optimized Chain</h2>
      <ProgressBar
        :progress-array="hitCache ? shortProgress : longProgress"
        :time="hitCache ? shortTime : longTime"
        :total-tokens="hitCache ? shortTokens : longTokens"
        :llm-calls="hitCache ? shortLLMCalls : longLLMCalls"
        :start-color="'#10b981'"
      />
    </div>

    <el-scrollbar class="panel-body">
      <OptimizedChainFlow
        :short-steps="shortSteps"
        :long-steps="longSteps"
        :hit-cache="hitCache"
        :query-analyze-status="queryAnalyzeStatus"
        :analyze-node="analyzeNode"
      />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'
import OptimizedChainFlow from './OptimizedChainFlow.vue'

const props = defineProps({
  shortSteps: {
    type: Array,
    required: true
  },
  longSteps: {
    type: Object,
    required: true
  },
  hitCache: {
    type: Boolean,
    default: false
  },
  queryAnalyzeStatus: {
    type: String,
    default: 'pending'
  },
  analyzeNode: {
    type: Object,
    required: true
  },
  shortTime: {
    type: Number,
    default: 0
  },
  longTime: {
    type: Number,
    default: 0
  },
  shortTokens: {
    type: Number,
    default: 0
  },
  longTokens: {
    type: Number,
    default: 0
  },
  shortLLMCalls: {
    type: Number,
    default: 0
  },
  longLLMCalls: {
    type: Number,
    default: 0
  }
})

// 根据 hitCache 计算进度数组
const shortProgress = computed(() => {
  if (!props.shortSteps || props.shortSteps.length === 0) return [0, 0, 0]
  return props.shortSteps.map(step => step.completed ? 100 : step.active ? 50 : 0)
})

const longProgress = computed(() => {
  if (!props.longSteps) return [0, 0, 0, 0, 0, 0, 0]
  const stages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7']
  return stages.map(stageKey => {
    const stage = props.longSteps[stageKey]
    if (!stage || !stage.steps) return 0
    const completedCount = stage.steps.filter(s => s.completed).length
    const activeCount = stage.steps.filter(s => s.active).length
    const total = stage.steps.length
    if (completedCount === total) return 100
    if (activeCount > 0) return 50
    return 0
  })
})
</script>

<style scoped>
.chain-panel {
  background: linear-gradient(145deg, var(--panel-bg-gradient-from) 0%, var(--panel-bg-gradient-to) 100%);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.3);
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
  background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
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

.optimized-title {
  color: #8b5cf6;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-body {
  flex: 1;
  min-height: 0;
}

.panel-body :deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
