<template>
  <div class="data-query-view">
    <div class="query-header">
      <h1>BI取数</h1>
      <div class="header-actions">
        <el-button
          type="primary"
          size="large"
          @click="handleQuery"
          :loading="querying"
        >
          <el-icon><Search /></el-icon>
          执行查询
        </el-button>
        <el-switch
          v-model="useCostAgent"
          active-text="开启Cost Agent"
          inactive-text="关闭"
          size="large"
        />
      </div>
    </div>

    <div class="query-content">
      <!-- 数据查询输入框 -->
      <div class="query-input-section">
        <div class="input-label">数据查询</div>
        <el-input
          v-model="queryText"
          type="textarea"
          :rows="4"
          placeholder="包含本体系统的个人分享次数的TOP3，还按年份分组，还把年份分组的总和也列出来, 这些数据中 实际开始时间 在 2021-06-19 到 2029-07-30 之间"
          class="query-textarea"
        />
      </div>

      <!-- 配置区域 -->
      <div class="config-section">
        <div class="config-panel short-chain">
          <ShortChainConfig v-model="shortChainConfig" />
        </div>

        <div class="config-panel long-chain">
          <LongChainConfig v-model="longChainConfig" />
        </div>
      </div>

      <!-- 执行时间显示 -->
      <div class="execution-time" v-if="executionTime">
        <el-icon><Clock /></el-icon>
        <span>验证耗时: {{ executionTime }} 秒</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Clock } from '@element-plus/icons-vue'
import ShortChainConfig from '@/components/config/ShortChainConfig.vue'
import LongChainConfig from '@/components/config/LongChainConfig.vue'
import {
  DEFAULT_SHORT_CHAIN_CONFIG,
  DEFAULT_LONG_CHAIN_CONFIG,
  EXAMPLE_QUERIES
} from '@/constants/config'

const queryText = ref(EXAMPLE_QUERIES[0])
const useCostAgent = ref(false)
const querying = ref(false)
const executionTime = ref(0)

const shortChainConfig = reactive({ ...DEFAULT_SHORT_CHAIN_CONFIG })
const longChainConfig = reactive({ ...DEFAULT_LONG_CHAIN_CONFIG })

const handleQuery = async () => {
  if (!queryText.value.trim()) {
    ElMessage.warning('请输入查询内容')
    return
  }

  querying.value = true
  const startTime = Date.now()

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    const endTime = Date.now()
    executionTime.value = ((endTime - startTime) / 1000).toFixed(2)

    ElMessage.success('查询成功')

    console.log('查询配置:', {
      query: queryText.value,
      useCostAgent: useCostAgent.value,
      shortChain: shortChainConfig,
      longChain: longChainConfig
    })
  } catch (error) {
    ElMessage.error('查询失败: ' + error.message)
  } finally {
    querying.value = false
  }
}
</script>

<style scoped>
.data-query-view {
  min-height: 100vh;
  background: #0A0E1A;
  padding: 32px;
  color: #fff;
}

.query-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.query-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #2563EB;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.query-content {
  max-width: 1400px;
  margin: 0 auto;
}

.query-input-section {
  margin-bottom: 32px;
}

.input-label {
  font-size: 16px;
  color: #C0C0C0;
  margin-bottom: 12px;
  font-weight: 500;
}

.query-textarea {
  font-size: 14px;
}

.query-textarea :deep(.el-textarea__inner) {
  background: linear-gradient(180deg, #1E3A5F 0%, #0F1B2E 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
}

.query-textarea :deep(.el-textarea__inner:focus) {
  border-color: #2563EB;
}

.config-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.config-panel {
  min-height: 500px;
}

.execution-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #BABABA;
  padding: 12px 20px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(37, 99, 235, 0.3);
  width: fit-content;
}

.execution-time .el-icon {
  font-size: 16px;
}

@media (max-width: 1200px) {
  .config-section {
    grid-template-columns: 1fr;
  }
}
</style>
