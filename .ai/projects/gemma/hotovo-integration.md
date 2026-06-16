---
id: project.gemma.hotovo-integration
title: HOTOVO integrace v gemmě — direct REST, ne MCP
type: decision
scope: project
feature: null
project: gemma
summary: Gemma volá HOTOVO přes direct REST (voice/agent/tools/hotovo.py, 8 tools), ne přes MCP. Důvod: HOTOVO server/mcp.js má hardcoded BASE=127.0.0.1, takže nepodporuje remote backend (Pi4 fishlive.org). REST mapuje 1:1 na endpointy bez node subprocess. Config přes HOTOVO_API_URL + ~/.gemma-hotovo-token (0600). MCP infra v gemmě zůstává pro budoucí lokální servery.
tags: [hotovo, rest, mcp, integration, decision, tools, bearer-token]
applies_to: [gemma, hotovo]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.gemma.meta, project.hotovo.meta, project.gemma.cancel-event-threading-asyncio]
---

# HOTOVO v gemmě: direct REST, ne MCP

## Rozhodnutí

Gemma ovládá HOTOVO ([[project.hotovo.meta]]) přes **8 direct REST toolů**
(`voice/agent/tools/hotovo.py`), prefix `hotovo_*`: get_state, list_projects,
create_project, list_tasks, create_task, update_task, complete_task, delete_task.

**NE přes MCP**, i když HOTOVO MCP server (`server/mcp.js`) existuje.

## Proč ne MCP

HOTOVO `server/mcp.js` má `const BASE = http://127.0.0.1:${PORT}` **hardcoded**.
MCP je stdio protokol — klient si spustí server jako lokální subprocess. Takže
"HOTOVO přes MCP" by znamenalo mít `node server/mcp.js` běžet lokálně u gemmy,
a ten by stejně volal `127.0.0.1` — jenže backend je **remote na Pi4**
(`https://fishlive.org:17854` přes nginx). Most-přes-most bez přínosu.

Druhý Claude to shrnul: když klient (gemma) umí HTTP tool-calling, MCP
nepotřebuje. Direct REST = žádný node, žádný subprocess, žádný JSON-RPC
overhead, 1:1 na endpointy které mcp.js stejně volá.

(Kdyby se v budoucnu chtělo MCP: `server/mcp.js` by potřeboval patch na
`HOTOVO_BASE_URL` env. Gemma MCP infra `voice/agent/mcp.py` zůstává
připravená pro LOKÁLNÍ MCP servery — filesystem-mcp, git-mcp.)

## Konfigurace

```bash
# ~/.gemma-env (sourcuje launcher):
export HOTOVO_API_URL=https://fishlive.org:17854

# Token (vytvořený v HOTOVO UI: Nastavení → AI Agenti):
echo "agent_..." > ~/.gemma-hotovo-token && chmod 600 ~/.gemma-hotovo-token
```

Token loader (`config.get_hotovo_token()`): env `HOTOVO_API_TOKEN` má přednost,
jinak soubor (default `~/.gemma-hotovo-token`, fallback `~/.hotovo-api`).
World/group readable soubor → ignore + warn. Tooly se registrují jen když
`HOTOVO_API_URL` je nastaveno.

## Classifier

- **AUTO** (read-only): get_state, list_projects, list_tasks
- **ASK + medium** (modal Allow/Deny): create_project, create_task, update_task, complete_task
- **ASK + destructive** (vyžaduje frázi „ano povoluju"): delete_task

## Bezpečnostní detaily (codex gpt-5.5 review 2026-06-01, 3 HIGH)

1. **TLS scheme guard**: `_validate_base_url()` povolí `https://` kamkoli,
   `http://` jen na loopback. Bez toho by `http://remote` poslal Bearer token
   v plaintextu.
2. **update_task nullable keys**: `due_date: null` (smaž termín) a
   `parent_id: null` (odpoj rodiče) jsou sémanticky platné → explicit None
   SE POSÍLÁ (`nullable_body_keys`). create_task naopak None dropuje.
3. **complete_task self-contained**: `static_body={"status":"completed"}`
   přímo v `build_tools()`, ne externí patch.
4. Path traversal: ID jde do URL přes `urllib.parse.quote(safe="")`.
5. **Deadlock**: viz [[project.gemma.cancel-event-threading-asyncio]] — tool
   původně dělal `asyncio.create_task(cancel_event.wait())` na threading.Event
   → 3 min deadlock. Fix: jen `is_set()` check.

## Endpointy (HOTOVO REST API)

```
GET    /api/agent/state              # snapshot vše (get_state)
GET    /api/lists                    # list_projects
POST   /api/lists                    # create_project
GET    /api/tasks?list_id&status&priority&due_date&search&tag&due
POST   /api/tasks                    # create_task
PUT    /api/tasks/:id                # update_task + complete_task (status:completed)
DELETE /api/tasks/:id?confirm=true   # delete_task
```

Vše s `Authorization: Bearer <token>`. Loopback same-origin UI token nepotřebuje.
