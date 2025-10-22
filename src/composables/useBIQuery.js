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
      time: '11:44:24',
      active: false,
      completed: false,
      details: null,
    },
    {
      id: 2,
      title: '检索历史相关问题',
      time: '11:44:25',
      active: false,
      completed: false,
      details: [
        '1. 包含洗衣液关键词的笔记作者IP属地分布，近7天',
        '2. 内容为母婴用品的笔记作者ip属地分布，近30天',
      ],
    },
    {
      id: 3,
      title: '根据历史生成改写DSL',
      time: '11:44:27',
      active: false,
      completed: false,
      details: [
        '维度: [笔记id, 笔记作者username, 笔记作者IP属地]',
        '筛选条件: [笔记内容=洗衣液成分, 笔记创建时间>=近30天]',
      ],
    },
  ])

  // 长链路步骤
  const longSteps = reactive([
    {
      id: 1,
      title: '拆解用户问题',
      time: '11:44:25',
      active: false,
      completed: false,
      details: [
        '指标: 笔记数据; 维度: 笔记关键词; 筛选条件: 笔记内容=洗衣液成分;',
        '时间范围: 近30天; 图表类型: 饼图; 字段: [笔记关键词, 笔记内容, 创建时间]',
      ],
    },
    {
      id: 2,
      title: '召回相关表',
      time: '11:44:27',
      active: false,
      completed: false,
      details: ['[笔记指标汇总, 趋势笔记, 热门笔记, 笔记排行榜, 笔记作者总表, ...]', '共50张表'],
    },
    {
      id: 3,
      title: '重排并选表',
      time: '11:44:29',
      active: false,
      completed: false,
      details: ['当前选中表: 笔记作者总表'],
    },
    {
      id: 4,
      title: '召回表内相关列',
      time: '11:44:32',
      active: false,
      completed: false,
      details: ['[笔记作者username, 笔记作者id, 笔记作者登录设备, 笔记作者IP属地, ...]', '共30列'],
    },
    {
      id: 5,
      title: '生成DSL',
      time: '11:44:33',
      active: false,
      completed: false,
      subSteps: [
        { id: 1, title: '指标配置', detail: '[ ]', active: false, completed: false },
        {
          id: 2,
          title: '维度配置',
          detail: '[笔记id, 笔记作者username, 笔记作者IP属地]',
          active: false,
          completed: false,
        },
        {
          id: 3,
          title: '筛选条件配置',
          detail: '[笔记内容=洗衣液成分, 笔记创建时间>=近30天]',
          active: false,
          completed: false,
        },
      ],
    },
  ])

  // 进度状态
  const shortProgress = reactive([0, 0, 0])
  const longProgress = reactive([0, 0, 0, 0, 0])

  // 重置所有状态
  const resetAll = () => {
    isExecuting.value = false
    shortCompleted.value = false
    longCompleted.value = false
    shortChainTime.value = 0
    longChainTime.value = 0

    // 重置短链路步骤
    shortSteps.forEach((step) => {
      step.active = false
      step.completed = false
    })

    // 重置长链路步骤
    longSteps.forEach((step) => {
      step.active = false
      step.completed = false
      if (step.subSteps) {
        step.subSteps.forEach((sub) => {
          sub.active = false
          sub.completed = false
        })
      }
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

    // 步骤1
    animateProgress(shortProgress, 0, 1500, () => {
      shortSteps[0].active = true
      shortSteps[0].completed = true
    })

    // 步骤2
    setTimeout(() => {
      animateProgress(shortProgress, 1, 2000, () => {
        shortSteps[1].active = true
        shortSteps[1].completed = true
      })
    }, 1500)

    // 步骤3
    setTimeout(() => {
      animateProgress(shortProgress, 2, 1540, () => {
        shortSteps[2].active = true
        shortSteps[2].completed = true
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

    // 步骤1
    setTimeout(() => {
      animateProgress(longProgress, 0, 2000, () => {
        longSteps[0].active = true
        longSteps[0].completed = true
      })
    }, 1000)

    // 步骤2
    setTimeout(() => {
      animateProgress(longProgress, 1, 2000, () => {
        longSteps[1].active = true
        longSteps[1].completed = true
      })
    }, 3000)

    // 步骤3
    setTimeout(() => {
      animateProgress(longProgress, 2, 2000, () => {
        longSteps[2].active = true
        longSteps[2].completed = true
      })
    }, 5000)

    // 步骤4
    setTimeout(() => {
      animateProgress(longProgress, 3, 3000, () => {
        longSteps[3].active = true
        longSteps[3].completed = true
      })
    }, 7000)

    // 步骤5
    setTimeout(() => {
      animateProgress(longProgress, 4, 4500, () => {
        longSteps[4].active = true
        longSteps[4].completed = true

        // 子步骤
        setTimeout(() => {
          longSteps[4].subSteps[0].active = true
          longSteps[4].subSteps[0].completed = true
        }, 200)
        setTimeout(() => {
          longSteps[4].subSteps[1].active = true
          longSteps[4].subSteps[1].completed = true
        }, 400)
        setTimeout(() => {
          longSteps[4].subSteps[2].active = true
          longSteps[4].subSteps[2].completed = true
          clearInterval(timer)
          longChainTime.value = 23.5
          longCompleted.value = true
        }, 600)
      })
    }, 10000)
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
