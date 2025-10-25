<template>
  <div class="slider-input">
    <label class="config-label">{{ label }}</label>
    <div class="slider-container">
      <el-slider
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        @change="handleChange"
      />
      <el-input-number
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        :precision="precision"
        size="default"
        class="value-input"
        @change="handleChange"
        :controls-position="'right'"
      />
    </div>
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
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  precision: {
    type: Number,
    default: 0
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
.slider-input {
  margin-bottom: 0;
}

.config-label {
  display: block;
  font-size: 13px;
  color: var(--app-text-secondary);
  margin-bottom: 8px;
  font-weight: 400;
  transition: color 0.3s ease;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.el-slider {
  flex: 1;
}

.value-input {
  width: 100px;
  flex-shrink: 0;
}

:deep(.el-slider__runway) {
  background: var(--progress-bg);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

:deep(.el-slider__bar) {
  background: #2563EB;
}

:deep(.el-slider__button) {
  border-color: #2563EB;
  background: var(--app-bg-secondary);
  transition: all 0.3s ease;
}

:deep(.el-slider__button:hover) {
  transform: scale(1.2);
}

:deep(.el-input-number) {
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px var(--app-shadow);
}

:deep(.el-input-number:hover) {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 4px 8px var(--app-shadow);
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease),
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  background: rgba(37, 99, 235, 0.15);
  border-left: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--app-text-secondary);
  transition: all 0.2s ease;
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease:hover),
:deep(.el-input-number.is-controls-right .el-input-number__increase:hover) {
  color: #3b82f6;
  background: rgba(37, 99, 235, 0.25);
}

:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  justify-content: center;
}

:deep(.el-input__inner) {
  background: transparent !important;
  border: none !important;
  color: #ffffff !important;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  padding-left: 0 !important;
  padding-right: 32px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
