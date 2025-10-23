<template>
  <div class="short-chain-config">
    <div class="config-header">
      <h3>短链路配置项</h3>
    </div>

    <div class="config-content">
      <!-- DSL改写模型 -->
      <ModelSelector
        v-model="config.dslModel"
        label="DSL改写模型"
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
        label="模板召回Top-k"
        :min="1"
        :max="100"
        :step="1"
      />

      <!-- 模板相似度阈值 -->
      <SliderInput
        v-model="config.templateSimilarityThreshold"
        label="模板相似度阈值"
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
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.config-header {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.config-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #2563EB;
  margin: 0;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
