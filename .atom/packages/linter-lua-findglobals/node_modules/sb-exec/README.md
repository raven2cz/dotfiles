# Exec

Node's Process spawning APIs beautified

## Installation

```sh
npm install --save sb-exec
```

## API

```js
type $Options = {
  timeout?: number | Infinity,
  stream?: 'stdout' | 'stderr'  | 'both',
  env: Object,
  stdin?: ?string,
  local?: {
    directory: string,
    prepend?: boolean
  },
  throwOnStdErr?: boolean
} // Also supports all options of child_process::spawn
export function exec(filePath: string, parameters: array, options: $Options)
export function execNode(filePath: string, parameters: array, options: $Options)
```

## Explanation

### `options.local`

`options.local` is a way of adding locally installed npm bins to `PATH` of the
process being spawned. Please have a look at the program structure below.

If the control of your program is in `lib/index.js` and you pass that directory
to this module ( like `{ local: { directory: __dirname } }` ), then the `flow`
executable in `node_modules/.bin/flow` will automatically be added to PATH.

If the control of your program is in `node_modules/flow/index.js` and you pass
that directory as the local directory, both the `flow` and `freedom` executables
will be available to the program being executed.

`options.local.prepend` determines the priority of the local bins, if set to
true, local ones will be prioritized over global ones, otherwise they'll be
treated as a fallback.

```raw

.
├── lib
│   └── index.js
└── node_modules
    ├── .bin
    │   └── flow
    └── flow
        ├── index.js
        └── node_modules
            ├── .bin
            │   └── freedom
            └── freedom
                └── index.js

```

## License

This project is licensed under the terms of MIT License, see the LICENSE file
for more info
