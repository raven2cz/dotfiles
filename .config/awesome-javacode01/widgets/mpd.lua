-- THIS WORK IS NOT ALL MINE
-- Special thanks to eredarion, who also based their work off of elenapan
--
-- https://github.com/Eredarion/dotfiles
-- NOTE:
-- This widget runs a script in the background
-- When awesome restarts, its process will remain alive!
-- Don't worry though! The cleanup script that runs in rc.lua takes care of it :)
local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local naughty = require("naughty")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi

local helpers = require("helpers")
local pad = helpers.pad

-- Set colors
------------------------------------------------------------
local title_color = beautiful.xcolor6
local artist_color = beautiful.xcolor4
local paused_color = beautiful.xcolor1
------------------------------------------------------------

local artist_fg
local artist_bg

local seek_state = false

-- Control icons
local icon_font_nerd = "FiraCode Nerd Font Mono 18"

local icons = require("icons")
icons.init("sheets")

-- Set notification icon path
local notification_icon = icons.music

-- Construct layouts
--------------------------------------------------------------------------------

-- Progressbar
------------------------------------------------------------

local bar = wibox.widget {
    value = 64,
    max_value = 100,
    forced_height = dpi(8),
    forced_width = dpi(180),
    color = {
        type = 'linear',
        from = {0, 0},
        to = {200, 50}, -- replace with w,h later
        stops = {{0, beautiful.xcolor6}, {0.75, beautiful.xcolor4}}
    },
    background_color = beautiful.xbackground,
    shape = helpers.rrect(dpi(6)),
    bar_shape = helpers.rrect(dpi(6)),
    widget = wibox.widget.progressbar
}

local bar_timer = gears.timer {
    timeout = 3,
    call_now = true,
    autostart = true,
    callback = function()
        awful.spawn.easy_async_with_shell("mpc -f '%time%'", function(stdout)
            bar.value = tonumber(stdout:match('[(]+(%d+)'))
        end)
    end
}
------------------------------------------------------------

-- Poster (image)
------------------------------------------------------------
local box_image = wibox.widget {
    shape = helpers.rrect(dpi(10)),
    widget = wibox.widget.imagebox
}
box_image.image = beautiful.music_icon
local image_cont = wibox.widget {
    box_image,
    shape = helpers.rrect(dpi(6)),
    bg = beautiful.xcolor8 .. "33",
    widget = wibox.container.background
}
------------------------------------------------------------

-- Text lines
------------------------------------------------------------
local mpd_title = wibox.widget.textbox("Title")
local mpd_artist = wibox.widget.textbox("Artist")
mpd_title:set_font(beautiful.font)
mpd_title:set_valign("top")
mpd_artist:set_font("JetBrains Mono 14")
mpd_artist:set_valign("top")

local text_area = wibox.layout.fixed.vertical()
text_area:add(wibox.container.constraint(mpd_artist, "exact", nil, dpi(26)))
text_area:add(wibox.container.constraint(mpd_title, "exact", nil, dpi(26)))
------------------------------------------------------------

-- Control line
------------------------------------------------------------
local btn_color = beautiful.xcolor15
-- playback buttons
local player_buttons = wibox.layout.fixed.horizontal()
local prev_button = wibox.widget.textbox(
                        "<span font=\"" .. icon_font_nerd .. "\" color=\"" ..
                            btn_color .. "\"></span>")
player_buttons:add(wibox.container.margin(prev_button, dpi(0), dpi(0), dpi(6),
                                          dpi(6)))

local play_button = wibox.widget.textbox(
                        "<span font=\"" .. icon_font_nerd .. "\" color=\"" ..
                            btn_color .. "\"></span>")
player_buttons:add(wibox.container.margin(play_button, dpi(14), dpi(14), dpi(6),
                                          dpi(6)))

local next_button = wibox.widget.textbox(
                        "<span font=\"" .. icon_font_nerd .. "\" color=\"" ..
                            btn_color .. "\"></span>")
player_buttons:add(wibox.container.margin(next_button, dpi(0), dpi(0), dpi(6),
                                          dpi(6)))
------------------------------------------------------------

-- Full line
local buttons_align = wibox.layout.align.horizontal()
buttons_align:set_expand("outside")
buttons_align:set_middle(player_buttons)

local control_align = wibox.layout.align.horizontal()
control_align:set_middle(buttons_align)
control_align:set_right(nil)
control_align:set_left(nil)
------------------------------------------------------------

-- Bring it all together
------------------------------------------------------------
local align_vertical = wibox.layout.align.vertical()
align_vertical:set_top(text_area)
align_vertical:set_middle(control_align)
align_vertical:set_bottom(wibox.container.constraint(bar, "exact", nil, dpi(8)))
local area = wibox.layout.fixed.horizontal()
area:add(image_cont)
area:add(wibox.container.margin(align_vertical, dpi(30), dpi(20), 0, 0))
area.bg = beautiful.xcolor0

local main_wd = wibox.widget {
    area,
    left = dpi(20),
    right = dpi(3),
    forced_width = dpi(200),
    forced_height = dpi(100),
    shape = helpers.rrect(dpi(6)),
    bg = beautiful.xcolor0,
    widget = wibox.container.margin
}
------------------------------------------------------------
--------------------------------------------------------------------------------

-- Buttons
------------------------------------------------------------
bar:buttons(gears.table.join(awful.button({}, 1, function()
    seek_state = true
    awful.spawn.with_shell("mpc seek +6%")
    bar_timer:emit_signal("timeout")
end), awful.button({}, 3, function()
    seek_state = true
    awful.spawn.with_shell("mpc seek -6%")
    bar_timer:emit_signal("timeout")
end), awful.button({}, 4, function()
    seek_state = true
    awful.spawn.with_shell("mpc seek +3%")
    bar_timer:emit_signal("timeout")
end), awful.button({}, 5, function()
    seek_state = true
    awful.spawn.with_shell("mpc seek -3%")
    bar_timer:emit_signal("timeout")
end)))
image_cont:buttons(gears.table.join(awful.button({}, 1, function()
    awful.spawn.with_shell("mpc toggle")
end)))
text_area:buttons(gears.table.join(awful.button({}, 1, function()
    awful.spawn.with_shell("mpc toggle")
end)))
play_button:buttons(gears.table.join(awful.button({}, 1, function()
    awful.spawn.with_shell("mpc toggle")
end)))
prev_button:buttons(gears.table.join(awful.button({}, 1, function()
    awful.spawn.with_shell("mpc prev")
end)))
next_button:buttons(gears.table.join(awful.button({}, 1, function()
    awful.spawn.with_shell("mpc next")
end)))
------------------------------------------------------------

-- Notification
------------------------------------------------------------
local last_notification_id
local function send_notification(artist, title, icon)
    notification = naughty.notify({
        title = artist,
        text = title,
        icon = icon,
        timeout = 4,
        replaces_id = last_notification_id
    })
    last_notification_id = notification.id
end
------------------------------------------------------------

local music_directory = "Music"

-- Main script
------------------------------------------------------------
local script = [[bash -c '
  IMG_REG="(front|cover|art)\.(jpg|jpeg|png|gif)$"
  DEFAULT_ART="$HOME/Pictures/personal_icon/icon_nobg.png"

  file=`mpc current -f %file%`
  info=`mpc -f "%artist%@@%title%@"`
  
  art="$HOME/]] .. music_directory .. [[/${file%/*}"

  if ]] .. "[[ -d $art ]];" .. [[ then
    cover="$(find "$art/" -maxdepth 1 -type f | egrep -i -m1 "$IMG_REG")"
  fi
  cover="${cover:=$DEFAULT_ART}"

  # convert "$cover" -resize 250x250 "resize.$cover"

  echo $info"##"$cover"##"
']]
------------------------------------------------------------

-- Update widget
------------------------------------------------------------
local function update_widget()
    awful.spawn.easy_async(script, function(stdout)

        bar_timer:emit_signal("timeout")

        local artist = stdout:match('(.*)@@')
        local title = stdout:match('@@(.*)@')
        local cover_path = stdout:match('##(.*)##')
        local status = stdout:match('%[(.*)%]')
        status = string.gsub(status, '^%s*(.-)%s*$', '%1')

        local artist_span = "|   " .. artist .. "    "
        local title_span = "|   " .. title .. "    "

        if status == "paused" then
            bar_timer:stop()
            artist_fg = paused_color
            title_fg = paused_color
            play_button.markup = "<span font=\"" .. icon_font_nerd ..
                                     "\" color=\"" .. btn_color ..
                                     "\"></span>"
        else
            bar_timer:start()
            artist_fg = artist_color
            title_fg = title_color
            play_button.markup = "<span font=\"" .. icon_font_nerd ..
                                     "\" color=\"" .. btn_color ..
                                     "\"></span>"
            if sidebar.visible == false then
                -- bar_timer:stop()
                send_notification(artist_span, title_span, cover_path)
            end

        end

        -- Escape &'s
        title = string.gsub(title, "&", "&amp;")
        artist = string.gsub(artist, "&", "&amp;")
        box_image:set_image(cover_path)

        mpd_title.markup = "<span foreground='" .. title_fg .. "'>" .. title ..
                               "</span>"
        mpd_artist.markup =
            "<span foreground='" .. artist_fg .. "'>" .. artist .. "</span>"

        collectgarbage()
    end)
end

update_widget()
------------------------------------------------------------

-- To wait "events" and refresh widget
------------------------------------------------------------
local mpd_script = [[
  bash -c '
    mpc idleloop player
  ']]

awful.spawn.with_line_callback(mpd_script, {
    stdout = function(line)
        if (seek_state) then
            seek_state = false
        else
            update_widget()
        end
    end
})
------------------------------------------------------------

return main_wd
