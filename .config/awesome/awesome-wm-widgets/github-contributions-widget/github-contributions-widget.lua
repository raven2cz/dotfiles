-------------------------------------------------
-- Github Contributions Widget for Awesome Window Manager
-- Shows the contributions graph
-- More details could be found here:
-- https://github.com/streetturtle/awesome-wm-widgets/tree/master/github-contributions-widget

-- @author Pavel Makhov
-- @copyright 2020 Pavel Makhov
-------------------------------------------------

local awful = require("awful")
local naughty = require("naughty")
local wibox = require("wibox")
local gears = require("gears")
local widget_themes = require("awesome-wm-widgets.github-contributions-widget.themes")

local GET_CONTRIBUTIONS_CMD = [[bash -c "curl -s https://github-contributions.vercel.app/api/v1/%s]]
    .. [[ | jq -r '[.contributions[] ]]
    .. [[ | select ( .date | strptime(\"%%Y-%%m-%%d\") | mktime < now)][:%s]| .[].intensity'"]]

local github_contributions_widget = wibox.widget{
    reflection = {
        horizontal = true,
        vertical = true,
    },
    widget = wibox.container.mirror
}

local function show_warning(message)
    naughty.notify{
        preset = naughty.config.presets.critical,
        title = 'Github Contributions Widget',
        text = message}
end

local function worker(user_args)

    local args = user_args or {}
    local username = args.username or 'streetturtle'
    local days = args.days or 365
    local color_of_empty_cells = args.color_of_empty_cells
    local with_border = args.with_border
    local margin_top = args.margin_top or 1
    local theme = args.theme or 'standard'

    if widget_themes[theme] == nil then
        show_warning('Theme ' .. theme .. ' does not exist')
        theme = 'standard'
    end

    if with_border == nil then with_border = true end

    local function get_square(color)
        if color_of_empty_cells ~= nil and color == widget_themes[theme][0] then
            color = color_of_empty_cells
        end

        return wibox.widget{
            fit = function()
                return 3, 3
            end,
            draw = function(_, _, cr, _, _)
                cr:set_source(gears.color(color))
                cr:rectangle(0, 0, with_border and 2 or 3, with_border and 2 or 3)
                cr:fill()
            end,
            layout = wibox.widget.base.make_widget
        }
    end

    local col = {layout = wibox.layout.fixed.vertical}
    local row = {layout = wibox.layout.fixed.horizontal}
    local day_idx = 5 - os.date('%w')
    for _ = 0, day_idx do
        table.insert(col, get_square(color_of_empty_cells))
    end

    local update_widget = function(_, stdout, _, _, _)
        for intensity in stdout:gmatch("[^\r\n]+") do
            if day_idx %7 == 0 then
                table.insert(row, col)
                col = {layout = wibox.layout.fixed.vertical}
            end
            table.insert(col, get_square(widget_themes[theme][tonumber(intensity)]))
            day_idx = day_idx + 1
        end
        github_contributions_widget:setup(
            {
                row,
                top = margin_top,
                layout = wibox.container.margin
            }
        )
    end

    awful.spawn.easy_async(string.format(GET_CONTRIBUTIONS_CMD, username, days),
        function(stdout)
            update_widget(github_contributions_widget, stdout)
        end)

    return github_contributions_widget
end

return setmetatable(github_contributions_widget, { __call = function(_, ...) return worker(...) end })
