// import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Test Button.vue', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('test Props',() => {
    test('default size', async () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.size).toEqual('default')
    })
    test('label Empty', async () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.size).toBeFalsy()
    })
  })
})

