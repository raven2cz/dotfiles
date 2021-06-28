--  _   _                         
-- | |_| |__   ___ _ __ ___   ___ 
-- | __| '_ \ / _ \ '_ ` _ \ / _ \
-- | |_| | | |  __/ | | | | |  __/
--  \__|_| |_|\___|_| |_| |_|\___|
local awful = require("awful")
local theme_assets = require("beautiful.theme_assets")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi
local xrdb = xresources.get_current_theme()
local gears = require("gears")
local gfs = require("gears.filesystem")
local themes_path = gfs.get_themes_dir()
local helpers = require("helpers")

-- Inherit default theme
local theme = dofile(themes_path .. "default/theme.lua")
-- Titlebar icon path
local tip = "~/.config/awesome/theme/icons/titlebar/"
local icon_path = "~/.config/awesome/theme/icons/"

theme.clear_icon = icon_path .. "clear.png"
theme.clear_grey_icon = icon_path .. "clear_grey.png"
theme.notification_icon = icon_path .. "notification.png"
theme.delete_icon = icon_path .. "delete.png"
theme.delete_grey_icon = icon_path .. "delete_grey.png"
-- theme.wallpaper = gears.filesystem.get_configuration_dir() .. "theme/wall.png"
-- Load ~/.Xresources colors and set fallback colors
theme.xbackground = xrdb.background or "#2f343f"
theme.xforeground = xrdb.foreground or "#d8dee8"
theme.xcolor0 = xrdb.color0 or "#4b5262"
theme.xcolor1 = xrdb.color1 or "#bf616a"
theme.xcolor2 = xrdb.color2 or "#a3be8c"
theme.xcolor3 = xrdb.color3 or "#ebcb8b"
theme.xcolor4 = xrdb.color4 or "#81a1c1"
theme.xcolor5 = xrdb.color5 or "#b48ead"
theme.xcolor6 = xrdb.color6 or "#89d0bA"
theme.xcolor7 = xrdb.color7 or "#e5e9f0"
theme.xcolor8 = xrdb.color8 or "#434a5a"
theme.xcolor9 = xrdb.color9 or "#b3555e"
theme.xcolor10 = xrdb.color10 or "#93ae7c"
theme.xcolor11 = xrdb.color11 or "#dbbb7b"
theme.xcolor12 = xrdb.color12 or "#7191b1"
theme.xcolor13 = xrdb.color13 or "#a6809f"
theme.xcolor14 = xrdb.color14 or "#7dbba8"
theme.xcolor15 = xrdb.color15 or "#d1d5dc"
theme.font = "JetBrains Mono 9"
theme.font1 = "FiraCode Nerd Font Mono 12"
theme.bg_dark = theme.xcolor0
theme.bg_normal = theme.xbackground
theme.bg_focus = theme.xcolor8
theme.bg_urgent = theme.xcolor8
theme.bg_minimize = theme.xcolor8

theme.fg_normal = theme.xcolor7
theme.fg_focus = theme.xcolor4
theme.fg_urgent = theme.xcolor3
theme.fg_minimize = theme.xcolor8

theme.button_close = theme.xcolor1

-- Borders
theme.border_width = dpi(9)
-- theme.border_color = theme.xcolor0
theme.border_normal = theme.xbackground
theme.border_focus = theme.xbackground
-- Rounded corners
theme.border_radius = dpi(0)

-- There are other variable sets
-- overriding the default one when
-- defined, the sets are:
-- taglist_[bg|fg]_[focus|urgent|occupied|empty|volatile]
-- tasklist_[bg|fg]_[focus|urgent]
-- titlebar_[bg|fg]_[normal|focus]
-- tooltip_[font|opacity|fg_color|bg_color|border_width|border_color]
-- mouse_finder_[color|timeout|animate_timeout|radius|factor]
-- prompt_[fg|bg|fg_cursor|bg_cursor|font]
-- hotkeys_[bg|fg|border_width|border_color|shape|opacity|modifiers_fg|label_bg|label_fg|group_margin|font|description_font]
-- Example:
-- theme.taglist_bg_focus = "#ff0000"

-- Generate taglist squares:
local taglist_square_size = dpi(0)
theme.taglist_squares_sel = theme_assets.taglist_squares_sel(
                                taglist_square_size, theme.fg_normal)
theme.taglist_squares_unsel = theme_assets.taglist_squares_unsel(
                                  taglist_square_size, theme.fg_normal)

-- Variables set for theming notifications:
-- notification_font
-- notification_[bg|fg]
-- notification_[width|height|margin]
-- notification_[border_color|border_width|shape|opacity]

-- Variables set for theming the menu:
-- menu_[bg|fg]_[normal|focus]
-- menu_[border_color|border_width]

-- Taglist
-- theme.taglist_font = "awesomewm-font 10"
theme.taglist_font = "JetBrains Mono Bold 9"
theme.taglist_bg = theme.xbackground
-- theme.taglist_shape = gears.shape.triagle
theme.taglist_bg_focus = theme.xcolor8
theme.taglist_fg_focus = theme.xcolor4
theme.taglist_bg_urgent = theme.xbackground
theme.taglist_fg_urgent = theme.xcolor1
theme.taglist_bg_occupied = transparent
theme.taglist_fg_occupied = theme.xcolor6
theme.taglist_bg_empty = transparent
theme.taglist_fg_empty = theme.xcolor8
theme.taglist_bg_volatile = transparent
theme.taglist_fg_volatile = theme.xcolor11
theme.taglist_disable_icon = true
-- Tasklist
theme.tasklist_font = theme.font
theme.tasklist_disable_icon = true
theme.tasklist_plain_task_name = true
theme.tasklist_bg_focus = theme.xbackground
theme.tasklist_fg_focus = theme.xbackground
theme.tasklist_bg_minimize = theme.xcolor0 .. "77"
theme.tasklist_fg_minimize = theme.xforeground .. "77"
theme.tasklist_bg_normal = theme.xbackground
theme.tasklist_fg_normal = theme.xbackground
theme.tasklist_disable_task_name = false
theme.tasklist_disable_icon = true
-- theme.tasklist_font_minimized = "sans italic 8"
theme.tasklist_bg_urgent = theme.xbackground
theme.tasklist_fg_urgent = theme.xcolor3
theme.tasklist_spacing = dpi(0)
theme.tasklist_align = "center"

-- Titlebars
theme.titlebar_size = dpi(4)
theme.titlebar_bg_focus = theme.xcolor8
theme.titlebar_bg_normal = theme.xcolor0
theme.titlebar_fg_focus = theme.xcolor8
theme.titlebar_fg_normal = theme.xbackground

-- Edge snap
theme.snap_bg = theme.xcolor4
theme.snap_shape = helpers.rrect(dpi(6))

-- Prompts
theme.prompt_bg = transparent
theme.prompt_fg = theme.xforeground

-- Tooltips
theme.tooltip_bg = theme.xcolor0
theme.tooltip_fg = theme.xforeground
theme.tooltip_font = theme.font
theme.tooltip_border_width = dpi(0)
theme.tooltip_border_color = theme.xcolor0
theme.tooltip_opacity = 1
theme.tooltip_align = "left"

-- Menu
theme.menu_font = theme.font
theme.menu_bg_focus = theme.xcolor4
theme.menu_fg_focus = theme.xcolor7
theme.menu_bg_normal = theme.xbackground
theme.menu_fg_normal = theme.xcolor7
theme.menu_submenu_icon = "~/.config/awesome/theme/icons/submenu.png"
theme.menu_height = dpi(20)
theme.menu_width = dpi(130)
theme.menu_border_color = "#0000000"
-- theme.menu_border_color  = theme.xbackground
theme.menu_border_width = dpi(0)
-- pop up
theme.hotkeys_font = theme.font
-- Recolor Layout icons:
theme = theme_assets.recolor_layout(theme, theme.xforeground)
-- Titlebar buttons: Define the images to load
theme.titlebar_close_button_normal = tip .. "empty.png"
theme.titlebar_close_button_focus = tip .. "close_focus.svg"
theme.titlebar_floating_button_normal_inactive = tip .. "empty.png"
theme.titlebar_floating_button_focus_inactive = tip .. "floating_focus.svg"
theme.titlebar_floating_button_focus_inactive_hover =
    tip .. "floating_focus_active.svg"
theme.titlebar_floating_button_normal_active = tip .. "empty.png"
theme.titlebar_floating_button_focus_active = tip .. "floating_focus.svg"
theme.titlebar_floating_button_focus_active_hover =
    tip .. "floating_focus_active.svg"
-- theme.titlebar_minimize_button_normal = tip .. "minimize_normal.svg"
-- theme.titlebar_minimize_button_focus  = tip .. "minimize_focus.svg"
-- theme.titlebar_maximized_button_normal_inactive = tip .. empty
-- theme.titlebar_maximized_button_focus_inactive  = tip .. empty
-- theme.titlebar_maximized_button_normal_active = tip .. empty
-- theme.titlebar_maximized_button_focus_active  = tip .. empty
--- (hover)
theme.titlebar_close_button_normal_hover = tip .. "empty.png"
theme.titlebar_close_button_focus_hover = tip .. "close_focus_hover.svg"
-- theme.titlebar_minimize_button_normal_hover = tip .. "minimize_normal_hover.svg"
-- theme.titlebar_minimize_button_focus_hover  = tip .. "minimize_focus_hover.svg"
-- theme.titlebar_sticky_button_normal_inactive_hover = tip .. "sticky_normal_inactive_hover.svg"
-- theme.titlebar_maximized_button_normal_inactive_hover = tip .. "maximized_normal_inactive_hover.svg"
-- theme.titlebar_maximized_button_focus_inactive_hover  = tip .. "maximized_focus_inactive_hover.svg"
-- theme.titlebar_maximized_button_normal_active_hover = tip .. "maximized_normal_active_hover.svg"
-- theme.titlebar_maximized_button_focus_active_hover  = tip .. "maximized_focus_active_hover.svg"
-- Define the icon theme for application icons. If not set then the icons
-- from /usr/share/icons and /usr/share/icons/hicolor will be used.
-- theme.icon_theme = "/usr/share/icons/Numix"
-- Generate Awesome icon:
-- theme.awesome_icon = theme_assets.awesome_icon(
--    theme.menu_height, theme.bg_focus, theme.fg_focus
-- )
-- layout list 
-- Define the icon theme for application icons. If not set then the icons
-- from /usr/share/icons and /usr/share/icons/hicolor will be used.
-- Useless gaps
theme.useless_gap = 10
theme.sidebar_position = "left"
theme.sidebar_width = 350
theme.sidebar_height = 600
theme.sidebar_border_radius = 0
theme.sidebar_y = 0
theme.sidebar_x = 20

theme.exit_screen_fg = theme.xforeground
theme.layoutlist_border_color = theme.xcolor8
theme.layoutlist_border_width = dpi(0)
theme.systray_icon_spacing = dpi(5)

theme.bg_systray = xcolor0

theme.wibar_height = dpi(27)
theme.wibar_margin = dpi(15)
theme.wibar_spacing = dpi(15)
theme.wibar_bg = theme.xcolor0
theme.systray_icon_size = dpi(20)

return theme
