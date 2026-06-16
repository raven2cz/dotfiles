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
last_updated: 2026-06-15
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

### ⚠️ Always redirect stdin from /dev/null (recent codex blocks on stdin)

Recent `codex exec` builds READ STDIN even when the prompt is passed as an argument, and BLOCK
waiting for input that never comes → the call hangs until timeout. Symptom in captured output:
`Reading additional input from stdin...`. Short prompts may slip through; longer ones reliably hang.

**Fix: always append `< /dev/null`:**

```bash
codex exec -c model="gpt-5.5" --skip-git-repo-check "$(cat prompt.txt)" < /dev/null > /tmp/out.txt 2>&1
```

Large code-review prompts take several minutes — use `timeout 540` (not 280) and read the file.
(Discovered 2026-06-02: codex appeared "down" — even a trivial prompt timed out — purely because
stdin wasn't redirected; the real fix was `< /dev/null`. Also helps to ASCII-clean code via
`iconv -f utf-8 -t ascii//TRANSLIT` to avoid odd characters in prompts.)

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

**Binary:** `/home/box/.local/bin/agy` (current local: `1.0.8`). **NOT on the default PATH** — invoke
via the absolute path (or ensure `~/.local/bin` is on PATH). `which agy` failing is normal in stripped shells.

**Default model:** Gemini 3.5 Flash (High) — fastest frontier model, outperforms Gemini 3.1 Pro on Terminal-Bench 2.1, GDPval-AA, MCP Atlas.

### ⚠️ "Empty `-p` output" almost always means NOT LOGGED IN — it is NOT flakiness

The #1 failure mode (mis-diagnosed twice as "agy is flaky / returns empty on long prompts"): `agy -p`
produces a **0-byte output and exits 0** when the CLI is **not authenticated**. Print mode does a
*silent* keyring auth first; on miss it triggers an interactive OAuth flow, prints a login URL,
waits ~30s, then **times out with no answer**. In a redirected/background run the URL prompt is lost,
so all you see is an empty file. This looks identical to a flaky model but is purely an auth gap.

**Antigravity auth is SEPARATE from the legacy gemini `~/.gemini/oauth_creds.json`** (that belonged to
the dead gemini CLI and is irrelevant — it can be expired and agy still works once *Antigravity* is
logged in, and vice-versa). An `agy update` / new binary can drop you back to logged-out.

**Diagnose (don't guess):**
```bash
tail -30 ~/.gemini/antigravity-cli/cli.log | grep -iE 'not logged|silent auth|OAuth|token'
# "You are not logged into Antigravity" + "Print mode: silent auth failed, triggering OAuth" == not logged in
```

**Preflight canary before any batch review** (cheap; treat empty/timeout as "not logged in", surface to
the user — do NOT retry as if flaky):
```bash
timeout 25 /home/box/.local/bin/agy -p "Reply with exactly: PONG" 2>&1 | grep -q PONG \
  && echo "agy OK" || echo "agy NOT LOGGED IN — ask user to run interactive login"
```

**Even when authenticated, `agy -p` print mode can time out on LARGE prompts** (observed: a ~12 KB
code-review prompt hit `timeout 124` / empty output, while the PONG canary and a ~3 KB lean prompt
returned fine). Keep review prompts lean — strip block comments/javadoc, send only the functions under
review, ask for ≤200–250 words. Run detached with a generous `--print-timeout` (e.g. 14m) if needed.

**Fix = one-time interactive login** (OAuth, headless prints a URL + pastes the auth code back):
```bash
/home/box/.local/bin/agy            # interactive TUI → choose Google OAuth → open URL → paste code
# or: agy -i "hi"  (initial prompt, then interactive)
```
Claude cannot complete OAuth itself — the **user** must run this once in their terminal.

**Persistence requires a Secret Service** (`org.freedesktop.secrets`, i.e. gnome-keyring/kwallet). agy
strictly needs the freedesktop Secret Service D-Bus API to persist the token across sessions; without a
running+unlocked keyring you re-auth every time (known headless/WSL bug, fixed ≥1.0.1 *given* a keyring).
Verify it's present (on r7home it is — gnome-keyring-daemon with `secrets` component):
```bash
busctl --user list | grep org.freedesktop.secrets   # must show gnome-keyring-d (or kwalletd)
```
If missing, start one: `gnome-keyring-daemon --start --components=secrets` (needs an unlocked login keyring).

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

### Model selection — `--model` IS a flag (since ≥1.0.8)

**UPDATED 2026-06-15 (verified on v1.0.8):** `agy` now **DOES expose `--model` as a per-call CLI flag**
(`--model  Model for the current CLI session`). This supersedes the old v1.0.4 note that claimed it was
settings.json-only. The canonical batch-review invocation is therefore one self-contained line — no
settings.json mutation needed:

```bash
agy -p "$(cat /tmp/review-prompt.md)" --print-timeout 14m0s --model "Gemini 3.1 Pro (High)"
```

- The model name MUST match `agy models` output literally (capitalization + parentheses). **Don't guess —
  run `agy models`** to get the live list; an invalid `--model` value is a foreign-flag failure mode
  (manifests as the "stuck/empty" symptom).
- `--print-timeout` defaults to `5m0s`; raise it (e.g. `14m0s`) for long code reviews.
- `--model` overrides the session model for that one call; `settings.json` `"model"` remains the persistent
  default when `--model` is omitted.

**Valid model names** (from `agy models` on v1.0.8 — re-run to confirm, the list shifts with releases):

- `Gemini 3.5 Flash (Low|Medium|High)` — Flash High = fast default, good for tactical review
- `Gemini 3.1 Pro (Low|High)` — High = deep reasoning / money-critical review, slower
- `Claude Sonnet 4.6 (Thinking)`, `Claude Opus 4.6 (Thinking)`
- `GPT-OSS 120B (Medium)`

### Persistent default via settings.json (when `--model` omitted)

```json
{
  "model": "Gemini 3.5 Flash (High)",
  "enableTelemetry": false,
  "trustedWorkspaces": ["/home/box"]
}
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
2. **Preflight the agy login canary** (above) — if not logged in, ask the user to log in rather than
   silently shipping a codex-only review or mis-blaming agy as flaky.
3. Run **codex** + **agy** **in parallel** (background tools, e.g. `Bash run_in_background=true`) with the same review prompt + path to spec.
4. Ask for short focused output: *"max ~300 slov, najdi 3 největší díry"*.
5. Summarize both reviews back to user. Integrate findings into the spec before implementation.

**Picking the model:**

- For tactical fixes, code review on a diff: codex `gpt-5.5` + agy default (Flash High).
- For deep design / cross-cutting reasoning: codex `gpt-5.5` + agy with `Gemini 3.1 Pro (High)` or `Claude Opus 4.6 (Thinking)`.
- Small/cheap dry runs: agy `Gemini 3.5 Flash (Medium)`.

**Skip review entirely** for small, well-understood changes. Not every commit
needs peer review.

## Common pitfalls

- **codex without `-c model="gpt-5.5"`** → silently runs on weak default. Always verify the flag.
- **agy `-p` returns empty / exits 0** → **NOT logged into Antigravity** (not flakiness). Check
  `~/.gemini/antigravity-cli/cli.log` for "not logged into Antigravity"; fix = one-time interactive login.
  (Mis-diagnosed as "agy flaky on long prompts" twice — it was always auth.)
- **agy `-p` with stdin** → fails. Use `agy -p "$(cat file.md)"`.
- **agy not on PATH** → use absolute `/home/box/.local/bin/agy`. `which agy` may report nothing.
- **agy re-auths every session** → no running Secret Service (gnome-keyring/kwallet). Token won't persist.
- **agy stuck on wrong model** → check `~/.gemini/antigravity-cli/settings.json`. The interactive `/model` selection persists into settings.
- **gemini-cli scripts after 2026-06-18** → will stop working. Migrate before that date.
