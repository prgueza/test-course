
## Ejemplo buscar elementos en el DOM
Para los casos en los que tenemos que interactuar con algún elemento del DOM es más seguro agregarle an atributo ref, que por una query de clases ya que es más improbable que cambiemos una referencia que una clase.

ejemplo para el tempalte:
```javascript
<template lang="pug">
  doctype html
  ods-module.module-action
    div(slot="header", class="module-action__header")
      h2.module-action__title(ref="title") {{ title }}
      ods-button(
        v-if="actionButton",
        type="secondary",
        size="small",
        ref="actionButton",
        @click="$emit('action')",
        :disabled="disabledButton") {{ textActionButton }}
    template
      slot
</template>
<script>
export default {

  name: 'ModuleActionBtn',

  props: {

    title: {
      type: String,
      required: true,
      default: ''
    },

    textActionButton: {
      type: String,
      default: ''
    },

    disabledButton: {
      type: Boolean,
      default: false
    }

  },

  computed: {

    actionButton () {
      return this.textActionButton !== ''
    }

  }

}
</script>
```
el test podría ser:
```javascript
import { shallowMount } from '@vue/test-utils'
import ModuleActionBtn from '@/components/ModuleActionBtn'
describe('ModuleActionBtn', () => {
  test('if actionButton is false don´t mount action button', async () => {
    const wrapper = shallowMount(ModuleActionBtn, {
      propsData: {
        textActionButton: 'test' }
      })
    wrapper.setProps({ textActionButton: '' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find({ ref: 'actionButton' }).exists()).toBe(false)
  })
})

```
## Ejemplos reemplazar funcionalidades y propiedades de objetos

### Mockear propiedades de difícil acceso o control
Aquí teníamos el problema que necesitabamos acceder a un hijo del popover por referencia y no teniamos acceso por temas de como se monta el popover no sabemos cuando esta accesible etc.

```javascript
Object.defineProperty(cmp.vm, '$refs', {
  writable: true,
  value: {
    popover: {
      $refs: {
        popper: {
          style: {
            color: 'fadsfas'
          }
        }
      }
    }
  }
})
expect(cmp.vm.$refs.popover.$refs.popper.style.color).toBe('fadsfas')
cmp.vm.setColor()
expect(cmp.vm.$refs.popover.$refs.popper.style.color).toBe('pink')
```
### Probar un try catch

tenemos este código

```javascript
setColor () {
  const cell = this.$refs['status-cell']
  try {
    this.color
      ? cell.style.setProperty('--color', this.color)
      : cell.style.removeProperty('--color')
  } catch (e) {
    this.color
      ? cell.style.color = this.color
      : cell.style.color = ''
  }
}
```

Y parte de su test sería

```javascript
test('if component with the ref status-cell is enable and the color is empty and removeProperty faild', () => {
    const wrapper = shallowMount(StatusCell, { propsData: propsDataTestWithoutColor })
    const vm = wrapper.vm
    jest.spyOn(vm.$el.style, 'removeProperty').mockImplementation(() => {
      throw new Error('Error')
    })
    try {
      vm.setColor()
    } catch (e) {
      expect(wrapper.attributes('style')).toBe(undefined)
    }
  })
  test('if component with the ref status-cell is enable and the color is not empty and removeProperty fail', () => {
    const wrapper = shallowMount(StatusCell, { propsData: propsDataTestWithColor })
    const vm = wrapper.vm
    jest.spyOn(vm.$el.style, 'setProperty').mockImplementation(() => {
      throw new Error('Error')
    })
    vm.setColor()
    expect(wrapper.attributes('style')).toBe('color: rgb(255, 255, 255);')
  })
```

### Pisar una funcionalidad de un elemento del DOM

Por ejemplo style.removeProperty

```javascript
test('if component with the ref status-cell is enable and the color is empty', () => {
    const wrapper = shallowMount(StatusCell, { propsData: propsDataTestWithoutColor })
    const vm = wrapper.vm
    const removePropertyStub = jest.fn()
    jest.spyOn(vm.$el.style, 'removeProperty').mockImplementation(removePropertyStub)
    wrapper.vm.setColor()
    expect(removePropertyStub).toBeCalledWith('--color')
  })

```

### Reemplazando respuestas de llamandas a axios

Ejemplo de componente

```javascript
<template>
    <p v-if="weather">
        La temperatura actual en {{ weather.name }} es de {{ weather.temp | KelvinToCelsius }}
    </p>
    <p v-else>
        Sin datos de temperatura
    </p>

</template>

<script>
    import axios from 'axios'
    export default {
        name: 'weather',
        data() {
            return {
                weather: null
            }
        },
        filters: {
            KelvinToCelsius(kelvin) {
                return `${Math.round(kelvin-273.15)}ºC`;
            }
        },
        created(){
            return axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: 'Tudela',
                    appid: 'cf36ef5d9429a5452c230f9c97bab06d'
                },
            }).then( data => {
                const {name, main: {temp} } = data.data;
                this.weather = {name, temp};
            }).catch(() => {
                this.weather = null;
            })
        }
    }
</script>
```

Su test probando tanto la llamada correcta como el fallo en la respuesta sería

```javascript
import Weather from '@/components/Weather';
import axios from 'axios'
jest.mock('axios', () => ({
    get: jest.fn()
}));

describe('Weather.vue', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })
    describe('created', () => {
        test('axios api call ok', async () => {
            const weather = {
                name: 'Tudela',
                temp: 273.15
            }
            axios.get.mockImplementation(() => Promise.resolve({
                data: {
                    name: weather.name,
                    main: {
                        temp: weather.temp
                    }
                }
            }));
            let vmData = Weather.data();
            await Weather.created.call(vmData);
            expect(vmData.weather).toMatchObject(weather);
            expect(axios.get).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: 'Tudela',
                    appid: 'cf36ef5d9429a5452c230f9c97bab06d'
                }
            });
        })
        test('axios api call ko', async () => {
            axios.get.mockImplementation(() => Promise.reject());
            let vmData = Weather.data();
            await Weather.created.call(vmData);
            expect(vmData.weather).toBe(null);
        })
    })
    describe('filters', () => {
        test('KelvinToCelsius', () => {
            expect(Weather.filters.KelvinToCelsius(273.15)).toBe('0ºC');
        })
    })
})
```
Primero interceptamos todas las llamadas get de axios de forma global (esto se podria sacar a un archivo de utilidades)

```javascript
import axios from 'axios'
jest.mock('axios', () => ({
    get: jest.fn()
}));
```
```javascript
  axios.get.mockImplementation(() => Promise.reject());
```

Es interesante ver que podemos traernos al test el data predefinido ejecutando el nombreComponente.data()

```javascript
  let vmData = Weather.data();
```

Para poder validar que los datos se actuilzan como queremos en el then o el catch de la llamada tenemos que aislar la llamanda en un metodo para que ese metodo lo unico que haga es devolver la promesa de este modo dese jest lo único que deveremos hacer es tener un await al metodo para que nos ejecute el las comprobaciones del test hasta que se halla resuleto la llamada axios

```javascript
  created(){
    return axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
       q: 'Tudela',
       appid: 'cf36ef5d9429a5452c230f9c97bab06d'
      },
    }).then( data => {
      const {name, main: {temp} } = data.data;
      this.weather = {name, temp};
    }).catch(() => {
      this.weather = null;
    })
  }
```
```javascript
await Weather.created.call(vmData);
  expect(vmData.weather).toMatchObject(weather);
```
