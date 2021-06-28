local awful = require("awful")
local gears = require("gears")

-- Widget and layout library
local wibox = require("wibox")

-- Theme handling library
local beautiful = require("beautiful")
local dpi = require("beautiful.xresources").apply_dpi

-- {{ Helper to create mult tb buttons
local function create_title_button(c, color_focus, color_unfocus)
    local tb_color = wibox.widget {
        bg = color_focus,
        widget = wibox.container.background
    }

    local tb = wibox.widget {
        tb_color,
        width = 25,
        height = 20,
        strategy = "min",
        layout = wibox.layout.constraint
    }

    local function update()
        if client.focus == c then
            tb_color.bg = color_focus
        else
            tb_color.bg = color_unfocus
        end
    end
    update()
    c:connect_signal("focus", update)
    c:connect_signal("unfocus", update)

    client.connect_signal("property::floating", function(c)
        local b = false;
        if c.first_tag ~= nil then
            b = c.first_tag.layout.name == "floating"
        end
        if c.floating or b then
            tb.visible = true
        else
            tb.visible = false
        end
    end)

    client.connect_signal("manage", function(c)
        if c.floating or c.first_tag.layout.name == "floating" then
            tb.visible = true
        else
            tb.visible = false
        end
    end)

    tag.connect_signal("property::layout", function(t)
        local clients = t:clients()
        for k, c in pairs(clients) do
            if c.floating or c.first_tag.layout.name == "floating" then
                tb.visible = true
            else
                tb.visible = false
            end
        end
    end)

    return tb
end
-- }}

-- Add a titlebar if titlebars_enabled is set to true in the rules.
client.connect_signal("request::titlebars", function(c)
    -- buttons for the titlebar
    local buttons = gears.table.join(awful.button({}, 1, function()
        c:emit_signal("request::activate", "titlebar", {raise = true})
        if c.maximized == true then c.maximized = false end
        awful.mouse.client.move(c)
    end), awful.button({}, 3, function()
        c:emit_signal("request::activate", "titlebar", {raise = true})
        awful.mouse.client.resize(c)
    end))
    local borderbuttons = gears.table.join(
                              awful.button({}, 3, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.resize(c)
        end), awful.button({}, 1, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.resize(c)
        end))

    local close = create_title_button(c, beautiful.xcolor1, beautiful.xcolor0)
    close:connect_signal("button::press", function() c:kill() end)

    local floating =
        create_title_button(c, beautiful.xcolor5, beautiful.xcolor0)
    floating:connect_signal("button::press",
                            function() c.floating = not c.floating end)

    awful.titlebar(c, {position = "right", size = beautiful.titlebar_size}):setup{
        {close, layout = wibox.layout.flex.vertical},
        layout = wibox.layout.align.vertical
    }
    awful.titlebar(c, {position = "left", size = beautiful.titlebar_size}):setup{
        {floating, layout = wibox.layout.flex.vertical},
        layout = wibox.layout.align.vertical

    }
    awful.titlebar(c, {position = "bottom", size = beautiful.titlebar_size}):setup{
        buttons = borderbuttons,
        layout = wibox.layout.fixed.horizontal
    }
    awful.titlebar(c, {position = "top", size = beautiful.titlebar_size}):setup{
        buttons = borderbuttons,
        layout = wibox.layout.fixed.horizontal
    }
    awful.titlebar(c, {position = "top", size = beautiful.titlebar_size}):setup{
        { -- Left
            --            awful.titlebar.widget.iconwidget(c),
            floating,
            layout = wibox.layout.fixed.horizontal
        },
        { -- Middle
            buttons = buttons,
            layout = wibox.layout.flex.horizontal
        },
        { -- Right
            close,
            layout = wibox.layout.fixed.horizontal()
        },
        layout = wibox.layout.align.horizontal
    }
end)
