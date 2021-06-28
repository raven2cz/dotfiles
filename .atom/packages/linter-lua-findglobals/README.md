# linter-lua-findglobals

Check Lua files for global variable access on the fly. Based on the [FindGlobals](http://www.wowace.com/addons/findglobals/) lua script by Mikk.

Due to the way that `luac` works, global variables will only be highlighted while there is not an error found in the file.

## Installation
Before using this package, you must ensure that you have `luac` or `luajit` installed on your system. If the program is not available on your system path, you will need to set the path in settings:

File -> Settings -> Packages -> Linter Lua Findglobals -> **Luac**

See [http://www.lua.org/manual/5.1/luac.html](http://www.lua.org/manual/5.1/luac.html) for more information about `luac`.

 - `$ apm install linter-lua-findglobals`

##  What do I need to know about globals for?

To optimize performance, you may want to declare `local` versions of commonly used functions and variables rather than make global namespace lookups.

Some global variables you may be okay with being global accesses (or in fact NEED them to because they can be hooked or changed), for those you have two options:

1.  Add one or more `-- GLOBALS: SomeFunc, SomeOtherFunc, SomeGlobalVariable` lines to the source file. This will ignore the variables.
2.  Put a `local _G = _G` at the top of the file, and then access them through `_G.SomeFunc`. This is actually somewhat faster than accessing them directly, believe it or not. Direct global access involves looking up the global variable table first!

Another benefit is finding the odd misspelled variable name or blocks of code that you may have copy/pasted from another source but forgot to update variables used.

## Directives in the file

You can change how the linter reports for a file. These directives can be anywhere in the file and will take effect globally.

**-- GLOBALS:** SomeGlobal, SomeOtherGlobal
 - The linter will never complain about these, but there is no way to un-GLOBAL an already declared global. There may be multiple of these anywhere in the file.

**-- GETGLOBALFILE** [ON|OFF]
 - Enable/disable `GETGLOBAL` checks in the global scope. (Default: OFF)

**-- GETGLOBALFUNC** [ON|OFF]
 - Enable/disable `GETGLOBAL` checks in functions. (Default: ON)

**-- SETGLOBALFILE** [ON|OFF]
 - Enable/disable `SETGLOBAL` checks in the global scope. (Default: ON)

**-- SETGLOBALFUNC** [ON|OFF]
 - Enable/disable `SETGLOBAL` checks in functions. (Default: ON)

## Issues

 - Only the first global is highlighted when multiple are found on the same line
 - Column start/end are guessed (string matched) and can be inaccurate
