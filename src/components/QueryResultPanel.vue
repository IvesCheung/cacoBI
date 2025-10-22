<template>
  <div class="query-result-panel">
    <div class="result-header">
      <h3>查询结果</h3>
      <el-button text @click="copyResults" v-if="hasResults">
        <el-icon><DocumentCopy /></el-icon>
        复制结果
      </el-button>
    </div>

    <div class="result-content" v-if="hasResults">
      <!-- 输出分析结果 -->
      <div class="result-section">
        <h4>输出分析结果</h4>
        <div class="result-box">
          <div v-if="results.analysis" class="analysis-text">
            {{ results.analysis }}
          </div>
          <el-empty v-else description="暂无分析结果" :image-size="80" />
        </div>
      </div>

      <!-- 分析结果图表 -->
      <div class="result-section" v-if="results.chart">
        <h4>输出分析结果</h4>
        <div class="chart-container" ref="chartRef"></div>
      </div>
    </div>

    <el-empty
      v-else
      description="执行查询后将显示结果"
      :image-size="120"
      class="empty-state"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const props = defineProps({
  results: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref(null)
let chartInstance = null

const hasResults = computed(() => {
  return props.results && (props.results.analysis || props.results.chart || props.results.data)
})

const copyResults = () => {
  const text = JSON.stringify(props.results, null, 2)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('结果已复制到剪贴板')
  })
}

const initChart = () => {
  if (!chartRef.value || !props.results.chart) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, 'dark')

  // 示例饼图配置
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '输出分析结果',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0A0E1A',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.results.chart || [
          { value: 45, name: '分类A' },
          { value: 17, name: '分类B' },
          { value: 15, name: '分类C' },
          { value: 13, name: '分类D' },
          { value: 10, name: '分类E' }
        ]
      }
    ]
  }

  chartInstance.setOption(option)
}

watch(() => props.results.chart, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

onMounted(() => {
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped>
.query-result-panel {
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-height: 300px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.result-header h3 {
  font-size: 20px;
  font-weight: 500;
  color: #2563EB;
  margin: 0;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #8AD1FF;
  margin: 0 0 12px 0;
}

.result-box {
  background: rgba(15, 27, 46, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 16px;
  min-height: 100px;
}

.analysis-text {
  color: #fff;
  line-height: 1.8;
  font-size: 14px;
}

.chart-container {
  width: 100%;
  height: 350px;
  background: rgba(15, 27, 46, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 16px;
}

.empty-state {
  padding: 60px 0;
}

:deep(.el-empty__description) {
  color: #8a9db5;
}

:deep(.el-button) {
  color: #8AD1FF;
}

:deep(.el-button:hover) {
  color: #2563EB;
}
</style>
