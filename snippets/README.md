# Snippets con la estructura de los tests

## Instalación

### VSCode

Para instalar el snippet en [VSCode] hay que acceder a la configuración de snippets de [VSCode] a través de `Archivo > Preferencias` (o `Code > Preferencias` en Mac) y seleccionar `javascript.json (JavaScript)` para ver los snippets disponibles para este lenguaje. Una vez ahí hay que añadir el JSON del archivo [vscode_snippet.json].

> Documentación de snippets de VSCode: [Snippets en VSCODE]

### Atom

Para instalar el snippet en Atom hay que copiar el contenido del arhivo [atom_snippet.cson] en el archivo `snippets.cson` de [Atom], al que se llega a través de `Atom > Snippets`. Si ya tenemos algún snippet para el scope `.source.js` habrá que obviar la línea `.source.js:` del archivo [atom_snippet.cson] y copiar lo demás dentro de este scope.

> Documentación de snippets de Atom: [Snippets en Atom]


## Uso

Independientemente del editor que estemos usando, para utilizar el snippet basta con abrir una archivo con la extensión `*.js`, escribir alguno de los comandos disponibles y pulsar <kbd>⇥ Tab</kbd>.

### Comandos disponibles

| Nombre         | Comando                         | Resultado |
| -------------- | ------------------------------- | --------- |
| Test Skeleton  | `spec` + <kbd>⇥ Tab</kbd>       | Genera el esqueleto del archivo con un `describe global con el nombre del componente` |
| Describe       | `desc` + <kbd>⇥ Tab</kbd>       | Genera la estructura de un describe  |
| Describe Prop  | `desc-prop` + <kbd>⇥ Tab</kbd>  | General la estructura de un describe para una prop siguiendo la notación de Vue `:prop`|
| Describe Event | `desc-event` + <kbd>⇥ Tab</kbd> | General la estructura de un describe siguiendo la notación de Vue para un evento `@event`|
| Test           | `test` + <kbd>⇥ Tab</kbd>       | Genera la estructura de un test

[atom]: https://atom.io/

[vscode]: https://code.visualstudio.com/

[snippets en vscode]: https://code.visualstudio.com/docs/editor/userdefinedsnippets

[snippets en atom]: https://flight-manual.atom.io/using-atom/sections/snippets/

[atom_snippet.cson]: ./atom_snippet.cson

[vscode_snippet.json]: ./vscode_snippet.json
