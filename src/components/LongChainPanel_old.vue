<template>
  <div class="chain-panel">
    <div class="panel-header">
      <h2 class="panel-title long-title">🟠 传统链路（长链路）</h2>
      <ProgressBar
        :progress-array="progress"
        :time="time"
        start-color="#f59e0b"
      />
    </div>

    <div class="panel-body">
      <ChainStep
        v-for="step in steps"
        :key="step.id"
        :title="step.title"
        :time="step.time"
        :active="step.active"
        :completed="step.completed"
        :details="step.details"
        :sub-steps="step.subSteps"
      />
    </div>
  </div>
</template>

<script setup>
import ChainStep from './ChainStep.vue'
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
</script>

<style scoped>
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

.long-title {
  color: #f59e0b;
}

.panel-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
</style>

