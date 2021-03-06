--  _ __ __ ___   _____ _ __  
-- | '__/ _` \ \ / / _ \ '_  \  Antonin Fischer (raven2cz)
-- | | | (_| |\ V /  __/ | | |  https://tonda-fischer.online/
-- |_|  \__,_| \_/ \___|_| |_|  https://github.com/raven2cz
--        
-- A customized rc.lua for awesomewm (https://awesomewm.org//) 

-- If LuaRocks is installed, make sure that packages installed through it are
-- found (e.g. lgi). If LuaRocks is not installed, do nothing.
pcall(require, "luarocks.loader")

-- Standard awesome library
local gears = require("gears")
local awful = require("awful")
require("awful.autofocus")
-- Widget and layout library
local wibox = require("wibox")
-- Theme handling library
local beautiful = require("beautiful")
-- Window Enhancements
local lain = require("lain")
-- Notification library
local naughty = require("naughty")
local menubar = require("menubar")
local hotkeys_popup = require("awful.hotkeys_popup")

-- special layouts import
local treetile = require("treetile")
-- local treetileBindings = require("treetile.bindings")
local machi = require("layout-machi")

-- classes and services
local dpi = require("beautiful.xresources").apply_dpi

local ipairs, string, os, table, tostring, tonumber, type, math = ipairs, string, os, table, tostring, tonumber, type, math

-- Enable hotkeys help widget for VIM and other apps
-- when client with a matching name is opened:
require("awful.hotkeys_popup.keys")

-- {{{ Error handling
-- Check if awesome encountered an error during startup and fell back to
-- another config (This code will only ever execute for the fallback config)
if awesome.startup_errors then
    naughty.notify({ preset = naughty.config.presets.critical,
                     title = "Oops, there were errors during startup!",
                     text = awesome.startup_errors })
end

-- Handle runtime errors after startup
do
    local in_error = false
    awesome.connect_signal("debug::error", function (err)
        -- Make sure we don't go into an endless error loop
        if in_error then return end
        in_error = true

        naughty.notify({ preset = naughty.config.presets.critical,
                         title = "Oops, an error happened!",
                         text = tostring(err) })
        in_error = false
    end)
end
-- }}}

-- MainMenu XMENU
local function xmenu()
    awful.spawn("/home/box/.config/xmenu/xmenu.sh")
end

-- This is used later as the default terminal and editor to run.
terminal = "urxvt"
editor = os.getenv("EDITOR") or "vim"
editor_cmd = terminal .. " -e " .. editor

-- Default modkey.
-- Usually, Mod4 is the key with a logo between Control and Alt.
-- If you do not like this or do not have such a key,
-- I suggest you to remap Mod4 to another key using xmodmap or other tools.
-- However, you can use another modifier like Mod1, but it may interact with others.
modkey  = "Mod4"
altkey  = "Mod1"
modkey1 = "Control"

-- THEMES
-- usr folder: beautiful.init(gears.filesystem.get_themes_dir() .. "default/theme.lua")
beautiful.init(gears.filesystem.get_configuration_dir() .. "/themes/amazing/theme.lua")

-- {{{ Layouts configuration
-- machi layout config
beautiful.layout_machi = machi.get_icon()
-- treetile layout bindings loading
--treetileBindings.init()

-- Table of layouts to cover with awful.layout.inc, order matters.
awful.layout.layouts = {
    treetile,
    machi.default_layout,
    awful.layout.suit.tile,
    awful.layout.suit.floating,
    lain.layout.centerwork,
    lain.layout.termfair.center,
    awful.layout.suit.spiral,
    awful.layout.suit.magnifier,
    awful.layout.suit.max,
    awful.layout.suit.max.fullscreen,
    -- lain.layout.cascade,
    -- lain.layout.cascade.tile,
    -- lain.layout.termfair,
    -- awful.layout.suit.tile.left,
    -- awful.layout.suit.tile.bottom,
    -- awful.layout.suit.tile.top,
    -- awful.layout.suit.fair,
    -- awful.layout.suit.fair.horizontal,
    -- awful.layout.suit.spiral.dwindle,
    -- awful.layout.suit.corner.nw,
    -- awful.layout.suit.corner.ne,
    -- awful.layout.suit.corner.sw,
    -- awful.layout.suit.corner.se,
}

lain.layout.termfair.nmaster           = 3
lain.layout.termfair.ncol              = 1
lain.layout.termfair.center.nmaster    = 3
lain.layout.termfair.center.ncol       = 1
lain.layout.cascade.tile.offset_x      = dpi(2)
lain.layout.cascade.tile.offset_y      = dpi(32)
lain.layout.cascade.tile.extra_padding = dpi(5)
lain.layout.cascade.tile.nmaster       = 5
lain.layout.cascade.tile.ncol          = 2
-- }}}

-- Menubar configuration
menubar.utils.terminal = terminal -- Set the terminal for applications that require it
-- }}}

-- Create a wibox for each screen and add it
awful.screen.connect_for_each_screen(function(s) beautiful.at_screen_connect(s) end)
-- }}}

-- {{{ Mouse bindings
root.buttons(gears.table.join(
    awful.button({ }, 3, function () xmenu() end),
    awful.button({ }, 4, awful.tag.viewnext),
    awful.button({ }, 5, awful.tag.viewprev)
))
-- }}}

-- {{{ Key bindings
globalkeys = gears.table.join(
    
    --{{ Personal custom key bindings

    -- machi layout special keybindings
    awful.key({ modkey,           }, ".", function () machi.default_editor.start_interactive() end,
        {description = "machi: edit the current machi layout", group = "layout"}),
    awful.key({ modkey,           }, "/", function () machi.switcher.start(client.focus) end,
        {description = "machi: switch between windows", group = "layout"}),

    -- treetile layout special keybindings
    awful.key({ modkey }, "x", treetile.vertical,
        {description = "treetile.vertical split", group = "layout"}),
    awful.key({ modkey }, "z", treetile.horizontal,
        {description = "treetile.horizontal split", group = "layout"}),

    -- resize clients with arrows
    awful.key({ modkey, altkey   }, "Right", function ()
        local c = client.focus
        if awful.layout.get(c.screen).name ~= "treetile" then
            awful.tag.incmwfact(0.05)
        else
            treetile.resize_horizontal(0.1) 
            -- increase or decrease by percentage of current width or height, 
            -- the value can be from 0.01 to 0.99, negative or postive
        end 
        end,
        {description = "layout.extends right", group = "layout"}),   
        awful.key({ modkey, altkey   }, "Left", function ()
        local c = client.focus
        if awful.layout.get(c.screen).name ~= "treetile" then
            awful.tag.incmwfact(-0.05) 
        else
            treetile.resize_horizontal(-0.1) 
            -- increase or decrease by percentage of current width or height, 
            -- the value can be from 0.01 to 0.99, negative or postive
        end 
        end,
        {description = "layout.extends left", group = "layout"}), 
    awful.key({ modkey, altkey   }, "Up", function () 
        local c = client.focus
        if awful.layout.get(c.screen).name ~= "treetile" then
            awful.tag.incmwfact(0.05) 
        else
            treetile.resize_vertical(-0.1)
        end 
        end,
        {description = "layout.extends up", group = "layout"}),
    awful.key({ modkey, altkey   }, "Down", function () 
        local c = client.focus
        if awful.layout.get(c.screen).name ~= "treetile" then
            awful.tag.incmwfact(-0.05) 
        else
            treetile.resize_vertical(0.1)
        end 
        end,
        {description = "layout.extends down", group = "layout"}),

    -- swap client with arrows
    awful.key({ modkey, "Shift"  }, "Right", function ()
          awful.client.swap.byidx(1)
        end,
        {description = "layout.client.swap right", group = "layout"}),   
        awful.key({ modkey, "Shift"  }, "Left", function ()
          awful.client.swap.byidx(-1)
        end,
        {description = "layout.client.swap left", group = "layout"}), 
    awful.key({ modkey, "Shift" }, "Up", function () 
          awful.client.swap.byidx(1)
        end,
        {description = "layout.client.swap up", group = "layout"}),
    awful.key({ modkey, "Shift" }, "Down", function () 
          awful.client.swap.byidx(-1)
        end,
        {description = "layout.client.swap down", group = "layout"}),

    -- focus client with arrows
    awful.key({ modkey, modkey1 }, "Right", function ()
          awful.client.focus.bydirection("right")
        end,
        {description = "layout.client.focus right", group = "layout"}),   
    awful.key({ modkey, modkey1 }, "Left", function ()
          awful.client.focus.bydirection("left")
        end,
        {description = "layout.client.focus left", group = "layout"}), 
    awful.key({ modkey, modkey1 }, "Up", function () 
          awful.client.focus.bydirection("up")
        end,
        {description = "layout.client.focus up", group = "layout"}),
    awful.key({ modkey, modkey1 }, "Down", function () 
          awful.client.focus.bydirection("down")
        end,
        {description = "layout.client.focus down", group = "layout"}),

    awful.key({ "Shift" }, "Alt_L", function () beautiful.mykeyboardlayout.next_layout(); end),
    
    -- Print Screen
    awful.key({ }, "Print", function () 
                  awful.util.spawn("scrot -e 'mv $f ~/Pictures/screenshots/ 2>/dev/null'", false) 
                  awful.util.spawn("notify-send \"SCROT\" \"Screenshot created!\"", false)
              end,
              {description="Make screenshot to ~/Pictures/screenshots/", group="awesome"}),
    
    -- Lock Support
    awful.key({ modkey,           }, "Home", function () awful.spawn("i3exit lock") end,
              {description="Lock Screen", group="awesome"}),
    awful.key({ modkey,           }, "F12", function () awful.spawn("i3exit suspend") end,
              {description="Suspend Computer", group="awesome"}),
    
    -- ROFI Support
    awful.key({ modkey,           }, "s",      function () awful.spawn("rofi -show-icons -modi windowcd,window,drun -show drun") end,
              {description="show rofi drun", group="launcher"}),
    
    -- Layout and Gaps Support
    awful.key({ modkey, modkey1 }, "=", function () lain.util.useless_gaps_resize(1) end),

    awful.key({ modkey, modkey1 }, "-", function () lain.util.useless_gaps_resize(-1) end),
    
    -- Widgets popups
    awful.key({ altkey, }, "h", function () if beautiful.fs then beautiful.fs.show(7) end end,
              {description = "show filesystem", group = "widgets"}),
    -- ALSA volume control
    awful.key({ }, "XF86AudioRaiseVolume",
        function ()
            os.execute(string.format("amixer -q set %s 1%%+", beautiful.volume.channel))
            beautiful.volume.update()
        end),
    awful.key({ }, "XF86AudioLowerVolume",
        function ()
            os.execute(string.format("amixer -q set %s 1%%-", beautiful.volume.channel))
            beautiful.volume.update()
        end),
    awful.key({ }, "XF86AudioMute",
        function ()
            os.execute(string.format("amixer -q set %s toggle", beautiful.volume.togglechannel or beautiful.volume.channel))
            beautiful.volume.update()
        end),
    awful.key({ modkey1, "Shift" }, "m",
        function ()
            os.execute(string.format("amixer -q set %s 100%%", beautiful.volume.channel))
            beautiful.volume.update()
        end),
    awful.key({ modkey1, "Shift" }, "0",
        function ()
            os.execute(string.format("amixer -q set %s 0%%", beautiful.volume.channel))
            beautiful.volume.update()
        end),
    
    -- }}
    
    -- Navigation
    awful.key({ modkey, modkey1   }, "s",      hotkeys_popup.show_help,
              {description="show help", group="awesome"}),
    awful.key({ modkey,           }, "Left",   awful.tag.viewprev,
              {description = "view previous", group = "tag"}),
    awful.key({ modkey,           }, "Right",  awful.tag.viewnext,
              {description = "view next", group = "tag"}),
    awful.key({ modkey            }, "Escape", awful.tag.history.restore,
              {description = "go back", group = "tag"}),

    awful.key({ modkey,           }, "j",
        function ()
            awful.client.focus.byidx( 1)
        end,
        {description = "focus next by index", group = "client"}
    ),
    awful.key({ modkey,           }, "k",
        function ()
            awful.client.focus.byidx(-1)
        end,
        {description = "focus previous by index", group = "client"}
    ),

    -- Layout manipulation
    awful.key({ modkey, "Shift"   }, "j", function () awful.client.swap.byidx(  1)    end,
              {description = "swap with next client by index", group = "client"}),
    awful.key({ modkey, "Shift"   }, "k", function () awful.client.swap.byidx( -1)    end,
              {description = "swap with previous client by index", group = "client"}),
    awful.key({ modkey, "Control" }, "j", function () awful.screen.focus_relative( 1) end,
              {description = "focus the next screen", group = "screen"}),
    awful.key({ modkey, "Control" }, "k", function () awful.screen.focus_relative(-1) end,
              {description = "focus the previous screen", group = "screen"}),
    awful.key({ modkey,           }, "u", awful.client.urgent.jumpto,
              {description = "jump to urgent client", group = "client"}),
    awful.key({ modkey,           }, "Tab",
        function ()
            awful.client.focus.history.previous()
            if client.focus then
                client.focus:raise()
            end
        end,
        {description = "go back", group = "client"}),

    -- Standard program
    awful.key({ modkey,           }, "Return", function () awful.spawn(terminal) end,
              {description = "open a terminal", group = "launcher"}),
    awful.key({ modkey, modkey1   }, "r", awesome.restart,
              {description = "reload awesome", group = "awesome"}),
    awful.key({ modkey, "Shift"   }, "q", awesome.quit,
              {description = "quit awesome", group = "awesome"}),

    -- layout and client manipulation
    awful.key({ modkey,           }, "l",     function () awful.tag.incmwfact( 0.05)          end,
              {description = "increase master width factor", group = "layout"}),
    awful.key({ modkey,           }, "h",     function () awful.tag.incmwfact(-0.05)          end,
              {description = "decrease master width factor", group = "layout"}),
    awful.key({ modkey, "Shift"   }, "h",     function () awful.tag.incnmaster( 1, nil, true) end,
              {description = "increase the number of master clients", group = "layout"}),
    awful.key({ modkey, "Shift"   }, "l",     function () awful.tag.incnmaster(-1, nil, true) end,
              {description = "decrease the number of master clients", group = "layout"}),
    awful.key({ modkey, "Control" }, "h",     function () awful.tag.incncol( 1, nil, true)    end,
              {description = "increase the number of columns", group = "layout"}),
    awful.key({ modkey, "Control" }, "l",     function () awful.tag.incncol(-1, nil, true)    end,
              {description = "decrease the number of columns", group = "layout"}),
    awful.key({ modkey,           }, "space", function () awful.layout.inc( 1)                end,
              {description = "select next", group = "layout"}),
    awful.key({ modkey, "Shift"   }, "space", function () awful.layout.inc(-1)                end,
              {description = "select previous", group = "layout"}),

    awful.key({ modkey, modkey1   }, "n",
              function ()
                  local c = awful.client.restore()
                  -- Focus restored client
                  if c then
                    c:emit_signal(
                        "request::activate", "key.unminimize", {raise = true}
                    )
                  end
              end,
              {description = "restore minimized", group = "client"}),

    -- Prompt
    awful.key({ modkey },            "r",     function () awful.screen.focused().mypromptbox:run() end,
              {description = "run prompt", group = "launcher"}),

    awful.key({ modkey, "Shift" }, "x",
              function ()
                  awful.prompt.run {
                    prompt       = "Run Lua code: ",
                    textbox      = awful.screen.focused().mypromptbox.widget,
                    exe_callback = awful.util.eval,
                    history_path = awful.util.get_cache_dir() .. "/history_eval"
                  }
              end,
              {description = "lua execute prompt", group = "launcher"}),

    -- Show Main Menu
    awful.key({ modkey,           }, "w", function () xmenu() end,
              {description = "show main menu", group = "launcher"}),

    -- Menubar like DMENU
    awful.key({ modkey }, "p", function() menubar.show() end,
              {description = "show the menubar", group = "launcher"})
)

clientkeys = gears.table.join(
    -- {{ Personal keybindings

    -- swap and rotate clients in treetile layout
    awful.key({ modkey, "Shift" }, "r", function (c) treetile.rotate(c) end,
        {description = "treetile.container.rotate", group = "layout"}),
    awful.key({ modkey, "Shift" }, "s", function (c) treetile.swap(c) end,
        {description = "treetile.container.swap", group = "layout"}),

    -- transparency for focused client
    awful.key({ modkey }, "Next", function (c) awful.util.spawn("transset-df -a --inc 0.20 --max 0.99") end,
      {description="Client Transparency Up", group="client"}),
    awful.key({ modkey }, "Prior", function (c) awful.util.spawn("transset-df -a --min 0.1 --dec 0.1") end,
      {description="Client Transparency Down", group="client"}),  

    -- show/hide titlebar
    awful.key({ modkey,           }, "t", awful.titlebar.toggle,
              {description = "Show/Hide Titlebars", group="client"}),
    -- }}
    awful.key({ modkey,           }, "f",
        function (c)
            c.fullscreen = not c.fullscreen
            c:raise()
        end,
        {description = "toggle fullscreen", group = "client"}),
    awful.key({ modkey, "Shift"   }, "c",      function (c) c:kill()                         end,
              {description = "close", group = "client"}),
    awful.key({ modkey, "Control" }, "space",  awful.client.floating.toggle                     ,
              {description = "toggle floating", group = "client"}),
    awful.key({ modkey, "Control" }, "Return", function (c) c:swap(awful.client.getmaster()) end,
              {description = "move to master", group = "client"}),
    awful.key({ modkey,           }, "o",      function (c) c:move_to_screen()               end,
              {description = "move to screen", group = "client"}),
    awful.key({ modkey, "Control" }, "t",      function (c) c.ontop = not c.ontop            end,
              {description = "toggle keep on top", group = "client"}),
    awful.key({ modkey,           }, "n",
        function (c)
            -- The client currently has the input focus, so it cannot be
            -- minimized, since minimized clients can't have the focus.
            c.minimized = true
        end ,
        {description = "minimize", group = "client"}),
    awful.key({ modkey,           }, "m",
        function (c)
            c.maximized = not c.maximized
            c:raise()
        end ,
        {description = "(un)maximize", group = "client"}),
    awful.key({ modkey, "Control" }, "m",
        function (c)
            c.maximized_vertical = not c.maximized_vertical
            c:raise()
        end ,
        {description = "(un)maximize vertically", group = "client"}),
    awful.key({ modkey, "Shift"   }, "m",
        function (c)
            c.maximized_horizontal = not c.maximized_horizontal
            c:raise()
        end ,
        {description = "(un)maximize horizontally", group = "client"})
)

-- Bind all key numbers to tags.
-- Be careful: we use keycodes to make it work on any keyboard layout.
-- This should map on the top row of your keyboard, usually 1 to 9.
for i = 1, 9 do
    globalkeys = gears.table.join(globalkeys,
        -- View tag only.
        awful.key({ modkey }, "#" .. i + 9,
                  function ()
                        local screen = awful.screen.focused()
                        local tag = screen.tags[i]
                        if tag then
                           tag:view_only()
                        end
                  end,
                  {description = "view tag #"..i, group = "tag"}),
        -- Toggle tag display.
        awful.key({ modkey, "Control" }, "#" .. i + 9,
                  function ()
                      local screen = awful.screen.focused()
                      local tag = screen.tags[i]
                      if tag then
                         awful.tag.viewtoggle(tag)
                      end
                  end,
                  {description = "toggle tag #" .. i, group = "tag"}),
        -- Move client to tag.
        awful.key({ modkey, "Shift" }, "#" .. i + 9,
                  function ()
                      if client.focus then
                          local tag = client.focus.screen.tags[i]
                          if tag then
                              client.focus:move_to_tag(tag)
                          end
                     end
                  end,
                  {description = "move focused client to tag #"..i, group = "tag"}),
        -- Toggle tag on focused client.
        awful.key({ modkey, "Control", "Shift" }, "#" .. i + 9,
                  function ()
                      if client.focus then
                          local tag = client.focus.screen.tags[i]
                          if tag then
                              client.focus:toggle_tag(tag)
                          end
                      end
                  end,
                  {description = "toggle focused client on tag #" .. i, group = "tag"})
    )
end

-- Mouse Operations
clientbuttons = gears.table.join(
    awful.button({ }, 1, function (c)
        c:emit_signal("request::activate", "mouse_click", {raise = true})
    end),
    awful.button({ modkey }, 1, function (c)
        c:emit_signal("request::activate", "mouse_click", {raise = true})
        awful.mouse.client.move(c)
    end),
    awful.button({ modkey }, 3, function (c)
        c:emit_signal("request::activate", "mouse_click", {raise = true})
        awful.mouse.client.resize(c)
    end)
)

-- Set keys
root.keys(globalkeys)
-- }}}

-- {{{ Rules
-- Rules to apply to new clients (through the "manage" signal).
awful.rules.rules = {
    -- All clients will match this rule.
    { rule = { },
      properties = { border_width = beautiful.border_width,
                     border_color = beautiful.border_normal,
                     focus = awful.client.focus.filter,
                     raise = true,
                     keys = clientkeys,
                     buttons = clientbuttons,
                     screen = awful.screen.preferred,
                     placement = awful.placement.no_overlap+awful.placement.no_offscreen
     }
    },

 -- Floating clients.
    { rule_any = {
        instance = {
          "DTA",  -- Firefox addon DownThemAll.
          "copyq",  -- Includes session name in class.
          "pinentry",
        },
        class = {
          "Arandr",
          "Blueman-manager",
          "Gpick",
          "Kruler",
          "MessageWin",  -- kalarm.
          "Sxiv",
          "Tor Browser", -- Needs a fixed window size to avoid fingerprinting by screen size.
          "Wpa_gui",
          "veromix",
          "xtightvncviewer",
          "Pamac-manager",
          "Polkit-gnome-authentication-agent-1",
          "Polkit-kde-authentication-agent-1",
          "Gcr-prompter",
        },

        -- Note that the name property shown in xprop might be set slightly after creation of the client
        -- and the name shown there might not match defined rules here.
        name = {
          "Event Tester",  -- xev.
          "Remmina Remote Desktop Client",
          "win0",
        },
        role = {
          "AlarmWindow",  -- Thunderbird's calendar.
          "ConfigManager",-- Thunderbird's about:config.
          "pop-up",       -- e.g. Google Chrome's (detached) Developer Tools.
        }
      }, properties = { floating = true },
         callback = function (c)
           awful.placement.centered(c, nil)
         end
    },
    -- All Dialogs are floating and center
    { rule_any = {
        type = { "dialog" }
      }, 
      except_any = {
        -- place here exceptions for special dialogs windows
      },
      properties = { floating = true },
      callback = function (c)
        awful.placement.centered(c, nil)
      end
    },
    -- FullHD Resolution for Specific Apps
    { rule_any = {
        instance = {
          "remmina",
        }
      }, 
      except_any = {
        name = {
          "Remmina Remote Desktop Client"
        }
      },
      properties = { floating = true },
      callback = function (c)
        c.width = 1980
        c.height = 1080
        awful.placement.centered(c, nil)
      end
    },
    -- Add titlebars to normal clients and dialogs
    { rule_any = {
          type = { "normal", "dialog" }
      }, 
      properties = { titlebars_enabled = true }
    },

    -- Set Firefox to always map on the tag named "2" on screen 1.
    -- { rule = { class = "Firefox" },
    --   properties = { screen = 1, tag = "2" } },
}
-- }}}

-- {{{ Signals
-- Signal function to execute when a new client appears.
client.connect_signal("manage", function (c)
    -- Set the windows at the slave,
    -- i.e. put it at the end of others instead of setting it master.
    if not awesome.startup then awful.client.setslave(c) end

    if awesome.startup
      and not c.size_hints.user_position
      and not c.size_hints.program_position then
        -- Prevent clients from being unreachable after screen count changes.
        awful.placement.no_offscreen(c)
    end
end)

-- Add a titlebar if titlebars_enabled is set to true in the rules.
client.connect_signal("request::titlebars", function(c)
    -- buttons for the titlebar
    local buttons = gears.table.join(
        awful.button({ }, 1, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.move(c)
        end),
        awful.button({ }, 3, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.resize(c)
        end)
    )

    awful.titlebar(c) : setup {
        { -- Left
            awful.titlebar.widget.iconwidget(c),
            buttons = buttons,
            layout  = wibox.layout.fixed.horizontal
        },
        { -- Middle
            { -- Title
                align  = "center",
                widget = awful.titlebar.widget.titlewidget(c)
            },
            buttons = buttons,
            layout  = wibox.layout.flex.horizontal
        },
        { -- Right
            awful.titlebar.widget.floatingbutton (c),
            awful.titlebar.widget.maximizedbutton(c),
            awful.titlebar.widget.stickybutton   (c),
            awful.titlebar.widget.ontopbutton    (c),
            awful.titlebar.widget.closebutton    (c),
            layout = wibox.layout.fixed.horizontal()
        },
        layout = wibox.layout.align.horizontal
    }

    awful.titlebar.hide(c)
end)

-- Enable sloppy focus, so that focus follows mouse.
client.connect_signal("mouse::enter", function(c)
    c:emit_signal("request::activate", "mouse_enter", {raise = false})
end)

client.connect_signal("focus", function(c) c.border_color = beautiful.border_focus end)
client.connect_signal("unfocus", function(c) c.border_color = beautiful.border_normal end)
-- }}}


--{{{ Application Starts
awful.spawn.with_shell("~/.config/awesome/autorun.sh")
--}}}
