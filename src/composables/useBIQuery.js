import { ref, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { LOG_MESSAGES, LOG_TYPES } from '@/constants/logMessages'

export function useBIQuery() {
  // 执行状态
  const isExecuting = ref(false)
  const costAgentEnabled = ref(false)

  // 链路时间
  const shortChainTime = ref(0)
  const longChainTime = ref(0)
  // Token消耗统计
  const shortChainTokens = ref(0)
  const longChainTokens = ref(0)
  // LLM调用次数
  const shortLLMCalls = ref(0)
  const longLLMCalls = ref(0)
  // 链路完成状态
  const shortCompleted = ref(false)
  const longCompleted = ref(false)

  // Cost Agent 跳过的步骤信息
  const skippedStepsInfo = ref([])

  // 查询输入
  const queryText = ref("Apple's sales in 2025")
  const queryResult = ref([
    { name: 'Macbook', value: 3335 },
    { name: 'Airpods', value: 2304 },
    { name: 'iPhone', value: 5896 },
    { name: 'iWatch', value: 1935 },
    { name: 'iPad', value: 2685 },
    { name: 'Others', value: 1078 },
  ])

  // 短链路配置
  const shortChainConfig = reactive({
    encoder: 'Entity-agnostic Qwen3-0.6B',
    topK: 5,
    similarity: 70,
    dslModel: 'Qwen2.5-instruct-72B',
  })

  // 长链路配置
  const longChainConfig = reactive({
    questionModel: 'Qwen3-32B',
    tableTopK: 105,
    tableRerankModel: 'Deepseek-v3',
    columnTopK: 35,
    metricModel: 'Deepseek-v3',
    dimensionModel: 'Deepseek-v3',
    filterModel: 'Deepseek-v3',
  })

  // 短链路步骤
  const shortSteps = reactive([
    {
      id: 1,
      title: 'Embed User Query',
      type: 'compute',
      time: '',
      active: false,
      completed: false,
      details: [`Use ${shortChainConfig.encoder} to embed the user query`],
      tokens: 0,
      duration: 0.5,
    },
    {
      id: 2,
      title: 'Retrieve Historical Related Queries',
      type: 'compute',
      time: '',
      active: false,
      completed: false,
      details: ["1. Huawei's sales in 2024", '2. Mac Pro sales in 2025'],
      tokens: 0,
      duration: 0.13,
    },
    {
      id: 3,
      title: 'Generate DSL',
      type: 'llm',
      time: '',
      active: false,
      completed: false,
      details: [
        'Table: mobile_table',
        'dimension: []',
        'measure: {"field":"Apple", "aggregation":"sum"}',
        'filter: {"field":"time","type":"in", "condition":"2025"}',
      ],
      tokens: 1280,
      duration: 1.54,
    },
  ])

  // 长链路步骤 - 新的复杂流程结构
  const longSteps = ref({
    // 阶段1: 配置解析 (并行执行)
    stage1: {
      title: 'Query Parsing',
      parallel: true,
      steps: [
        {
          id: 'subject-recognition',
          title: 'Subject Recognition',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['Entity: Apple;2025', 'Field: time', 'Jargon: sales'],
          tokens: 650,
          duration: 2.5,
        },
        {
          id: 'query-rewrite',
          title: 'Query Rewrite',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['User wants to query sales data for [Apple] products, in [2025]'],
          tokens: 750,
          duration: 2.7,
        },
        {
          id: 'query-clarify',
          title: 'Query Clarification',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['No need to clarify the query'],
          tokens: 850,
          duration: 2.9,
        },
      ],
    },
    // 阶段2: 召回 (并行执行)
    stage2: {
      title: 'Table Retrieval',
      parallel: true,
      steps: [
        {
          id: 'main-table-recall',
          title: 'By Entity',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['mobile_table', 'laptop_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
        {
          id: 'field-table-recall',
          title: 'By Field',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['mobile_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
        {
          id: 'business-table-recall',
          title: 'By Jargon',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['mobile_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
      ],
    },
    // 阶段3: 选表
    stage3: {
      title: 'Table Selection',
      parallel: false,
      steps: [
        {
          id: 'table-selection',
          title: 'Table(N→1)',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['mobile_table'],
          tokens: 1850,
          duration: 3.0,
        },
      ],
    },
    // 阶段4: 单表知识召回
    stage4: {
      title: 'In-Table Knowledge Retrieval',
      parallel: true,
      steps: [
        {
          id: 'segment-recall',
          title: 'Field',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['Retrieved fields:', 'Apple;time;'],
          tokens: 0,
          duration: 0.1,
        },
        {
          id: 'business-term',
          title: 'Jargon',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: [
            'Retrieved jargons:',
            '1. Anonymized product sale volume without hot search terms',
            '2. Anonymized number of community sale users',
            '3. Anonymized product sale volume',
          ],
          tokens: 0,
          duration: 0.1,
        },
        {
          id: 'table-rule',
          title: 'Table Rule',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: [
            'Retrieved table rules:',
            '"Applicable": Select this table when the parsing subject of the input is "sales term".',
            '"Applicable": It is used to query sale trends, sale index, and other information for specific user groups or categories"',
          ],
          tokens: 0,
          duration: 0.1,
        },
        {
          id: 'dimension-value-recall',
          title: 'Dimension Value',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['Retrieved dimension values:', '2025;2025 year;2025Y;2015;2015Y'],
          tokens: 0,
          duration: 0.1,
        },
      ],
    },
    // 阶段5: Rerank (并行执行)
    stage5: {
      title: 'Retrieval Rerank',
      parallel: true,
      steps: [
        {
          id: 'segment-rerank',
          title: 'Field Rerank',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['Top-1 field after reranking: "time"'],
          tokens: 980,
          duration: 2.8,
        },
        {
          id: 'dimension-rerank',
          title: 'Dimension Rerank',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['Top-1 dimension value after reranking: "2025"'],
          tokens: 1100,
          duration: 3.1,
        },
      ],
    },
    // 阶段6: 配置解析 (并行执行)
    stage6: {
      title: 'DSL Configuring',
      parallel: true,
      steps: [
        {
          id: 'metric-parse',
          title: 'Measure',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['measure: {"field":"Apple", "aggregation":"sum"}'],
          tokens: 1200,
          duration: 3.2,
        },
        {
          id: 'dimension-parse',
          title: 'Dimension',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['dimension: []'],
          tokens: 1380,
          duration: 3.45,
        },
        {
          id: 'filter-parse',
          title: 'Filter',
          type: 'llm',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: ['filter: {"field":"time","type":"in", "condition":"2025"}'],
          tokens: 1560,
          duration: 3.7,
        },
      ],
    },
    // 阶段7: DSL转换
    stage7: {
      title: 'Generate DSL',
      parallel: false,
      steps: [
        {
          id: 'dsl-transform',
          title: 'Generate DSL',
          type: 'compute',
          time: '',
          active: false,
          completed: false,
          skipped: false,
          details: [
            'Table: mobile_table',
            'dimension: []',
            'measure: {"field":"Apple", "aggregation":"sum"}',
            'filter: {"field":"time","type":"in", "condition":"2025"}',
          ],
          tokens: 0,
          duration: 0.1,
        },
      ],
    },
  })

  // 进度状态
  const shortProgress = reactive([0, 0, 0])
  // 长链路进度 (7个进度条，对应7个阶段)
  const longProgress = reactive([0, 0, 0, 0, 0, 0, 0])

  // 获取当前时间字符串 (HH:MM:SS)
  const getCurrentTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // 显示日志通知的辅助函数
  const showLogNotification = (message, logType = LOG_TYPES.REGULAR) => {
    const currentTime = getCurrentTime()

    // 根据日志类型配置通知样式
    const notificationConfig = {
      title: currentTime,
      message: message,
      position: 'top-right',
      duration: 2000,
      offset: 50,
    }

    // 根据日志类型设置不同的样式
    if (logType === LOG_TYPES.REGULAR) {
      ElNotification({
        ...notificationConfig,
        type: 'info',
        customClass: 'regular-log-notification',
      })
    } else if (logType === LOG_TYPES.COST_AGENT) {
      ElNotification({
        ...notificationConfig,
        duration: 4000,
        type: 'success',
        customClass: 'cost-agent-log-notification',
      })
    } else if (logType === LOG_TYPES.SUCCESS) {
      ElNotification({
        ...notificationConfig,
        type: 'success',
      })
    } else if (logType === LOG_TYPES.ERROR) {
      ElNotification({
        ...notificationConfig,
        type: 'error',
      })
    }
  }

  // 选择要跳过的步骤（Cost Agent功能）
  const selectRandomStepsToSkip = () => {
    // 可跳过的阶段：stage1-stage6（不包括最后一个stage7）
    const skippableStages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6']

    // 随机选择跳过1-2个步骤
    // const numToSkip = Math.random() < 0.5 ? 1 : 2
    // 固定跳过三个
    const numToSkip = 3
    const skipped = []
    const skippedInfo = []

    for (let i = 0; i < numToSkip; i++) {
      // 随机选择一个阶段
      const randomStageIndex = Math.floor(Math.random() * skippableStages.length)
      const stageName = skippableStages[randomStageIndex]
      const stage = longSteps.value[stageName]

      if (stage && stage.steps.length > 0) {
        // 随机选择该阶段中的一个步骤
        const randomStepIndex = Math.floor(Math.random() * stage.steps.length)
        const step = stage.steps[randomStepIndex]
        const stepId = step.id

        // 避免重复
        if (!skipped.includes(stepId)) {
          skipped.push(stepId)
          skippedInfo.push({
            id: stepId,
            title: step.title,
            stage: stage.title,
          })
        }
      }
    }

    // 保存跳过步骤的详细信息
    skippedStepsInfo.value = skippedInfo
    return skipped
  }

  // 重置所有状态
  const resetAll = () => {
    isExecuting.value = false
    shortCompleted.value = false
    longCompleted.value = false
    shortChainTime.value = 0
    longChainTime.value = 0
    shortChainTokens.value = 0
    longChainTokens.value = 0
    shortLLMCalls.value = 0
    longLLMCalls.value = 0
    skippedStepsInfo.value = []

    // 重置短链路步骤
    shortSteps.forEach((step) => {
      step.active = false
      step.completed = false
      step.time = ''
    })

    // 重置长链路步骤 - 遍历所有阶段
    Object.keys(longSteps.value).forEach((stageKey) => {
      const stage = longSteps.value[stageKey]
      stage.steps.forEach((step) => {
        step.active = false
        step.completed = false
        step.skipped = false
        step.time = ''
      })
    })

    // 重置进度
    shortProgress.fill(0)
    longProgress.fill(0)
  }

  // 执行查询
  const executeQuery = () => {
    return new Promise((resolve) => {
      isExecuting.value = true
      resetAll()
      isExecuting.value = true

      // 显示常规日志通知
      showLogNotification(LOG_MESSAGES.RETRIEVING_DATA, LOG_TYPES.REGULAR)

      setTimeout(() => {
        showLogNotification(LOG_MESSAGES.ANALYZING_DATA, LOG_TYPES.REGULAR)
      }, 500)

      // 如果启用了 Cost Agent，显示相关通知
      if (costAgentEnabled.value) {
        setTimeout(() => {
          showLogNotification(LOG_MESSAGES.COST_PLANER_ANALYZING, LOG_TYPES.COST_AGENT)
        }, 700)
        setTimeout(() => {
          showLogNotification(
            LOG_MESSAGES.COST_PLANER_SKIPPED(skippedStepsInfo.value),
            LOG_TYPES.COST_AGENT,
          )
        }, 1000)
      }

      // 模拟链路执行
      simulateShortChain()
      simulateLongChain()

      // 等待所有链路完成
      const checkInterval = setInterval(() => {
        if (shortCompleted.value && longCompleted.value) {
          clearInterval(checkInterval)
          isExecuting.value = false
          // 显示完成通知
          showLogNotification(LOG_MESSAGES.EXECUTION_COMPLETED, LOG_TYPES.SUCCESS)

          resolve()
        }
      }, 100)
    })
  }

  // 清除执行日志（在完成状态下切换选项时使用）
  const clearLogs = () => {
    if (!isExecuting.value) {
      shortCompleted.value = false
      longCompleted.value = false
      skippedStepsInfo.value = []
    }
  }

  // 模拟短链路执行
  const simulateShortChain = () => {
    let timer = setInterval(() => {
      shortChainTime.value += 0.01
    }, 10)

    // 步骤1 - 向量化用户问题
    setTimeout(() => {
      shortSteps[0].time = getCurrentTime()
      shortSteps[0].active = true
    }, 0)
    animateProgress(shortProgress, 0, shortSteps[0].duration * 1000, () => {
      shortSteps[0].active = false
      shortSteps[0].completed = true
      shortChainTokens.value += shortSteps[0].tokens
    })

    // 步骤2 - 检索历史相关问题
    setTimeout(() => {
      shortSteps[1].time = getCurrentTime()
      shortSteps[1].active = true
      animateProgress(shortProgress, 1, shortSteps[1].duration * 1000, () => {
        shortSteps[1].active = false
        shortSteps[1].completed = true
        shortChainTokens.value += shortSteps[1].tokens
      })
    }, shortSteps[0].duration * 1000)

    // 步骤3 - 生成DSL
    setTimeout(
      () => {
        shortSteps[2].time = getCurrentTime()
        shortSteps[2].active = true
        animateProgress(shortProgress, 2, shortSteps[2].duration * 1000, () => {
          shortSteps[2].active = false
          shortSteps[2].completed = true
          shortChainTokens.value += shortSteps[2].tokens
          clearInterval(timer)
          shortChainTime.value =
            shortSteps[0].duration + shortSteps[1].duration + shortSteps[2].duration
          shortCompleted.value = true
          shortLLMCalls.value += 1
        })
      },
      (shortSteps[0].duration + shortSteps[1].duration) * 1000,
    )
  }

  // 模拟长链路执行
  const simulateLongChain = () => {
    console.log('开始执行长链路')

    let timer = setInterval(() => {
      longChainTime.value += 0.01
    }, 10)

    // 如果启用Cost Agent，增加200ms前摇，并随机选择1-2个步骤跳过
    let accumulatedTime = costAgentEnabled.value ? 700 : 500 // 初始延迟
    const skippedSteps = costAgentEnabled.value ? selectRandomStepsToSkip() : []

    console.log('Cost Agent enabled:', costAgentEnabled.value)
    console.log('Skipped steps:', skippedSteps)

    // 获取所有阶段
    const stageKeys = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7']
    const isLastStage = (index) => index === stageKeys.length - 1

    // 循环执行每个阶段
    stageKeys.forEach((stageKey, stageIndex) => {
      setTimeout(() => {
        const stage = longSteps.value[stageKey]
        const stageSteps = stage.steps
        console.log(`阶段${stageIndex + 1}开始: ${stage.title}`)

        // 检查该阶段所有步骤是否都被跳过
        const allSkipped = stageSteps.every((step) => skippedSteps.includes(step.id))

        // 计算阶段最长执行时间
        const maxDuration = allSkipped ? 100 : Math.max(...stageSteps.map((s) => s.duration)) * 1000

        // 开始阶段进度动画
        animateProgress(longProgress, stageIndex, maxDuration, () => {
          console.log(`阶段${stageIndex + 1}进度完成`)
        })

        // 执行该阶段的所有步骤
        stageSteps.forEach((step, stepIdx) => {
          console.log(`阶段${stageIndex + 1}-步骤${stepIdx} 开始执行:`, step.id)

          // 检查是否被跳过
          if (skippedSteps.includes(step.id)) {
            console.log(`阶段${stageIndex + 1}-步骤${stepIdx} 被跳过:`, step.id)
            step.skipped = true
            return
          }

          step.time = getCurrentTime()
          step.active = true

          setTimeout(() => {
            console.log(`阶段${stageIndex + 1}-步骤${stepIdx} 完成:`, step.id)
            step.active = false
            step.completed = true
            longChainTokens.value += step.tokens
            // 只有 LLM 类型的节点才增加调用次数
            if (step.type === 'llm') {
              longLLMCalls.value += 1
            }

            // 如果是最后一个阶段的最后一个步骤，完成长链路
            if (isLastStage(stageIndex) && stepIdx === stageSteps.length - 1) {
              clearInterval(timer)
              longChainTime.value = parseFloat((accumulatedTime / 1000).toFixed(2))
              longCompleted.value = true
              console.log('长链路执行完成')
            }
          }, step.duration * 1000)
        })
      }, accumulatedTime)

      // 累加该阶段的时间
      const stageSteps = longSteps.value[stageKey].steps
      const allSkipped = stageSteps.every((step) => skippedSteps.includes(step.id))
      accumulatedTime += allSkipped ? 100 : Math.max(...stageSteps.map((s) => s.duration)) * 1000
    })
  }

  // 动画进度条
  const animateProgress = (progressArray, index, duration, onComplete) => {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      progressArray[index] = progress * 100

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }
    requestAnimationFrame(animate)
  }

  return {
    // 状态
    isExecuting,
    costAgentEnabled,
    shortChainTime,
    longChainTime,
    shortCompleted,
    longCompleted,
    queryText,
    queryResult,
    shortChainTokens,
    longChainTokens,
    shortLLMCalls,
    longLLMCalls,
    skippedStepsInfo,

    // 配置
    shortChainConfig,
    longChainConfig,

    // 步骤
    shortSteps,
    longSteps,

    // 进度
    shortProgress,
    longProgress,

    // 方法
    executeQuery,
    resetAll,
    clearLogs,
  }
}
