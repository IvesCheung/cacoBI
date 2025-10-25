<template>
  <div class="stepper-input">
    <label class="config-label">{{ label }}</label>
    <el-input-number
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      size="large"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<style scoped>
.stepper-input {
  margin-bottom: 0;
}

.config-label {
  display: block;
  font-size: 13px;
  color: var(--app-text-secondary);
  margin-bottom: 6px;
  font-weight: 400;
  transition: color 0.3s ease;
}

.el-input-number {
  width: 100%;
}

/* 主容器样式 */
:deep(.el-input-number) {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.el-input-number:hover) {
  border-color: var(--input-border-hover);
}

:deep(.el-input-number:focus-within) {
  border-color: rgba(59, 130, 246, 0.6);
}

/* 按钮通用样式 */
:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: var(--app-bg-tertiary);
  border: none;
  color: var(--app-text-secondary);
  width: 40px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background: var(--input-border-hover);
  color: var(--app-text-primary);
}

:deep(.el-input-number__decrease:active),
:deep(.el-input-number__increase:active) {
  background: var(--app-bg-tertiary);
}

/* 输入框样式 */
:deep(.el-input__wrapper) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

:deep(.el-input__inner) {
  background: transparent;
  border: none;
  color: var(--app-text-primary);
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  transition: color 0.3s ease;
}
</style>
