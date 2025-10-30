<template>
  <div class="long-chain-config">
    <div class="config-header">
      <h3>Long-chain Configuration</h3>
    </div>

    <el-scrollbar class="config-content">
      <!-- Query Parsing Stage -->
      <div class="config-section">
        <div class="section-title">Query Parsing</div>
        <ModelSelector
          v-model="config.entityRecognitionModel"
          label="Entity Recognition, Question Rewrite and Clarification"
          :models="llmModels"
        />
        <!-- <ModelSelector
          v-model="config.questionRewriteModel"
          label="Question Rewrite Model"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.questionClarifyModel"
          label="Question Clarification Model"
          :models="llmModels"
        /> -->
      </div>

      <!-- Query Recall and Selection -->
      <div class="config-section">
        <div class="section-title">Table Retrieval and Selection</div>
        <StepperInput
          v-model="config.tableRecallTopK"
          label="Table Top-k"
          :min="1"
          :max="100"
          :step="1"
        />
        <ModelSelector
          v-model="config.tableSelectionModel"
          label="Table Selection Model"
          :models="llmModels"
        />
      </div>

      <!-- Rerank -->
      <div class="config-section">
        <div class="section-title">Rerank</div>
        <ModelSelector
          v-model="config.fieldRerankModel"
          label="Field and Dimension Rerank Model"
          :models="RERANK_MODELS"
        />
      </div>

      <!-- DSL配置 -->
      <div class="config-section">
        <div class="section-title">DSL Configuring</div>
        <ModelSelector
          v-model="config.measureParseModel"
          label="Measure,Dimension,Filter Parse Model"
          :models="llmModels"
        />
        <!-- <ModelSelector
          v-model="config.dimensionParseModel"
          label="Dimension Parse Model"
          :models="llmModels"
        />
        <ModelSelector
          v-model="config.filterParseModel"
          label="Filter Parse Model"
          :models="llmModels"
        /> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ModelSelector from './ModelSelector.vue'
import StepperInput from './StepperInput.vue'
import { LLM_MODELS, DEFAULT_LONG_CHAIN_CONFIG, RERANK_MODELS } from '@/constants/config'

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
  fieldRerankModel: props.modelValue.fieldRerankModel || DEFAULT_LONG_CHAIN_CONFIG.fieldRerankModel || 'Deepseek-v3',
  dimensionRerankModel: props.modelValue.dimensionRerankModel || DEFAULT_LONG_CHAIN_CONFIG.dimensionRerankModel || 'Deepseek-v3',

  // DSL配置
  measureParseModel: props.modelValue.measureParseModel || DEFAULT_LONG_CHAIN_CONFIG.measureParseModel || 'Deepseek-v3',
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
  background: var(--config-panel-bg);
  border-radius: 8px;
  border: 1px solid var(--config-panel-border);
  padding: 16px;
  box-shadow: 0 4px 12px var(--app-shadow);
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
  max-height: calc(100vh - 300px);
}

.config-content :deep(.el-scrollbar__view) {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.config-section {
  background: var(--config-section-bg);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid var(--config-section-border);
  transition: all 0.3s ease;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--config-section-title);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--config-section-border);
  transition: color 0.3s ease;
}
</style>
