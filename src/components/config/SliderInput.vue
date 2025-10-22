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
  margin-bottom: 20px;
}

.config-label {
  display: block;
  font-size: 14px;
  color: #BABABA;
  margin-bottom: 12px;
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
</style>
