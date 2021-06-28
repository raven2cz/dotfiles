Atom-Package-Path
=================

An npm module to get path of requirer apm module from your npm module

##### API

```js
export function guess(): ?string
export function guessFromCallIndex(index: number): ?string
export function guessFromFilePath(filePath: string): ?string
```

#### Usage

```js
import {guess} from 'atom-package-path'

export function doSomething() {
  console.log('this package was required in apm package', guess())
}
```

#### Notes

This package guesses filePath of requirer based on the stack. It expects the stack to come from the Atom package, therefore it will work only when you call this method when your module is called from an Atom package.

#### License

This project is licensed under the terms of MIT License. Check the LICENSE file for more info.
