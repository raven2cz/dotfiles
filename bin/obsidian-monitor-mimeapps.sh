#!/bin/bash

CONFIG_FILE="$HOME/.config/mimeapps.list"
TEMP_FILE="$HOME/.config/mimeapps_temp.list"

# Funkce pro opravu souboru mimeapps.list
fix_mimeapps() {
    # Záloha aktuálního souboru
    cp "$CONFIG_FILE" "$CONFIG_FILE.bak"

    # Vytvoření opraveného dočasného souboru
    sed -e 's/obsidian.desktop;//g' "$CONFIG_FILE" > "$TEMP_FILE"

    # Přesun opraveného dočasného souboru zpět na původní místo
    mv "$TEMP_FILE" "$CONFIG_FILE"

    echo "Fix applied to mimeapps.list"
}

# První oprava při spuštění skriptu
fix_mimeapps

# Monitorování změn souboru pomocí inotifywait
inotifywait -m -e modify "$CONFIG_FILE" | while read -r directory events filename; do
    fix_mimeapps
done

