#!/bin/bash

# Spustit Obsidian
obsidian &

# ID procesu posledního pozadového úkolu
PID=$!

# Počkáme, až se objeví proces Obsidianu v seznamu procesů
while ! pgrep -x "obsidian" > /dev/null; do
    sleep 1
done

# Počkáme dodatečné 2 sekundy na zajištění, že je aplikace plně načtena
sleep 2

# Nastavení výchozího webového prohlížeče
xdg-settings set default-web-browser firefoxdeveloperedition.desktop

