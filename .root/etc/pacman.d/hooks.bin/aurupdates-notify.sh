#!/bin/bash
uid="$(find /run/user/ -maxdepth 1 -mindepth 1 -type d | awk -F/ '{print $NF}')"
user="$(grep $uid /etc/passwd  | sed 's/:.*//')" 
display="$(DISPLAY=$(echo "$DISPLAY"))"
xdg_rd="$(XDG_RUNTIME_DIR=/run/user/$uid)"
xauth="$(XAUTHORITY=/home/$user/.Xauthority)"
dbus_sba="$(DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$uid/bus)"

export XAUTHORITY=/home/$user/.Xauthority
export DISPLAY=$(echo "$DISPLAY")
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$uid/bus"

su $user -c "$display $xauth $dbus_sba $xdg_rd notify-send 'Arch System is up-to-date!' && aurupdates-notify.sh"
