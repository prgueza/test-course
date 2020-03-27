import { shallowMount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter test suite', () => {

  describe(`@click | Cuando el usuario hace click en el botón`, () => {
    it('El contador incrementa su valor en 1', async () => {
      const wrapper = shallowMount(Counter)
      const counter_0 = wrapper.vm.counter // Valor del contador en el momento inicial
      const button = wrapper.find({ ref: 'button' }) // Buscamos el botóno
      button.trigger('click') // Provocamos el evento
      // await wrapper.vm.$nextTick() // Esperamos al siguiente ciclo
      expect(wrapper.vm.counter).toBe(counter_0 + 1) // Comprobamos el resultado
    })
  })

})
