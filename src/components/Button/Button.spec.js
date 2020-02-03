import { shallowMount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button test suite', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Template rendering', () => {

    test('Clicking the button calls the handleClick method', () => {
      // ...
    })

    test('Button has "c-button--medium" class modifier when size prop is "medium"', () => {
      // ...
    })

    test('Label gets printed within the button', () => {
      // ...
    })

  })

  describe('Data and Props',() => {

    test('Default value for the "size" prop is an empty string', () => {
      // ...
    })

    test('Default value for the "label" prop is an empty string', () => {
      // ...
    })

    test('Default value for the "counter" data property is 0', () => {
      // ...
    })

    test.each([
      // ...
    ])('Validator for prop "size" works (value: %s => valid: %s)', (size, result) => {
      // ...
    })

  })

  describe('Computed properties',() => {

    describe('customClass',() => {

      test('"customClass" computed property returns an empty string when the "size" prop is not set', () => {
        // ...
      })

      test('"customClass" computed property returns a valid class modifier when prop is set', () => {
        // ...
      })

    })

  })

  describe('Methods',() => {

    describe('handleClick',() => {
      test('Calling the "handleClick" methods increments the "counter" by 1', () => {
        // ...
      })

      test('Calling the "handleClick" methods emits and event named "click" with "button clicked!" as argument', () => {
        // ...
      })

    })

  })

})
