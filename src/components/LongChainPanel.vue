<template>
  <div class="chain-panel">
    <div class="panel-header">
      <h2 class="panel-title long-title">🟠 传统链路（长链路）</h2>
      <div class="header-stats">
        <div class="time-badge">
          链路耗时: <span class="time-value">{{ time.toFixed(2) }}</span> 秒
        </div>
        <div class="token-badge">
          总Token: <span class="token-value">{{ totalTokens }}</span>
        </div>
      </div>
    </div>

    <div class="panel-body">
      <LongChainFlow :steps="steps" />
    </div>
  </div>
</template>

<script setup>
import LongChainFlow from './LongChainFlow.vue'

defineProps({
  steps: {
    type: Object,
    required: true
  },
  time: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  }
})
</script><style scoped>
.chain-panel {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  height: 100%;
}

.chain-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px 12px 0 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;
}

.header-stats {
  display: flex;
  gap: 8px;
  align-items: center;
}

.time-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.time-value {
  font-weight: 700;
  font-size: 13px;
}

.token-badge {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
}

.token-value {
  font-weight: 700;
  font-size: 13px;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.long-title {
  color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-body {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  min-height: 220px;
}

/* 美化滚动条 */
.panel-body::-webkit-scrollbar {
  height: 8px;
}

.panel-body::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}
</style>

