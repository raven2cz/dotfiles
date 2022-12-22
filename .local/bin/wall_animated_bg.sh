#!/bin/env bash
#
# Animated wallpaper script.
# Credits: https://www.youtube.com/channel/UCngn7SVujlvskHRvRKc1cTw
# Dependencies: rofi, mpv, xwinwrap, exa
#
# Find xwinwrap process id
kxwp=$(pidof xwinwrap)
# Kills it
kill $kxwp &
# Path to animated wallpaper video files
WALLPAPERS=$HOME/Videos/livewalls/
# cd to the video path
cd $WALLPAPERS
# Use rofi to present a list of animated wallpaper files. The selected file will be used as the animated wallpaper.
# Ensure to set correct resolution in xwinwrap arguments.
selected=$(exa $WALLPAPERS|rofi -dmenu -i -p "Animated Wallpaper: ")&&xwinwrap -g 3840x2160+0+0 -ov -ni -- mpv --fullscreen --no-stop-screensaver --loop --no-audio --no-border --no-osc --no-osd-bar --no-input-default-bindings -wid WID "$selected" > /dev/null 2>&1 &

