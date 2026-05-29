---
id: project.swebshare.meta
title: swebshare — project meta
type: topic
scope: project
feature: null
project: swebshare
summary: webshare.cz streaming app for user + daughter (parallel to kdrama which is for wife). FastAPI + MPV + SQLite. Private repo raven2cz/swebshare.
tags: [swebshare, fastapi, mpv, webshare]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [project.swebshare.architecture, project.swebshare.security-backlog]
---

# swebshare

Local working copy: `~/git/github/swebshare/` — private repo `raven2cz/swebshare`.

**Audience:** user + daughter (NOT wife — she uses kdrama).

**Stack:** FastAPI + MPV + SQLite. Same architecture family as [[project.kdrama.meta]].

**Tag policy:** "Tagy jsou až pro finální verze sakra" — user explicit. Just `git push` to main during development; no tags until release.

- Architecture: [[project.swebshare.architecture]]
- Open security items: [[project.swebshare.security-backlog]]
