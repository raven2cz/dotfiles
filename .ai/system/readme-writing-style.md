---
id: system.readme-writing-style
title: README / docs writing style (low AI-slop, ASCII punctuation)
type: decision
scope: system
feature: null
project: null
summary: How tonda wants READMEs and docs written. No em/en/nb dashes (use a colon or plain '-'), no emoji headers, no marketing adjectives. Concrete technical bullets, "what it is / is not". Model on somewm-shell/README.md.
tags: [writing, readme, docs, style, ai-slop, punctuation]
applies_to: [readme, markdown, documentation]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [project.hotovo, system.ai-agents-usage]
---

# README / docs writing style

Rules tonda wants applied to every README and doc I write. Goal: reads like a
person wrote it, not an LLM. The reference implementation is
`~/git/github/somewm-shell/README.md` (his own style). When in doubt, open it
and match the tone.

## Punctuation: ASCII only

- **No em-dash (`—`), en-dash (`–`), figure dash (`‒`), or non-breaking hyphen (`‑`).**
  These are the #1 "AI wrote this" tell for him.
- Replace with **a colon** where the dash introduces or explains
  (`Feature: description`), or **a plain ASCII hyphen `-`** otherwise. A comma or
  semicolon is also fine when it reads naturally.
- No "smart" quotes if avoidable, no `…` ellipsis char (use `...`). Arrows `->`
  over `→` when it costs nothing; `→` is tolerable inside ASCII diagrams.
- Quick audit before committing:
  ```bash
  git grep -nP '[\x{2014}\x{2013}\x{2012}\x{2011}]' -- '*.md' '*.example' '*.sh'
  ```
  Bulk fix in non-prose files:
  ```bash
  perl -CSD -i -pe 's/[\x{2014}\x{2013}\x{2012}\x{2011}]/-/g' FILES...
  ```
  In a README, fix by hand so the dash becomes a colon where it should.

## Anti-slop content rules

- **No emoji-prefixed headers**, no decorative emoji sprinkled in prose. A single
  logo/mascot image or one checkmark in the title is fine.
- **No marketing adjectives** ("powerful", "seamless", "blazing-fast",
  "robust", "elegant", "effortless"). State what it does, let the reader judge.
- **Concrete, technical bullets.** Name the actual mechanism (port, table,
  algorithm, file path), not a vibe. "durable outbox, idempotent insert via
  `todoTaskId` marker, retry/backoff" beats "reliable sync".
- **"What it is / what it is not."** An explicit non-goals or scope line ("not a
  team tool, single user, binds to 127.0.0.1") sets honest expectations.
- **Badges** for license/runtime/key tech are good (shields.io), kept to a few.
- Short intro blockquote tagline, then a "Co to je" / "What it is" section, then
  features, architecture, run, deploy, API, license. No filler "Introduction"
  prose.
- Czech projects: write the README in Czech, keep code/identifiers/English terms
  as-is. Comments in code stay English.

## Why

He flagged READMEs as "AI slop" and specifically called out em-dashes
("no hlavne emDash pryc!"). ASCII punctuation + concrete bullets + explicit
non-goals is what makes it read as his own writing.

Mirrored in Claude Code memory (`writing-style-no-em-dash`) for the todo-list
session; this `~/.ai` entry is the cross-project source of truth.
