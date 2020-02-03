import { shallowMount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button test suite', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Template rendering', () => {

    test('Clicking the button calls the handleClick method', () => {
      const handleClickStub = jest.fn()
      const wrapper = shallowMount(Button, {
        methods: {
          handleClick: handleClickStub
        }
      })
      wrapper.find({ ref: 'c-button' }).trigger('click')
      expect(handleClickStub).toHaveBeenCalled()
    })

    test('Button has "c-button--medium" class modifier when size prop is "medium"', () => {
      const wrapper = shallowMount(Button, {
        propsData: {
          size: 'medium'
        }
      })
      expect(wrapper.find({ ref: 'c-button' }).classes('c-button--medium')).toBe(true)
    })

    test('Label gets printed within the button', () => {
      const labelStub = 'label'
      const wrapper = shallowMount(Button, {
        propsData: {
          label: labelStub
        }
      })
      expect(wrapper.find({ ref: 'c-button' }).text()).toBe(labelStub)
    })

  })

  describe('Data and Props',() => {

    test('Default value for the "size" prop is an empty string', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.size).toEqual('')
    })

    test('Default value for the "label" prop is an empty string', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.label).toBeFalsy()
    })

    test('Default value for the "counter" data property is 0', () => {
      const wrapper = shallowMount(Button)
      expect(wrapper.vm.counter).toEqual(0)
    })

    test.each([
      [ '', true ],
      [ 'small', true ],
      [ 'big', true ],
      [ 'medium', true ],
      [ 'wrongData', false ],
    ])('Validator for prop "size" works (value: %s => valid: %s)', (size, result) => {
      expect(Button.props.size.validator(size)).toBe(result)
    })

  })

  describe('Computed properties',() => {

    describe('customClass',() => {

      test('"customClass" computed property returns an empty string when the "size" prop is not set', () => {
        const wrapper = shallowMount(Button)
        expect(wrapper.vm.CustomClass).toBeFalsy()
      })

      test('"customClass" computed property returns a valid class modifier when prop is set', () => {
        const wrapper = shallowMount(Button)
        const props = { size: 'medium' }
        wrapper.setProps(props)
        expect(wrapper.vm.customClass).toEqual(`c-button--${props.size}`)
      })

    })

  })

  describe('Methods',() => {

    describe('handleClick',() => {
      test('Calling the "handleClick" methods increments the "counter" by 1', () => {
        const wrapper = shallowMount(Button)
        wrapper.vm.handleClick()
        expect(wrapper.vm.counter).toEqual(1)
      })

      test('Calling the "handleClick" methods emits and event named "click" with "button clicked!" as argument', () => {
        const $emitStub = jest.fn()
        const wrapper = shallowMount(Button, {
          mocks: {
            $emit: $emitStub
          }
        })
        wrapper.vm.handleClick()
        expect($emitStub).toHaveBeenCalledWith('click', 'button clicked!')
      })

    })

  })

})
