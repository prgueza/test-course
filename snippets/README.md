# Snippets con la estructura de los tests

## Uso

Independientemente del editor que estemos usando, para utilizar el snippet basta con abrir una archivo con la extensión `*.js`, escribir `test` y pulsar <kbd>⇥ Tab</kbd>.

## Instalación

### VSCode

Para instalar el snippet en [VSCode] hay que acceder a la configuración de snippets de [VSCode] a través de `Archivo > Preferencias` (o `Code > Preferencias` en Mac) y seleccionar `javascript.json (JavaScript)` para ver los snippets disponibles para este lenguaje. Una vez ahí hay que añadir el JSON del archivo [vscode_snippet.json].

> Documentación de snippets de VSCode: [Snippets en VSCODE]

### Atom

Para instalar el snippet en Atom hay que copiar el contenido del arhivo [atom_snippet.cson] en el archivo `snippets.cson` de [Atom], al que se llega a través de `Atom > Snippets`. Si ya tenemos algún snippet para el scope `.source.js` habrá que obviar la línea `.source.js:` del archivo [atom_snippet.cson] y copiar lo demás dentro de este scope.

> Documentación de snippets de Atom: [Snippets en Atom]

[atom]: https://atom.io/

[vscode]: https://code.visualstudio.com/

[snippets en vscode]: https://code.visualstudio.com/docs/editor/userdefinedsnippets

[snippets en atom]: https://flight-manual.atom.io/using-atom/sections/snippets/

[atom_snippet.cson]: ./atom_snippet.cson

[vscode_snippet.json]: ./vscode_snippet.json
