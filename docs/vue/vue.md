# Vue Test Utils

---------
## 3. Métodos `mount()` y `shallowMount()`
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
> Puede encontrar más ejemplos y documentación más detallada del metodo  `shallowMount()` en [este enlace][vue shallowMount].

###Principales Opciones
Opciones par mount y shallowMount
####propsData
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

####mocks
Agregue propiedades adicionales a la instancia. Útil para reemplazar metodos globlaes u otras funcionalidades que en el momento del test no queramos que ejecuten el verdadero codigo. Tambien es útil para agregar jest.fn que luecongo espiemos para comprobar que ciertos metodos se han ejecutado con los parametros que queremos pero sin llegar a ejecutar el codigo, ejomplo llamadas a servicios, emits. Tambien sirve para devolver valores de funciones o propiedades de objetos que por la forma de montar el componente a la hora del test no estan accesibles. (Muy util si estas llamadas o acceso a propiedades estan el el mounted o created del componente)
```javascript
const $route = { path: 'http://www.example-path.com' }
const wrapper = shallowMount(Component, {
  mocks: {
    $route
  }
})
expect(wrapper.vm.$route.path).toBe($route.path)
```

[Jest]: https://jestjs.io/en/
[CLI]: https://jestjs.io/docs/en/cli
[@vue/test-utils]: https://github.com/vuejs/vue-test-utils
[configuración]: https://jestjs.io/docs/en/configuration
[Babel]: https://babeljs.io/
[babel-jest]: https://www.npmjs.com/package/babel-jest
[describe]: https://jestjs.io/docs/en/api#describename-fn
[test]: https://jestjs.io/docs/en/api#testname-fn-timeout
[expect]: https://jestjs.io/docs/en/expect
[test-each]: https://jestjs.io/docs/en/api#testeachtablename-fn-timeout
[jest mock functions]: https://jestjs.io/docs/en/mock-function-api
[toHaveBeenCalled]: https://jestjs.io/docs/en/expect#tohavebeencalled
[toHaveBeenCalledWith]: https://jestjs.io/docs/en/expect#tohavebeencalledwitharg1-arg2
[mockImplementation]: https://jestjs.io/docs/en/mock-function-api#mockfnmockimplementationfn
[jsdom]: https://github.com/jsdom/jsdom
[vue mount]: https://vue-test-utils.vuejs.org/api/mount.html
[vue shallowMount]: https://vue-test-utils.vuejs.org/api/shallowMount.html