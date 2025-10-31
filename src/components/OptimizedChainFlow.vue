<template>
  <div class="optimized-chain-flow-container">
    <div class="optimized-chain-flow">
      <!-- Left side: Query Analyze Node -->
      <div class="analyze-section">
        <!-- Cache Status Indicator -->
        <div v-if="queryAnalyzeStatus !== 'pending'" class="cache-status-indicator">
          <div :class="['cache-status', hitCache ? 'cache-hit' : 'cache-miss']">
            <i :class="[hitCache ? 'el-icon-success' : 'el-icon-warning']"></i>
            {{ hitCache ? 'Cache Hit' : 'Cache Miss' }}
          </div>
        </div>

        <ChainNode
          :node="analyzeNode"
          class="analyze-node"
        />
      </div>

      <!-- Right side: Two parallel chains with branch arrows -->
      <div class="chains-section">
        <!-- Branch connection lines -->
        <svg class="branch-connections" viewBox="0 0 100 200" preserveAspectRatio="none">
          <!-- Line to Short Chain -->
          <path
            d="M 0 100 L 30 100 L 60 50"
            class="connection-path connection-to-short"
            fill="none"
          />
          <polygon
            points="60,50 55,54 58,50 55,46"
            class="arrow-head arrow-short"
          />

          <!-- Line to Long Chain -->
          <path
            d="M 0 100 L 30 100 L 60 150"
            class="connection-path connection-to-long"
            fill="none"
          />
          <polygon
            points="60,150 55,154 58,150 55,146"
            class="arrow-head arrow-long"
          />
        </svg>

        <!-- Two parallel chains -->
        <div class="parallel-chains">
          <!-- Short Chain Path -->
          <div class="chain-path short-path">
            <div class="path-label">Shortcut with Semantic Cache</div>
            <el-scrollbar class="path-flow">
            <div class="path-flow-content">
            <div
              v-for="step in shortSteps"
              :key="step.id"
              class="flow-column"
            >
              <ChainNode
                :node="mapShortStepToNode(step)"
                :enable-compare="step.title === 'Generate DSL' && step.completed"
                :compare-data="getCompareDataForShort(step)"
              />
            </div>
          </div>
        </el-scrollbar>
        </div>

        <!-- Long Chain Path -->
        <div class="chain-path long-path">
          <div class="path-label">Long-chain Pipeline with Cost Planner</div>
          <el-scrollbar class="path-flow">
            <div class="path-flow-content">
            <!-- Stage 1: Query Parsing -->
            <div class="flow-column">
              <div class="flow-group-box">
                <div class="group-title">Query Parsing</div>
                <ChainNode
                  v-for="step in stage1Steps"
                  :key="step.id"
                  :node="mapLongStepToNode(step)"
                  class="flow-node"
                />
              </div>
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 2: Table Retrieval -->
            <div class="flow-column">
              <div class="flow-group-box">
                <div class="group-title">Table Retrieval</div>
                <ChainNode
                  v-for="step in stage2Steps"
                  :key="step.id"
                  :node="mapLongStepToNode(step)"
                  class="flow-node"
                />
              </div>
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 3: Table Selection -->
            <div class="flow-column">
              <ChainNode
                v-for="step in stage3Steps"
                :key="step.id"
                :node="mapLongStepToNode(step)"
                class="flow-node"
              />
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 4: In-Table Knowledge Retrieval -->
            <div class="flow-column">
              <div class="flow-group-box">
                <div class="group-title">In-Table Knowledge</div>
                <ChainNode
                  v-for="step in stage4Steps"
                  :key="step.id"
                  :node="mapLongStepToNode(step)"
                  class="flow-node"
                />
              </div>
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 5: Rerank -->
            <div class="flow-column">
              <div class="flow-group-box">
                <div class="group-title">Retrieval Rerank</div>
                <ChainNode
                  v-for="step in stage5Steps"
                  :key="step.id"
                  :node="mapLongStepToNode(step)"
                  class="flow-node"
                />
              </div>
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 6: DSL Configuring -->
            <div class="flow-column">
              <div class="flow-group-box">
                <div class="group-title">DSL Configuring</div>
                <ChainNode
                  v-for="step in stage6Steps"
                  :key="step.id"
                  :node="mapLongStepToNode(step)"
                  class="flow-node"
                />
              </div>
            </div>

            <div class="flow-arrow-column">
              <div class="arrow-line"></div>
            </div>

            <!-- Stage 7: DSL Conversion -->
            <div class="flow-column">
              <ChainNode
                v-for="step in stage7Steps"
                :key="step.id"
                :node="mapLongStepToNode(step)"
                :enable-compare="step.title === 'Generate DSL' && step.completed"
                :compare-data="getCompareDataForLong(step)"
                class="flow-node"
              />
            </div>
          </div>
          </el-scrollbar>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChainNode from './ChainNode.vue'

const props = defineProps({
  shortSteps: { type: Array, required: true },
  longSteps: { type: Object, required: true },
  hitCache: { type: Boolean, default: false },
  queryAnalyzeStatus: { type: String, default: 'pending' },
  analyzeNode: { type: Object, required: true },
  originalLongSteps: { type: Object, default: () => ({}) }
})

// Query Analyze Node - 使用从 useBIQuery 传来的数据
const analyzeNode = computed(() => props.analyzeNode)

// // 检查短链路是否有任何活动
// const shortChainActive = computed(() => {
//   return props.shortSteps.some(step => step.active || step.completed)
// })

// // 检查长链路是否有任何活动
// const longChainActive = computed(() => {
//   return Object.values(props.longSteps).some(stage =>
//     stage.steps && stage.steps.some(step => step.active || step.completed)
//   )
// })

// 提取长链路各个阶段的steps
const stage1Steps = computed(() => props.longSteps.stage1?.steps || [])
const stage2Steps = computed(() => props.longSteps.stage2?.steps || [])
const stage3Steps = computed(() => props.longSteps.stage3?.steps || [])
const stage4Steps = computed(() => props.longSteps.stage4?.steps || [])
const stage5Steps = computed(() => props.longSteps.stage5?.steps || [])
const stage6Steps = computed(() => props.longSteps.stage6?.steps || [])
const stage7Steps = computed(() => props.longSteps.stage7?.steps || [])

// 映射短链路步骤
const mapShortStepToNode = (step) => {
  const duration = step.duration ? parseFloat(step.duration) : 0
  return {
    id: step.id,
    title: step.title,
    status: step.active ? 'running' :
            step.completed ? 'completed' :
            step.skipped ? 'skipped' : 'pending',
    isLLM: step.type === 'llm',
    time: duration,
    tokens: step.tokens || 0,
    error: step.error || null,
    details: step.details || []
  }
}

// 映射长链路步骤
const mapLongStepToNode = (step) => {
  const duration = step.duration ? parseFloat(step.duration) : 0
  const details = []

  if (step.details && Array.isArray(step.details)) {
    details.push(...step.details)
  } else {
    if (step.type === 'llm') {
      if (step.completed || step.active) {
        details.push(`Model invocation succeeded, processing completed`)
        if (step.tokens) {
          details.push(`Input Tokens: ${Math.floor(step.tokens * 0.6)}, Output Tokens: ${Math.floor(step.tokens * 0.4)}`)
        }
        if (duration > 0) {
          details.push(`Response Time: ${duration.toFixed(2)} s`)
        }
      }
    } else {
      if (step.completed || step.active) {
        details.push(`Computation completed`)
        if (duration > 0) {
          details.push(`Execution Time: ${duration.toFixed(2)} s`)
        }
      }
    }
  }

  return {
    id: step.id,
    title: step.title,
    type: step.type === 'llm' ? 'llm' : 'computation',
    status: step.active ? 'running' :
            step.completed ? 'completed' :
            step.skipped ? 'skipped' : 'pending',
    isLLM: step.type === 'llm',
    time: duration,
    tokens: step.tokens || 0,
    error: step.error || null,
    details: details
  }
}

// Get compare data for short chain (compare with original long chain)
const getCompareDataForShort = (step) => {
  if (step.title !== 'Generate DSL') return null

  // Find the corresponding "Generate DSL" step in original long chain (stage7)
  const longDSLStep = props.originalLongSteps?.stage7?.steps?.find(s => s.title === 'Generate DSL')
  if (!longDSLStep || !longDSLStep.completed) return null

  return {
    chainName: 'DSL Produced by Long-chain(Baseline)',
    details: longDSLStep.details || []
  }
}

// Get compare data for long chain (compare with original long chain, not short chain)
const getCompareDataForLong = (step) => {
  if (step.title !== 'Generate DSL') return null

  // Find the corresponding "Generate DSL" step in original long chain (stage7)
  const originalLongDSLStep = props.originalLongSteps?.stage7?.steps?.find(s => s.title === 'Generate DSL')
  if (!originalLongDSLStep || !originalLongDSLStep.completed) return null

  return {
    chainName: 'DSL Produced by Long-chain(Baseline)',
    details: originalLongDSLStep.details || []
  }
}
</script>

<style scoped>
.optimized-chain-flow-container {
  width: 100%;
  height: 100%;
  padding: 12px;
}

.optimized-chain-flow {
  display: flex;
  align-items: center;
  gap: 32px;
  min-width: fit-content;
  height: 100%;
}

/* Left side: Query Analyze Section */
.analyze-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 12px;
}

/* Cache Status Indicator */
.cache-status-indicator {
  display: flex;
  justify-content: center;
  width: 100%;
}

.cache-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: slideDown 0.5s ease-out;
}

.cache-hit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.cache-miss {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.cache-status:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.analyze-node {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%);
  /* border: 2px solid rgba(16, 185, 129, 0.3); */
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
  transition: all 0.3s ease;
}

.analyze-node:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.2) 100%);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

/* Right side: Chains Section */
.chains-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  position: relative;
  padding-left: 80px;
}

/* Branch Connection Lines */
.branch-connections {
  position: absolute;
  width: 80px;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
}

.connection-path {
  stroke: rgba(16, 185, 129, 0.5);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.3s ease;
}

.arrow-head {
  fill: rgba(16, 185, 129, 0.6);
  transition: fill 0.3s ease;
}

/* Hover effect for connection lines */
.chains-section:hover .connection-path {
  stroke: rgba(16, 185, 129, 0.7);
}

.chains-section:hover .arrow-head {
  fill: rgba(16, 185, 129, 0.8);
}

/* Parallel Chains Container */
.parallel-chains {
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
  min-width: 0;
}

/* Chain Path */
.chain-path {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.path-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-secondary);
  padding: 4px 12px;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
}

.short-path .path-label {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.long-path .path-label {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Path Flow */
.path-flow {
  height: 100%;
}

.path-flow :deep(.el-scrollbar__wrap) {
  overflow-x: auto;
  overflow-y: hidden;
}

.path-flow-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  min-width: fit-content;
}

/* 短链路特定的流程内容样式 */
.short-path .path-flow-content {
  gap: 32px; /* 增加间距以便连接线更明显 */
}

/* Short Chain Specific Styles */
.short-path .flow-column {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.short-path .flow-column:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -32px;
  transform: translateY(-50%);
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.8) 100%);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
  z-index: 1;
}

/* 添加箭头 */
.short-path .flow-column:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -16px;
  transform: translateY(-50%) translateX(22px);
  width: 0;
  height: 0;
  border-left: 5px solid rgba(16, 185, 129, 0.8);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  z-index: 2;
}

/* Long Chain Group Styles */
.long-path .flow-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
}

.flow-group-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 2px dashed rgba(245, 158, 11, 0.3);
  background-color: transparent;
  transition: all 0.3s ease;
}

.group-title {
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
  text-align: center;
  margin-bottom: 2px;
  white-space: nowrap;
}

.flow-node {
  width: 140px;
}

.flow-arrow-column {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
}

.arrow-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(245, 158, 11, 0.3) 100%);
}
</style>
