<template>
  <div class="result-chart">
    <div class="chart-header">
      <span class="chart-type-badge">{{ chartTypeName }}</span>
      <button @click="switchChartType" class="switch-btn" title="切换图表类型">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      </button>
    </div>
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
      { name: '北京', value: 548 },
      { name: '其它', value: 123 }
    ]
  }
})

// 图表类型列表
const chartTypes = ['pie', 'bar', 'line', 'radar', 'funnel']
const chartTypeNames = {
  pie: '饼状图',
  bar: '柱状图',
  line: '折线图',
  radar: '雷达图',
  funnel: '漏斗图'
}

const currentChartType = ref('pie')
const chartTypeName = ref('饼状图')

// 切换图表类型
const switchChartType = () => {
  const currentIndex = chartTypes.indexOf(currentChartType.value)
  const nextIndex = (currentIndex + 1) % chartTypes.length
  currentChartType.value = chartTypes[nextIndex]
  chartTypeName.value = chartTypeNames[currentChartType.value]
  initChart()
}

// 随机选择初始图表类型
const randomChartType = () => {
  const randomIndex = Math.floor(Math.random() * chartTypes.length)
  currentChartType.value = chartTypes[randomIndex]
  chartTypeName.value = chartTypeNames[currentChartType.value]
}

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

// 获取渐变色数组
const getGradientColors = () => [
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
  },
  {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: '#ec4899' },
      { offset: 1, color: '#db2777' }
    ]
  }
]

// 获取饼状图配置
const getPieOption = (textColor, legendColor) => ({
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
  series: [{
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
    color: getGradientColors()
  }]
})

// 获取柱状图配置
const getBarOption = (textColor, legendColor) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
      fontSize: 14
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 12px;'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLabel: {
      color: textColor,
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: legendColor
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: textColor,
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: legendColor
      }
    },
    splitLine: {
      lineStyle: {
        color: legendColor,
        opacity: 0.2
      }
    }
  },
  series: [{
    name: '数值',
    type: 'bar',
    data: props.data.map(item => item.value),
    itemStyle: {
      borderRadius: [8, 8, 0, 0],
      color: (params) => {
        const colors = getGradientColors()
        return colors[params.dataIndex % colors.length]
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    },
    animationDelay: (idx) => idx * 100
  }]
})

// 获取折线图配置
const getLineOption = (textColor, legendColor) => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
      fontSize: 14
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 12px;'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLabel: {
      color: textColor,
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: legendColor
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: textColor,
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: legendColor
      }
    },
    splitLine: {
      lineStyle: {
        color: legendColor,
        opacity: 0.2
      }
    }
  },
  series: [{
    name: '数值',
    type: 'line',
    data: props.data.map(item => item.value),
    smooth: true,
    lineStyle: {
      width: 3,
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 1, y2: 0,
        colorStops: [
          { offset: 0, color: '#4ade80' },
          { offset: 0.5, color: '#60a5fa' },
          { offset: 1, color: '#a78bfa' }
        ]
      }
    },
    itemStyle: {
      color: '#fff',
      borderColor: '#4ade80',
      borderWidth: 3
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(74, 222, 128, 0.5)' },
          { offset: 1, color: 'rgba(74, 222, 128, 0.05)' }
        ]
      }
    },
    emphasis: {
      itemStyle: {
        color: '#4ade80',
        borderColor: '#fff',
        borderWidth: 3,
        shadowBlur: 20,
        shadowColor: 'rgba(74, 222, 128, 0.5)'
      }
    },
    animationDelay: (idx) => idx * 100
  }]
})

// 获取雷达图配置
const getRadarOption = (textColor, legendColor) => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
      fontSize: 14
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 12px;'
  },
  radar: {
    indicator: props.data.map(item => ({
      name: item.name,
      max: Math.max(...props.data.map(d => d.value)) * 1.2
    })),
    shape: 'polygon',
    center: ['50%', '50%'],
    radius: '65%',
    splitNumber: 4,
    name: {
      textStyle: {
        color: textColor,
        fontSize: 13,
        fontWeight: 500
      }
    },
    splitLine: {
      lineStyle: {
        color: legendColor,
        opacity: 0.3
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(114, 172, 209, 0.05)', 'rgba(114, 172, 209, 0.1)']
      }
    },
    axisLine: {
      lineStyle: {
        color: legendColor,
        opacity: 0.5
      }
    }
  },
  series: [{
    name: '数据分布',
    type: 'radar',
    data: [{
      value: props.data.map(item => item.value),
      name: '数据分布',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(96, 165, 250, 0.6)' },
            { offset: 1, color: 'rgba(96, 165, 250, 0.1)' }
          ]
        }
      },
      lineStyle: {
        width: 3,
        color: '#60a5fa'
      },
      itemStyle: {
        color: '#60a5fa',
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        areaStyle: {
          color: 'rgba(96, 165, 250, 0.8)'
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(96, 165, 250, 0.5)'
        }
      }
    }],
    animationDelay: (idx) => idx * 100
  }]
})

// 获取漏斗图配置
const getFunnelOption = (textColor, legendColor) => ({
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
  series: [{
    name: '数据分布',
    type: 'funnel',
    left: '10%',
    top: '5%',
    bottom: '15%',
    width: '80%',
    min: 0,
    max: Math.max(...props.data.map(d => d.value)),
    minSize: '0%',
    maxSize: '100%',
    sort: 'descending',
    gap: 2,
    label: {
      show: true,
      position: 'inside',
      formatter: '{b}: {c}',
      fontSize: 13,
      fontWeight: 'bold',
      color: '#fff'
    },
    labelLine: {
      length: 10,
      lineStyle: {
        width: 1,
        type: 'solid'
      }
    },
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 2
    },
    emphasis: {
      label: {
        fontSize: 15
      },
      itemStyle: {
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    },
    data: [...props.data].sort((a, b) => b.value - a.value),
    color: getGradientColors(),
    animationDelay: (idx) => idx * 100
  }]
})

const initChart = () => {
  if (!chartRef.value) return

  // 销毁已存在的实例
  if (chartInstance) {
    if (chartInstance._highlightTimer) {
      clearInterval(chartInstance._highlightTimer)
    }
    chartInstance.dispose()
  }

  // 初始化 echarts 实例
  chartInstance = echarts.init(chartRef.value)

  const textColor = getTextColor()
  const legendColor = getLegendColor()

  // 根据图表类型获取配置
  let option
  switch (currentChartType.value) {
    case 'bar':
      option = getBarOption(textColor, legendColor)
      break
    case 'line':
      option = getLineOption(textColor, legendColor)
      break
    case 'radar':
      option = getRadarOption(textColor, legendColor)
      break
    case 'funnel':
      option = getFunnelOption(textColor, legendColor)
      break
    case 'pie':
    default:
      option = getPieOption(textColor, legendColor)
      break
  }

  // 设置配置项
  chartInstance.setOption(option)

  // 仅对饼状图和漏斗图添加自动轮播高亮效果
  if (currentChartType.value === 'pie' || currentChartType.value === 'funnel') {
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
  console.log('🎨 ResultChart 组件已挂载 - 多图表类型支持')
  // 随机选择初始图表类型
  randomChartType()
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
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(96, 165, 250, 0.1));
  border-bottom: 1px solid rgba(100, 116, 139, 0.1);
}

.chart-type-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  padding: 4px 12px;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 12px;
  display: inline-block;
  transition: all 0.3s ease;
}

.switch-btn {
  padding: 6px;
  background: rgba(96, 165, 250, 0.2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.switch-btn:hover {
  background: rgba(96, 165, 250, 0.35);
  transform: rotate(90deg);
}

.switch-btn:active {
  transform: rotate(90deg) scale(0.95);
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 250px;
}
</style>

