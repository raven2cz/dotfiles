#!/bin/sh
eval $(/usr/bin/gnome-keyring-daemon --start --components=pkcs11,secrets,ssh)
export SSH_AUTH_SOCK
numlockx &
#setxkbmap -layout "us,cz" -option "grp:alt_shift_toggle" -variant ",qwerty" &

configure_dpi
xrdb -merge ~/.Xresources

# X11 environment variables exports
#export QT_STYLE_OVERRIDE=kvantum
export QT_QPA_PLATFORMTHEME=qt6ct
export DESKTOP_SESSION=plasma
#export DESKTOP_SESSION=gnome
export XDG_CURRENT_DESKTOP=kde
#export XDG_CURRENT_DESKTOP=GNOME
export XDG_CONFIG_HOME=$HOME/.config
export XDG_CACHE_HOME=$HOME/.cache
export EDITOR=lvim
export JAVA_HOME=/usr/lib/jvm/default 

# clipmenu rofi support
export CM_LAUNCHER=rofi
export CM_HISTLENGTH=30
export CM_DIR=~/.config/clipmenu

# Here AwesomeWM is kept as default
session=${1:-awesome}

case $session in
    i3|i3wm)
        exec i3
        ;;
    awesome)
        exec awesome
        ;;
    kde)
        export XDG_CURRENT_DESKTOP=KDE
        exec startplasma-x11
        ;;
    kde-wayland)
        export XDG_SESSION_TYPE=wayland
        exec startplasma-wayland
        ;;
    gnome)
        export XDG_CURRENT_DESKTOP=GNOME
        export DESKTOP_SESSION=gnome
        exec gnome-session
        ;;
    qtile)
        export XDG_SESSION_TYPE=wayland
        exec qtile start -b wayland
        ;;
    bspwm)
        exec bspwm
        ;;
    dwm)
        exec dwm
        ;;
    herbstluftwm)
        exec herbstluftwm
        ;;
    xfce|xfce4)
        exec startxfce4
        ;;
    openbox)
        export XDG_SESSION_TYPE=x11
        exec openbox-session
        ;;
    hyprland)
        export WLR_NO_HARDWARE_CURSORS=1
        export LIBVA_DRIVER_NAME=nvidia
        export GBM_BACKEND=nvidia-drm
        export __GLX_VENDOR_LIBRARY_NAME=nvidia
        export __GL_VRR_ALLOWED=1 
        exec dbus-run-session hyprland
        ;; 
# No known session, try to run it as command
    *)
        exec $1
        ;;
esac
