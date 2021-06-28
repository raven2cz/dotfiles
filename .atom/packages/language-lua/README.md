Lua language support in Atom
======

Add syntax highlighting and snippets to Lua files in Atom.

See: https://atom.io/packages/language-lua
and: https://www.npmjs.com/package/language-lua

Common snippets
---
| Trigger       | Name                     | Body                 |
| ------------- |--------------------------| ---------------------|
| -[            | multiline comment        | --[[ comment... ]]   |
| =[            | nested multiline comment | --[=[ comment... ]=] |
| afun          | anon function            | functionName = function (args) -- body... end |
| for           | for i=1,10               | for i = 1, 10 do -- body... end |
| fori          | for i,v in ipairs()      | for i,v in ipairs(table_name) do -- body... end |
| forp          | for k,v in pairs()       | for k,v in pairs(table_name) do -- body... end |
| fun           | function                 | function functionName (args) -- body... end |
| if            | if conditional           | if value then --body... end |
| ife           | if else conditional      | if value then --body... else --body... end |
| ifn           | if not conditional       | if not value then --body... end |
| ifne          | if not else conditional  | if not value then --body... else --body... end |
| lfun          | local function           | local function functionName (args) -- body... end |
| loc           | local variable definition shortcut | local x = 1 |
| local         | local variable definition | local x = 1 |
| ltab          | local table definition   | local name = {}      |
| print         | print                    | print("logging")     |
| rep           | repeat loop shortcut     | repeat -- body... until condition |
| repeat        | repeat loop              | repeat -- body... until condition |
| req           | require shortcut         | local name = require "module" |
| require       | require                  | local name = require "module" |
| ret           | return definition shortcut | return value       |
| return        | return definition        | return value         |
| tab           | table definition         | name = {}            |
| whi           | while loop shortcut      | while condition do -- body... end |
| while         | while loop               | while condition do -- body... end |

Table manipulation snippets
---
| Trigger       | Name                     | Body                 |
| ------------- |--------------------------| ---------------------|
| tabc          | table.concat             | table.concat(tableName, " ", start_index, end_index) |
| tabf          | table.foreach            | table.foreach(tableName, function) |
| tabi          | table.insert             | table.insert(tableName, data) |
| tabs          | table.sort               | table.sort(tableName, sortfunction) |
| tabr          | table.remove             | table.remove(tableName, position) |
| tabm          | table.maxn               | table.maxn(tableName)

Math function snippets
---
| Trigger       | Name                     | Body                 |
| ------------- |--------------------------| ---------------------|
| abs           | math.abs                 | math.abs(x)          |
| acos          | math.acos                | math.acos(x)         |
| asin          | math.asin                | math.asin(x)         |
| atan          | math.atan                | math.atan(x)         |
| atan2         | math.atan2               | math.atan2(y, x)     |
| ceil          | math.ceil                | math.ceil(x)         |
| cos           | math.cos                 | math.cos(x)          |
| cosh          | math.cosh                | math.cosh(x)         |
| deg           | math.deg                 | math.deg(x)          |
| exp           | math.exp                 | math.exp(x)          |
| floor         | math.floor               | math.floor(x)        |
| fmod          | math.fmod                | math.fmod(x, y)      |
| frexp         | math.frexp               | math.frexp(x)        |
| huge          | math.huge                | math.huge            |
| ldexp         | math.ldexp               | math.ldexp(m, e)     |
| log           | math.log                 | math.log(x)          |
| log10         | math.log10               | math.log10(x)        |
| max           | math.max                 | math.max(x, ...)     |
| min           | math.min                 | math.min(x, ...)     |
| pi            | math.pi                  | math.pi              |
| pow           | math.pow                 | math.pow(x, y)       |
| rad           | math.rad                 | math.rad(x)          |
| random        | math.random              | math.random(m, n)    |
| randomseed    | math.randomseed          | math.randomseed(x)   |
| sin           | math.sin                 | math.sin(x)          |
| sinh          | math.sinh                | math.sinh(x)         |
| sqrt          | math.sqrt                | math.sqrt(x)         |
| tan           | math.tan                 | math.tan(x)          |
| tanh          | math.tanh                | math.tanh(x)         |

Author
------
__Jorge Garrido Oval__
* [https://github.com/FireZenk](https://github.com/FireZenk)


Contributors
---

Contributions are greatly appreciated. Please fork this repository and open a
pull request to add snippets, make grammar tweaks, etc.

License
------
Atom language-lua is released under the MIT license.

>Originally [converted](http://atom.io/docs/latest/converting-a-text-mate-bundle)
from the [Lua TextMate bundle](https://github.com/textmate/lua.tmbundle).
