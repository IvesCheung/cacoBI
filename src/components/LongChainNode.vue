<template>
  <el-popover
    placement="top"
    :width="200"
    trigger="hover"
    :disabled="node.status === 'pending'"
    popper-class="node-popover"
  >
    <template #reference>
      <div
        class="node-card"
        :class="[
          `node-type-${node.type || 'default'}`,
          `node-status-${node.status || 'pending'}`,
          { 'is-llm': node.isLLM }
        ]"
      >
        <div class="node-header">
          <span class="node-title">{{ node.title }}</span>
          <el-tag v-if="node.isLLM" type="warning" size="small" class="llm-tag">LLM</el-tag>
        </div>
        <div v-if="node.status !== 'pending'" class="node-body">
          <div v-if="node.time" class="node-stat">
            <i class="icon-time"></i>
            <span>{{ typeof node.time === 'number' ? node.time.toFixed(2) : node.time }}s</span>
          </div>
          <div v-if="node.tokens" class="node-stat">
            <i class="icon-token"></i>
            <span>{{ node.tokens }}</span>
          </div>
        </div>
        <div v-if="node.status === 'error'" class="error-badge">
          <i class="icon-error"></i>
        </div>
      </div>
    </template>
    <div class="popover-content">
      <div class="popover-title">{{ node.title }}</div>
      <div class="popover-item">
        <span>状态:</span>
        <el-tag :type="statusMap[node.status]?.type || 'info'" size="small">{{ statusMap[node.status]?.text || '未知' }}</el-tag>
      </div>
      <div v-if="node.time" class="popover-item">
        <span>耗时:</span>
        <span>{{ typeof node.time === 'number' ? node.time.toFixed(4) : node.time }} s</span>
      </div>
      <div v-if="node.tokens" class="popover-item">
        <span>Tokens:</span>
        <span>{{ node.tokens }}</span>
      </div>
      <div v-if="node.error" class="popover-item error-details">
        <span>错误:</span>
        <span>{{ node.error }}</span>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
defineProps({
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
    })
  }
});

const statusMap = {
  pending: { text: '等待中', type: 'info' },
  running: { text: '执行中', type: 'warning' },
  completed: { text: '已完成', type: 'success' },
  error: { text: '失败', type: 'danger' },
};
</script>

<style scoped>
/* Basic Icons */
.icon-time, .icon-token, .icon-error {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 4px;
  vertical-align: -0.15em;
}
.icon-time { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'); }
.icon-token { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'); }
.icon-error { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'); }

.node-card {
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #27374D;
  border: 1px solid #3b506d;
  color: #dde6ed;
  font-size: 13px;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.node-title {
  font-weight: 600;
  color: #f0f0f0;
}

.llm-tag {
  height: 18px;
  padding: 0 6px;
  font-weight: bold;
  border-color: rgba(234, 179, 8, 0.4);
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.node-body {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.node-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Node Types */
.node-type-llm {
  background-color: #1e3a8a;
  border-color: #2563eb;
}
.node-type-computation {
  background-color: #5b21b6;
  border-color: #8b5cf6;
}
.node-type-data {
  background-color: #374151;
  border-color: #6b7280;
}

/* Node Statuses */
.node-status-pending {
  opacity: 0.6;
  border-style: dashed;
}
.node-status-running {
  border-color: #eab308;
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.5);
}
.node-status-completed {
  border-color: #22c55e;
}
.node-status-error {
  border-color: #ef4444;
  background-color: #450a0a;
}

.error-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-badge .icon-error {
  color: #f87171;
  width: 16px;
  height: 16px;
}

:deep(.el-loading-spinner .path) {
  stroke: #eab308;
}
:deep(.el-loading-text) {
  color: #eab308;
}
</style>
