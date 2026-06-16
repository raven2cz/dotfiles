---
id: system.code-comments-language
title: Code comments and JSDoc are always in English
type: decision
scope: system
feature: null
project: null
summary: All in-code comments, JSDoc/docstrings, commit-adjacent code annotations, and identifiers must be written in English, regardless of the language tonda speaks in chat. Chat/prose can be Czech; code is English-only.
tags: [code-style, comments, jsdoc, english, conventions]
applies_to: [javascript, typescript, java, python, bash, any-source-code]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-01
supersedes: []
superseded_by: null
links: [system.readme-writing-style]
---

# Code comments and JSDoc are always in English

**Rule:** every comment, JSDoc block, docstring, and code-level annotation is
written in **English** — in all languages and all repos. This holds even when
the conversation with tonda is in Czech.

## Why

- Code is shared / read by external tools (codex, future contributors) and
  should stay language-neutral at the source level.
- Mixing Czech prose into source makes diffs and greps inconsistent.

## Scope

- **English:** inline comments, block comments, JSDoc / docstrings, TODO/FIXME
  notes, log messages baked into code, variable/function/type names.
- **Czech is fine:** chat replies, design discussion, and—per
  [[system.readme-writing-style]]—READMEs/docs may follow tonda's language
  preference there (but default to English for docs unless told otherwise).

## Note for agents

If you catch yourself writing a Czech comment, fix it before finishing the
task. When reviewing/refactoring existing files that already contain Czech
comments, translate them to English as you touch them.
