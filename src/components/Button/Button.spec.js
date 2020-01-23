import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button test suite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('Template rendering', () => {
    test('Button click call handleClick', () => {
      const handleClickStub = jest.fn()
      const wrapper = shallowMount(Button, {
        methods: {
          handleClick: handleClickStub
        }
      })
      wrapper.find({ref: 'c-button'}).trigger('click')
      expect(handleClickStub).toHaveBeenCalled()
    })
    test('Button has class c-button--medium', () => {
      const wrapper = shallowMount(Button, {
        propsData: {
          size: 'medium'
        }
      })
      expect(wrapper.find({ref: 'c-button'}).classes('c-button--medium')).toBe(true)
    })
    test('label is print', () => {
      const testLabel = 'test label'
      const wrapper = shallowMount(Button, {
        propsData: {
          label: testLabel
        }
      })
      expect(wrapper.find({ref: 'c-button'}).text()).toBe(testLabel)
    })
  })
  describe('Data and Props',() => {
    test('default size', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.size).toEqual('')
    })
    test('label Empty', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.label).toBeFalsy()
    })
    test.each([
      [ '', true],
      [ 'big', true],
      [ 'medium', true],
      [ 'small', true],
      [ 'wrongData', false],
    ])('Size validate with %s, return %s', (size, result) => {
      expect(Button.props.size.validator(size)).toBe(result)
    })
    test('Default counter value', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.counter).toEqual(0)
    })
  })

  describe('Computed properties',() => {
    describe('CustomClass',() => {
      test('CustomClass with medium value', () => {
        const propsValues = {size: 'medium'}
        const wrapper = shallowMount(Button)
        wrapper.setProps(propsValues)
        expect(wrapper.vm.customClass).toEqual(`c-button--${propsValues.size}`)
      })
      test('CustomClass with default value', () => {
        const wrapper = shallowMount(Button)
        expect(wrapper.vm.CustomClass).toBeFalsy()
      })
    })
  })
  describe('Methods',() => {
    describe('handleClick',() => {
      test('Increment counter', () => {
        const wrapper = shallowMount(Button)
        wrapper.vm.handleClick()
        expect(wrapper.vm.counter).toEqual(1)
      })
      test('Emit click', () => {
        const $emitStub = jest.fn()
        const wrapper = shallowMount(Button, {
          mocks: {
            $emit: $emitStub
          }
        })
        wrapper.vm.handleClick()
        expect($emitStub).toHaveBeenCalledWith('click', 'button clicked!!!')
      })
    })
  })
})

