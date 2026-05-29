---
id: project.swebshare.architecture
title: swebshare architecture
type: topic
scope: project
feature: null
project: swebshare
summary: Webshare API discovery, TMDb integration, unified Card DTO, banner pipeline (smartcrop+entropy), MPV IPC EOF watcher, adult mode flow with multi-layer guards.
tags: [swebshare, architecture, webshare-api, tmdb, banner, mpv, adult-mode]
applies_to: [swebshare]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-24
supersedes: []
superseded_by: null
links: [project.swebshare.meta]
---

# swebshare architecture

## Webshare API discovery (live probed)

- Search `<file>` returns: `<img>` (single thumb 168×94), `<stripe>` (10-frame strip 3200×180, `-M`)
- `file_info` returns stripe on `-L` (6490×365, /static2/) — this is MAX
- URL pattern: `https://img.webshare.cz/static[2]/p/{folder}/{ident}-{S|M|L}.jpg`

## TMDb integration (`core/tmdb.py`)

- `search_movie` / `search_tv` / `search_multi` / `get_movie` / `get_tv` / `trending_movies(window, pages)` / `match_to_tmdb`
- `get_trailer_key` (cache 30d), `get_credits` (cast for modal)
- API key in `config.json` (`cfg["tmdb"]["api_key"]`) or fallback to kdrama config

## Card component (`core/card_dto.py`)

- Canonical flat dict — all sections (search / continue / favorites / trending) use the SAME `partials/result_card.html` macro
- Adapters: `from_candidate`, `from_history`, `from_favorite`, `from_tmdb_info`
- TMDb-only card (no webshare ident) → modal "🔍 Hledat na webshare" CTA

## Banner pipeline (`core/banner.py`)

- `smartcrop.py` + entropy fallback (score < 0.01 → entropy)
- Target 1920×640 (3:1), banner min-height 460px
- Cache key: `{type}_{id}_{sha1[10]}_v{ALGO_VERSION}_{w}x{h}.jpg`
- Per-key `threading.Lock` + negative cache 5 min + atomic write
- SSRF protection: `is_valid_tmdb_image_url()` allowlist `image.tmdb.org/t/p/`
- Adult recommendation → NEVER banner

## MPV IPC EOF watcher (`core/player.MpvEofWatcher` + `webapp/server._start_eof_watcher`)

- Background thread watches MPV socket, parses JSON events
- `end-file` `reason=eof` → `mark_finished_by_id(history_id)` (3× retry for DB lock)
- `stop` / `quit` / `error` → just stop watcher
- Cleanup watcher thread: `handle.proc.wait()` → delete 0700 socket dir
- Recommendation stack: `continue_watching` filters `finished=0`; EOF watcher frees the top slot after playback → next `pick_for_today` returns an older partially-watched film

## Adult mode flow

- Setup PIN in Settings → `_set_adult_pin(pin)` (bcrypt hash into OS keyring)
- `_ADULT_UNLOCKED_PROFILES` (unlock) + `_ADULT_ACTIVE_MODE` (current mode)
- Search `_resolve_category()` is STRICTLY exclusive
- `_adult_active_for_active_profile()` is fail-CLOSED (codex P1 — config exception → True)
- Favorite has a 3-layer guard (codex P0/P1):
  1. form `category` (client claim)
  2. server `_ADULT_ACTIVE_MODE` lookup
  3. TMDb adult flag check (server-derived, never trust the client)

## Codex review patterns (applied across the codebase)

- **P0 SSRF**: any user-controllable URL must pass through allowlist before fetch/render
- **P0 Path traversal**: validate type/id BEFORE computing filename
- **P0 Adult privacy**: no TMDb fetch in adult mode, no cache traces
- **P1 AbortController** not enough for queued `.then()` — increment `request_id` even on close
- **P1 Cache** must distinguish hit / empty / missing_key / error TTL (60s vs 1h vs 7d)
- **P1 fail-CLOSED** for privacy guards on exception (not fail-open)
- **P1 EOF watcher**: track by id (not ident) = race-safe for parallel plays
- **P1 Per-section Sortable**: guard `grid._sortable` against double init, destroy on exit
- **P1 CSS injection**: never inline `url('')` with untrusted data; use JS with URL validation
- **P1 Adult guard server-derived** (TMDb adult flag), never trust client form
- **P2 Disabled btn** during inflight (race protection)
- **A11y**: `aria-pressed` (toggle), `aria-expanded` (collapse), `aria-hidden` on emoji

## User UX patterns (preserve)

- Slow animations (scrub 400→900ms card, 2.2s modal)
- Filename IS the key info (webshare often lacks metadata)
- Mixed portrait+landscape: TMDb poster = 2/3, webshare-only img = 16/9 `span 2`
- Empty screen != modal opened over it (CSS specificity HTML `hidden` vs `display:flex`)
- Play btn: bottom-right, ONLY on card hover (NOT always visible)
- A.2 banner backdrop crops heads → smartcrop server-side
- "udělej mi html preview kde si vyberu varianty" — always local HTML preview with real data (download backdrop + webshare frame via `/tmp/fetch_*.py` script into `preview/img/`)
- Continue / Favorites / Trending MUST be the same component as search (NO duplication)
- Topbar: per-section edit icons, no global "Upravit" button
- Trending expand pattern from kdrama (NOT infinite scroll) — `pages=2`, `x-show` toggle

## Debug-time checks

- Live test webshare API via user cached token (`~/.config/swebshare/token_cache.json`)
- `tests/test_live_webshare.py` — skip if cached token missing
- Codex review after each larger refactor (`codex exec --skip-git-repo-check`)
- For UI changes: ship HTML preview into `preview/` + Playwright screenshot
- For banner crop: download real backdrops into `preview/img/` via smartcrop test script
- After each feature commit: `pytest` (skip browser/live)
- `pkill -f uvicorn` before launching a new dev server

## PLAN documents in repo

- `PLAN.md` — overall roadmap (v0.x → v1.0)
- `PLAN_modal_banner.md` — iteration 2026-05-24 morning (play btn + banner + rich modal)
- `PLAN_unified_cards.md` — iteration 2026-05-24 afternoon (unified cards + favorite + topbar + EOF watcher)
