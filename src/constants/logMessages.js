// 日志消息常量
export const LOG_MESSAGES = {
  // 常规日志
  RETRIEVING_DATA: 'Retrieving relevant data...',
  ANALYZING_DATA: 'Analyzing data and generating report...',

  // Cost Agent 日志
  COST_PLANER_ANALYZING: 'Cost Planer is analyzing the query...',
  COST_PLANER_SKIPPED: (steps) => {
    const stepNames = steps.map((s) => s.title).join('、')
    return `After analysis, intelligently skipped: ${stepNames}`
  },

  // 执行状态日志
  EXECUTION_STARTED: 'Execution started',
  EXECUTION_COMPLETED: 'Execution completed successfully',
  EXECUTION_FAILED: 'Execution failed',

  // 短链路相关
  SHORT_CHAIN_STARTED: 'Short chain execution started',
  SHORT_CHAIN_COMPLETED: 'Short chain completed',

  // 长链路相关
  LONG_CHAIN_STARTED: 'Long chain execution started',
  LONG_CHAIN_COMPLETED: 'Long chain completed',
}

// 日志类型
export const LOG_TYPES = {
  REGULAR: 'regular',
  COST_AGENT: 'cost-agent',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}
