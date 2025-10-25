<template>
  <div class="result-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { name: '青岛', value: 335 },
      { name: '杭州', value: 234 },
      { name: '天津', value: 154 },
      { name: '上海', value: 135 },
      { name: '北京', value: 548 }
    ]
  }
})

const chartRef = ref(null)
let chartInstance = null

// 获取当前主题文字颜色
const getTextColor = () => {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? '#e2e8f0' : '#1e293b'
}

// 获取图例颜色
const getLegendColor = () => {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? '#cbd5e1' : '#475569'
}

const initChart = () => {
  if (!chartRef.value) return

  // 销毁已存在的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 初始化 echarts 实例
  chartInstance = echarts.init(chartRef.value)

  const textColor = getTextColor()
  const legendColor = getLegendColor()

  // 配置项
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 12px;'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      textStyle: {
        color: legendColor,
        fontSize: 13,
        fontWeight: 500
      }
    },
    series: [
      {
        name: '数据分布',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 3,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 13,
          fontWeight: 'bold',
          color: textColor,
          lineHeight: 18
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            scale: true,
            scaleSize: 10
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          smooth: true,
          lineStyle: {
            width: 2
          }
        },
        data: props.data,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 100,
        color: [
          {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#4ade80' },
              { offset: 1, color: '#10b981' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#fbbf24' },
              { offset: 1, color: '#f59e0b' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#60a5fa' },
              { offset: 1, color: '#3b82f6' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#f87171' },
              { offset: 1, color: '#ef4444' }
            ]
          },
          {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#a78bfa' },
              { offset: 1, color: '#8b5cf6' }
            ]
          }
        ]
      }
    ]
  }

  // 设置配置项
  chartInstance.setOption(option)

  // 自动轮播高亮效果
  let currentIndex = -1
  const autoHighlight = () => {
    // 取消之前的高亮
    chartInstance.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: currentIndex
    })

    // 高亮当前
    currentIndex = (currentIndex + 1) % props.data.length
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndex
    })
  }

  // 每3秒轮播一次
  const highlightTimer = setInterval(autoHighlight, 3000)

  // 保存定时器引用，便于清理
  chartInstance._highlightTimer = highlightTimer
}

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听数据变化
watch(() => props.data, () => {
  initChart()
}, { deep: true })

// 监听主题变化
const observeThemeChange = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // 主题改变时重新初始化图表
        initChart()
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

let themeObserver = null

onMounted(() => {
  console.log('🎨 ResultChart 组件已挂载 - 新版本 ECharts')
  initChart()
  window.addEventListener('resize', handleResize)
  themeObserver = observeThemeChange()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    if (chartInstance._highlightTimer) {
      clearInterval(chartInstance._highlightTimer)
    }
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
  if (themeObserver) {
    themeObserver.disconnect()
  }
})
</script>

<style scoped>
.result-chart {
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 280px;
  min-height: 250px;
}
</style>

