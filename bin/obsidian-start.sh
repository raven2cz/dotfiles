#!/bin/bash

# This script checks if Obsidian is already running to avoid starting multiple instances.
# If not running, it launches Obsidian, waits for it to fully load, and then sets the default web browser back to Firefox Developer Edition.
# This is necessary because Obsidian has a bug that sets itself as the default browser on launch.

# Check if Obsidian (electron) is already running using a specific path identification to avoid confusion with other electron applications
if pgrep -f "/usr/lib/obsidian" > /dev/null; then    
    echo "Obsidian is already running."
else
    # Start Obsidian if not running
    obsidian &
    
    # Get the process ID of the last background job
    PID=$!

    # Wait until Obsidian appears in the process list
    while ! pgrep -x "obsidian" > /dev/null; do
        sleep 1
    done

    # Additional wait to ensure Obsidian is fully loaded
    sleep 2

    # Set the default web browser to Firefox Developer Edition, addressing the issue of Obsidian changing the default browser on startup
    xdg-settings set default-web-browser firefoxdeveloperedition.desktop
fi

