---
id: project.synapse.download-system
title: Synapse download system architecture
type: topic
scope: project
feature: null
project: synapse
summary: Single canonical download path through download-asset endpoint; never use BackgroundTasks or parallel implementations.
tags: [synapse, downloads, api, architecture]
applies_to: [synapse]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-03-03
supersedes: []
superseded_by: null
links: [project.synapse.meta]
---

# Synapse download system

## Canonical principle

**Every download in Synapse MUST go through the download-asset endpoint.**
Never create a parallel path (BackgroundTasks, own threading, etc.).

## Main endpoint

`POST /api/packs/{pack_name}/download-asset` (in `src/store/api.py` ~line 2342).

### Request

```python
class DownloadAssetRequest:
    asset_name: str
    asset_type: Optional[str]    # checkpoint, lora, vae, etc.
    url: Optional[str]
    filename: Optional[str]
    group_id: Optional[str]      # UI grouping
    group_label: Optional[str]
```

### Flow

1. Create entry in `_active_downloads` dict (status: pending)
2. Spawn daemon thread for the download
3. Thread calls `blob_store.download()` with a progress callback
4. Progress callback updates speed/ETA every 0.5s
5. On done: symlink, lock update, status: completed

## Tracking endpoints

- `GET /api/packs/downloads/active` — all active downloads
- `GET /api/packs/downloads/{id}/progress` — single progress
- `DELETE /api/packs/downloads/completed` — clear finished
- `DELETE /api/packs/downloads/{id}` — cancel

## Frontend

- **DownloadsPage.tsx** — main Downloads tab with cards
- **usePackDownloads.ts** — hook for pack-level download management
- Polling: 2s when active, 10s otherwise
- Toast notifications on completion/failure

## Inventory re-download

Correct: call `POST /api/packs/{pack}/download-asset` with URL from the lock file.
Never: a custom BackgroundTasks endpoint.
