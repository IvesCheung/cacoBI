<template>
  <div class="chain-flow-chart">
    <div ref="chartRef" class="chart-container"></div>

    <!-- 详情面板 -->
    <transition name="slide-fade">
      <div v-if="selectedNode" class="detail-panel" :style="detailPanelStyle">
        <div class="detail-header">
          <span class="detail-title">{{ selectedNode.title }}</span>
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

    console.log('Container size:', containerWidth, 'x', containerHeight)
    console.log('Steps count:', stepCount)

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

      return {
        name: step.title,
        id: String(step.id),
        x: startX + index * spacing,
        y: centerY,
        symbolSize: 50,
        itemStyle: {
          color: status === 'completed' ? props.color :
                 status === 'active' ? '#3b82f6' : '#475569',
          borderColor: status === 'completed' ? props.color :
                       status === 'active' ? '#60a5fa' : '#64748b',
          borderWidth: 3,
          shadowBlur: status === 'completed' || status === 'active' ? 15 : 5,
          shadowColor: status === 'completed' ? props.color :
                       status === 'active' ? '#3b82f6' : '#1e293b'
        },
        label: {
          show: true,
          position: 'bottom',
          distance: 12,
          fontSize: 11,
          color: status === 'inactive' ? '#64748b' : '#e2e8f0',
          fontWeight: status === 'completed' || status === 'active' ? 'bold' : 'normal',
          formatter: (params) => {
            const maxLen = 10
            if (params.name.length > maxLen) {
              return params.name.slice(0, maxLen) + '...'
            }
            return params.name
          }
        },
        emphasis: {
          disabled: false,
          scale: 1.15,
          itemStyle: {
            borderWidth: 4
          }
        },
        data: step
      }
    })

    const links = []
    for (let i = 0; i < props.steps.length - 1; i++) {
      const currentStep = props.steps[i]
      const nextStep = props.steps[i + 1]

      links.push({
        source: String(currentStep.id),
        target: String(nextStep.id),
        lineStyle: {
          color: currentStep.completed ? props.color : '#475569',
          width: 3,
          curveness: 0,
          opacity: currentStep.completed ? 0.8 : 0.3
        },
        emphasis: {
          lineStyle: {
            width: 4
          }
        }
      })
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        show: false
      },
      animationDuration: 600,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: null,
          symbolSize: 50,
          roam: false,
          label: {
            show: true,
            lineHeight: 16
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 8],
          data: nodes,
          links: links,
          lineStyle: {
            opacity: 0.9,
            curveness: 0
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4
            }
          }
        }
      ]
    }

    console.log('Setting chart option with', nodes.length, 'nodes and', links.length, 'links')
    chartInstance.setOption(option, true)

    // 添加点击事件
    chartInstance.off('click')
    chartInstance.on('click', (params) => {
      if (params.dataType === 'node' && params.data.data) {
        showDetail(params.data.data, params.event.offsetX, params.event.offsetY)
      }
    })

    console.log('Chart updated successfully')
  } catch (error) {
    console.error('Error updating chart:', error)
  }
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

// 关闭详情面板
const closeDetail = () => {
  selectedNode.value = null
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
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 220px;
}

.detail-panel {
  position: absolute;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px;
  min-width: 280px;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #334155;
}

.detail-title {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.close-icon {
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s;
}

.close-icon:hover {
  color: #e2e8f0;
}

.detail-content {
  max-height: 300px;
  overflow-y: auto;
}

.detail-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 10px;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.5;
  padding: 6px;
  background: rgba(51, 65, 85, 0.3);
  border-radius: 4px;
}

.item-icon {
  color: #3b82f6;
  margin-top: 2px;
  flex-shrink: 0;
}

.sub-steps-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-step-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: rgba(51, 65, 85, 0.3);
  border-radius: 4px;
  transition: all 0.3s;
}

.sub-step-item:hover {
  background: rgba(51, 65, 85, 0.5);
}

.sub-icon {
  color: #64748b;
  margin-top: 2px;
  flex-shrink: 0;
  transition: color 0.3s;
}

.sub-icon.completed {
  color: #10b981;
}

.sub-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #475569;
  display: inline-block;
  margin-top: 2px;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.3);
}

.sub-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-title {
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
}

.sub-detail {
  color: #94a3b8;
  font-size: 11px;
}

/* 动画效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 滚动条样式 */
.detail-content::-webkit-scrollbar {
  width: 4px;
}

.detail-content::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
