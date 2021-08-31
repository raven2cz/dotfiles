#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config subtree pull --prefix .config/awesome git@github.com:raven2cz/awesomewm-config.git master --squash
config subtree pull --prefix .config/polybar git@github.com:raven2cz/polybar-config.git main --squash
config subtree pull --prefix .config/doom git@github.com:raven2cz/emacs.git main --squash
config subtree pull --prefix .config/qtile git@github.com:raven2cz/qtile-config.git main --squash
config subtree pull --prefix .config/i3 git@github.com:raven2cz/i3-config.git main --squash
config subtree pull --prefix .config/xfce4 git@github.com:raven2cz/xfce-config.git main --squash

