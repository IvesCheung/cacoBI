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
import { ref, watch } from 'vue'

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

const selectedModel = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selectedModel.value = newVal
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
  color: #BABABA;
  margin-bottom: 6px;
  font-weight: 400;
}

.el-select {
  width: 100%;
}

:deep(.el-select__wrapper) {
  background: rgba(15, 27, 46, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: #fff;
  box-shadow: none;
}

:deep(.el-select__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-select__wrapper.is-focused) {
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

:deep(.el-select__placeholder) {
  color: rgba(192, 192, 192, 0.5);
}

:deep(.el-select__selection) {
  color: #fff;
}
</style>
