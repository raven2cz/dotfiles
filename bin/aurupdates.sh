#!/usr/bin/env bash
echo "$(checkupdates-with-aur | awk 'END { print (NR==0 ? "Up to date" : NR " pkg" (NR>1?"s":"") ) }')"
