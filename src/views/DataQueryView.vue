<template>
  <div class="data-query-view">
    <!-- 左侧: 链路流程 -->
    <div class="left-panel">
      <ChainFlow
        :optimized-time="optimizedTime"
        :traditional-time="traditionalTime"
        @step-click="handleStepClick"
      />
    </div>

    <!-- 右侧: 配置面板 -->
    <div class="right-panel">
      <!-- 标题 -->
      <div class="panel-header">
        <h1>BI取数</h1>
      </div>

      <!-- 短链路配置 -->
      <div class="config-section" ref="shortConfigRef">
        <h3 class="section-title">短链路配置</h3>
        <ShortChainConfig v-model="shortChainConfig" />
      </div>

      <!-- 数据查询输入 -->
      <div class="query-section">
        <h3 class="section-title">数据查询</h3>
        <el-input
          v-model="queryText"
          type="textarea"
          :rows="3"
          placeholder="包含本体系统的个人分享次数的TOP3，还按年份分组，还把年份分组的总和也列出来, 这些数据中 实际开始时间 在 2021-06-19 到 2029-07-30 之间"
          class="query-textarea"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          @click="handleQuery"
          :loading="querying"
          class="query-button"
        >
          <el-icon><Search /></el-icon>
          执行查询
        </el-button>
        <el-switch
          v-model="useCostAgent"
          active-text="开启Cost Agent"
          size="large"
          class="cost-switch"
        />
      </div>

      <!-- 查询结果展示 -->
      <div class="result-section" v-if="queryResults">
        <QueryResultPanel :results="queryResults" />
      </div>

      <!-- 长链路配置 -->
      <div class="config-section" ref="longConfigRef">
        <h3 class="section-title">长链路配置</h3>
        <LongChainConfig v-model="longChainConfig" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import ChainFlow from '@/components/ChainFlow.vue'
import ShortChainConfig from '@/components/config/ShortChainConfig.vue'
import LongChainConfig from '@/components/config/LongChainConfig.vue'
import QueryResultPanel from '@/components/QueryResultPanel.vue'
import {
  DEFAULT_SHORT_CHAIN_CONFIG,
  DEFAULT_LONG_CHAIN_CONFIG,
  EXAMPLE_QUERIES,
} from '@/constants/config'
import { useChainStore } from '@/composables/useChainStore'

const queryText = ref(EXAMPLE_QUERIES[0])
const useCostAgent = ref(false)
const querying = ref(false)
const optimizedTime = ref(0)
const traditionalTime = ref(0)
const queryResults = ref(null)

const shortConfigRef = ref(null)
const longConfigRef = ref(null)

const shortChainConfig = reactive({ ...DEFAULT_SHORT_CHAIN_CONFIG })
const longChainConfig = reactive({ ...DEFAULT_LONG_CHAIN_CONFIG })

const chainStore = useChainStore()


const handleQuery = async () => {
  if (!queryText.value.trim()) {
    ElMessage.warning('请输入查询内容')
    return
  }

  querying.value = true
  queryResults.value = null
  const startTime = Date.now()

  try {
    // 使用链路模拟：并行执行两个链路步骤动画
    // 并行模拟两个链路的步骤执行
    await chainStore.runBoth(250, 350)
    optimizedTime.value = chainStore.state.optimizedTime
    traditionalTime.value = chainStore.state.traditionalTime

    const endTime = Date.now()
    const totalExecutionTime = ((endTime - startTime) / 1000).toFixed(2)

    // 模拟查询结果
    queryResults.value = {
      analysis: '包含本体系统的个人分享次数的TOP3，按年份分组统计如下：\n\n2021年：总计 156 次分享\n  - 用户A：67次\n  - 用户B：52次\n  - 用户C：37次\n\n2022年：总计 243 次分享\n  - 用户D：89次\n  - 用户E：84次\n  - 用户F：70次\n\n总计：399次分享',
      chart: [
        { value: 45, name: '2021年' },
        { value: 17, name: '2022年' },
        { value: 15, name: '2023年' },
        { value: 13, name: '2024年' },
        { value: 10, name: '2025年' }
      ]
    }

    ElMessage.success(`查询成功，总耗时 ${totalExecutionTime}s`)

    console.log('查询配置:', {
      query: queryText.value,
      useCostAgent: useCostAgent.value,
      shortChain: shortChainConfig,
      longChain: longChainConfig,
      optimizedTime: optimizedTime.value,
      traditionalTime: traditionalTime.value
    })
  } catch (error) {
    ElMessage.error('查询失败: ' + error.message)
  } finally {
    querying.value = false
  }
}

function handleStepClick({ chain, step }) {
  // 滚动到对应配置区块
  if (chain === 'short' && shortConfigRef.value) {
    shortConfigRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else if (chain === 'long' && longConfigRef.value) {
    longConfigRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  // 控制台辅助日志
  console.log(`[链路点击] ${chain} -> step(${step.id}): ${step.name}`)
}
</script>

<style scoped>
.data-query-view {
  display: flex;
  height: 100vh;
  background: #0A0E1A;
  color: #fff;
  overflow: hidden;
}

/* 左侧面板 - 链路流程 */
.left-panel {
  flex: 0 0 40%;
  max-width: 600px;
  min-width: 400px;
  padding: 24px;
  overflow-y: auto;
  background: #0A0E1A;
  border-right: 1px solid rgba(59, 130, 246, 0.2);
}

.left-panel::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 3px;
}

/* 右侧面板 - 配置 */
.right-panel {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  background: #0F1522;
}

.right-panel::-webkit-scrollbar {
  width: 6px;
}

.right-panel::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 3px;
}

.panel-header {
  text-align: right;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.panel-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #2563EB;
  margin: 0;
}

.config-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #2563EB;
  margin-bottom: 16px;
}

.query-section {
  margin-bottom: 24px;
}

.query-textarea :deep(.el-textarea__inner) {
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
}

.query-textarea :deep(.el-textarea__inner::placeholder) {
  color: rgba(192, 192, 192, 0.5);
}

.query-textarea :deep(.el-textarea__inner:focus) {
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.action-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.query-button {
  background: #2563EB;
  border: none;
  padding: 12px 32px;
  font-size: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}

.query-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.cost-switch {
  --el-switch-on-color: #2563EB;
}

.result-section {
  margin-bottom: 32px;
}

@media (max-width: 1200px) {
  .data-query-view {
    flex-direction: column;
  }

  .left-panel {
    flex: 0 0 auto;
    max-width: none;
    min-width: 0;
    max-height: 400px;
    border-right: none;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  }

  .right-panel {
    flex: 1;
  }
}
</style>
