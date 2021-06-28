#!/bin/sh

curl -O https://raw.githubusercontent.com/colinta/zenburn/master/zenburn.tmTheme
apm init --theme ~/.atom/packages/zenburn --convert zenburn.tmTheme
