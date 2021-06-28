#!/bin/bash

# Cleanup script for widgets

# Mpd

ps aux | grep "mpc idleloop player" | grep -v grep | awk '{print $2}' | xargs kill
