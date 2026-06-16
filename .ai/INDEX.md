# Index — curated entry points

Hand-curated start-here. Don't list every file; list the ones an AI agent
should know exist. Exhaustive listing is done by ripgrep on the tree.

## Start here

- New machine setup → [system.r7home](system/machines/r7home.md)
- AUR malware / supply-chain check (aurscan, all Arch boxes) → [system.aur-malware-monitoring](system/aur-malware-monitoring.md)
- External agent CLIs (codex, agy) for review → [system.ai-agents-usage](system/ai-agents-usage.md)
- Firefox / HiDPI display weirdness → [system.firefox-hidpi-scaling](system/firefox-hidpi-scaling.md)
- Writing READMEs / docs (low AI-slop, no em-dash) → [system.readme-writing-style](system/readme-writing-style.md)
- Code comments / JSDoc must be English → [system.code-comments-language](system/code-comments-language.md)
- Project-specific knowledge → browse [projects/](projects/)

## System

| id | title | last_updated |
|---|---|---|
| system.r7home | r7home — primary workstation (4K + somewm + dual monitor + Samsung TV) | 2026-06-16 |
| system.aur-malware-monitoring | AUR package malware monitoring with aurscan (all Arch machines) | 2026-06-16 |
| system.ai-agents-usage | External AI agent CLIs (codex gpt-5.5, agy/Antigravity 2.0 replacing gemini-cli) | 2026-05-28 |
| system.firefox-hidpi-scaling | Firefox HiDPI chrome vs content scaling | 2026-05-28 |
| system.readme-writing-style | README / docs writing style (low AI-slop, ASCII punctuation) | 2026-06-01 |
| system.code-comments-language | Code comments and JSDoc are always in English | 2026-06-01 |

## Projects

| project | what's there |
|---|---|
| [synapse](projects/synapse/) | `_meta.md` (Resolve Model Redesign context, established systems), `download-system.md` (canonical download architecture) |
| [kdrama](projects/kdrama/) | `_meta.md` (project overview), `implementation.md` (camoufox + voe.sx pipeline), `sources.md` (video + CZ subs catalog) |
| [swebshare](projects/swebshare/) | `_meta.md`, `architecture.md` (webshare API, TMDb, banners, adult mode, codex patterns), `security-backlog.md` (v0.1.3 P1 items) |
| [realestate-bot](projects/realestate-bot/) | `_meta.md` (project scope), `deployment.md` (port, paths, email), `wp5-agent-finder.md` (WP5 redesign + scoring) |
| [somewm](projects/somewm/) | `_meta.md` (3-repo overview), `repo-split.md`, `anim-client-dual-copy.md`, `multimonitor.md`, `pointer-focus-curpressed.md` (input bug lesson), `scenefx-shadow-startup.md`, `ghostty-shader-gpu.md` |
| [hotovo](projects/hotovo/) | `_meta.md` (self-hosted todo app, AI-agent API + MCP, ex "Aether Todo"), `deployment.md` (fishlive.org nginx → :3000, /opt/hotovo, systemd) |
| [gemma](projects/gemma/) | `_meta.md` (local CZ voice assistant + agent, Ollama/whisper/Chatterbox, 3 modes), `cancel-event-threading-asyncio.md` (threading.Event deadlock pitfall, bit twice), `hotovo-integration.md` (direct REST not MCP decision) |
| [javafish](projects/javafish/) | `_meta.md` (Java/Maven multi-repo trading platform, ~27 git modules), `backup-restore.md` (backup-trading.sh → KINGSTON, restore-trading.sh mirror, archive→target mapping) |

## Features

_(empty — features get populated as topics recur across 2+ projects)_

## Snippets

- [userchrome-scale-template.css](system/snippets/userchrome-scale-template.css) — drop-in chrome font scaler referenced by `system.firefox-hidpi-scaling`
- [aur-audit.sh](system/snippets/aur-audit.sh) — one-command AUR malware audit (clone+build aurscan, sweep `pacman -Qmq`, optional `--llm`), referenced by `system.aur-malware-monitoring`
