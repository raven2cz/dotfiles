<a name="v0.9.2"></a>
# v0.9.2 (2015-12-11)

## :bug: Bug Fixes

- Fix access to non existent callback in custom element ([c4b14968](https://github.com/abe33/atom-utils/commit/c4b1496836c96cec3ea740c3e6a021c934a37e53), [abe33/atom-pigments#120](https://github.com/abe33/atom-pigments/issues/120), [atom-minimap/minimap#424](https://github.com/atom-minimap/minimap/issues/424))

<a name="v0.9.1"></a>
# v0.9.1 (2015-12-11)

## :bug: Bug Fixes

- Fix callback can't be added to already registered prototype ([8752b11f](https://github.com/abe33/atom-utils/commit/8752b11fa32ae62e0a1c26905d93d22b843f6bce))
- Fix constructor function properties improperly copied ([04439656](https://github.com/abe33/atom-utils/commit/04439656ee65efe8fd5bd5a38e32e526490cb4b7))

<a name="v0.9.0"></a>
# v0.9.0 (2015-12-08)

## :sparkles: Features

- Implement a babel-friendly version of the space pen dsl ([b9478b5c](https://github.com/abe33/atom-utils/commit/b9478b5c5b8f90719798eb72dcc92a77bfd19dd7))
  <br>Accessed through `SpacePenDSL.Babel`

<a name="v0.8.0"></a>
# v0.8.0 (2015-12-07)

## :sparkles: Features

- Implement support for static methods when registering custom elements ([5d28ac22](https://github.com/abe33/atom-utils/commit/5d28ac22dd767653fe3403a60b46f6fccc3179f4))

<a name="v0.7.5"></a>
# v0.7.5 (2015-12-07)

## :bug: Bug Fixes

- Fix babel classes not supported ([e0cfb2fe](https://github.com/abe33/atom-utils/commit/e0cfb2fe182a5887e20ef08757ac8676b315affd))

<a name="v0.7.4"></a>
# v0.7.4 (2015-11-01)

## Other

Remove logs in `registerOrUpdateElement` function.

<a name="v0.7.3"></a>
# v0.7.3 (2015-11-01)

## :bug: Bug Fixes

- Fix SpacePenDSL not compatible with new custom element registration ([278c8867](https://github.com/abe33/atom-utils/commit/278c8867a1ac3a5402732bee526313031044ab75))

<a name="v0.7.2"></a>
# v0.7.2 (2015-11-01)

## :bug: Bug Fixes

- Fix loop iterator used as key in function ([8ebe3ac8](https://github.com/abe33/atom-utils/commit/8ebe3ac863cadecc58ea593f933e277df6396543))

<a name="v0.7.1"></a>
# v0.7.1 (2015-11-01)

## Other

Javascript files were not properly published along with the new version.

<a name="v0.7.0"></a>
# v0.7.0 (2015-11-01)

## :sparkles: Features

- Add registerOrUpdateElement function ([3d6d5dd1](https://github.com/abe33/atom-utils/commit/3d6d5dd1e94455d743b07463bb21774bb110e70d))

## Other

- ResizeDetection mixin is now deprecated ([797b1c80](https://github.com/abe33/atom-utils/commit/797b1c8031d06efc3567bb73999235c2c93f3b50))

<a name="v0.6.3"></a>
# v0.6.3 (2015-09-21)

## :bug: Bug Fixes

- Fix error when package promise is a native one ([750913d9](https://github.com/abe33/atom-utils/commit/750913d93c570d8887414e3ffe67a55198a2f0ab), [#2](https://github.com/abe33/atom-utils/issues/2))

<a name="v0.6.2"></a>
# v0.6.2 (2015-06-29)

## :bug: Bug Fixes

- Fix outlet not supported with shadow DOM ([ecbf3bd2](https://github.com/abe33/atom-utils/commit/ecbf3bd2d22554da4eda7eb5712a79031fad8de8))

<a name="v0.6.0"></a>
# v0.6.0 (2015-06-29)

## :sparkles: Features

- Add support for shadow DOM in space pen DSL ([94946815](https://github.com/abe33/atom-utils/commit/9494681549fcfce9a4019b991b446f7086608e4b))

## :bug: Bug Fixes

- Fix require of ancestors mixin ([9216e955](https://github.com/abe33/atom-utils/commit/9216e95558bc34e71e0dd8f673e295445c795c61))

<a name="v0.5.0"></a>
# v0.5.0 (2015-02-05)

## :sparkles: Features

- Add a mixin to implement DOM polling for size change detection ([d17f4d3d](https://github.com/abe33/atom-utils/commit/d17f4d3db478cda6ed0b6a2b5d35a6365e70f275))
- Add parent methods like querySelector and querySelectorAll ([82d8b8f1](https://github.com/abe33/atom-utils/commit/82d8b8f13304acd503d068993090b561373b2b35))

<a name="v0.4.3"></a>
# v0.4.3 (2015-01-19)

## :bug: Bug Fixes

- Fix broken ancestor method ([ec99f409](https://github.com/abe33/atom-utils/commit/ec99f409edd505a0db0b88c26b1167b42a39ad2f))


<a name="v0.4.0"></a>
# v0.4.0 (2015-01-19)

## :sparkles: Features

- Add class methods to traverse parents of arbitrary nodes ([ad46fc59](https://github.com/abe33/atom-utils/commit/ad46fc59dcaf9fa505a21c8c9f138ccbb84795fb))


<a name="v0.3.1"></a>
# v0.3.1 (2015-01-19)

## :bug: Bug Fixes

- Fix missing files in latest release


<a name="v0.3.0"></a>
# v0.3.0 (2015-01-19)

## :sparkles: Features

- Add a mixin to traverse ancestor nodes ([c9085f60](https://github.com/abe33/atom-utils/commit/c9085f60ffda4d81966a87c76ff6a7c6294bb355))

<a name="v0.2.0"></a>
# v0.2.0 (2015-01-18)

## :sparkles: Features

- Add space-pen DSL mixing for custom elements ([2a6a7933](https://github.com/abe33/atom-utils/commit/2a6a79330b6dfe18cb41b270a1a789c38094fcc6))

<a name="v0.1.2"></a>
# v0.1.2 (2015-01-13)

## :bug: Bug Fixes

- Revert to compiled version with grunt ([a5d5f49c](https://github.com/abe33/atom-utils/commit/a5d5f49c147c49ecec8ab886319afce36b76157b))

<a name="v0.1.1"></a>
# v0.1.1 (2015-01-12)

## :bug: Bug Fixes

- Fix broken npmignore ([65c91687](https://github.com/abe33/atom-utils/commit/65c91687096d54f89cd4452ff2eedb8776ca5aab))

<a name="v0.1.0"></a>
# v0.1.0 (2015-01-12)

## :sparkles: Features

- Add EventsDelegation mixin ([fb332bb5](https://github.com/abe33/atom-utils/commit/fb332bb5a21a34c719f66d51f2e03c828548263f))
