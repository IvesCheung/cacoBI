import { ElNotification } from 'element-plus'
import { LOG_TYPES } from '@/constants/logMessages'

/**
 * 获取当前时间字符串 (HH:MM:SS)
 * @returns {string} 格式化的时间字符串
 */
export const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 生成随机的compute节点duration (0.05-0.15秒)
 * @returns {number} 随机duration值
 */
export const getRandomComputeDuration = () => {
  return Math.random() * (0.15 - 0.05) + 0.05
}

/**
 * 为数值添加随机抖动，使数据更真实
 * @param {number} value - 原始数值
 * @param {number} ratio - 抖动比例，默认2%
 * @returns {number} 抖动后的数值（整数会返回整数，小数会保留原精度）
 */
export const addJitter = (value, ratio = 0.02) => {
  if (value === 0) return 0

  const jitterAmount = value * ratio
  const jitteredValue = value + (Math.random() * 2 - 1) * jitterAmount

  // 如果原始值是整数，返回整数；否则返回小数
  return Number.isInteger(value) ? Math.round(jitteredValue) : jitteredValue
}

/**
 * 显示日志通知的辅助函数
 * @param {string} message - 通知消息
 * @param {string} logType - 日志类型
 */
export const showLogNotification = (message, logType = LOG_TYPES.REGULAR) => {
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
