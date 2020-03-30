import { shallowMount } from '@vue/test-utils'
import List from './List.vue'

describe('List test suite', () => {

  const elements = [1, 2, 3, 4, 5]
  describe(`:elements | La lista renderiza ${elements.length} elementos si existen, o no se renderiza si no hay elementos`, () => {

    const wrapper = shallowMount(List, { propsData: { elements } })
    it(`La lista renderiza ${elements.length} elementos`, () => {
      const listElements = wrapper.findAll('li') // Buscamos todos los elementos li (devuelve un wrapperArray)
      expect(listElements.length).toBe(elements.length) // Comprobamos con el número de elementos que llegan al componente como prop
    })

    it(`La lista no renderiza ningún elemento si no se pasan como prop`, async () => {
      wrapper.setProps({ elements: [] })
      await wrapper.vm.$nextTick()
      const renderedList = wrapper.find('ul').exists() // Preguntamos si existe el elemento ul (devuelve true/false)
      expect(renderedList).toBe(false) // Comprobamos que no existe el elementu <ul>
    })

  })

})
