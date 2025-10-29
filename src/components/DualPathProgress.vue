<template>
  <div class="dual-path-progress" ref="containerRef">
    <svg :width="width" :height="height" class="progress-svg">
      <!-- 定义渐变色和滤镜 -->
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

        <!-- 光晕滤镜 -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 短链路背景路径 -->
      <path
        :d="shortPathD"
        stroke="url(#bgGradient)"
        :stroke-width="pathWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        class="bg-path"
      />

      <!-- 长链路背景路径 -->
      <path
        :d="longPathD"
        stroke="url(#bgGradient)"
        :stroke-width="pathWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        class="bg-path"
      />

      <!-- 短链路进度路径 -->
      <g v-for="(segment, idx) in shortSegments" :key="`short-progress-${idx}`">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.start.x + (segment.end.x - segment.start.x) * (props.shortProgress[idx] / 100)"
          :y2="segment.start.y + (segment.end.y - segment.start.y+0.1) * (props.shortProgress[idx] / 100)"
          stroke="url(#shortGradient)"
          :stroke-width="pathWidth + 1"
          stroke-linecap="round"
          class="progress-line short-progress"
          :class="{ 'pulsing': props.shortProgress[idx] > 0 && props.shortProgress[idx] < 100 }"
        />
      </g>

      <!-- 长链路进度路径 -->
      <g v-for="(segment, idx) in longSegments" :key="`long-progress-${idx}`">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.start.x + (segment.end.x - segment.start.x) * (props.longProgress[idx] / 100)"
          :y2="segment.start.y + (segment.end.y - segment.start.y + 0.1) * (props.longProgress[idx] / 100)"
          stroke="url(#longGradient)"
          :stroke-width="pathWidth + 1"
          stroke-linecap="round"
          class="progress-line long-progress"
          :class="{ 'pulsing': props.longProgress[idx] > 0 && props.longProgress[idx] < 100 }"
        />
      </g>

      <!-- 起点 -->
      <circle
        :cx="startPoint.x"
        :cy="startPoint.y"
        :r="dotRadius + 2"
        fill="#3b82f6"
        class="endpoint-dot"
      />
      <text
        :x="startPoint.x - 20"
        :y="startPoint.y + 4"
        text-anchor="end"
        class="endpoint-label"
      >
        Start
      </text>

      <!-- 短链路节点 -->
      <g v-for="(node, idx) in shortNodes" :key="`short-node-${idx}`">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="idx === shortNodes.length - 1 ? dotRadius + 2 : dotRadius"
          :fill="getShortNodeColor(idx)"
          :class="[getShortNodeClass(idx), idx === shortNodes.length - 1 ? 'endpoint-node' : 'step-node']"
        />
        <text
          v-if="idx !== shortNodes.length - 1"
          :x="node.x"
          :y="node.y - dotRadius - 8"
          text-anchor="middle"
          class="node-label short-label"
        >
          {{ idx + 1 }}
        </text>
        <!-- 最后一个节点的标签显示在上方 -->
        <text
          v-else
          :x="node.x"
          :y="node.y - dotRadius - 10"
          text-anchor="middle"
          class="node-label endpoint-label-number short-label"
        >
          {{ idx + 1 }}
        </text>
      </g>

      <!-- 长链路节点 -->
      <g v-for="(node, idx) in longNodes" :key="`long-node-${idx}`">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="idx === longNodes.length - 1 ? dotRadius + 2 : dotRadius"
          :fill="getLongNodeColor(idx)"
          :class="[getLongNodeClass(idx), idx === longNodes.length - 1 ? 'endpoint-node' : 'step-node']"
        />
        <text
          v-if="idx !== longNodes.length - 1"
          :x="node.x"
          :y="node.y + dotRadius + 18"
          text-anchor="middle"
          class="node-label long-label"
        >
          {{ idx + 1 }}
        </text>
        <!-- 最后一个节点的标签显示在下方 -->
        <text
          v-else
          :x="node.x"
          :y="node.y + dotRadius + 20"
          text-anchor="middle"
          class="node-label endpoint-label-number long-label"
        >
          {{ idx + 1 }}
        </text>
      </g>

      <!-- 终点标签 -->
      <text
        :x="endPoint.x + 20"
        :y="endPoint.y + 4"
        text-anchor="start"
        class="endpoint-label"
      >
        End
      </text>

      <!-- 路径标签 -->
      <text
        :x="width / 2 - 20"
        :y="shortNodes[Math.floor(shortNodes.length / 2)].y - 15"
        text-anchor="middle"
        class="path-label short-label"
      >
        Shortcut
      </text>
      <text
        :x="width / 2 - 20"
        :y="longNodes[Math.floor(longNodes.length / 2)].y + 30"
        text-anchor="middle"
        class="path-label long-label"
      >
        Long-chain
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

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

// 容器引用
const containerRef = ref(null)
const width = ref(750)
const height = ref(160)

// SVG 其他配置
const pathWidth = 4
const dotRadius = 6

// 关键点位置（使用 computed 使其响应式）
const startPoint = computed(() => ({ x: 50, y: height.value / 2 }))
const endPoint = computed(() => ({ x: width.value - 80, y: height.value / 2 }))

// 短链路参数 (3个节点) - 上方路径
const shortStepCount = 3
const shortMaxDeviation = 45 // 最大偏离中心线的距离

// 长链路参数 (7个节点) - 下方路径
const longStepCount = 7
const longMaxDeviation = 45 // 最大偏离中心线的距离

// 计算短链路节点位置（对称分布）
const shortNodes = computed(() => {
  const nodes = []
  const start = startPoint.value
  const end = endPoint.value
  const totalDistance = end.x - start.x

  for (let i = 0; i < shortStepCount; i++) {
    // 均匀分布在 0 到 1 之间，包括终点
    const progress = (i + 1) / (shortStepCount)

    // 水平位置均匀分布
    const x = start.x + totalDistance * progress

    // 使用正弦函数创建平滑的对称椭圆曲线
    // progress * Math.PI 确保从0到π，sin函数正好完成一个完整的上升和下降
    const yOffset = Math.sin(progress * Math.PI) * shortMaxDeviation * -1 // 上方路径

    nodes.push({
      x: x,
      y: start.y + yOffset
    })
  }

  // 最后一个节点精确设置为终点
  nodes[nodes.length - 1] = {
    x: end.x,
    y: end.y
  }

  return nodes
})

// 计算长链路节点位置（对称分布）
const longNodes = computed(() => {
  const nodes = []
  const start = startPoint.value
  const end = endPoint.value
  const totalDistance = end.x - start.x

  for (let i = 0; i < longStepCount; i++) {
    // 均匀分布在 0 到 1 之间，包括终点
    const progress = (i + 1) / (longStepCount)

    // 水平位置均匀分布
    const x = start.x + totalDistance * progress

    // 使用正弦函数创建平滑的对称椭圆曲线
    const yOffset = Math.sin(progress * Math.PI) * longMaxDeviation * 1 // 下方路径

    nodes.push({
      x: x,
      y: start.y + yOffset
    })
  }

  // 最后一个节点精确设置为终点
  nodes[nodes.length - 1] = {
    x: end.x,
    y: end.y
  }

  return nodes
})

// 计算短链路线段
const shortSegments = computed(() => {
  const segments = []

  // 起点到第一个节点
  segments.push({
    start: startPoint.value,
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
    start: startPoint.value,
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

// 生成短链路的SVG路径字符串
const shortPathD = computed(() => {
  const start = startPoint.value
  let path = `M ${start.x} ${start.y}`

  shortNodes.value.forEach(node => {
    path += ` L ${node.x} ${node.y}`
  })

  return path
})

// 生成长链路的SVG路径字符串
const longPathD = computed(() => {
  const start = startPoint.value
  let path = `M ${start.x} ${start.y}`

  longNodes.value.forEach(node => {
    path += ` L ${node.x} ${node.y}`
  })

  return path
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

// 更新容器尺寸
const updateDimensions = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    width.value = rect.width || 750
    // 保持固定高度或根据宽度计算高度
    height.value = 160
  }
}

// 防抖处理
let resizeTimeout = null
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = setTimeout(() => {
    updateDimensions()
  }, 150)
}

// 生命周期钩子
onMounted(() => {
  updateDimensions()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>

<style scoped>
.dual-path-progress {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
  background: var(--result-bg);
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-svg {
  max-width: 100%;
  height: auto;
}

/* 背景路径样式 */
.bg-path {
  transition: all 0.3s ease;
  opacity: 0.6;
}

/* 进度线条样式 */
.progress-line {
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 3px currentColor);
}

.progress-line.pulsing {
  animation: linePulse 1.5s ease-in-out infinite;
}

.short-progress {
  filter: drop-shadow(0 0 4px #10b981);
}

.long-progress {
  filter: drop-shadow(0 0 4px #f59e0b);
}

@keyframes linePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 端点样式 */
.endpoint-dot {
  filter: drop-shadow(0 0 6px currentColor);
  transition: all 0.3s ease;
}

.endpoint-dot.active {
  animation: endpointPulse 2s ease-in-out infinite;
}

.endpoint-dot.completed {
  animation: endpointComplete 0.5s ease-out;
}

@keyframes endpointPulse {
  0%, 100% {
    filter: drop-shadow(0 0 6px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 10px currentColor);
  }
}

@keyframes endpointComplete {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

/* 步骤节点样式 */
.step-node {
  transition: all 0.3s ease;
  cursor: pointer;
}

.step-node.inactive {
  opacity: 0.5;
}

.step-node.active {
  filter: drop-shadow(0 0 5px #3b82f6);
  animation: nodePulse 1.5s ease-in-out infinite;
}

.step-node.completed {
  filter: drop-shadow(0 0 5px currentColor);
}

@keyframes nodePulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px #3b82f6);
  }
  50% {
    filter: drop-shadow(0 0 8px #3b82f6);
  }
}

/* 终点节点样式（节点3和节点7共享同一位置）*/
.endpoint-node {
  transition: all 0.3s ease;
  cursor: pointer;
}

.endpoint-node.inactive {
  opacity: 0.5;
}

.endpoint-node.active {
  filter: drop-shadow(0 0 6px #3b82f6);
  animation: endpointPulse 2s ease-in-out infinite;
}

.endpoint-node.completed {
  filter: drop-shadow(0 0 8px currentColor);
  animation: endpointComplete 0.5s ease-out;
}

/* 标签样式 */
.node-label {
  font-size: 11px;
  font-weight: 600;
  transition: fill 0.3s ease;
  fill: var(--app-text-primary);
  user-select: none;
}

.endpoint-label-number {
  font-size: 12px;
  font-weight: 700;
  transition: fill 0.3s ease;
  fill: var(--app-text-primary);
  user-select: none;
}

.endpoint-label {
  font-size: 12px;
  font-weight: 700;
  fill: var(--app-text-secondary);
  transition: fill 0.3s ease;
  user-select: none;
}

.path-label {
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s ease;
  user-select: none;
  letter-spacing: 0.5px;
}

.path-label.short-label {
  fill: #10b981;
  filter: drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3));
}

.path-label.long-label {
  fill: #f59e0b;
  filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3));
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .dual-path-progress {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
}
</style>

