<template>
  <div class="result-chart">
    <div class="chart-container">
      <svg viewBox="0 0 100 100" class="pie-chart">
        <circle cx="50" cy="50" r="40" fill="#f3f4f6" />
        <!-- 青岛 -->
        <path
          d="M50,50 L50,10 A40,40 0 0,1 80.6,50 Z"
          fill="#10b981"
        />
        <!-- 杭州 -->
        <path
          d="M50,50 L80.6,50 A40,40 0 0,1 70.6,80.6 Z"
          fill="#f59e0b"
        />
        <!-- 天津 -->
        <path
          d="M50,50 L70.6,80.6 A40,40 0 0,1 50,90 Z"
          fill="#3b82f6"
        />
        <!-- 上海 -->
        <path
          d="M50,50 L50,90 A40,40 0 0,1 30,80.6 Z"
          fill="#ef4444"
        />
        <!-- 北京 -->
        <path
          d="M50,50 L30,80.6 A40,40 0 0,1 50,10 Z"
          fill="#8b5cf6"
        />
      </svg>
    </div>

    <div class="legend">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const legendItems = [
  { label: '青岛', color: '#10b981' },
  { label: '杭州', color: '#f59e0b' },
  { label: '天津', color: '#3b82f6' },
  { label: '上海', color: '#ef4444' },
  { label: '北京', color: '#8b5cf6' }
]
</script>

<style scoped>
.result-chart {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.pie-chart {
  width: 128px;
  height: 128px;
}

.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 12px;
  color: #1f2937;
}
</style>

