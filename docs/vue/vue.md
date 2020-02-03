# Vue Test Utils

## Instalación

Si hemos inicializado nuestro proyecto utlizando el cli de Vue debería ser suficiente con instalar el paquete y extender nuestro proyecto haciendo uso de los comandos que  nos ofrece:

```bash
$ npm install --save-dev @vue/test-utils
$ vue add @vue/unit-jest
```

> Si esto da problemas se pueden seguir las [instrucciones] de la documentación oficial de Vue Test Utils.

## Configuración avanzada de Jest

También es necesario añadir una serie de modificaciones en el archivo de configuración de [Jest] para que interprete correctamente nuestros tests y sea capaz de probar los componentes cuando son _Single File Components_.

```diff
  module.exports = {
    rootDir: 'src',
-   moduleFileExtensions: ['js'],
+   moduleFileExtensions: ['js', 'vue'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
      '^.+\\.js$': 'babel-jest',
+     '.*\\.(vue)$': 'vue-jest',
    },
    testRegex: '\\.spec\\.js$',
    testPathIgnorePatterns: [ 'functions' ],
    coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
-   collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!functions/**/*.js'],
+   collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**', '!functions/**/*.js'],
    verbose: true,
  }
```

-   `moduleFileExtensions`

    Debemos añadir la extensión `.vue` para que [Jest] lance también los tests relacionados con los archivos de nuestros componentes.

-   `transform`

    Para que [Jest] sea capaz de interpretar el código escrito en los componentes es necesario que [vue-jest] transpile estos archivos.

-   `collectCoverageFrom`

    Debemos añadir también la extensión `.vue` a la expresión que utiliza [Jest] para determinar la cobertura, de manera que nuestros componentes sean analizados.

## Estructura de los archivos de Test

Si hemos configurado correctamente nuestro entorno de test, [Jest] se encargará de buscar los archivos correspondientes a la hora de lanzar los tests, por lo que es indiferente dónde dejemos estos archivos siempre y cuando estén dentro del scope que declaramos en la [configuración] de [Jest]. Se recomienda guardar los archivos de test junto con el archivo `.vue` del componente al que hacen referencia dentro de un mismo directorio bajo el nombre del componente. De esta forma tendremos los tests y los archivos del componente almacenados en un mismo directorio facilitando compartir nuestro componente y saber si dispone de tests o no.

    - src
      - components
        - componentA
          - ComponentA.vue
          - ComponentA.spec.js
        - componentB
          - ComponentB.vue
          - ComponentB.spec.js

Los tests pueden estructurarse de muchas formas distintas, pero recomendamos agrupar los distintos tests en función de qué propiedad del componente estamos probando. Además es recomendable seguir el mismo orden que tienen estas propiedades dentro de nuestros componentes:

```js
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Component from './Component'

describe('Component test suite', () => {

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
      // ...
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

  /* METHODS RELATED TESTS */
  describe('Methods', () => {
    describe('Method A', () => {
      // ..
    })
    // ...
  })

})
```

> Se pueden encontrar snippets con versiones para VSCode y Atom para inicializar los archivos de test con esta estructura [aquí](../../snippets)

## Métodos `mount()` y `shallowMount()`

### Mount

Crea un Wrapper que contiene el componente Vue montado y renderizado.

Ejemplo sin opciones:

```javascript
test('renders a button', () => {
  const wrapper = mount(Button)
  expect(wrapper.contains('button')).toBe(true)
})
```

Ejemplo sin con opciones:

```javascript
test('renders a button', () => {
  const wrapper = mount(Button, {
    propsData: {
      size: 'medium'
    }
  })
  expect(wrapper.contains('button')).toBe(true)
})
```

> Puede encontrar más ejemplos y documentación más detallada del metodo  `mount()` en [este enlace][vue mount].

### ShallowMount

Al igual que `mount()`, crea un Wrapper que contiene el componente Vue montado y renderizado, pero con los componentes hijos están simulados, es decir no los monta realmente, con esto se evita que no se ejecute el codigo de los componetes hijos lo cual evita muchos problemas en el test. Ya que normalmente solo se quiere testear el componente y los componentes hijos tendran por su parte sus propios test.

Ejemplo sin opciones:

```javascript
test('renders a button', () => {
  const wrapper = shallowMount(Button)
  expect(wrapper.contains('button')).toBe(true)
})
```

Ejemplo sin con opciones:

```javascript
test('renders a button', () => {
  const wrapper = shallowMount(Button, {
    propsData: {
      size: 'medium'
    }
  })
  expect(wrapper.contains('button')).toBe(true)
})
```

> Puede encontrar más ejemplos y documentación más detallada del metodo  `shallowMount()` en [este enlace][vue shallowmount].

### Principales Opciones
Opciones par mount y shallowMount
#### propsData
Setea las props del componente al montarlo.

```javascript
const Component = {
  template: '<div>{{ msg }}</div>',
  props: ['msg']
}
const wrapper = mount(Component, {
  propsData: {
    msg: 'aBC'
  }
})
expect(wrapper.text()).toBe('aBC')
```

#### mocks
Agregue propiedades adicionales a la instancia. Útil para reemplazar metodos globales que en el momento del test no queramos que ejecuten el verdadero codigo. Tambien es útil para reemplazar metedos globlaes por otras funciones o por jest.fn que luengo espiemos para comprobar que estos se han llamado en nuestro código pero sin ejecutar el verdaderó código. Por ejemplo aquí podriamos reemplazar el i18n para que devuela un texto, el \$route para las rutas o el \$emit por un jest.fn para comprobar que es llamado y con que parametros se le llama.
(Muy util si estas llamadas o acceso a propiedades estan el el mounted o created del componente)
En mocks no podemos reemplazar los methods del propio componentes para ella usaríamos la propiedad methods.

```javascript
const $route = { path: 'http://www.example-path.com' }
const wrapper = shallowMount(Component, {
  mocks: {
    $route
  }
})
expect(wrapper.vm.$route.path).toBe($route.path)
```
#### methods
Si en algun test necesitamos reemplazar un metodo del propio componente se haría con la propiedad methods.

```javascript
const Component = {
  template: '<div>{{ foo() }}{{ bar() }}{{ baz() }}</div>',
  methods: {
    foo() {
      return 'a'
    },
    bar() {
      return 'b'
    }
  }
}
const options = {
  methods: {
    bar() {
      return 'B'
    },
    baz() {
      return 'C'
    }
  }
}
const wrapper = mount(Component, options)
expect(wrapper.text()).toBe('aBC')
```
#### data
Para pasar valores del data en el montado del componete, estos se fusionaran con los ya existenes. Es decir cambiara el valor del data del componente si exite y si no lo creara.

```javascript
const Component = {
  template: `
    <div>
      <span id="foo">{{ foo }}</span>
      <span id="bar">{{ bar }}</span>
    </div>
  `,

  data() {
    return {
      foo: 'foo',
      bar: 'bar'
    }
  }
}

const wrapper = mount(Component, {
  data() {
    return {
      bar: 'my-override'
    }
  }
})

wrapper.find('#foo').text() // 'foo'
wrapper.find('#bar').text() // 'my-override'
```
#### propsData
Setear las propiedades del componente en el momento del montado.

```javascript
const Component = {
  template: '<div>{{ msg }}</div>',
  props: ['msg']
}
const wrapper = mount(Component, {
  propsData: {
    msg: 'aBC'
  }
})
expect(wrapper.text()).toBe('aBC')
```

#### localVue
Una copia local de vue creada con [`createLocalVue`][createLocalVue] para usarla al montar el componente. Es útil para instalar plugins de vue que solo usa esta componente en esta copia, ya que de esta forma no vamos ensuciando la instancia de vue global que comparten todos los componentes.

```javascript
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Foo from './Foo.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

const routes = [{ path: '/foo', component: Foo }]

const router = new VueRouter({
  routes
})

const wrapper = mount(Component, {
  localVue,
  router
})
expect(wrapper.vm.$route).toBeInstanceOf(Object)
````
#### attachToDocument
* type: `boolean`
* default: `false`

Para setear si el componente puede atacar al DOM en el momento de montarlo.
Cuando se activa atacar al DOM, se debe llamar a `wrapper.destroy()` al terminar el test para eliminar los elementos del DOM renderizados y la instancia del componente.

#### slots
* tipo: `{ [name: string]: Array<Component>|Component|string }`

Provide an object of slot contents to the component. The key corresponds to the slot name. The value can be either a component, an array of components, or a template string, or text.
Agrega un objeto de slot al componente. La key corresponde al nombre del slot. El valor puede ser otro componente, un array de componentes, un template string o un texto.

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
```
```javascript
import { shallowMount } from '@vue/test-utils'
import ModuleActionBtn from '@/components/ModuleActionBtn'

describe('ModuleActionBtn', () => {

test('if render slot content', () => {
    const textCheckedSlot = 'slot content'
    const wrapper = mount(ModuleActionBtn, {
      slots: {
        default: `<p>${textCheckedSlot}</p>`
      }
    })
    expect(wrapper.text()).toContain(textCheckedSlot)
  })
})
```


#### resto de propiedades
Hay más propiedades para configurar el componente en el momento del montado para poder verlas todas accede a la sección de propiedades en la docuentación de vue-test-util desde este
[enlace][mounting options].

## wrapper
`Wrapper` es un objeto que contiene un componente montado o un vnode con sus metodos para testear el componente o el vnode.

### Propiedades

#### vm
`Component` (solo lectura): es la instancía de `Vue`. Se puede acceder a todos los metodos y porpiedades de la instancia con `wrapper.vm`. Esta instancia solo existe en el wrapper del componente Vue.

#### element
`HTMLElement` (solo lectura): el nodo DOM raiz del wrapper.

### Metodos

#### attributes
Devuelve los atributos del nodo del DOM del `wrapper`. Si  se le pasa como parametro la `key` de un atributo devolvera el valor de ese atributo.
* Argumentos:
  * `{string} key` optional
* devuelve: `{[attribute: string]: any} | string`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.attributes().id).toBe('foo')
expect(wrapper.attributes('id')).toBe('foo')
```
#### classes
Devuelve las clases del nodo del DOM del `wrapper`.
Devuelve un array de clases si no se le pasa parametro y si se le pasa un string como parametro devueve true o false si esté esta entre las clases que contiene el DOM.

* Argumentos:
  * `{string} className` optional
* Devuelve: `Array<{string}> | boolean`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.classes()).toContain('bar')
expect(wrapper.classes('bar')).toBe(true)
```

#### contains
Devuelve si el `wrapper` contiene o no el elemento buscado por el [selector][selector] especificado.

* Argumentos:
  * `{string|Component}`selector
* Devuelve: `{boolean}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const wrapper = mount(Foo)
expect(wrapper.contains('p')).toBe(true)
expect(wrapper.contains(Bar)).toBe(true)
```
#### emitted
Devuelve un objeto que contiene los eventos personalizados emitidos por `wrapper` `vm`.
* Devuelve: `{ [name: string]: Array<Array<any>> }`
```javascript
import { mount } from '@vue/test-utils'

test('emit demo', async () => {
  const wrapper = mount(Component)

  wrapper.vm.$emit('foo')
  wrapper.vm.$emit('foo', 123)

  await wrapper.vm.$nextTick() // Wait until $emits have been handled

  /*
  wrapper.emitted() returns the following object:
  {
    foo: [[], [123]]
  }
  */

  // assert event has been emitted
  expect(wrapper.emitted().foo).toBeTruthy()

  // assert event count
  expect(wrapper.emitted().foo.length).toBe(2)

  // assert event payload
  expect(wrapper.emitted().foo[1]).toEqual([123])
})
```
También se puede escribir así.
```javascript
// assert event has been emitted
expect(wrapper.emitted('foo')).toBeTruthy()

// assert event count
expect(wrapper.emitted('foo').length).toBe(2)

// assert event payload
expect(wrapper.emitted('foo')[1]).toEqual([123])
```
El método `.emitted()` devuelve el mismo objeto cada vez que se llama, no uno nuevo, por lo que el objeto se actualizará únicamente cuando se activen nuevos eventos.

#### emittedByOrder
Devuelve un array que contiene los eventos personalizados emitidos por `wrapper` `vm`.

* Devuelve: `Array<{ name: string, args: Array<any> }>`

```javascript
import { mount } from '@vue/test-utils'

const wrapper = mount(Component)

wrapper.vm.$emit('foo')
wrapper.vm.$emit('bar', 123)

/*
wrapper.emittedByOrder() returns the following Array:
[
  { name: 'foo', args: [] },
  { name: 'bar', args: [123] }
]
*/

// assert event emit order
expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['foo', 'bar'])
```

#### exists
Devuelve si el `Wrapper` o el `WrapperArray` existe.
* devuelve: `{boolean}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.exists()).toBe(true)
expect(wrapper.find('does-not-exist').exists()).toBe(false)
expect(wrapper.findAll('div').exists()).toBe(true)
expect(wrapper.findAll('does-not-exist').exists()).toBe(false)
```

#### find
Devuelve el 'Wrapper' del primer elemento del DOM o componente Vue que coincide con el [selector][selector] pasado como parametro.

* Argumentos:
  * `{string|Component}` selector
* Devuelve: `{Wrapper}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const wrapper = mount(Foo)

const div = wrapper.find('div')
expect(div.is('div')).toBe(true)

const bar = wrapper.find(Bar)
expect(bar.is(Bar)).toBe(true)

const barByName = wrapper.find({ name: 'bar' })
expect(barByName.is(Bar)).toBe(true)

const fooRef = wrapper.find({ ref: 'foo' })
expect(fooRef.is(Foo)).toBe(true)
```

#### findAll
Devuelve el [`WrapperArray`][WrapperArray] de los elementos que coinciden con el [selector][selector] pasado como parametro.
* Argumentos:
  * `{string|Component}` selector
* Devuelve: `{WrapperArray}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const wrapper = mount(Foo)
const div = wrapper.findAll('div').at(0)
expect(div.is('div')).toBe(true)
const bar = wrapper.findAll(Bar).at(0)
expect(bar.is(Bar)).toBe(true)
```
#### isEmpty
Devuelve true si el `Wrapper` no contiene hijos.
* Devuelve: `{boolean}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.isEmpty()).toBe(true)
```
#### isVisible
Devuelve true si el 'Wrapper' es visible.
Comprueba tambien que los elementos ancestros no tengan ni 'display: none' ni 'visibility: hidden' para chequear que el 'Wrapper' es visible.
Es útil para comprobar que se esta apliacando la directiva v-show en componentes.

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.isVisible()).toBe(true)
expect(wrapper.find('.is-not-visible').isVisible()).toBe(false)
```
#### setData
Setea a `Wrapper` `vm` data.
`setData` usa internamente `Vue.set`
* Argumentos:
  * `{Object}` data

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
wrapper.setData({ foo: 'bar' })
expect(wrapper.vm.foo).toBe('bar')
```

#### setMethods
Crea o sobrescribe metodos y fuerza su actualización en `Wrapper` `vn`.

* Arguments:
  * `{Object}` methods

```javascript
import { mount } from '@vue/test-utils'
import sinon from 'sinon'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
const clickMethodStub = sinon.stub()

wrapper.setMethods({ clickMethod: clickMethodStub })
wrapper.find('button').trigger('click')
expect(clickMethodStub.called).toBe(true)
```
#### setProps
Setea propiedeades y fuerza su actualización en `Wrapper` `vn`.

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
wrapper.setProps({ foo: 'bar' })
expect(wrapper.vm.foo).toBe('bar')
```

#### setValue
Setea el valor de un input text o seleciona un elemento y actualiza el data asociado al v-model.

* Argumentos:
  * `{any}` value

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)

const textInput = wrapper.find('input[type="text"]')
textInput.setValue('some value')

const select = wrapper.find('select')
select.setValue('option value')
```
Ver tambien [setChecked][setChecked], [setSelected][setSelected].

#### text
Devuelve el contenido de texto del `Wrapper`.

* Devuelve: `{string}`

```javascript
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.text()).toBe('bar')
```
#### trigger
Lanza un evento asincrono del `Wrapper` DOM node.

* Argumentos:
  * `{string} eventType` requerido
  * `{Object} options` optional

```javascript
import { mount } from '@vue/test-utils'
import sinon from 'sinon'
import Foo from './Foo'

test('trigger demo', async () => {
  const clickHandler = sinon.stub()
  const wrapper = mount(Foo, {
    propsData: { clickHandler }
  })

  wrapper.trigger('click')

  wrapper.trigger('click', {
    button: 0
  })

  wrapper.trigger('click', {
    ctrlKey: true // For testing @click.ctrl handlers
  })

  await wrapper.vm.$nextTick() // Wait until trigger events have been handled

  expect(clickHandler.called).toBe(true)
})
```

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

[jest]: https://jestjs.io/en/

[cli]: https://jestjs.io/docs/en/cli

[@vue/test-utils]: https://github.com/vuejs/vue-test-utils

[vue-jest]: https://github.com/vuejs/vue-jest

[configuración]: https://jestjs.io/docs/en/configuration

[babel]: https://babeljs.io/

[babel-jest]: https://www.npmjs.com/package/babel-jest

[describe]: https://jestjs.io/docs/en/api#describename-fn

[test]: https://jestjs.io/docs/en/api#testname-fn-timeout

[expect]: https://jestjs.io/docs/en/expect

[test-each]: https://jestjs.io/docs/en/api#testeachtablename-fn-timeout

[jest mock functions]: https://jestjs.io/docs/en/mock-function-api

[tohavebeencalled]: https://jestjs.io/docs/en/expect#tohavebeencalled

[tohavebeencalledwith]: https://jestjs.io/docs/en/expect#tohavebeencalledwitharg1-arg2

[mockimplementation]: https://jestjs.io/docs/en/mock-function-api#mockfnmockimplementationfn

[jsdom]: https://github.com/jsdom/jsdom

[vue mount]: https://vue-test-utils.vuejs.org/api/mount.html

[vue shallowmount]: https://vue-test-utils.vuejs.org/api/shallowMount.html

[instrucciones]: https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html

[createLocalVue]: https://vue-test-utils.vuejs.org/api/createLocalVue.html

[mounting options]: https://vue-test-utils.vuejs.org/api/options.html

[selector]: https://vue-test-utils.vuejs.org/api/selectors.html

[WrapperArray]: https://vue-test-utils.vuejs.org/api/wrapper-array/

[setChecked]: https://vue-test-utils.vuejs.org/api/wrapper/#setchecked

[setSelected]: https://vue-test-utils.vuejs.org/api/wrapper/#setselected