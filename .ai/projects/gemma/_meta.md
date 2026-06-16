---
id: project.gemma.meta
title: Gemma — project meta
type: topic
scope: project
feature: null
project: gemma
summary: Local Czech voice assistant + agent mode. Ollama LLM (gemma4) + whisper.cpp STT + Chatterbox TTS on one GPU. Three modes (chat/agent/claude). 13 agent tools + HOTOVO REST tools + generic MCP infra. Repo ~/git/github/gemma, runs on r7home (RTX 5070 Ti).
tags: [gemma, voice, agent, ollama, whisper, chatterbox, tts, fastapi, claude-bridge, mcp, hotovo]
applies_to: [gemma]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.gemma.cancel-event-threading-asyncio, project.gemma.hotovo-integration, project.hotovo.meta]
---

# Gemma

Local working copy: `~/git/github/gemma/`. GitHub: `raven2cz/gemma`.

Lokální český hlasový asistent. Mluvíš na mikrofon (nebo píšeš), model odpoví hlasem + textem. Vše na jednom GPU (RTX 5070 Ti, 16 GB).

**Stack:** LLM přes Ollama (`gemma4-26b-32k` default, `gemma4-e4b-32k` rychlý), STT whisper.cpp (large-v3-turbo), TTS Chatterbox (český finetune). FastAPI backend (`voice/webapp/server.py`) + vanilla JS frontend (`voice/webapp/static/app.js`).

**Tři režimy** (přepínané v UI, cycle chat→agent→claude):
- **chat** — konverzace bez toolů, TTS po větách during streamingu.
- **agent** — Gemma + 13 lokálních toolů (fs read/write/edit, glob, grep, run_bash, fetch_url, web_search, Philips Hue light_*, echo) + HOTOVO REST toolů. AUTO/ASK/DENY klasifikátor, approval modal nebo hlas. Destruktivní akce vyžadují frázi „ano povoluju".
- **claude** — direct dialog s Claude Code CLI přes vlastní `src/claude_bridge/` adapter library (PrintMode default, Tmux opt-in přes `AGENT_CLAUDE_BRIDGE_MODE=tmux`). Vždy edit mode, žádná fráze (workdir sandbox + claude acceptEdits chrání). Volba modelu opus/sonnet/haiku v UI.

**Spuštění:** `gemma` (symlink na `scripts/agent.sh`) z projektového PWD (= sandbox root, nikdy HOME). Launcher sourcuje `~/.gemma-env` (bash `export KEY=VALUE`) pro persistentní env (HOTOVO_API_URL, AGENT_CLAUDE_BRIDGE_MODE, …). Webapp na `http://127.0.0.1:8080`.

**Sekrety:** soubory 0600 — `~/.gemma-hotovo-token` (HOTOVO API), `~/.brave-search-api` (web_search). Server odmítne world/group readable. `~/.gemma-env` jen pro URLs + non-secret config.

**TTS detail:** před synth se uvolní Ollama LLM z VRAM (`keep_alive=0`), jinak 26b model + Chatterbox přetlačí 16 GB při peaku → OOM. Cena: další turn re-loadne LLM (3-5 s). Code bloky (` ```lang ``` `) chunker označí `speakable=false` → TTS přeskočí, UI vyrenderuje.

## Klíčové soubory
- `voice/webapp/server.py` — FastAPI, /api/turn NDJSON stream (chat/agent/claude), claude_ui_state, MCP/HOTOVO init v lifespan.
- `voice/agent/loop.py` — tool-calling smyčka kolem Ollama /api/chat. `turn_state["cancel_event"]` je **threading.Event** (viz [[project.gemma.cancel-event-threading-asyncio]]).
- `voice/agent/permissions.py` — classifier registry, AUTO/ASK/DENY + requires_explicit.
- `voice/agent/tools/` — echo, fs, shell, web, hue, **hotovo** (REST), `__init__.py` registry.
- `voice/agent/mcp.py` — generic MCP stdio client (zatím nepoužitý pro produkční server, infra pro budoucí lokální MCP servery).
- `src/claude_bridge/` — standalone adapter library (print_mode, tmux_mode, stream_json parser).

## Stav (2026-06-01)
- `main` branch, vše pushnuto na GitHub. 963 testů.
- Claude mode redesign hotový (phrase gate odstraněn, model switch fix).
- HOTOVO integrace přes REST hotová (viz [[project.gemma.hotovo-integration]]).
- `scripts/install.sh` — idempotentní installer (Arch + Debian), po codex+gemini review.
- Review workflow: codex (`gpt-5.5`) + gemini paralelně po každé fázi, iterovat dokud critical/high = 0. Codex opakovaně chytá reálné HIGH bugy.
