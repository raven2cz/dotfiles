---
id: project.hotovo.deployment
title: HOTOVO deployment specs
type: topic
scope: project
feature: null
project: hotovo
summary: nginx TLS on PUBLIC PORT 17854 (router-forwarded) → 127.0.0.1:3000; install /opt/hotovo, user hotovo, data /opt/hotovo/data, env /opt/hotovo/etc/hotovo.env; systemd hotovo.service (node pinned at /opt/hotovo/.node/node); LOCAL_UI_BYPASS=false behind proxy.
tags: [hotovo, deployment, rpi4, nginx, systemd, fishlive]
applies_to: [hotovo]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-05-29
supersedes: []
superseded_by: null
links: [project.hotovo.meta, project.realestate-bot.deployment]
---

# Deployment specs

Same pattern as [[project.realestate-bot.deployment]] (fishlive.org, /opt, nginx TLS on a forwarded port, systemd).

- **Public URL**: `https://fishlive.org:17854` — nginx TLS on **public port 17854**, forwarded in the router → Pi:17854. Reuses the `fishlive.org` Let's Encrypt cert (`/etc/letsencrypt/live/fishlive.org/`).
- **Port choice**: 17854 (realestate-bot has 17852/17853; this avoids collision). **User forwards 17854 in the router.**
- **App bind**: `127.0.0.1:3000` (HOST=127.0.0.1, PORT=3000) — nginx is the only public entry.
- **Install path**: `/opt/hotovo/` (git clone of raven2cz/HOTOVO).
- **Node**: pinned at install to `/opt/hotovo/.node/node` (fnm-managed Node works for the nologin user; systemd ExecStart uses it).
- **Service user**: `hotovo` (system user); unit `deploy/systemd/hotovo.service`.
- **Runtime data**: `/opt/hotovo/data/` (DB, WAL, INITIAL_TOKEN.txt) — only writable path (ProtectSystem=strict + ReadWritePaths).
- **Env**: `/opt/hotovo/etc/hotovo.env` (0600): `LOCAL_UI_BYPASS=false`, `DB_PATH=/opt/hotovo/data/todo.db`, `PUBLIC_BASE_URL=https://fishlive.org:17854`, `TODO_SECRET_KEY=<64hex>`.
- **Auth**: behind proxy every /api needs a Bearer token; first-run token in `data/INITIAL_TOKEN.txt`, paste into UI (localStorage). Optional nginx Basic Auth gate.
- **OAuth redirect**: `https://fishlive.org:17854/api/sync/callback` (register in Google Cloud).
- **Install**: `deploy/install-pi.sh` (first time) · **Update**: `scripts/deploy-pi.sh` (`PI=pi@fishlive.org`).

Repo runbook: `deploy/README.md`.
