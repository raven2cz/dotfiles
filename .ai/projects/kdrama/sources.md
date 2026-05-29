---
id: project.kdrama.sources
title: K-Drama video and Czech-subtitle sources
type: topic
scope: project
feature: null
project: kdrama
summary: Catalog of K-Drama video sources (legal + grey-zone aggregators) and Czech-subtitle sources, plus relevant workflow tools.
tags: [kdrama, sources, references, czech-subs]
applies_to: [kdrama]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-05-21
supersedes: []
superseded_by: null
links: [project.kdrama.meta, project.kdrama.implementation]
---

# K-Drama sources

Researched 2026-05-21.

## Video streams (legal)

- **Netflix** — large K-Drama catalog, official CZ subs on many titles. Browser/app only, no MPV pipeline.
- **Rakuten Viki** (viki.com) — Asian-focused, community CZ/SK subs on some titles. Viki Pass for HD/no-ads. Official download is mobile-only with DRM; third-party Viki downloaders exist (StreamFab, KeepStreams) but bypass DRM.
- **KOCOWA** — exclusive K-dramas (KBS/MBC/SBS), Europe-available.
- **Tubi** — small free K-drama selection, EN subs.
- **iQIYI** — Chinese-owned, some K-dramas.

## Video streams (grey-zone aggregators)

- **najserialy.io** — Slovak/Czech aggregator. Embeds streamtape/mixdrop/doodstream players. As of May 2026 the site landing page pushes browser malware/spamware. The embedded HLS streams themselves are extractable via `The Stream Detector` Firefox add-on → yt-dlp/mpv with Referer+UA headers. NOT supported by built-in yt-dlp extractors.
- **MyAsianTV** — fast translations, multiple servers, online + download.
- **DramaCool** — historically popular, status as of 2026 varies.

## Czech-subtitle sources (fan-translation, video-less)

- **ainny.cz** — actively updated as of May 2026. Private-use only; downloads, no registration. Uses Akihabara naming conventions.
- **ivuse-korean-dramas.webnode.cz** ("Ivuše") — Czech K-drama fan subs from translators DQ and Keopi, organized by SERIÁLY / WEBSERIÁLY / FILMY.
- **edna.cz** — large DB of series + CZ subs to selected titles.
- **cks-korea.cz** (Česko-korejská společnost) — index of K-films/series with existing CZ/SK subs, links to ČSFD.
- **asianstyle.cz** — meta guide listing where to watch + sub sources.
- **DownSub** (downsub.com) — pulls subs from Viki, Viu, Wetv, Kocowa, YouTube. Useful when site has only EN/KO subs.

## Workflow tools

- **The Stream Detector** — Firefox/Chrome extension that captures HLS/.m3u8/.mpd URLs from any page and exports as ready-to-paste yt-dlp/ffmpeg/streamlink/mpv command (with Referer+UA). Essential for aggregator sites.
- **streamlink** — pipes streams to mpv. CLI: `streamlink <url> best --player mpv`.
- **yt-dlp** — `yt-dlp -g <url>` prints direct stream URL for mpv consumption.
- **subliminal** / **mpv-autosub** — auto-fetch subtitles from OpenSubtitles for currently-playing file. Czech ISO code: `cs` or `cze`.
- **EnergoStalin/subtitle-translate-mpv** — MPV Lua script for on-the-fly subtitle translation (multiple backends incl. DeepL).
- **LLM-Subtrans** (machinewrapped/llm-subtrans) — batch SRT translation via OpenAI-compatible APIs (incl. local Ollama).
- **Cerlancism/chatgpt-subtitle-translator** — batch SRT, token-optimized, any OpenAI-compatible endpoint.
- **DeepL API** free tier: 500k chars/month, very good Czech quality.
