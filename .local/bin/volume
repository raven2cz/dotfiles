#!/bin/bash 

vol="$(amixer get Master | tail -n1 | sed -r 's/.*\[(.*)%\].*/\1/')"
echo "${vol}% "
