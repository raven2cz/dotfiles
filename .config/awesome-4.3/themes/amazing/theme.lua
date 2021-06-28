--  _ __ __ ___   _____ _ __  
-- | '__/ _` \ \ / / _ \ '_  \  Antonin Fischer (raven2cz)
-- | | | (_| |\ V /  __/ | | |  https://tonda-fischer.online/
-- |_|  \__,_| \_/ \___|_| |_|  https://github.com/raven2cz
--        
-- A customized theme.lua for awesomewm / amazing theme (https://awesomewm.org//) 
----------------------------
-- Amazing Awesome Theme! --
----------------------------

local theme_name = "amazing"
local theme_assets = require("beautiful.theme_assets")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi

local gfs = require("gears.filesystem")
local gears = require("gears")
local themes_path = gfs.get_themes_dir()

local awful = require("awful")

-- Widget and layout library
local wibox = require("wibox")
-- Window Enhancements
local lain = require("lain")
-- Notification library
local naughty = require("naughty")

local my_table = awful.util.table or gears.table -- 4.{0,1} compatibility

local theme = {}

theme.dir = os.getenv("HOME") .. "/.config/awesome/themes/" .. theme_name

-- Global font
theme.font          = "Hack Nerd Font 8"
theme.font_larger   = "Hack Nerd Font 9"
theme.font_notify   = "mononoki Nerd Font 11"

-- {{{ Colors
theme.fg_normal  = "#DCDCCC"
theme.fg_focus   = "#F0DFAF"
theme.fg_urgent  = "#CC9393"
theme.fg_minimize = "#ffffff"

theme.bg_normal  = "#3F3F3F"
theme.bg_focus   = "#1E2320"
theme.bg_urgent  = "#b74822"
theme.bg_systray = theme.bg_normal
theme.bg_minimize = "#6d6d6d"
-- }}}

-- {{{ Borders
theme.useless_gap   = dpi(5)
theme.border_width  = dpi(1)
theme.border_normal = "#000000"
theme.border_focus  = "#535d6c"
theme.border_marked = "#CC9393"

theme.widgetbar_fg  = "#cacaca"

theme.arrow1_bg = "#4d614d"
theme.arrow2_bg = "#273450"

-- {{{ Titlebars
theme.titlebar_bg_focus  = "#3F3F3F"
theme.titlebar_bg_normal = "#3F3F3F"
-- }}}

-- {{{ Mouse finder
theme.mouse_finder_color = "#CC9393"
-- mouse_finder_[timeout|animate_timeout|radius|factor]
-- }}}

--- Default values for the params to notify().
-- These can optionally be overridden by specifying a preset
-- @see naughty.config.presets
-- @see naughty.notify
-- Variables set for theming notifications:
-- notification_font
-- notification_[bg|fg]
-- notification_[width|height|margin]
-- notification_[border_color|border_width|shape|opacity]
-- Naughty notifications
naughty.config.defaults = {
    timeout = 10,
    font = theme.font_notify,
    border_width = 1,
    border_color = theme.bg_normal,
    text = "",
    screen = 1,
    ontop = true,
    margin = "20",
    position = "top_middle"
}
naughty.config.padding = dpi(15)
theme.notification_opacity = 0.84
theme.notification_bg = "#3F3F3F"
theme.notification_fg = "#F0DFAF"

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
--theme.taglist_bg_focus = "#ff0000"
-- {{{ Taglist
theme.taglist_squares_sel   = theme.dir .. "/taglist/squarefz.png"
theme.taglist_squares_unsel = theme.dir .. "/taglist/squarez.png"
--theme.taglist_squares_resize = "false"
-- }}}

-- Variables set for theming the menu:
-- menu_[bg|fg]_[normal|focus]
-- menu_[border_color|border_width]
theme.menu_submenu_icon = themes_path.."default/submenu.png"
theme.menu_height = dpi(15)
theme.menu_width  = dpi(100)

-- {{{ Misc
theme.awesome_icon = theme.dir .. "/awesome-icon.png"
-- }}}

-- You can add as many variables as
-- you wish and access them by using
-- beautiful.variable in your rc.lua
--theme.bg_widget = "#cc0000"

-- Wallpaper
-- {{{ Tag Wallpaper
-- Set according to wallpaper directory
local path = os.getenv("HOME") .."/Pictures/manga-wallpapers/"
--local path = os.getenv("HOME") .."/Pictures/"
-- Set wallpaper for each tag
local wp_selected = {
    "random",
    "lone-samurai-wallpaper.jpg",
    "wallhaven-xlmlmo.jpg",
    "wallhaven-95j8kw.jpg",
    "wallhaven-zx5xwv.jpg",
    "wallhaven-w8ppk6.jpg",
    "wallhaven-oxlpj9.png",
    "wallhaven-g8y59e.jpg",
    "wallhaven-lqekzp.jpg",
}
-- Feature: place random wallpaper if the wp_selected has "random" text
local wp_random = {
    "anime-streets-wallpaper.jpg",
    "dragon-fire-girl.jpg",
    "wallhaven-q67my5.jpg",
    "wallhaven-r7j781.jpg",
    "6330.jpg",
    "alone-sad-girl.jpg",
    "24525.jpg",
    "41107.jpg",
    "127009.jpg",
    "127022.jpg",
    "127656.jpg",
    "381246.jpg",
    "gamer-girl.jpg",
}

-- default wallpaper
theme.wallpaper = theme.dir.."/zenburn-background.png"
-- }}}

-- Define the image to load
theme.titlebar_close_button_normal = theme.dir.."/titlebar/close_normal.png"
theme.titlebar_close_button_focus  = theme.dir.."/titlebar/close_focus.png"

theme.titlebar_minimize_button_normal = theme.dir.."/titlebar/minimize_normal.png"
theme.titlebar_minimize_button_focus  = theme.dir.."/titlebar/minimize_focus.png"

theme.titlebar_ontop_button_normal_inactive = theme.dir.."/titlebar/ontop_normal_inactive.png"
theme.titlebar_ontop_button_focus_inactive  = theme.dir.."/titlebar/ontop_focus_inactive.png"
theme.titlebar_ontop_button_normal_active = theme.dir.."/titlebar/ontop_normal_active.png"
theme.titlebar_ontop_button_focus_active  = theme.dir.."/titlebar/ontop_focus_active.png"

theme.titlebar_sticky_button_normal_inactive = theme.dir.."/titlebar/sticky_normal_inactive.png"
theme.titlebar_sticky_button_focus_inactive  = theme.dir.."/titlebar/sticky_focus_inactive.png"
theme.titlebar_sticky_button_normal_active = theme.dir.."/titlebar/sticky_normal_active.png"
theme.titlebar_sticky_button_focus_active  = theme.dir.."/titlebar/sticky_focus_active.png"

theme.titlebar_floating_button_normal_inactive = theme.dir.."/titlebar/floating_normal_inactive.png"
theme.titlebar_floating_button_focus_inactive  = theme.dir.."/titlebar/floating_focus_inactive.png"
theme.titlebar_floating_button_normal_active = theme.dir.."/titlebar/floating_normal_active.png"
theme.titlebar_floating_button_focus_active  = theme.dir.."/titlebar/floating_focus_active.png"

theme.titlebar_maximized_button_normal_inactive = theme.dir.."/titlebar/maximized_normal_inactive.png"
theme.titlebar_maximized_button_focus_inactive  = theme.dir.."/titlebar/maximized_focus_inactive.png"
theme.titlebar_maximized_button_normal_active = theme.dir.."/titlebar/maximized_normal_active.png"
theme.titlebar_maximized_button_focus_active  = theme.dir.."/titlebar/maximized_focus_active.png"

-- You can use your own layout icons like this:
theme.layout_fairh = theme.dir.."/layouts/fairhw.png"
theme.layout_fairv = theme.dir.."/layouts/fairvw.png"
theme.layout_floating  = theme.dir.."/layouts/floatingw.png"
theme.layout_magnifier = theme.dir.."/layouts/magnifierw.png"
theme.layout_max = theme.dir.."/layouts/maxw.png"
theme.layout_fullscreen = theme.dir.."/layouts/fullscreenw.png"
theme.layout_tilebottom = theme.dir.."/layouts/tilebottomw.png"
theme.layout_tileleft   = theme.dir.."/layouts/tileleftw.png"
theme.layout_tile = theme.dir.."/layouts/tilew.png"
theme.layout_tiletop = theme.dir.."/layouts/tiletopw.png"
theme.layout_spiral  = theme.dir.."/layouts/spiralw.png"
theme.layout_dwindle = theme.dir.."/layouts/dwindlew.png"
theme.layout_cornernw = theme.dir.."/layouts/cornernww.png"
theme.layout_cornerne = theme.dir.."/layouts/cornernew.png"
theme.layout_cornersw = theme.dir.."/layouts/cornersww.png"
theme.layout_cornerse = theme.dir.."/layouts/cornersew.png"
theme.layout_treetile = theme.dir.."/layouts/treetile.png"
theme.layout_machi = theme.dir.."/layouts/machi.png"

-- Volume
theme.widget_vol      = theme.dir .. "/icons/vol.png"
theme.widget_vol_low  = theme.dir .. "/icons/vol_low.png"
theme.widget_vol_no   = theme.dir .. "/icons/vol_no.png"
theme.widget_vol_mute = theme.dir .. "/icons/vol_mute.png"

-- Iconcs
theme.widget_mem = theme.dir .. "/icons/mem.png"
theme.widget_cpu = theme.dir .. "/icons/cpu.png"
theme.widget_temp = theme.dir .. "/icons/temp.png"
theme.widget_net = theme.dir .. "/icons/net.png"
theme.widget_hdd = theme.dir .. "/icons/hdd.png"
theme.widget_keyboard = theme.dir .. "/icons/hdd.png"

-- Generate Awesome icon:
--theme.awesome_icon = theme_assets.awesome_icon(
--    theme.menu_height, theme.bg_focus, theme.fg_focus
--)

local markup = lain.util.markup

-- Separators
local separators = lain.util.separators
local arrow = separators.arrow_left

-- Define the icon theme for application icons. If not set then the icons
-- from /usr/share/icons and /usr/share/icons/hicolor will be used.
theme.icon_theme = nil

-- Widgets params
local calendar_widget = require("awesome-wm-widgets.calendar-widget.calendar")
local weather_widget = require("awesome-wm-widgets.weather-widget.weather")
local spotify_widget = require("awesome-wm-widgets.spotify-widget.spotify")

-- Keyboard map indicator and switcher
local keyboardText = wibox.widget.textbox();
keyboardText:set_text(" ") 
theme.mykeyboardlayout = awful.widget.keyboardlayout()

-- FS ROOT
local fsicon = wibox.widget.imagebox(theme.widget_hdd)
theme.fs = lain.widget.fs({
    notification_preset = { fg = theme.fg_normal, bg = theme.bg_normal, font = theme.font_notify },
    settings = function()
        local fsp = string.format(" %3.2f %s ", fs_now["/"].free, fs_now["/"].units)
        widget:set_markup(markup.font(theme.font, fsp))
    end
})

-- MEM
local memicon = wibox.widget.imagebox(theme.widget_mem)
local mem = lain.widget.mem({
    settings = function()
        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " " .. mem_now.used .. " MB "))
    end
})

-- CPU
local cpuicon = wibox.widget.imagebox(theme.widget_cpu)
local cpu = lain.widget.cpu({
    settings = function()
        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " " .. cpu_now.usage .. " % "))
    end
})

-- CPU and GPU temps (lain, average)
local tempicon = wibox.widget.imagebox(theme.widget_temp)
local tempcpu = lain.widget.temp_ryzen({
    settings = function()
        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " cpu " .. coretemp_now .. "°C "))
    end
})
local tempgpu = lain.widget.temp_gpu({
    settings = function()
        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " gpu " .. coretemp_now .. "°C "))
    end
})

-- ALSA volume
local volicon = wibox.widget.imagebox(theme.widget_vol)
theme.volume = lain.widget.alsa({
    settings = function()
        if volume_now.status == "off" then
            volicon:set_image(theme.widget_vol_mute)
        elseif tonumber(volume_now.level) == 0 then
            volicon:set_image(theme.widget_vol_no)
        elseif tonumber(volume_now.level) <= 50 then
            volicon:set_image(theme.widget_vol_low)
        else
            volicon:set_image(theme.widget_vol)
        end

        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " " .. volume_now.level .. "% "))
    end
})
    
-- Net
local neticon = wibox.widget.imagebox(theme.widget_net)
local net = lain.widget.net({
    settings = function()
        widget:set_markup(markup.fontfg(theme.font, theme.widgetbar_fg, " " .. string.format("%5.1f", net_now.received) .. " ↓↑ " .. string.format("%5.1f", net_now.sent) .. " "))
    end
})

-- Weather widget
local myWeather = weather_widget({
    api_key='7df2ce22b859742524de7ab6c97a352d',
    coordinates = {49.261749, 13.903450},
    font_name = 'Carter One',
    show_hourly_forecast = true,
    show_daily_forecast = true,
}) 

-- Textclock widget
--local mytextclock = wibox.widget.textclock(" %a %d-%m-%Y %H:%M:%S ", 1)
local mytextclock = wibox.widget.textclock(markup.fontfg(theme.font, theme.widgetbar_fg, "%a %d-%m-%Y") .. markup.fontfg(theme.font_larger, theme.fg_minimize, " %H:%M:%S "), 1)

-- Calendar widget
local cw = calendar_widget({
    theme = 'outrun',
    placement = 'top_right'
})

-- Separators
local separator = wibox.widget.textbox()

-- Create a wibox for each screen and add it
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


-- {{{ Menu
-- Create a launcher widget and a main menu
myawesomemenu = {
   { "hotkeys", function() hotkeys_popup.show_help(nil, awful.screen.focused()) end },
   { "manual", terminal .. " -e man awesome" },
   { "edit config", editor_cmd .. " " .. awesome.conffile },
   { "restart", awesome.restart },
   { "quit", function() awesome.quit() end },
}

mymainmenu = awful.menu({ items = { { "awesome", myawesomemenu, theme.awesome_icon },
                                    { "open terminal", terminal }
                                  }
                        })
theme.mymainmenu = mymainmenu

mylauncher = awful.widget.launcher({ image = theme.awesome_icon,
                                     menu = mymainmenu })

local function set_wallpaper(s)
    -- Wallpaper
    if theme.wallpaper then
        local wallpaper = theme.wallpaper
        -- If wallpaper is a function, call it with the screen
        if type(wallpaper) == "function" then
            wallpaper = wallpaper(s)
        end
        gears.wallpaper.maximized(wallpaper, s, false)
    end
end

function theme.at_screen_connect(s)
    -- activate random seed by time
    math.randomseed(os.time());
    -- To guarantee unique random numbers on every platform, pop a few
    for i = 1,10 do
        math.random()
    end
    -- Each screen has its own tag table.
    --awful.tag({ "1", "2", "3", "4", "5", "6", "7", "8", "9" }, s, awful.layout.layouts[1])
    names = { "main", "www", "apps", "idea", "air", "water", "fire", "earth", "love" }
    l = awful.layout.suit  -- Just to save some typing: use an alias.
    layouts = { 
      awful.layout.layouts[1], --main
      awful.layout.layouts[2], --www
      awful.layout.layouts[2], --apps
      l.floating,              --idea
      l.magnifier,             --air
      l.max,                   --water
      awful.layout.layouts[5], --fire
      awful.layout.layouts[6], --earth
      l.max.fullscreen         --love
    }
    awful.tag(names, s, layouts)

    -- Create a promptbox for each screen
    s.mypromptbox = awful.widget.prompt()
    -- Create an imagebox widget which will contain an icon indicating which layout we're using.
    -- We need one layoutbox per screen.
    s.mylayoutbox = awful.widget.layoutbox(s)
    s.mylayoutbox:buttons(gears.table.join(
                           awful.button({ }, 1, function () awful.layout.inc( 1) end),
                           awful.button({ }, 3, function () awful.layout.inc(-1) end),
                           awful.button({ }, 4, function () awful.layout.inc( 1) end),
                           awful.button({ }, 5, function () awful.layout.inc(-1) end)))
    -- Create a taglist widget
    s.mytaglist = awful.widget.taglist {
        screen  = s,
        filter  = awful.widget.taglist.filter.all,
        buttons = taglist_buttons
    }

    -- Create a tasklist widget
    s.mytasklist = awful.widget.tasklist {
        screen  = s,
        filter  = awful.widget.tasklist.filter.currenttags,
        buttons = tasklist_buttons
    }

    -- Create the wibox
    s.mywibox = awful.wibar({ position = "top", screen = s })

    -- bind calendar with clock widget  
    mytextclock:connect_signal("button::press", 
        function(_, _, _, button)
            if button == 1 then cw.toggle() end
        end
    )

    -- test my first widget
    firstWidget = wibox.widget.textbox()
    firstWidget.text = "You are awesome!"
    
    -- separator type
    separator:set_text("  ")

    -- Add widgets to the wibox
    s.mywibox:setup {
        layout = wibox.layout.align.horizontal,
        { -- Left widgets
            layout = wibox.layout.fixed.horizontal,
            mylauncher,
            s.mytaglist,
            s.mypromptbox,
        },
        s.mytasklist, -- Middle widget
        { -- Right widgets
            layout = wibox.layout.fixed.horizontal,
            firstWidget,
            separator,
            spotify_widget({
                font = 'Hack Nerd Font 9',
                max_length = 50,
                play_icon = '/usr/share/icons/Papirus-Light/24x24/categories/spotify.svg',
                pause_icon = '/usr/share/icons/Papirus-Dark/24x24/panel/spotify-indicator.svg'
            }),
            separator,
            wibox.widget.systray(),
            separator,
            arrow("alpha", theme.arrow2_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { keyboardText, theme.mykeyboardlayout, layout = wibox.layout.align.horizontal }, 3, 6), theme.arrow2_bg),
            arrow(theme.arrow2_bg, theme.arrow1_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { fsicon, theme.fs.widget, layout = wibox.layout.align.horizontal }, 2, 3), theme.arrow1_bg),
            arrow(theme.arrow1_bg, theme.arrow2_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { memicon, mem.widget, layout = wibox.layout.align.horizontal }, 2, 3), theme.arrow2_bg),
            arrow(theme.arrow2_bg, theme.arrow1_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { cpuicon, cpu.widget, layout = wibox.layout.align.horizontal }, 3, 4), theme.arrow1_bg),
            arrow(theme.arrow1_bg, theme.arrow2_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { tempicon, tempcpu.widget, tempgpu.widget, layout = wibox.layout.align.horizontal }, 4, 4), theme.arrow2_bg),
            arrow(theme.arrow2_bg, theme.arrow1_bg),
            wibox.container.background(wibox.container.margin(myWeather, 3, 3), theme.arrow1_bg),
            arrow(theme.arrow1_bg, theme.arrow2_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { volicon, theme.volume.widget, layout = wibox.layout.align.horizontal }, 3, 3), theme.arrow2_bg),
            arrow(theme.arrow2_bg, theme.arrow1_bg),
            wibox.container.background(wibox.container.margin(wibox.widget { nil, neticon, net.widget, layout = wibox.layout.align.horizontal }, 3, 3), theme.arrow1_bg),
            arrow(theme.arrow1_bg, theme.arrow2_bg),
            wibox.container.background(wibox.container.margin(mytextclock, 4, 8), theme.arrow2_bg),
            arrow(theme.arrow2_bg, "alpha"),
            separator,
            s.mylayoutbox,
        },
    }

    -- Wallpaper Settings for each Tag
    -- Set wallpaper on first tab (else it would be empty at start up)
    local wp = wp_selected[1]
    if wp == "random" then wp = wp_random[1] end
    gears.wallpaper.maximized(path .. wp, s, false)
    -- For each screen
    for scr in screen do
      -- Go over each tab
      for t = 1,#wp_selected do
        local tag = scr.tags[t]
        tag:connect_signal("property::selected", function (tag)
          -- And if selected
          if not tag.selected then return end
          -- Set random wallpaper
          if wp_selected[t] == "random" then 
              local position = math.random(1, #wp_random)
              wp = wp_random[position]
          else 
              wp = wp_selected[t]
          end
          --gears.wallpaper.fit(path .. wp_selected[t], s)
          gears.wallpaper.maximized(path .. wp, s, false)
        end)
      end
    end
    -- }}}
    -- not used: set_wallpaper(s)
end

return theme

-- vim: filetype=lua:expandtab:shiftwidth=4:tabstop=8:softtabstop=4:textwidth=80
