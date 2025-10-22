import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChainFlow from '@/components/ChainFlow.vue'

describe('ChainFlow', () => {
  it('emits step-click when short chain step clicked', async () => {
    const wrapper = mount(ChainFlow)
    const firstShortStep = wrapper.findAll('.optimized .step-item')[0]
    await firstShortStep.trigger('click')
    const emitted = wrapper.emitted('step-click')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0].chain).toBe('short')
  })

  it('emits step-click when long chain step clicked', async () => {
    const wrapper = mount(ChainFlow)
    const firstLongStep = wrapper.findAll('.traditional .step-item')[0]
    await firstLongStep.trigger('click')
    const emitted = wrapper.emitted('step-click')
    const hasLong = emitted.some(e => e[0].chain === 'long')
    expect(hasLong).toBe(true)
  })
})
