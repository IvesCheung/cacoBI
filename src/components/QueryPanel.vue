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

    <!-- 查询输入区域 - 重新设计 -->
    <div class="query-input-container">
      <!-- 文本输入框 -->
      <el-input
        v-model="queryText"
        type="textarea"
        :rows="2"
        placeholder="Enter your query here..."
        class="query-textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        :disabled="isExecuting"
        @keydown.enter.exact="handleKeyboardExecute"
      />

      <!-- 操作按钮栏 -->
      <div class="action-bar">
        <!-- 左侧按钮组 -->
        <div class="left-actions">
          <!-- Cost Planer 按钮 -->
          <el-button
            :type="costAgentEnabled ? 'success' : 'default'"
            :disabled="isExecuting"
            @click="toggleCostAgent"
            class="cost-planer-btn"
            round
          >
            <el-icon class="btn-icon">
              <CircleCheck v-if="costAgentEnabled" />
              <CircleClose v-else />
            </el-icon>
            <span>Cost Planer</span>
          </el-button>

          <!-- Sample 选择器 -->
          <div v-if="showSampleSelector" class="sample-selector-wrapper">
            <QueryExampleSelector
              :current-example-id="currentExampleId"
              :is-executing="isExecuting"
              @change="handleExampleChange"
            />
          </div>
        </div>

        <!-- 右侧执行按钮 -->
        <el-button
          type="primary"
          :disabled="isExecuting || !queryText.trim()"
          @click="handleExecute"
          class="execute-btn"
          circle
        >
          <el-icon v-if="isExecuting" class="is-loading">
            <Loading />
          </el-icon>
          <el-icon v-else>
            <Right />
          </el-icon>
        </el-button>
      </div>
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
      :skipped-stage-indices="skippedStageIndices"
    />

    <!-- 链路结果 -->
    <div v-if="optimizedCompleted || longCompleted" class="results-section">
      <el-scrollbar class="results-scrollbar">
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
      </el-scrollbar>
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
import { CircleCheck, CircleClose, Setting, Right, Loading } from '@element-plus/icons-vue'
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
    default: true
  },
  showSampleSelector: {
    type: Boolean,
    default: true
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
  skippedStageIndices: {
    type: Array,
    default: () => []
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
  if (!props.queryText.trim() || props.isExecuting) {
    return
  }
  emit('execute')
}

const handleKeyboardExecute = (event) => {
  // 只有单独按 Enter 键时触发，Shift+Enter 用于换行
  if (!event.shiftKey && !props.isExecuting && props.queryText.trim()) {
    event.preventDefault()
    emit('execute')
  }
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

/* 查询输入容器 - 整体外框 */
.query-input-container {
  margin-bottom: 12px;
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  border-radius: 16px;
  padding: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--app-shadow);
}

.query-input-container:hover {
  border-color: var(--input-border-hover);
  box-shadow: 0 4px 12px var(--app-shadow);
}

.query-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.query-textarea {
  width: 100%;
  margin-bottom: 8px;
}

.query-textarea :deep(.el-textarea__inner) {
  background: transparent;
  border: none;
  color: var(--app-text-primary);
  font-size: 18px;
  line-height: 1.6;
  padding: 4px 8px;
  transition: all 0.3s ease;
  box-shadow: none;
  resize: none;
}

.query-textarea :deep(.el-textarea__inner::placeholder) {
  color: var(--input-placeholder);
}

.query-textarea :deep(.el-textarea__inner:focus) {
  background: transparent;
  border: none;
  box-shadow: none;
  outline: none;
}

/* 操作按钮栏 */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.btn-icon {
  margin-right: 4px;
}

/* Cost Planer 按钮 */
.cost-planer-btn {
  font-weight: 500;
  padding: 6px 16px;
  height: 36px;
  transition: all 0.3s ease;
  border: 1.5px solid transparent;
}

.cost-planer-btn.el-button--success {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.cost-planer-btn.el-button--success:hover {
  background: #059669;
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.cost-planer-btn.el-button--default {
  background: transparent;
  border-color: var(--input-border);
  color: var(--app-text-primary);
}

.cost-planer-btn.el-button--default:hover {
  border-color: #64748b;
  color: #64748b;
  background: rgba(100, 116, 139, 0.05);
}

/* Sample 选择器包装器 */
.sample-selector-wrapper {
  flex: 1;
  max-width: 300px;
}

.sample-selector-wrapper :deep(.example-selector) {
  width: 100%;
}

.sample-selector-wrapper :deep(.el-select) {
  width: 100%;
}

.sample-selector-wrapper :deep(.el-select .el-input__wrapper) {
  background: transparent;
  border: 1.5px solid var(--input-border);
  border-radius: 18px;
  padding: 0 14px;
  height: 36px;
  transition: all 0.3s ease;
  box-shadow: none;
}

.sample-selector-wrapper :deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--input-border-hover);
  background: rgba(59, 130, 246, 0.02);
}

.sample-selector-wrapper :deep(.el-select.is-focus .el-input__wrapper) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 执行按钮 - 圆形图标按钮 */
.execute-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  background: #2563eb;
  border-color: #2563eb;
  transition: all 0.3s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.execute-btn :deep(.el-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.execute-btn :deep(.el-icon.is-loading) {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.execute-btn:hover:not(.is-disabled) {
  background: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
}

.execute-btn.is-disabled {
  background: #93c5fd;
  border-color: #93c5fd;
  cursor: not-allowed;
  opacity: 0.6;
}

.execute-btn .el-icon {
  font-size: 20px;
}

.log-section {
  margin-bottom: 12px;
}

.results-section {
  margin-bottom: 12px;
  flex-shrink: 1;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.results-scrollbar {
  flex: 1;
  height: 100%;
}

.results-scrollbar :deep(.el-scrollbar__view) {
  padding: 0 4px;
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

