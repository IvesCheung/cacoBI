import { reactive } from 'vue'

// Centralized reactive state for chain steps and active selection
const state = reactive({
  optimizedTime: 0,
  traditionalTime: 0,
  shortActiveStep: null,
  longActiveStep: null,
  running: false,
  shortSteps: [
    { id: 1, name: '向量化用户问题', active: false },
    { id: 2, name: '检索向量相关问题', active: false },
    { id: 3, name: '根据cache生成DSL', active: false },
  ],
  longSteps: [
    { id: 1, name: '拆解用户问题', active: false },
    { id: 2, name: '召回相关表', active: false },
    { id: 3, name: '重排过滤表', active: false },
    { id: 4, name: '召回表内相关字段', active: false },
    { id: 5, name: '生成DSL', active: false },
  ],
})

function activateShortStep(stepId) {
  state.shortActiveStep = stepId
  state.shortSteps.forEach((s) => {
    s.active = s.id === stepId
  })
}

function activateLongStep(stepId) {
  state.longActiveStep = stepId
  state.longSteps.forEach((s) => {
    s.active = s.id === stepId
  })
}

function resetSteps() {
  state.shortActiveStep = null
  state.longActiveStep = null
  state.shortSteps.forEach((s) => {
    s.active = false
  })
  state.longSteps.forEach((s) => {
    s.active = false
  })
}

async function simulateShortChain(stepDelay = 300) {
  state.running = true
  resetSteps()
  const start = performance.now()
  for (const step of state.shortSteps) {
    activateShortStep(step.id)
    await new Promise((r) => setTimeout(r, stepDelay))
  }
  state.optimizedTime = ((performance.now() - start) / 1000).toFixed(2)
  state.running = false
}

async function simulateLongChain(stepDelay = 400) {
  state.running = true
  resetSteps()
  const start = performance.now()
  for (const step of state.longSteps) {
    activateLongStep(step.id)
    await new Promise((r) => setTimeout(r, stepDelay))
  }
  state.traditionalTime = ((performance.now() - start) / 1000).toFixed(2)
  state.running = false
}

async function runBoth(shortDelay = 300, longDelay = 400) {
  // Run in parallel
  await Promise.all([simulateShortChain(shortDelay), simulateLongChain(longDelay)])
}

export function useChainStore() {
  return {
    state,
    activateShortStep,
    activateLongStep,
    resetSteps,
    simulateShortChain,
    simulateLongChain,
    runBoth,
  }
}
