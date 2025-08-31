#!/usr/bin/env bash
# yt-one.sh — bezpečné stahování JEDNOTLIVÝCH videí pomocí yt-dlp
# - brání nechtěnému stahování celých playlistů (--no-playlist)
# - umí URL jako argument, seznam přes -l FILE i přes STDIN (pipe)
# - přehledné logy s časem, souhrn na konci, návratové kódy
# - progres stahování (procenta, rychlost, ETA) z yt-dlp

set -Eeuo pipefail

VERSION="1.0.0"

# ---------- Vzhled logů ----------
COLOR=true
if [[ ! -t 1 ]]; then COLOR=false; fi
if ! command -v tput >/dev/null 2>&1; then COLOR=false; fi

if $COLOR; then
  C_BLUE="$(tput setaf 4)"; C_GREEN="$(tput setaf 2)"
  C_YELLOW="$(tput setaf 3)"; C_RED="$(tput setaf 1)"
  C_DIM="$(tput dim)"; C_RESET="$(tput sgr0)"
else
  C_BLUE=""; C_GREEN=""; C_YELLOW=""; C_RED=""; C_DIM=""; C_RESET=""
fi

ts() { date +"%Y-%m-%d %H:%M:%S"; }

log()   { printf "%s %s[INFO]%s  %s\n"  "$(ts)" "$C_BLUE"  "$C_RESET" "$*"; }
ok()    { printf "%s %s[OK]%s    %s\n"   "$(ts)" "$C_GREEN" "$C_RESET" "$*"; }
warn()  { printf "%s %s[WARN]%s  %s\n"  "$(ts)" "$C_YELLOW" "$C_RESET" "$*"; }
err()   { printf "%s %s[ERR]%s   %s\n"  "$(ts)" "$C_RED"    "$C_RESET" "$*" >&2; }

# ---------- Nápověda ----------
usage() {
  cat <<'EOF'
Použití:
  yt-one.sh URL [URL ...]          Stáhne uvedené URL (jednotlivá videa).
  yt-one.sh -l SEZNAM.txt          Načte seznam URL ze souboru (jedno na řádek).
  cat SEZNAM.txt | yt-one.sh       Čte URL ze stdin (pipe).

Volby:
  -d, --dir DIR         Cílová složka (výchozí: ~/Downloads)
  -l, --list FILE       Soubor se seznamem URL (jedno URL na řádek)
  -a, --archive FILE    Soubor “download archive” (chrání před duplikáty)
  -r, --retries N       Počet retry (výchozí: 10)
  --allow-playlist      Povolí stahovat playlisty (jinak přísně odmítá)
  -n, --dry-run         Pouze ukáže, co by se stahovalo (bez stahování)
  -q, --quiet           Méně výstupu (yt-dlp quiet, ale nechává chyby)
  -h, --help            Tato nápověda
  -v, --version         Verze skriptu

Poznámky:
- Výchozí chování je BEZPEČNÉ: vždy --no-playlist. I když URL obsahuje
  parametry ?list=..., stáhne se pouze JEDNO video. Čisté playlisty se odmítnou.
- Progrese: procenta, stažené/total, rychlost a ETA z yt-dlp.
- Při dávce skript pokračuje i po chybě a na konci vypíše souhrn.

Příklady:
  yt-one.sh "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  yt-one.sh -d ~/Videa -l urls.txt
  rg '^https' notes.md | yt-one.sh --archive done.txt
EOF
}

# ---------- Parsování argumentů ----------
OUT_DIR="~/Downloads"
LIST_FILE=""
ARCHIVE_FILE=""
RETRIES=10
ALLOW_PLAYLIST=false
DRY_RUN=false
QUIET=false

ARGS=()
while (( "$#" )); do
  case "${1:-}" in
    -d|--dir) OUT_DIR="${2:?}"; shift 2 ;;
    -l|--list) LIST_FILE="${2:?}"; shift 2 ;;
    -a|--archive) ARCHIVE_FILE="${2:?}"; shift 2 ;;
    -r|--retries) RETRIES="${2:?}"; shift 2 ;;
    --allow-playlist) ALLOW_PLAYLIST=true; shift ;;
    -n|--dry-run) DRY_RUN=true; shift ;;
    -q|--quiet) QUIET=true; shift ;;
    -h|--help) usage; exit 0 ;;
    -v|--version) echo "$VERSION"; exit 0 ;;
    --) shift; break ;;
    -*)
      err "Neznámá volba: $1"
      usage; exit 2
      ;;
    *) ARGS+=("$1"); shift ;;
  esac
done

# Přidat případné zbylé poziční argumenty
if (( "$#" )); then
  ARGS+=("$@")
fi

# ---------- Kontroly ----------
if ! command -v yt-dlp >/dev/null 2>&1; then
  err "yt-dlp není nainstalováno. Nainstaluj např.: pipx install yt-dlp (nebo přes balíček distribuce)."
  exit 127
fi

mkdir -p "$OUT_DIR"

LOG_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/yt-one"
mkdir -p "$LOG_DIR"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/run-$RUN_ID.log"

touch "$LOG_FILE" || { err "Nelze vytvořit log: $LOG_FILE"; exit 1; }

# ---------- Načtení URL (args, list, stdin) ----------
URLS=()

# 1) Ze souboru
if [[ -n "$LIST_FILE" ]]; then
  if [[ ! -f "$LIST_FILE" ]]; then
    err "Soubor neexistuje: $LIST_FILE"
    exit 1
  fi
  while IFS= read -r line || [[ -n "$line" ]]; do
    # odstraň komentáře a prázdné řádky
    line="${line%%#*}"
    line="$(echo -n "$line" | tr -d '\r' | xargs || true)"
    [[ -z "$line" ]] && continue
    URLS+=("$line")
  done < "$LIST_FILE"
fi

# 2) Z pozičních argumentů
if ((${#ARGS[@]} > 0)); then
  URLS+=("${ARGS[@]}")
fi

# 3) Ze stdin (pipe), pokud dosud žádné URL nejsou a stdin není terminál
if [[ ${#URLS[@]} -eq 0 && ! -t 0 ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo -n "$line" | tr -d '\r' | xargs || true)"
    [[ -z "$line" ]] && continue
    URLS+=("$line")
  done
fi

if [[ ${#URLS[@]} -eq 0 ]]; then
  err "Nezadána žádná URL. Použij -l FILE, pipe nebo URL jako argument."
  usage
  exit 2
fi

# ---------- Příprava společných voleb pro yt-dlp ----------
YT_OPTS=(
  --newline
  --progress
  --progress-template "%(progress._percent_str)s  %(progress._downloaded_bytes_str)s/%(progress._total_bytes_str)s  %(progress._speed_str)s  ETA %(progress._eta_str)s"
  --retries "$RETRIES"
  --fragment-retries 20
  -o "$OUT_DIR/%(title).200B [%(id)s].%(ext)s"
)

# bezpečí proti playlistům
if ! $ALLOW_PLAYLIST; then
  YT_OPTS+=( --no-playlist )
fi

# archiv duplikátů
if [[ -n "$ARCHIVE_FILE" ]]; then
  mkdir -p "$(dirname -- "$ARCHIVE_FILE")"
  YT_OPTS+=( --download-archive "$ARCHIVE_FILE" )
fi

# dry-run
$DRY_RUN && YT_OPTS+=( --skip-download -O "%(title)s [%(id)s].%(ext)s" )

# quiet mód
$QUIET && YT_OPTS+=( -q )

# ---------- Funkce na kontrolu playlistu ----------
is_pure_playlist() {
  # Vrátí 0 (true), pokud je URL playlist/kanál (bez konkrétního videa)
  local url="$1"
  # rychlá heuristika:
  if [[ "$url" =~ (youtube\.com/playlist\?list=|list=PL|list=OL|list=LL|\/shorts\/$|\/@[^/]+/?$|\/c\/|\/channel\/|\/@[^/]+/videos) ]]; then
    return 0
  fi
  return 1
}

# ---------- Stahování ----------
TOTAL=${#URLS[@]}
SUCCESS=0
FAIL=0
FAILED_URLS=()

log "Start běhu (verze $VERSION). Cíl: $OUT_DIR"
log "Počet položek: $TOTAL"
log "Log soubor: $LOG_FILE"
$ALLOW_PLAYLIST || log "Playlisty jsou ZAKÁZANÉ ( --no-playlist )."

SECONDS=0

for i in "${!URLS[@]}"; do
  idx=$((i+1))
  URL="${URLS[$i]}"

  if ! $ALLOW_PLAYLIST && is_pure_playlist "$URL"; then
    warn "#$idx/$TOTAL: Zdá se, že jde o PLAYLIST/kanál. Přeskakuji (povolíš pomocí --allow-playlist):"
    warn "             $URL"
    FAIL=$((FAIL+1))
    FAILED_URLS+=("$URL")
    continue
  fi

  log "#$idx/$TOTAL: Stahuji: $URL"
  # Spustíme yt-dlp a kopírujeme výstup do logu i na obrazovku.
  # Zachytíme návratový kód přes PIPESTATUS.
  set +e
  yt-dlp "${YT_OPTS[@]}" "$URL" 2>&1 | tee -a "$LOG_FILE"
  rc=${PIPESTATUS[0]}
  set -e

  if [[ $rc -eq 0 ]]; then
    ok  "#$idx/$TOTAL: Hotovo."
    SUCCESS=$((SUCCESS+1))
  else
    err "#$idx/$TOTAL: Chyba (rc=$rc)."
    FAIL=$((FAIL+1))
    FAILED_URLS+=("$URL")
  fi
done

DUR="$SECONDS"
log "----------------------------------------"
log "Souhrn: OK=$SUCCESS  FAIL=$FAIL  CELKEM=$TOTAL  (čas ${DUR}s)"
if (( FAIL > 0 )); then
  warn "Neúspěšné položky:"
  for u in "${FAILED_URLS[@]}"; do
    printf "  - %s\n" "$u"
  done
fi
ok "Konec. Log: $LOG_FILE"

