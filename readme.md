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
  7. Métodos de Jest más utilizados

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

Además, si queremos lanzar los tests sobre componentes de *Vue.js* debemos tener instalado el paquete [@vue/test-utils] y el paquete [jsdom].

```bash
# Install vue test utils
$ npm install --save-dev @vue/test-utils vue-jest jsdom jsdom-global
```

## 1. Comandos básicos de Jest

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

 Es recomendable dar de alta estos comandos en el `package.json` de nuestro proyecto mediante un alias para tenerlos más accesibles:

 ```javascript
 {
   ...,
   "scripts": {
     ...,
     "unit": "jest --coverage",
     "unit:only": "jest",
     "unit:watch": "jest --watch --coverage"
   },
 }
 ```

> La documentación del CLI de Jest puede encontrarse en [este enlace][CLI]

## 2. Configuración básica de Jest

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

```sh
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

## 5. Método `expect()` y sus funciones

Para definir las expectativas que tenemos acerca del comportamiento de una función se hace uso del método `expect()`. Generalmente invocamos a la función que tenemos que testear en diferentes escenarios y con diferentes argumentos y condiciones, y **esperamos** que el resultado sea uno.

Para el caso de la función `multiply` esperamos que al utilizarla con unos argumentos determiandos, el resultado sea la multiplicación de estos argumentos. El test que contempla este caso se escribiría de la siguiente manera:

```javascript
test('Multiply function returns the result of multiplying the arguments', () => {
  const a = 10, b = 2
  const result = multiply(a, b)
  expect(result).toBe(20)
})
```

Declaramos dos constantes conocidas (**10** y **2**) y las utilizamos como argumentos de la función `multiply`. Almacenamos el resultado de llamar a esta función en `result` y comprobamos que se cumple nuestra **espectativa** de que el resultado sea **20**. Para ello utilizamos el método `.toBe()` que compara el argumento de `expect()` contra el argumento que recibe.

> Una lista completa de los métodos que acompañan a `expect()` puede encontrarse en [este enlace][expect].

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

Volviendo a esa línea en el código de la función podemos ver que no hemos contemplado en nuestros tests el caso en que la función no reciba argumentos. Para este caso la función debe devolver `undefined`. Necesitamos un nuevo test que contemple este escenario:

```javascript
test('Multiply function returns undefined if no arguments are passed', () => {
  const result = multiply()
  expect(result).toBeUndefined()
})
```

Para comprobar que el resultado es `undefined` podemos utilizar el método `toBeUndefined()` que equivaldría a `toBe(undefined)`.

Con estos dos tests alcanzamos una cobertura del 100%, pero aunque estemos probando todos los escenarios, los casos no son suficientemente representativos y puede que la función no se esté comportando como esperamos a pesar de pasar los tests y tener una cobertura del 100%.

Pongamos por ejemplo esta modificación de la función `multiply`:

```javascript
function multiply(...values) {
  if (!values.length) return undefined
  return 20
}
```

Pasaría los tests que hemos programado sin problema, todas las líneas serían interpretadas y todos los statements evaluados, pero no cumple la función de multiplicar los argumentos que recibe.

Para conseguir una suite de tests más robusta podemos probar con diferentes argumentos la función `multiply` para demostrar que devuelve el resultado de multiplicarlos sean cuales sean estos argumentos. Para tests repetitivos de este tipo existe el método `test.each()` que nos permite lanzar el mismo test para distintos conjuntos de argumentos.

```javascript
test.each([
  [80, [ 10, 2, 4 ]],
  [-100, [ -5, 20 ]],
])('Multiply function returns %i when passing %p as arguments', (expected, values) => {
  const result = multiply(...values)
  expect(result).toBe(expected)
})
```

Ahora podemos como argumento de `test.each()` una tabla (o un array de arrays) que será lo que reciba la función de callback del método `test()` como argumentos ordenados. En nuestro caso, el primer elemento del array es el resultado que esperamos cuando los argumentos de `multiply` son los valores del segundo elemento del array. Podemos probar de esta forma que para distintos valores de entrada, la función se comporta como debería.

De hecho podríamos utilizar este mismo test para eliminar el test anterior y comprobar que devuelve undefined cuando no recibe argumentos si añadimos ese caso al array:

```javascript
test.each([ ..., [ undefined, [] ] ])(...) // expected -> undefined; values -> []
```

> Puede encontrarse más información acerca del método `test.each()()` en [este enlace][test-each]

Con este nuevo test, el método `multiply` modificado no pasaría todos los tests, y veríamos que realmente no funciona. Al corregir el método y dejarlo como estaba inicialmente podemos ver que pasa correctamente la suite 🎉

```bash
> test-course@1.0.0 unit /.../front:ux/test-course
> jest --coverage

 PASS  src/functions/functions.spec.js
  Multiply function test cases
    ✓ Multiply function returns the result of multiplying the arguments (2ms)
    ✓ Multiply function returns 80 when passing [10, 2, 4] as arguments
    ✓ Multiply function returns -100 when passing [-5, 20] as arguments
    ✓ Multiply function returns undefined if no arguments are passed

-------------|----------|----------|----------|----------|-------------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Lines   |
-------------|----------|----------|----------|----------|-------------------|
All files    |      100 |      100 |      100 |      100 |                   |
 functions.js|      100 |      100 |      100 |      100 |                   |
-------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.071s
Ran all test suites.
````

## 6. Funciones mockeadas `jest.fn()`

Es común encontrarse en la implementación de funciones, llamadas a otras funciones. Para que al testear las funciones de primer nivel dependemos de que las funciones que se invocan en el cuerpo de esta funcionen correctamente. Al tratarse de tests unitarios, esta dependencia debería tratar de eliminarse, ya que las funciones deberían poder probarse de forma completamente aislada.

Para ello debemos simular el funcionamiento de las funciones de las que depende la funcion objetivo utilizando el compotamiento que esperamos de estas, y no el que están teniendo (que puede ser erróneo).

Además de simular este funcionamiento podemos comprobar que estas funciones han sido invocadas desde la función de primer nivel.

Para esto es necesario utilizar las [jest mock functions] `jest.fn()`. Estas son funciones especiales que almacenan un estado y una historia acerca de cómo son invocadas, por quién, cuántas veces, con qué argumentos, etc.

Definiendo estas funciones y sustituyendo las que realmente se utilizan podemos testear el comportamiento de una función independientemente de cómo se comporten las funciones de las que depende.

En nuestro ejemplo vamos a considerar la función `compute()`:

```javascript
function compute(callback, ...values) {
  if (!callback || typeof callback !== 'function') return undefined
  return callback(...values)
}
```

Se trata de una función que toma otra función cómo argumento y se encarga de invocarla con los argumentos que recibe.

Cómo primer test se nos puede ocurrir comprobar que la función pasada como argumento es invocada al invocar la función `compute()`. Si pasamos una función cualquiera, no tendremos forma de detectar si ha sido invocada, sin embargo, utilizando una `jest.fn()` podemos a posteriori ver su estado y comprobarlo.

```javascript
test('Compute function calls the callback function passed as an argument', () => {
  const callback = jest.fn()
  const result = compute(callback)
  expect(callback).toHaveBeenCalled()
})
```

Mediante el método `.toHaveBeenCalled()`, específico de las `jest.fn()`, podemos hacer que el test pase cuando [Jest] detecte que la función pasada como argumento haya sido invocada al menos una vez.

Sin embargo, este test no demuestra que nuestra función se comporta como queremos. Sabemos que invoca a la función que recibe como parámetro, pero si no le pasa los argumentos correspondientes no hace lo que queremos que haga. Este test también daría un resultado positivo para esta modificación de la función `compute()`, ya que la función callback ha sido invocada:

```javascript
function compute(callback, ...values) {
  if (!callback || typeof callback !== 'function') return undefined
  return callback()
}
```

> Puede encontrarse la documentación acerca del método `.toHaveBeenCalled()` en [este enlace][toHaveBeenCalled].

Las `jest.fn()` además de permitirnos comprobar que han sido invocadas nos permiten ver qué argumentos han recibido. Para ello se utiliza el métido `.toHaveBeenCalledWith()`, al que se le pasan los argumentos que debería haber recibido la función.

```javascript
test('Compute function calls the callback function passing on the arguments', () => {
  const a = 10, b = 2
  const callback = jest.fn()
  const result = compute(callback, a, b)
  expect(callback).toHaveBeenCalledWith(a, b)
})
```

En nuestro caso podemos comprobar que al llamar a la función de primer nivel con los argumentos `a` y `b`, la función que se invoca internamente también se llama con esos mismos argumentos.

> Puede encontrarse la documentación acerca del método `.toHaveBeenCalledWith()` en [este enlace][toHaveBeenCalledWith].

Generalente el resultado de estas funciones invocadas internamente se utiliza dentro de la función de primer nivel, por lo que si queremos comprobar que funciona correctamente debemos simular el comportamiento de estas funciones internas para que no rompa el funcionamiento de la función que estamos probando.

En nuestro caso, como el resultado de la función de primer nivel es el resultado de la implementación de la función interna, podemos simular cualquier implementación y comprobar que la función que estamos probando implementa esa funcionalidad.

```javascript
test('Compute function returns the callback result', () => {
  const a = 10, b = 2
  const callback = jest.fn((a, b) => `${a}, ${b}`)
  const result = compute(callback, a, b)
  expect(result).toBe('10, 2')
})
```

Podemos por ejemplo comprobar que al pasar una función que devuelve los dos argumentos concatenados como una string, la función de primer nivel replica este funcionamiento.

> Otra forma de simular la implementación de una función de jest es utilizar el método `.mockImplementation()`. Puede encontrarse la documentación acerca de este método en [este enlace][mockImplementation].

Por último quedaría cubrir la línea que comprueba si la función de callback no es una función devolviendo `undefined` con lo que completaríamos la suite para la función `compute()`.

```javascript
test('When callback is not a function Compute returns undefined', () => {
  const a = 10, b = 2
  const result = compute('not a function', a, b)
  expect(result).toBeUndefined()
})
```

El resultado completo de la suite sería el siguiente 🎉:

```bash
> test-course@1.0.0 unit /.../front:ux/test-course
> jest --coverage

 PASS  src/functions/functions.spec.js
  Multiply function test cases
    ✓ Multiply function returns the result of multiplying the arguments (3ms)
    ✓ Multiply function returns 80 when passing [10, 2, 4] as arguments
    ✓ Multiply function returns -100 when passing [-5, 20] as arguments (1ms)
    ✓ Multiply function returns undefined if no arguments are passed
  Divide function test cases
    ✓ Divide function returns the result of dividing the arguments (1ms)
    ✓ Divide function returns 2 when passing [80, 4, 10] as arguments
    ✓ Divide function returns -1 when passing [-10, 10] as arguments
    ✓ Divide function returns undefined if no arguments are passed (1ms)
  Sum function test cases
    ✓ Sum function returns the result of adding the arguments
    ✓ Sum function returns 94 when passing [80, 4, 10] as arguments (1ms)
    ✓ Sum function returns -8 when passing [-10, 2] as arguments
    ✓ Sum function returns undefined if no arguments are passed
  Compute function test cases
    ✓ Compute function calls the callback function passed as an argument (1ms)
    ✓ Compute function calls the callback function passing on the arguments (1ms)
    ✓ Compute function returns the callback result (1ms)
    ✓ When callback is not a function Compute returns undefined

-------------|----------|----------|----------|----------|-------------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Lines   |
-------------|----------|----------|----------|----------|-------------------|
All files    |      100 |      100 |      100 |      100 |                   |
 functions.js|      100 |      100 |      100 |      100 |                   |
-------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        0.984s, estimated 1s
Ran all test suites.
```

## 7. Métodos de Jest más utilizados

[Jest] ofrece muchos más métodos de los que se muestran en esta sección y pueden encontrarse descripciones y ejemplos en la [documentación oficial][Jest], pero los más comunes son los siguientes:

```javascript
/* GLOBALS (https://jestjs.io/docs/en/api) */
describe('name', () => {})
test('name', () => {}, timeout)
test.each(cases)('name', () => {}, timeout)
beforeAll(() => {}, timeout)
beforeEach(() => {}, timeout)

/* EXPECT (https://jestjs.io/docs/en/expect) */
expect().toBe()
expect().toBeUndefined()
expect().toBeNull()
expect().toBeTruthy()
expect().toEqual() // used with objects
expect().not.toBe()
expect().toHaveBeenCalled() // used with mocks
expect().toHaveBeenCalledWith() // used with mocks
expect().toHaveReturned() // used with mocks

/* MOCKS (https://jestjs.io/docs/en/mock-function-api) */
jest.fn()
jest.fn().mockImplementation(() => {})
jest.fn().mockReturnValue(value)
jest.fn().mockClear()
jest.fn().mockReset()
jest.fn().mockRestore()
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
