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
  const longSteps = ref({
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

  // Token消耗统计
  const shortChainTokens = ref(0)
  const longChainTokens = ref(0)

  // 选择要跳过的步骤（Cost Agent功能）
  const selectRandomStepsToSkip = () => {
    // 可跳过的阶段：stage1-stage6（不包括最后一个stage7）
    const skippableStages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6']

    // 随机选择跳过1-2个步骤
    // const numToSkip = Math.random() < 0.5 ? 1 : 2
    const numToSkip = 3
    const skipped = []

    for (let i = 0; i < numToSkip; i++) {
      // 随机选择一个阶段
      const randomStageIndex = Math.floor(Math.random() * skippableStages.length)
      const stageName = skippableStages[randomStageIndex]
      const stage = longSteps.value[stageName]

      if (stage && stage.steps.length > 0) {
        // 随机选择该阶段中的一个步骤
        const randomStepIndex = Math.floor(Math.random() * stage.steps.length)
        const stepId = stage.steps[randomStepIndex].id

        // 避免重复
        if (!skipped.includes(stepId)) {
          skipped.push(stepId)
        }
      }
    }

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

    // 重置短链路步骤
    shortSteps.forEach((step) => {
      step.active = false
      step.completed = false
      step.time = ''
      step.tokens = 0
      step.duration = 0
    })

    // 重置长链路步骤 - 遍历所有阶段
    Object.keys(longSteps.value).forEach((stageKey) => {
      const stage = longSteps.value[stageKey]
      stage.steps.forEach((step) => {
        step.status = 'inactive'
        step.tokens = 0
        step.duration = 0
        step.details = []
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
    console.log('开始执行长链路');

    let timer = setInterval(() => {
      longChainTime.value += 0.01
    }, 10)

    // 如果启用Cost Agent，增加200ms前摇，并随机选择1-2个步骤跳过
    let accumulatedTime = costAgentEnabled.value ? 700 : 500 // 初始延迟
    const skippedSteps = costAgentEnabled.value ? selectRandomStepsToSkip() : []

    console.log('Cost Agent enabled:', costAgentEnabled.value)
    console.log('Skipped steps:', skippedSteps)

    // 阶段1: 配置解析 (3个LLM步骤并行, 2.7秒)
    setTimeout(() => {
      console.log('阶段1开始: 配置解析');
      const stage1Steps = longSteps.value.stage1.steps
      // 开始阶段1进度动画
      animateProgress(longProgress, 0, 2700, () => {
        console.log('阶段1进度完成');
      })
      // 并行执行,同时开始
      stage1Steps.forEach((step, idx) => {
        console.log(`阶段1-步骤${idx} 开始执行:`, step.id);

        // 检查是否被跳过
        if (skippedSteps.includes(step.id)) {
          console.log(`阶段1-步骤${idx} 被跳过:`, step.id);
          step.status = 'skipped'
          return
        }

        step.status = 'active'
        const duration = 2500 + idx * 200 // 略有差异
        setTimeout(() => {
          console.log(`阶段1-步骤${idx} 完成:`, step.id);
          step.status = 'completed'
          step.tokens = 650 + idx * 100
          step.duration = parseFloat((duration / 1000).toFixed(2))
          step.details = ['实体: 笔记内容, 作者IP属地', '时间范围: 近30天']
          longChainTokens.value += step.tokens
        }, duration)
      })
    }, accumulatedTime)
    accumulatedTime += 2700

    // 阶段2: 表召回 (3个传统计算步骤并行, 瞬时完成)
    setTimeout(() => {
      console.log('阶段2开始: 表召回');
      const stage2Steps = longSteps.value.stage2.steps
      // 开始阶段2进度动画
      animateProgress(longProgress, 1, 100, () => {
        console.log('阶段2进度完成');
      })
      stage2Steps.forEach((step, idx) => {
        console.log(`阶段2-步骤${idx} 开始执行:`, step.id);

        // 检查是否被跳过
        if (skippedSteps.includes(step.id)) {
          console.log(`阶段2-步骤${idx} 被跳过:`, step.id);
          step.status = 'skipped'
          return
        }

        step.status = 'active'
        setTimeout(() => {
          console.log(`阶段2-步骤${idx} 完成:`, step.id);
          step.status = 'completed'
          step.duration = 0.1
          step.details = [
            idx === 0
              ? '召回50张主体相关表'
              : idx === 1
                ? '召回35个字段相关表'
                : '召回20个业务术语表',
          ]
        }, 100)
      })
    }, accumulatedTime)
    accumulatedTime += 100

    // 阶段3: 选表 (1个LLM步骤, 3秒)
    setTimeout(() => {
      console.log('阶段3开始: 选表');
      const step = longSteps.value.stage3.steps[0]

      // 检查是否被跳过
      if (skippedSteps.includes(step.id)) {
        console.log('阶段3-步骤 被跳过:', step.id);
        step.status = 'skipped'
        // 跳过时也要完成进度条，但瞬间完成
        animateProgress(longProgress, 2, 100, () => {
          console.log('阶段3进度完成(跳过)');
        })
      } else {
        // 开始阶段3进度动画
        animateProgress(longProgress, 2, 3000, () => {
          console.log('阶段3进度完成');
        })
        console.log('阶段3-步骤 开始执行:', step.id);
        step.status = 'active'
        setTimeout(() => {
          console.log('阶段3-步骤 完成:', step.id);
          step.status = 'completed'
          step.tokens = 1850
          step.duration = 3.0
          step.details = ['选中表: 笔记作者总表', '置信度: 95%']
          longChainTokens.value += step.tokens
        }, 3000)
      }
    }, accumulatedTime)
    // 如果stage3被跳过，减少延迟时间
    const stage3Duration = skippedSteps.includes(longSteps.value.stage3.steps[0].id) ? 100 : 3000
    accumulatedTime += stage3Duration

    // 阶段4: 单表知识召回 (4个传统计算步骤并行, 瞬时完成)
    setTimeout(() => {
      console.log('阶段4开始: 单表知识召回');
      const stage4Steps = longSteps.value.stage4.steps
      // 开始阶段4进度动画
      animateProgress(longProgress, 3, 100, () => {
        console.log('阶段4进度完成');
      })
      stage4Steps.forEach((step, idx) => {
        console.log(`阶段4-步骤${idx} 开始执行:`, step.id);

        // 检查是否被跳过
        if (skippedSteps.includes(step.id)) {
          console.log(`阶段4-步骤${idx} 被跳过:`, step.id);
          step.status = 'skipped'
          return
        }

        step.status = 'active'
        setTimeout(() => {
          console.log(`阶段4-步骤${idx} 完成:`, step.id);
          step.status = 'completed'
          step.duration = 0.1
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
    }, accumulatedTime)
    accumulatedTime += 100

    // 阶段5: Rerank (2个LLM步骤并行, 3.1秒)
    setTimeout(() => {
      console.log('阶段5开始: Rerank');
      const stage5Steps = longSteps.value.stage5.steps

      // 检查是否有步骤被跳过
      const allSkipped = stage5Steps.every(step => skippedSteps.includes(step.id))
      const stageDuration = allSkipped ? 100 : 3100

      // 开始阶段5进度动画
      animateProgress(longProgress, 4, stageDuration, () => {
        console.log('阶段5进度完成');
      })
      stage5Steps.forEach((step, idx) => {
        console.log(`阶段5-步骤${idx} 开始执行:`, step.id);

        // 检查是否被跳过
        if (skippedSteps.includes(step.id)) {
          console.log(`阶段5-步骤${idx} 被跳过:`, step.id);
          step.status = 'skipped'
          return
        }

        step.status = 'active'
        const duration = 2800 + idx * 300
        setTimeout(() => {
          console.log(`阶段5-步骤${idx} 完成:`, step.id);
          step.status = 'completed'
          step.tokens = 980 + idx * 120
          step.duration = parseFloat((duration / 1000).toFixed(2))
          step.details = [idx === 0 ? 'Rerank后: Top-5 学段' : 'Rerank后: Top-10 维值']
          longChainTokens.value += step.tokens
        }, duration)
      })
    }, accumulatedTime)
    // 如果stage5有步骤被跳过，调整延迟时间
    const stage5AllSkipped = longSteps.value.stage5.steps.every(step => skippedSteps.includes(step.id))
    accumulatedTime += stage5AllSkipped ? 100 : 3100

    // 阶段6: 配置解析 (3个LLM步骤并行, 3.45秒)
    setTimeout(() => {
      console.log('阶段6开始: 配置解析');
      const stage6Steps = longSteps.value.stage6.steps

      // 检查是否有步骤被跳过
      const allSkipped = stage6Steps.every(step => skippedSteps.includes(step.id))
      const stageDuration = allSkipped ? 100 : 3450

      // 开始阶段6进度动画
      animateProgress(longProgress, 5, stageDuration, () => {
        console.log('阶段6进度完成');
      })
      stage6Steps.forEach((step, idx) => {
        console.log(`阶段6-步骤${idx} 开始执行:`, step.id);

        // 检查是否被跳过
        if (skippedSteps.includes(step.id)) {
          console.log(`阶段6-步骤${idx} 被跳过:`, step.id);
          step.status = 'skipped'
          return
        }

        step.status = 'active'
        const duration = 3200 + idx * 250
        setTimeout(() => {
          console.log(`阶段6-步骤${idx} 完成:`, step.id);
          step.status = 'completed'
          step.tokens = 1200 + idx * 180
          step.duration = parseFloat((duration / 1000).toFixed(2))
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
    }, accumulatedTime)
    // 如果stage6有步骤被跳过，调整延迟时间
    const stage6AllSkipped = longSteps.value.stage6.steps.every(step => skippedSteps.includes(step.id))
    accumulatedTime += stage6AllSkipped ? 100 : 3450

    // 阶段7: DSL配置转换 (传统计算, 瞬时完成)
    setTimeout(() => {
      console.log('阶段7开始: DSL配置转换');
      const step = longSteps.value.stage7.steps[0]
      // 开始阶段7进度动画
      animateProgress(longProgress, 6, 100, () => {
        console.log('阶段7进度完成');
      })
      console.log('阶段7-步骤 开始执行:', step.id);
      step.status = 'active'
      setTimeout(() => {
        console.log('阶段7-步骤 完成:', step.id);
        step.status = 'completed'
        step.duration = 0.1
        step.details = ['DSL生成成功', '包含2个指标, 2个维度, 2个筛选条件']
        clearInterval(timer)
        longChainTime.value = parseFloat((accumulatedTime / 1000).toFixed(2))
        longCompleted.value = true
        console.log('长链路执行完成');
      }, 100)
    }, accumulatedTime)
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
    longProgress,

    // 方法
    executeQuery,
    resetAll,
  }
}
