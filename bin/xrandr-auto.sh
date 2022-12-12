#!/bin/bash

[[ -z "$LAPTOP" ]] && exit

dp1_connected=$(xrandr --listactivemonitors | grep ' DP-1')
hdmi1_connected=$(xrandr --listactivemonitors | grep ' HDMI-1')

if [[ $dp1_connected != "" ]] ; then
    MONITOR=DP-1
    xrandr --output eDP-1 --off --output $MONITOR --primary --dpi 120 --mode 3840x2160 --pos 0x0 --rotate normal 
elif [[ $hdmi1_connected != "" ]] ; then
    MONITOR=HDMI-1
    xrandr --output eDP-1 --off --output $MONITOR --primary --dpi 120 --mode 3840x2160 --pos 0x0 --rotate normal 
else
    xrandr --output eDP-1 --dpi 100 --rotate normal 
fi
