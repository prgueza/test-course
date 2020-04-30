# Vue Test Utils

## Instalación

Si hemos inicializado nuestro proyecto utlizando el cli de Vue debería ser suficiente con instalar el paquete y extender nuestro proyecto haciendo uso de los comandos que  nos ofrece:

```bash
$ npm install --save-dev @vue/test-utils
$ vue add @vue/unit-jest
```

> Si esto da problemas se pueden seguir las [instrucciones] de la documentación oficial de Vue Test Utils.

## 1. Configuración avanzada de Jest

También es necesario añadir una serie de modificaciones en el archivo de configuración de [Jest] para que interprete correctamente nuestros tests y sea capaz de probar los componentes cuando son _Single File Components_.

```diff
  module.exports = {
    rootDir: 'src',
-   moduleFileExtensions: ['js'],
+   moduleFileExtensions: ['js', 'vue'],
+   setupFiles: ['<rootDir>/tests/unit/setup'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
+     '.+\\.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2)$': 'jest-transform-stub',
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

-   `setupFiles`

    Se pueden especificar un conjunto de archivos que utilizará Jest para configurar el entorno de testing. En nuestro caso suele utilizarse para configurar la instancia de Vue de la que extenderán todos los componentes que montamos.

-   `moduleNameMapper`

    Este nuevo module mapper es importante ya que remplaza nuestros imports de assets (como por ejemplo las imágenes, o las fuentes) en nuestros componentes de forma que no entren en conflicto con la ejecución de nuestros tests.

    > Para utilizar este module mapper es necesario tenerlo instalado en nuestro proyecto. Puede instalarse mediante el comando `npm install --save-dev jest-transform-stub`

-   `moduleFileExtensions`

    Debemos añadir la extensión `.vue` para que [Jest] lance también los tests relacionados con los archivos de nuestros componentes.

-   `transform`

    Para que [Jest] sea capaz de interpretar el código escrito en los componentes es necesario que [vue-jest] transpile estos archivos.

-   `collectCoverageFrom`

    Debemos añadir también la extensión `.vue` a la expresión que utiliza [Jest] para determinar la cobertura, de manera que nuestros componentes sean analizados.

## 2. Montado de componentes

El testeo de componentes requiere montar de forma aislada el componente en cuestión que queremos probar. Para este montado se utiliza una instancia de Vue que está definida en el fichero de setup que utiliza [Jest]. La instancia del componente heredará todas las propiedades de esta instancia, por lo que la configuración global que deban compartir todos los componentes (plugins, mocks, etc) pueden hacerse en ese fichero.

Las [Vue Test Utils][@vue/test-utils] exponen dos métodos para hacer esta instanciación de nuestro componente. Los dos métodos se utilizan de forma indistinta, pero es importante saber qué los diferencia.

Ambos métodos instancian el componente y devuelven un objeto `wrapper` que podemos utilizar para referenciar nuestro componente y que nos aporta una serie de métodos para hacer comprobaciones rápidas. Entre sus propiedades tenemos disponible la instancia de vue del componente (`wrapper.vm`).

#### Método `mount`

El método `mount` instanciará el componente y todos los que cuelguen de este dentro del árbol del DOM. Todos los hijos de este componente serán montados tal y como se montarían en la aplicación, lo cual hace que el montado sea más costoso y pueda provocar efectos indeseados. No se recomienda utilizar este método a menos que haya algún motivo por el cual se haga necesario.

Entre los efectos indeseados destacan las llamadas a servicios que puedan hacer componentes hijos del componente que queremos probar en su ciclo de vida. Estas llamadas harán que nuestro test sea mucho más frágil y propenso a errores y, en el mejor de los casos, que tarde más en ejecutarse.

```js
test('Renders a button element', () => {
  const wrapper = mount(Button)
  expect(wrapper.contains('button')).toBe(true)
})
```

> Puedes encontrar más ejemplos y documentación más detallada del metodo  `mount()` en [este enlace][vue mount].

#### Método `shallowMount`

Al igual que `mount`, el método `shallowMount` crea un wrapper que contiene el componente Vue montado y renderizado, pero con los componentes hijos simulados (stubbed). Esto quiere decir que no los monta realmente, si no que son sustituidos por un placeholder que evita que se ejecute el codigo de estos componetes hijos. Este es el método preferido, ya que normalmente solo se quiere testear el propio componente padre y los componentes hijos tendran sus propios test.

```js
test('Renders a button element', () => {
  const wrapper = shallowMount(Button)
  expect(wrapper.contains('button')).toBe(true)
})
```

> Puede encontrar más ejemplos y documentación más detallada del metodo `shallowMount()` en [este enlace][vue shallowmount].

### 2.1 Opciones de los métodos `mount` y `shallowMount`

A la hora de montar un componente, los métodos `mount` y `shallowMount` nos permiten especificar una serie de opciones que valdrán como condiciones iniciales del montado del componente.

Estas opciones se pasan al método de montado como segundo argumento dentro de un objeto de opciones.

```js
const wrapper = mount(<Component>, { ...options })
```

Aquí exponemos las opciones más utilizadas, pero una lista completa de estas opciones puede encontrarse en [este enlace][mounting options].

- [`localVue`](#localVue)
- [`data`](#data)
- [`propsData`](#propsData)
- [`mocks`](#mocks)
- [`methods`](#methods)
- [`slots`](#slots)

#### 2.1.1 `localVue`

Esta opción nos permite definir una copia local de la instancia original de vue creada con [`createLocalVue`][createLocalVue] para usarla al montar el componente. Es útil para instalar plugins de Vue que solo usa esta componente en esta copia, ya que de esta forma no ensuciamos la instancia de Vue global que comparten todos los componentes.

```js
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Foo from './Foo.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

const router = new VueRouter({ routes: [{ path: '/foo', component: Foo }] })

const wrapper = mount(Component, {
  localVue,
  router
})

expect(wrapper.vm.$route).toBeInstanceOf(Object)
````

#### 2.1.2 `data`

Mediante esta opción podemos inicializar valores del data antes del montado del componete. Estos valores se fusionaran con los ya existenes, es decir, cambiará el valor del data del componente si este exite y si no existe lo creará.

```js
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

#### 2.1.3 `propsData`

Esta opción nos permite setear las props del componente antes de montarlo. Esto equivale a tener props por defecto, de forma que en el momento del primer montado el componente ya dispone de estos valores para el renderizado.

```js
// Componente.vue
const Component = {
  template: '<div>{{ msg }}</div>',
  props: ['msg']
}

// Component.spec.js
const wrapper = mount(Component, {
  propsData: { msg: 'foo' }
})

expect(wrapper.text()).toBe('foo')
```

#### 2.1.4 `mocks`

Mediante esta opción podemos agregar propiedades adicionales a la instancia de Vue. Esto es útil para reemplazar métodos globales que en el momento del test no queramos que ejecuten el verdadero código.

Por ejemplo aquí podriamos el \$route o el \$router para evitar redirecciones y tener control sobre el objeto router sin que este lance las acciones que lanzaría el verdadero Router.
(Muy util si estas llamadas o acceso a propiedades están el el mounted o created del componente)

Con esta opción no podemos reemplazar los methods del propio componentes, únicamente métodos globales de la instancia de Vue.

```js
const $mockedRoute = { path: 'http://www.example-path.com' }

const wrapper = shallowMount(Component, {
  mocks: { $route: $mockedRoute }
})

expect(wrapper.vm.$route.path).toBe($route.path)
```

#### 2.1.5 `methods`

Es posible que en algún test necesitemos reemplazar alguno de los métodos de nuestro componente por otro (generalmente por una `jest.fn` que podamos observar).

Un ejemplo de un caso como este podría ser un método que funcione como wrapper de una llamada a un servicio que no queremos que se haga. Podemos simplemente sustituir el método por una `jest.fn` que nos permita comprobar con qué argumentos se ha hecho la llamada y mockear la respuesta del servicio.

```js
const serviceCallMock = jest.fn().mockResolvedValue({ data: 'mock-data' })

const wrapper = mount(Component, {
  methods: { serviceCall: serviceCallMock }
})

expect(serviceCallMock).toHaveBeenCalledWith('params')
```

#### 2.1.6 `slots`

Nos permite definir mediante un objeto el contenido que debería mostrarse en los diferentes slots de los que dispone nuestro componente. Se configura mediante un objeto donde la clave de las propiedades corresponde con el nombre de los slots, y el valor de cada propiedad corresponde con el contenido.

```html
<template lang="pug">
  <section>
    <div>
      <slot />
    </div>  
    <div>
      <slot name="aside" />
    </div>  
  </section>
</template>
```

```js
const slotContent = 'slot content'

const wrapper = mount(ComponentWithSlot, {
  slots: {
    default: `<p>${slotContent}</p>`,
    aside: `<p>${slotContent}</p>`,
  }
})

expect(wrapper.text()).toContain(slotContent)
```

## 3. El objeto `wrapper`

El `wrapper` es un objeto que podemos utilizar para referenciar nuestro componente y que nos aporta una serie de métodos para facilitar nuestras comprobaciones. Entre sus propiedades tenemos: disponible la instancia de vue del componente (`wrapper.vm`).

- `wrapper.vm`

  Es la instancia de `Vue` de nuestro componente. A través de esta propiedad se puede acceder a todos los metodos y propiedades de la instancia.

- `wrapper.element`

  El nodo DOM raiz del wrapper.

### 3.1 Métodos del objeto `wrapper`

El `wrapper` nos aporta una serie de métodos que funcionan sobre el componente que genera dicho wrapper y que nos permiten acceder a métodos, propiedades, atributos, el html renderizado, etc. Estos métodos son los que se utilizan para hacer las comprobaciones del funcionamiento del componente.

De nuevo, aquí detallamos los métodos más utilizados, pero puede consultarse la lista completa de métodos [en este enlace][wrapper-methods].

- [`attributes()`](#attributes())
- [`classes()`](#classes())
- [`contains()`](#contains())
- [`emitted()`](#emitted())
- [`emmitedByOrder()`](#emmitedByOrder())
- [`exists()`](#exists())
- [`find() y findAll()`](#find()-y-findAll())
- [`isEmpty()`](#isEmpty())
- [`isVisible()`](#isVisible())
- [`setData()`](#setData())
- [`setProps()`](#setProps())
- [`setValue()`](#setValue())
- [`text()`](#text())
- [`trigger()`](#trigger())

#### 3.1.1 `attributes()`

El método `attributes()` devuelve en un objeto los atributos del nodo del DOM del `wrapper` en cuestión. Se puede pasar como parametro la `key` del atributo cuyo valor quermos obtener.

```js
const wrapper = mount(Foo)
expect(wrapper.attributes().id).toBe('foo') // attributes() devuelve el objeto { id: 'foo' }
expect(wrapper.attributes('id')).toBe('foo') // attributes('id') devuelve directamente el valor 'foo'
```

#### 3.1.2 `classes()`

Devuelve en un array las clases del nodo del DOM del `wrapper`. Del mismo modo que con los atributos podemos utilizar el nombre de la clase como parámetro para comprobar si el componente dispone de la clase o no.

```js
const wrapper = mount(Foo)
expect(wrapper.classes()).toContain('bar') // classes() devuelve el array ['bar']
expect(wrapper.classes('bar')).toBe(true) // classes('bar') devuelve true si el componente tiene la clase 'bar'
```

#### 3.1.3 `contains()`

Devuelve si el `wrapper` contiene o no el elemento buscado por el [selector][selector] especificado.

```js
const wrapper = mount(Foo)
expect(wrapper.contains('p')).toBe(true)
expect(wrapper.contains(Bar)).toBe(true)
```

#### 3.1.4 `emitted()`

El método `emitted` devuelve un **Objeto** con los distintos eventos que ha emitido nuestro componente. Dentro de este objeto, las claves serán el nombre de los distintos eventos que ha emitido, y el valor de cada clave será un **Array** con un elemento por cada emisión del evento, donde cada elemento es a su vez otro **Array** que contiene los argumentos que se han usado a la hora de emitir este evento.

Esto significa que aunque para un mismo evento, las distintas emisiones estén ordenadas (el primer elemento del array será un array con los argumentos de la primera emisión de ese evento), si existen varios eventos distintos, al ser un **Objeto** una estructura no ordenada, no podremos saber en qué orden se han emitido.

Por ejemplo, considerando la siguiente secuencia de eventos:

```js
this.$emit('evento A', 1) // Evento A con 1 como argumento
this.$emit('evento B', 1) // ...
this.$emit('evento A', 2)
this.$emit('evento A', 3, 4) // Evento A con 3 y 4 como argumentos
```

El resultado de nuestro `wrapper.emitted()` será:

```js
wrapper.emitted() === {
  'evento A': [[1], [2], [3, 4]], // [[argumentos de la primera llamada], [...], [...]]
  'evento B': [[1]]
}
```

Con este resultado no somos capaces de saber si el primer evento en lanzarse ha sido el **evento A** o el **evento B**.

Esto significa que cuando el orden en que se emiten **distintos** eventos importa y es algo que queremos probar, el método `emitted()` no nos sirve. En general esto no suele ser un problema, y este método funciona para cualquier otro caso. Si que nos sirve, por ejemplo, para saber cuántas veces se ha llamado el **evento A** (usando `emitted('evento A').length` o `emitted()['evento A'].length`), o para saber con qué argumentos se ha llamado el **evento A** por segunda vez (usando `emitted('evento A')[1]`).

#### 3.1.5 `emittedByOrder`

El método `emittedByOrder` devuelve un **Array** donde cada elemento es un evento lanzado por el componente (sin agrupar por nombre) en forma de **Objeto** donde se especifica el nombre y los argumentos de ese evento.

Por ejemplo, para la misma secuencia de eventos que en el caso anterior, el resultado de nuestro `wrapper.emittedByOrder()` sería:

```js
wrapper.emittedByOrder() === [
  { name: 'evento A', args: [1] },
  { name: 'evento B', args: [1] },
  { name: 'evento A', args: [2] },
  { name: 'evento A', args: [3, 4] },
]
```

De esta forma, los eventos quedan ordenados, y podemos comprobar cuál ha sido el primer evento en lanzarse y en qué orden se han lanzado los distintos eventos a lo largo de un test.

#### 3.1.6 `exists()`

Devuelve si el `Wrapper` o el `WrapperArray` existe.

```js
const wrapper = mount(Foo)
expect(wrapper.exists()).toBe(true)
expect(wrapper.find('does-not-exist').exists()).toBe(false)
expect(wrapper.findAll('div').exists()).toBe(true)
expect(wrapper.findAll('does-not-exist').exists()).toBe(false)
```

#### 3.1.7 `find()` y `findAll()`

El método `find()` devuelve el `wrapper` del primer elemento del DOM o componente Vue que coincida con el [selector][selector] pasado como argumento. El método `findAll()` funciona de la misma forma pero devuelve un `wrapperArray` que contiene todos los elementos del DOM o componentes que coinciden con el selector.

```js
const wrapper = mount(Foo)

const div = wrapper.find('div') // Mediante el tag HTML
expect(div.is('div')).toBe(true)

const bar = wrapper.find(Bar) // Mediante la instancia de otro componente
expect(bar.is(Bar)).toBe(true)

const barByName = wrapper.find({ name: 'bar' }) // Mediante algún atributo
expect(barByName.is(Bar)).toBe(true)

const fooRef = wrapper.find({ ref: 'foo' }) // Mediante el atributo ref
expect(fooRef.is(Foo)).toBe(true)

const divs = wrapper.findAll('div') // Devuelve un array de wrappers
expect(div.length).toBe(4)
```

#### 3.1.8 `isEmpty()`

El método `isEmpty()` devolverá true si el `wrapper` no contiene elementos hijos ni texto.

```js
const wrapper = mount(Foo)
expect(wrapper.isEmpty()).toBe(true)
```

#### 3.1.9 `isVisible()`

El método `isVisible()` devolverá true si el 'Wrapper' es visible. Comprueba además que los elementos ancestros no tengan ni `display: none` ni `visibility: hidden` para verificar que el `wrapper` es visible. Este método es útil para comprobar que se está aplicando la directiva `v-show` en componentes.

```js
import { mount } from '@vue/test-utils'
import Foo from './Foo.vue'

const wrapper = mount(Foo)
expect(wrapper.isVisible()).toBe(true)
expect(wrapper.find('.is-not-visible').isVisible()).toBe(false)
```

#### 3.1.10 `setData()`

El método `setData()` nos permite setear el data de nuestro componente tras haberlo montado. Esto puede ser utilizado para simular cambios en las propiedades del data que deban desencadenar alguna acción que podamos comprobar. El método `setData` usa internamente `Vue.set` y es importante tener en cuenta que si el cambio tiene algun efecto reactivo sobre el componente será necesario esperar al siguiente tick para hacer las comprobaciones de manera que puedan verse los efectos utilizando `await wrapper.vm.$nextTick()`.

```js
const wrapper = mount(Foo)
wrapper.setData({ foo: 'bar' })
expect(wrapper.vm.foo).toBe('bar')
```

#### 3.1.11`setProps()`

Del mismo modo que el método `setData()` nos permite setear el data a posteriori, el método `setProps()` setea propiedeades y fuerza la actualización del componente si el cambio tiene algún efecto reactivo. Esto significa que hay que tener las mismas consideraciones que se tienen al utilizar el método `setData()`

```js
const wrapper = mount(Foo)
wrapper.setProps({ foo: 'bar' })
expect(wrapper.vm.foo).toBe('bar')
```

#### 3.1.12 `setValue()`

Setea el valor de un input o seleciona un elemento y actualiza el data asociado al `v-model`. Este método es muy útil cuando queremos simular la interacción de un usuario con un formulario de nuestra aplicación.

```js
const textInput = wrapper.find('input[type="text"]') // Buscamos el input haciendo uso del método find()
textInput.setValue('some value') // Y seteamos un valor
const select = wrapper.find('select')
select.setValue('option value')
```

Existen otros métodos similares como el [setChecked][setChecked] o el [setSelected][setSelected].

#### 3.1.13 `text()`

El método `text()` devuelve el contenido de texto del `wrapper`.

```javascript
const wrapper = mount(Foo)
expect(wrapper.text()).toBe('bar')
```

#### 3.1.14 `trigger()`

Lanza un evento del nodo DOM del `wrapper` de forma asíncrona.

```js
  const clickHandlerMock = jest.fn()
  const wrapper = mount(Foo, {
    methods: { clickHandler: clickHandlerMock }
  })

  wrapper.trigger('click')
  wrapper.trigger('click', { button: 0 })
  wrapper.trigger('click', { ctrlKey: true }) // Para probar controladores con la forma @click.ctrl

  expect(clickHandler.called).toBe(true)
})
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
[wrapperMethods]: https://vue-test-utils.vuejs.org/api/wrapper/#methods
