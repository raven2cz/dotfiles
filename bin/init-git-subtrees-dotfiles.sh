#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config subtree add --prefix .config/awesome git@github.com:raven2cz/awesomewm-config.git master --squash
config subtree add --prefix .config/polybar git@github.com:raven2cz/polybar-config.git main --squash
config subtree add --prefix .config/doom git@github.com:raven2cz/emacs.git main --squash
