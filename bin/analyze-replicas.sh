#!/usr/bin/env bash
# analyze-rq.sh – Kolik replik se vejde do namespace podle ResourceQuoty
# Usage: ./analyze-rq.sh -n <namespace> -q <resourcequota> -c <CPU_per_pod> -m <Gi_per_pod>
# Example: ./analyze-rq.sh -n ftxt-robot-stable -q compute-resources -c 2 -m 4

set -euo pipefail

usage() {
  echo "Použití: $0 -n <namespace> -q <resourcequota> -c <CPU_na_pod> -m <Gi_na_pod>"
  exit 1
}

# --- CLI -----------------------------------------------------------------
NS=""; RQ=""; CPU_POD=""; MEM_POD_GI=""
while getopts "n:q:c:m:h" opt; do
  case $opt in
    n) NS=$OPTARG ;;
    q) RQ=$OPTARG ;;
    c) CPU_POD=$OPTARG ;;
    m) MEM_POD_GI=$OPTARG ;;
    h|*) usage ;;
  esac
done
[[ -z $NS || -z $RQ || -z $CPU_POD || -z $MEM_POD_GI ]] && usage

# --- převody -------------------------------------------------------------
# CPU string -> milicory (int)
cpu_to_m() {
  local v=$1
  if [[ $v == *m ]]; then
    echo "${v%m}"
  else
    # dovolí i desetinnou tečku
    awk "BEGIN{printf \"%d\", $v*1000}"
  fi
}

# Memory string -> bajty (int)
mem_to_b() {
  local v=$1
  case $v in
    *Ki) awk "BEGIN{printf \"%.0f\", ${v%Ki}*1024}" ;;
    *Mi) awk "BEGIN{printf \"%.0f\", ${v%Mi}*1024*1024}" ;;
    *Gi) awk "BEGIN{printf \"%.0f\", ${v%Gi}*1024*1024*1024}" ;;
    *)   echo "$v" ;;  # už jsou bajty
  esac
}

# --- načteme hodnoty z ResourceQuoty ------------------------------------
read -r used_cpu raw_hard_cpu used_mem raw_hard_mem used_pods hard_pods <<<"$(
  kubectl -n "$NS" get resourcequota "$RQ" -o \
    jsonpath='{.status.used.requests\.cpu} {.status.hard.requests\.cpu} {.status.used.requests\.memory} {.status.hard.requests\.memory} {.status.used.pods} {.status.hard.pods}'
)"

used_cpu_m=$(cpu_to_m "$used_cpu")
hard_cpu_m=$(cpu_to_m "$raw_hard_cpu")
free_cpu_m=$(( hard_cpu_m - used_cpu_m ))

used_mem_b=$(mem_to_b "$used_mem")
hard_mem_b=$(mem_to_b "$raw_hard_mem")
free_mem_b=$(( hard_mem_b - used_mem_b ))

free_pods=$(( hard_pods - used_pods ))

# --- požadavky jedné repliky --------------------------------------------
cpu_pod_m=$(( CPU_POD * 1000 ))
mem_pod_b=$(( MEM_POD_GI * 1024 * 1024 * 1024 ))

# --- max replik podle jednotlivých zdrojů --------------------------------
max_cpu=$(( free_cpu_m / cpu_pod_m ))
max_mem=$(awk "BEGIN{print int($free_mem_b / $mem_pod_b)}")

max=$free_pods
[[ $max_cpu -lt $max ]] && max=$max_cpu
[[ $max_mem -lt $max ]] && max=$max_mem

# --- výstup --------------------------------------------------------------
bytes_to_gi() { awk "BEGIN{printf \"%.2f\", $1/1073741824}"; }

printf "\nNamespace: %s  |  ResourceQuota: %s\n" "$NS" "$RQ"
printf "Volné podle RQ:  %s mCPU  |  %s Gi  |  %s Podů\n" \
       "$free_cpu_m" "$(bytes_to_gi "$free_mem_b")" "$free_pods"
printf "Jedna replika:   %s CPU  |  %s Gi RAM\n" "$CPU_POD" "$MEM_POD_GI"
printf "Bezpečné maximum nových replik:  %s\n\n" "$max"
