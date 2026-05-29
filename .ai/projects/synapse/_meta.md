---
id: project.synapse.meta
title: Synapse — project meta
type: topic
scope: project
feature: null
project: synapse
summary: Synapse project — repo at ~/git/github/synapse. Resolve Model Redesign is the current major redesign track.
tags: [synapse, project-meta]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [project.synapse.download-system]
---

# Synapse

Local working copy: `~/git/github/synapse`.

Currently active major track: **Resolve Model Redesign** — main spec
`plans/PLAN-Resolve-Model.md` (v0.7.1), branch `feat/resolve-model-redesign`.
Reviewed by Gemini 3.1 (×2) and Codex 5.4 (×3), implementation starts from
Phase 0. **Don't create a parallel spec — that one is canonical.**

## Established systems (reuse, don't reinvent)

- **Downloads** → `POST /api/packs/{pack}/download-asset` + `_active_downloads` + DownloadsPage polling. See [[project.synapse.download-system]].
- **Toasts** → `stores/toastStore.ts`.
- **Inventory** → `inventory_service.py` + `InventoryPage.tsx`.
- **Backup** → `backup_service.py` + endpoints.
