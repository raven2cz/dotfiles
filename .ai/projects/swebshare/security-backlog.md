---
id: project.swebshare.security-backlog
title: swebshare v0.1.3 security backlog
type: workflow
scope: project
feature: null
project: swebshare
summary: Two P1 security issues codex flagged in v0.1.2 monolith-split review. They predate the refactor and are owed in a v0.1.3 hardening PR.
tags: [swebshare, security, backlog, codex-review]
applies_to: [swebshare]
machines: []
status: resolved
confidence: high
owner: tonda
last_updated: 2026-05-29
supersedes: []
superseded_by: null
links: [project.swebshare.architecture]
---

# v0.1.3 security backlog

Two P1 issues surfaced by codex during the v0.1.2 monolith-split codex review
(commit `644069b` on main, merged 2026-05-27). Both existed in the original
`c84fd91` monolith — the refactor preserved behaviour faithfully, so they did
NOT belong in the refactor PR. **Owed in a separate v0.1.3 hardening pass.**

## P1 #1 — `GET /search` has no same-origin guard but writes to `search_history`

- File: `webapp/routes/search.py:267-277` (the INSERT after the search returns)
- **Risk**: cross-site navigation (`<a href="https://swebshare.local/search?q=evil">`) can poison a profile's autocomplete history.
- **Fix sketch**: do not persist `search_history` when Origin/Referer don't match Host — still render results normally so direct/SEO navigation isn't broken.
- **Why**: codex caught this on 2026-05-27 reviewing the refactor; the original monolith had the same gap.
- **How to apply**: in v0.1.3 hardening pass, add a soft `check_same_origin`-like helper that returns a bool (do not 403); skip the INSERT when False.

## P1 #2 — `/api/play` trusts client-supplied `category`

- File: `webapp/routes/play.py:177-227` (`record_play`) and `:231-239` (`touch_favorite_last_play`)
- **Risk**: a tampered/stale form post with `category=video` while adult mode is active reaches `record_play` and writes to history with the wrong category.
- **Fix sketch**: derive category from server state via `resolve_category(profile, category)` — same pattern `/search` already uses.
- **Why**: codex P1 from the same review. Defense in depth — current adult-locked + kid-blocked checks already block the obvious attack, but the category passed to `record_play` should still be server-derived.
- **How to apply**: prepend `category = resolve_category(profile, category)` after the existing kid/lock checks in `api_play`. Trivial 1-line fix.

---

## RESOLVED in v0.1.3 (2026-05-29)

Both P1 items fixed on branch `hardening/v0.1.3`, merged to main
(`1fb57ac`), released as v0.1.3.

- **P1 #1** — added `webapp/_security.is_same_origin()` bool helper;
  `GET /search` gates the `search_history` INSERT on it (cross-origin
  nav still renders results, just doesn't persist). `check_same_origin`
  refactored to reuse it (unchanged 403 behaviour).
- **P1 #2** — `webapp/routes/play.py` `api_play` now server-derives the
  adult decision: `if is_adult_active(profile) and not kid: category =
  ADULT_CATEGORY` (upgrade-only — NOT `resolve_category`, which would
  harmfully downgrade a gate-validated adult play to video and leak it
  into video history in the unlocked-but-not-active case).

Tests: `tests/test_v013_hardening.py` (9). Codex P0/P1 = none.

Residual (out of scope, no fix needed): "adult content played while
adult mode is NOT active + client says category=video" stays video —
there is no independent server-side adult classifier, so this is
inherent, not a regression.
