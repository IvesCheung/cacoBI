<!-- eslint-disable no-unused-vars -->
<template>
  <div class="progress-container">
    <!-- 起始点 -->
    <!-- <div class="progress-dot" :style="{ backgroundColor: startColor }"></div> -->

    <!-- 进度条组 -->
    <!-- <template v-for="(progress, index) in progressArray" :key="index">
      <div class="progress-wrapper" :style="{ width: progressBarWidth }">
        <div class="progress-bg">
          <div
            class="progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
      <div
        class="progress-dot connector"
        :class="{
          'connector-active': progress >= 100,
          'connector-inactive': progress < 100
        }"
      ></div>
    </template> -->

    <!-- 时间显示 -->
    <div class="time-badge" :style="badgeStyle">
      runtime: <span class="time-value">{{ time.toFixed(2) }}</span> s
    </div>

    <!-- Token消耗显示 -->
    <div class="token-badge" :style="badgeStyle">
      token cost: <span class="token-value">{{ totalTokens }}</span>
    </div>

    <!-- LLM调用次数显示 -->
    <div class="token-badge" :style="badgeStyle">
      invocation: <span class="token-value">{{ llmCalls }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  llmCalls: {
    type: Number,
    default: 0
  }
})

// 根据进度条数量动态计算宽度
// const progressBarWidth = computed(() => {
//   const count = props.progressArray.length
//   // 短链路3个: 40px, 长链路7个: 28px
//   return count <= 3 ? '40px' : '28px'
// })

// 根据startColor计算badge样式
const badgeStyle = computed(() => {
  return {
    background: props.startColor
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
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 14px;
  white-space: nowrap;
  margin-left: 6px;
}

.time-value {
  font-weight: 600;
}

.token-badge {
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 14px;
  white-space: nowrap;
  margin-left: 3px;
}

.token-value {
  font-weight: 600;
}
</style>

