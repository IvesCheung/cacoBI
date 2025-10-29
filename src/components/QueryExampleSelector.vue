<template>
  <div class="query-example-selector">
    <el-select
      v-model="selectedExampleId"
      placeholder="select query example"
      @change="handleExampleChange"
      :disabled="isExecuting"
      class="example-selector"
    >
      <el-option
        v-for="example in exampleList"
        :key="example.id"
        :label="example.name"
        :value="example.id"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getQueryExampleList } from '@/data/queryExamples'

// 接收props
const props = defineProps({
  currentExampleId: {
    type: String,
    required: true,
  },
  isExecuting: {
    type: Boolean,
    default: false,
  },
})

// 定义emits
const emit = defineEmits(['change'])

// 获取所有查询示例列表
const exampleList = ref(getQueryExampleList())

// 当前选中的示例ID
const selectedExampleId = ref(props.currentExampleId)

// 监听props变化
watch(
  () => props.currentExampleId,
  (newVal) => {
    selectedExampleId.value = newVal
  }
)

// 处理选择变化
const handleExampleChange = (exampleId) => {
  emit('change', exampleId)
}

// 组件挂载时初始化
onMounted(() => {
  selectedExampleId.value = props.currentExampleId
})
</script>

<style scoped>
.query-example-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.example-selector {
  min-width: 200px;
}

:deep(.el-select__wrapper) {
  transition: all 0.3s ease;
}

:deep(.el-select__wrapper:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-select__wrapper.is-disabled) {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

