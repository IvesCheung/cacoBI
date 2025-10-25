import { ref, watch, onMounted } from 'vue'

const isDark = ref(true) // 默认为深色主题

export function useTheme() {
  // 从 localStorage 读取主题设置
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的主题，检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
  }

  // 应用主题
  const applyTheme = (dark) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  // 监听主题变化
  watch(isDark, (newValue) => {
    applyTheme(newValue)
  })

  // 初始化时加载主题
  onMounted(() => {
    loadTheme()
    applyTheme(isDark.value)
  })

  return {
    isDark,
    toggleTheme
  }
}
