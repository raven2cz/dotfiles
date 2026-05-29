---
id: project.somewm.scenefx-shadow-startup
title: SceneFX wibar shadow startup regression — fixed
type: decision
scope: project
feature: null
project: somewm
summary: Wibar shadow missing at TTY cold start was fixed by adding theme.shadow_drawin_color to every theme. Required for any new theme added to somewm-one.
tags: [somewm, scenefx, theme, wibar, shadow, fixed]
applies_to: [somewm]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-04-16
supersedes: []
superseded_by: null
links: [project.somewm.meta]
---

# SceneFX wibar shadow startup regression — fixed 2026-04-16

## Root cause

`rc.lua` refactor `9160922` + `05cedd0` moved wibar shadow from a hardcoded
table to `beautiful.shadow_drawin_*` lookup in `fishlive/config/screen.lua`.
Themes defined all `shadow_drawin_*` keys **except `shadow_drawin_color`**, so
the user table passed to `awful.wibar{shadow=...}` had `color=nil` at first
wibar creation on TTY startup. After reload it worked (due to cached state).

## Fix

- `3cc986c` — added `theme.shadow_drawin_color = "#000000"` to `default` theme
- `2b99c6b` — added to remaining 5 themes (catppuccin, catppuccin-latte, dracula, monokai-pro, tokyo-night)

## How to apply (going forward)

When adding a new theme in `~/git/github/somewm-one/themes/<name>/theme.lua`
(sibling repo, override `SOMEWM_ONE_PATH`) **do not forget**
`theme.shadow_drawin_color` in the "Drawin/wibar shadow" section. Otherwise
shadow under wibar will not appear at TTY startup.

## Open follow-up

Deeper C-side question (why identical `drawin.shadow` renders differently when
color is nil vs string) is in `plans/investigate-shadow-nil-color-render.md`.
Not urgent — the Lua fix works.
