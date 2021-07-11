#!/bin/sh

#
# Returns a list of the harddisks, in a conky-style configuration.
# (C) 2010 Semplice Team. All rights reserved.
# This file is released under the terms of the GNU GPL license, version 3 or later.
#
# fehlix: simplified mount checks


# For now only for /home

#if mountpoint -q /home; then
#echo '${voffset -12}/home:'
#echo '${voffset 4}${fs_used /home} of ${fs_size /home} ${alignr}${fs_bar 8,90 /home}'
#echo
#fi

awk  '$2 ~ /[/]media/ { print $2 }' /proc/mounts | while read media; do
echo '${voffset -8}${color}'"$media":
echo '${voffset 4}${fs_used' "$media"'} of ${fs_size' "$media"'} ${alignr}${color #FFF600}${fs_bar 8,90' "$media}"
echo ''
done

