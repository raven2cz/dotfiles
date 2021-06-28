--           _ _                
-- __      _(_) |__   __ _ _ __ 
-- \ \ /\ / / | '_ \ / _` | '__|
--  \ V  V /| | |_) | (_| | |   
--   \_/\_/ |_|_.__/ \__,_|_|  



local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi
local helpers = require("helpers")
local icon_theme = "sheet"
local icons = require("icons")
--local slidebar = require('slidebar')

local systray_margin = (beautiful.wibar_height-beautiful.systray_icon_size)/2

local function rounded_bar(color)
    return wibox.widget {
        max_value     = 100,
        value         = 0,
        forced_height = dpi(10),
        forced_width  = dpi(60),
        margins       = {
          top = dpi(10),
          bottom = dpi(10),
        },
        shape         = gears.shape.rounded_bar,
        border_width  = 0,
        color         = color,
        background_color = beautiful.xbackground,
        border_color  = beautiful.xbackground,
        widget        = wibox.widget.progressbar,
    }
end

-- Helper function that changes the appearance of progress bars and their icons
-- Create horizontal rounded bars
local function format_progress_bar(bar, icon)
    icon.forced_height = dpi(27)
    icon.forced_width = dpi(36)
    icon.resize = true
    bar.forced_width = dpi(100)
    bar.shape = gears.shape.rounded_bar
    bar.bar_shape = gears.shape.rounded_bar

    -- bar.forced_height = dpi(30)
    -- bar.paddings = dpi(4)
    -- bar.border_width = dpi(2)
    -- bar.border_color = x.color8

    local w = wibox.widget{
        nil,
        {
            icon,
            bar,
            spacing = dpi(5),
            layout = wibox.layout.fixed.horizontal
        },
        expand = "none",
        layout = wibox.layout.align.horizontal
    }
    return w
end


-- {{{ Battery Bar Widget

local battery_icon = wibox.widget.imagebox(nil)

--[[awesome.connect_signal("ears::charger", function(plugged)
    if plugged then
        battery_icon.image = icons.battery_charging
    else
        battery_icon.image = icons.battery
    end
end)]]--

local battery_bar = require("widgets.battery_bar")
local battery = format_progress_bar(battery_bar, battery_icon)

--- }}}


--- {{{ Systray Widget

local mysystray = wibox.widget.systray()
mysystray:set_base_size(beautiful.systray_icon_size)

local mysystray_container = {
    mysystray,
    top = systray_margin,
    bottom = systray_margin,
    style = {
        shape = helpers.rrect(5),
    },
    widget = wibox.container.margin
}

--- }}}


--- {{{ Taglist Widget

local taglist_buttons = gears.table.join(
                    awful.button({ }, 1, function(t) t:view_only() end),
                    awful.button({ modkey }, 1, function(t)
                                              if client.focus then
                                                  client.focus:move_to_tag(t)
                                              end
                                          end),
                    awful.button({ }, 3, awful.tag.viewtoggle),
                    awful.button({ modkey }, 3, function(t)
                                              if client.focus then
                                                  client.focus:toggle_tag(t)
                                              end
                                          end),
                    awful.button({ }, 4, function(t) awful.tag.viewnext(t.screen) end),
                    awful.button({ }, 5, function(t) awful.tag.viewprev(t.screen) end)
                )

--- }}}


--- {{{ Tasklist Widget

local tasklist_buttons = gears.table.join(
                     awful.button({ }, 1, function (c)
                                              if c == client.focus then
                                                  c.minimized = true
                                              else
                                                  c:emit_signal(
                                                      "request::activate",
                                                      "tasklist",
                                                      {raise = true}
                                                  )
                                              end
                                          end),
                     awful.button({ }, 3, function()
                                              awful.menu.client_list({ theme = { width = 250 } })
                                          end),
                     awful.button({ }, 4, function ()
                                              awful.client.focus.byidx(1)
                                          end),
                     awful.button({ }, 5, function ()
                                              awful.client.focus.byidx(-1)
                                          end))

--- }}}

local slidebar = require('slidebar')

awful.screen.connect_for_each_screen(function(s)
    -- Create a promptbox for each screen
    s.mypromptbox = awful.widget.prompt()

    -- Create the wibox
    s.mywibox = awful.wibar({ 
        position = "top", 
        type = "wibar",
        screen = s, 
        ontop = true,
        bg = beautiful.xbackground,
        size = beautiful.wibar_height
    })


    

    --s.myslidebar = slidebar {
    --    bg = beautiful.bg_normal,
    --    position = "top",
    --    size = beautiful.wibar_height,
        -- size_activator = 1
        -- show_delay = 0.25,
        -- hide_delay = 5,
        -- easing = 2,

     --   screen = s
   -- }



    -- Remove wibar on full screen
    local function remove_wibar (c)
        if c.fullscreen or c.maximized then
            s.mywibox.visible = false
        else
            s.mywibox.visible = true
        end
    end

    client.connect_signal("property::fullscreen", remove_wibar)

    -- Create a taglist widget
    s.mytaglist = awful.widget.taglist {
        screen  = s,
        filter  = awful.widget.taglist.filter.all,
        style   = {
            --bg_focus = beautiful.xbackground,
            --fg_focus = beautiful.xcolor4,
            --fg_occupied = beautiful.xcolor6,
            shape = gears.shape.rectangle,
            --font = "Iosevka 8"
        },
        layout   = {
            spacing = 0,
            layout  = wibox.layout.fixed.horizontal
        },
        widget_template = {
            {
                {
                    {
                       id     = 'text_role',
                       widget = wibox.widget.textbox,
                    },
                    layout = wibox.layout.fixed.horizontal,
                },
                left  = 11,
                right = 11,
                widget = wibox.container.margin
            },
            id     = 'background_role',
            widget = wibox.container.background,
        },
        buttons = taglist_buttons
    }

    -- Create a tasklist widget

    s.mytasklist = awful.widget.tasklist {
        screen   = s,
        filter   = awful.widget.tasklist.filter.currenttags,
        buttons  = tasklist_buttons,
        style    = {
            shape        = gears.shape.rounded_bar,
        },
        layout   = {
            spacing = 10,
            layout  = wibox.layout.flex.horizontal
        },
        -- Notice that there is *NO* wibox.wibox prefix, it is a template,
        -- not a widget instance.
        widget_template = {
            {
                {
                    {
                        id     = 'text_role',
                        widget = wibox.widget.textbox,
                    },
                    layout = wibox.layout.flex.horizontal,
                },
                left  = 10,
                right = 10,
                widget = wibox.container.margin
            },
            id     = 'background_role',
            widget = wibox.container.background,
        },
    }
 
    -- Add widgets to the wibox
    s.mywibox:setup {
        layout = wibox.layout.align.horizontal,
        { -- Left widgets
            layout = wibox.layout.fixed.horizontal,
            spacing = beautiful.wibar_spacing,
            s.mytaglist,
            s.mypromptbox,
        },
        s.mytasklist, -- Middle widget
        {
            { -- Right widgets
                layout = wibox.layout.align.horizontal,
                spacing = beautiful.wibar_spacing,
                --ram_bar,
                battery,
                helpers.horizontal_pad(15),
                mysystray_container
            },
            left = beautiful.wibar_margin,
            right = beautiful.wibar_margin,
            widget = wibox.container.margin,
        },
    }
end)
