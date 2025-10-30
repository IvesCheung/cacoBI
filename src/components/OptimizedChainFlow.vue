<template>
  <div class="optimized-chain-flow-container">
    <div class="optimized-chain-flow">
      <!-- Left side: Query Analyze Node -->
      <div class="analyze-section">
        <ChainNode
          :node="analyzeNode"
          class="analyze-node"
        />
      </div>

      <!-- Right side: Two parallel chains with branch arrows -->
      <div class="chains-section">
        <!-- Branch connection lines -->
        <div class="branch-connections">
          <div class="connection-line connection-to-short"></div>
          <div class="connection-line connection-to-long"></div>
        </div>

        <!-- Two parallel chains -->
        <div class="parallel-chains">
          <!-- Short Chain Path -->
          <div class="chain-path short-path">
            <div class="path-label">Short Chain</div>
            <div class="path-flow">
            <div
              v-for="step in shortSteps"
              :key="step.id"
              class="flow-column"
            >
              <ChainNode :node="mapShortStepToNode(step)" />
            </div>
          </div>
        </div>

        <!-- Long Chain Path -->
        <div class="chain-path long-path">
          <div class="path-label">Long Chain (Optimized)</div>
          <div class="path-flow">
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
                class="flow-node"
              />
            </div>
          </div>
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
  hitCache: { type: Boolean, default: false }
})

// Query Analyze Node - 决定走哪条链路
const analyzeNode = computed(() => ({
  id: 'query-analyze',
  title: 'Query Analyze',
  status: 'completed', // 分析节点始终完成
  isLLM: false,
  time: 0.08,
  tokens: 0,
  error: null,
  details: [
    'Analyze query complexity',
    'Determine optimal chain path',
    props.hitCache ? '✓ Hit cache - use short chain' : '✗ No cache - use long chain'
  ]
}))

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
</script>

<style scoped>
.optimized-chain-flow-container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
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
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.analyze-node {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%);
  border: 2px solid rgba(16, 185, 129, 0.3);
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
}

/* Branch Connection Lines */
.branch-connections {
  position: relative;
  width: 50px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-line {
  position: absolute;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.6) 50%, rgba(16, 185, 129, 0.2) 100%);
  height: 2px;
  left: 0;
  right: 0;
}

.connection-to-short {
  top: 25%;
  transform: translateY(-50%);
}

.connection-to-long {
  top: 75%;
  transform: translateY(-50%);
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
  display: flex;
  align-items: center;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 0;
}

/* Short Chain Specific Styles */
.short-path .flow-column:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 16px;
  height: 2px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.7) 100%);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

/* Long Chain Group Styles */
.flow-column {
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

/* Scrollbar Styles */
.optimized-chain-flow-container::-webkit-scrollbar {
  height: 6px;
}

.optimized-chain-flow-container::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 6px;
}

.optimized-chain-flow-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #8b5cf6, #6366f1);
  border-radius: 6px;
}

.optimized-chain-flow-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #a78bfa, #818cf8);
}

.path-flow::-webkit-scrollbar {
  height: 4px;
}

.path-flow::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.2);
  border-radius: 4px;
}

.path-flow::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 4px;
}
</style>
