<template>
  <div
    class="chain-step-node"
    :class="[
      `status-${node.status}`,
      `type-${node.isLLM ? 'llm' : 'compute'}`,
      { 'show-details': showDetails }
    ]"
    :data-node-id="node.id"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="node-header">
      <div class="node-icon">
        <el-icon v-if="node.status === 'completed'"><CircleCheck /></el-icon>
        <el-icon v-else-if="node.status === 'running'" class="spinning"><Loading /></el-icon>
        <el-icon v-else><Clock /></el-icon>
      </div>
      <div class="node-title">{{ node.title }}</div>
    </div>

    <!-- 显示耗时和token信息 -->
    <div v-if="node.status !== 'pending'" class="node-stats">
      <div v-if="node.time > 0" class="stat-item">
        <el-icon class="stat-icon"><Timer /></el-icon>
        <span>{{ node.time.toFixed(2) }}s</span>
      </div>
      <div v-if="node.tokens > 0" class="stat-item">
        <el-icon class="stat-icon"><Coin /></el-icon>
        <span>{{ node.tokens }}</span>
      </div>
    </div>

    <!-- 详情弹出层 -->
    <transition name="detail-fade">
      <div v-if="showDetails && (node.status === 'running' || node.status === 'completed')" class="node-detail-popup">
        <div class="popup-header">
          <span class="popup-title">{{ node.title }}</span>
          <el-icon class="close-icon" @click.stop="closeDetail"><Close /></el-icon>
        </div>

        <div class="popup-stats">
          <div v-if="node.time > 0" class="stat-item">
            <el-icon><Timer /></el-icon>
            <span class="stat-label">耗时</span>
            <span class="stat-value">{{ node.time.toFixed(2) }}s</span>
          </div>
          <div v-if="node.tokens > 0" class="stat-item">
            <el-icon><Coin /></el-icon>
            <span class="stat-label">Token消耗</span>
            <span class="stat-value">{{ node.tokens }}</span>
          </div>
        </div>

        <div v-if="node.details && node.details.length > 0" class="popup-details">
          <div v-for="(detail, idx) in node.details" :key="idx" class="detail-line">
            <el-icon class="detail-icon"><Document /></el-icon>
            <span>{{ detail }}</span>
          </div>
        </div>

        <div v-if="node.error" class="popup-error">
          <el-icon class="error-icon"><WarningFilled /></el-icon>
          <span>{{ node.error }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CircleCheck, Loading, Clock, Coin, Timer, Close, Document, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '未命名节点',
      type: 'default',
      status: 'pending',
      isLLM: false,
      time: 0,
      tokens: 0,
      error: null,
      details: []
    })
  }
});

const showDetails = ref(false)
const isLocked = ref(false)

const handleMouseEnter = () => {
  if (!isLocked.value && (props.node.status === 'running' || props.node.status === 'completed')) {
    showDetails.value = true
  }
}

const handleMouseLeave = () => {
  if (!isLocked.value) {
    showDetails.value = false
  }
}

const handleClick = () => {
  if (props.node.status === 'running' || props.node.status === 'completed') {
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

/* LLM类型节点 - 蓝色主题，未执行前更暗 */
.chain-step-node.type-llm {
  border-color: rgba(59, 130, 246, 0.3);
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
}

.chain-step-node.type-llm.status-running {
  border-color: rgba(59, 130, 246, 1);
  background: linear-gradient(145deg, rgba(30, 58, 138, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
  animation: llmPulse 2s ease-in-out infinite;
}

.chain-step-node.type-llm.status-completed {
  border-color: rgba(34, 197, 94, 0.8);
  background: linear-gradient(145deg, rgba(5, 150, 105, 0.4) 0%, rgba(6, 78, 59, 0.6) 100%);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
}

/* 传统计算类型节点 - 紫色主题，未执行前更暗 */
.chain-step-node.type-compute {
  border-color: rgba(168, 85, 247, 0.3);
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
}

.chain-step-node.type-compute.status-running {
  border-color: rgba(168, 85, 247, 1);
  background: linear-gradient(145deg, rgba(107, 33, 168, 0.5) 0%, rgba(88, 28, 135, 0.7) 100%);
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
  animation: computePulse 2s ease-in-out infinite;
}

.chain-step-node.type-compute.status-completed {
  border-color: rgba(134, 239, 172, 0.8);
  background: linear-gradient(145deg, rgba(74, 222, 128, 0.3) 0%, rgba(34, 197, 94, 0.5) 100%);
  box-shadow: 0 0 15px rgba(134, 239, 172, 0.3);
}

/* 非激活状态 - 大幅降低亮度 */
.chain-step-node.status-pending {
  opacity: 0.4;
  border-color: rgba(71, 85, 105, 0.2);
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%);
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

.type-llm.status-pending .node-icon {
  color: #475569;
}

.type-llm.status-running .node-icon {
  color: #60a5fa;
}

.type-compute .node-icon {
  color: #c084fc;
}

.type-compute.status-pending .node-icon {
  color: #475569;
}

.type-compute.status-running .node-icon {
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
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
    border-color: rgba(59, 130, 246, 1);
  }
  50% {
    box-shadow: 0 0 35px rgba(59, 130, 246, 0.9);
    border-color: rgba(96, 165, 250, 1);
  }
}

@keyframes computePulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
    border-color: rgba(168, 85, 247, 1);
  }
  50% {
    box-shadow: 0 0 35px rgba(168, 85, 247, 0.8);
    border-color: rgba(192, 132, 252, 1);
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

.status-pending .node-title {
  color: #64748b;
}

/* 节点统计信息 */
.node-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(100, 116, 139, 0.3);
}

.node-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.node-stats .stat-icon {
  font-size: 13px;
  color: #60a5fa;
}

.type-llm.status-running .node-stats .stat-icon,
.type-compute.status-running .node-stats .stat-icon {
  color: #fbbf24;
}

.status-completed .node-stats .stat-icon {
  color: #10b981;
}

.node-stats .stat-item span {
  font-weight: 600;
  color: #cbd5e1;
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
.chain-step-node:hover:not(.status-pending) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.chain-step-node.status-pending:hover {
  opacity: 0.5;
}
</style>
