# ~/.ai — AI Knowledge Base

Personal knowledge that AI agents (Claude Code, Codex, future tools) read to
gain cross-conversation context: how machines are wired, app-specific tweaks,
recurring workflows, why certain decisions were made.

**Local-only.** Designed for `~/.ai` on a personal machine; entries may contain
hostnames, machine-specific paths, and other identifying info.

## Layout

```
~/.ai/
├── README.md              ← conventions (this file)
├── INDEX.md               ← hand-curated "start here" + table of top entries
│
├── system/                ← scope: cross-everything, OS / HW / desktop / shell
│   ├── machines/          ←   exception: per-host snapshots (one file per box)
│   ├── snippets/          ←   raw config/code assets (.css, .sh, …)
│   └── *.md               ←   topic/workflow/decision entries, FLAT
│
├── features/              ← scope: cross-project recurring themes
│   └── <feature>/         ←   one dir per feature (auth, ci-cd, observability…)
│       ├── _meta.md       ←     what this feature is, when to use
│       ├── snippets/      ←     raw assets for this feature
│       └── *.md           ←     entries, flat within the feature
│
└── projects/              ← scope: bounded by a specific project / repo
    └── <project>/         ←   one dir per project
        ├── _meta.md
        ├── snippets/
        └── *.md
```

### Why three scopes, flat within each

- **`system/`** — knowledge about the machine itself, the OS, the desktop, the
  shell, tooling. Nothing project-bound.
- **`features/`** — themes that recur across multiple projects (auth, deploy,
  observability, error handling conventions, …). **Rule:** a topic gets
  promoted to `features/` only after it shows up in **2+ projects**, or has a
  deliberate aim of reuse. Don't pre-populate; it'll turn into a "general stuff"
  drawer.
- **`projects/`** — anything bound to one specific codebase or initiative. Born
  here; may migrate to `features/` if it generalizes.

Within each scope, entries are **flat** — the kind of entry (topic / workflow /
decision / snippet) is declared in front-matter, not by directory. This lets
records that mix genres (a decision that includes a workflow, etc.) live
naturally, and changing the type later is just a field edit, not a `mv`.

`system/machines/` and `*/snippets/` are the only carved-out subdirs:
machines are highly stable single-file-per-host records, and snippets are raw
non-markdown assets that have no front-matter.

## File convention

Every Markdown entry starts with YAML front-matter:

```yaml
---
id: system.firefox-hidpi-scaling        # stable, scope-prefixed, dot-separated
title: Firefox HiDPI chrome vs content scaling
type: topic                              # topic | workflow | decision | snippet-doc
scope: system                            # system | feature | project
feature: null                            # set only when scope=feature
project: null                            # set only when scope=project
summary: One-line TL;DR — what an agent reads first when triaging relevance.
tags: [firefox, hidpi, wayland]
applies_to: [firefox]
machines: [r7home]                       # optional; omit if universal
status: active                           # draft | active | deprecated | superseded
confidence: high                         # low | medium | high
owner: tonda
last_updated: 2026-05-28
supersedes: []                           # list of ids this replaces
superseded_by: null                      # id that replaces this one, if any
links: [system.r7home]                   # cross-refs, by id
---
```

After front-matter, free-form Markdown.

### ID rules

- **Format:** `<scope>.<slug>` or `<scope>.<namespace>.<slug>`. Lowercase,
  dot-separated, kebab-case slugs.
- **Stable forever.** Even if the file moves, the id stays the same.
- **Globally unique** across the whole `~/.ai` tree.

Examples:
- `system.firefox-hidpi-scaling`
- `system.r7home` (machines)
- `feature.auth.oauth-pkce-flow`
- `project.fishlive.build-pipeline`

### Linking

Always link by id, never by path:

- In front-matter: `links: [system.r7home, feature.auth.oauth-pkce-flow]`
- In body Markdown: `See [[system.r7home]]`

This survives file moves. Resolution from id to path is mechanical:
`rg "^id: ${id}$"`.

### Status lifecycle

- **`draft`** — being written, may be wrong
- **`active`** — current, trusted
- **`deprecated`** — still readable but newer guidance exists; set `superseded_by`
- **`superseded`** — replaced; keep for history

## INDEX.md — hand-curated entry point

`INDEX.md` is **not** an auto-generated dump. It's a small curated index that
points an AI agent at the highest-value entries first. Add to it when you
write something a future agent will likely need to find. Don't list everything.

For exhaustive listing, the agent uses `rg`:

```bash
rg -l "^id: " ~/.ai             # all entries
rg "^tags:.*firefox" ~/.ai      # search by tag
rg "^scope: project" ~/.ai      # all project-scoped
```

## How an AI agent should use this

### Reading

1. Read `INDEX.md` for the curated entry points relevant to the task.
2. If the task narrows to a scope/feature/project, browse that dir directly.
3. Use front-matter `summary` + `tags` + `applies_to` for fast triage; only
   read the body of files that look relevant.
4. Trust `confidence` and `last_updated`. Verify against current state before
   acting on stale-looking entries.

### Writing

User trigger: phrases like *"uloz to do ~/.ai"*, *"udelej zapis do ~/.ai"*,
*"save to knowledge"*. On trigger:

1. **Pick scope** by the test "is this fact universal, cross-project, or one project?"
   → `system/` | `features/<f>/` | `projects/<p>/`. Promote to `features/` only after
   2+ projects share the topic.
2. **Slug + id**: kebab-case slug, `id: <scope>.<slug>` (or `<scope>.<namespace>.<slug>`).
3. **Front-matter complete**: all schema fields, including `summary`, `confidence`,
   `last_updated` set to today.
4. **Link both directions** when relevant: add id to `links:` of related entries.
5. **Update `INDEX.md`** only if the entry is genuinely high-value (an agent should
   know it exists). Don't dump every file.
6. **Snippets** (raw assets, `.css`/`.sh`/…) go in `<scope>/snippets/` or
   `<scope>/<feature-or-project>/snippets/`. Reference them from topic body via
   relative markdown link.

## Future migration

Front-matter schema is regular enough that this can become a SQLite/Datasette
DB later: one row per file, JSON column for `tags`/`links`. Until then,
ripgrep + read is the access pattern.
