<template>
  <div class="progress-container">
    <!-- 起始点 -->
    <div class="progress-dot" :style="{ backgroundColor: startColor }"></div>

    <!-- 进度条组 -->
    <template v-for="(progress, index) in progressArray" :key="index">
      <!-- 进度条 -->
      <div class="progress-wrapper">
        <div class="progress-bg">
          <div
            class="progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- 连接点 -->
      <div
        class="progress-dot connector"
        :class="{
          'connector-active': progress >= 100,
          'connector-inactive': progress < 100
        }"
      ></div>
    </template>

    <!-- 时间显示 -->
    <div class="time-badge">
      链路耗时: <span class="time-value">{{ time.toFixed(2) }}</span> 秒
    </div>
  </div>
</template>

<script setup>
defineProps({
  startColor: {
    type: String,
    default: '#10b981'
  },
  progressArray: {
    type: Array,
    required: true
  },
  time: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 3px;
}

.progress-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.connector {
  background-color: #64748b;
  transition: background-color 0.3s;
}

.connector-active {
  background-color: #3b82f6 !important;
}

.connector-inactive {
  background-color: #64748b !important;
}

.progress-wrapper {
  width: 40px;
  flex-shrink: 0;
}

.progress-bg {
  width: 100%;
  height: 3px;
  background: #475569;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.1s linear;
  border-radius: 2px;
}

.time-badge {
  background: #2563eb;
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  white-space: nowrap;
  margin-left: 6px;
}

.time-value {
  font-weight: 600;
}
</style>

