#!/usr/bin/env bash
# aur-audit.sh - audit every installed AUR (foreign) package with aurscan.
#
# Source of truth / docs: ~/.ai entry  system.aur-malware-monitoring
# Tool:                    https://github.com/manticore-projects/aurscan (Go, no deps)
#
# What it does:
#   1. clone+build aurscan locally (per-user, no sudo, no system install)
#   2. run the static-rule scanner over `pacman -Qmq` (offline, free)
#   3. list the flagged packages and the known false-positive patterns
#   4. optional: re-scan the flagged ones with the LLM backend for a real verdict
#
# Usage:
#   ./aur-audit.sh           static rules sweep over all installed AUR pkgs
#   ./aur-audit.sh --llm     sweep, then LLM adjudication of flagged pkgs
#   ./aur-audit.sh --update  git pull + rebuild aurscan before scanning
#
# Env:
#   AURSCAN_SRC   where to keep the checkout      (default ~/.local/src/aurscan)
#   AURSCAN_BACKEND / ANTHROPIC_API_KEY / AURSCAN_OPENAI_URL  pick LLM backend
#                 (with the `claude` CLI logged in, nothing extra is needed)
set -euo pipefail

SRC="${AURSCAN_SRC:-$HOME/.local/src/aurscan}"
BIN="$SRC/aurscan"
REPO="https://github.com/manticore-projects/aurscan"

log(){ printf '%s\n' "$*" >&2; }

DO_UPDATE=0; DO_LLM=0
for a in "$@"; do
  case "$a" in
    --update) DO_UPDATE=1 ;;
    --llm)    DO_LLM=1 ;;
    -h|--help) sed -n '2,28p' "$0"; exit 0 ;;
    *) log "unknown arg: $a (try --help)"; exit 2 ;;
  esac
done

command -v go     >/dev/null || { log "ERROR: Go is required:    pacman -S go";     exit 1; }
command -v pacman >/dev/null || { log "ERROR: not an Arch/pacman system";           exit 1; }

# 1. clone or update the checkout
if [ ! -d "$SRC/.git" ]; then
  log ">> cloning aurscan -> $SRC"
  git clone --depth 1 "$REPO" "$SRC"
elif [ "$DO_UPDATE" = 1 ]; then
  log ">> updating aurscan checkout"
  git -C "$SRC" pull --ff-only
fi

# 2. build locally if the binary is missing or any source is newer
if [ ! -x "$BIN" ] || [ -n "$(find "$SRC" -name '*.go' -newer "$BIN" 2>/dev/null | head -1)" ]; then
  log ">> building aurscan (CGO off, local binary, no sudo)"
  ( cd "$SRC" && CGO_ENABLED=0 go build -trimpath -o "$BIN" ./cmd/aurscan )
fi
log ">> $("$BIN" --version | head -1)"

# 3. collect installed AUR / foreign packages
mapfile -t PKGS < <(pacman -Qmq)
[ "${#PKGS[@]}" -gt 0 ] || { log "no foreign (AUR) packages installed - nothing to do"; exit 0; }
log ">> scanning ${#PKGS[@]} installed AUR packages (static rules, offline)"
log ""

# 4. static-rule sweep (raise the per-run cap to cover every package + deps)
LOG="$(mktemp "${TMPDIR:-/tmp}/aur-audit-XXXXXX.log")"
AURSCAN_RULES_ONLY=1 AURSCAN_MAX_PKGS=$(( ${#PKGS[@]} + 50 )) \
  "$BIN" --rules-only "${PKGS[@]}" | tee "$LOG" || true

# 5. extract flagged package names (strip any ANSI colour first)
mapfile -t FLAGGED < <(
  sed -E 's/\x1b\[[0-9;]*m//g' "$LOG" \
  | grep -E '^\[[[:space:]]*(MAL!|SUSP)[[:space:]]*\]' \
  | sed -E 's/^\[[^]]*\][[:space:]]*//' \
  | awk '{print $1}' | sort -u
)

log ""
log "============================================================"
log ">> rules-only flagged ${#FLAGGED[@]} package(s): ${FLAGGED[*]:-none}"
log ""
log ">> rules-only is intentionally noisy. Known BENIGN false positives:"
log "   PERSIST-002  '*.timer' string inside a REUSE.toml (SPDX license glob,"
log "                not a real systemd timer) - by far the most common"
log "   PRIV-001     'sudo' in README / changelog / optdepends (doc text)"
log "   NPM-001      'npm install' for a genuine node/electron app build"
log "   PERSIST-001  a package installing its own named *.service"
log "   CHK-005      source uses SKIP / NET-001 http source (checksummed)"
log "   Real signal  = LLM verdict (--llm) or reading the PKGBUILD yourself."
log "============================================================"

# 6. optional LLM adjudication of the flagged set only
if [ "$DO_LLM" = 1 ] && [ "${#FLAGGED[@]}" -gt 0 ]; then
  command -v claude >/dev/null || [ -n "${ANTHROPIC_API_KEY:-}" ] || [ -n "${AURSCAN_OPENAI_URL:-}" ] || {
    log "ERROR: --llm needs the claude CLI (logged in), ANTHROPIC_API_KEY, or AURSCAN_OPENAI_URL"
    exit 1
  }
  log ""
  log ">> LLM adjudication of the ${#FLAGGED[@]} flagged package(s) (uses tokens)"
  log ""
  AURSCAN_MAX_PKGS=$(( ${#FLAGGED[@]} + 20 )) AURSCAN_TIMEOUT=120 \
    "$BIN" "${FLAGGED[@]}" || true
fi

log ""
log ">> log saved: $LOG"
