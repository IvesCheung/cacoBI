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
  margin-bottom: 20px;
}

.config-label {
  display: block;
  font-size: 14px;
  color: #BABABA;
  margin-bottom: 8px;
}

.el-input-number {
  width: 100%;
}
</style>
