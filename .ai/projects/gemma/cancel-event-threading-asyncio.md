---
id: project.gemma.cancel-event-threading-asyncio
title: turn_state cancel_event je threading.Event — nikdy .wait() v asyncio kontextu
type: topic
scope: project
feature: null
project: gemma
summary: Gemma turn_state["cancel_event"] je threading.Event (ne asyncio.Event). asyncio.create_task(ev.wait()) ho vyhodnotí synchronně PŘED create_task → zmrazí celý event loop navždy. Kouslo to dvakrát (claude bridge, hotovo tool). Použít jen ev.is_set() polling; cancelaci řeší loop přes asyncio.wait_for kolem tool.execute.
tags: [asyncio, threading, deadlock, event-loop, cancel, tools, pitfall]
applies_to: [gemma]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.gemma.meta]
---

# Pozor: `turn_state["cancel_event"]` je `threading.Event`, ne `asyncio.Event`

V gemmě je per-turn cancel signál `threading.Event` (`voice/webapp/server.py`,
v `_register_turn`). Inference smyčka ho čte přes thread-local mirror, takže
cancel turnu A neshazuje souběžný turn B. To je správné PRO TTS/inference thread.

**Ale** každý nový async kód (tool execute, claude bridge `ask`, hotovo `_request`)
dostane tenhle `threading.Event` jako `cancel_event` argument — a tady číhá past.

## Past

```python
# ❌ DEADLOCK — zmrazí celý event loop NAVŽDY
cancel_task = asyncio.create_task(cancel_event.wait())
```

`threading.Event.wait()` je **synchronní blokující** volání (vrací bool, ne
coroutine). Python ho vyhodnotí jako argument PŘED `create_task` → zavolá
`.wait()` synchronně → blokuje volající thread = event loop, dokud se event
nesetne. Event se nikdy nesetne (cancel nepřišel) → **loop zamrznutý napořád**.

Symptom: subprocess / HTTP request proběhne (claude vytvoří soubor, ollama
vrátí 200), ale ŽÁDNÁ async coroutine se nedostane k běhu. UI sedí desítky
sekund / minuty bez aktivity, uvicorn proces je na 0 % CPU (idle, ne busy).

## Správně

```python
# ✓ pre-flight check stačí — cancelaci řeší volající loop
if cancel_event is not None and cancel_event.is_set():
    return {"ok": False, "error": "canceled"}
# ... pak normální await client.request(...) s vlastním timeoutem
```

`voice/agent/loop.py` už wrapuje `tool.execute()` v
`asyncio.wait_for(..., timeout=remaining)`, takže hard cancel + deadline jsou
ošetřené na úrovni loopu. Tool jen potřebuje pre-flight `is_set()` check.
Ostatní tooly (`fs.py`, `web.py`) to dělají správně — `ctx.cancel_event.is_set()`.

Pokud BY async kód opravdu potřeboval čekat na threading event (málokdy),
**async polling loop**, NE `run_in_executor(None, ev.wait)` — executor thread
není cancellable a po normálním dokončení turnu zůstane navždy blokovaný →
po pár desítkách turnů thread pool vyčerpán, celá app uvízne (gemini+codex
review 2026-05-19, claude bridge `_mirror_cancel`):

```python
while not threading_ev.is_set():
    await asyncio.sleep(0.1)
asyncio_ev.set()
```

## Historie

Kouslo to **dvakrát ve stejném projektu**:
1. **claude bridge** (2026-05-19) — `PrintModeAdapter.ask` → 88 s ticha v UI.
   Fix: server vyrábí asyncio mirror přes polling, bridge má defensive
   `isinstance(cancel_event, asyncio.Event)` TypeError guard.
2. **hotovo REST tool** (2026-06-01) — `hotovo_get_state` deadlock 3 min.
   Stejný vzor, stejný fix (jen `is_set()` check).

**Pravidlo pro každý nový tool/adapter v gemmě:** dostaneš-li `cancel_event`
z `turn_state` nebo `ExecuteContext`, NIKDY `await ev.wait()` / `create_task(ev.wait())`.
Jen `ev.is_set()`. Cancelaci řeší loop.
