<template>
  <div class="long-chain-flow-container">
    <div class="long-chain-flow">
      <!-- Column 1: 配置解析 (stage1) -->
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">Query Parsing</div>
          <ChainNode
            v-for="step in stage1Steps"
            :key="step.id"
            :node="mapStepToNode(step)"
            class="flow-node"
          />
        </div>
      </div>

      <!-- Arrow 1 -->
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>

      <!-- Column 2: 表召回 (stage2) -->
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">Table Retrieval</div>
          <ChainNode
            v-for="step in stage2Steps"
            :key="step.id"
            :node="mapStepToNode(step)"
            class="flow-node"
          />
        </div>
      </div>

      <!-- Arrow 2 -->
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>

      <!-- Column 3: 选表 (stage3) -->
      <div class="flow-column">
        <ChainNode
          v-for="step in stage3Steps"
          :key="step.id"
          :node="mapStepToNode(step)"
          class="flow-node"
        />
      </div>

      <!-- Arrow 3 -->
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>

      <!-- Column 4: 单表知识召回 (stage4) & Rerank (stage5) -->
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">In-Table Knowledge Retrieval</div>
          <ChainNode
            v-for="step in stage4Steps"
            :key="step.id"
            :node="mapStepToNode(step)"
            class="flow-node"
          />
        </div>
      </div>
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">Retrieval Rerank</div>
          <ChainNode
            v-for="step in stage5Steps"
            :key="step.id"
            :node="mapStepToNode(step)"
            class="flow-node"
          />
        </div>
      </div>
      <!-- Arrow 4 -->
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>

      <!-- Column 5: 配置解析 (stage6) -->
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">DSL Configuring</div>
          <ChainNode
            v-for="step in stage6Steps"
            :key="step.id"
            :node="mapStepToNode(step)"
            class="flow-node"
          />
        </div>
      </div>

      <!-- Arrow 5 -->
      <div class="flow-arrow-column">
        <div class="arrow-line"></div>
      </div>

      <!-- Column 6: DSL转换 (stage7) -->
      <div class="flow-column">
        <ChainNode
          v-for="step in stage7Steps"
          :key="step.id"
          :node="mapStepToNode(step)"
          class="flow-node"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue';
import ChainNode from './ChainNode.vue';

const props = defineProps({
  steps: {
    type: Object,
    required: true
  }
});

// 提取各个阶段的steps
const stage1Steps = computed(() => props.steps.stage1?.steps || []);
const stage2Steps = computed(() => props.steps.stage2?.steps || []);
const stage3Steps = computed(() => props.steps.stage3?.steps || []);
const stage4Steps = computed(() => props.steps.stage4?.steps || []);
const stage5Steps = computed(() => props.steps.stage5?.steps || []);
const stage6Steps = computed(() => props.steps.stage6?.steps || []);
const stage7Steps = computed(() => props.steps.stage7?.steps || []);

// 调试：监听 steps 变化
watch(() => props.steps, (newSteps) => {
  console.log('LongChainFlow: steps changed', {
    stage1: newSteps.stage1?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage2: newSteps.stage2?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage3: newSteps.stage3?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage4: newSteps.stage4?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage5: newSteps.stage5?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage6: newSteps.stage6?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
    stage7: newSteps.stage7?.steps.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })),
  });

  // 自动滚动到正在执行的节点
  nextTick(() => {
    scrollToActiveNode();
  });
}, { deep: true });

// 滚动到正在执行的节点
const scrollToActiveNode = () => {
  // 查找所有 active 状态的节点
  const allStages = [
    ...(props.steps.stage1?.steps || []),
    ...(props.steps.stage2?.steps || []),
    ...(props.steps.stage3?.steps || []),
    ...(props.steps.stage4?.steps || []),
    ...(props.steps.stage5?.steps || []),
    ...(props.steps.stage6?.steps || []),
    ...(props.steps.stage7?.steps || [])
  ];

  console.log('All steps:', allStages.map(s => ({ id: s.id, active: s.active, completed: s.completed, skipped: s.skipped })));

  const activeStep = allStages.find(step => step.active);

  console.log('Active step found:', activeStep);

  if (activeStep) {
    // 查找对应的 DOM 元素
    const nodeElement = document.querySelector(`[data-node-id="${activeStep.id}"]`);
    console.log('Node element found:', nodeElement);

    if (nodeElement) {
      // 找到滚动容器（.long-chain-flow-container 或 .panel-body）
      const scrollContainer = nodeElement.closest('.long-chain-flow-container');

      if (scrollContainer) {
        // 计算节点相对于容器的位置
        const containerRect = scrollContainer.getBoundingClientRect();
        const nodeRect = nodeElement.getBoundingClientRect();

        // 计算需要滚动的距离，使节点居中显示
        const scrollLeft = scrollContainer.scrollLeft +
                          (nodeRect.left - containerRect.left) -
                          (containerRect.width / 2) +
                          (nodeRect.width / 2);

        // 平滑滚动到目标位置
        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });

        console.log('Scrolled to active node:', activeStep.id);
      } else {
        console.warn('Scroll container not found');
      }
    } else {
      console.warn('Node element not found for id:', activeStep.id);
    }
  } else {
    console.log('No active step found');
  }
};

// 将step对象映射为node对象，适配LongChainNode组件的props
const mapStepToNode = (step) => {
  // 将 duration 转换为数字
  const duration = step.duration ? parseFloat(step.duration) : 0;

  // 生成详细信息数组
  const details = [];

  // 如果有原始数据中的 details，使用它
  if (step.details && Array.isArray(step.details)) {
    details.push(...step.details);
  } else {
    // 根据不同的步骤类型生成示例详细信息
    if (step.type === 'llm') {
      if (step.completed || step.active) {
        details.push(`Model invocation succeeded, processing completed`);
        if (step.tokens) {
          details.push(`Input Tokens: ${Math.floor(step.tokens * 0.6)}, Output Tokens: ${Math.floor(step.tokens * 0.4)}`);
        }
        if (duration > 0) {
          details.push(`Response Time: ${duration.toFixed(2)} s`);
        }
      }
    } else {
      // 计算类型节点
      if (step.completed || step.active) {
        details.push(`Computation completed`);
        if (duration > 0) {
          details.push(`Execution Time: ${duration.toFixed(2)} s`);
        }
      }
    }

    // 根据步骤ID添加特定的详细信息
    if (step.id.includes('parse') || step.id.includes('config')) {
      details.push(`Configuration parameters have been parsed and validated`);
    } else if (step.id.includes('recall') || step.id.includes('retrieve')) {
      details.push(`Successfully recalled relevant data`);
    } else if (step.id.includes('select') || step.id.includes('choose')) {
      details.push(`Data filtering completed`);
    } else if (step.id.includes('rerank')) {
      details.push(`Ranking optimization completed`);
    } else if (step.id.includes('dsl') || step.id.includes('convert')) {
      details.push(`DSL conversion succeeded`);
    }
  }

  const mapped = {
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
  };

  console.log(`Mapping step ${step.id}:`, {
    active: step.active,
    completed: step.completed,
    skipped: step.skipped,
    mappedStatus: mapped.status,
    duration: step.duration,
    parsedDuration: duration,
    tokens: step.tokens,
    detailsCount: details.length
  });

  return mapped;
};
</script><style scoped>
.long-chain-flow-container {
  width: 100%;
  padding: 16px;
}

.long-chain-flow {
  display: flex;
  align-items: center;
  gap: 16px;
}

.flow-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.flow-group-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 3px dashed rgba(74, 85, 104, 0.3);
  background-color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.purple-box {
    border-color: rgba(139, 92, 246, 0.3);
    background-color: transparent;
}

.group-title {
  font-size: 12px;
  font-weight: bold;
  color: var(--app-text-secondary);
  text-align: center;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.flow-node {
  width: 150px;
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
  background-color: #4a5568;
}
</style>
