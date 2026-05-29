---
id: project.somewm.pointer-focus-curpressed
title: Pointer focus CurPressed latch — fixed, with broader lesson
type: decision
scope: project
feature: null
project: somewm
summary: Long-standing MPV/Dolphin scroll-needs-click bug fixed 2026-04-22 by switching from compositor-local cursor_mode enum to wlroots-authoritative seat->pointer_state.button_count.
tags: [somewm, focus, input, bug-fix, wlroots, lesson]
applies_to: [somewm]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-04-22
supersedes: []
superseded_by: null
links: [project.somewm.meta]
---

# Pointer focus CurPressed latch — fixed

2026-04-22: `input.c motionnotify` surface-swap block was gated on
`cursor_mode == CurPressed` (compositor-local enum with only two transitions:
buttonpress → CurPressed, buttonrelease → CurNormal).

If any release event was lost (grab consumption, early-return in
`mousegrabber` path, compositor grab teardown), the enum stayed stuck in
`CurPressed` and every subsequent motion pinned `wl_pointer` to the stale
`focused_surface`. User saw: hover new window → scroll drops until click.

## Fix

Replaced the gate with `seat->pointer_state.button_count > 0`
(wlroots-maintained, decremented by `wlr_seat_pointer_notify_button`). One-line
change at `input.c:759`. Commit `fdd5142`, branch `fix/screen-follow-mouse`.
User confirmed "ono to fakt funguje!!!".

## Why

This class of bug existed "from the start" — MPV/Dolphin startup scroll
needing click, recently expanded to post-screen-migration. All three model
reviewers (Sonnet / Codex / Gemini) converged on the same diagnosis
independently.

## Lesson (apply broadly)

When debugging input/focus bugs in somewm, suspect any compositor-local enum
that tracks button/grab state. These latches desync easily because they depend
on every release path calling the right transition. Prefer
**wlroots-authoritative state** (`seat->pointer_state.button_count`,
`seat->drag`, grab objects) — it can't desync.

- Sway uses a seatop state machine
- Hyprland uses a held-buttons container
- Smithay uses a grab framework

None use a sticky enum.

## Open follow-ups

`plans/fix-pointer-focus-stuck-curpressed.md`:
- Remove the swap block entirely (Sonnet)
- Separate compositor-grab state for mousegrabber paths (Codex)
- Audit other `cursor_mode` checks (Gemini)
