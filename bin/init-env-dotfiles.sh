#!/bin/bash
git clone --bare git@github.com:raven2cz/dotfiles.git $HOME/.dotfiles
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}
config checkout --force
config config status.showUntrackedFiles no
