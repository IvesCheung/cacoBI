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
      <ChainStep
        v-for="step in steps"
        :key="step.id"
        :title="step.title"
        :time="step.time"
        :active="step.active"
        :completed="step.completed"
        :details="step.details"
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
  border-radius: 12px;
  padding: 16px;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.short-title {
  color: #10b981;
}

.panel-body {
  display: flex;
  flex-direction: column;
}
</style>

