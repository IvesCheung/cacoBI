<template>
  <div class="long-chain-config">
    <div class="config-header">
      <h3>长链路配置项</h3>
    </div>

    <div class="config-content">
      <!-- 配置解析阶段 -->
      <div class="config-section">
        <div class="section-title">配置解析</div>
        <ModelSelector
          v-model="config.entityRecognitionModel"
          label="实体识别模型"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.questionRewriteModel"
          label="问题改写模型"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.questionClarifyModel"
          label="问题澄清模型"
          :models="llmModels"
        />
      </div>

      <!-- 表召回和选择 -->
      <div class="config-section">
        <div class="section-title">表召回与选择</div>
        <StepperInput
          v-model="config.tableRecallTopK"
          label="表召回Top-k"
          :min="1"
          :max="200"
          :step="5"
        />
        <ModelSelector
          v-model="config.tableSelectionModel"
          label="选表模型"
          :models="llmModels"
        />
      </div>

      <!-- Rerank -->
      <div class="config-section">
        <div class="section-title">召回Rerank</div>
        <ModelSelector
          v-model="config.segmentRerankModel"
          label="学段Rerank模型"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.dimensionRerankModel"
          label="维值Rerank模型"
          :models="llmModels"
        />
      </div>

      <!-- DSL配置 -->
      <div class="config-section">
        <div class="section-title">DSL配置</div>
        <ModelSelector
          v-model="config.metricParseModel"
          label="指标解析模型"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.dimensionParseModel"
          label="维度解析模型"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.filterParseModel"
          label="筛选解析模型"
          :models="llmModels"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ModelSelector from './ModelSelector.vue'
import StepperInput from './StepperInput.vue'
import { LLM_MODELS, DEFAULT_LONG_CHAIN_CONFIG } from '@/constants/config'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const llmModels = LLM_MODELS

const config = reactive({
  // 配置解析阶段
  entityRecognitionModel: props.modelValue.entityRecognitionModel || DEFAULT_LONG_CHAIN_CONFIG.entityRecognitionModel || 'Qwen2.5-instruct-72B',
  questionRewriteModel: props.modelValue.questionRewriteModel || DEFAULT_LONG_CHAIN_CONFIG.questionRewriteModel || 'Qwen2.5-instruct-72B',
  questionClarifyModel: props.modelValue.questionClarifyModel || DEFAULT_LONG_CHAIN_CONFIG.questionClarifyModel || 'Qwen2.5-instruct-72B',

  // 表召回与选择
  tableRecallTopK: props.modelValue.tableRecallTopK || DEFAULT_LONG_CHAIN_CONFIG.tableRecallTopK || 50,
  tableSelectionModel: props.modelValue.tableSelectionModel || DEFAULT_LONG_CHAIN_CONFIG.tableSelectionModel || 'Deepseek-v3',

  // Rerank
  segmentRerankModel: props.modelValue.segmentRerankModel || DEFAULT_LONG_CHAIN_CONFIG.segmentRerankModel || 'Deepseek-v3',
  dimensionRerankModel: props.modelValue.dimensionRerankModel || DEFAULT_LONG_CHAIN_CONFIG.dimensionRerankModel || 'Deepseek-v3',

  // DSL配置
  metricParseModel: props.modelValue.metricParseModel || DEFAULT_LONG_CHAIN_CONFIG.metricParseModel || 'Deepseek-v3',
  dimensionParseModel: props.modelValue.dimensionParseModel || DEFAULT_LONG_CHAIN_CONFIG.dimensionParseModel || 'Deepseek-v3',
  filterParseModel: props.modelValue.filterParseModel || DEFAULT_LONG_CHAIN_CONFIG.filterParseModel || 'Deepseek-v3'
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
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  gap: 12px;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 4px;
}

.config-section {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(30, 41, 59, 0.15) 100%);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.config-content::-webkit-scrollbar {
  width: 6px;
}

.config-content::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.config-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
}

.config-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
}
</style>
