#!/usr/bin/env bash

function run {
  if ! pgrep -f $1 ;
  then
    $@&
  fi
}

if xrandr | grep -q 'HDMI1 connected' ; then
    MONITOR=HDMI1
elif xrandr | grep -q 'DP1 connected' ; then
    MONITOR=DP1
fi
xrandr --output eDP1 --off --output $MONITOR --primary --dpi 120 --mode 3840x2160 --pos 0x0 --rotate normal 

run /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
run /usr/lib/kactivitymanagerd
run /usr/bin/kglobalaccel5
run nm-applet
run pamac-tray
if ! pgrep -f cloud-drive-ui; then synology-drive start; fi
run parcellite
run clipmenud
run volctl
run /usr/bin/emacs --daemon
run ~/.config/conky/start_conky ~/.config/conky/MX-CoreBlue/conkyrc2core 
run remmina -i
run picom --experimental-backends --config $HOME/.config/picom/picom.conf
