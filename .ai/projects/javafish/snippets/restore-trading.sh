#!/bin/bash
# Obnova trading platformy ze záloh na KINGSTON.
# Zrcadlo backup-trading.sh: každý <name>/<name>-*.tar.gz se rozbalí zpět
# do rodiče cílové cesty (archiv obsahuje basename složky relativně).
#
# Zdroj:  /run/media/box/KINGSTON/javafish/<name>/<name>-YYYYMMDD-HHMMSS.tar.gz
# Vybírá se VŽDY nejnovější archiv (podle času v názvu).
#
# Použití:
#   ./restore-trading.sh            # vše vč. ~/data a sloučení claude-projects
#   ./restore-trading.sh --dry-run  # jen ukaž, co by se dělalo

set -uo pipefail

SRC_ROOT="/run/media/box/KINGSTON/javafish"
DRY=0
[ "${1:-}" = "--dry-run" ] && DRY=1

# "label|cílový rodič (kam rozbalit)"  — archiv má v kořeni basename, takže
# rozbalením do rodiče vznikne přesně původní cesta.
ITEMS=(
  "fishlive|$HOME/git"
  "javafish|$HOME/git"
  "thirdparty|$HOME/git"
  "WFD-REPOSITORY|$HOME"
  "AOS-AUTO|$HOME"
  "data|$HOME"
  "claude-projects|$HOME/.claude"   # archiv má v kořeni projects/ → ~/.claude/projects
)

if [ ! -d "$SRC_ROOT" ]; then
  echo "✗ Záložní disk není připojen: $SRC_ROOT"
  echo "  Připoj KINGSTON a zkus znovu."
  exit 1
fi

echo "=== Obnova tradingu ← $SRC_ROOT ==="
[ "$DRY" = 1 ] && echo "    [DRY-RUN: nic se reálně nerozbalí]"
echo

restored=0; skipped=0; failed=0
for item in "${ITEMS[@]}"; do
  IFS='|' read -r name parent <<< "$item"
  srcdir="$SRC_ROOT/$name"

  # nejnovější archiv podle názvu (časové razítko se řadí lexikograficky)
  archive="$(ls -1 "$srcdir/${name}"-*.tar.gz 2>/dev/null | sort | tail -1)"
  if [ -z "$archive" ]; then
    echo "—  $name: žádný archiv v $srcdir, přeskakuji"
    skipped=$((skipped+1)); continue
  fi

  printf '»  %-16s ← %s\n' "$name" "$(basename "$archive")"
  printf '   cíl: %s/%s   (%s)\n' "$parent" "$(tar tzf "$archive" 2>/dev/null | head -1 | cut -d/ -f1)" "$(du -h "$archive" | cut -f1)"

  if [ "$DRY" = 1 ]; then
    continue
  fi

  mkdir -p "$parent"
  if tar xzf "$archive" -C "$parent"; then
    echo "   ✓ rozbaleno"
    restored=$((restored+1))
  else
    echo "   ✗ tar selhal"
    failed=$((failed+1))
  fi
done

echo
echo "==================== SOUHRN ===================="
echo "obnoveno: $restored · přeskočeno: $skipped · selhalo: $failed"
[ "$DRY" = 1 ] && echo "(dry-run — nic se nerozbalilo)"
[ "$DRY" = 1 ] || sync
echo "Hotovo."
