import { ref, reactive, computed } from 'vue'
import { LOG_MESSAGES, LOG_TYPES } from '@/constants/logMessages'
import {
  getDefaultQueryExample,
  getQueryExample,
  getSkipSteps,
  getExampleIdByQueryText,
} from '@/data/queryExamples'
import { getCurrentTime, getRandomComputeDuration, addJitter } from '@/utils/utils'
import { addLog, clearLogs as clearLogData } from '@/utils/logger'

export function useBIQuery() {
  // 加载默认查询示例
  const defaultExample = getDefaultQueryExample()

  // 当前选中的查询示例ID
  const currentExampleId = ref(defaultExample.id)
  // 当前示例的 hit_cache 状态
  const hitCache = ref(defaultExample.hit_cache || false)

  // 执行状态
  const isExecuting = ref(false)
  const costAgentEnabled = ref(true)

  // 优化链路的短链路时间和tokens
  const shortOptimizeChainTime = ref(0)
  const shortOptimizeChainTokens = ref(0)
  const shortOptimizeLLMCalls = ref(0)
  const shortOptimizeCompleted = ref(false)

  // 优化链路的长链路时间和tokens (带 cost planner)
  const longOptimizeChainTime = ref(0)
  const longOptimizeChainTokens = ref(0)
  const longOptimizeLLMCalls = ref(0)
  const longOptimizeCompleted = ref(false)

  // 原始长链路时间和tokens (不带 cost planner)
  const longChainTime = ref(0)
  const longChainTokens = ref(0)
  const longLLMCalls = ref(0)
  const longCompleted = ref(false)

  // Cost Agent 跳过的步骤信息
  const skippedStepsInfo = ref([])
  // 被完全跳过的stage索引列表 (用于DualPathProgress)
  const skippedStageIndices = ref([])

  // Query Analyze 节点状态
  const queryAnalyzeStatus = ref('pending') // 'pending', 'running', 'completed'
  const queryAnalyzeTime = ref(getRandomComputeDuration()) // 随机耗时 0.05-0.15s
  const queryAnalyzeCompleted = ref(false)

  // Query Analyze 节点数据
  const analyzeNode = computed(() => ({
    id: 'query-analyze',
    title: 'Query Analyze',
    status: queryAnalyzeStatus.value,
    isLLM: false,
    time: queryAnalyzeTime.value,
    tokens: 0,
    error: null,
    details: [
      'Analyze query complexity',
      'Determine optimal chain path',
      hitCache.value ? '✓ Hit cache - use short chain' : '✗ No cache - use long chain',
    ],
  }))

  // 查询输入
  const queryText = ref(defaultExample.queryText)
  const queryResult = ref(defaultExample.queryResult)

  // 短链路配置
  const shortChainConfig = reactive({
    encoder: 'Entity-agnostic Qwen3-0.6B',
    templateRecallTopK: 2,
    templateSimilarityThreshold: 0.8,
    dslModel: 'Qwen2.5-instruct-72B',
  })

  // 长链路配置
  const longChainConfig = reactive({
    questionModel: 'Qwen3-32B',
    tableTopK: 5,
    tableRerankModel: 'Deepseek-v3',
    columnTopK: 10,
    metricModel: 'Deepseek-v3',
    dimensionModel: 'Deepseek-v3',
    filterModel: 'Deepseek-v3',
  })

  // 初始化短链路步骤模板
  const createShortSteps = (exampleData) => {
    return [
      {
        id: 1,
        title: 'Embed User Query',
        type: 'compute',
        time: '',
        active: false,
        completed: false,
        details: exampleData.step1.details,
        tokens: addJitter(exampleData.step1.tokens),
        duration: getRandomComputeDuration(),
      },
      {
        id: 2,
        title: 'Retrieve Historical Related Queries',
        type: 'compute',
        time: '',
        active: false,
        completed: false,
        details: exampleData.step2.details,
        tokens: addJitter(exampleData.step2.tokens),
        duration: getRandomComputeDuration(),
      },
      {
        id: 3,
        title: 'Generate DSL',
        type: 'llm',
        time: '',
        active: false,
        completed: false,
        details: exampleData.step3.details,
        tokens: addJitter(exampleData.step3.tokens),
        duration: addJitter(exampleData.step3.duration),
      },
    ]
  }

  // 短链路步骤（用于优化链路显示）
  const shortSteps = reactive(createShortSteps(defaultExample.shortSteps))

  // 初始化长链路步骤模板
  const createLongSteps = (exampleData) => {
    return {
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
            details: exampleData.stage1['subject-recognition'].details,
            tokens: addJitter(exampleData.stage1['subject-recognition'].tokens),
            duration: addJitter(exampleData.stage1['subject-recognition'].duration),
          },
          {
            id: 'query-rewrite',
            title: 'Query Rewrite',
            type: 'llm',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage1['query-rewrite'].details,
            tokens: addJitter(exampleData.stage1['query-rewrite'].tokens),
            duration: addJitter(exampleData.stage1['query-rewrite'].duration),
          },
          {
            id: 'query-clarify',
            title: 'Query Clarification',
            type: 'llm',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage1['query-clarify'].details,
            tokens: addJitter(exampleData.stage1['query-clarify'].tokens),
            duration: addJitter(exampleData.stage1['query-clarify'].duration),
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
            details: exampleData.stage2['main-table-recall'].details,
            tokens: addJitter(exampleData.stage2['main-table-recall'].tokens),
            duration: getRandomComputeDuration(),
          },
          {
            id: 'field-table-recall',
            title: 'By Field',
            type: 'compute',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage2['field-table-recall'].details,
            tokens: addJitter(exampleData.stage2['field-table-recall'].tokens),
            duration: getRandomComputeDuration(),
          },
          {
            id: 'business-table-recall',
            title: 'By Jargon',
            type: 'compute',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage2['business-table-recall'].details,
            tokens: addJitter(exampleData.stage2['business-table-recall'].tokens),
            duration: getRandomComputeDuration(),
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
            details: exampleData.stage3['table-selection'].details,
            tokens: addJitter(exampleData.stage3['table-selection'].tokens),
            duration: addJitter(exampleData.stage3['table-selection'].duration),
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
            details: exampleData.stage4['segment-recall'].details,
            tokens: addJitter(exampleData.stage4['segment-recall'].tokens),
            duration: getRandomComputeDuration(),
          },
          {
            id: 'business-term',
            title: 'Jargon',
            type: 'compute',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage4['business-term'].details,
            tokens: addJitter(exampleData.stage4['business-term'].tokens),
            duration: getRandomComputeDuration(),
          },
          {
            id: 'table-rule',
            title: 'Table Rule',
            type: 'compute',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage4['table-rule'].details,
            tokens: addJitter(exampleData.stage4['table-rule'].tokens),
            duration: getRandomComputeDuration(),
          },
          {
            id: 'dimension-value-recall',
            title: 'Dimension Value',
            type: 'compute',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage4['dimension-value-recall'].details,
            tokens: addJitter(exampleData.stage4['dimension-value-recall'].tokens),
            duration: getRandomComputeDuration(),
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
            details: exampleData.stage5['segment-rerank'].details,
            tokens: addJitter(exampleData.stage5['segment-rerank'].tokens),
            duration: addJitter(exampleData.stage5['segment-rerank'].duration),
          },
          {
            id: 'dimension-rerank',
            title: 'Dimension Rerank',
            type: 'llm',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage5['dimension-rerank'].details,
            tokens: addJitter(exampleData.stage5['dimension-rerank'].tokens),
            duration: addJitter(exampleData.stage5['dimension-rerank'].duration),
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
            details: exampleData.stage6['metric-parse'].details,
            tokens: addJitter(exampleData.stage6['metric-parse'].tokens),
            duration: addJitter(exampleData.stage6['metric-parse'].duration),
          },
          {
            id: 'dimension-parse',
            title: 'Dimension',
            type: 'llm',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage6['dimension-parse'].details,
            tokens: addJitter(exampleData.stage6['dimension-parse'].tokens),
            duration: addJitter(exampleData.stage6['dimension-parse'].duration),
          },
          {
            id: 'filter-parse',
            title: 'Filter',
            type: 'llm',
            time: '',
            active: false,
            completed: false,
            skipped: false,
            details: exampleData.stage6['filter-parse'].details,
            tokens: addJitter(exampleData.stage6['filter-parse'].tokens),
            duration: addJitter(exampleData.stage6['filter-parse'].duration),
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
            details: exampleData.stage7['dsl-transform'].details,
            tokens: addJitter(exampleData.stage7['dsl-transform'].tokens),
            duration: getRandomComputeDuration(),
          },
        ],
      },
    }
  }

  // 长链路步骤 - 用于原始长链路面板
  const longSteps = ref(createLongSteps(defaultExample.longSteps))

  // 为优化链路创建独立的长链路步骤副本
  const longOptimizeSteps = ref(
    JSON.parse(JSON.stringify(createLongSteps(defaultExample.longSteps))),
  )

  // 进度数组
  // 优化链路中的短链路进度
  const shortOptimizeProgress = reactive([0, 0, 0])
  // 优化链路中的长链路进度 (带 cost planner)
  const longOptimizeProgress = reactive([0, 0, 0, 0, 0, 0, 0])
  // 原始长链路进度 (不带 cost planner)
  const longProgress = reactive([0, 0, 0, 0, 0, 0, 0])

  // 选择要跳过的步骤（Cost Agent功能）- 从示例配置获取
  const selectStepsToSkip = () => {
    // 从当前示例获取预配置的跳过步骤
    const predefinedSkipSteps = getSkipSteps(currentExampleId.value)

    if (!predefinedSkipSteps || predefinedSkipSteps.length === 0) {
      return []
    }

    const skipped = []
    const skippedInfo = []

    // 遍历预配置的跳过步骤
    predefinedSkipSteps.forEach((stepId) => {
      // 在所有阶段中查找该步骤
      Object.keys(longOptimizeSteps.value).forEach((stageName) => {
        const stage = longOptimizeSteps.value[stageName]
        if (stage && stage.steps) {
          const step = stage.steps.find((s) => s.id === stepId)
          if (step) {
            skipped.push(stepId)
            skippedInfo.push({
              id: stepId,
              title: step.title,
              stage: stage.title,
            })
            // 立即标记步骤为跳过状态
            step.skipped = true
          }
        }
      })
    })

    // 保存跳过步骤的详细信息
    skippedStepsInfo.value = skippedInfo

    // 计算哪些stage被完全跳过
    const skippableStages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6']
    const fullySkippedIndices = []
    skippableStages.forEach((stageName, index) => {
      const stage = longOptimizeSteps.value[stageName]
      if (stage && stage.steps.length > 0) {
        const allSkipped = stage.steps.every((step) => skipped.includes(step.id))
        if (allSkipped) {
          fullySkippedIndices.push(index)
        }
      }
    })
    skippedStageIndices.value = fullySkippedIndices

    return skipped
  }

  // 重置所有状态
  const resetAll = () => {
    isExecuting.value = false

    // 重置优化链路的短链路
    shortOptimizeCompleted.value = false
    shortOptimizeChainTime.value = 0
    shortOptimizeChainTokens.value = 0
    shortOptimizeLLMCalls.value = 0

    // 重置优化链路的长链路
    longOptimizeCompleted.value = false
    longOptimizeChainTime.value = 0
    longOptimizeChainTokens.value = 0
    longOptimizeLLMCalls.value = 0

    // 重置原始长链路
    longCompleted.value = false
    longChainTime.value = 0
    longChainTokens.value = 0
    longLLMCalls.value = 0

    skippedStepsInfo.value = []

    // 重置被跳过的stage索引
    skippedStageIndices.value = []

    // 重置 Query Analyze 状态
    queryAnalyzeStatus.value = 'pending'
    queryAnalyzeCompleted.value = false
    queryAnalyzeTime.value = getRandomComputeDuration() // 重新生成随机耗时

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

    // 重置优化长链路步骤
    Object.keys(longOptimizeSteps.value).forEach((stageKey) => {
      const stage = longOptimizeSteps.value[stageKey]
      stage.steps.forEach((step) => {
        step.active = false
        step.completed = false
        step.skipped = false
        step.time = ''
      })
    })

    // 重置进度
    shortOptimizeProgress.fill(0)
    longOptimizeProgress.fill(0)
    longProgress.fill(0)
  }

  // 模拟 Query Analyze 节点执行
  const simulateQueryAnalyze = () => {
    return new Promise((resolve) => {
      // 开始执行
      setTimeout(() => {
        queryAnalyzeStatus.value = 'running'
      }, 100)

      // 完成执行
      setTimeout(
        () => {
          queryAnalyzeStatus.value = 'completed'
          queryAnalyzeCompleted.value = true
          resolve()
        },
        100 + queryAnalyzeTime.value * 1000,
      )
    })
  }

  // 执行查询
  const executeQuery = () => {
    return new Promise((resolve) => {
      // 执行前：根据 queryText 匹配并加载对应的 example
      const matchedExampleId = getExampleIdByQueryText(queryText.value)
      if (matchedExampleId && matchedExampleId !== currentExampleId.value) {
        loadQueryExample(matchedExampleId)
      }

      isExecuting.value = true
      resetAll()
      isExecuting.value = true

      // 显示常规日志通知
      addLog(LOG_MESSAGES.RETRIEVING_DATA, LOG_TYPES.REGULAR)

      // 如果不命中缓存且启用了Cost Agent,提前选择要跳过的步骤
      let skippedSteps = []
      if (!hitCache.value && costAgentEnabled.value) {
        skippedSteps = selectStepsToSkip()
      }

      // 首先执行 Query Analyze 步骤
      simulateQueryAnalyze().then(() => {
        addLog(LOG_MESSAGES.ANALYZING_DATA, LOG_TYPES.REGULAR)

        // 如果启用了 Cost Agent，显示相关通知
        if (costAgentEnabled.value && !hitCache.value) {
          setTimeout(() => {
            addLog(LOG_MESSAGES.COST_PLANER_ANALYZING, LOG_TYPES.COST_AGENT)
          }, 200)
          setTimeout(() => {
            addLog(LOG_MESSAGES.COST_PLANER_SKIPPED(skippedStepsInfo.value), LOG_TYPES.COST_AGENT)
          }, 500)
        }

        // 根据 hit_cache 决定执行哪条优化链路
        if (hitCache.value) {
          // 执行优化短链路
          simulateShortOptimizeChain()
        } else {
          // 执行优化长链路 (带 cost planner) - 传递已选择的跳过步骤
          simulateLongOptimizeChain(skippedSteps)
        }

        // 始终执行原始长链路
        simulateLongChain()
      })

      const checkOptimizedInterval = setInterval(() => {
        const optimizeCompleted = hitCache.value
          ? shortOptimizeCompleted.value
          : longOptimizeCompleted.value
        if (optimizeCompleted) {
          clearInterval(checkOptimizedInterval)
          isExecuting.value = false
          // 显示完成通知
          addLog(
            hitCache.value
              ? 'ChronosBI: Shortcut execution completed'
              : 'ChronosBI: Long-chain(cost planner) execution completed',
            LOG_TYPES.SUCCESS,
          )
          resolve()
        }
      }, 100)

      // 等待链路完成
      const checkAllCompletedInterval = setInterval(() => {
        // const optimizeCompleted = hitCache.value
        //   ? shortOptimizeCompleted.value
        //   : longOptimizeCompleted.value
        if (longCompleted.value) {
          clearInterval(checkAllCompletedInterval)
          // isExecuting.value = false
          // 显示完成通知
          addLog('Long-chain(Baseline) execution completed', LOG_TYPES.SUCCESS)
          resolve()
        }
      }, 100)
    })
  }

  // 清除执行日志（在完成状态下切换选项时使用）
  const clearLogs = () => {
    if (!isExecuting.value) {
      shortOptimizeCompleted.value = false
      longOptimizeCompleted.value = false
      longCompleted.value = false
      skippedStepsInfo.value = []
      // 清除日志面板的数据
      clearLogData()
    }
  }

  // 加载指定的查询示例
  const loadQueryExample = (exampleId) => {
    // 如果正在执行，不允许切换
    if (isExecuting.value) {
      return false
    }

    const example = getQueryExample(exampleId)
    if (!example) {
      console.error('查询示例未找到:', exampleId)
      return false
    }

    // 重置所有状态
    resetAll()

    // 更新当前示例ID和hit_cache状态
    currentExampleId.value = exampleId
    hitCache.value = example.hit_cache || false

    // 更新查询文本和结果
    queryText.value = example.queryText
    queryResult.value = example.queryResult

    // 更新短链路步骤
    const newShortSteps = createShortSteps(example.shortSteps)
    shortSteps.splice(0, shortSteps.length, ...newShortSteps)

    // 更新长链路步骤
    longSteps.value = createLongSteps(example.longSteps)
    longOptimizeSteps.value = JSON.parse(JSON.stringify(createLongSteps(example.longSteps)))

    return true
  }

  // 模拟优化短链路执行
  const simulateShortOptimizeChain = () => {
    let timer = setInterval(() => {
      shortOptimizeChainTime.value += 0.01
    }, 10)

    // 步骤1 - 向量化用户问题
    setTimeout(() => {
      shortSteps[0].time = getCurrentTime()
      shortSteps[0].active = true
    }, 0)
    animateProgress(shortOptimizeProgress, 0, shortSteps[0].duration * 1000, () => {
      shortSteps[0].active = false
      shortSteps[0].completed = true
      shortOptimizeChainTokens.value += shortSteps[0].tokens
    })

    // 步骤2 - 检索历史相关问题
    setTimeout(() => {
      shortSteps[1].time = getCurrentTime()
      shortSteps[1].active = true
      animateProgress(shortOptimizeProgress, 1, shortSteps[1].duration * 1000, () => {
        shortSteps[1].active = false
        shortSteps[1].completed = true
        shortOptimizeChainTokens.value += shortSteps[1].tokens
      })
    }, shortSteps[0].duration * 1000)

    // 步骤3 - 生成DSL
    setTimeout(
      () => {
        shortSteps[2].time = getCurrentTime()
        shortSteps[2].active = true
        animateProgress(shortOptimizeProgress, 2, shortSteps[2].duration * 1000, () => {
          shortSteps[2].active = false
          shortSteps[2].completed = true
          shortOptimizeChainTokens.value += shortSteps[2].tokens
          clearInterval(timer)
          shortOptimizeChainTime.value =
            queryAnalyzeTime.value +
            shortSteps[0].duration +
            shortSteps[1].duration +
            shortSteps[2].duration
          shortOptimizeCompleted.value = true
          shortOptimizeLLMCalls.value += 1
        })
      },
      (shortSteps[0].duration + shortSteps[1].duration) * 1000,
    )
  }

  // 模拟优化长链路执行 (带 cost planner)
  const simulateLongOptimizeChain = (skippedSteps = []) => {
    console.log('开始执行优化长链路 (带 cost planner)', '跳过步骤:', skippedSteps)

    let timer = setInterval(() => {
      longOptimizeChainTime.value += 0.01
    }, 10)

    // 启用Cost Agent时，增加200ms前摇
    let accumulatedTime = costAgentEnabled.value ? 700 : 500

    // 遍历所有阶段
    const stageKeys = Object.keys(longOptimizeSteps.value)
    const isLastStage = (index) => index === stageKeys.length - 1

    stageKeys.forEach((stageKey, stageIndex) => {
      setTimeout(() => {
        const stage = longOptimizeSteps.value[stageKey]
        const stageSteps = stage.steps
        console.log(`优化长链路阶段${stageIndex + 1}开始: ${stage.title}`)

        const allSkipped = stageSteps.every((step) => skippedSteps.includes(step.id))
        const maxDuration = allSkipped ? 100 : Math.max(...stageSteps.map((s) => s.duration)) * 1000

        animateProgress(longOptimizeProgress, stageIndex, maxDuration, () => {
          console.log(`优化长链路阶段${stageIndex + 1}进度完成`)
        })

        // 执行该阶段的所有步骤
        stageSteps.forEach((step, stepIdx) => {
          if (skippedSteps.includes(step.id)) {
            console.log(`优化长链路阶段${stageIndex + 1}-步骤${stepIdx} 已跳过:`, step.id)
            // skipped状态已经在selectRandomStepsToSkip中设置了
            return
          }

          step.time = getCurrentTime()
          step.active = true

          setTimeout(() => {
            console.log(`优化长链路阶段${stageIndex + 1}-步骤${stepIdx} 完成:`, step.id)
            step.active = false
            step.completed = true
            longOptimizeChainTokens.value += step.tokens
            if (step.type === 'llm') {
              longOptimizeLLMCalls.value += 1
            }

            if (isLastStage(stageIndex) && stepIdx === stageSteps.length - 1) {
              clearInterval(timer)
              longOptimizeChainTime.value = parseFloat(
                (accumulatedTime / 1000 + queryAnalyzeTime.value).toFixed(2),
              )
              longOptimizeCompleted.value = true
              console.log('优化长链路执行完成')
            }
          }, step.duration * 1000)
        })
      }, accumulatedTime)

      const stageSteps = longOptimizeSteps.value[stageKey].steps
      const allSkipped = stageSteps.every((step) => skippedSteps.includes(step.id))
      accumulatedTime += allSkipped ? 100 : Math.max(...stageSteps.map((s) => s.duration)) * 1000
    })
  }

  // 模拟原始长链路执行 (不带 cost planner)
  const simulateLongChain = () => {
    console.log('开始执行原始长链路 (不带 cost planner)')

    let timer = setInterval(() => {
      longChainTime.value += 0.01
    }, 10)

    let accumulatedTime = 500 // 初始延迟
    const skippedSteps = [] // 原始长链路不跳过任何步骤

    // 获取所有阶段
    const stageKeys = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7']
    const isLastStage = (index) => index === stageKeys.length - 1

    // 循环执行每个阶段
    stageKeys.forEach((stageKey, stageIndex) => {
      setTimeout(() => {
        const stage = longSteps.value[stageKey]
        const stageSteps = stage.steps
        console.log(`原始长链路阶段${stageIndex + 1}开始: ${stage.title}`)

        // 检查该阶段所有步骤是否都被跳过
        const allSkipped = stageSteps.every((step) => skippedSteps.includes(step.id))

        // 计算阶段最长执行时间
        const maxDuration = allSkipped ? 100 : Math.max(...stageSteps.map((s) => s.duration)) * 1000

        // 开始阶段进度动画
        animateProgress(longProgress, stageIndex, maxDuration, () => {
          console.log(`原始长链路阶段${stageIndex + 1}进度完成`)
        })

        // 执行该阶段的所有步骤
        stageSteps.forEach((step, stepIdx) => {
          console.log(`原始长链路阶段${stageIndex + 1}-步骤${stepIdx} 开始执行:`, step.id)

          // 检查是否被跳过
          if (skippedSteps.includes(step.id)) {
            console.log(`原始长链路阶段${stageIndex + 1}-步骤${stepIdx} 被跳过:`, step.id)
            step.skipped = true
            return
          }

          step.time = getCurrentTime()
          step.active = true

          setTimeout(() => {
            console.log(`原始长链路阶段${stageIndex + 1}-步骤${stepIdx} 完成:`, step.id)
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
              console.log('原始长链路执行完成')
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
    hitCache,
    queryAnalyzeStatus,
    queryAnalyzeCompleted,
    queryAnalyzeTime,

    // Analyze 节点
    analyzeNode,

    // 优化链路的短链路
    shortOptimizeChainTime,
    shortOptimizeChainTokens,
    shortOptimizeLLMCalls,
    shortOptimizeCompleted,

    // 优化链路的长链路
    longOptimizeChainTime,
    longOptimizeChainTokens,
    longOptimizeLLMCalls,
    longOptimizeCompleted,

    // 原始长链路
    longChainTime,
    longChainTokens,
    longLLMCalls,
    longCompleted,

    queryText,
    queryResult,
    skippedStepsInfo,
    skippedStageIndices,
    currentExampleId,

    // 配置
    shortChainConfig,
    longChainConfig,

    // 步骤
    shortSteps,
    longSteps,
    longOptimizeSteps,

    // 进度
    shortOptimizeProgress,
    longOptimizeProgress,
    longProgress,

    // 方法
    executeQuery,
    resetAll,
    clearLogs,
    loadQueryExample,
    simulateQueryAnalyze,
    selectStepsToSkip,
  }
}
