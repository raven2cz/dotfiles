#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config subtree add --prefix .config/awesome git@github.com:raven2cz/awesomewm-config.git master --squash
config subtree add --prefix .config/polybar git@github.com:raven2cz/polybar-config.git main --squash
config subtree add --prefix .config/doom git@github.com:raven2cz/emacs.git main --squash
config subtree add --prefix .config/qtile git@github.com:raven2cz/qtile-config.git main --squash
config subtree add --prefix .config/i3 git@github.com:raven2cz/i3-config.git main --squash
config subtree add --prefix .config/xfce4 git@github.com:raven2cz/xfce-config.git main --squash
config subtree add --prefix .config/openbox git@github.com:raven2cz/openbox-config.git main --squash
config subtree add --prefix .config/nvim git@github.com:raven2cz/neovim.git main --squash
config subtree add --prefix .config/rofi git@github.com:raven2cz/rofi-themes.git main --squash
