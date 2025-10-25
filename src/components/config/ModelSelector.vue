<template>
  <div class="model-selector">
    <label class="config-label">{{ label }}</label>
    <el-select
      v-model="selectedModel"
      :placeholder="`请选择${label}`"
      size="large"
      @change="handleChange"
    >
      <el-option
        v-for="model in models"
        :key="model"
        :label="model"
        :value="model"
      />
    </el-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  models: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.model-selector {
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

.el-select {
  width: 100%;
}

:deep(.el-select__wrapper) {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--app-text-primary);
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-select__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-select__wrapper.is-focused) {
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

:deep(.el-select__placeholder) {
  color: var(--input-placeholder);
}

:deep(.el-select__selection) {
  color: var(--app-text-primary);
  transition: color 0.3s ease;
}
</style>
