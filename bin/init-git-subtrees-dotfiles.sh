#!/bin/bash
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

config subtree add --prefix .config/awesome git@github.com:raven2cz/awesomewm-config.git master --squash