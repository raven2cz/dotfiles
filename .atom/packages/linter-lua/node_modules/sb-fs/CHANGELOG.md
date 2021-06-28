## 3.0.0

- Remove `mkdirp` and `rimraf` to make the package lightweight
- Return a buffer or string depending on `encoding` in `readFile` instead of a string each time

## 2.0.0

- Make `FS.readFile` return a BOM stripped string

## 1.1.1

- Fix a bug where sync methods like `createReadStream` and classes like `ReadStream` would be promisified

## 1.1.0

- Add `exists` method

## 1.0.0

- Initial implementation
