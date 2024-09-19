#!/bin/bash

[[ -z "$LAPTOP" ]] && exit

dp1_connected=$(xrandr --listactivemonitors | grep ' DP-1')
hdmi1_connected=$(xrandr --listactivemonitors | grep ' HDMI-1')

if [[ $dp1_connected != "" ]] ; then
    xrandr --output eDP-1 --off --output HDMI-1 --primary --mode 3840x2160 --pos 2160x0 --rotate normal --output DP-1 --mode 3840x2160 --pos 0x0 --rotate left --output HDMI-2 --off --output DP-2 --off --output HDMI-3 --off
elif [[ $hdmi1_connected != "" ]] ; then
#    xrandr --output eDP-1 --off --output HDMI-1 --primary --mode 3840x2160 --pos 0x0 --rotate normal
    xrandr --output HDMI-1 --mode 3840x2160 --pos 1920x0 --primary --output eDP-1 --mode 1920x1080 --pos 0x1080 --output DP-1 --off --output HDMI-2 --off --output DP-2 --off --output HDMI-3 --off
else
    xrandr --output eDP-1 --dpi 100 --rotate normal 
fi
