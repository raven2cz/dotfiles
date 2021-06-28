--      _     _      _                
--  ___(_) __| | ___| |__   __ _ _ __ 
-- / __| |/ _` |/ _ \ '_ \ / _` | '__|
-- \__ \ | (_| |  __/ |_) | (_| | |   
-- |___/_|\__,_|\___|_.__/ \__,_|_|  
local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local helpers = require("helpers")
local pad = helpers.pad
local dpi = require("beautiful").xresources.apply_dpi

-- Set up icons
local icon_theme = "sheet"
local icons = require("icons")
icons.init(icon_theme)

-- Sidebar attributes
sidebar_hide_on_mouse_leave = true
sidebar_show_on_mouse_screen_edge = true
sidebar = wibox({visible = false, ontop = true, type = "sidebar"})
sidebar.bg = beautiful.sidebar_bg or beautiful.xbackground or "#FFFFFFF"
sidebar.fg = beautiful.sidebar_fg or beautiful.xforeground or "#1111111"
sidebar.opacity = 1
sidebar.height = beautiful.sidebar_height or 600
sidebar.width = beautiful.sidebar_width or 300
sidebar.y = beautiful.sidebar_y or 0
sidebar.x = beautiful.sidebar_x or 0
local radius = beautiful.border_radius or 0

local box_radius = beautiful.dashboard_box_border_radius or dpi(10)
local box_gap = dpi(6)

local function create_boxed_widget(widget_to_be_boxed, width, height, bg_color)
    local box_container = wibox.container.background()
    box_container.bg = bg_color
    box_container.forced_height = height
    box_container.forced_width = width
    box_container.shape = helpers.rrect(box_radius)
    -- box_container.shape = helpers.prrect(20, true, true, true, true)
    -- box_container.shape = helpers.prrect(30, true, true, false, true)

    local boxed_widget = wibox.widget {
        -- Add margins
        {
            -- Add background color
            {
                -- Center widget_to_be_boxed horizontally
                nil,
                {
                    -- Center widget_to_be_boxed vertically
                    nil,
                    -- The actual widget goes here
                    widget_to_be_boxed,
                    layout = wibox.layout.align.vertical,
                    expand = "none"
                },
                layout = wibox.layout.align.horizontal
            },
            widget = box_container
        },
        margins = box_gap,
        color = "#FF000000",
        widget = wibox.container.margin
    }

    return boxed_widget
end

-- Round Corners based on placement
if beautiful.sidebar_position == "right" then
    awful.placement.right(sidebar)
    sidebar.shape = helpers.prect(radius, true, false, false, true)
else
    awful.placement.left(sidebar)
    sidebar.shape = helpers.prrect(radius, false, true, true, false)
end

sidebar:buttons(gears.table.join( -- Middle click - Hide sidebar
awful.button({}, 2, function() sidebar.visible = false end) -- Right click - Hide sidebar
-- awful.button({ }, 3, function ()
--     sidebar.visible = false
--     -- mymainmenu:show()
-- end)
))

sidebar:connect_signal("mouse::leave", function() sidebar.visible = false end)
-- Activate sidebar by moving the mouse at the edge of the screen
local sidebar_activator = wibox({
    y = sidebar.y,
    width = 1,
    visible = true,
    ontop = false,
    opacity = 0,
    below = true
})
sidebar_activator.height = sidebar.height

sidebar_activator:connect_signal("mouse::enter",
                                 function() sidebar.visible = true end)

if beautiful.sidebar_position == "right" then
    awful.placement.right(sidebar_activator)
else
    awful.placement.left(sidebar_activator)
end

sidebar_activator:buttons(gears.table.join(
                              awful.button({}, 4,
                                           function() awful.tag.viewprev() end),
                              awful.button({}, 5,
                                           function() awful.tag.viewnext() end)))

-- Helper function that changes the appearance of progress bars and their icons
-- Create horizontal rounded bars
local function format_progress_bar(bar, icon)
    icon.forced_height = dpi(36)
    icon.forced_width = dpi(36)
    icon.resize = true
    bar.forced_width = dpi(215)
    bar.shape = gears.shape.rounded_bar
    bar.bar_shape = gears.shape.rounded_bar

    -- bar.forced_height = dpi(30)
    -- bar.paddings = dpi(4)
    -- bar.border_width = dpi(2)
    -- bar.border_color = x.color8

    local w = wibox.widget {
        nil,
        {icon, bar, spacing = dpi(10), layout = wibox.layout.fixed.horizontal},
        expand = "none",
        layout = wibox.layout.align.horizontal
    }
    return w
end

--- {{{ Volume Widget

local volume_icon = wibox.widget.imagebox(icons.volume)

awesome.connect_signal("ears::volume", function(volume, muted)
    if muted then
        volume_icon.image = icons.muted
    else
        volume_icon.image = icons.volume
    end
end)

local volume_bar = require("widgets.volume_bar")
local volume = format_progress_bar(volume_bar, volume_icon)

apps_volume = function()
    helpers.run_or_raise({class = 'Pavucontrol'}, true, "pavucontrol")
end

volume:buttons(gears.table.join( -- Left click - Mute / Unmute
awful.button({}, 1, function() helpers.volume_control(0) end),
-- Scroll - Increase / Decrease volume
awful.button({}, 4, function() helpers.volume_control(5) end),
awful.button({}, 5, function() helpers.volume_control(-5) end)))

--- }}}

--- {{{ Brightness Widget

local brightness_icon = wibox.widget.imagebox(icons.brightness)
local brightness_bar = require("widgets.brightness_bar")
local brightness = format_progress_bar(brightness_bar, brightness_icon)

--- }}}

--- {{{ Ram Widget

local ram_icon = wibox.widget.imagebox(icons.ram)
local ram_bar = require("widgets.ram_bar")
local ram = format_progress_bar(ram_bar, ram_icon)

--- }}}

--- {{{ Cpu Widget

local cpu_icon = wibox.widget.imagebox(icons.cpu)
local cpu_bar = require("widgets.cpu_bar")
local cpu = format_progress_bar(cpu_bar, cpu_icon)

--- }}}

--- {{{ Clock

local fancy_time_widget = wibox.widget.textclock("%H%M")
fancy_time_widget.markup = fancy_time_widget.text:sub(1, 2) ..
                               "<span foreground='" .. beautiful.xcolor12 ..
                               "'>" .. fancy_time_widget.text:sub(3, 4) ..
                               "</span>"
fancy_time_widget:connect_signal("widget::redraw_needed", function()
    fancy_time_widget.markup = fancy_time_widget.text:sub(1, 2) ..
                                   "<span foreground='" .. beautiful.xcolor12 ..
                                   "'>" .. fancy_time_widget.text:sub(3, 4) ..
                                   "</span>"
end)
fancy_time_widget.align = "center"
fancy_time_widget.valign = "center"
fancy_time_widget.font = "JetBrains Mono 55"

local fancy_time = {fancy_time_widget, layout = wibox.layout.fixed.vertical}

--- }}}

--- {{{ Date

local fancy_date_widget = wibox.widget.textclock('%A %B %d, %Y')
fancy_date_widget.markup = "<span foreground='" .. beautiful.xcolor12 .. "'>" ..
                               fancy_date_widget.text .. "</span>"
fancy_date_widget:connect_signal("widget::redraw_needed", function()
    fancy_date_widget.markup = "<span foreground='" .. beautiful.xcolor12 ..
                                   "'>" .. fancy_date_widget.text .. "</span>"
end)
fancy_date_widget.align = "center"
fancy_date_widget.valign = "center"
fancy_date_widget.font = "JetBrains Mono 15"
local fancy_date_decoration = wibox.widget.textbox()
-- local decoration_string = "------------------------"
local decoration_string = "──────  ──────"
fancy_date_decoration.markup =
    "<span foreground='" .. beautiful.xcolor2 .. "'>" .. decoration_string ..
        "</span>"
fancy_date_decoration.font = "FiraCode Nerd Font Mono 18"
fancy_date_decoration.align = "center"
fancy_date_decoration.valign = "top"

local fancy_date = {
    fancy_date_widget,
    fancy_date_decoration,
    layout = wibox.layout.fixed.vertical
}

---}}}

local mpd = require("widgets.mpd")
local mpd_box = create_boxed_widget(mpd, 240, 125, beautiful.xcolor0)
local mpd_area = wibox.layout.align.vertical()
mpd_area:set_top(nil)
mpd_area:set_middle(wibox.container.margin(mpd_box, dpi(15), dpi(15), 0, 0))
mpd_area:set_bottom(nil)

sidebar:setup{
    { ----------- TOP GROUP -----------
        fancy_time,
        top = dpi(25),
        left = dpi(20),
        right = dpi(20),
        bottom = dpi(10),
        widget = wibox.container.margin
    },
    { ----------- MIDDLE GROUP -----------
        fancy_date,
        helpers.vertical_pad(30),
        volume,
        brightness,
        helpers.vertical_pad(40),
        cpu,
        ram,
        helpers.vertical_pad(40),
        mpd_area,
        layout = wibox.layout.fixed.vertical
    },
    layout = wibox.layout.align.vertical
}

sidebar.border_width = dpi(0)
sidebar.border_color = beautiful.xcolor0

return sidebar
