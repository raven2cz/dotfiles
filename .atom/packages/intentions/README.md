Intentions
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/intentions.svg)](https://greenkeeper.io/)

Intentions is a base package that provides an easy-to-use API to show intentions based in Atom.

#### Usage

The default keybinding on OSX to trigger list is `ctrl` + `enter`. If you want to trigger intentions highlights,
press `alt`.

The default keybinding on Windows and Linux to trigger list is `alt` + `enter`. If you want to trigger intentions
highlights press `ctrl`.

#### APIs

Intentions provides two kinds of APIs, there's Intentions List API that allows you to add items
to intentions list. Here is what it looks like,

![Intentions List API](https://cloud.githubusercontent.com/assets/4278113/12488546/e73809ba-c08d-11e5-8038-dd222f3a815d.png)

The second type of API is highlight API. It allows packages to mark buffer ranges and do cool thing with them.
It can be jump-to-declaration click, show type on mouse move and show color as underline.
Here is what it looks like

![Intentions Highlight API](https://cloud.githubusercontent.com/assets/4278113/12878032/0f915ef2-ce3f-11e5-833e-be231abeda12.png)

You can find docs about both of these in [Intentions Wiki](https://github.com/steelbrain/intentions/wiki/Intentions-API)

#### License
This package is licensed under the terms of MIT License, see the license file for more info.
