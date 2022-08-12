#!/bin/bash

function run {
  if ! pgrep $1 ;
  then
    $@&
  fi
}

#Set your native resolution IF it does not exist in xrandr
#More info in the script
#run $HOME/.config/qtile/scripts/set-screen-resolution-in-virtualbox.sh

#Find out your monitor name with xrandr or arandr (save and you get this line)
#xrandr --output VGA-1 --primary --mode 1360x768 --pos 0x0 --rotate normal
#xrandr --output DP2 --primary --mode 1920x1080 --rate 60.00 --output LVDS1 --off &
#xrandr --output LVDS1 --mode 1366x768 --output DP3 --mode 1920x1080 --right-of LVDS1
#xrandr --output HDMI2 --mode 1920x1080 --pos 1920x0 --rotate normal --output HDMI1 --primary --mode 1920x1080 --pos 0x0 --rotate normal --output VIRTUAL1 --off
#autorandr horizontal

#change your keyboard if you need it
#setxkbmap -layout be

#Some ways to set your wallpaper besides variety or nitrogen
#start the conky to learn the shortcuts
run ~/.config/conky/start_conky ~/.config/conky/MX-CoreBlue/conkyrc2core &

#start sxhkd to replace Qtile native key-bindings
run sxhkd -c ~/.config/qtile/sxhkd/sxhkdrc &

#starting utility applications at boot time
#run variety &
run nm-applet &
run pamac-tray &
#run xfce4-power-manager &
numlockx on &
#blueberry-tray &
run alttab -mk Control_L -pk h -nk l -fg "#d58681" -bg "#4a4a4a" -frame "#eb564d" -t 128x150 -i 127x64 &
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
/usr/lib/xfce4/notifyd/xfce4-notifyd &

#starting user applications at boot time
run volumeicon &
#run discord &
synology-drive start &
run copyq &
run xautolock -time 60 -locker blurlock -notify 30 -notifier "notify-send -u critical -t 10000 -- 'LOCKING screen in 30 seconds'" &
run clipit &
run clipmenud &
#run conky -c ~/.config/conky
run ~/.config/conky/start_conky ~/.config/conky/MX-CoreBlue/conkyrc2core &
run remmina -i &
run pa-applet &
run nitrogen --restore &
#run caffeine -a &
#run vivaldi-stable &
#run firefox &
#run thunar &
#run dropbox &
#run insync start &
#run spotify &
#run atom &
#run telegram-desktop &
picom --config $HOME/.config/qtile/scripts/picom.conf &
#$HOME/.config/qtile/scripts/picom_jonaburg --config $HOME/.config/qtile/scripts/picom-jonaburg.conf &
