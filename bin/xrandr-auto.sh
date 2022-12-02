#!/bin/bash

if xrandr | grep -q 'HDMI-1 connected' ; then
    MONITOR=HDMI-1
    xrandr --output eDP-1 --off --output $MONITOR --primary --dpi 120 --mode 3840x2160 --pos 0x0 --rotate normal 
elif xrandr | grep -q 'DP-1 connected' ; then
    MONITOR=DP-1
    xrandr --output eDP-1 --off --output $MONITOR --primary --dpi 120 --mode 3840x2160 --pos 0x0 --rotate normal 
else
    xrandr --output eDP-1 --dpi 100 --rotate normal 
fi
