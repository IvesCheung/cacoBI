<template>
  <div class="short-chain-flow-container">
    <div class="short-chain-flow">
      <div
        v-for="step in steps"
        :key="step.id"
        class="flow-column"
      >
        <ChainNode
          :node="mapStepToNode(step)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ChainNode from './ChainNode.vue'

defineProps({
  steps: { type: Array, required: true }
})

const mapStepToNode = (step) => {
  const duration = step.duration ? parseFloat(step.duration) : 0

  return {
    id: step.id,
    title: step.title,
    status: step.active ? 'running' :
            step.completed ? 'completed' :
            step.skipped ? 'skipped' : 'pending',
    isLLM: step.type === 'llm',
    time: duration,
    tokens: step.tokens || 0,
    error: step.error || null,
    details: step.details || []
  }
}
</script>

<style scoped>
.short-chain-flow-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}
.short-chain-flow {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  padding: 4px 0;
}
.flow-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
}
.flow-column:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -9px;
  transform: translateY(-50%);
  width: 18px;
  height: 2px;
  background: linear-gradient(90deg, rgba(16,185,129,.2) 0%, rgba(16,185,129,.7) 100%);
  box-shadow: 0 0 6px rgba(16,185,129,.4);
}
</style>
