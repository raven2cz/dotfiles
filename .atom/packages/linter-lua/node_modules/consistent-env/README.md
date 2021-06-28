# Consistent-Env

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/consistent-env.svg)](https://greenkeeper.io/)

`consistent-env` is an npm module that gives you the correct ENV, consistently. It's especially useful for OSX GUI apps, because due to an OS limitation they are not given proper env variables. This package also caches the result which results in a performance boost when a lot of packages are relying on it, it also doesn't modify the globals so using it in dependencies is safe.

## Installation

```
npm install --save consistent-env
```

## API

```
module.exports = function(): Object<string, string>
module.exports.async = function(): Promise<Object<string, string>>
```

## FAQ

#### Unable to determine environment

If you are on OSX and using the System Default ZSH, It has a bug that causes it to live forever, thus triggering timeout
for `consistent-env`, to fix it you should install `zsh` using homebrew, we recommend [Rick's Guide](http://rick.cogley.info/post/use-homebrew-zsh-instead-of-the-osx-default/).

## License

This project is licensed under the terms of MIT License, see the LICENSE file for more info
