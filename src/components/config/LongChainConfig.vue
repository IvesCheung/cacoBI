<template>
  <div class="long-chain-config">
    <div class="config-header">
      <h3>长链路配置项</h3>
    </div>

    <div class="config-content">
      <ModelSelector
        v-model="config.questionDecomposeModel"
        label="问题拆解模型"
        :models="llmModels"
      />

      <ModelSelector
        v-model="config.tableRerankModel"
        label="表重排模型"
        :models="llmModels"
      />

      <ModelSelector
        v-model="config.metricConfigModel"
        label="指标配置模型"
        :models="llmModels"
      />

      <ModelSelector
        v-model="config.dimensionConfigModel"
        label="维度配置模型"
        :models="llmModels"
      />

      <ModelSelector
        v-model="config.filterConfigModel"
        label="筛选条件配置模型"
        :models="llmModels"
      />

      <StepperInput
        v-model="config.tableRecallTopK"
        label="表召回Top-k"
        :min="1"
        :max="100"
        :step="1"
      />

      <StepperInput
        v-model="config.columnRecallTopK"
        label="列召回Top-k"
        :min="1"
        :max="100"
        :step="1"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ModelSelector from './ModelSelector.vue'
import StepperInput from './StepperInput.vue'
import { LLM_MODELS } from '@/constants/config'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const llmModels = LLM_MODELS

const config = reactive({
  questionDecomposeModel: props.modelValue.questionDecomposeModel || '',
  tableRerankModel: props.modelValue.tableRerankModel || '',
  metricConfigModel: props.modelValue.metricConfigModel || '',
  dimensionConfigModel: props.modelValue.dimensionConfigModel || '',
  filterConfigModel: props.modelValue.filterConfigModel || '',
  tableRecallTopK: props.modelValue.tableRecallTopK || 30,
  columnRecallTopK: props.modelValue.columnRecallTopK || 100
})

watch(config, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

watch(() => props.modelValue, (newVal) => {
  Object.assign(config, newVal)
}, { deep: true })
</script>

<style scoped>
.long-chain-config {
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.config-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.config-header h3 {
  font-size: 20px;
  font-weight: 500;
  color: #2563EB;
  margin: 0;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>