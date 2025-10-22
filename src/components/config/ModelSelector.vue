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
  margin-bottom: 20px;
}

.config-label {
  display: block;
  font-size: 14px;
  color: #BABABA;
  margin-bottom: 8px;
}

.el-select {
  width: 100%;
}
</style>
