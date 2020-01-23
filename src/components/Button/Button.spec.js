import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Button from './Button'

describe('Button test suite', () => {

  /* TEMPLATE RELATED TESTS */
  describe('Template rendering', () => {
    // ...
  })

  /* DATA RELATED TESTS */
  describe('Data and Props', () => {
    // ...
  })

  /* COMPUTED PROPERTIES RELATED TESTS */
  describe('Computed properties', () => {
    describe('Computed property A', () => {
      test('', () => {  
        const wrapper = shallowMount(Button)
        expect(wrapper.customClass).toBeUndefined()
      })
    })
    // ...
  })

  /* METHODS RELATED TESTS */
  describe('Methods', () => {
    describe('Method A', () => {
      // ..
    })
    // ...
  })

  /* LIFECYCLE HOOKS RELATED TESTS */
  describe('Lifecycle hooks', () => {
    describe('Created hook', () => {
      // ...
    })
    // ...
  })

})
