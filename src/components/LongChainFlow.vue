<template>
  <div class="long-chain-flow-container">
    <div class="long-chain-flow">
      <!-- Column 1: 配置解析 (stage1) -->
      <div class="flow-column">
        <div class="flow-group-box">
          <div class="group-title">配置解析</div>
          <LongChainNode
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
        <div class="flow-group-box purple-box">
          <div class="group-title">表召回</div>
          <LongChainNode
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
        <LongChainNode
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
        <div class="flow-group-box purple-box">
          <div class="group-title">单表知识召回</div>
          <LongChainNode
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
          <div class="group-title">召回Rerank</div>
          <LongChainNode
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
          <div class="group-title">配置解析</div>
          <LongChainNode
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
        <LongChainNode
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
import LongChainNode from './LongChainNode.vue';

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
    stage1: newSteps.stage1?.steps.map(s => ({ id: s.id, status: s.status })),
    stage2: newSteps.stage2?.steps.map(s => ({ id: s.id, status: s.status })),
    stage3: newSteps.stage3?.steps.map(s => ({ id: s.id, status: s.status })),
    stage4: newSteps.stage4?.steps.map(s => ({ id: s.id, status: s.status })),
    stage5: newSteps.stage5?.steps.map(s => ({ id: s.id, status: s.status })),
    stage6: newSteps.stage6?.steps.map(s => ({ id: s.id, status: s.status })),
    stage7: newSteps.stage7?.steps.map(s => ({ id: s.id, status: s.status })),
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

  console.log('All steps:', allStages.map(s => ({ id: s.id, status: s.status })));

  const activeStep = allStages.find(step => step.status === 'active');

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
      if (step.status === 'completed' || step.status === 'active') {
        details.push(`模型调用成功，处理完成`);
        if (step.tokens) {
          details.push(`输入Token: ${Math.floor(step.tokens * 0.6)}, 输出Token: ${Math.floor(step.tokens * 0.4)}`);
        }
        if (duration > 0) {
          details.push(`响应时间: ${duration.toFixed(2)}秒`);
        }
      }
    } else {
      // 计算类型节点
      if (step.status === 'completed' || step.status === 'active') {
        details.push(`计算处理完成`);
        if (duration > 0) {
          details.push(`执行耗时: ${duration.toFixed(2)}秒`);
        }
      }
    }

    // 根据步骤ID添加特定的详细信息
    if (step.id.includes('parse') || step.id.includes('config')) {
      details.push(`配置参数已解析并验证`);
    } else if (step.id.includes('recall') || step.id.includes('retrieve')) {
      details.push(`成功召回相关数据`);
    } else if (step.id.includes('select') || step.id.includes('choose')) {
      details.push(`数据筛选完成`);
    } else if (step.id.includes('rerank')) {
      details.push(`排序优化完成`);
    } else if (step.id.includes('dsl') || step.id.includes('convert')) {
      details.push(`DSL转换成功`);
    }
  }

  const mapped = {
    id: step.id,
    title: step.title,
    type: step.type === 'llm' ? 'llm' : 'computation',
    status: step.status === 'active' ? 'running' : step.status === 'completed' ? 'completed' : 'pending',
    isLLM: step.type === 'llm',
    time: duration,
    tokens: step.tokens || 0,
    error: step.error || null,
    details: details
  };

  console.log(`Mapping step ${step.id}:`, {
    originalStatus: step.status,
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
  overflow-x: auto;
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
  border: 1px dashed #4a5568;
  background-color: rgba(15, 23, 42, 0.5);
  position: relative;
}

.purple-box {
    border-color: #8b5cf6;
    background-color: rgba(91, 33, 182, 0.1);
}

.group-title {
  font-size: 12px;
  font-weight: bold;
  color: #a0aec0;
  text-align: center;
  margin-bottom: 4px;
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
