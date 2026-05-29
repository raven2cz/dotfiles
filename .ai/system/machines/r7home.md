---
id: system.r7home
title: r7home — primary workstation
type: topic
scope: system
feature: null
project: null
summary: Arch + Wayland + somewm (AwesomeWM-Wayland fork), dual 4K, RTX 5070 Ti. Display scaling is hand-tuned; don't change layers in isolation.
tags: [machine, arch, wayland, hidpi, nvidia, somewm]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [system.firefox-hidpi-scaling]
---

# r7home

Primary Arch Linux workstation. Hostname `r7home`.

## Hardware

- GPU: NVIDIA GeForce RTX 5070 Ti (primary), secondary AMD (vendor 0x1002, device 0x13c0)
- RAM: ~62 GB
- Displays:
  - **DP-3** — Dell G3223Q, 3840×2160 @ 144 Hz, landscape, primary, origin (0,0). ~138 DPI. EDID physical size 710×400 mm.
  - **DP-2** — HP U28 4K HDR, 3840×2160, rotated 90° (portrait), positioned left of Dell at (-2160, 0). EDID physical size 620×340 mm. Used for code editing.
  - **Samsung TV** — HDMI, landscape, secondary. Often disconnected. Multi-output bugs (somewm screen[N] assumptions) reproduce only when TV is active.

## Stack

- Distro: Arch Linux (rolling), kernel `6.19.10-arch1-1` as of 2026-05-28
- Session: Wayland (`XDG_SESSION_TYPE=wayland`)
- Compositor: **somewm** — AwesomeWM fork with Wayland support. Lua config at `~/.config/somewm/rc.lua`. User-installed binary at `/usr/local/bin/somewm`.
- Shell components: quickshell (`qs -c somewm`)
- XSETTINGS: `xsettingsd` daemon, config `~/.config/xsettingsd/xsettingsd.conf`
- Terminal: Ghostty
- Browser: firefox-developer-edition (152.0b4+ Aurora channel), profile `nuqvcl5s.dev-edition-default`

## Display scaling specifics

This box runs a deliberately-tuned 3-layer Firefox scaling stack — see [[system.firefox-hidpi-scaling]] for full detail. Don't change `layout.css.devPixelsPerPx`, the Zoom Page WE extension config, or `chrome/userChrome.css` in isolation; they balance each other.

GTK side: `xsettingsd.conf` controls `Gdk/UnscaledDPI` (currently `98304` = 96 DPI). `~/.config/gtk-{3,4}.0/settings.ini` is fallback only. `dump_xsettings` reads live values; reload with `kill -HUP $(pgrep xsettingsd)`.

## Known quirks

- After Arch updates (~mid-May 2026) `gtk-xft-dpi` started being auto-set to `142540` (~139 DPI) — root cause not fully isolated. Manual reset to `98304` survives unless something regenerates the config.
- somewm logs spam `mouse::leave on invalid object` warnings; benign.
