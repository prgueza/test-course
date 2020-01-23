# Vue Test Utils

## Instalación

Si hemos inicializado nuestro proyecto utlizando el cli de Vue debería ser suficiente con instalar el paquete y extender nuestro proyecto haciendo uso de los comandos que  nos ofrece:

```bash
$ npm install --save-dev @vue/test-utils
$ vue add @vue/unit-jest
```

> Si esto da problemas se pueden seguir las [instrucciones] de la documentación oficial de Vue Test Utils.

## Configuración avanzada de Jest

También es necesario añadir una serie de modificaciones en el archivo de configuración de [Jest] para que interprete correctamente nuestros tests y sea capaz de probar los componentes cuando son *Single File Components*.

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

* `moduleFileExtensions`

  Debemos añadir la extensión `.vue` para que [Jest] lance también los tests relacionados con los archivos de nuestros componentes.

* `transform`

  Para que [Jest] sea capaz de interpretar el código escrito en los componentes es necesario que [vue-jest] transpile estos archivos.

* `collectCoverageFrom`

  Debemos añadir también la extensión `.vue` a la expresión que utiliza [Jest] para determinar la cobertura, de manera que nuestros componentes sean analizados.

[Jest]: https://jestjs.io/en/
[CLI]: https://jestjs.io/docs/en/cli
[@vue/test-utils]: https://github.com/vuejs/vue-test-utils
[vue-jest]: https://github.com/vuejs/vue-jest
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
[instrucciones]: https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html
