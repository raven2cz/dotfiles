
local setmetatable = setmetatable
local table = table
local pairs = pairs
local type = type
local base = require("wibox.layout.base")
local widget_base = require("wibox.widget.base")

-- XXX
local print = print
local assert = assert

module("center")

-- Draw the given align layout. dir describes the orientation of the layout, "x"
-- means horizontal while "y" is vertical.
local function draw(dir, layout, wibox, cr, width, height)
    --assert(dir == "x")

    left = width/2
    right = left

    if layout.second then
      -- Get size of the middle widget
      local w, _ = layout.second:fit(width,height)

      left = left-w/2
      right = right+w/2

      base.draw_widget(wibox, cr, layout.second, left, 0, w, height)
    end

    if layout.first then
      local w, _ = layout.first:fit(left, height)

      base.draw_widget(wibox, cr, layout.first, 0, 0, w, height)
    end

    if layout.third then
      local w, _ = layout.third:fit(width-right, height)

      base.draw_widget(wibox, cr, layout.third, width-w, 0, w, height)
    end
end

local function widget_changed(layout, old_w, new_w)
    if old_w then
        old_w:disconnect_signal("widget::updated", layout._emit_updated)
    end
    if new_w then
        widget_base.check_widget(new_w)
        new_w:connect_signal("widget::updated", layout._emit_updated)
    end
    layout._emit_updated()
end

--- Set the layout's first widget. This is the widget that is at the left/top
function set_first(layout, widget)
    widget_changed(layout, layout.first, widget)
    layout.first = widget
end

--- Set the layout's second widget. This is the centered one.
function set_second(layout, widget)
    widget_changed(layout, layout.second, widget)
    layout.second = widget
end

--- Set the layout's third widget. This is the widget that is at the right/bottom
function set_third(layout, widget)
    widget_changed(layout, layout.third, widget)
    layout.third = widget
end

function reset(layout)
    for k, v in pairs({ "first", "second", "third" }) do
        layout[v] = nil
    end
    layout:emit_signal("widget::updated")
end

local function get_layout(dir)
    local function draw_dir(layout, wibox, cr, width, height)
        draw(dir, layout, wibox, cr, width, height)
    end

    local ret = widget_base.make_widget()
    ret.draw = draw_dir
    ret.fit = function(box, ...) return ... end
    ret.get_dir = function () return dir end
    ret._emit_updated = function()
        ret:emit_signal("widget::updated")
    end

    for k, v in pairs(_M) do
        if type(v) == "function" then
            ret[k] = v
        end
    end

    return ret
end

--- Returns a new horizontal align layout. An align layout can display up to
-- three widgets. The widget set via :set_left() is left-aligned. :set_right()
-- sets a widget which will be right-aligned. The remaining space between those
-- two will be given to the widget set via :set_middle().
function horizontal()
    local ret = get_layout("x")

    ret.set_left = ret.set_first
    ret.set_middle = ret.set_second
    ret.set_right = ret.set_third

    return ret
end

--- Returns a new vertical align layout. An align layout can display up to
-- three widgets. The widget set via :set_top() is top-aligned. :set_bottom()
-- sets a widget which will be bottom-aligned. The remaining space between those
-- two will be given to the widget set via :set_middle().
function vertical()
    local ret = get_layout("y")

    ret.set_top = ret.set_first
    ret.set_middle = ret.set_second
    ret.set_bottom = ret.set_third

    return ret
end

-- vim: filetype=lua:expandtab:shiftwidth=4:tabstop=8:softtabstop=4:textwidth=80
