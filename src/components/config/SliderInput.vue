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
        size="small"
        class="value-input"
        @change="handleChange"
      />
    </div>
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

const value = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  value.value = newVal
})

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<style scoped>
.slider-input {
  margin-bottom: 12px;
}

.config-label {
  display: block;
  font-size: 13px;
  color: #BABABA;
  margin-bottom: 8px;
  font-weight: 400;
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
  width: 80px;
}

:deep(.el-slider__runway) {
  background: rgba(15, 27, 46, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

:deep(.el-slider__bar) {
  background: #2563EB;
}

:deep(.el-slider__button) {
  border-color: #2563EB;
  background: #fff;
}

:deep(.el-slider__button:hover) {
  transform: scale(1.2);
}

:deep(.el-input-number) {
  background: rgba(15, 27, 46, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: transparent;
  border-left: 1px solid rgba(59, 130, 246, 0.3);
  color: #BABABA;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: #2563EB;
}

:deep(.el-input__inner) {
  background: transparent;
  border: none;
  color: #fff;
  text-align: center;
}
</style>
