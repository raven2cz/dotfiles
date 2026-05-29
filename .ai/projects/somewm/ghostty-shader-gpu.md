---
id: project.somewm.ghostty-shader-gpu
title: Ghostty custom-shader-animation causes 120 FPS GPU load
type: topic
scope: project
feature: null
project: somewm
summary: Ghostty with custom-shader-animation = true renders at 120 FPS constantly. Upstream fix (#11928) was closed NOT_PLANNED. Workaround: disable shaders.
tags: [somewm, ghostty, gpu, shader, workaround]
applies_to: [ghostty, somewm]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-04-19
supersedes: []
superseded_by: null
links: [project.somewm.meta]
---

# Ghostty `custom-shader-animation` causes high GPU usage

Ghostty with `custom-shader-animation = true` (and `custom-shader = shaders/cursor/cursor_warp.glsl` in `~/.config/ghostty/config`) renders at 120 FPS constantly (`DRAW_INTERVAL = 8ms` hardcoded), draining GPU even when the terminal is idle.

## Why

User discovered in a separate session on another machine that Ghostty's GPU
drain comes directly from these shaders. Verified 2026-04-19: upstream issue
**#11928** "Feature: Adaptive power management for battery-aware rendering"
(aronchick, 2026-03-28) described this exact problem with a complete
implementation, BUT was closed as **NOT_PLANNED** by the automatic
`ghostty-vouch` bot because the author wasn't "vouched" per CONTRIBUTING.md.
The fix is therefore NOT in upstream. PR #10668 (merged, 2026-02-12) only
handles the draw timer when shaders are NOT enabled — with shaders enabled,
still 120 FPS. Open issue #10995 only deals with debounce of cursor positions,
not power.

## How to apply

When the user complains about Ghostty GPU/CPU/battery, the first question is
about `custom-shader-animation`. Workaround: comment out in
`~/.config/ghostty/config`:

```
# custom-shader = …
# custom-shader-animation = true
```

Theme / font / colors remain, only the cursor warp effect disappears. The fix
is the same on every machine — don't use shaders in Ghostty until upstream
accepts some power-aware mechanism.
