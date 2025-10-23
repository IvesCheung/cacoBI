<template>
  <div class="chain-flow-chart">
    <div ref="chartRef" class="chart-container"></div>

    <!-- 详情面板 -->
    <transition name="slide-fade">
      <div v-if="selectedNode" class="detail-panel" :class="{ 'locked': isLocked }" :style="detailPanelStyle">
        <div class="detail-header">
          <span class="detail-title">
            {{ selectedNode.title }}
            <span v-if="isLocked" class="lock-badge">🔒</span>
          </span>
          <el-icon class="close-icon" @click="closeDetail">
            <Close />
          </el-icon>
        </div>
        <div class="detail-content">
          <div v-if="selectedNode.time" class="detail-time">
            <el-icon><Clock /></el-icon>
            <span>{{ selectedNode.time }}</span>
          </div>
          <div v-if="selectedNode.details" class="detail-items">
            <div v-for="(detail, index) in selectedNode.details" :key="index" class="detail-item">
              <el-icon class="item-icon"><Document /></el-icon>
              <span>{{ detail }}</span>
            </div>
          </div>
          <div v-if="selectedNode.subSteps" class="sub-steps-list">
            <div v-for="subStep in selectedNode.subSteps" :key="subStep.id" class="sub-step-item">
              <el-icon :class="['sub-icon', { completed: subStep.completed }]" v-if="subStep.completed || subStep.active">
                <Check v-if="subStep.completed" />
                <Loading v-else-if="subStep.active" />
              </el-icon>
              <span v-else class="sub-dot" />
              <div class="sub-content">
                <span class="sub-title">{{ subStep.title }}</span>
                <span class="sub-detail">{{ subStep.detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Close, Clock, Document, Check, Loading } from '@element-plus/icons-vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#10b981'
  }
})

const chartRef = ref(null)
let chartInstance = null
const selectedNode = ref(null)
const detailPanelStyle = ref({})
const isLocked = ref(false) // 是否锁定显示（点击后锁定）
const hoveredNode = ref(null) // 当前悬停的节点

// 创建流程图
const createChart = () => {
  if (!chartRef.value) {
    console.error('Chart container not found')
    return
  }

  try {
    if (chartInstance) {
      chartInstance.dispose()
    }

    chartInstance = echarts.init(chartRef.value)
    console.log('Chart instance created:', chartInstance)
    updateChart()
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) {
    console.error('Chart instance not initialized')
    return
  }

  try {
    // 获取容器宽度来计算节点间距
    const containerWidth = chartRef.value?.clientWidth || 800
    const containerHeight = chartRef.value?.clientHeight || 220
    const stepCount = props.steps.length

    if (stepCount === 0) {
      console.warn('No steps to display')
      return
    }

    // 计算节点位置
    const spacing = Math.min(200, (containerWidth - 100) / Math.max(stepCount - 1, 1))
    const startX = stepCount === 1 ? containerWidth / 2 : 50
    const centerY = containerHeight / 2

    const nodes = props.steps.map((step, index) => {
      const status = step.completed ? 'completed' : step.active ? 'active' : 'inactive'

      // 为不同状态定义渐变色 - 调整为更柔和的色调
      let gradientColor
      if (status === 'completed') {
        gradientColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: adjustColorBrightness(props.color, -30) },
          { offset: 1, color: adjustColorBrightness(props.color, -15) }
        ])
      } else if (status === 'active') {
        gradientColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#2563eb' },
          { offset: 1, color: '#3b82f6' }
        ])
      } else {
        gradientColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#3f4b5e' },
          { offset: 1, color: '#2d3748' }
        ])
      }

      return {
        name: step.title,
        id: String(step.id),
        x: startX + index * spacing,
        y: centerY,
        symbolSize: status === 'active' ? [140, 70] : [130, 65],
        symbol: 'roundRect',
        itemStyle: {
          color: gradientColor,
          borderColor: status === 'completed' ? adjustColorBrightness(props.color, -20) :
                       status === 'active' ? '#4f7adb' : '#52606e',
          borderWidth: status === 'active' ? 3 : 2,
          borderRadius: 12,
          shadowBlur: status === 'completed' ? 15 : status === 'active' ? 18 : 6,
          shadowColor: status === 'completed' ? 'rgba(16, 185, 129, 0.3)' :
                       status === 'active' ? 'rgba(37, 99, 235, 0.4)' : 'rgba(0, 0, 0, 0.25)',
          shadowOffsetX: 0,
          shadowOffsetY: status === 'completed' || status === 'active' ? 2 : 0
        },
        label: {
          show: true,
          position: 'inside',
          fontSize: 13,
          color: status === 'inactive' ? '#94a3b8' : '#e8f0fe',
          fontWeight: status === 'completed' || status === 'active' ? '600' : 'normal',
          fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
          lineHeight: 18,
          width: 110,
          overflow: 'truncate',
          ellipsis: '...',
          formatter: (params) => {
            // 自动换行处理
            const maxLen = 12
            const text = params.name
            if (text.length <= maxLen) {
              return text
            }
            // 超过长度则尝试分两行
            const half = Math.ceil(text.length / 2)
            return text.slice(0, half) + '\n' + text.slice(half)
          }
        },
        emphasis: {
          disabled: false,
          scale: 1.15,
          itemStyle: {
            borderWidth: 4,
            shadowBlur: 20
          },
          label: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: step
      }
    })

    const links = []
    for (let i = 0; i < props.steps.length - 1; i++) {
      const currentStep = props.steps[i]
      const nextStep = props.steps[i + 1]
      const isCompleted = currentStep.completed

      // 连接线渐变色 - 调整为更柔和的色调
      const lineColor = isCompleted
        ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: adjustColorBrightness(props.color, -25) },
            { offset: 1, color: nextStep.completed ? adjustColorBrightness(props.color, -25) : adjustColorBrightness(props.color, -40) }
          ])
        : '#3f4b5e'

      links.push({
        source: String(currentStep.id),
        target: String(nextStep.id),
        lineStyle: {
          color: lineColor,
          width: isCompleted ? 3 : 2,
          curveness: 0,
          opacity: isCompleted ? 0.85 : 0.3,
          shadowBlur: isCompleted ? 6 : 0,
          shadowColor: isCompleted ? 'rgba(16, 185, 129, 0.25)' : 'transparent'
        },
        emphasis: {
          lineStyle: {
            width: isCompleted ? 5 : 3,
            opacity: 1
          }
        }
      })
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        show: false
      },
      animationDuration: 800,
      animationEasing: 'elasticOut',
      animationEasingUpdate: 'cubicInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: null,
          symbolSize: 50,
          roam: false,
          label: {
            show: true,
            lineHeight: 18
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 10],
          data: nodes,
          links: links,
          lineStyle: {
            opacity: 0.9,
            curveness: 0
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 5
            }
          }
        }
      ]
    }

    chartInstance.setOption(option, true)

    // 移除旧的事件监听
    chartInstance.off('click')
    chartInstance.off('mousemove')
    chartInstance.off('mouseout')

    // 添加鼠标悬停事件
    chartInstance.on('mousemove', (params) => {
      if (params.dataType === 'node' && params.data.data) {
        const step = params.data.data
        // 只有已完成或进行中的节点才显示详情
        if (step.completed || step.active) {
          hoveredNode.value = step
          // 如果没有锁定，显示悬停的节点详情
          if (!isLocked.value) {
            showDetail(step, params.event.offsetX, params.event.offsetY)
          }
        }
      }
    })

    // 添加鼠标移出事件
    chartInstance.on('mouseout', (params) => {
      if (params.dataType === 'node') {
        hoveredNode.value = null
        // 如果没有锁定，隐藏详情
        if (!isLocked.value) {
          selectedNode.value = null
        }
      }
    })

    // 添加点击事件（锁定/解锁）
    chartInstance.on('click', (params) => {
      if (params.dataType === 'node' && params.data.data) {
        const step = params.data.data
        if (step.completed || step.active) {
          // 如果点击的是已经锁定显示的节点，则解锁并隐藏
          if (isLocked.value && selectedNode.value === step) {
            isLocked.value = false
            selectedNode.value = null
          } else {
            // 否则锁定并显示该节点
            isLocked.value = true
            showDetail(step, params.event.offsetX, params.event.offsetY)
          }
        }
      }
    })
  } catch (error) {
    console.error('Error updating chart:', error)
  }
}

// 调整颜色亮度的辅助函数
const adjustColorBrightness = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1)
}

// 显示详情面板
const showDetail = (step, x, y) => {
  if (!step.completed && !step.active) return

  selectedNode.value = step

  // 计算详情面板位置
  const chartRect = chartRef.value.getBoundingClientRect()
  const panelWidth = 300
  const panelHeight = 200

  let left = x + 20
  let top = y - 50

  // 防止超出右边界
  if (left + panelWidth > chartRect.width) {
    left = x - panelWidth - 20
  }

  // 防止超出上边界
  if (top < 0) {
    top = 10
  }

  // 防止超出下边界
  if (top + panelHeight > chartRect.height) {
    top = chartRect.height - panelHeight - 10
  }

  detailPanelStyle.value = {
    left: `${left}px`,
    top: `${top}px`
  }
}

// 关闭详情面板（点击关闭按钮时）
const closeDetail = () => {
  selectedNode.value = null
  isLocked.value = false
}

// 监听步骤变化
watch(() => props.steps, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

onMounted(() => {
  createChart()

  // 响应式调整
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
      updateChart()
    }
  })
})
</script>

<style scoped>
.chain-flow-chart {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 220px;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.1) 0%, rgba(15, 23, 42, 0.2) 100%);
  border-radius: 8px;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 220px;
}

/* 为活跃节点添加脉冲动画 - 在图表外层容器上实现 */
@keyframes pulse {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
  }
}

/* 美化详情面板 */
.detail-panel {
  position: absolute;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 16px;
  min-width: 300px;
  max-width: 420px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1000;
  backdrop-filter: blur(20px);
  animation: slideIn 0.3s ease-out;
  cursor: default;
}

/* 锁定状态的面板样式 */
.detail-panel.locked {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(99, 102, 241, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(99, 102, 241, 0.2);
}

.detail-title {
  color: #f1f5f9;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.lock-badge {
  font-size: 12px;
  opacity: 0.8;
  animation: lockPulse 2s ease-in-out infinite;
}

@keyframes lockPulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.close-icon {
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  padding: 4px;
  border-radius: 6px;
}

.close-icon:hover {
  color: #f1f5f9;
  background: rgba(148, 163, 184, 0.1);
  transform: rotate(90deg);
}

.detail-content {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 4px;
}

.detail-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a5b4fc;
  font-size: 13px;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.detail-time .el-icon {
  font-size: 16px;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.6;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, #3b82f6 0%, #6366f1 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-item:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateX(2px);
}

.detail-item:hover::before {
  opacity: 1;
}

.item-icon {
  color: #60a5fa;
  margin-top: 2px;
  flex-shrink: 0;
  font-size: 16px;
}

.sub-steps-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub-step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%);
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.sub-step-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 1px;
  background: linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.2) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sub-step-item:hover {
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%);
  border-color: rgba(100, 116, 139, 0.5);
  transform: translateX(4px);
}

.sub-step-item:hover::after {
  opacity: 1;
}

.sub-icon {
  color: #64748b;
  margin-top: 2px;
  flex-shrink: 0;
  font-size: 16px;
  transition: all 0.3s ease;
}

.sub-icon.completed {
  color: #10b981;
  animation: checkBounce 0.5s ease;
}

@keyframes checkBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.sub-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  display: inline-block;
  margin-top: 2px;
  flex-shrink: 0;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(100, 116, 139, 0.3);
}

.sub-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-title {
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
}

.sub-detail {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

/* 动画效果增强 */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px) scale(0.9);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px) scale(0.95);
  opacity: 0;
}

/* 美化滚动条 */
.detail-content::-webkit-scrollbar {
  width: 6px;
}

.detail-content::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
  margin: 4px 0;
}

.detail-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6366f1 0%, #3b82f6 100%);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #818cf8 0%, #60a5fa 100%);
}
</style>
