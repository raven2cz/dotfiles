---
id: system.ai-agents-usage
title: External AI agent CLIs — invocation patterns
type: topic
scope: system
feature: null
project: null
summary: Canonical invocation patterns for external review/agent CLIs (codex, agy = Antigravity 2.0, deprecated gemini). Used for independent reviews and second opinions across all projects.
tags: [ai-agents, codex, antigravity, agy, gemini, reviews, cli]
applies_to: [codex, agy, antigravity, gemini]
machines: [r7home]
status: active
confidence: high
owner: tonda
last_updated: 2026-05-28
supersedes: []
superseded_by: null
links: [system.r7home]
---

# External AI agent CLIs

This is the **single source of truth** for how external review/agent CLIs are
invoked across all projects. Per-project memory should link here instead of
duplicating the invocation pattern.

## Codex CLI (`codex`) — gpt-5.5 mandatory

OpenAI Codex CLI for code review and second opinions on plans.

**Binary:** `/home/box/.local/bin/codex` (current: `codex-cli 0.128.0`)

**Model:** ALWAYS `gpt-5.5`. Default (o4-mini, gpt-5.4, …) is too weak for review work. User has corrected this multiple times across projects. **Never invoke without an explicit model.**

### Non-interactive review (most common)

```bash
codex exec -c model="gpt-5.5" --skip-git-repo-check "Review this plan: <prompt or path>"
```

Both flag styles work for selecting the model:

- `-c model="gpt-5.5"` (config-style)
- `-m gpt-5.5` (short flag)

Prefer `-c model=...` for review work — matches the project convention.

### Review a specific commit

```bash
codex review --commit <SHA> -m gpt-5.5
```

### Long prompts via heredoc

```bash
codex exec --skip-git-repo-check "$(cat <<'EOF'
Long review prompt here…
EOF
)"
```

### Output capture (avoid pipe buffering bugs)

`codex exec` output piped through `tail`/`head` may silently buffer.
For background jobs use `--output-last-message <path>` and read that file.

```bash
codex exec --skip-git-repo-check --output-last-message /tmp/codex.out "..." >/dev/null 2>&1 &
```

## Antigravity CLI (`agy`) — replaces gemini CLI

Google's Antigravity 2.0 platform CLI, announced 2026-05-19, replaces the
retired `gemini` CLI. **Gemini CLI stops serving requests 2026-06-18** for
Pro/Ultra/free tiers.

**Binary:** `/home/box/.local/bin/agy` (current local: `1.0.3`)

**Default model:** Gemini 3.5 Flash (High) — fastest frontier model, outperforms Gemini 3.1 Pro on Terminal-Bench 2.1, GDPval-AA, MCP Atlas.

### Non-interactive (batch) invocation

```bash
agy -p "Review this design: <prompt>"
# aliases: --print, --prompt
```

Notes:
- Prompt must be passed as a **flag value**, not stdin. `echo X | agy -p` errors.
- Default timeout `--print-timeout 5m0s`. Override for long reviews.
- For fully unattended runs: `--dangerously-skip-permissions`.

### Long prompts (no stdin support)

```bash
agy -p "$(cat /tmp/review-prompt.md)"
```

### Model selection

**Important:** `agy` v1.0.3 (currently installed) **does not expose `--model` as a CLI flag**. Model selection happens in either of these ways:

1. **Interactive `/model` slash command** — only available in `agy` interactive mode (not for `-p` batch).
2. **`~/.gemini/antigravity-cli/settings.json`** — `"model"` field. Persists across runs.

Settings file shape:

```json
{
  "model": "Gemini 3.5 Flash (High)",
  "enableTelemetry": false,
  "trustedWorkspaces": ["/home/box"]
}
```

**Valid model names** (must match the `/model` list literally, with capitalization and parentheses):

- `Gemini 3.5 Flash (High)` — default, fastest, recommended for reviews
- `Gemini 3.5 Flash (Medium)` — slightly cheaper
- `Gemini 3.1 Pro (High)` — for harder reasoning, slower
- `Gemini 3.1 Pro (Low)`
- `Claude Sonnet 4.6 (Thinking)`
- `Claude Opus 4.6 (Thinking)`
- `GPT-OSS 120B (Medium)`

### Switch model for a batch run

```bash
# temporarily set to Gemini 3.5 Flash (High) for one batch:
jq '.model = "Gemini 3.5 Flash (High)"' ~/.gemini/antigravity-cli/settings.json \
  > /tmp/agy-settings && mv /tmp/agy-settings ~/.gemini/antigravity-cli/settings.json
agy -p "Review: …"
```

### Resume a previous conversation

```bash
agy -c                      # continue most recent
agy --conversation=<id>     # resume by ID
```

### Migrating from gemini CLI (one-time)

```bash
agy plugin import gemini    # pulls MCP servers, allowed commands, keybindings, theme
```

## Gemini CLI (`gemini`) — DEPRECATED

`gemini` CLI is **deprecated**. It will stop serving requests on **2026-06-18**
for Google AI Pro / Ultra / free-tier users. Enterprise licenses unaffected.

**Do not write new automation against `gemini`.** Existing scripts should be
migrated to `agy`. Old invocation patterns referenced `-m gemini-3.1-pro-preview`;
that's superseded by `agy` with model set via settings.json.

If you still need to invoke `gemini` short-term (e.g. for a script not yet
migrated): `gemini -m gemini-3.1-pro-preview -p "prompt" -y`. Note this stops
working 2026-06-18.

## When to use which agent

**Standard external-review workflow** for plans and large refactors:

1. Write spec into a file.
2. Run **codex** + **agy** **in parallel** (background tools, e.g. `Bash run_in_background=true`) with the same review prompt + path to spec.
3. Ask for short focused output: *"max ~300 slov, najdi 3 největší díry"*.
4. Summarize both reviews back to user. Integrate findings into the spec before implementation.

**Picking the model:**

- For tactical fixes, code review on a diff: codex `gpt-5.5` + agy default (Flash High).
- For deep design / cross-cutting reasoning: codex `gpt-5.5` + agy with `Gemini 3.1 Pro (High)` or `Claude Opus 4.6 (Thinking)`.
- Small/cheap dry runs: agy `Gemini 3.5 Flash (Medium)`.

**Skip review entirely** for small, well-understood changes. Not every commit
needs peer review.

## Common pitfalls

- **codex without `-c model="gpt-5.5"`** → silently runs on weak default. Always verify the flag.
- **agy `-p` with stdin** → fails. Use `agy -p "$(cat file.md)"`.
- **agy stuck on wrong model** → check `~/.gemini/antigravity-cli/settings.json`. The interactive `/model` selection persists into settings.
- **gemini-cli scripts after 2026-06-18** → will stop working. Migrate before that date.
