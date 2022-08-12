#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config pull
cd ~/org && git pull
cd ~/.password-store && pass git pull
cd ~/Pictures/wallpapers/public-wallpapers && pass git pull

