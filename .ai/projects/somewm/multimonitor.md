---
id: project.somewm.multimonitor
title: somewm multi-monitor handling (Dell + HP portrait + Samsung TV)
type: topic
scope: project
feature: null
project: somewm
summary: User runs 3 outputs (Dell primary, HP rotated 90° as portrait, Samsung TV secondary). Multi-output bugs surface here; rules.lua must use awful.screen.focused() not screen[1].
tags: [somewm, multimonitor, output, transform, awful, lua-rules]
applies_to: [somewm]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-04-29
supersedes: []
superseded_by: null
links: [project.somewm.meta, system.r7home]
---

# Multi-monitor handling

User setup since 2026-04-20:

- **Primary (Dell G3223Q):** landscape, 3840×2160, origin (0,0)
- **Secondary (HP U28):** **portrait, rotated 90° to the left** — used for code editing. `wl_output.transform = "90"`. Logical size after rotation: **2160×3840**. Position left of Dell → `x = -2160, y = 0`.
- **Tertiary (Samsung TV):** HDMI, NVIDIA RTX 5070 Ti, landscape. Often disconnected; multi-output bugs reproduce only when TV is active.

## Why this matters for somewm

Historically a lot of config and the rule engine were written with a tacit
assumption "primary = the only screen" (e.g. `screen[1].tags[N]` in
`fishlive/config/rules.lua` in sibling repo `~/git/github/somewm-one/`,
`awful.screen.preferred`, per-screen wallpaper/collage).

When user enables the TV, `screen[1]` may end up the disabled/inactive output
→ clients land off-screen, collage/wallpaper doesn't fire, etc. Example:
Obsidian autostart routed `tag = screen[1].tags[2]` → ended up on inactive
screen (resolved by callback to `awful.screen.focused()`).

The portrait HP is also vulnerable to hard-coded landscape assumptions
(aspect ratio, scaling PNGs to workarea, wibar geometry). Wallpapers
(`awful.wallpaper` / `gears.wallpaper`) must respect transform — never
silently reinterpret as landscape.

Samsung TV over HDMI + NVIDIA additionally mixes DRM timing / hot-plug events
with NVIDIA workarounds (see CLAUDE.md NVIDIA section in fork).

## How to apply

- When designing rules: prefer `awful.screen.focused()` + `selected_tag` over `screen[1]`.
- On focus / output / wallpaper bugs, suspect multi-output — they are often reproducible **only** with the second output active. Triage may need user to toggle TV.
- Branch `feat/monitor-portrait-wallpaper` (2026-04-20) added portrait support.
- Three-screen geometry: count for **three** screens not two; `screen[1]/[2]/[3]` may be any combination of orientations.
