<template>
  <div class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light Theme' : 'Dark Theme'">
    <transition name="icon-fade" mode="out-in">
      <el-icon v-if="isDark" :size="24" key="moon">
        <Moon />
      </el-icon>
      <el-icon v-else :size="24" key="sunny">
        <Sunny />
      </el-icon>
    </transition>
  </div>
</template>

<script setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-toggle-bg);
  border: 2px solid var(--theme-toggle-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: var(--theme-toggle-shadow);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(10deg);
  background: var(--theme-toggle-hover-bg);
  border-color: var(--theme-toggle-hover-border);
  box-shadow: var(--theme-toggle-hover-shadow);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.el-icon {
  color: var(--theme-toggle-icon);
  transition: color 0.3s ease;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

/* 深色主题变量 */
:root.dark {
  --theme-toggle-bg: rgba(51, 65, 85, 0.8);
  --theme-toggle-border: rgba(71, 85, 105, 0.8);
  --theme-toggle-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  --theme-toggle-hover-bg: rgba(71, 85, 105, 0.9);
  --theme-toggle-hover-border: rgba(100, 116, 139, 0.9);
  --theme-toggle-hover-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  --theme-toggle-icon: #fbbf24;
}

/* 浅色主题变量 */
:root.light {
  --theme-toggle-bg: rgba(255, 255, 255, 0.9);
  --theme-toggle-border: rgba(226, 232, 240, 1);
  --theme-toggle-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --theme-toggle-hover-bg: rgba(248, 250, 252, 1);
  --theme-toggle-hover-border: rgba(203, 213, 225, 1);
  --theme-toggle-hover-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  --theme-toggle-icon: #3b82f6;
}
</style>
