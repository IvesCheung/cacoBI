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
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { CircleCheck, CircleClose, Loading, Clock, Coin, Timer, Close, Document, WarningFilled } from '@element-plus/icons-vue'

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
  }
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
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }

  if (!isLocked.value && (mappedStatus.value === 'running' || mappedStatus.value === 'completed' || mappedStatus.value === 'skipped')) {
    showDetails.value = true
    nextTick(() => computePopupPosition())
  }
}

const handleMouseLeave = () => {
  if (!isLocked.value) {
    hideTimeout = setTimeout(() => {
      showDetails.value = false
    }, 200)
  }
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
</style>
