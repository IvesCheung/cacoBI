<template>
  <div class="query-panel">
    <div class="panel-header">
      <h2 class="panel-title">ChronosBI</h2>
      <el-button
        type="default"
        :icon="Setting"
        circle
        @click="drawerVisible = true"
        class="settings-btn"
        title="Settings"
      />
    </div>

    <!-- 查询示例选择器 -->
    <div class="example-selector-section">
      <QueryExampleSelector
        :current-example-id="currentExampleId"
        :is-executing="isExecuting"
        @change="handleExampleChange"
      />
    </div>

    <!-- 查询输入 -->
    <div class="query-input-section">
      <el-input
        v-model="queryText"
        type="textarea"
        :rows="2"
        placeholder="Please enter your query..."
        class="query-textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
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
        {{ isExecuting ? 'Executing...' : 'Execute' }}
      </el-button>

      <el-button
        :type="costAgentEnabled ? 'success' : 'info'"
        :disabled="isExecuting"
        @click="toggleCostAgent"
        size="large"
        class="cost-agent-btn"
      >
        <el-icon v-if="costAgentEnabled"><CircleCheck /></el-icon>
        {{ costAgentEnabled ? 'Cost Planer (Enabled)' : 'Cost Planer' }}
      </el-button>
    </div>

    <!-- 日志面板 -->
    <div class="log-section">
      <LogPanel />
    </div>

    <!-- 双路径进度条 -->
    <DualPathProgress
      v-if="isExecuting || optimizedCompleted || longCompleted"
      :short-progress="optimizedProgress"
      :long-progress="longProgress"
      :short-completed="optimizedCompleted"
      :long-completed="longCompleted"
      :is-executing="isExecuting"
    />

    <!-- 链路结果 -->
    <div v-if="optimizedCompleted || longCompleted" class="results-section">
      <el-collapse
        v-model="activeResults"
        class="results-collapse"
        @change="handleCollapseChange"
      >
        <!-- 优化链路结果 -->
        <el-collapse-item
          v-if="optimizedCompleted"
          name="optimized"
          class="result-collapse-item short-result"
        >
          <template #title>
            <div class="collapse-title">
              <span class="result-title short-title">🔀 Optimized Chain Result</span>
            </div>
          </template>
          <div class="result-content">
            <ResultChart key="optimized-chart" :data="queryResult" />
          </div>
        </el-collapse-item>

        <!-- 原始长链路结果 -->
        <el-collapse-item
          v-if="longCompleted"
          name="long"
          class="result-collapse-item long-result"
        >
          <template #title>
            <div class="collapse-title">
              <span class="result-title long-title">🟠 Long-chain Result</span>
            </div>
          </template>
          <div class="result-content">
            <ResultChart key="long-chart" :data="queryResult" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 配置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="Configuration Settings"
      direction="rtl"
      size="450px"
      :before-close="handleDrawerClose"
    >
      <el-scrollbar class="drawer-content">
        <div class="config-section">
          <h3 class="config-section-title">Short Chain Configuration</h3>
          <ShortChainConfig v-model="shortChainConfigLocal" />
        </div>

        <div class="config-section">
          <h3 class="config-section-title">Long Chain Configuration</h3>
          <LongChainConfig v-model="longChainConfigLocal" />
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VideoPlay, CircleCheck, Setting } from '@element-plus/icons-vue'
import ResultChart from './ResultChart.vue'
import DualPathProgress from './DualPathProgress.vue'
import QueryExampleSelector from './QueryExampleSelector.vue'
import ShortChainConfig from './config/ShortChainConfig.vue'
import LongChainConfig from './config/LongChainConfig.vue'
import LogPanel from './LogPanel.vue'

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
  optimizedCompleted: {
    type: Boolean,
    default: false
  },
  longCompleted: {
    type: Boolean,
    default: false
  },
  optimizedProgress: {
    type: Array,
    default: () => [0, 0, 0]
  },
  longProgress: {
    type: Array,
    default: () => [0, 0, 0, 0, 0, 0, 0]
  },
  queryResult: {
    type: Array,
    default: () => []
  },
  currentExampleId: {
    type: String,
    required: true
  },
  shortChainConfig: {
    type: Object,
    required: true
  },
  longChainConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:queryText', 'update:costAgentEnabled', 'update:shortChainConfig', 'update:longChainConfig', 'execute', 'clearLogs', 'exampleChange'])

// Drawer visibility
const drawerVisible = ref(false)

// Collapse control - 优化链路默认展开，长链路默认折叠
const activeResults = ref(['optimized'])

// 监听折叠状态变化，触发图表重新渲染
const handleCollapseChange = () => {
  // 延迟触发resize，确保DOM已经完成动画
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 350) // Element Plus 的折叠动画时长是 300ms
}

const queryText = computed({
  get: () => props.queryText,
  set: (val) => emit('update:queryText', val)
})

const costAgentEnabled = computed({
  get: () => props.costAgentEnabled,
  set: (val) => emit('update:costAgentEnabled', val)
})

const shortChainConfigLocal = computed({
  get: () => props.shortChainConfig,
  set: (val) => emit('update:shortChainConfig', val)
})

const longChainConfigLocal = computed({
  get: () => props.longChainConfig,
  set: (val) => emit('update:longChainConfig', val)
})

const handleExecute = () => {
  emit('execute')
}

const toggleCostAgent = () => {
  // 如果不在执行中，切换前先清除日志
  if (!props.isExecuting) {
    emit('clearLogs')
  }
  costAgentEnabled.value = !costAgentEnabled.value
}

const handleExampleChange = (exampleId) => {
  emit('exampleChange', exampleId)
}

const handleDrawerClose = (done) => {
  done()
}
</script>

<style scoped>
.query-panel {
  background: var(--query-panel-bg);
  border-radius: 8px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.query-panel > * {
  flex-shrink: 0;
}

.query-panel > .results-section {
  flex-shrink: 1;
  min-height: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-title {
  color: var(--query-panel-title);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  transition: color 0.3s ease;
}

.settings-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--input-bg);
  border-color: var(--input-border);
  color: var(--app-text-primary);
  transition: all 0.3s ease;
}

.settings-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: rotate(90deg);
}

.example-selector-section {
  margin-bottom: 12px;
}

.query-input-section {
  margin-bottom: 12px;
}

.input-label {
  display: block;
  color: var(--app-text-primary);
  font-size: 13px;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.query-textarea {
  width: 100%;
  height: fit-content;
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

.log-section {
  margin-bottom: 12px;
}

.results-section {
  margin-bottom: 12px;
  flex-shrink: 1;
  min-height: 0;
}

.results-collapse {
  border: none;
  background: transparent;
}

.results-collapse :deep(.el-collapse-item) {
  border-bottom: none;
}

.result-collapse-item {
  background: var(--result-bg);
  border-radius: 6px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--input-border);
}

.result-collapse-item:last-child {
  margin-bottom: 0;
}

.collapse-title {
  width: 100%;
  display: flex;
  align-items: center;
}

.result-content {
  padding: 0 10px 10px 10px;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.short-title {
  color: #10b981;
}

.long-title {
  color: #f59e0b;
}

:deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-weight: 600;
  color: var(--app-text-primary);
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.el-collapse-item__header:hover) {
  background: var(--input-bg);
}

:deep(.el-collapse-item__wrap) {
  background: transparent;
  border: none;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

:deep(.el-collapse-item__arrow) {
  margin-right: 8px;
  color: var(--app-text-primary);
  transition: transform 0.3s ease;
}

:deep(.el-collapse-item__arrow.is-active) {
  transform: rotate(90deg);
}

:deep(.el-textarea__inner) {
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  border-radius: 8px;
  color: var(--app-text-primary);
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px var(--app-shadow);
}

:deep(.el-textarea__inner::placeholder) {
  color: var(--input-placeholder);
}

:deep(.el-textarea__inner:hover) {
  border-color: var(--input-border-hover);
  box-shadow: 0 4px 8px var(--app-shadow);
}

:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: var(--input-bg-focus);
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

.drawer-content {
  height: 100%;
}

.drawer-content :deep(.el-scrollbar__view) {
  padding: 0 20px;
}

.config-section {
  margin-bottom: 24px;
}

.config-section:last-child {
  margin-bottom: 0;
}

.config-section-title {
  color: var(--app-text-primary);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--input-border);
}

:deep(.el-drawer__header) {
  margin-bottom: 20px;
  padding: 20px;
  border-bottom: 1px solid var(--input-border);
  color: var(--app-text-primary);
  font-weight: 600;
}

:deep(.el-drawer__body) {
  padding: 20px;
  background: var(--app-bg-color);
}

:deep(.el-drawer__title) {
  color: var(--app-text-primary);
  font-size: 16px;
}
</style>

