<template>
  <div class="chain-flow">
    <!-- 优化链路 (短链路) -->
    <div class="chain-section optimized">
      <div class="chain-header">
        <el-icon class="status-icon success"><SuccessFilled /></el-icon>
        <span class="chain-title">优化链路 (短链路)</span>
        <el-tag size="small" class="time-tag">验证耗时: {{ optimizedTime }} 秒</el-tag>
      </div>

      <div class="chain-steps">
        <div class="timeline-line"></div>
        <div
          v-for="step in optimizedSteps"
          :key="step.id"
          class="step-item"
          :class="{ active: step.active }"
        >
          <div class="step-indicator">
            <div class="step-dot"></div>
          </div>
          <div class="step-content">
            <div class="step-name">{{ step.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 传统链路 (长链路) -->
    <div class="chain-section traditional">
      <div class="chain-header">
        <el-icon class="status-icon warning"><WarningFilled /></el-icon>
        <span class="chain-title">传统链路 (长链路)</span>
        <el-tag size="small" class="time-tag">验证耗时: {{ traditionalTime }} 秒</el-tag>
      </div>

      <div class="chain-steps">
        <div class="timeline-line"></div>
        <div
          v-for="step in traditionalSteps"
          :key="step.id"
          class="step-item"
          :class="{ active: step.active }"
        >
          <div class="step-indicator">
            <div class="step-dot"></div>
          </div>
          <div class="step-content">
            <div class="step-name">{{ step.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SuccessFilled, WarningFilled } from '@element-plus/icons-vue'

const optimizedTime = ref(0)
const traditionalTime = ref(0)

const optimizedSteps = ref([
  { id: 1, name: '向量化用户问题', active: false },
  { id: 2, name: '检索向量相关问题', active: false },
  { id: 3, name: '根据历史生成答案DSL', active: false }
])

const traditionalSteps = ref([
  { id: 1, name: '拆解用户问题', active: false },
  { id: 2, name: '召回相关表', active: false },
  { id: 3, name: '重排过滤表', active: false },
  { id: 4, name: '召回表内相关字段', active: false },
  { id: 5, name: '生成DSL', active: false }
])
</script>

<style scoped>
.chain-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
}

.chain-section {
  background: rgba(30, 58, 95, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.chain-section.optimized {
  border-left: 3px solid #52c41a;
}

.chain-section.traditional {
  border-left: 3px solid #faad14;
}

.chain-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
}

.status-icon {
  font-size: 20px;
}

.status-icon.success {
  color: #52c41a;
}

.status-icon.warning {
  color: #faad14;
}

.chain-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  flex: 1;
}

.time-tag {
  background: rgba(37, 99, 235, 0.2);
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #8a9db5;
  font-size: 12px;
}

.chain-steps {
  position: relative;
  padding-left: 30px;
}

.timeline-line {
  position: absolute;
  left: 8px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: linear-gradient(to bottom,
    rgba(37, 99, 235, 0.5) 0%,
    rgba(37, 99, 235, 0.2) 100%
  );
}

.step-item {
  position: relative;
  display: flex;
  gap: 15px;
  margin-bottom: 16px;
  align-items: center;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-indicator {
  position: relative;
  z-index: 1;
}

.step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1a2942;
  border: 2px solid #2a3f5f;
  transition: all 0.3s ease;
}

.step-item.active .step-dot {
  background: #2563EB;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.step-content {
  flex: 1;
  background: rgba(26, 41, 66, 0.5);
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(42, 63, 95, 0.5);
  transition: all 0.3s ease;
}

.step-item.active .step-content {
  background: rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.4);
}

.step-name {
  font-size: 14px;
  color: #c0c0c0;
  font-weight: 400;
}

.step-item.active .step-name {
  color: #fff;
  font-weight: 500;
}
</style>
