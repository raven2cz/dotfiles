---
id: system.firefox-hidpi-scaling
title: Firefox HiDPI chrome vs content scaling
type: topic
scope: system
feature: null
project: null
summary: On HiDPI Wayland, Firefox chrome can grow oversized while web content stays fine. Fix is a hand-tuned 3-layer scale stack — don't touch layers in isolation.
tags: [firefox, hidpi, wayland, gtk, scaling, userchrome]
applies_to: [firefox, firefox-developer-edition]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [system.r7home]
---

# Firefox HiDPI chrome vs content scaling

On HiDPI Wayland boxes, Firefox can end up with **chrome UI (tabs, toolbars, menus)
visibly larger than web content**, even though both should scale together. The
fix used here is a 3-layer balance, deliberately because each layer compensates a
specific thing.

## The 3-layer stack on `r7home`

| Layer | Scale | Affects |
|------|-------|---------|
| `layout.css.devPixelsPerPx=1.2` in `prefs.js` | ×1.2 | chrome + content |
| Zoom Page WE extension (auto-zoom out) | ×~0.83 | content only (not `about:*`) |
| `chrome/userChrome.css` font-size override (`--chrome-scale: 0.92`) | ×0.92 | chrome only |
| `chrome/userContent.css` `zoom: 0.85` | ×0.85 | `about:newtab` / `home` / `welcome` only |

Effective sizes:
- Real web pages: `1.2 × 0.83 = ~1.0` ✓
- Chrome UI: `1.2 × 0.92 = ~1.1` ✓ (close to 1.0, slightly larger for readability)
- Firefox internal pages: `1.2 × 0.85 = ~1.02` ✓

## Files (Firefox profile = `nuqvcl5s.dev-edition-default`)

- `user.js` — sets `toolkit.legacyUserProfileCustomizations.stylesheets=true` (enables the next two), plus `browser.uidensity=0`, `browser.touchmode.auto=false`, `font.size.systemFontScale=100`.
- `chrome/userChrome.css` — based on [userchrome-scale-template.css](snippets/userchrome-scale-template.css).
- `chrome/userContent.css` — `zoom: 0.85` inside `@-moz-document url("about:newtab"), url("about:home"), url("about:welcome")`.

## Tuning knobs

- **Chrome too small/big** → edit `--chrome-scale` in `chrome/userChrome.css`. 0.92 = comfortable for r7home; lower = smaller chrome.
- **About-pages buttons too big** → lower the `zoom` value in `chrome/userContent.css`.
- **Real web pages off** → that's Zoom Page WE extension settings, not Firefox prefs.

## What DOESN'T fix this

- Changing GTK `gtk-xft-dpi` or xsettingsd `Gdk/UnscaledDPI` — Firefox 150+ on native Wayland doesn't pick these up for chrome font scaling reliably.
- Setting `browser.uidensity=1` (compact) — too subtle, ~10% smaller, far from enough.
- Removing `layout.css.devPixelsPerPx` — would shrink chrome but also web content, and Zoom Page WE would then make web pages way too small.

## Diagnosis recipe

1. Verify Firefox is native Wayland: `lsof -p <pid> | grep wayland-` should show socket; absence of X11 socket.
2. Check `~/.mozilla/firefox/<profile>/prefs.js` for `layout.css.devPixelsPerPx` — that's likely the upstream scaler.
3. Look for `zoompage-we@DW-dev` or other zoom extension — that's why web looks fine while chrome doesn't.
4. Check `chrome/` dir for existing userChrome.css / userContent.css.
5. Look at Firefox crash report `TelemetryEnvironment` for `defaultCSSScaleFactor` if you need to see what Firefox itself thinks the monitor scale is.

## Why this matters

`layout.css.devPixelsPerPx` is sometimes set defensively after a compositor / GTK / Firefox update breaks default scaling. Once it's set, the user often adds a content-zoom extension to compensate for one side, then forgets the chrome side is now permanently oversized.
