<template>
  <div class="chain-flow-horizontal">
    <div class="chain-row">
      <div class="chain-label short">
        <el-icon class="status-icon success"><SuccessFilled /></el-icon>
        <span>优化链路（短链路）</span>
        <el-tag size="small" class="time-tag">链路耗时: {{ optimizedTime }} 秒</el-tag>
      </div>
      <el-steps :active="shortActiveIndex" finish-status="success" align-center>
        <el-step
          v-for="(step, idx) in store.state.shortSteps"
          :key="step.id"
          :title="step.name"
          :icon="stepIcon(step)"
          :status="stepStatus(step, idx, 'short')"
          @click="onShortStepClick(step)"
        >
          <template #description>
            <div class="step-log" v-if="step.log">{{ step.log }}</div>
            <div class="step-time" v-if="step.time">{{ step.time }}</div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div class="chain-row">
      <div class="chain-label long">
        <el-icon class="status-icon warning"><WarningFilled /></el-icon>
        <span>传统链路（长链路）</span>
        <el-tag size="small" class="time-tag">链路耗时: {{ traditionalTime }} 秒</el-tag>
      </div>
      <el-steps :active="longActiveIndex" finish-status="success" align-center>
        <el-step
          v-for="(step, idx) in store.state.longSteps"
          :key="step.id"
          :title="step.name"
          :icon="stepIcon(step)"
          :status="stepStatus(step, idx, 'long')"
          @click="onLongStepClick(step)"
        >
          <template #description>
            <div class="step-log" v-if="step.log">{{ step.log }}</div>
            <div class="step-time" v-if="step.time">{{ step.time }}</div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SuccessFilled, WarningFilled, CircleCheck, Loading, CircleClose } from '@element-plus/icons-vue'
import { useChainStore } from '@/composables/useChainStore'

const props = defineProps({
  optimizedTime: { type: Number, default: 0 },
  traditionalTime: { type: Number, default: 0 }
})
const emit = defineEmits(['step-click'])
const store = useChainStore()

const optimizedTime = computed(() => props.optimizedTime ?? store.state.optimizedTime)
const traditionalTime = computed(() => props.traditionalTime ?? store.state.traditionalTime)

const shortActiveIndex = computed(() => {
  const idx = store.state.shortSteps.findIndex(s => s.active)
  return idx === -1 ? 0 : idx
})
const longActiveIndex = computed(() => {
  const idx = store.state.longSteps.findIndex(s => s.active)
  return idx === -1 ? 0 : idx
})

function stepStatus(step, idx, type) {
  if (step.active) return 'process'
  // 可扩展失败态
  if (step.done) return 'success'
  return idx < (type === 'short' ? shortActiveIndex.value : longActiveIndex.value) ? 'success' : 'wait'
}
function stepIcon(step) {
  if (step.active) return Loading
  if (step.done) return CircleCheck
  if (step.failed) return CircleClose
  return ''
}
function onShortStepClick(step) {
  store.activateShortStep(step.id)
  emit('step-click', { chain: 'short', step })
}
function onLongStepClick(step) {
  store.activateLongStep(step.id)
  emit('step-click', { chain: 'long', step })
}
</script>

/* 横向链路样式见上 */
<style scoped>
.chain-flow-horizontal {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.chain-row {
  background: rgba(30, 58, 95, 0.3);
  border-radius: 12px;
  padding: 18px 24px 24px 24px;
  margin-bottom: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.chain-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 500;
}
.chain-label.short .status-icon {
  color: #52c41a;
}
.chain-label.long .status-icon {
  color: #faad14;
}
.time-tag {
  margin-left: auto;
  background: rgba(37, 99, 235, 0.2);
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #8a9db5;
  font-size: 12px;
}
.el-steps {
  background: transparent;
  padding: 0 8px;
}
.el-step__title {
  color: #fff;
  font-size: 15px;
}
.el-step__description {
  color: #b0b8c9;
  font-size: 13px;
  margin-top: 4px;
}
.step-log {
  color: #8ad1ff;
  font-size: 12px;
  margin-bottom: 2px;
}
.step-time {
  color: #b0b8c9;
  font-size: 11px;
}
</style>
