#!/bin/bash

# This script checks if Obsidian is already running to avoid starting multiple instances.
# If not running, it launches Obsidian, waits for it to fully load, and then sets the default web browser back to Firefox Developer Edition.
# This is necessary because Obsidian has a bug that sets itself as the default browser on launch.

# Check if Obsidian (electron) is already running using a specific path identification to avoid confusion with other electron applications
if pgrep -f "electron.*/usr/lib/obsidian/app.asar" > /dev/null; then    
    echo "Obsidian is already running."
else
    # Start Obsidian
    obsidian 

    echo "Obsidian is started now."
fi

