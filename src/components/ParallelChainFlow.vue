<template>
  <div class="parallel-chain-flow">
    <!-- 渲染各个阶段 -->
    <div v-for="(stage, stageIdx) in stages" :key="stageIdx" class="stage-container">
      <!-- 阶段标题 -->
      <div v-if="stage.title" class="stage-title">
        <span>{{ stage.title }}</span>
      </div>

      <!-- 步骤组 -->
      <div class="steps-group" :class="{ 'parallel': stage.parallel }">
        <!-- 并行标识 -->
        <div v-if="stage.parallel" class="parallel-indicator">
          <el-icon><Expand /></el-icon>
          <span>并行执行</span>
        </div>

        <!-- 步骤节点 -->
        <div class="steps-wrapper">
          <ChainStepNode
            v-for="step in stage.steps"
            :key="step.id"
            :title="step.title"
            :status="step.status"
            :type="step.type"
            :tokens="step.tokens"
            :duration="step.duration"
            :details="step.details"
            :in-parallel="stage.parallel"
          />
        </div>
      </div>

      <!-- 连接箭头 -->
      <div v-if="stageIdx < stages.length - 1" class="stage-connector">
        <div class="arrow-line"></div>
        <div class="arrow-head"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChainStepNode from './ChainStepNode.vue'
import { Expand } from '@element-plus/icons-vue'

defineProps({
  stages: {
    type: Array,
    required: true,
    // 每个stage结构: { title: string, parallel: boolean, steps: Array }
  }
})
</script>

<style scoped>
.parallel-chain-flow {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-height: 200px;
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

.stage-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stage-title {
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  display: inline-block;
  align-self: flex-start;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.steps-group {
  position: relative;
  padding: 10px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.3) 100%);
  border-radius: 10px;
  border: 1.5px solid rgba(71, 85, 105, 0.3);
}

.steps-group.parallel {
  border-color: rgba(245, 158, 11, 0.5);
  border-style: dashed;
  background: linear-gradient(145deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
}

.parallel-indicator {
  position: absolute;
  top: -10px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
  z-index: 10;
}

.parallel-indicator .el-icon {
  font-size: 12px;
}

.steps-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  align-items: flex-start;
}

.steps-group.parallel .steps-wrapper {
  justify-content: space-around;
}

.stage-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 24px;
  position: relative;
}

.arrow-line {
  width: 2px;
  height: 16px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%);
  border-radius: 1px;
}

.arrow-head {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid rgba(59, 130, 246, 0.8);
  margin-top: -1px;
}

/* 美化滚动条 */
.parallel-chain-flow::-webkit-scrollbar {
  height: 8px;
}

.parallel-chain-flow::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.parallel-chain-flow::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 10px;
}

.parallel-chain-flow::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #60a5fa 0%, #818cf8 100%);
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .steps-wrapper {
    flex-direction: column;
  }

  .steps-group.parallel .steps-wrapper {
    flex-direction: column;
  }
}
</style>

