import { shallowMount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter test suite', () => {

  const sampleInitialValue = 4
  describe(`:initialValue | Cuando se pasa ${sampleInitialValue} como valor inicial`, () => {
    const wrapper = shallowMount(Counter, { propsData: { initialValue: sampleInitialValue } })
    it(`El valor del contador es ${sampleInitialValue}`, () => {
      expect(wrapper.vm.count).toBe(sampleInitialValue)
    })
    it('El contador incrementa su valor en 1', () => {
      const p = wrapper.find({ ref: 'count' }) // Buscamos el elemento donde debe pintarse
      expect(Number(p.text())).toBe(sampleInitialValue) // Comprobamos que el texto coincide
    })
  })

  describe(`:initialValue | Configuración de la prop`, () => {
    it(`La prop tiene como valor por defecto 0 y es de tipo Number`, () => {
      const wrapper = shallowMount(Counter)
      const prop = wrapper.vm.$options.props.initialValue
      expect(prop.isRequired).toBeFalsy() // En nuestro caso no es obligatoria
      expect(prop.default).toBe(0) // Tiene 0 como valor por defecto
      expect(prop.type).toBe(Number) // Es de tipo Number
      expect(prop.validator(-10)).toBe(false) // No admite números negativos
    })
  })

})
