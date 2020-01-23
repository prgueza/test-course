# Onesait UX | Testing

> Guia de testing para el equipo de desarrollo front de Onesait UX

## Contenidos
#### [Jest](./docs/jest/jest.md)

  1. Comandos básicos de Jest
  2. Configuración básica de Jest
  3. Lanzar un test e interpretar los resultados
  4. Métodos `describe()` y `test()`
  5. Método `expect()` y sus funciones
  6. Funciones mockeadas de jest `jest.fn()`
  7. Métodos de Jest más utilizados

#### [Vue Test Utils](./docs/vue/vue.md)

  1. Configuración avanzada de Jest
  2. Estructura de los archivos de test
  3. Métodos `mount()` y `shallowMount()`
  4. El objeto `wrapper`
  5. Buscando elementos del DOM
  6. Mockeo de funciones en componentes

## Instalación

#### Clonar el repositorio e instalar dependencias

```bash
$ git clone https://github.com/pedro-rodalia/test-course.git ods-test-course
$ cd ods-test-course && npm install
```

#### Comandos disponibles


```bash
  # Run tests and collect coverage from all files
  $ npm run unit <component>
  # Just run tests (faster than the previous command)
  $ npm run unit:only <component>
  # Run tests and collect coverage, and watch for changes
  $ npm run unit:watch <component>
```

## Documentación

* [Documentación oficial de Jest][Jest]
* [Documentación oficial de las Vue Test Utils][vue-test-utils]
* [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

---

[Jest]: https://jestjs.io/en/
[CLI]: https://jestjs.io/docs/en/cli
[@vue/test-utils]: https://github.com/vuejs/vue-test-utils
[vue-test-utils]: https://vue-test-utils.vuejs.org/
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
