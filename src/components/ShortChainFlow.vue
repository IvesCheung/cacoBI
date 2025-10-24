<template>
  <div class="short-chain-flow-container">
    <div class="short-chain-flow">
      <div
        v-for="step in steps"
        :key="step.id"
        class="flow-column"
      >
        <ShortChainNode
          :id="step.id"
          :title="step.title"
          :active="step.active"
          :completed="step.completed"
          :tokens="step.tokens"
          :duration="step.duration"
          :details="step.details || []"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShortChainNode from './ShortChainNode.vue'
defineProps({
  steps: { type: Array, required: true }
})
</script>

<style scoped>
.short-chain-flow-container { width:100%; height:100%; overflow-x:auto; display:flex; align-items:center; justify-content:center; padding:0 8px; }
.short-chain-flow { display:flex; align-items:center; gap:18px; position:relative; padding:4px 0; }
.flow-column { display:flex; flex-direction:column; align-items:center; gap:12px; position:relative; }
.flow-column:not(:last-child)::after { content:''; position:absolute; top:50%; right:-9px; transform:translateY(-50%); width:18px; height:2px; background:linear-gradient(90deg, rgba(16,185,129,.2) 0%, rgba(16,185,129,.7) 100%); box-shadow:0 0 6px rgba(16,185,129,.4); }
.short-chain-flow-container::-webkit-scrollbar { height:6px; }
.short-chain-flow-container::-webkit-scrollbar-track { background:rgba(15,23,42,.4); border-radius:6px; }
.short-chain-flow-container::-webkit-scrollbar-thumb { background:linear-gradient(90deg,#10b981,#059669); border-radius:6px; }
.short-chain-flow-container::-webkit-scrollbar-thumb:hover { background:linear-gradient(90deg,#34d399,#10b981); }
</style>
