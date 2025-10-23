import { ref, reactive } from 'vue'

export function useBIQuery() {
  // 执行状态
  const isExecuting = ref(false)
  const costAgentEnabled = ref(false)

  // 链路时间
  const shortChainTime = ref(0)
  const longChainTime = ref(0)

  // 链路完成状态
  const shortCompleted = ref(false)
  const longCompleted = ref(false)

  // 查询输入
  const queryText = ref('包含洗衣液成分关键词的笔记作者ip属地分布，近30天')

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
      title: '向量化用户问题',
      time: '',
      active: false,
      completed: false,
      details: null,
      tokens: 0,
      duration: 0,
    },
    {
      id: 2,
      title: '检索历史相关问题',
      time: '',
      active: false,
      completed: false,
      details: [
        '1. 包含洗衣液关键词的笔记作者IP属地分布，近7天',
        '2. 内容为母婴用品的笔记作者ip属地分布，近30天',
      ],
      tokens: 0,
      duration: 0,
    },
    {
      id: 3,
      title: '生成DSL',
      time: '',
      active: false,
      completed: false,
      details: [
        '维度: [笔记id, 笔记作者username, 笔记作者IP属地]',
        '筛选条件: [笔记内容=洗衣液成分, 笔记创建时间>=近30天]',
      ],
      tokens: 0,
      duration: 0,
    },
  ])

  // 长链路步骤 - 新的复杂流程结构
  const longSteps = reactive({
    // 阶段1: 配置解析 (并行执行)
    stage1: {
      title: '配置解析',
      parallel: true,
      steps: [
        {
          id: 'entity-recognition',
          title: '实体识别',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'question-rewrite',
          title: '问题改写',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'question-clarify',
          title: '问题澄清',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段2: 召回 (并行执行)
    stage2: {
      title: '表召回',
      parallel: true,
      steps: [
        {
          id: 'main-table-recall',
          title: '主体召回表',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'field-table-recall',
          title: '字段召回表',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'business-table-recall',
          title: '业务术语召回表',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段3: 选表
    stage3: {
      title: '选表',
      parallel: false,
      steps: [
        {
          id: 'table-selection',
          title: '选表 (N→1)',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段4: 单表知识召回
    stage4: {
      title: '单表知识召回',
      parallel: true,
      steps: [
        {
          id: 'segment-recall',
          title: '学段召回',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'business-term',
          title: '业务术语',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'table-rule',
          title: '表规则',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'dimension-value-recall',
          title: '维度维值召回',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段5: Rerank (并行执行)
    stage5: {
      title: '召回Rerank',
      parallel: true,
      steps: [
        {
          id: 'segment-rerank',
          title: '学段召回Rerank',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'dimension-rerank',
          title: '维值Rerank',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段6: 配置解析 (并行执行)
    stage6: {
      title: '配置解析',
      parallel: true,
      steps: [
        {
          id: 'metric-parse',
          title: '指标解析',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'dimension-parse',
          title: '维度解析',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
        {
          id: 'filter-parse',
          title: '筛选解析',
          type: 'llm',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
    // 阶段7: DSL转换
    stage7: {
      title: 'DSL配置转换',
      parallel: false,
      steps: [
        {
          id: 'dsl-transform',
          title: 'DSL配置转换',
          type: 'compute',
          status: 'inactive',
          tokens: 0,
          duration: 0,
          details: [],
        },
      ],
    },
  })

  // 进度状态
  const shortProgress = reactive([0, 0, 0])
  // 长链路不再使用简单的进度数组,而是根据stages动态计算

  // 获取当前时间字符串 (HH:MM:SS)
  const getCurrentTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // Token消耗统计
  const shortChainTokens = ref(0)
  const longChainTokens = ref(0)

  // 重置所有状态
  const resetAll = () => {
    isExecuting.value = false
    shortCompleted.value = false
    longCompleted.value = false
    shortChainTime.value = 0
    longChainTime.value = 0
    shortChainTokens.value = 0
    longChainTokens.value = 0

    // 重置短链路步骤
    shortSteps.forEach((step) => {
      step.active = false
      step.completed = false
      step.time = ''
      step.tokens = 0
      step.duration = 0
    })

    // 重置长链路步骤 - 遍历所有阶段
    Object.keys(longSteps).forEach((stageKey) => {
      const stage = longSteps[stageKey]
      stage.steps.forEach((step) => {
        step.status = 'inactive'
        step.tokens = 0
        step.duration = 0
        step.details = []
      })
    })

    // 重置进度
    shortProgress.fill(0)
  }

  // 执行查询
  const executeQuery = () => {
    return new Promise((resolve) => {
      isExecuting.value = true
      resetAll()
      isExecuting.value = true

      // 模拟链路执行
      simulateShortChain()
      simulateLongChain()

      // 等待所有链路完成
      const checkInterval = setInterval(() => {
        if (shortCompleted.value && longCompleted.value) {
          clearInterval(checkInterval)
          isExecuting.value = false
          resolve()
        }
      }, 100)
    })
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
    animateProgress(shortProgress, 0, 1500, () => {
      shortSteps[0].completed = true
      shortSteps[0].tokens = 120
      shortSteps[0].duration = 1.5
      // 立即增加token消耗
      shortChainTokens.value += 120
    })

    // 步骤2 - 检索历史相关问题
    setTimeout(() => {
      shortSteps[1].time = getCurrentTime()
      shortSteps[1].active = true
      animateProgress(shortProgress, 1, 2000, () => {
        shortSteps[1].completed = true
        shortSteps[1].tokens = 450
        shortSteps[1].duration = 2.0
        // 立即增加token消耗
        shortChainTokens.value += 450
      })
    }, 1500)

    // 步骤3 - 生成DSL
    setTimeout(() => {
      shortSteps[2].time = getCurrentTime()
      shortSteps[2].active = true
      animateProgress(shortProgress, 2, 1540, () => {
        shortSteps[2].completed = true
        shortSteps[2].tokens = 1280
        shortSteps[2].duration = 1.54
        // 立即增加token消耗
        shortChainTokens.value += 1280
        clearInterval(timer)
        shortChainTime.value = 5.04
        shortCompleted.value = true
      })
    }, 3500)
  }

  // 模拟长链路执行
  const simulateLongChain = () => {
    let timer = setInterval(() => {
      longChainTime.value += 0.01
    }, 10)

    let currentTime = 0

    // 阶段1: 配置解析 (3个LLM步骤并行, 2.5秒)
    setTimeout(() => {
      const stage1Steps = longSteps.stage1.steps
      // 并行执行,同时开始
      stage1Steps.forEach((step, idx) => {
        step.status = 'active'
        const duration = 2500 + idx * 200 // 略有差异
        setTimeout(() => {
          step.status = 'completed'
          step.tokens = 650 + idx * 100
          step.duration = (duration / 1000).toFixed(2)
          step.details = ['实体: 笔记内容, 作者IP属地', '时间范围: 近30天']
          longChainTokens.value += step.tokens
        }, duration)
      })
      currentTime += 2700
    }, 500)

    // 阶段2: 表召回 (3个传统计算步骤并行, 瞬时完成)
    setTimeout(() => {
      const stage2Steps = longSteps.stage2.steps
      stage2Steps.forEach((step, idx) => {
        step.status = 'active'
        setTimeout(() => {
          step.status = 'completed'
          step.details = [
            idx === 0
              ? '召回50张主体相关表'
              : idx === 1
                ? '召回35个字段相关表'
                : '召回20个业务术语表',
          ]
        }, 100)
      })
      currentTime += 100
    }, currentTime)

    // 阶段3: 选表 (1个LLM步骤, 3秒)
    setTimeout(() => {
      const step = longSteps.stage3.steps[0]
      step.status = 'active'
      setTimeout(() => {
        step.status = 'completed'
        step.tokens = 1850
        step.duration = 3.0
        step.details = ['选中表: 笔记作者总表', '置信度: 95%']
        longChainTokens.value += step.tokens
      }, 3000)
      currentTime += 3000
    }, currentTime)

    // 阶段4: 单表知识召回 (4个传统计算步骤并行, 瞬时完成)
    setTimeout(() => {
      const stage4Steps = longSteps.stage4.steps
      stage4Steps.forEach((step, idx) => {
        step.status = 'active'
        setTimeout(() => {
          step.status = 'completed'
          step.details = [
            idx === 0
              ? '召回学段信息: 小学, 初中, 高中'
              : idx === 1
                ? '召回业务术语: 15条'
                : idx === 2
                  ? '召回表规则: 8条'
                  : '召回维度维值: 35个',
          ]
        }, 100)
      })
      currentTime += 100
    }, currentTime)

    // 阶段5: Rerank (2个LLM步骤并行, 2.8秒)
    setTimeout(() => {
      const stage5Steps = longSteps.stage5.steps
      stage5Steps.forEach((step, idx) => {
        step.status = 'active'
        const duration = 2800 + idx * 300
        setTimeout(() => {
          step.status = 'completed'
          step.tokens = 980 + idx * 120
          step.duration = (duration / 1000).toFixed(2)
          step.details = [idx === 0 ? 'Rerank后: Top-5 学段' : 'Rerank后: Top-10 维值']
          longChainTokens.value += step.tokens
        }, duration)
      })
      currentTime += 3100
    }, currentTime)

    // 阶段6: 配置解析 (3个LLM步骤并行, 3.2秒)
    setTimeout(() => {
      const stage6Steps = longSteps.stage6.steps
      stage6Steps.forEach((step, idx) => {
        step.status = 'active'
        const duration = 3200 + idx * 250
        setTimeout(() => {
          step.status = 'completed'
          step.tokens = 1200 + idx * 180
          step.duration = (duration / 1000).toFixed(2)
          step.details = [
            idx === 0
              ? '指标: 笔记数量, 作者数'
              : idx === 1
                ? '维度: 作者IP属地, 笔记内容'
                : '筛选: 笔记内容=洗衣液成分, 时间>=近30天',
          ]
          longChainTokens.value += step.tokens
        }, duration)
      })
      currentTime += 3450
    }, currentTime)

    // 阶段7: DSL配置转换 (传统计算, 瞬时完成)
    setTimeout(() => {
      const step = longSteps.stage7.steps[0]
      step.status = 'active'
      setTimeout(() => {
        step.status = 'completed'
        step.details = ['DSL生成成功', '包含2个指标, 2个维度, 2个筛选条件']
        clearInterval(timer)
        longChainTime.value = parseFloat((currentTime / 1000).toFixed(2))
        longCompleted.value = true
      }, 100)
    }, currentTime)
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
    shortChainTokens,
    longChainTokens,

    // 配置
    shortChainConfig,
    longChainConfig,

    // 步骤
    shortSteps,
    longSteps,

    // 进度
    shortProgress,

    // 方法
    executeQuery,
    resetAll,
  }
}
