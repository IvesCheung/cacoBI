<script setup>
import { ref, onMounted, nextTick } from 'vue'
import {
  SuccessFilled,
  WarningFilled,
  MoreFilled,
  CaretRight,
  Cpu,
  Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 数据查询输入
const queryInput = ref('包含流失液成分关键词的笔记IP地址，近30天')

// 优化链路节点
const optimizedNodes = [
  { id: 1, name: '向量化用户问题', status: 'completed' },
  { id: 2, name: '检索向量相关问题', status: 'completed' },
  { id: 3, name: '根据历史生成答案DSL', status: 'completed' }
]

// 传统链路节点
const traditionalNodes = [
  {
    id: 1,
    name: '折解用户问题',
    description: '指标信息：笔记投放，提取；笔记关键词，筛选条件；笔记IP地址，筛选条件；时间范围：近30天；属性类型：汇总。字段：; 笔记关键词时间，创建时间',
    status: 'active'
  },
  {
    id: 2,
    name: '召回相关表',
    description: '[笔记指标介绍, 趋势查询ID, 热门查询, 笔记操作者表, ...]\n共50张表',
    status: 'active'
  },
  {
    id: 3,
    name: '重排过滤表',
    status: 'active'
  },
  {
    id: 4,
    name: '召回表内相关字段',
    description: '[笔记作者username, 笔记作者id, 笔记作者昵称这里面, 笔记作者IP地址, ...]\n共30列',
    status: 'active'
  },
  {
    id: 5,
    name: '生成DSL',
    children: [
      { id: 51, name: '描标配置', description: '//', status: 'active' },
      { id: 52, name: '维度配置', description: '[笔记id, 笔记作者username, 笔记作者IP地址]', status: 'active' },
      { id: 53, name: '筛选条件配置', description: '[笔记分类>笔记流失, 笔记创建时间>近30天]', status: 'active' }
    ],
    status: 'active'
  }
]

// 执行查询状态
const isQuerying = ref(false)
const useCostAgent = ref(false)
const queryLogs = ref([
  { time: '10:22:36', text: '正在检索相关数据...', status: 'processing' },
  { time: '10:22:35', text: '正在分析数据并生成报告...', status: 'processing' }
])

// 图表数据
const chartData = ref([
  { value: 45, name: '商品', itemStyle: { color: '#5CB87A' } },
  { value: 17, name: '时尚', itemStyle: { color: '#95D8B0' } },
  { value: 15, name: '美容', itemStyle: { color: '#E8C547' } },
  { value: 13, name: '天然', itemStyle: { color: '#6FA8DC' } },
  { value: 10, name: '其他', itemStyle: { color: '#9FC5E8' } }
])

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (chartRef.value && window.echarts) {
    chartInstance = window.echarts.init(chartRef.value)
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        itemWidth: 12,
        itemHeight: 12
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            fontSize: 14,
            fontWeight: 'bold'
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10
          },
          data: chartData.value
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

// 执行查询
const executeQuery = () => {
  if (!queryInput.value.trim()) {
    ElMessage.warning('请输入查询内容')
    return
  }

  isQuerying.value = true
  queryLogs.value = []

  // 模拟查询过程
  setTimeout(() => {
    queryLogs.value.push({
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      text: '正在检索相关数据...',
      status: 'processing'
    })
  }, 300)

  setTimeout(() => {
    queryLogs.value.push({
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      text: '正在分析数据并生成报告...',
      status: 'processing'
    })
  }, 1500)

  setTimeout(() => {
    queryLogs.value.push({
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      text: '输出分析结果',
      status: 'success'
    })
    isQuerying.value = false

    // 初始化图表
    nextTick(() => {
      initChart()
    })
  }, 3000)
}

// 加载 ECharts
onMounted(() => {
  // 动态加载 ECharts
  if (!window.echarts) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
    script.onload = () => {
      initChart()
    }
    document.head.appendChild(script)
  } else {
    initChart()
  }
})
</script>

<template>
  <div class="bi-container">
    <!-- 左侧链路面板 -->
    <div class="left-panel">
      <!-- 优化链路 -->
      <div class="chain-section">
        <div class="chain-header">
          <el-icon class="success-icon"><SuccessFilled /></el-icon>
          <span class="chain-title">优化链路（短链路）</span>
          <el-tag size="small" type="info" class="chain-count">链路耗时: 0 秒</el-tag>
        </div>
        <div class="chain-timeline">
          <div class="timeline-line"></div>
          <div v-for="node in optimizedNodes" :key="node.id" class="node-item">
            <div class="node-icon">
              <div class="node-dot"></div>
            </div>
            <div class="node-content simple">
              <div class="node-name">{{ node.name }}</div>
              <el-button size="small" text class="node-action">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 传统链路 -->
      <div class="chain-section traditional">
        <div class="chain-header">
          <el-icon class="warning-icon"><WarningFilled /></el-icon>
          <span class="chain-title">传统链路（长链路）</span>
          <el-tag size="small" type="info" class="chain-count">链路耗时: 0 秒</el-tag>
        </div>
        <div class="chain-timeline">
          <div class="timeline-line"></div>
          <div v-for="node in traditionalNodes" :key="node.id" class="node-item">
            <div class="node-icon">
              <div class="node-dot"></div>
            </div>
            <div class="node-content complex">
              <div class="node-header">
                <div class="node-name">{{ node.name }}</div>
                <el-button size="small" text class="node-action">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
              </div>
              <div v-if="node.description" class="node-description">
                {{ node.description }}
              </div>

              <!-- 子节点 -->
              <div v-if="node.children" class="child-nodes">
                <div v-for="child in node.children" :key="child.id" class="child-node">
                  <el-icon class="child-icon"><Document /></el-icon>
                  <div class="child-content">
                    <div class="child-name">{{ child.name }}</div>
                    <div v-if="child.description" class="child-description">
                      {{ child.description }}
                    </div>
                  </div>
                  <el-button size="small" text class="node-action">
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧主面板 -->
    <div class="right-panel">
      <!-- 顶部标题 -->
      <div class="top-header">
        <h1 class="page-title">BI取数</h1>
      </div>

      <!-- 查询区域 -->
      <div class="query-section">
        <h3 class="section-title">数据查询</h3>
        <el-input
          v-model="queryInput"
          type="textarea"
          :rows="3"
          placeholder="包含流失液成分关键词的笔记IP地址，近30天"
          class="query-input"
        />
        <div class="query-actions">
          <el-button
            type="primary"
            @click="executeQuery"
            :loading="isQuerying"
            class="execute-btn"
          >
            <el-icon v-if="!isQuerying"><CaretRight /></el-icon>
            执行查询
          </el-button>
          <el-checkbox v-model="useCostAgent" class="cost-agent-checkbox">
            <el-icon><Cpu /></el-icon>
            开启Cost Agent
          </el-checkbox>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="query-tip">
        <div class="tip-content">
          包含流失液成分关键词的笔记IP地址，近30天
        </div>
      </div>

      <!-- 查询日志 -->
      <div class="query-logs">
        <div v-for="(log, index) in queryLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-text">{{ log.text }}</span>
        </div>
      </div>

      <!-- 结果展示 -->
      <div class="result-section">
        <h3 class="section-title">输出分析结果</h3>
        <div class="chart-container">
          <div ref="chartRef" class="chart"></div>
        </div>
        <div class="result-time">10:22:55</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.bi-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background: #0a1628;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 左侧面板 */
.left-panel {
  flex: 0 0 55%;
  min-width: 0;
  padding: 20px;
  overflow-y: auto;
  background: #0a1628;
  border-right: 1px solid #1e3a5f;
  box-sizing: border-box;
}

.left-panel::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-thumb {
  background: #2a3f5f;
  border-radius: 3px;
}

.chain-section {
  margin-bottom: 30px;
  background: #152238;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #1e3a5f;
}

.chain-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #1e3a5f;
}

.success-icon {
  color: #52c41a;
  font-size: 20px;
}

.warning-icon {
  color: #faad14;
  font-size: 20px;
}

.chain-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  flex: 1;
}

.chain-count {
  background: #1e3a5f;
  border: none;
  color: #8a9db5;
}

.chain-timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-line {
  position: absolute;
  left: 8px;
  top: 15px;
  bottom: 15px;
  width: 2px;
  background: linear-gradient(to bottom, #1e3a5f 0%, #1e3a5f 100%);
}

.node-item {
  position: relative;
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
}

.node-icon {
  position: relative;
  z-index: 1;
}

.node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1890ff;
  border: 3px solid #152238;
  box-shadow: 0 0 0 2px #1890ff;
}

.node-content {
  flex: 1;
  background: #1a2942;
  border-radius: 8px;
  padding: 12px 15px;
  border: 1px solid #2a3f5f;
}

.node-content.simple {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node-content.complex {
  display: block;
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-name {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.node-action {
  color: #8a9db5;
  padding: 0;
}

.node-description {
  margin-top: 8px;
  font-size: 12px;
  color: #8a9db5;
  line-height: 1.6;
  white-space: pre-line;
}

.child-nodes {
  margin-top: 10px;
  padding-left: 10px;
}

.child-node {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #0f1e32;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #2a3f5f;
}

.child-icon {
  color: #8a9db5;
  font-size: 16px;
  margin-top: 2px;
}

.child-content {
  flex: 1;
}

.child-name {
  font-size: 13px;
  color: #fff;
  margin-bottom: 4px;
}

.child-description {
  font-size: 12px;
  color: #8a9db5;
  line-height: 1.5;
}

/* 右侧面板 */
.right-panel {
  flex: 0 0 45%;
  min-width: 0;
  padding: 20px 30px;
  overflow-y: auto;
  background: #0f1e32;
  box-sizing: border-box;
}

.right-panel::-webkit-scrollbar {
  width: 6px;
}

.right-panel::-webkit-scrollbar-thumb {
  background: #2a3f5f;
  border-radius: 3px;
}

.top-header {
  text-align: right;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #1e3a5f;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 15px;
}

.query-section {
  margin-bottom: 25px;
}

:deep(.query-input .el-textarea__inner) {
  background: #1a2942;
  border: 1px solid #2a3f5f;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
}

:deep(.query-input .el-textarea__inner::placeholder) {
  color: #5a6d85;
}

.query-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.execute-btn {
  background: #1890ff;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.execute-btn:hover {
  background: #40a9ff;
}

.cost-agent-checkbox {
  color: #8a9db5;
}

:deep(.cost-agent-checkbox .el-checkbox__label) {
  color: #8a9db5;
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.cost-agent-checkbox .el-checkbox__inner) {
  background: #1a2942;
  border-color: #2a3f5f;
}

.query-tip {
  background: #1a2942;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #2a3f5f;
}

.tip-content {
  color: #8a9db5;
  font-size: 13px;
  line-height: 1.6;
}

.query-logs {
  margin-bottom: 25px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  color: #8a9db5;
}

.log-time {
  color: #5a6d85;
  min-width: 60px;
}

.log-text {
  color: #8a9db5;
}

.result-section {
  background: #1a2942;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #2a3f5f;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 10px;
}

.chart {
  width: 100%;
  height: 300px;
}

.result-time {
  color: #5a6d85;
  font-size: 12px;
  text-align: right;
}
</style>
