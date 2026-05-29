---
id: project.kdrama.implementation
title: kdrama CLI implementation
type: topic
scope: project
feature: null
project: kdrama
summary: Single-file Python ~330 LoC, camoufox for Cloudflare Turnstile + voe.sx m3u8 capture, full HTTP-layer reverse-engineered pipeline.
tags: [kdrama, python, playwright, camoufox, cloudflare, mpv]
applies_to: [kdrama]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-21
supersedes: []
superseded_by: null
links: [project.kdrama.meta, project.kdrama.sources]
---

# kdrama CLI implementation

The `~/git/github/kdrama/kdrama` script (~330 LoC single-file Python) was built
2026-05-21 to give wife safe K-Drama streaming from najserialy.io without ever
rendering the malware-laden HTML in a real browser.

## Layout

- `kdrama` — executable Python entry point (no `.py` suffix; tests import via
  `SourceFileLoader` with `sys.modules` registration since Python 3.14
  dataclasses require it).
- `requirements.txt` — requests, beautifulsoup4, lxml, playwright.
- `venv/` — local Python 3.14 venv (system Python is PEP 668 protected on Arch).
- `~/.config/kdrama/playwright-profile/` — persistent Chromium profile
  preserving Cloudflare clearance cookies across runs.

## Verified working (curl-level, no Playwright)

- `GET /search?search=<q>` → HTML fragment with `<a.search-page href="/serialy/<slug>">`.
- Series page `/serialy/<slug>` → multiple `data-link="/episodes/load/<seriesId>/<season>"` per season.
- `GET /episodes/load/<id>/<season>` → `<li><a href="/serial/<slug>/sNNeMM">`; CZ subs indicator is `<span class="titulky">` inside the `<a>`.

## Why camoufox (not vanilla Playwright)

najserialy episode page renders Cloudflare Turnstile widget (sitekey
`0x4AAAAAAB1UQX0asyjgHX-n`) inside `#player_0` div. POST `/verify-captcha`
with the token + reload reveals the real player iframe. Turnstile requires
real mouse interaction AND a non-bot browser fingerprint.

Tried in order on 2026-05-21:
1. **Vanilla Playwright Chromium** — Turnstile rejected even after clicking.
2. **`tf-playwright-stealth` 1.2.0** + cleared profile + EU timezone + `ignore_default_args=["--enable-automation"]` — still rejected.
3. **camoufox 0.4.11** (deployed) — Firefox fork engineered against Cloudflare/Turnstile, real Firefox build (~80 MB), patched at C++ level, `humanize=True` for organic mouse trajectories.

yt-dlp lacks voe/dood/netu extractors in stock — Playwright/Camoufox network
sniffer matching `\.m3u8` is the real extractor regardless of embed host.

## How to apply

- If Turnstile starts failing: (a) `humanize=True` already on, (b) try `geoip=True` (needs DB), (c) add residential proxy, (d) 2captcha last resort.
- Camoufox `Camoufox(persistent_context=True, user_data_dir=...)` returns BrowserContext directly; `browser.new_page()` works but `hasattr` check is in place defensively.
- Ad-block route filter drops `bestoweddigestionenrich.com` etc. but MUST allow `challenges.cloudflare.com/turnstile/*` — explicit guard in code.
- Persistent profile lives at `~/.config/kdrama/playwright-profile/` (name from Playwright era, now actually a Firefox profile from camoufox).

## FINAL pipeline (2026-05-21 evening)

After several failed approaches (route.abort, click guard, JS nav-guard
monkey-patch — `playerNoticeClose` div's `$(document).on('click')` handler
still slipped malware redirects past us), reverse-engineered the full chain by
manually walking the HTTP layer:

1. **najserialy episode page** (with stored `cf_clearance` cookies — NO Turnstile shown). HTML contains:
   - `<div id="playerNotice">` 3-click ad gate ("Klikni na X pre pokračovanie") — its inline JS opens `bestoweddigestionenrich.com/iXXXic?key=...` on each click.
   - `<div id="player_0">` contains `<a href="https://love.govoyra.com/?data=<encrypted_hash>" target="_blank">` — the REAL player gateway, NOT an iframe.
2. **GET govoyra.com/?data=…** returns a tiny auto-submit POST form with the same hash.
3. **POST govoyra.com** with the hash returns HTML containing `<iframe src="https://voe.sx/e/<id>?subtitles=SKCZ;cs;&overrideSubtitles=true">` — encoded Czech subs already in URL params.
4. **voe.sx** redirects to a rolling mirror (`bryantenunder.com` as of 2026-05-21).
5. **Mirror page** contains a 4584-char obfuscated JSON string `["~o0qb!!sHuo*~..."]` that decodes to the m3u8 URL. Decoder lives in `/js/loader.bc4a6543429.js` (83 KB, obfuscated itself).

### Why we don't deobfuscate ourselves

loader.js obfuscation is non-trivial (custom rot+strip+base64+something). VOE
has rolling mirrors, so deob would break every few weeks. Faster + more
robust:

### Headless camoufox JUST for voe→m3u8 step

- 5–10 sec total, no UI
- `Camoufox(headless=True, block_images=True, block_webrtc=True)` is fast and Cloudflare-safe (voe.sx doesn't gate streams behind Turnstile)
- Page goto with `referer=govoyra_url`, then programmatic `mouse.click(center)` × 5 to trigger autoplay
- Network sniffer matches `\.m3u8` → captured URL ready for MPV

### Pipeline code

```python
session = make_session(authenticated=True)   # cookies from Firefox profile
voe_url = extract_voe_url(session, episode_url)  # pure HTTP
stream = capture_stream(...)   # headless camoufox, 5–10 s
launch_mpv(stream)
```

**User interaction:** ONE Turnstile click ever (via `kdrama --refresh-cookies`),
then ~1 year of clearance. Wife never sees a browser window during normal
playback.

**Verified end-to-end 2026-05-21:** Crash Landing s01e01 captured
`https://ugc-cdn-caching-n312aihntfmbp5vdad.cloudwindow-route.com/engine/hls2-c/01/10687/7zzaaq3x9onm_,n,.urlset/master.m3u8`
in ~8 s with zero UI interaction.

## Subtitle delivery

Najserialy.io hosts its own .vtt subtitle files at
`sledujserialy.io/subtitles/<show-slug>-sNNeMM-<hash>.vtt` and passes the URL
to the voe.sx player via the `c1_file` URL parameter in the iframe src.
Example:

```
https://voe.sx/e/xzyeifry1xu2?c1_file=https://sledujserialy.io/subtitles/perfect-crown-2026-s01e01-6a025de254d782.33410742-new.vtt&c1_label=SKCZ&subtitles=SKCZ;cs;https://sledujserialy.io/subtitles/...&overrideSubtitles=true&force=1&
```

Pipeline previously ignored `c1_file` entirely. Fixed: `extract_voe_url` now
also returns the URL parsed from that param, and `capture_stream` passes it to
MPV as `--sub-file=`.

### Coverage

- **Newer / actively-translated series** (Perfect Crown 2026, ongoing K-dramas): `c1_file` populated, CZ .vtt downloaded, MPV shows Czech.
- **Older or popular legacy series** (Crash Landing on You 2019 / "Láska padá z nebe"): `c1_file=` is EMPTY. Najserialy does NOT host its own Czech VTTs for that show — likely subs baked into voe's HLS via `subtitles=SKCZ;cs;` param (server-side-filtered to EN-only in the HLS manifest we receive for reasons we couldn't reverse). MPV shows only EN HLS track. **Known limitation.** Per-series workaround would be fan-sub fetch from ainny.cz / Ivuše / OpenSubtitles — implementable on demand.

### Why loader.js / jwplayer probe failed

voe.sx detects anti-bot fingerprint in both vanilla camoufox and xvfb headed
mode (`typeof jwplayer === 'undefined'` even after 20 s). The deobfuscation
route is therefore unavailable without paid anti-detect infrastructure — but
turned out unnecessary because `c1_file` delivers the URL when najserialy has
it.

**Codex (gpt-5.5) + Gemini-3.1-pro-preview consult (2nd round)** correctly
diagnosed `c1_file=&` being empty as the smoking gun. Gemini specifically said
"běž zpět na zdroj (najserialy.io), najdi element který iframe generuje" —
exactly right.

**Gemini + codex consultations** confirmed: no realistic free auto-Turnstile
solver exists in 2026, cf_clearance is per-IP/UA, monkey-patching JS
navigation is fragile. Sidestepped all of it by never rendering najserialy
HTML in a browser.

## How to apply

- Playwright capture is the bottleneck — Cloudflare may change Turnstile sitekey or rotate clearance lifetime. If wife reports frequent re-clicks, consider 2captcha or auto-clicker.
- Episode page has 3 server tabs (Netu / Voe / Dood). MVP picks default. If `capture_stream` times out without `.m3u8`, add fallback that JS-clicks the next server tab.
- yt-dlp voe/dood extractors do NOT exist in 2026.03.17 stock — relying on Playwright network sniff (matches `\.m3u8(\?|$)`) is intentional and survives embed-host changes.
- Subtitles: many najserialy episodes carry `<span class="titulky">` flag. Whether subs come as HLS sidecar `.vtt` or hardcoded depends on embed host. Script captures first `\.(vtt|srt)` URL seen; if none, MPV plays without external subs (may still have HLS-embedded ones).
