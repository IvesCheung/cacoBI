<template>
  <div
    class="chain-node-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="wrapperEl"
  >
    <div
      class="chain-node"
      :class="[`status-${mappedStatus}`, { 'is-llm': node.isLLM }]"
      @click="handleClick"
      :data-node-id="node.id"
    >
      <!-- LLM Badge -->
      <div v-if="node.isLLM" class="llm-badge">
        <img src="@/assets/robot-2-fill.svg" alt="LLM" class="llm-icon" />
      </div>

      <div class="node-header">
        <div class="node-icon">
          <el-icon v-if="mappedStatus === 'completed'"><CircleCheck /></el-icon>
          <el-icon v-else-if="mappedStatus === 'skipped'"><CircleClose /></el-icon>
          <el-icon v-else-if="mappedStatus === 'running'" class="spinning"><Loading /></el-icon>
          <el-icon v-else><Clock /></el-icon>
        </div>
        <div class="node-title" :title="node.title">{{ node.title }}</div>
      </div>

      <div v-if="mappedStatus === 'completed'" class="node-stats">
        <div v-if="node.time > 0" class="stat-item">
          <el-icon class="stat-icon"><Timer /></el-icon>
          <span>{{ node.time.toFixed(2) }}s</span>
        </div>
        <div v-if="node.isLLM" class="stat-item">
          <el-icon class="stat-icon"><Coin /></el-icon>
          <span>{{ node.tokens }}</span>
        </div>
      </div>

      <!-- Compare Button for Generate DSL nodes -->
      <div v-if="isGenerateDSLNode && mappedStatus === 'completed' && enableCompare" class="compare-button-wrapper">
        <el-button
          type="primary"
          size="small"
          @click.stop="handleCompareClick"
          class="compare-button"
        >
          <el-icon><Operation /></el-icon>
          Compare
        </el-button>
      </div>
    </div>

    <teleport to="body">
      <transition name="detail-fade">
        <div
          v-if="showDetails && (mappedStatus === 'completed' || mappedStatus === 'skipped')"
          class="node-detail-popup fixed-popup"
          :class="{ 'placement-below': !popupPlacementAbove, 'skipped-popup': mappedStatus === 'skipped' }"
          @mouseenter="handlePopupEnter"
          @mouseleave="handlePopupLeave"
          :style="popupStyle"
        >
          <div class="popup-header">
            <span class="popup-title">{{ node.title }}</span>
            <el-icon class="close-icon" @click.stop="closeDetail"><Close /></el-icon>
          </div>

          <!-- 跳过状态的特殊提示 -->
          <div v-if="mappedStatus === 'skipped'" class="popup-skipped-message">
            <el-icon class="skipped-icon"><CircleClose /></el-icon>
            <div class="skipped-text">
              <div class="skipped-title">Skip</div>
              <div class="skipped-desc">Cost Planer determined to skip this step after analysis to optimize execution efficiency</div>
            </div>
          </div>

          <!-- 正常状态的统计和详情 -->
          <template v-else>
            <div class="popup-stats">
              <div v-if="node.time > 0" class="stat-item">
                <el-icon><Timer /></el-icon>
                <span class="stat-label">Runtime</span>
                <span class="stat-value">{{ node.time.toFixed(2) }}s</span>
              </div>
              <div v-if="node.tokens > 0" class="stat-item">
                <el-icon><Coin /></el-icon>
                <span class="stat-label">Token Cost</span>
                <span class="stat-value">{{ node.tokens }}</span>
              </div>
            </div>

            <div v-if="node.details && node.details.length" class="popup-details">
              <div v-for="(d, i) in node.details" :key="i" class="detail-line">
                <el-icon class="detail-icon"><Document /></el-icon>
                <span>{{ d }}</span>
              </div>
            </div>

            <div v-if="node.error" class="popup-error">
              <el-icon class="error-icon"><WarningFilled /></el-icon>
              <span>{{ node.error }}</span>
            </div>
          </template>
        </div>
      </transition>
    </teleport>

    <!-- Compare Dialog -->
    <el-dialog
      v-model="showCompareDialog"
      title="DSL Comparison"
      width="800px"
      :close-on-click-modal="false"
      class="dsl-compare-dialog"
      :modal-class="'dsl-compare-modal'"
      append-to-body
    >
      <div class="compare-dialog-content">
        <div class="compare-header">
          <div class="header-column current-header">
            <span class="chain-label">Current Chain DSL</span>
          </div>
          <div class="header-spacer"></div>
          <div class="header-column other-header">
            <span class="chain-label">{{ compareData?.chainName || 'Other Chain' }} DSL</span>
          </div>
        </div>

        <div class="compare-body">
          <div
            v-for="item in comparisonResult"
            :key="item.index"
            class="compare-row"
            :class="`status-${item.status}`"
          >
            <div class="compare-column current-column">
              <div class="line-number">{{ item.current ? item.index + 1 : '-' }}</div>
              <div class="line-content" v-if="item.current">
                {{ item.current }}
              </div>
              <div class="line-content empty" v-else>
                <span class="empty-label">(empty)</span>
              </div>
            </div>

            <div class="compare-indicator">
              <el-icon v-if="item.status === 'same'" class="icon-same"><CircleCheck /></el-icon>
              <el-icon v-else-if="item.status === 'different'" class="icon-different"><WarningFilled /></el-icon>
              <el-icon v-else class="icon-missing"><CircleClose /></el-icon>
            </div>

            <div class="compare-column other-column">
              <div class="line-number">{{ item.other ? item.index + 1 : '-' }}</div>
              <div class="line-content" v-if="item.other">
                {{ item.other }}
              </div>
              <div class="line-content empty" v-else>
                <span class="empty-label">(empty)</span>
              </div>
            </div>
          </div>

          <div v-if="comparisonResult.length === 0" class="empty-comparison">
            <el-icon class="empty-icon"><Document /></el-icon>
            <p>No data to compare</p>
          </div>
        </div>

        <div class="compare-legend">
          <div class="legend-item">
            <el-icon class="icon-same"><CircleCheck /></el-icon>
            <span>Same</span>
          </div>
          <div class="legend-item">
            <el-icon class="icon-different"><WarningFilled /></el-icon>
            <span>Different</span>
          </div>
          <div class="legend-item">
            <el-icon class="icon-missing"><CircleClose /></el-icon>
            <span>Missing</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="closeCompareDialog">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { CircleCheck, CircleClose, Loading, Clock, Coin, Timer, Close, Document, WarningFilled, Operation } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '未命名节点',
      status: 'pending',
      isLLM: false,
      time: 0,
      tokens: 0,
      error: null,
      details: []
    })
  },
  enableCompare: {
    type: Boolean,
    default: false
  },
  compareData: {
    type: Object,
    default: null
  }
})

// Check if this is a "Generate DSL" node
const isGenerateDSLNode = computed(() => {
  return props.node.title === 'Generate DSL'
})

const mappedStatus = computed(() => {
  if (props.node.status === 'skipped') return 'skipped'
  if (props.node.status === 'completed') return 'completed'
  if (props.node.status === 'running') return 'running'
  return 'pending'
})

const showDetails = ref(false)
const isLocked = ref(false)
let hideTimeout = null
const wrapperEl = ref(null)
const popupLeft = ref(0)
const popupTop = ref(0)
const popupPlacementAbove = ref(true)

const popupStyle = computed(() => ({ left: popupLeft.value + 'px', top: popupTop.value + 'px' }))

const computePopupPosition = () => {
  if (!wrapperEl.value) return
  const rect = wrapperEl.value.getBoundingClientRect()
  popupPlacementAbove.value = rect.top > 220
  const gap = 12
  popupLeft.value = rect.left + rect.width / 2
  popupTop.value = popupPlacementAbove.value ? rect.top - gap : rect.bottom + gap
}

const handleMouseEnter = () => {
  // Disabled hover to show details - only show on click
  // if (hideTimeout) {
  //   clearTimeout(hideTimeout)
  //   hideTimeout = null
  // }

  // if (!isLocked.value && (mappedStatus.value === 'running' || mappedStatus.value === 'completed' || mappedStatus.value === 'skipped')) {
  //   showDetails.value = true
  //   nextTick(() => computePopupPosition())
  // }
}

const handleMouseLeave = () => {
  // Disabled hover to hide details
  // if (!isLocked.value) {
  //   hideTimeout = setTimeout(() => {
  //     showDetails.value = false
  //   }, 200)
  // }
}

const handlePopupEnter = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

const handlePopupLeave = () => {
  if (!isLocked.value) {
    showDetails.value = false
  }
}

const handleClick = () => {
  if (mappedStatus.value === 'running' || mappedStatus.value === 'completed' || mappedStatus.value === 'skipped') {
    isLocked.value = !isLocked.value
    showDetails.value = isLocked.value
    if (showDetails.value) {
      nextTick(() => computePopupPosition())
    }
  }
}

const closeDetail = () => {
  isLocked.value = false
  showDetails.value = false
}

// Compare functionality
const showCompareDialog = ref(false)

const handleCompareClick = () => {
  if (!props.compareData || !props.compareData.details) {
    ElMessageBox.alert('No comparison data available from the other chain.', 'Compare DSL', {
      confirmButtonText: 'OK',
      type: 'warning'
    })
    return
  }
  showCompareDialog.value = true
}

const closeCompareDialog = () => {
  showCompareDialog.value = false
}

// Compare the two DSL details arrays
const comparisonResult = computed(() => {
  if (!props.node.details || !props.compareData || !props.compareData.details) {
    return []
  }

  const currentDetails = props.node.details
  const otherDetails = props.compareData.details
  const maxLength = Math.max(currentDetails.length, otherDetails.length)

  const result = []
  for (let i = 0; i < maxLength; i++) {
    const current = i < currentDetails.length ? currentDetails[i] : null
    const other = i < otherDetails.length ? otherDetails[i] : null

    let status = 'same'
    if (current === null) {
      status = 'missing-left'
    } else if (other === null) {
      status = 'missing-right'
    } else if (current !== other) {
      status = 'different'
    }

    result.push({
      index: i,
      current,
      other,
      status
    })
  }

  return result
})

</script>

<style scoped>
.chain-node-wrapper { position: relative; display: inline-block; z-index: 5; }
.chain-node {
  background: linear-gradient(145deg, var(--node-bg-from) 0%, var(--node-bg-to) 100%);
  border-radius: 8px;
  padding: 8px 12px;
  border: 2px solid rgba(16,185,129,var(--node-border-opacity));
  transition: all .3s cubic-bezier(.4,0,.2,1);
  min-width: 150px;
  max-width: 180px;
  cursor: pointer;
  position: relative;
}

.chain-node.status-pending {
  opacity: .45;
  border-color: rgba(16,185,129,0.15);
}

.chain-node.status-running {
  border-color: #10b981;
  box-shadow: 0 0 25px rgba(16,185,129,.45);
  animation: greenPulse 2s ease-in-out infinite;
}

.chain-node.status-completed {
  border-color: rgba(34,197,94,.85);
  background: linear-gradient(145deg, var(--node-completed-bg-from) 0%, var(--node-completed-bg-to) 100%);
  box-shadow: 0 0 18px rgba(34,197,94,.4);
}

/* 跳过状态 - 灰色主题，带有对角线条纹 */
.chain-node.status-skipped {
  opacity: 0.6;
  border-color: rgba(148, 163, 184, 0.5);
  background:
    repeating-linear-gradient(
      45deg,
      rgba(71, 85, 105, 0.3),
      rgba(71, 85, 105, 0.3) 10px,
      rgba(51, 65, 85, 0.3) 10px,
      rgba(51, 65, 85, 0.3) 20px
    ),
    linear-gradient(145deg, var(--node-bg-from) 0%, var(--node-bg-to) 100%);
  position: relative;
}

.chain-node.status-skipped::before {
  content: 'Skipped';
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 9px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* LLM Badge */
.llm-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

/* 当节点被跳过时，LLM badge 向左移动以避开 "Skipped" 标签 */
.status-skipped .llm-badge {
  right: 60px;
}

.llm-icon {
  width: 12px;
  height: 12px;
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(71%) sepia(48%) saturate(464%) hue-rotate(99deg) brightness(91%) contrast(86%);
}

.status-running .llm-badge {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(34, 197, 94, 0.3) 100%);
  animation: llmBadgePulse 2s ease-in-out infinite;
}

.status-completed .llm-badge {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.25) 100%);
}

.status-skipped .llm-badge {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(100, 116, 139, 0.2) 100%);
}

.status-skipped .llm-icon {
  filter: brightness(0) saturate(100%) invert(68%) sepia(8%) saturate(645%) hue-rotate(182deg) brightness(92%) contrast(90%);
}

@keyframes llmBadgePulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
  }
}

@keyframes greenPulse {
  0%,100% { box-shadow: 0 0 25px rgba(16,185,129,.55); }
  50% { box-shadow: 0 0 35px rgba(16,185,129,.85); }
}

.node-header { display: flex; align-items: center; gap: 8px; }
.node-icon { font-size: 18px; flex-shrink: 0; }
.status-running .node-icon { color: #10b981; }
.status-completed .node-icon { color: #22c55e; }
.status-skipped .node-icon { color: #94a3b8; }

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.node-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-primary);
  line-height: 1.3;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-skipped .node-title {
  color: var(--app-text-secondary);
  text-decoration: line-through;
}

.node-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(16,185,129,.3);
}

.node-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--app-text-secondary);
}

.node-stats .stat-icon {
  font-size: 13px;
  color: #10b981;
}

.chain-node:hover:not(.status-pending) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,.35);
}

.node-detail-popup.fixed-popup {
  position: fixed;
  transform: translateX(-50%);
  background: linear-gradient(145deg, var(--popup-bg-from) 0%, var(--popup-bg-to) 100%);
  border: 2px solid var(--popup-border);
  border-radius: 12px;
  padding: 16px;
  min-width: 300px;
  max-width: 380px;
  box-shadow: 0 10px 40px var(--app-shadow), 0 0 0 1px rgba(255,255,255,.08), 0 0 20px rgba(16,185,129,.35);
  z-index: 10000;
  backdrop-filter: blur(20px);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.node-detail-popup.fixed-popup::after, .node-detail-popup.fixed-popup::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.node-detail-popup.fixed-popup::after {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.node-detail-popup.fixed-popup.placement-below::after {
  top: -10px;
  border-bottom: 10px solid var(--popup-arrow-border);
}

.node-detail-popup.fixed-popup:not(.placement-below)::after {
  bottom: -10px;
  border-top: 10px solid var(--popup-arrow-border);
}

.node-detail-popup.fixed-popup::before {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}

.node-detail-popup.fixed-popup.placement-below::before {
  top: -8px;
  border-bottom: 8px solid var(--popup-arrow-bg);
}

.node-detail-popup.fixed-popup:not(.placement-below)::before {
  bottom: -8px;
  border-top: 8px solid var(--popup-arrow-bg);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(16,185,129,.3);
}

.popup-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--popup-title-color);
  letter-spacing: .3px;
  transition: color 0.3s ease;
}

.close-icon {
  cursor: pointer;
  color: var(--app-text-secondary);
  font-size: 16px;
  padding: 2px;
  border-radius: 4px;
  transition: all .3s ease;
}

.close-icon:hover {
  color: var(--app-text-primary);
  background: rgba(148,163,184,.1);
  transform: rotate(90deg);
}

.popup-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.popup-stats .stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(16,185,129,.15) 0%, rgba(34,197,94,.15) 100%);
  border-radius: 8px;
  border: 1px solid rgba(16,185,129,.35);
}

.popup-stats .stat-item .el-icon {
  font-size: 18px;
  color: #10b981;
}

.stat-label {
  font-size: 11px;
  color: var(--app-text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.stat-value {
  font-size: 14px;
  color: var(--popup-title-color);
  font-weight: 700;
  transition: color 0.3s ease;
}

.popup-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--popup-text-color);
  line-height: 1.5;
  padding: 8px;
  background: linear-gradient(135deg, rgba(16,185,129,.08) 0%, rgba(34,197,94,.08) 100%);
  border-radius: 6px;
  border-left: 3px solid rgba(16,185,129,.5);
  transition: color 0.3s ease;
}

.detail-icon {
  color: #10b981;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.popup-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
  border-radius: 8px;
  border-left: 3px solid rgba(239, 68, 68, 0.6);
  font-size: 12px;
  color: #fca5a5;
  margin-top: 8px;
}

.error-icon {
  color: #ef4444;
  font-size: 16px;
  flex-shrink: 0;
}

/* 跳过状态弹窗样式 */
.popup-skipped-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.15) 0%, rgba(100, 116, 139, 0.15) 100%);
  border-radius: 8px;
  border-left: 3px solid rgba(148, 163, 184, 0.6);
  margin-top: 8px;
}

.skipped-icon {
  color: #94a3b8;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.skipped-text {
  flex: 1;
}

.skipped-title {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 4px;
}

.skipped-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.skipped-popup {
  border-color: rgba(148, 163, 184, 0.3);
}

.detail-fade-enter-active {
  transition: all .25s cubic-bezier(.4,0,.2,1);
}

.detail-fade-leave-active {
  transition: all .2s cubic-bezier(.4,0,.2,1);
}

.detail-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.detail-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* Compare Button Styles */
.compare-button-wrapper {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(16,185,129,.3);
}

.compare-button {
  width: 100%;
  font-size: 11px;
  padding: 6px 8px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%);
  border-color: rgba(16, 185, 129, 0.5);
  color: #10b981;
  transition: all 0.3s ease;
}

.compare-button:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(34, 197, 94, 0.3) 100%);
  border-color: rgba(16, 185, 129, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.compare-button .el-icon {
  margin-right: 4px;
}

/* Compare Dialog Styles */
.dsl-compare-modal {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(8px) !important;
}

.dsl-compare-dialog {
  --el-dialog-bg-color: var(--panel-bg-gradient-from);
}

.dsl-compare-dialog :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(8px) !important;
}

.dsl-compare-dialog :deep(.el-dialog) {
  background: var(--panel-bg-gradient-from) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.dsl-compare-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, var(--popup-bg-from) 0%, var(--popup-bg-to) 100%);
  border-bottom: 2px solid rgba(16, 185, 129, 0.3);
  padding: 16px 20px;
}

.dsl-compare-dialog :deep(.el-dialog__title) {
  color: var(--popup-title-color);
  font-weight: 700;
  font-size: 16px;
}

.dsl-compare-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--panel-bg-gradient-from) !important;
}

.dsl-compare-dialog :deep(.el-dialog__footer) {
  background: linear-gradient(135deg, var(--popup-bg-from) 0%, var(--popup-bg-to) 100%);
  border-top: 2px solid rgba(16, 185, 129, 0.3);
  padding: 12px 20px;
}

.compare-dialog-content {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 600px;
  background: var(--panel-bg-gradient-from) !important;
}

.compare-header {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(34, 197, 94, 0.3) 100%);
  border-bottom: 2px solid rgba(16, 185, 129, 0.3);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.header-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex: 1;
}

.header-spacer {
  width: 40px;
  flex-shrink: 0;
}

.chain-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--popup-title-color);
  letter-spacing: 0.3px;
}

.current-header {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.3) 100%);
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.6);
  backdrop-filter: blur(4px);
}

.other-header {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.5) 0%, rgba(245, 158, 11, 0.3) 100%);
  border-radius: 6px;
  border: 1px solid rgba(245, 158, 11, 0.6);
  backdrop-filter: blur(4px);
}

.compare-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--panel-bg-gradient-from) !important;
}

.compare-row {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 0;
  margin-bottom: 12px;
  min-height: 40px;
  transition: all 0.3s ease;
}

.compare-row.status-same {
  opacity: 0.85;
}

.compare-row.status-different {
  background: linear-gradient(90deg,
    rgba(239, 68, 68, 0.1) 0%,
    rgba(239, 68, 68, 0.05) 48%,
    rgba(239, 68, 68, 0.05) 52%,
    rgba(239, 68, 68, 0.1) 100%
  );
  border-radius: 6px;
  padding: 4px 0;
}

.compare-row.status-missing-left {
  background: linear-gradient(90deg,
    transparent 0%,
    transparent 48%,
    rgba(148, 163, 184, 0.1) 52%,
    rgba(148, 163, 184, 0.1) 100%
  );
  border-radius: 6px;
  padding: 4px 0;
}

.compare-row.status-missing-right {
  background: linear-gradient(90deg,
    rgba(148, 163, 184, 0.1) 0%,
    rgba(148, 163, 184, 0.1) 48%,
    transparent 52%,
    transparent 100%
  );
  border-radius: 6px;
  padding: 4px 0;
}

.compare-column {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  align-items: flex-start;
}

.current-column {
  border-right: 1px solid rgba(16, 185, 129, 0.2);
}

.other-column {
  border-left: 1px solid rgba(245, 158, 11, 0.2);
}

.line-number {
  font-size: 11px;
  color: var(--app-text-secondary);
  min-width: 24px;
  text-align: right;
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
  padding-top: 2px;
}

.line-content {
  flex: 1;
  font-size: 12px;
  color: var(--popup-text-color);
  line-height: 1.6;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  background: rgba(16, 185, 129, 0.25);
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 3px solid rgba(16, 185, 129, 0.6);
  backdrop-filter: blur(2px);
}

.line-content.empty {
  background: rgba(148, 163, 184, 0.25);
  border-left-color: rgba(148, 163, 184, 0.6);
  opacity: 0.6;
  font-style: italic;
}

.empty-label {
  color: var(--app-text-secondary);
  font-size: 11px;
}

.compare-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
}

.compare-indicator .el-icon {
  font-size: 18px;
}

.icon-same {
  color: #22c55e;
}

.icon-different {
  color: #ef4444;
}

.icon-missing {
  color: #94a3b8;
}

.empty-comparison {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--app-text-secondary);
}

.empty-icon {
  font-size: 48px;
  color: var(--app-text-secondary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-comparison p {
  font-size: 14px;
  margin: 0;
}

.compare-legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(34, 197, 94, 0.25) 100%);
  border-top: 1px solid rgba(16, 185, 129, 0.4);
  backdrop-filter: blur(4px);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.legend-item .el-icon {
  font-size: 16px;
}

</style>
