---
id: project.realestate-bot.meta
title: realestate-bot — project meta
type: topic
scope: project
feature: null
project: realestate-bot
summary: Real-estate scraping bot for Plzeň region houses (RD ≥100m², ≤11.5M Kč). Periodic scrape + 2×daily email digest + web UI. Deploys to RPi4 as systemd, dev on this box.
tags: [realestate-bot, scraping, rpi4, fastapi, systemd]
applies_to: []
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [project.realestate-bot.deployment, project.realestate-bot.wp5-agent-finder]
---

# realestate-bot

Local working copy: `~/git/github/realestate-bot/`. Deploys to RPi4 at `/opt/realestate-bot/` as systemd service.

Public URL: `https://fishlive.org:17852/` (Let's Encrypt SSL, nginx reverse proxy → `127.0.0.1:17853`).

## Sub-topics

- [[project.realestate-bot.deployment]] — port, install path, bind addresses, email target
- [[project.realestate-bot.wp5-agent-finder]] — WP5 redesigned from CRM to agent discovery

## Project scope

- Periodicky scrapovat realitní portály a hledat RD splňující kritéria (Plzeňsko, ≥100 m², PENB B–D, ≤11,5 M Kč, zahrada).
- Běh primárně jako služba (systemd) na Raspberry Pi 4, ale architektonicky obecné — nesvazovat s RPi.
- Plnohodnotné webové UI dostupné přes vystavený port zvenku.
- 2× denně email digest (08:00, 18:00 Europe/Prague).
- Konfigurace přes web UI (samostatná sekce), ne jen YAML.
- Plugin-based scraper dispatch — přidání nového portálu = "drop a file in scrapers/ + register".
