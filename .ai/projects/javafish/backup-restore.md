---
id: project.javafish.backup-restore
title: javafish — backup to KINGSTON & restore to ~
type: workflow
scope: project
feature: null
project: javafish
summary: backup-trading.sh (in ~/git/fishlive/fishlive/scripts/) tars each top dir to /run/media/box/KINGSTON/javafish/<name>/<name>-TS.tar.gz, incremental via metadata fingerprint, code excludes target/node_modules/*.class. Restore = mirror script restore-trading.sh extracting newest archive into the right parent. Archive→target mapping below.
tags: [javafish, backup, restore, kingston, tar, fishlive]
applies_to: [javafish]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.javafish.meta]
---

# Backup & restore

## Backup

Skript **`~/git/fishlive/fishlive/scripts/backup-trading.sh`** → externí disk **KINGSTON**:
`/run/media/box/KINGSTON/javafish/<name>/<name>-YYYYMMDD-HHMMSS.tar.gz` (+ `.fingerprint`).

- **Inkrementální**: fingerprint z metadat (`mtime`+velikost+cesta všech souborů → `sha256` v `.fingerprint`).
  Zálohuje jen složku, kde se od minula něco změnilo. `--force` to obejde.
- **Code excludes** (regenerovatelné): `target`, `node_modules`, `*.class`, `*.lastUpdated`, `__pycache__`.
  Proto je javafish v archivu jen ~167 M místo ~1.1 G.
- **`~/data` (~23 GB) jen s `--data`** (jinak se přeskakuje).
- Další: `--dry-run`, `--keep N` (retence, default 3 archivy/složku).

## Archiv → cíl (mapování)

Archiv má v kořeni *basename* zdrojové složky, takže obnova = rozbalit do *rodiče* cíle:

| archiv (kořen) | rozbalit do | výsledek |
|---|---|---|
| `fishlive/` | `~/git` | `~/git/fishlive` |
| `javafish/` | `~/git` | `~/git/javafish` (multi-repo, ~27× `.git`) |
| `thirdparty/` | `~/git` | `~/git/thirdparty` |
| `WFD-REPOSITORY/` | `~` | `~/WFD-REPOSITORY` |
| `AOS-AUTO/` | `~` | `~/AOS-AUTO` |
| `data/` | `~` | `~/data` (~23 GB rozbaleno) |
| `projects/` | `~/.claude` | `~/.claude/projects` ⚠️ může na cíli už existovat → merge/přepis |

## Restore

Zrcadlový skript **[restore-trading.sh](snippets/restore-trading.sh)** — vybírá nejnovější archiv
z každé složky a rozbaluje do správného rodiče; `--dry-run` pro náhled. Na domácí stroj jsem ho
napsal a spustil 2026-06-01 (7/7 složek OK).

## Gotchas

- **Build skripty** (`build-frm-all.sh`, `build-infra-from-tags.sh`, `run-orderflow-study.sh`)
  v kořeni `~/git/javafish` NEJSOU — jsou v `~/git/fishlive/fishlive/scripts/javafish/`. Obnoví se s fishlive.
- **claude-projects**: záloha je z jiného stroje; na cílovém `~/.claude/projects` už typicky existuje
  (živá session). Merge přepíše jen stejnojmenné soubory. Rozmysli si skip vs. merge.
- Sám zálohovací skript je uvnitř `claude-projects` archivu (session `-home-box-git-javafish`) —
  odtud se dá zpětně rekonstruovat, kdyby chyběl.
