# language-lua-wow

Add syntax highlighting for the World of Warcraft API in Lua files in Atom.

![Example screenshot using the One Dark theme](https://raw.githubusercontent.com/nebularg/language-lua-wow/master/screenshot.png)

This package provides [language-lua](https://atom.io/packages/language-lua) and adds the following scopes:
- **support.function.wow.api**: [WoW API functions](http://wow.gamepedia.com/World_of_Warcraft_API).
- **support.function.wow.framexml**: Functions implemented in Lua that are used by the UI.
- **support.function.wow.widget.[Widget]**: [Widget methods](http://wow.gamepedia.com/Widget_API).
- **support.function.wow.lua**: Functions that are references to standard library functions, functions added to standard libraries, and added basic functions. ([Lua functions](https://wow.gamepedia.com/Lua_functions))
- **constant.wow.event**: [Event names](http://wow.gamepedia.com/Events).


To change the syntax highlighting for these scopes, you need to add styles to the `style.less` file in your `~/.atom` directory.

You can open this file in an editor from the File > Stylesheet... menu.

For example, you could add the following rule to your `~/.atom/styles.less` file to tweak the color of WoW functions:
```less
atom-text-editor::shadow {
  .support.function.wow {
    &.api, &.widget {
      color: darken(@syntax-color-function, 15%);
    }
    &.framexml {
      color: lighten(@syntax-color-function, 10%);
    }
  }
}
```

Themes [_probably_](https://github.com/atom/one-dark-syntax/blob/master/styles/syntax-variables.less) have a set of variables defined that you can use, but of course you can always do your own thing.

### Credit

Originally created from the [World of Warcraft Textmate Bundle](http://www.wowace.com/addons/wow-textmate/).

Keywords are updated from [Townlong Yak](https://www.townlong-yak.com/framexml/), [Wowpedia](http://wow.gamepedia.com/) and [World of Warcraft Programming](http://wowprogramming.com/docs).

Lua syntax, snippets, and options are from [language-lua](https://github.com/FireZenk/language-lua) by FireZenk.
