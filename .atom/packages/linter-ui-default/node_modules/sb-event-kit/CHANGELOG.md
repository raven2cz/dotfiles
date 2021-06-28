## 3.0.0

- `Disposable` constructor now asserts the parameter to be a function
- `Disposable#isDisposed()` has been removed and `Disposable#disposed` has been added
- `Emitter#isDisposed()` has been removed in favor of already existing `Emitter#disposed`
- `CompositeDisposable#isDisposed()` has been removed in favor of already existing `CompositeDisposable#disposed`
- All params to `CompositeDisposable#*` are now validated
- `CompositeDisposable` now accepts callback functions in addition to `Disposable`s
- `CompositeDisposable#remove` has been renamed to `CompositeDisposable#delete` to match ES6 Set and Map style
- `Emitter#emit` returns a standardized type instead of multiple types
- Export as both individuals and default

## 2.0.0

* Remove `bundle` and `library` versions in favor of webpack/pundle style requires

## 1.1.2

* Fix invalid name in browserify bundle

## 1.1.1

* Add outputs for both bundle and library

## 1.1.0

* Support async event listeners by waiting on promises returned from event listeners (Non API breaking change)

## Pre 1.0.3

* Initial API implemented
