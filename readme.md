# Onesait UX | Testing

> Guia de testing para el equipo de desarrollo front de Onesait UX

## Contenidos
### Jest

  1. Comandos básicos de Jest
  2. Configuración básica de Jest
  3. Lanzar un test e interpretar los resultados
  4. Métodos `describe()` y `test()`
  5. Método `expect()` y sus funciones
  6. Funciones mockeadas de jest `jest.fn()`
  7. Funciones del método `expect()` aplicadas a mocks
  8. Métodos de Jest más utilizados

### Vue Test Utils

  1. Configuración avanzada de Jest

---

## Instalación

Para lanzar tests sobre nuestro código es necesario tener instalado [Jest], bien a nivel de proyecto o a nivel global, junto con el plugin de babel para Jest.

```bash
# Install Jest framework and utils
$ npm install --save-dev jest babel-jest
$ npm install --global jest
```

Además, si queremos lanzar los tests sobre componentes de *Vue.js* debemos tener instalado el paquete [@vue/test-utils].

```bash
# Install vue test utils
$ npm install --save-dev vue-test-utils
```

## 2. Comandos básicos de Jest

A la hora de lanzar los tests desde el terminal, [Jest] ofrece un [CLI] con una serie de comandos y opciones para ello.

```bash
# Run tests
$ jest <filename/pattern> # Jest ods-btn
# Run tests and collect coverage
$ jest --coverage <filename/pattern>
# Run tests and watch for changes
$ jest -watch --coverage <filename/pattern>
```

 Si no se especifica se lanzarán todos los tests que encuentre jest dentro de nuestro proyecto. No es necesario especificar el archivo que se quiere testear, pero puede resultar útil si queremos testear un único componente.

> La documentación del CLI de Jest puede encontrarse en [este enlace][CLI]

## 3. Conficuración básica de Jest

Jest se configura mediante un archivo de [configuración] con el nombre `jest.config.js` que se encuentra en el directorio raíz del componente.

Se trata de un archivo de configuración que exporta un objeto con las distintas opciones que ofrece Jest para configurar su funcionamiento.

Una **configuración básica** para [Jest] tendrá esta forma:

```javascript
// jest.config.js
const path = require('path')
module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': path.resolve(__dirname, 'node_modules/babel-jest'),
  },
  testRegex: '\\.spec\\.js$',
  testPathIgnorePatterns: [ 'ignore' ],
  coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!ignore/**/*.js'
  ],
  verbose: true,
}
````

### Opciones básicas

- `rootDir`

  Path al directorio raíz que utilizará Jest como punto de partida para escanear los archivos que queramos testear. En nuestro caso, todo el código debería encontrarse dentro del diretorio `/src` por lo que podremos configurarlo como `rootDir`.

  > Podemos referenciar esta ruta en el archivo de configuración usando `<rootDir>`.

- `moduleNameMapper`

  Array con las extensiónes de los archivos de nuestro proyecto. En este caso se especifica que se lanzen tests únicamente para archivos con extensión `.js`.

- `moduleNameMapper`

  Nos permite definir alias para las rutas que utilicemos dentro de nuestros tests. En este caso, cualquier ruta que empiece por `@` sera resuelta a partir del directorio raíz, que en nuestro caso es el directorio `src`.

- `transform`

  Nos permite definir el path a los compiladores que pueden transformar nuestro código antes de ejecutar los tests, como puede ser [Babel]. En nuestro caso especificamos que los archivos con extensión `.js` pasen por el plugin [babel-jest].

- `testRegex`

  Esta configuración se utiliza para definir la expresión regular que utilizará [Jest] para buscar los archivos en los que se encuentran los tests. En nuestro caso utilizaremos archivos con la forma `<nombre del componente>.spec.js` para escribir los tests de cada componente en concreto, por lo que la regex será `\\.spec\\.js$`.

- `testPathIgnorePatterns`

  Array con expresiones regulares que se comparan contra todos los archivos que encuentra [Jest] dentro del directorio raíz para determinar si debe lanzar o no el test.

- `coverageDirectory`

  Ruta del directorio donde [Jest] debe almacenar los resultados de cobertura de los tests.

- `collectCoverageFrom`

  Array con las rutas donde [Jest] debe analizar archivos para determinar la cobertura.

- `verbose`

  Al poner esta configuración a `true` conseguimos una descripción más detallada de los resultados de las ejecuciones de los tests.

> La lista completa de opciones de configuración de Jest puede encontrarse en [este enlace][configuración]

## 3. Lanzar un test e interpretar los resultados

Cuando se ejecuta un test se pueden visualizar los resultados en la terminal y hay que saber interpretar los datos que se aparecen.

```
> test-course@1.0.0 unit /.../front:ux/test-course
> jest --coverage

 FAIL  src/functions/functions.spec.js
  Multiply function test cases
    ✓ Multiply function returns the result of multiplying the arguments (2ms)
    ✓ Multiply function returns 80 when passing [10, 2, 4] as arguments
    ✓ Multiply function returns -100 when passing [-5, 20] as arguments
    ✓ Multiply function returns undefined if no arguments are passed
  Divide function test cases
    ✓ Divide function returns the result of dividing the arguments
    ✓ Divide function returns 2 when passing [80, 4, 10] as arguments
    ✓ Divide function returns -1 when passing [-10, 10] as arguments
    ✕ Divide function returns undefined if no arguments are passed (2ms)
  Sum function test cases
    ✓ Sum function returns the result of adding the arguments
    ✓ Sum function returns 94 when passing [80, 4, 10] as arguments
    ✓ Sum function returns -8 when passing [-10, 2] as arguments
    ✓ Sum function returns undefined if no arguments are passed
  Compute function test cases
    ✓ Compute function calls the callback function passed as an argument (1ms)
    ✓ Compute function calls the callback function passing on the arguments (1ms)
    ✓ Compute function returns the callback result

  ● Divide function test cases › Divide function returns undefined if no arguments are passed

    expect(received).toBeUndefined()

    Received: null

      41 |   test('Divide function returns undefined if no arguments are passed', () => {
      42 |     const result = divide()
    > 43 |     expect(result).toBeUndefined()
         |                    ^
      44 |   })
      45 |
      46 | })

      at Object.<anonymous> (functions/functions.spec.js:43:20)

-------------|----------|----------|----------|----------|-------------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Lines   |
-------------|----------|----------|----------|----------|-------------------|
All files    |    93.75 |       90 |      100 |      100 |                   |
 functions.js|    93.75 |       90 |      100 |      100 |                17 |
-------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 failed, 1 total
Tests:       1 failed, 14 passed, 15 total
Snapshots:   0 total
Time:        1.109s
Ran all test suites.

```

En este caso se está lanzando una sola suite de tests. Una suite es un archivo donde hemos definido una serie de tests para un componente. En este caso se trata de un archivo con el nombre `functions.js` donde se encuentran varias funciones (`multiply`, `divide`, `sum` y `compute`).

Para cada función se han definido una serie de tests que comprueban que éstas funcionan como se espera que funcionen.

La lista de checks muestra los resultados de los distintos tests, y debajo se da información de aquellos tests que han fallado y el motivo por el cual lo han hecho. En este caso, el test `Divide function returns undefined if no arguments are passed` ha fallado, ya que se esperaba que para las condiciones del test la función devolviera `undefined` y esta ha devuelto `null`.

A la derecha de los títulos de los tests se muestra el tiempo que ha tardado [Jest] en ejecutar cada uno de ellos. Es importante que este tiempo no sea excesivo, ya que a la hora de desplegar nuestra aplicación se lanzarán todos los tests y puede llevar varios minutos terminar de comprobar el código. Si algún test tiene un tiempo elevado habrá que considerar refactorizarlo para simplificarlo.

La tabla de la parte inferior muestra el **nivel de cobertura** de nuestro código. Esto no tiene nada que ver con cómo funciona el código, pero nos indica qué partes de éste no han sido ejecutadas durante el test (por lo que no sabemos si realmente funcionan o no). Las categorías que evalua la **cobertura** son:

- **Statements** - `% Stmts`

  Cobertura sobre las órdenes que aparecen en nuestro código. Se comprueba cuales han sido interpretadas y se divide entre el número total de órdenes.

- **Branches** - `% Branch`

  Cobertura sobre las ramas de nuestro código. Cada vez que utilizamos un condicional (un `if` o un `switch` por ejemplo) se generan una o varias ramas. Este indicador se encarga de avisarnos si nos hemos dejado condiciones sin contemplar.

- **Functions** - `% Funcs`

  Porcentaje de las funciones que aparecen en nuestro código que han sido invocadas durante los tests.

- **Lines** - `% Lines`

  Porcentaje de líneas que han sido interpretadas durante los tests. La diferencia entre este indicador y el de *Statements* está en que hay casos en los que en una línea se interpreta más de una órden.

  Por ejemplo, para el siguiente caso, si nuestro test no contempla el caso en que `value` sea `falsy`, la línea será interpretada, (por lo que la cobertura en líneas puede alcanzar el 100%), pero el statement `return false` no llega a ejecutarse (por lo que la cobertura en statements no podrá alcanzar el 100%).

  ```javascript
  if (!value) return false
  ```

## 4. Métodos `describe()` y `test()`

Para explicar la estructura que tiene un archivo de tests vamos a utilizar la función `multiply` del módulo `functions` que genera el resultado del apartado anterior. Se trata de una función que toma `n` argumentos y devuelve el resultado de multiplicarlos. Si no se pasan argumentos, devolverá `undefined`.

```javascript
function multiply(...values) {
  if (!values.length) return undefined
  return values.reduce((result, value) => result * value)
}
```
### Describe

Como el archivo `functions.js` tiene varios métodos y queremos probar la funcionalidad de cada uno por separado, resulta útil dividir la suite de tests en diferentes secciones. Para ello se utiliza el método `describe()` de [Jest].

Este método genera un contexto para la ejecución de uno o más tests. Además de agrupar los resultados de estos tests nos permite controlar cómo se comporta el entorno de la función que estamos probando de forma independiente al resto de funciones que probemos en este archivo (inicializar variables, crear funciones de ayuda, etc.).

Es el método encargado de generar un contexto para la ejecución de nuestros tests. No es necesario, pero generalmente ayuda a estructurar el archivo y a simplificar los tests.

> La documentación del método `describe()` puede encontrarse en [este enlace][describe]

### Test

El método `test()` es el encargado de comprobar el comportamiento de las funciones que queremos testear. Es el único método realmente necesario para que podamos testear nuestro código.

Recibe como primer argumento el nombre del test y como segundo una función que contiene nuestras expectativas acerca del comportamiento que queremos probar. La definición de estas expectativas se detalla en el siguiente apartado.


```javascript
import { multiply } from './functions.js'

describe('Multiply function test cases', () => {
  test('Multiply function returns the result of multiplying the arguments', () => {
    // ...
  })
  test('Multiply function returns undefined if no arguments are passed', () => {
    // ...
  })
})
```

> La documentación del método `test()` puede encontrarse en [este enlace][test]

### 5. Método `expect()` y sus funciones

Para definir las expectativas que tenemos acerca del comportamiento de una función se hace uso del método `expect()`. Generalmente invocamos a la función que tenemos que testear en diferentes escenarios y con diferentes argumentos y condiciones, y **esperamos** que el resultado sea uno.

Para el caso de la función `multiply` esperamos que al utilizarla con unos argumentos determiandos, el resultado sea la multiplicación de estos argumentos. El test que contempla este caso se escribiría de la siguiente manera:

```javascript
test('Multiply function returns the result of multiplying the arguments', () => {
  const a = 10, b = 2
  const result = multiply(a, b)
  expect(result).toBe(20)
})
```

Declaramos dos constantes conocidas (**10** y **2**) y las utilizamos como argumentos de la función `multiply`. Almacenamos el resultado de llamar a esta función en `result` y comprobamos que se cumple nuestra **espectativa** de que el resultado sea **20.**

Como el comportamiento de esta función es bastante simple puede parecer que el testeo está terminado. Podemos comprobarlo corriendo los tests para esta suite con la opción `watch` por si es necesario hacer algún cambio:

```bash
$ npm run unit:watch functions
```

El resultado de esta ejecución es:

```bash
> test-course@1.0.0 unit /.../front:ux/test-course
> jest --coverage

 PASS  src/functions/functions.spec.js
  Multiply function test cases
    ✓ Multiply function returns the result of multiplying the arguments (2ms)

-------------|----------|----------|----------|----------|-------------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Lines   |
-------------|----------|----------|----------|----------|-------------------|
All files    |       80 |       50 |      100 |      100 |                   |
 functions.js|       80 |       50 |      100 |      100 |                 2 |
-------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.424s
```

Como se puede ver en los resultados la cobertura no llega al 100%, por lo que puede haber partes de la función que no hemos probado que estén funcionando de forma incorrecta. El reporte de cobertura nos indica que faltan la mitad de las ramas por probar, y que aunque se han ejecutado todas las líneas, algún comando no ha sido interpretado, ya que marca un 80% en `Stmts`. También nos indica en qué linea faltan comandos por probar.

Volviendo a esa línea en el código de la función podemos ver que no hemos contemplado en nuestros tests el caso en que la función no reciba argumentos. Para este caso la función debe devolver `undefined`.


[Jest]: https://jestjs.io/en/
[CLI]: https://jestjs.io/docs/en/cli
[@vue/test-utils]: https://github.com/vuejs/vue-test-utils
[configuración]: https://jestjs.io/docs/en/configuration
[Babel]: https://babeljs.io/
[babel-jest]: https://www.npmjs.com/package/babel-jest
[describe]: https://jestjs.io/docs/en/api#describename-fn
[test]: https://jestjs.io/docs/en/api#testname-fn-timeout
