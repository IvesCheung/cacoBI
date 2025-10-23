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
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  height: 100%;
}

.chain-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
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

.short-title {
  color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-body {
  display: flex;
  flex-direction: column;
  overflow: visible;
  flex: 1;
  min-height: 220px;
}

/* 美化滚动条 */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
}
</style>

