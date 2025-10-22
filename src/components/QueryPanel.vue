<template>
  <div class="query-panel">
    <h2 class="panel-title">BI取数</h2>

    <!-- 查询输入 -->
    <div class="query-input-section">
      <label class="input-label">数据查询</label>
      <el-input
        v-model="queryText"
        type="textarea"
        :rows="4"
        placeholder="请输入查询内容..."
        class="query-textarea"
        :autosize="{ minRows: 4, maxRows: 8 }"
      />
    </div>

    <!-- 执行按钮和开关 -->
    <div class="query-actions">
      <el-button
        type="primary"
        :loading="isExecuting"
        :disabled="isExecuting"
        @click="handleExecute"
        size="large"
        class="execute-btn"
      >
        <el-icon v-if="!isExecuting"><VideoPlay /></el-icon>
        {{ isExecuting ? '执行中...' : '执行查询' }}
      </el-button>

      <el-button
        :type="costAgentEnabled ? 'success' : 'info'"
        :disabled="isExecuting"
        @click="toggleCostAgent"
        size="large"
        class="cost-agent-btn"
      >
        Cost Agent
      </el-button>
    </div>

    <!-- 执行日志 -->
    <div v-if="isExecuting || shortCompleted || longCompleted" class="execution-logs">
      <div class="log-item">
        <span class="log-time">{{ currentTime }}</span>
        <span class="log-text">正在检索相关数据...</span>
      </div>
      <div class="log-item">
        <span class="log-time">{{ currentTime }}</span>
        <span class="log-text">正在分析数据并生成报表...</span>
      </div>
    </div>

    <!-- 短链路结果 -->
    <div v-if="shortCompleted" class="result-container short-result">
      <h3 class="result-title short-title">✅ 优化链路结果</h3>
      <ResultChart key="short-chart" />
    </div>

    <!-- 长链路结果 -->
    <div v-if="longCompleted" class="result-container long-result">
      <h3 class="result-title long-title">🟠 传统链路结果</h3>
      <ResultChart key="long-chart" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import ResultChart from './ResultChart.vue'

const props = defineProps({
  queryText: {
    type: String,
    required: true
  },
  isExecuting: {
    type: Boolean,
    default: false
  },
  costAgentEnabled: {
    type: Boolean,
    default: false
  },
  shortCompleted: {
    type: Boolean,
    default: false
  },
  longCompleted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:queryText', 'update:costAgentEnabled', 'execute'])

const queryText = computed({
  get: () => props.queryText,
  set: (val) => emit('update:queryText', val)
})

const costAgentEnabled = computed({
  get: () => props.costAgentEnabled,
  set: (val) => emit('update:costAgentEnabled', val)
})

const currentTime = computed(() => {
  return new Date().toLocaleTimeString()
})

const handleExecute = () => {
  emit('execute')
}

const toggleCostAgent = () => {
  costAgentEnabled.value = !costAgentEnabled.value
}
</script>

<style scoped>
.query-panel {
  background: #1e293b;
  border-radius: 8px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.query-panel > * {
  flex-shrink: 0;
}

.query-panel > .execution-logs,
.query-panel > .result-container {
  overflow-y: auto;
}

.panel-title {
  color: #3b82f6;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.query-input-section {
  margin-bottom: 12px;
}

.input-label {
  display: block;
  color: #e2e8f0;
  font-size: 13px;
  margin-bottom: 8px;
}

.query-textarea {
  width: 100%;
}

.query-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.execute-btn {
  flex-shrink: 0;
}

.cost-agent-btn {
  flex-shrink: 0;
}

.execution-logs {
  background: #334155;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
}

.log-item {
  display: flex;
  gap: 8px;
  color: #cbd5e1;
  font-size: 13px;
  margin-bottom: 4px;
}

.log-item:last-child {
  margin-bottom: 0;
}

.log-time {
  color: #64748b;
  font-size: 11px;
  flex-shrink: 0;
}

.log-text {
  color: #cbd5e1;
}

.result-container {
  background: #334155;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
}

.result-container:last-child {
  margin-bottom: 0;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.short-title {
  color: #10b981;
}

.long-title {
  color: #f59e0b;
}

:deep(.el-textarea__inner) {
  background: #334155;
  border: 2px solid #475569;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-textarea__inner::placeholder) {
  color: #64748b;
}

:deep(.el-textarea__inner:hover) {
  border-color: #64748b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #3a4556;
}

:deep(.el-button--primary) {
  background: #2563eb;
  border-color: #2563eb;
}

:deep(.el-button--primary:hover) {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

:deep(.el-button--primary.is-disabled) {
  background: #60a5fa;
  border-color: #60a5fa;
}

:deep(.el-button--success) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.el-button--success:hover) {
  background: #059669;
  border-color: #059669;
}

:deep(.el-button--success.is-disabled) {
  background: #6ee7b7;
  border-color: #6ee7b7;
}

:deep(.el-button--info) {
  background: #64748b;
  border-color: #64748b;
}

:deep(.el-button--info:hover) {
  background: #475569;
  border-color: #475569;
}

:deep(.el-button--info.is-disabled) {
  background: #94a3b8;
  border-color: #94a3b8;
}
</style>

