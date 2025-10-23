<template>
  <div class="chain-panel">
    <div class="panel-header">
      <h2 class="panel-title short-title">✅ 优化链路（短链路）</h2>
      <ProgressBar
        :progress-array="progress"
        :time="time"
        start-color="#10b981"
      />
    </div>

    <div class="panel-body">
      <ChainFlowChart
        :steps="steps"
        color="#10b981"
      />
    </div>
  </div>
</template>

<script setup>
import ChainFlowChart from './ChainFlowChart.vue'
import ProgressBar from './ProgressBar.vue'

defineProps({
  steps: {
    type: Array,
    required: true
  },
  progress: {
    type: Array,
    required: true
  },
  time: {
    type: Number,
    default: 0
  }
})
</script><style scoped>
.chain-panel {
  background: #1e293b;
  border-radius: 8px;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.short-title {
  color: #10b981;
}

.panel-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
</style>

