<template>
  <div class="short-chain-config">
    <div class="config-header">
      <h3>Shortcut Configuration</h3>
    </div>

    <div class="config-content">
      <!-- DSL改写模型 -->
      <ModelSelector
        v-model="config.dslModel"
        label="DSL Rewriting Model"
        :models="dslModels"
      />

      <!-- Encoder -->
      <ModelSelector
        v-model="config.encoder"
        label="Encoder"
        :models="encoderModels"
      />

      <!-- 模板召回Top-k -->
      <StepperInput
        v-model="config.templateRecallTopK"
        label="Cache Top-k"
        :min="1"
        :max="100"
        :step="1"
      />

      <!-- 模板相似度阈值 -->
      <SliderInput
        v-model="config.templateSimilarityThreshold"
        label="Cache Similarity Threshold"
        :min="0"
        :max="1"
        :step="0.01"
        :precision="2"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ModelSelector from './ModelSelector.vue'
import SliderInput from './SliderInput.vue'
import StepperInput from './StepperInput.vue'
import { DSL_MODELS, LLM_MODELS, DEFAULT_SHORT_CHAIN_CONFIG } from '@/constants/config'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const dslModels = DSL_MODELS
const encoderModels = LLM_MODELS

const config = reactive({
  dslModel: props.modelValue.dslModel || DEFAULT_SHORT_CHAIN_CONFIG.dslModel,
  encoder: props.modelValue.encoder || DEFAULT_SHORT_CHAIN_CONFIG.encoder,
  templateRecallTopK: props.modelValue.templateRecallTopK || DEFAULT_SHORT_CHAIN_CONFIG.templateRecallTopK,
  templateSimilarityThreshold: props.modelValue.templateSimilarityThreshold || DEFAULT_SHORT_CHAIN_CONFIG.templateSimilarityThreshold
})

watch(config, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

watch(() => props.modelValue, (newVal) => {
  Object.assign(config, newVal)
}, { deep: true })
</script>

<style scoped>
.short-chain-config {
  background: var(--config-panel-bg);
  border-radius: 8px;
  border: 1px solid var(--config-panel-border);
  padding: 16px;
  box-shadow: 0 4px 12px var(--app-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.config-header {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--config-panel-border);
}

.config-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--config-title-color);
  margin: 0;
  transition: color 0.3s ease;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
