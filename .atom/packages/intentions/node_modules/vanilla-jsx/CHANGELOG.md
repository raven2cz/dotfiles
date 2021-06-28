#### 3.0.2

 - `render` method now returns the rendered HTMLElement

#### 3.0.1

New features

 - Refs are now proxified from the element to instance

#### 3.0.0

Re-implement as a component base, features include

 - renderToString for `node`
 - render for browsers
 - Support for `ref` attribute
 - Support for event listeners in `<div on-click={myFunction}>` syntax
 - Translation of className attribute into class
 - Acceptance of arrays as childNodes
 - Acceptance of functions as attribute values, they are called on usage and their return value is used
 - More test cases

#### 2.0.2

 - Improve support for nested children

#### 2.0.1

 - Clarified a few bits in the README

#### 2.0.0

 - Breaking Change: Rename onClick to on-click
 - Breaking Change: Drop support for $ attributes
 - Add support for `ref` attribute with `process` method
 - Add support for arrays as children

#### 1.1.3

 - Fix an occasional bug where children won't be appended properly

#### 1.1.2

 - Supports setting properties via JSX

#### 1.1.1

 - Accepts null as attributes (JSX compat)

#### 1.1.0

 - Added support for event subscriptions

#### 1.0.0

 - Initial implementation
