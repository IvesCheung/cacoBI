<template>
  <div
    class="short-chain-node-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="wrapperEl"
  >
    <div
      class="short-chain-node"
      :class="[`status-${mappedStatus}`, { 'is-llm': isLLM } ]"
      @click="handleClick"
      :data-node-id="id"
    >
      <div class="node-header">
        <div class="node-icon">
          <el-icon v-if="mappedStatus === 'completed'"><CircleCheck /></el-icon>
          <el-icon v-else-if="mappedStatus === 'running'" class="spinning"><Loading /></el-icon>
          <el-icon v-else><Clock /></el-icon>
        </div>
        <div class="node-title" :title="title">{{ title }}</div>
      </div>

      <div v-if="mappedStatus !== 'pending'" class="node-stats">
        <div v-if="duration > 0" class="stat-item">
          <el-icon class="stat-icon"><Timer /></el-icon>
          <span>{{ duration.toFixed(2) }}s</span>
        </div>
        <div v-if="tokens > 0" class="stat-item">
          <el-icon class="stat-icon"><Coin /></el-icon>
          <span>{{ tokens }}</span>
        </div>
      </div>
    </div>

    <teleport to="body">
      <transition name="detail-fade">
        <div
          v-if="showDetails && (mappedStatus === 'running' || mappedStatus === 'completed')"
          class="node-detail-popup fixed-popup"
          :class="{ 'placement-below': !popupPlacementAbove }"
          @mouseenter="handlePopupEnter"
          @mouseleave="handlePopupLeave"
          :style="popupStyle"
        >
          <div class="popup-header">
            <span class="popup-title">{{ title }}</span>
            <el-icon class="close-icon" @click.stop="closeDetail"><Close /></el-icon>
          </div>

          <div class="popup-stats">
            <div v-if="duration > 0" class="stat-item">
              <el-icon><Timer /></el-icon>
              <span class="stat-label">耗时</span>
              <span class="stat-value">{{ duration.toFixed(2) }}s</span>
            </div>
            <div v-if="tokens > 0" class="stat-item">
              <el-icon><Coin /></el-icon>
              <span class="stat-label">Token</span>
              <span class="stat-value">{{ tokens }}</span>
            </div>
          </div>

          <div v-if="details && details.length" class="popup-details">
            <div v-for="(d, i) in details" :key="i" class="detail-line">
              <el-icon class="detail-icon"><Document /></el-icon>
              <span>{{ d }}</span>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { CircleCheck, Loading, Clock, Coin, Timer, Close, Document } from '@element-plus/icons-vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  tokens: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  details: { type: Array, default: () => [] }
})

const isLLM = computed(() => props.title.includes('DSL') || props.title.includes('向量') )
const mappedStatus = computed(() => props.completed ? 'completed' : props.active ? 'running' : 'pending')

const showDetails = ref(false)
const isLocked = ref(false)
const wrapperEl = ref(null)
const popupLeft = ref(0)
const popupTop = ref(0)
const popupPlacementAbove = ref(true)

const popupStyle = computed(() => ({ left: popupLeft.value + 'px', top: popupTop.value + 'px' }))

const computePopupPosition = () => {
  if (!wrapperEl.value) return
  const rect = wrapperEl.value.getBoundingClientRect()
  popupPlacementAbove.value = rect.top > 220
  const gap = 12
  popupLeft.value = rect.left + rect.width / 2
  popupTop.value = popupPlacementAbove.value ? rect.top - gap : rect.bottom + gap
}

const handleMouseEnter = () => {
  if (!isLocked.value && (props.active || props.completed)) {
    showDetails.value = true
    nextTick(() => computePopupPosition())
  }
}
const handleMouseLeave = () => { if (!isLocked.value) showDetails.value = false }
const handleClick = () => {
  if (props.active || props.completed) {
    isLocked.value = !isLocked.value
    showDetails.value = isLocked.value
    if (showDetails.value) nextTick(() => computePopupPosition())
  }
}
const handlePopupEnter = () => {}
const handlePopupLeave = () => { if (!isLocked.value) showDetails.value = false }
const closeDetail = () => { isLocked.value = false; showDetails.value = false }
</script>

<style scoped>
.short-chain-node-wrapper { position: relative; display: inline-block; z-index: 5; }
.short-chain-node { background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%); border-radius: 8px; padding: 8px 12px; border: 2px solid rgba(16,185,129,0.3); transition: all .3s cubic-bezier(.4,0,.2,1); min-width:140px; max-width:170px; cursor:pointer; position:relative; }
.short-chain-node.status-pending { opacity:.45; border-color: rgba(16,185,129,0.15); }
.short-chain-node.status-running { border-color:#10b981; box-shadow:0 0 25px rgba(16,185,129,.45); animation: greenPulse 2s ease-in-out infinite; }
.short-chain-node.status-completed { border-color: rgba(34,197,94,.85); background: linear-gradient(145deg, rgba(5,150,105,.45) 0%, rgba(6,78,59,.65) 100%); box-shadow:0 0 18px rgba(34,197,94,.4); }
@keyframes greenPulse { 0%,100% { box-shadow:0 0 25px rgba(16,185,129,.55); } 50% { box-shadow:0 0 35px rgba(16,185,129,.85);} }
.node-header { display:flex; align-items:center; gap:8px; }
.node-icon { font-size:18px; flex-shrink:0; }
.status-running .node-icon { color:#10b981; }
.status-completed .node-icon { color:#22c55e; }
.node-title { font-size:12px; font-weight:600; color:#e2e8f0; line-height:1.3; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.node-stats { display:flex; align-items:center; gap:8px; margin-top:6px; padding-top:6px; border-top:1px solid rgba(16,185,129,.3); }
.node-stats .stat-item { display:flex; align-items:center; gap:4px; font-size:11px; color:#94a3b8; }
.node-stats .stat-icon { font-size:13px; color:#10b981; }
.short-chain-node:hover:not(.status-pending) { transform: translateY(-2px); box-shadow:0 8px 16px rgba(0,0,0,.35); }
.node-detail-popup.fixed-popup { position:fixed; transform:translateX(-50%); background: linear-gradient(145deg, rgba(15,23,42,.98) 0%, rgba(30,41,59,.98) 100%); border:2px solid rgba(16,185,129,.6); border-radius:12px; padding:16px; min-width:300px; max-width:380px; box-shadow:0 10px 40px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.08),0 0 20px rgba(16,185,129,.35); z-index:10000; backdrop-filter:blur(20px); pointer-events:auto; }
.node-detail-popup.fixed-popup::after, .node-detail-popup.fixed-popup::before { content:''; position:absolute; left:50%; transform:translateX(-50%); }
.node-detail-popup.fixed-popup::after { width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; }
.node-detail-popup.fixed-popup.placement-below::after { top:-10px; border-bottom:10px solid rgba(16,185,129,.6); }
.node-detail-popup.fixed-popup:not(.placement-below)::after { bottom:-10px; border-top:10px solid rgba(16,185,129,.6); }
.node-detail-popup.fixed-popup::before { width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; }
.node-detail-popup.fixed-popup.placement-below::before { top:-8px; border-bottom:8px solid rgba(15,23,42,.98); }
.node-detail-popup.fixed-popup:not(.placement-below)::before { bottom:-8px; border-top:8px solid rgba(15,23,42,.98); }
.popup-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:10px; border-bottom:2px solid rgba(16,185,129,.3); }
.popup-title { font-size:14px; font-weight:700; color:#f1f5f9; letter-spacing:.3px; }
.close-icon { cursor:pointer; color:#94a3b8; font-size:16px; padding:2px; border-radius:4px; transition:all .3s ease; }
.close-icon:hover { color:#f1f5f9; background:rgba(148,163,184,.1); transform:rotate(90deg); }
.popup-stats { display:flex; gap:12px; margin-bottom:12px; }
.popup-stats .stat-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px; background:linear-gradient(135deg, rgba(16,185,129,.15) 0%, rgba(34,197,94,.15) 100%); border-radius:8px; border:1px solid rgba(16,185,129,.35); }
.popup-stats .stat-item .el-icon { font-size:18px; color:#10b981; }
.stat-label { font-size:11px; color:#94a3b8; font-weight:500; }
.stat-value { font-size:14px; color:#f1f5f9; font-weight:700; }
.popup-details { display:flex; flex-direction:column; gap:8px; }
.detail-line { display:flex; align-items:flex-start; gap:8px; font-size:12px; color:#cbd5e1; line-height:1.5; padding:8px; background:linear-gradient(135deg, rgba(16,185,129,.08) 0%, rgba(34,197,94,.08) 100%); border-radius:6px; border-left:3px solid rgba(16,185,129,.5); }
.detail-icon { color:#10b981; font-size:14px; flex-shrink:0; margin-top:2px; }
.detail-fade-enter-active { transition: all .25s cubic-bezier(.4,0,.2,1); }
.detail-fade-leave-active { transition: all .2s cubic-bezier(.4,0,.2,1); }
.detail-fade-enter-from { opacity:0; transform:translateX(-50%) translateY(10px); }
.detail-fade-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
</style>
