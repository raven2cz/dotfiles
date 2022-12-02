#!/bin/bash
git clone --branch dotfiles-boxszn --bare git@github.com:raven2cz/dotfiles.git $HOME/.dotfiles
function config {
   /usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}
#mkdir -p .config-backup
#config checkout
#if [ $? = 0 ]; then
# echo "Checked out config.";
#  else
#    echo "Backing up pre-existing dotfiles.";
#    config checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} %HOME/bin/mv.sh {} .config-backup/{}
#fi;
config checkout --force
config config status.showUntrackedFiles no
