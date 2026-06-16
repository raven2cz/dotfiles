---
id: system.dotfiles-config-bare-repo
title: dotfiles and ~/.ai via the `config` bare git repo (Arch machines)
type: workflow
scope: system
feature: null
project: null
summary: tonda's dotfiles AND the whole ~/.ai knowledge base live in one bare git repo at ~/.dotfiles, driven by the fish alias `config` = git --git-dir=$HOME/.dotfiles --work-tree=$HOME. Remote git@github.com:raven2cz/dotfiles.git, branch main. The work-tree is the entire $HOME, so never `add -A` / `reset --hard` / `checkout .` / `clean`; always stage explicit paths and verify the staged set before committing. Same setup on most of his Arch boxes. This is how ~/.ai changes are persisted.
tags: [dotfiles, git, bare-repo, config, fish, arch, knowledge-base, persistence]
applies_to: [arch, fish, git, dotfiles]
status: active
confidence: high
owner: tonda
last_updated: 2026-06-16
supersedes: []
superseded_by: null
links: [system.aur-malware-monitoring, system.r7home]
---

# dotfiles + ~/.ai via `config`

tonda version-controls his dotfiles AND the entire `~/.ai` knowledge base in a
single bare git repo, using the well-known "bare repo, $HOME as work-tree"
pattern. This is the standard setup on most of his Arch machines. It is how all
`~/.ai` edits are preserved: write the file, then `config add` + `config commit`
+ `config push`.

## The wrappers (fish aliases)

Defined in `~/.config/fish/config.fish`:

```fish
alias config="/usr/bin/git --git-dir=$HOME/.dotfiles --work-tree=$HOME"
alias dconfig="/usr/bin/git --git-dir=$HOME/src/devenv/dotfiles/.dotfiles --work-tree=$HOME/src/devenv/dotfiles"
```

- `config`  : main dotfiles + `~/.ai`. git-dir `~/.dotfiles`, work-tree `$HOME`,
  remote `git@github.com:raven2cz/dotfiles.git`, branch `main`. Linear history,
  commits land directly on `main` (no PR/branch workflow for dotfiles).
- `dconfig` : separate "devenv" dotfiles repo under `~/src/devenv/dotfiles`. Do
  not confuse the two.

`config config status.showUntrackedFiles no` is set, so a bare `config status`
does NOT dump every untracked file in `$HOME`. To see untracked files inside a
specific subtree, force it scoped:
`config -c status.showUntrackedFiles=normal status -s -- ~/.ai/`.

## For an agent running in bash (no fish alias)

The alias is fish-only. From bash/agents, use the exact expansion:

```bash
CFG="/usr/bin/git --git-dir=$HOME/.dotfiles --work-tree=$HOME"
$CFG status -s -- ~/.ai/
$CFG log --oneline -5
```

## Safety: the work-tree is your entire $HOME

This is the one thing to never get wrong. Because `--work-tree=$HOME`, a sloppy
command operates on the whole home directory.

- NEVER `config add -A`, `config add .`, `config add $HOME`. You would stage
  hundreds of unrelated home files.
- NEVER `config reset --hard`, `config checkout .`, `config clean`, or
  `config stash` broadly. They can overwrite or delete live home files.
- ALWAYS stage explicit paths: `config add ~/.ai/...` (a dir or named files).
- ALWAYS verify scope before committing:
  `config diff --cached --name-only` and confirm nothing outside the intended
  subtree is staged (e.g. `| grep -v '^.ai/'` should be empty when committing
  `~/.ai`).

## Persisting ~/.ai changes (the common case)

```bash
config add ~/.ai/                      # whole KB subtree (bounded to ~/.ai)
config diff --cached --name-only       # verify: all paths under .ai/
config commit -m "ai: <what changed>"
config push origin main
```

Scope to specific files instead of the whole subtree when other unrelated
`~/.ai` edits are pending and should not ride along.

## New-machine bootstrap (reference)

Standard bare-repo clone (verify before the checkout overwrites local files):

```bash
git clone --bare git@github.com:raven2cz/dotfiles.git $HOME/.dotfiles
alias config="/usr/bin/git --git-dir=$HOME/.dotfiles --work-tree=$HOME"
config checkout            # resolve/backup any conflicting pre-existing files first
config config status.showUntrackedFiles no
```

After this, `~/.ai` is present and the AUR audit procedure
[[system.aur-malware-monitoring]] can run on the box.
