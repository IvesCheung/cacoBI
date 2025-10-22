<template>
  <div class="stepper-input">
    <label class="config-label">{{ label }}</label>
    <el-input-number
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      size="large"
      controls-position="right"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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

const value = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  value.value = newVal
})

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<style scoped>
.stepper-input {
  margin-bottom: 12px;
}

.config-label {
  display: block;
  font-size: 13px;
  color: #BABABA;
  margin-bottom: 6px;
  font-weight: 400;
}

.el-input-number {
  width: 100%;
}

:deep(.el-input-number) {
  background: rgba(15, 27, 46, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
}

:deep(.el-input-number:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease),
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  background: transparent;
  border-left: 1px solid rgba(59, 130, 246, 0.3);
  color: #BABABA;
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease:hover),
:deep(.el-input-number.is-controls-right .el-input-number__increase:hover) {
  color: #2563EB;
  background: rgba(37, 99, 235, 0.1);
}

:deep(.el-input__inner) {
  background: transparent;
  border: none;
  color: #fff;
  text-align: left;
  padding-left: 15px;
}
</style>
