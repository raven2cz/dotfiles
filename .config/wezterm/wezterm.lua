local wezterm = require 'wezterm'
return {
    font = wezterm.font 'OperatorMono-Book',
    color_scheme = 'MonokaiPro (Gogh)',
    hide_tab_bar_if_only_one_tab = true,
    window_close_confirmation = "NeverPrompt",
    font_size = 12,
	line_height = 0.98,
	harfbuzz_features = { "calt=0" },
    default_cursor_style = 'SteadyBlock',
    window_background_opacity = 0.95,
    initial_rows = 50,
    initial_cols = 110
}
