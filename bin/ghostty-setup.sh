#!/usr/bin/env bash
#
# Ghostty hustacka setup - deploys config, cursor shader & patches shell greeting
#
set -euo pipefail

GHOSTTY_DIR="$HOME/.config/ghostty"
SHADER_DIR="$GHOSTTY_DIR/shaders"
SHADER_REPO="https://github.com/sahaj-b/ghostty-cursor-shaders"
FISH_CONFIG="$HOME/.config/fish/config.fish"
ICAT_SCRIPT="$HOME/.local/bin/kitty-icat-random"

echo "==> Ghostty hustacka setup"

# --- 1. Ghostty config ---
mkdir -p "$GHOSTTY_DIR"
cat > "$GHOSTTY_DIR/config" << 'GHOSTTY_EOF'
# =============================================================================
#  HUSTACKA GHOSTTY CONFIG - The Badass Terminal
# =============================================================================
#
#  Reload with: Ctrl+Shift+, (Linux) or Cmd+Shift+, (macOS)
#

# =============================================================================
#  THEME - Catppuccin Mocha (the king of modern terminal themes)
# =============================================================================
# Other options: "Tokyo Night", "Dracula", "Cyberpunk Scarlet Protocol",
# "Nord", "Gruvbox Dark Hard", "Afterglow", "Ayu Mirage"
# Run `ghostty +list-themes` to browse all 300+ built-in themes.
theme = dark:Catppuccin Mocha,light:Catppuccin Latte

# =============================================================================
#  TRANSPARENCY & BLUR - Frosted glass
# =============================================================================
background-opacity = 0.92
background-blur = 20
unfocused-split-opacity = 0.80

# =============================================================================
#  FONT - Operator Mono (from wezterm config)
# =============================================================================
font-family = Operator Mono Book
font-family-bold = Operator Mono Bold
font-family-italic = Operator Mono Book Italic
font-family-bold-italic = Operator Mono Bold Italic
font-size = 12

# Disable ligatures (matching wezterm harfbuzz_features calt=0)
font-feature = -calt
font-feature = -liga

# =============================================================================
#  CURSOR - Ninja warp animation
# =============================================================================
cursor-style = block
cursor-style-blink = true
cursor-color = #cba6f7
cursor-text = #1e1e2e
cursor-opacity = 0.90
adjust-cursor-thickness = 2

# =============================================================================
#  WINDOW - Clean, borderless, minimal padding
# =============================================================================
window-decoration = none
window-padding-x = 2
window-padding-y = 2
window-padding-balance = true
window-padding-color = extend
window-theme = ghostty

# =============================================================================
#  COLORS
# =============================================================================
minimum-contrast = 1.1
bold-color = bright

# =============================================================================
#  SPLIT PANES
# =============================================================================
split-divider-color = #313244

# =============================================================================
#  NINJA CURSOR SHADER - Neovide-like smear/warp effect
# =============================================================================
# Cursor warps and stretches when jumping between positions.
# Leading edge jumps fast, trailing corners lag behind = ninja smear.
custom-shader = shaders/cursor/cursor_warp.glsl
custom-shader-animation = true

# --- Other cursor shaders (uncomment to swap) ---
# custom-shader = shaders/cursor/cursor_sweep.glsl
# custom-shader = shaders/cursor/cursor_tail.glsl
# custom-shader = shaders/cursor/sonic_boom_cursor.glsl
# custom-shader = shaders/cursor/ripple_cursor.glsl

# --- Atmosphere shaders (clone 0xhckr/ghostty-shaders first) ---
# custom-shader = shaders/effects/bloom.glsl
# custom-shader = shaders/effects/bettercrt.glsl
# custom-shader = shaders/effects/starfield.glsl
# custom-shader = shaders/effects/galaxy.glsl
# custom-shader = shaders/effects/spotlight.glsl

# =============================================================================
#  BACKGROUND IMAGE (optional, uncomment to use)
# =============================================================================
# background-image = /path/to/your/wallpaper.png
# background-image-opacity = 0.06
# background-image-position = center
# background-image-fit = cover

# =============================================================================
#  KEYBINDINGS - Splits & Navigation
# =============================================================================
keybind = ctrl+shift+d=new_split:right
keybind = ctrl+shift+e=new_split:down
keybind = ctrl+shift+h=goto_split:left
keybind = ctrl+shift+l=goto_split:right
keybind = ctrl+shift+k=goto_split:up
keybind = ctrl+shift+j=goto_split:down
keybind = ctrl+shift+equal=equalize_splits
keybind = ctrl+equal=increase_font_size:1
keybind = ctrl+minus=decrease_font_size:1
keybind = ctrl+0=reset_font_size

# =============================================================================
#  MISC
# =============================================================================
copy-on-select = clipboard
link-url = true
shell-integration = detect
scrollback-limit = 10000
GHOSTTY_EOF
echo "    Config written to $GHOSTTY_DIR/config"

# --- 2. Cursor shaders ---
if [ -d "$SHADER_DIR/cursor/.git" ]; then
    echo "    Updating cursor shaders..."
    git -C "$SHADER_DIR/cursor" pull --quiet
else
    echo "    Cloning cursor shaders..."
    mkdir -p "$SHADER_DIR"
    git clone --quiet "$SHADER_REPO" "$SHADER_DIR/cursor"
fi
echo "    Shaders ready in $SHADER_DIR/cursor/"

# --- 3. Patch kitty-icat-random for Ghostty support ---
if [ -f "$ICAT_SCRIPT" ]; then
    if ! grep -q 'xterm-ghostty' "$ICAT_SCRIPT"; then
        echo "    Patching $ICAT_SCRIPT for Ghostty support..."
        # Add Ghostty to the detection line
        sed -i 's/\[\[ $TERM_PROGRAM == "WezTerm" \]\]/[[ $TERM_PROGRAM == "WezTerm" ]] || [[ $TERM == "xterm-ghostty" ]] || [[ $TERM_PROGRAM == "ghostty" ]]/' "$ICAT_SCRIPT"
        # Add Ghostty icat elif block before welcome_shell
        sed -i '/wezterm imgcat/a\    elif [[ $TERM == "xterm-ghostty" ]] || [[ $TERM_PROGRAM == "ghostty" ]] ; then\n        kitten icat --align left /tmp/kitty-greeting' "$ICAT_SCRIPT"
        echo "    Patched."
    else
        echo "    $ICAT_SCRIPT already has Ghostty support, skipping."
    fi
    # Fix IMv7 deprecation: convert -> magick
    if grep -q '[^#]*\bconvert\b' "$ICAT_SCRIPT"; then
        sed -i 's/\bconvert\b/magick/g' "$ICAT_SCRIPT"
        echo "    Fixed IMv7 deprecation (convert -> magick)."
    fi
else
    echo "    $ICAT_SCRIPT not found, skipping."
fi

# --- 4. Patch fish greeting for Ghostty support ---
if [ -f "$FISH_CONFIG" ]; then
    if ! grep -q 'xterm-ghostty' "$FISH_CONFIG"; then
        echo "    Patching $FISH_CONFIG for Ghostty greeting..."
        sed -i '/else if test "$TERM_PROGRAM" = "WezTerm"/a\        kitty-icat-random\n    else if test "$TERM" = "xterm-ghostty" -o "$TERM_PROGRAM" = "ghostty"' "$FISH_CONFIG"
        echo "    Patched."
    else
        echo "    $FISH_CONFIG already has Ghostty support, skipping."
    fi
else
    echo "    $FISH_CONFIG not found, skipping."
fi

echo ""
echo "==> Done! Launch Ghostty with:"
echo "    env __GL_MaxFramesAllowed=1 __GL_SYNC_TO_VBLANK=0 __GL_YIELD=USLEEP ghostty --gtk-single-instance=true"
echo ""
echo "    Or just 'ghostty' if you don't have NVIDIA GPU issues."
