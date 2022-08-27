#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config pull --autostash
cd ~/org && git pull --autostash
cd ~/.password-store && pass git pull --autostash
cd ~/Pictures/wallpapers/public-wallpapers && git pull --autostash

