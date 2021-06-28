## 2.0.1

- Fix updating the title of an IDE provider (@robertrossmann)

## 2.0.0

- support the API provided by the busy signal of the now retired atom-ide-ui package

## 1.4.3

- Fix an issue with addEventListener

## 1.4.2

- Change busy signal element to be much smoother

## 1.4.1

- Drop UUID4 in favor of `Math.random()`

## 1.4.0

- Major performance improvements
- Make the duration view more compact
- Improve time resolution (now shows ms instead of 0s)
- Remove `itemsToShowInHistory` config (I don't think anybody was using it)
- Remove priority from providers (non API breaking) (I don't think anybody was using it)

## 1.3.0

- Use the Atom native spinner interface
- Show the spinner for at least a second

## 1.2.0

- Show duration of execution in tooltip

## 1.1.0

- Show past signals in history
- Add a configuration to manage how many history items are shown

## 1.0.1

- Fix an installation issue with devDeps listed as deps

## 1.0.0

- Initial release
