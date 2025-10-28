<template>
  <div class="dual-path-progress">
    <svg :width="width" :height="height" class="progress-svg">
      <!-- 定义渐变色 -->
      <defs>
        <!-- 短链路渐变 (绿色) -->
        <linearGradient id="shortGradient">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#34d399;stop-opacity:1" />
        </linearGradient>

        <!-- 长链路渐变 (橙色) -->
        <linearGradient id="longGradient">
          <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
        </linearGradient>

        <!-- 背景色 (灰色) -->
        <linearGradient id="bgGradient">
          <stop offset="0%" style="stop-color:#475569;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#64748b;stop-opacity:0.3" />
        </linearGradient>
      </defs>

      <!-- 短链路背景连线 -->
      <g v-for="(segment, idx) in shortSegments" :key="`short-bg-${idx}`">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.end.x"
          :y2="segment.end.y"
          stroke="url(#bgGradient)"
          :stroke-width="pathWidth"
          stroke-linecap="round"
        />
      </g>

      <!-- 长链路背景连线 -->
      <g v-for="(segment, idx) in longSegments" :key="`long-bg-${idx}`">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.end.x"
          :y2="segment.end.y"
          stroke="url(#bgGradient)"
          :stroke-width="pathWidth"
          stroke-linecap="round"
        />
      </g>

      <!-- 短链路进度连线 -->
      <g v-for="(segment, idx) in shortSegments" :key="`short-progress-${idx}`">
        <line
          v-if="shortProgress[idx] > 0"
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.start.x + (segment.end.x - segment.start.x) * (shortProgress[idx] / 100)"
          :y2="segment.start.y + (segment.end.y - segment.start.y) * (shortProgress[idx] / 100)"
          stroke="url(#shortGradient)"
          :stroke-width="pathWidth"
          stroke-linecap="round"
          class="progress-line"
          :class="{ 'pulsing': shortProgress[idx] > 0 && shortProgress[idx] < 100 }"
        />
      </g>

      <!-- 长链路进度连线 -->
      <g v-for="(segment, idx) in longSegments" :key="`long-progress-${idx}`">
        <line
          v-if="longProgress[idx] > 0"
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.start.x + (segment.end.x - segment.start.x) * (longProgress[idx] / 100)"
          :y2="segment.start.y + (segment.end.y - segment.start.y) * (longProgress[idx] / 100)"
          stroke="url(#longGradient)"
          :stroke-width="pathWidth"
          stroke-linecap="round"
          class="progress-line"
          :class="{ 'pulsing': longProgress[idx] > 0 && longProgress[idx] < 100 }"
        />
      </g>

      <!-- 起点 -->
      <circle
        :cx="startPoint.x"
        :cy="startPoint.y"
        :r="dotRadius"
        fill="#3b82f6"
        class="start-dot"
      />

      <!-- 短链路节点 -->
      <g v-for="(node, idx) in shortNodes" :key="`short-node-${idx}`">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="dotRadius"
          :fill="getShortNodeColor(idx)"
          :class="getShortNodeClass(idx)"
          class="step-node"
        />
        <text
          :x="node.x"
          :y="node.y - dotRadius - 8"
          text-anchor="middle"
          class="node-label short-label"
        >
          {{ idx + 1 }}
        </text>
      </g>

      <!-- 长链路节点 -->
      <g v-for="(node, idx) in longNodes" :key="`long-node-${idx}`">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="dotRadius"
          :fill="getLongNodeColor(idx)"
          :class="getLongNodeClass(idx)"
          class="step-node"
        />
        <text
          :x="node.x"
          :y="node.y + dotRadius + 18"
          text-anchor="middle"
          class="node-label long-label"
        >
          {{ idx + 1 }}
        </text>
      </g>

      <!-- 路径标签 -->
      <text
        :x="shortNodes[shortNodes.length - 1].x + 35"
        :y="shortNodes[shortNodes.length - 1].y"
        text-anchor="start"
        class="path-label short-label"
      >
        Shortcut
      </text>
      <text
        :x="longNodes[longNodes.length - 1].x + 35"
        :y="longNodes[longNodes.length - 1].y"
        text-anchor="start"
        class="path-label long-label"
      >
        Long-chain
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  shortProgress: {
    type: Array,
    default: () => [0, 0, 0]
  },
  longProgress: {
    type: Array,
    default: () => [0, 0, 0, 0, 0, 0, 0]
  },
  shortCompleted: {
    type: Boolean,
    default: false
  },
  longCompleted: {
    type: Boolean,
    default: false
  },
  isExecuting: {
    type: Boolean,
    default: false
  }
})

// SVG 尺寸配置
const width = 700
const height = 180
const pathWidth = 4
const dotRadius = 6

// 关键点位置
const startPoint = { x: 40, y: height / 2 }
const branchPoint = { x: 120, y: height / 2 }

// 短链路参数 (3个节点)
const shortStepCount = 3
const shortPathY = 40 // 上方路径
const shortPathEndX = width - 100

// 长链路参数 (7个节点)
const longStepCount = 7
const longPathY = height - 40 // 下方路径
const longPathEndX = width - 80

// 计算短链路节点位置
const shortNodes = computed(() => {
  const nodes = []
  const segmentLength = (shortPathEndX - branchPoint.x) / shortStepCount

  for (let i = 0; i < shortStepCount; i++) {
    nodes.push({
      x: branchPoint.x + segmentLength * (i + 1),
      y: branchPoint.y + (shortPathY - branchPoint.y) * ((i + 1) / shortStepCount)
    })
  }

  return nodes
})

// 计算长链路节点位置
const longNodes = computed(() => {
  const nodes = []
  const segmentLength = (longPathEndX - branchPoint.x) / longStepCount

  for (let i = 0; i < longStepCount; i++) {
    nodes.push({
      x: branchPoint.x + segmentLength * (i + 1),
      y: branchPoint.y + (longPathY - branchPoint.y) * ((i + 1) / longStepCount)
    })
  }

  return nodes
})

// 计算短链路线段
const shortSegments = computed(() => {
  const segments = []

  // 起点到第一个节点
  segments.push({
    start: startPoint,
    end: shortNodes.value[0]
  })

  // 节点之间的连线
  for (let i = 0; i < shortNodes.value.length - 1; i++) {
    segments.push({
      start: shortNodes.value[i],
      end: shortNodes.value[i + 1]
    })
  }

  return segments
})

// 计算长链路线段
const longSegments = computed(() => {
  const segments = []

  // 起点到第一个节点
  segments.push({
    start: startPoint,
    end: longNodes.value[0]
  })

  // 节点之间的连线
  for (let i = 0; i < longNodes.value.length - 1; i++) {
    segments.push({
      start: longNodes.value[i],
      end: longNodes.value[i + 1]
    })
  }

  return segments
})

// 获取短链路节点颜色
const getShortNodeColor = (index) => {
  const progress = props.shortProgress[index] || 0
  if (progress >= 100) {
    return '#10b981' // 完成 - 绿色
  } else if (progress > 0) {
    return '#3b82f6' // 执行中 - 蓝色
  } else {
    return '#475569' // 未开始 - 灰色
  }
}

// 获取长链路节点颜色
const getLongNodeColor = (index) => {
  const progress = props.longProgress[index] || 0
  if (progress >= 100) {
    return '#f59e0b' // 完成 - 橙色
  } else if (progress > 0) {
    return '#3b82f6' // 执行中 - 蓝色
  } else {
    return '#475569' // 未开始 - 灰色
  }
}

// 获取短链路节点样式类
const getShortNodeClass = (index) => {
  const progress = props.shortProgress[index] || 0
  return {
    'completed': progress >= 100,
    'active': progress > 0 && progress < 100,
    'inactive': progress === 0
  }
}

// 获取长链路节点样式类
const getLongNodeClass = (index) => {
  const progress = props.longProgress[index] || 0
  return {
    'completed': progress >= 100,
    'active': progress > 0 && progress < 100,
    'inactive': progress === 0
  }
}
</script>

<style scoped>
.dual-path-progress {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  background: var(--result-bg);
  border-radius: 8px;
  margin-bottom: 12px;
}

.progress-svg {
  max-width: 100%;
  height: auto;
}

.progress-line {
  transition: all 0.3s ease;
}

.progress-line.pulsing {
  animation: linePulse 1.5s ease-in-out infinite;
}

@keyframes linePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.start-dot {
  filter: drop-shadow(0 0 4px #3b82f6);
  transition: all 0.3s ease;
}

.step-node {
  transition: all 0.3s ease;
}

.step-node.inactive {
  opacity: 0.5;
}

.step-node.active {
  filter: drop-shadow(0 0 4px #3b82f6);
  animation: nodePulse 1.5s ease-in-out infinite;
}

.step-node.completed {
  filter: drop-shadow(0 0 4px currentColor);
}

@keyframes nodePulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 4px #3b82f6);
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 6px #3b82f6);
  }
}

.node-label {
  font-size: 11px;
  font-weight: 600;
  transition: fill 0.3s ease;
}

.node-label.short-label {
  fill: var(--app-text-primary);
}

.node-label.long-label {
  fill: var(--app-text-primary);
}

.path-label {
  font-size: 12px;
  font-weight: 700;
  transition: fill 0.3s ease;
}

.path-label.short-label {
  fill: #10b981;
}

.path-label.long-label {
  fill: #f59e0b;
}
</style>

