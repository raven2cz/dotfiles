---
id: project.javafish.meta
title: javafish — trading platform meta
type: topic
scope: project
feature: null
project: javafish
summary: Java/Maven multi-repo trading platform "javafish" at ~/git/javafish (~27 git modules, com.fin.* + org.javafish.*). Related repos ~/git/fishlive (tooling/scripts) + ~/git/thirdparty. Big runtime data dirs ~/data, ~/WFD-REPOSITORY, ~/AOS-AUTO. Backed up to external KINGSTON disk.
tags: [javafish, trading, maven, java, fishlive, multi-repo]
applies_to: [javafish]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.javafish.backup-restore]
---

# javafish — trading platform

Multi-repo Java/Maven trading platform.

- **`~/git/javafish`** — hlavní platforma, ~27 samostatných git modulů (každý vlastní `.git`):
  `com.fin.aos.*` (algo/analysis/auto/wfd), `com.fin.frm.*` (base/chart/data/messaging/samples),
  `com.fin.td.*` (jtd-service/monitoring), `org.javafish.*` (common, trading.backtest, trading.qa, …),
  `master-*-pom` / `javafish-bom` (build parents/BOM).
- **`~/git/fishlive`** — tooling + skripty. Klíčové buildy/utility žijí v
  `~/git/fishlive/fishlive/scripts/javafish/` (`build-frm-all.sh`, `build-infra-from-tags.sh`,
  `run-orderflow-study.sh`) a `~/git/fishlive/fishlive/scripts/backup-trading.sh`.
  (V session bývá na ně odkazováno jako `~/git/javafish/<skript>.sh`, ale kanonicky jsou ve fishlive.)
- **`~/git/thirdparty`** — externí závislosti.
- **Runtime data**: `~/data` (~23 GB), `~/WFD-REPOSITORY` (~1.3 GB), `~/AOS-AUTO` (~3.5 GB).

## Backup / restore

Záloha i obnova celé platformy → viz [[project.javafish.backup-restore]].
