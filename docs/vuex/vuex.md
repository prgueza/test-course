# Tests con Vuex

## 1. Introducción

Por lo general, muchos de los componentes que desarrollamos para nuestras aplicaciones interactúan de alguna forma con el store de Vuex de la aplicación, ya sea consumiendo datos a través de `$store.state` o `getters`, o lanzando acciones o mutaciones para modificar el estado. De esta forma conseguimos delegar una serie de responsabilidades en el módulo de Vuex que utiliza nuestro componente y nos permite compartir acciones y estado entre componentes.

A la hora de hacer tests para componentes que utilicen el store hay que entender qué tests corresponden al propio componente, y qué tests deben ser parte de la suite de tests del módulo de Vuex. Además hay que saber identificar qué parte de la funcionalidad es responsabilidad nuestra y qué parte está garantizada por la propia librería de Vuex y sus desarrolladores, para no hacer tests innecesarios.

Para probar los módulos de Vuex hay que pensar en el estado inicial con el que queremos que arranque el componente y verificar que las acciones y mutaciones hacen que este estado cambie de forma predecible y tal y como está planteado funcionalmente en nuestro desarrollo. Además debemos garantizar que los getters que desarollemos nos permitan acceder a este estado tal y como nosotros queremos. Este será el centro de atención para los tests que desarrollemos a la hora de probar un módulo de Vuex.

En cambio, para probar los componentes que hagan uso de estos módulos, debemos probar que el componente interactúa con el store tal y como queremos, pero no es necesario repetir las pruebas que se hacen en la suite del módulo de Vuex. Es suficiente con comprobar que el componente hace uso de la interfaz que ofrece Vuex, es decir, que es capaz de invocar las acciones y mutaciones y de recuperar el estado a través de los `getters` o del propio `state`.

Esto significa que, por ejemplo, si desde el componente lanzamos una acción, que a través de una mutación cambia el estado de nuestro módulo, y que este estado va a ser utilizado por el componente para, mediante un getter, presentar cierta información en la pantalla, no es necesario en el test del componente probar todo este flujo. Tenemos que pensar que el componente lo único que hace es lanzar una acción y leer un estado. Si nos aseguramos mediante el test de que el componente lanza esa acción y consume ese estado, el probar cómo se esté haciendo la transformación corresponde a la suite del módulo o incluso al equipo de Vuex. Podemos probar en un test que se llama a la acción y en otro que se consume el estado, con esto debería ser suficiente para garantizar que su funcionamiento esté completamente testeado.

Hay que tener en cuenta en el caso de probar Vuex y componentes que lo utilicen, que si en algún momento cambia la interfaz de nuestros módulos, habrá que revisar que los componentes que utilicen estos módulos sigan funcionando como es debido, y en ocasiones puede ser necesario actualizar tanto los componentes como la suite de tests de estos.

## 2. Testear componentes con Vuex

Existen distintas formas distintas de hacer tests en un componente que interaccione con Vuex, y el uso de cada una de ellas depende fundamentalmente del nivel de interacción y de la complejidad de esta entre el componente y el store.

### 2.1 Mediante un Store local

Una de las opciones es configurar en la instancia de Vue que extiende nuestro componente un store de forma que éste pueda acceder e interactuar con él tal y como lo hace en el entorno de la aplicación. Aunque podemos importar el propio módulo de Vuex que utilice nuestro componente, si no se utilizan todas las propiedades del estado, todas las acciones y mutaciones, etc. es más conveniente crear un nuevo módulo dentro de nuestro archivo de test exclusivamente con las partes del módulo que se vayan a utilizar. Esto nos permite además tener más control sobre las acciones y el estado y podemos configurarlo según nuestras necesidades de manera más sencilla. Es muy típico al utilizar este método sustituir las acciones por `jest.fn()` para tener control acerca de cuándo se llaman y con qué argumentos.

Si utilizamos este método es importante hacer uso del método `createLocalVue`, ya que es conveniente instalar este store personalizado únicamente en la instancia de Vue que utilice este componente en concreto para no interferir con otros tests.

```js
import Vuex from "vuex"
import { mount, createLocalVue } from "@vue/test-utils"
import Component from "@/components/Component.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

const incrementMock = jest.fn()

const store = new Vuex.Store({
  state: {
    count: 0
  },
  actions: {
    increment: incrementMock
  }
})

describe("Component", () => {
  test("User action triggers an increment on the counter", () => {
    const wrapper = mount(Component, {
      store, // Utilizamos el store creado más arriba
      localVue // Utilizamos el Vue local específico para este componente
    })
    // Alguna acción del usuario
    ...
    // Podemos comprobar que se produce una llamada al store
    expect(incrementMock).toHaveBeenCalledWith(1)
  })
})
```

Esta forma de probar componentes que hagan uso de Vuex es completamente válida pero implica crear un store y mantener el store funcional a lo largo de todos los tests, intentando que unos test no entren en conflicto con otros, ya que todos utilizan el mismo store y los cambios que un test hagan sobre este se mantendrán para el siguiente. Podemos reiniciar el store antes de cada test o utilizar distintos stores para cada test, pero esto se hace muy complicado y dificil de mantener.

### 3.2 Mediante mocks

Otra opción es traer a cada test únicamente la parte del store que necesite mediante la api de mocks que proveen las Vue Test Utils. A la hora de montar un componente podemos mockear la propiedad `$store` de nuestro componente para tener accesible desde ahí el estado, los getters, las acciones y las mutaciones.

```js
test("User action triggers an increment on the counter", () => {
  const incrementMock = jest.fn()
  const wrapper = mount(Component, {
    mocks: {
      $store: { // Mockeamos la propiedad $store dentro de nuestro componente
        mutations: { increment: incrementMock }
      }
    }
  })
  // Alguna acción del usuario
  ...
  // Podemos comprobar que se produce una llamada al store
  expect(incrementMock).toHaveBeenCalledWith(1)
})
```

Esta forma es mucho más flexible y aisla el store a cada test. Además no es necesario mockear el store entero dentro de un test que no haga uso de todas las partes del módulo. En el caso anterior, no se ha configurado el estado del store porque solo interesa saber si se ha invocado la acción, por ejemplo.

### 2.3 Mediante el uso de methods o computed

Los getters generalmente se encuentran en forma de computed properties dentro de nuestros componentes. Del mismo modo las acciones se encuentran den forma de métodos. Esto hace que podamos mockear nuestros getters y nuestras acciones (también el state y las mutaciones) a través de la opción `computed` y la opción `methods` a la hora de montar nuestro componente. Como estos mocks sobrescribirán las propiedades y métodos con ese nombre ya existentes en el componente, podemos usarlo de manera conjunta con los mappers que proporciona Vuex (`mapState`, `mapGetters`, `mapActions`, `mapMutations`).

```js
test("User action triggers an increment on the counter", () => {
  const incrementMock = jest.fn()
  const wrapper = mount(Component, {
    computed: {
      count: () => 0
    },
    methods: {
      increment: incrementMock
    }
  })
  // Alguna acción del usuario
  ...
  // Podemos comprobar que se produce una llamada al store
  expect(incrementMock).toHaveBeenCalledWith(1)
})
```


## Testear módulos de Vuex
