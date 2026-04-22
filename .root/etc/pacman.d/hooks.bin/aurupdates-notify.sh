#!/bin/bash
set -eu

# Find a user session that has BOTH a live Wayland socket and a user D-Bus
# bus socket. Requiring both avoids stale/nested wayland sockets and the
# race where the compositor is up but dbus-broker is not.
runtime_dir=""
wayland_display=""
for rd in /run/user/[0-9]*; do
    [ -d "$rd" ] || continue
    [ -S "$rd/bus" ] || continue
    for sock in "$rd"/wayland-*; do
        [ -S "$sock" ] || continue
        case "$sock" in *.lock) continue ;; esac
        runtime_dir="$rd"
        wayland_display="${sock##*/}"
        break 2
    done
done

if [ -z "$runtime_dir" ]; then
    echo "aurupdates-notify: no active Wayland+DBus session found" >&2
    exit 0
fi

uid="${runtime_dir##*/}"
pwent="$(getent passwd "$uid" || true)"
if [ -z "$pwent" ]; then
    echo "aurupdates-notify: no passwd entry for uid $uid" >&2
    exit 0
fi
user="$(printf '%s' "$pwent" | cut -d: -f1)"
home="$(printf '%s' "$pwent" | cut -d: -f6)"

run_as_user() {
    local label="$1"; shift
    local rc=0
    runuser -u "$user" -- env \
        XDG_RUNTIME_DIR="$runtime_dir" \
        DBUS_SESSION_BUS_ADDRESS="unix:path=$runtime_dir/bus" \
        WAYLAND_DISPLAY="$wayland_display" \
        "$@" || rc=$?
    if [ "$rc" -ne 0 ]; then
        echo "aurupdates-notify: $label failed (exit $rc)" >&2
    fi
}

run_as_user notify 'notify-send' 'Arch System is up-to-date!'
if [ -x "$home/bin/aurupdates-notify.sh" ]; then
    run_as_user aur-hook "$home/bin/aurupdates-notify.sh"
fi

exit 0
