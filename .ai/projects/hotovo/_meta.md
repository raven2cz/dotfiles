---
id: project.hotovo.meta
title: HOTOVO — project meta
type: topic
scope: project
feature: null
project: hotovo
summary: Self-hosted task app (Node/Express + SQLite + React) with an AI-agent REST API, MCP server, and Google Calendar sync. Dev on this box at ~/git/github/todo-list; deploys to RPi4 (fishlive.org) as systemd at /opt/hotovo. Formerly "Aether Todo".
tags: [hotovo, todo, node, express, sqlite, react, mcp, rpi4, systemd]
applies_to: [hotovo]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-29
supersedes: []
superseded_by: null
links: [project.hotovo.deployment, project.realestate-bot.deployment]
---

# HOTOVO

Local working copy: `~/git/github/todo-list/` (repo dir keeps the old name; product is **HOTOVO**). GitHub: `raven2cz/HOTOVO` (public).

Single-user, locally-hosted to-do app. Hierarchical tasks/subtasks with status rollup, recurring tasks (daily/weekly/monthly, roll-forward on completion), tags, search + Today/Week/Overdue filters, calendar view, Ctrl+K command palette (`/` filters the list).

**For AI agents:** REST API + `GET /api/agent/guide` (Markdown system prompt) + `GET /api/agent/state` (one-call snapshot) + OpenAPI 3.1 at `/api/docs` + a dependency-free **MCP stdio server** (`npm run mcp`, 8 tools). Built deliberately so a small/local model (Gemma) works well with it.

**Auth:** fail-closed, hashed tokens, no seeded default. Loopback same-origin UI needs no token; proxied/non-local needs a Bearer token. `LOCAL_UI_BYPASS=false` behind a proxy.

**Google Calendar:** durable outbox queue (idempotent inserts via a `todoTaskId` marker, retry/backoff, dead-letter, in_progress claim, orphan cleanup).

See [[project.hotovo.deployment]] for ports/paths.

## Stav (2026-05-29)
- Hardened (repeated codex gpt-5.5 full-branch reviews → 0 critical/high), backend 16/16 + e2e 7/7.
- Branch work merged to `main` locally; **not yet pushed** to GitHub and **not yet deployed** — to be done together in the evening.
