Extify
=====

Extify is a node module to resolve executables within PATH and PATHEXT, a lot like `where` or `which`, just simpler and lightweight

## Installation
```
npm install -g extify
```

## API
```
export default function extify(path: string, envPath: ?string = null, envExtPath: ?string = null): Promise<string>
export function extifySync(path: string, envPath: ?string = null, envExtPath: ?string = null): string
```

## License

This Project is licensed under the terms of MIT License, see the LICENSE file for more info.
