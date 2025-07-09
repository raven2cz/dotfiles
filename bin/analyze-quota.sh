#!/usr/bin/env bash
# analyze-quota.sh – kolik replik se ještě vejde do namespace (opraveno)

set -euo pipefail

usage() {
  echo "Použití: $0 -n <namespace> -q <resourcequota> -c <CPU_na_pod> -m <Gi_na_pod>"
  exit 1
}

# --- CLI ---------------------------------------------------------
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

# --- helper ▼: převod CPU string -> milicory (int) ----------------------
cpu_to_m() {                          # "250m" -> 250  |  "4" -> 4000  |  "1.2e+02" -> 120000
  local v="$1"
  if [[ $v == *m ]]; then
    echo "${v%m}"
  else
    # awk si poradí i s exponenciálním zápisem
    awk -v val="$v" 'BEGIN{printf "%.0f", val*1000}'
  fi
}

# --- helper: převod paměťové hodnoty na Gi -----------------------------
to_gi() {
  local raw=$1
  case $raw in
    *Ki) awk "BEGIN{printf \"%.6f\", ${raw%Ki}/1048576}" ;;
    *Mi) awk "BEGIN{printf \"%.6f\", ${raw%Mi}/1024}" ;;
    *Gi) echo "${raw%Gi}" ;;
      *) awk "BEGIN{printf \"%.6f\", $raw/1073741824}" ;;  # bytes
  esac
}

# --- data z ResourceQuoty ---------------------------------------------
used_cpu_raw=$(kubectl -n "$NS" get resourcequota "$RQ" \
               -o=jsonpath='{.status.used.requests\.cpu}')
hard_cpu_raw=$(kubectl -n "$NS" get resourcequota "$RQ" \
               -o=jsonpath='{.status.hard.requests\.cpu}')

used_cpu_m=$(cpu_to_m "$used_cpu_raw")
hard_cpu_m=$(cpu_to_m "$hard_cpu_raw")
free_cpu_m=$(( hard_cpu_m - used_cpu_m ))

# pro tisk (cores s desetinným místem)
free_cpu_cores=$(awk "BEGIN{printf \"%.2f\", $free_cpu_m/1000}")

used_mem_raw=$(kubectl -n "$NS" get resourcequota "$RQ" \
               -o=jsonpath='{.status.used.requests\.memory}')
hard_mem_raw=$(kubectl -n "$NS" get resourcequota "$RQ" \
               -o=jsonpath='{.status.hard.requests\.memory}')

used_mem_gi=$(to_gi "$used_mem_raw")
hard_mem_gi=$(to_gi "$hard_mem_raw")
free_mem_gi=$(awk "BEGIN{printf \"%.2f\", $hard_mem_gi - $used_mem_gi}")

used_pods=$(kubectl -n "$NS" get resourcequota "$RQ" -o=jsonpath='{.status.used.pods}')
hard_pods=$(kubectl -n "$NS" get resourcequota "$RQ" -o=jsonpath='{.status.hard.pods}')
free_pods=$(( hard_pods - used_pods ))

# --- kolik replik se vejde ---------------------------------------------
cpu_pod_m=$(( CPU_POD * 1000 ))

max_cpu_pods=$(( free_cpu_m / cpu_pod_m ))
max_mem_pods=$(awk "BEGIN{print int($free_mem_gi / $MEM_POD_GI)}")

max_possible=$free_pods
[[ $max_cpu_pods -lt $max_possible ]] && max_possible=$max_cpu_pods
[[ $max_mem_pods -lt $max_possible ]] && max_possible=$max_mem_pods

# --- výstup ------------------------------------------------------------
cat <<EOF
Namespace:          $NS
ResourceQuota:      $RQ

Aktuální využití / limit:
  CPU requests:     $used_cpu_raw / $hard_cpu_raw cores   (volno: $free_cpu_cores)
  Memory requests:  $(printf "%.2f" $used_mem_gi) / $hard_mem_gi Gi (volno: $free_mem_gi Gi)
  Pods:             $used_pods / $hard_pods       (volno: $free_pods)

Požadavky jedné repliky:
  CPU:              $CPU_POD cores
  Memory:           $MEM_POD_GI Gi

Maximální počet nových replik, který se ještě vejde:
  Podle CPU:        $max_cpu_pods
  Podle paměti:     $max_mem_pods
  Podle limitu Podů:$free_pods
-------------------------------------------------------
>>> Bezpečné maximum pro scale-up: $max_possible replik
EOF
