---
id: project.somewm.anim-client-dual-copy
title: anim_client.lua exists in two copies
type: topic
scope: project
feature: null
project: somewm
summary: anim_client.lua lives in both somewm framework and somewm-one; the live session loads somewm-one's. Fixes to the framework copy will appear to "not work".
tags: [somewm, anim-client, lua, gotcha]
applies_to: [somewm]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-05-14
supersedes: []
superseded_by: null
links: [project.somewm.meta, project.somewm.repo-split]
---

# `anim_client.lua` exists in two copies

`anim_client.lua` exists in **two separate copies**:

- framework: `~/git/github/somewm/lua/awful/anim_client.lua` (fork-only module shipped by the framework, loadable as `require("awful.anim_client")`)
- somewm-one: `~/git/github/somewm-one/anim_client.lua` (the user's own copy, bigger / diverged — has extras like `fade_notification`; loaded as `require("anim_client")`)

**The user's live session loads somewm-one's copy.** A fix applied only to the
framework copy will appear to "not work" because that file is never loaded in
the running session.

## Why

The repo split (see [[project.somewm.repo-split]]) left the framework with its
own `lua/awful/anim_client.lua` while somewm-one carries a customised copy.
They drifted; the maximize/fullscreen signal-handler code happened to stay
identical.

## How to apply

Any `anim_client.lua` change the user needs in their live session MUST go into
`~/git/github/somewm-one/anim_client.lua` (then `./deploy.sh` +
`somewm-client reload`). If the bug is generic, also patch the framework copy
and commit it on the somewm side. A wrong-file fix cost a full round-trip
during the kolo8 work (2026-05-14).
