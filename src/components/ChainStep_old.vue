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
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 4px;
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
  gap: 6px;
}

.status-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #64748b;
  transition: all 0.3s;
  flex-shrink: 0;
}

.status-completed {
  background: #10b981;
}

.status-inactive {
  background: #64748b;
}

.check-icon {
  color: white;
  font-size: 14px;
}

.step-title {
  color: white;
  font-size: 13px;
}

.step-time {
  color: #94a3b8;
  font-size: 11px;
}

.step-details {
  margin-top: 6px;
  padding-left: 26px;
}

.detail-item {
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.5;
}

.sub-steps {
  margin-top: 6px;
  padding-left: 26px;
}

.sub-step {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  transition: all 0.3s;
}

.sub-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.sub-icon .check-icon {
  font-size: 10px;
}

.sub-title {
  font-size: 11px;
  color: white;
}

.sub-detail {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 4px;
}
</style>

