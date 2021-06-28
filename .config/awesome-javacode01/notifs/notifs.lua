
local naughty = require("naughty")
local beautiful = require("beautiful")
local gears = require("gears")
local wibox = require("wibox")
local awful = require("awful")
local dpi = beautiful.xresources.apply_dpi

require("notifs.brightness_notif")
require("notifs.volume_notif")

naughty.config.defaults.ontop = true
naughty.config.defaults.icon_size = dpi(32)
naughty.config.defaults.screen = awful.screen.focused()
naughty.config.defaults.timeout = 3
naughty.config.defaults.title = "System Notification Title"
naughty.config.defaults.margin = dpi(20)
naughty.config.defaults.border_width = 0
naughty.config.defaults.border_color = beautiful.xcolor0
naughty.config.defaults.position = "top_right"
naughty.config.defaults.shape = gears.shape.rectangle

naughty.config.padding = dpi(10)
naughty.config.spacing = dpi(10)
naughty.config.icon_dirs = {
   "/usr/share/icons/Papirus-Dark/24x24/apps/",
   "/usr/share/pixmaps/"
}
naughty.config.icon_formats = {"png", "svg"}

-- Timeouts
naughty.config.presets.low.timeout = 3
naughty.config.presets.critical.timeout = 0

naughty.config.presets.normal = {
   font = beautiful.font,
   fg = beautiful.fg_normal,
   bg = beautiful.bg_normal,
   position = "top_right"
}

naughty.config.presets.low = {
   font = beautiful.font,
   fg = beautiful.fg_normal,
   bg = beautiful.bg_normal,
   position = "top_right"
}

naughty.config.presets.critical = {
   font = "JetBrains Mono Bold 10",
   fg = "#ffffff",
   bg = "#ff0000",
   position = "top_right",
   timeout = 0
}

naughty.config.presets.ok = naughty.config.presets.normal
naughty.config.presets.info = naughty.config.presets.normal
naughty.config.presets.warn = naughty.config.presets.critical

local icons = require('icons')

local display = true

awesome.connect_signal("ears::battery", function(value)
    if value < 11 then
        naughty.notification({title="Battery Status", text="Running low at " .. value .. "%", image=icons.battery})
    end

    if (value > 94 and display )then
        naughty.notification({title="Battery Status", text="Running high at " .. value .. "%", image=icons.battery})
        display = false
    end
end)

awesome.connect_signal("ears::charger", function(plugged)
    if plugged then
        naughty.notification({title="Battery Status", text="Charging", image=icons.battery_charging})
        display = true
    end

end)
