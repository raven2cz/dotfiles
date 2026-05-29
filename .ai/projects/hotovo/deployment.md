---
id: project.hotovo.deployment
title: HOTOVO deployment specs
type: topic
scope: project
feature: null
project: hotovo
summary: nginx SSL reverse proxy on hotovo.fishlive.org → 127.0.0.1:3000; install /opt/hotovo, user hotovo, data /opt/hotovo/data, env /opt/hotovo/etc/hotovo.env; systemd unit hotovo.service; LOCAL_UI_BYPASS=false behind proxy.
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

Same pattern as [[project.realestate-bot.deployment]] (fishlive.org, /opt, nginx SSL → local port, systemd).

- **Public URL**: `https://hotovo.fishlive.org` (Let's Encrypt; certs `/etc/letsencrypt/live/fishlive.org/`)
- **nginx**: 443 → `proxy_pass http://127.0.0.1:3000` (config in repo `deploy/nginx-hotovo.conf`)
- **App bind**: `127.0.0.1:3000` (HOST=127.0.0.1, PORT=3000) — nginx is the only public entry
- **Install path**: `/opt/hotovo/` (git clone of raven2cz/HOTOVO)
- **Service user**: `hotovo` (system user); systemd unit `deploy/systemd/hotovo.service`
- **Runtime data**: `/opt/hotovo/data/` (SQLite DB, WAL, INITIAL_TOKEN.txt) — only writable path (ProtectSystem=strict + ReadWritePaths)
- **Env**: `/opt/hotovo/etc/hotovo.env` (0600): `LOCAL_UI_BYPASS=false`, `DB_PATH=/opt/hotovo/data/todo.db`, `PUBLIC_BASE_URL=https://hotovo.fishlive.org`, `TODO_SECRET_KEY=<64hex>`
- **Auth**: behind proxy every /api needs a Bearer token; first-run token in `data/INITIAL_TOKEN.txt`, paste into UI (localStorage). Optional nginx Basic Auth gate.
- **OAuth redirect**: `https://hotovo.fishlive.org/api/sync/callback` (register in Google Cloud)
- **Install**: `deploy/install-pi.sh` (first time) · **Update**: `scripts/deploy-pi.sh` (`PI=pi@fishlive.org`)
- **Port note**: realestate-bot uses 17852/17853; HOTOVO uses 3000 on loopback only (no collision — different subdomain, not a public custom port).

Repo runbook: `deploy/README.md`.
