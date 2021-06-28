local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local dpi = beautiful.xresources.apply_dpi

-- Set colors
local active_color = {
  type = 'linear',
  from = { 0, 0 },
  to = { 200, 50 }, -- replace with w,h later
  stops = {
    { 0, beautiful.xcolor6 },
    { 0.75, beautiful.xcolor4 }
  }
} 

local background_color = beautiful.xcolor0

local ram_bar = wibox.widget{
    max_value     = 100,
    value         = 50,
    forced_height = dpi(10),
    margins       = {
        top = dpi(8),
        bottom = dpi(8),
    },
    forced_width  = dpi(200),
    shape         = gears.shape.rounded_bar,
    bar_shape     = gears.shape.rounded_bar,
    color         = active_color,
    background_color = background_color,
    border_width  = 0,
    border_color  = beautiful.border_color,
    widget        = wibox.widget.progressbar,
}

local update_interval = 20
-- Returns the used amount of ram in percentage
-- TODO output of free is affected by system language. The following command
-- works for any language:
-- free -m | sed -n '2p' | awk '{printf "%d available out of %d\n", $7, $2}'
local ram_script = [[
  sh -c "
  free -m | grep 'Mem:' | awk '{printf \"%d@@%d@\", $7, $2}'
  "]]

-- Periodically get ram info
--awful.widget.watch(ram_script, update_interval, function(widget, stdout)
--    local available = stdout:match('(.*)@@')
 --   local total = stdout:match('@@(.*)@')
  --  local used = tonumber(total) - tonumber(available)
 --   local used_ram_percentage = (used / total) * 100
 --   ram_bar.value = used_ram_percentage
--end)


awesome.connect_signal("ears::ram", function(used, total)
    local used_ram_percentage = (used / total) * 100
    ram_bar.value = used_ram_percentage
end)

return ram_bar
