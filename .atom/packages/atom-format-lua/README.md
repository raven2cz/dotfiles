# atom-format-lua package
---

[![Join the chat at https://gitter.im/mingjunyang/atom-format-lua](https://badges.gitter.im/mingjunyang/atom-format-lua.svg)](https://gitter.im/mingjunyang/atom-format-lua?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
本项目来自主要代码来自 [FormatLua](https://github.com/denglf/FormatLua)，经过该项目作者同意使用MIT协议使用到atom package。

### need lua5.1 on your PATH,the formatter.lua did not work on lua5.2 .

on linux system , you can use command `which lua5.1` ,if result like `/usr/bin/lua5.1`,it's can work.
###

###### 2016-01-23 rewrite atom-format-lua.coffee as lib/atom-format-lua.js

###### 2015-10-07 add lua5.1 path in config.cson

you should be set this value in `config.cson`
```cson
   "atom-format-lua":
     lua51: "/usr/bin/lua5.1"
```
if windows7/8/10.I haven't windows system,so I don't know where is lua5.1, maybe the  path like `C:\\xx\\xx\\lua5.1.exe`
```cson
   "atom-format-lua":
     lua51: "c:\program file\lua\bin\lua5.1.exe"
```

###### 2015-08-27 fix didnot work
It's my error.
在设置 formatter.lua 工作环境变量的时候取值如下，之前测试的时候没有发现问题,因为我就是在`atom-format-lua`包里测试的，能正常的工作。
```coffescript
wkspc=path.resolve('./luacode')
```
但是后来发现，换到其他的工作目录之后，上面方式取到的路径是当前工作目录的路径，所以这个插件使用的时候是报错的，在这之前完全没有正常工作。

###### 2015-08-22 alpha 0.1.0
1. 初步完成了原型功能，非常粗糙，这是第一次写coffescript，很多问题还要继续处理，写了一半才发现可以直接写JavaScript。
1. 没有信息提示，没有错误提示，没有状态栏提示。
1. 代码看上去不美观，代码逻辑层次也不清晰。
1. 没有写配置信息到atom的配置文件。
1. 没有autosave。
1. 没有写测试代码。
1. 没有在window和mac下测试运行，仅仅在openSUSE13.2中测试。
1. 没有英文文档。
1. keymap可能会冲突，还不会配置。
