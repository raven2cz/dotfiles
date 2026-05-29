---
id: project.kdrama.meta
title: kdrama — project meta
type: topic
scope: project
feature: null
project: kdrama
summary: Single-file Python TUI piping K-Drama streams from najserialy.io safely into MPV with Czech subs; never renders the malware-laden site HTML.
tags: [kdrama, python, mpv, scraping]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [project.kdrama.implementation, project.kdrama.sources]
---

# kdrama

Local working copy: `~/git/github/kdrama`. Single-file Python tool that gives
the household safe K-Drama playback from najserialy.io. Goal: zero browser
rendering of the najserialy HTML (which injects malware), all stream extraction
done at the HTTP layer with camoufox just for the voe.sx → m3u8 step.

- Architecture: see [[project.kdrama.implementation]]
- Source catalog (video + CZ subs): see [[project.kdrama.sources]]
