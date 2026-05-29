---
id: project.realestate-bot.deployment
title: realestate-bot deployment specs
type: topic
scope: project
feature: null
project: realestate-bot
summary: Port 17852 (public, nginx SSL), 17853 (uvicorn local), install /opt/realestate-bot/, email target tonda.fischer@gmail.com.
tags: [realestate-bot, deployment, rpi4, nginx, systemd]
applies_to: [realestate-bot]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-05-07
supersedes: []
superseded_by: null
links: [project.realestate-bot.meta]
---

# Deployment specs

User-chosen values, 2026-05-03 after review. Patch these into `install.sh`, systemd unit, dev scripts as defaults (overridable via ENV or CLI flag).

- **Port (public, SSL)**: `17852` — neobvyklé pro veřejně-lookable port, ne 8080
- **Bind addresses on Pi**: API default `127.0.0.1:17853` (uvicorn), nginx SSL reverse proxy on `17852`
- **Public URL**: `https://fishlive.org:17852/` (Let's Encrypt SSL, nginx → 127.0.0.1:17853)
- **Install path on Pi**: `/opt/realestate-bot/`
- **Local dev path**: `~/git/github/realestate-bot/` on this box; deploy to Pi only after working locally
- **Email digest target**: `tonda.fischer@gmail.com`
