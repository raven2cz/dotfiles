---
id: project.somewm.repo-split
title: somewm 3-repo split (fork + one + shell)
type: decision
scope: project
feature: null
project: somewm
summary: 2026-04-29 split somewm-one (config) and somewm-shell (QS panel) into standalone public repos. Coupling via SOMEWM_*_PATH env vars.
tags: [somewm, repo-split, architecture, decision]
applies_to: [somewm]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-04-29
supersedes: []
superseded_by: null
links: [project.somewm.meta]
---

# 3-repo split — 2026-04-29

`plans/project/somewm-one/` and `plans/project/somewm-shell/` were extracted
from the fork (`raven2cz/somewm`) into standalone public GitHub repos:

- `github.com/raven2cz/somewm-one` — checkout at `~/git/github/somewm-one/` (override `SOMEWM_ONE_PATH`)
- `github.com/raven2cz/somewm-shell` — checkout at `~/git/github/somewm-shell/` (override `SOMEWM_SHELL_PATH`)

History preserved via `git subtree split` (commit IDs were rewritten;
cross-reference links from old commits break only in fork plans).

Fork itself (`raven2cz/somewm`) from commit `65c743f` onward no longer carries
these directories and has a "Sibling repos" section in `CLAUDE.md` as a
pointer.

## Why

Standalone repos are easier to share, have their own LICENSE (MIT) and issues,
and the fork no longer carries user-config in repo tracking.

## How to apply

- User talks about `rc.lua`, fishlive module, theme → work in `~/git/github/somewm-one/`, not the fork.
- User talks about QS / dashboard / sidebar / panel → work in `~/git/github/somewm-shell/`.
- Path coupling is no longer relative paths; everything runs via env-var fallback (`SOMEWM_FORK_PATH`, `SOMEWM_ONE_PATH`, `SOMEWM_SHELL_PATH`).
- Fork still keeps `plans/scripts/` (deploy diagnostics, install-scenefx, somewm-snapshot, memory-snapshot/trend, sandbox) and `plans/repo-split/` as paper trail.
- C/wlroots/upstream sync work stays in the fork.
