<template>
  <div class="log-panel">
    <div class="log-header">
      <span class="log-title">
        <el-icon><Document /></el-icon>
        Recent Logs
      </span>
      <el-button
        link
        size="small"
        @click="clearAllLogs"
        class="clear-btn"
      >
        <el-icon><Delete /></el-icon>
        Clear
      </el-button>
    </div>
    <el-scrollbar class="log-content" ref="logScrollContainer">
      <el-empty
        v-if="logs.length === 0"
        description="No logs yet"
        :image-size="40"
        class="no-logs"
      />
      <div
        v-for="log in logs"
        :key="log.id"
        class="log-item"
      >
        <el-tag
          :type="log.style.type"
          size="small"
          effect="plain"
          class="log-tag"
        >
          {{ log.style.icon }}
        </el-tag>
        <span class="log-message">{{ log.message }}</span>
        <span class="log-time">{{ log.time }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { nextTick, watch, ref } from 'vue'
import { Document, Delete } from '@element-plus/icons-vue'
import { getLogs, clearLogs } from '@/utils/logger'

// 获取日志数据
const logs = getLogs()

// 滚动容器引用
const logScrollContainer = ref(null)

// 清除日志
const clearAllLogs = () => {
  clearLogs()
}

// 监听日志变化，自动滚动到顶部
watch(() => logs.value.length, async () => {
  await nextTick()
  if (logScrollContainer.value) {
    logScrollContainer.value.setScrollTop(0)
  }
}, { immediate: true })
</script>

<style scoped>
.log-panel {
  background: var(--log-panel-bg, var(--input-bg));
  border: 1px solid var(--input-border);
  border-radius: 8px;
  overflow: hidden;
  height: 140px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--log-header-bg, var(--app-bg-secondary));
  border-bottom: 1px solid var(--input-border);
  flex-shrink: 0;
}

.log-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-btn {
  font-size: 12px;
  color: var(--app-text-secondary);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.clear-btn:hover {
  color: #f56c6c;
}

.log-content {
  flex: 1;
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  padding: 10px 12px;
}

.no-logs {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-empty__description) {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  background: var(--log-item-bg, rgba(0, 0, 0, 0.02));
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.log-item:last-child {
  margin-bottom: 0;
}

.log-item:hover {
  background: var(--input-bg);
  border-color: var(--input-border);
  transform: translateX(2px);
}

.log-tag {
  flex-shrink: 0;
  font-size: 14px;
  border: none;
  padding: 4px 8px;
}

.log-message {
  flex: 1;
  color: var(--app-text-primary);
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
  min-width: 0;
}

.log-time {
  flex-shrink: 0;
  color: var(--app-text-secondary);
  font-size: 11px;
  font-family: 'Courier New', Consolas, monospace;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.log-item:hover .log-time {
  opacity: 1;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .log-item {
    background: rgba(255, 255, 255, 0.03);
  }

  .log-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }
}
</style>
