import { ref } from 'vue'
import { LOG_TYPES } from '@/constants/logMessages'
import { getCurrentTime } from './utils'

// 日志存储
const logs = ref([])

// 日志类型样式映射
const logTypeStyles = {
  [LOG_TYPES.REGULAR]: {
    type: 'info',
    icon: 'ℹ️',
  },
  [LOG_TYPES.COST_AGENT]: {
    type: 'success',
    icon: '💰',
  },
  [LOG_TYPES.SUCCESS]: {
    type: 'success',
    icon: '✅',
  },
  [LOG_TYPES.ERROR]: {
    type: 'danger',
    icon: '❌',
  },
}

/**
 * 添加日志
 * @param {string} message - 日志消息
 * @param {string} logType - 日志类型
 */
export const addLog = (message, logType = LOG_TYPES.REGULAR) => {
  const log = {
    id: Date.now() + Math.random(), // 确保唯一性
    message,
    logType,
    time: getCurrentTime(),
    timestamp: Date.now(),
    style: logTypeStyles[logType] || logTypeStyles[LOG_TYPES.REGULAR],
  }

  logs.value.unshift(log) // 新日志添加到顶部

  // 只保留最近50条日志（避免内存占用过多）
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

/**
 * 清除所有日志
 */
export const clearLogs = () => {
  logs.value = []
}

/**
 * 获取日志列表
 * @returns {Ref} 日志列表的响应式引用
 */
export const getLogs = () => {
  return logs
}

/**
 * 获取最近的N条日志
 * @param {number} count - 获取的日志数量
 * @returns {Array} 日志数组
 */
export const getRecentLogs = (count = 4) => {
  return logs.value.slice(0, count)
}
