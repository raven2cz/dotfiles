---
id: project.somewm.meta
title: somewm — project meta
type: topic
scope: project
feature: null
project: somewm
summary: AwesomeWM-style Wayland compositor fork (raven2cz/somewm of trip-zip/somewm). Long-running active project. Sibling repos somewm-one (config) and somewm-shell (QS panel) were split out 2026-04-29.
tags: [somewm, awesomewm, wayland, compositor, fork]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [project.somewm.repo-split, project.somewm.multimonitor, project.somewm.anim-client-dual-copy]
---

# somewm

Fork: `raven2cz/somewm` from `trip-zip/somewm`. Local working copy:
`~/git/github/somewm/`. Used as primary daily-driver compositor on
`r7home` (see [[system.r7home]]).

## Sibling repos (split 2026-04-29 — see [[project.somewm.repo-split]])

- `~/git/github/somewm-one/` — user's Lua config (`rc.lua`, fishlive modules, themes)
- `~/git/github/somewm-shell/` — quickshell panel / dashboard / sidebar

When user asks about `rc.lua`, fishlive module, themes → work in
`somewm-one/`. When about QS / dashboard → `somewm-shell/`. C/wlroots/upstream
sync work stays in `somewm/` fork.

## Architecture / lessons

- [[project.somewm.repo-split]] — why and how the 3-repo split works
- [[project.somewm.anim-client-dual-copy]] — `anim_client.lua` exists in two copies; live session loads somewm-one's
- [[project.somewm.multimonitor]] — handling Dell + HP portrait + Samsung TV combo, transform pitfalls
- [[project.somewm.pointer-focus-curpressed]] — class of bugs from compositor-local enum gates; prefer wlroots-authoritative state
- [[project.somewm.scenefx-shadow-startup]] — every theme must define `theme.shadow_drawin_color`
- [[project.somewm.ghostty-shader-gpu]] — Ghostty `custom-shader-animation` is GPU-heavy; no upstream fix
