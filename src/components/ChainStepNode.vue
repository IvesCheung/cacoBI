<template>
  <div
    class="chain-step-node"
    :class="[
      `status-${status}`,
      `type-${type}`,
      { 'in-parallel': inParallel, 'show-details': showDetails }
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="node-header">
      <div class="node-icon">
        <el-icon v-if="status === 'completed'"><CircleCheck /></el-icon>
        <el-icon v-else-if="status === 'active'" class="spinning"><Loading /></el-icon>
        <el-icon v-else><Clock /></el-icon>
      </div>
      <div class="node-title">{{ title }}</div>
    </div>

    <!-- 详情弹出层 -->
    <transition name="detail-fade">
      <div v-if="showDetails && (status === 'active' || status === 'completed')" class="node-detail-popup">
        <div class="popup-header">
          <span class="popup-title">{{ title }}</span>
          <el-icon class="close-icon" @click.stop="closeDetail"><Close /></el-icon>
        </div>

        <div v-if="type === 'llm'" class="popup-stats">
          <div v-if="tokens > 0" class="stat-item">
            <el-icon><Coin /></el-icon>
            <span class="stat-label">Token消耗</span>
            <span class="stat-value">{{ tokens }}</span>
          </div>
          <div v-if="duration > 0" class="stat-item">
            <el-icon><Timer /></el-icon>
            <span class="stat-label">耗时</span>
            <span class="stat-value">{{ duration }}s</span>
          </div>
        </div>

        <div v-if="details && details.length > 0" class="popup-details">
          <div v-for="(detail, idx) in details" :key="idx" class="detail-line">
            <el-icon class="detail-icon"><Document /></el-icon>
            <span>{{ detail }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CircleCheck, Loading, Clock, Coin, Timer, Close, Document } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'inactive', // inactive, active, completed
    validator: (value) => ['inactive', 'active', 'completed'].includes(value)
  },
  type: {
    type: String,
    default: 'compute', // llm, compute
    validator: (value) => ['llm', 'compute'].includes(value)
  },
  tokens: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  details: {
    type: Array,
    default: () => []
  },
  inParallel: {
    type: Boolean,
    default: false
  }
})

const showDetails = ref(false)
const isLocked = ref(false)

const handleMouseEnter = () => {
  if (!isLocked.value && (props.status === 'active' || props.status === 'completed')) {
    showDetails.value = true
  }
}

const handleMouseLeave = () => {
  if (!isLocked.value) {
    showDetails.value = false
  }
}

const handleClick = () => {
  if (props.status === 'active' || props.status === 'completed') {
    isLocked.value = !isLocked.value
    showDetails.value = isLocked.value
  }
}

const closeDetail = () => {
  isLocked.value = false
  showDetails.value = false
}
</script>

<style scoped>
.chain-step-node {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border-radius: 8px;
  padding: 8px 12px;
  border: 2px solid rgba(100, 116, 139, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
  max-width: 160px;
  cursor: pointer;
  position: relative;
}

/* LLM类型节点 - 蓝色主题 */
.chain-step-node.type-llm {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(145deg, rgba(30, 58, 138, 0.3) 0%, rgba(30, 41, 59, 0.5) 100%);
}

.chain-step-node.type-llm.status-active {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  animation: llmPulse 2s ease-in-out infinite;
}

.chain-step-node.type-llm.status-completed {
  border-color: rgba(16, 185, 129, 0.6);
  background: linear-gradient(145deg, rgba(5, 150, 105, 0.2) 0%, rgba(30, 41, 59, 0.5) 100%);
}

/* 传统计算类型节点 - 紫色主题 */
.chain-step-node.type-compute {
  border-color: rgba(168, 85, 247, 0.4);
  background: linear-gradient(145deg, rgba(107, 33, 168, 0.2) 0%, rgba(30, 41, 59, 0.5) 100%);
}

.chain-step-node.type-compute.status-active {
  border-color: rgba(168, 85, 247, 0.8);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.chain-step-node.type-compute.status-completed {
  border-color: rgba(134, 239, 172, 0.5);
  background: linear-gradient(145deg, rgba(74, 222, 128, 0.15) 0%, rgba(30, 41, 59, 0.5) 100%);
}

/* 非激活状态 */
.chain-step-node.status-inactive {
  opacity: 0.6;
  border-color: rgba(71, 85, 105, 0.3);
}

/* 并行执行标识 */
.chain-step-node.in-parallel {
  position: relative;
}

.chain-step-node.in-parallel::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  border-radius: 2px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.type-llm .node-icon {
  color: #60a5fa;
}

.type-compute .node-icon {
  color: #c084fc;
}

.status-completed .node-icon {
  color: #10b981;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes llmPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.7);
  }
}

.node-title {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  line-height: 1.3;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 详情弹出层 */
.node-detail-popup {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: 10px;
  padding: 12px;
  min-width: 280px;
  max-width: 360px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  z-index: 1000;
  backdrop-filter: blur(20px);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(99, 102, 241, 0.3);
}

.popup-title {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.3px;
}

.close-icon {
  cursor: pointer;
  color: #94a3b8;
  font-size: 16px;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-icon:hover {
  color: #f1f5f9;
  background: rgba(148, 163, 184, 0.1);
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.popup-stats .stat-item .el-icon {
  font-size: 18px;
  color: #60a5fa;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: #f1f5f9;
  font-weight: 700;
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
  color: #cbd5e1;
  line-height: 1.5;
  padding: 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
  border-radius: 6px;
  border-left: 3px solid rgba(59, 130, 246, 0.5);
}

.detail-icon {
  color: #60a5fa;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 动画效果 */
.detail-fade-enter-active, .detail-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.detail-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

/* 悬停效果 */
.chain-step-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.chain-step-node.status-inactive:hover {
  opacity: 0.8;
}
</style>

