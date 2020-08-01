#!/bin/bash
#  ____ _____
# |  _ \_   _|  Derek Taylor (DistroTube)
# | | | || |    http://www.youtube.com/c/DistroTube
# | |_| || |    http://www.gitlab.com/dwt1/
# |____/ |_|
#
# Dmenu script for editing some of my more frequently edited config files.


declare options=("alacritty
awesome
bash
broot
bspwm
doom.d/config.el
doom.d/init.el
dunst
dwm
emacs.d/init.el
herbstluftwm
i3
neovim
picom
polybar
qtile
quickmarks
qutebrowser
spectrwm
st
stumpwm
surf
sxhkd
tabbed
termite
vifm
vim
vimb
xmobar
xmonad
xresources
zsh
quit")

choice=$(echo -e "${options[@]}" | dmenu -i -p 'Edit config file: ')

case "$choice" in
	quit)
		echo "Program terminated." && exit 1
	;;
	alacritty)
		choice="$HOME/.config/alacritty/alacritty.yml"
	;;
	awesome)
		choice="$HOME/.config/awesome/rc.lua"
	;;
	bash)
		choice="$HOME/.bashrc"
	;;
	broot)
		choice="$HOME/.config/broot/conf.toml"
	;;
	bspwm)
		choice="$HOME/.config/bspwm/bspwmrc"
	;;
    doom.d/config.el)
		choice="$HOME/.doom.d/config.el"
	;;
    doom.d/init.el)
		choice="$HOME/.doom.d/init.el"
	;;
	dunst)
		choice="$HOME/.config/dunst/dunstrc"
	;;
	dwm)
		choice="$HOME/dwm-distrotube/config.h"
	;;
	emacs.d/init.el)
		choice="$HOME/.emacs.d/init.el"
	;;
	herbstluftwm)
		choice="$HOME/.config/herbstluftwm/autostart"
	;;
	i3)
		choice="$HOME/.i3/config"
	;;
	neovim)
		choice="$HOME/.config/nvim/init.vim"
	;;
	picom)
		choice="$HOME/.config/picom/picom.conf"
	;;
	polybar)
		choice="$HOME/.config/polybar/config"
	;;
	qtile)
		choice="$HOME/.config/qtile/config.py"
	;;
	quickmarks)
		choice="$HOME/.config/qutebrowser/quickmarks"
	;;
	qutebrowser)
		choice="$HOME/.config/qutebrowser/autoconfig.yml"
	;;
	spectrwm)
		choice="$HOME/.spectrwm.conf"
	;;
	st)
		choice="$HOME/st-distrotube/config.h"
	;;
	stumpwm)
		choice="$HOME/.config/stumpwm/config"
	;;
	surf)
		choice="$HOME/surf-distrotube/config.h"
	;;
	sxhkd)
		choice="$HOME/.config/sxhkd/sxhkdrc"
	;;
	tabbed)
		choice="$HOME/tabbed-distrotube/config.h"
	;;
	termite)
		choice="$HOME/.config/termite/config"
	;;
	vifm)
		choice="$HOME/.config/vifm/vifmrc"
	;;
	vim)
		choice="$HOME/.vimrc"
	;;
	vimb)
		choice="$HOME/.config/vimb/config"
	;;
	xmobar)
		choice="$HOME/.config/xmobar/xmobarrc2"
	;;
	xmonad)
		choice="$HOME/.xmonad/xmonad.hs"
	;;
	xresources)
		choice="$HOME/.Xresources"
	;;
	zsh)
		choice="$HOME/.zshrc"
	;;
	*)
		exit 1
	;;
esac
emacsclient -c -a emacs "$choice"
