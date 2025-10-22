<template>
  <div
    class="chain-step"
    :class="{ 'step-inactive': !active && !completed }"
  >
    <div class="step-header">
      <div class="step-left">
        <div
          class="status-icon"
          :class="{
            'status-completed': completed,
            'status-inactive': !active && !completed
          }"
        >
          <el-icon v-if="completed" class="check-icon">
            <Check />
          </el-icon>
        </div>
        <span class="step-title">{{ title }}</span>
      </div>
      <span class="step-time">{{ time }}</span>
    </div>

    <div v-if="details && (active || completed)" class="step-details">
      <div v-for="(detail, index) in details" :key="index" class="detail-item">
        {{ detail }}
      </div>
    </div>

    <!-- 子步骤 -->
    <div v-if="subSteps && (active || completed)" class="sub-steps">
      <div
        v-for="subStep in subSteps"
        :key="subStep.id"
        class="sub-step"
        :class="{ 'step-inactive': !subStep.active && !subStep.completed }"
      >
        <div
          class="status-icon sub-icon"
          :class="{
            'status-completed': subStep.completed,
            'status-inactive': !subStep.active && !subStep.completed
          }"
        >
          <el-icon v-if="subStep.completed" class="check-icon">
            <Check />
          </el-icon>
        </div>
        <span class="sub-title">{{ subStep.title }}</span>
        <span class="sub-detail">{{ subStep.detail }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'

defineProps({
  title: String,
  time: String,
  active: Boolean,
  completed: Boolean,
  details: Array,
  subSteps: Array
})
</script>

<style scoped>
.chain-step {
  background: #334155;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step-inactive {
  opacity: 0.3;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #64748b;
  transition: all 0.3s;
}

.status-completed {
  background: #10b981;
}

.status-inactive {
  background: #64748b;
}

.check-icon {
  color: white;
  font-size: 16px;
}

.step-title {
  color: white;
  font-size: 14px;
}

.step-time {
  color: #94a3b8;
  font-size: 12px;
}

.step-details {
  margin-top: 8px;
  padding-left: 32px;
}

.detail-item {
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.6;
}

.sub-steps {
  margin-top: 8px;
  padding-left: 32px;
}

.sub-step {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  transition: all 0.3s;
}

.sub-icon {
  width: 16px;
  height: 16px;
}

.sub-icon .check-icon {
  font-size: 12px;
}

.sub-title {
  font-size: 12px;
  color: white;
}

.sub-detail {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 8px;
}
</style>

