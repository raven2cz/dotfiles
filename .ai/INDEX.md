# Index — curated entry points

Hand-curated start-here. Don't list every file; list the ones an AI agent
should know exist. Exhaustive listing is done by ripgrep on the tree.

## Start here

- New machine setup → [system.r7home](system/machines/r7home.md)
- External agent CLIs (codex, agy) for review → [system.ai-agents-usage](system/ai-agents-usage.md)
- Firefox / HiDPI display weirdness → [system.firefox-hidpi-scaling](system/firefox-hidpi-scaling.md)
- Project-specific knowledge → browse [projects/](projects/)

## System

| id | title | last_updated |
|---|---|---|
| system.r7home | r7home — primary workstation (4K + somewm + dual monitor + Samsung TV) | 2026-05-28 |
| system.ai-agents-usage | External AI agent CLIs (codex gpt-5.5, agy/Antigravity 2.0 replacing gemini-cli) | 2026-05-28 |
| system.firefox-hidpi-scaling | Firefox HiDPI chrome vs content scaling | 2026-05-28 |

## Projects

| project | what's there |
|---|---|
| [synapse](projects/synapse/) | `_meta.md` (Resolve Model Redesign context, established systems), `download-system.md` (canonical download architecture) |
| [kdrama](projects/kdrama/) | `_meta.md` (project overview), `implementation.md` (camoufox + voe.sx pipeline), `sources.md` (video + CZ subs catalog) |
| [swebshare](projects/swebshare/) | `_meta.md`, `architecture.md` (webshare API, TMDb, banners, adult mode, codex patterns), `security-backlog.md` (v0.1.3 P1 items) |
| [realestate-bot](projects/realestate-bot/) | `_meta.md` (project scope), `deployment.md` (port, paths, email), `wp5-agent-finder.md` (WP5 redesign + scoring) |
| [somewm](projects/somewm/) | `_meta.md` (3-repo overview), `repo-split.md`, `anim-client-dual-copy.md`, `multimonitor.md`, `pointer-focus-curpressed.md` (input bug lesson), `scenefx-shadow-startup.md`, `ghostty-shader-gpu.md` |
| [hotovo](projects/hotovo/) | `_meta.md` (self-hosted todo app, AI-agent API + MCP, ex "Aether Todo"), `deployment.md` (fishlive.org nginx → :3000, /opt/hotovo, systemd) |

## Features

_(empty — features get populated as topics recur across 2+ projects)_

## Snippets

- [userchrome-scale-template.css](system/snippets/userchrome-scale-template.css) — drop-in chrome font scaler referenced by `system.firefox-hidpi-scaling`
