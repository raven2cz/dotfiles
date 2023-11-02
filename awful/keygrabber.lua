---------------------------------------------------------------------------
--- A keyboard grabbing and transaction object.
--
-- This module allows to grab all keyboard inputs until stopped. It is used
-- to gather input data (such as in `awful.prompt`), implement VI-like keybindings
-- or multi key transactions such as emulating the Alt+Tab behavior.
--
-- Note that this module has been redesigned in Awesome 4.3 to be object oriented
-- and stateful. The use of the older global keygrabbing API is discouraged
-- going forward since it had problem with recursive keygrabbers and required
-- a lot of boiler plate code to get anything done.
--
-- Using keygrabber as transactions
-- --------------------------------
--
-- The transactional keybindings are keybindings that start with a normal
-- keybindings, but only end when a (mod)key is released. In the classic
-- "Alt+Tab" transaction, first pressing "Alt+Tab" will display a popup listing
-- all windows (clients). This popup will only disappear when "Alt" is released.
--
-- 
--
--
-- 
--     awful.keygrabber {
--         keybindings = {
--             awful.key {
--                 modifiers = {&#34Mod1&#34},
--                 key       = &#34Tab&#34,
--                 on_press  = awful.client.focus.history.select_previous
--             },
--             awful.key {
--                 modifiers = {&#34Mod1&#34, &#34Shift&#34},
--                 key       = &#34Tab&#34,
--                 on_press  = awful.client.focus.history.select_next
--             },
--         },
--         -- Note that it is using the key name and not the modifier name.
--         stop_key           = &#34Mod1&#34,
--         stop_event         = &#34release&#34,
--         start_callback     = awful.client.focus.history.disable_tracking,
--         stop_callback      = awful.client.focus.history.enable_tracking,
--         export_keybindings = true,
--     }
--
-- In that example, because `export_keybindings` is set to `true`, pressing
-- `alt+tab` or `alt+shift+tab` will start the transaction even if the
-- keygrabber is not (yet) running.
--
-- Using keygrabber for modal keybindings (VI like)
-- ------------------------------------------------
--
-- VI-like modal keybindings are triggered by a key, like `Escape`, followed by
-- either a number, an adjective (or noun) and closed by a verb. For example
-- `<Escape>+2+t+f` could mean "focus (f) the second (2) tag (t)".
-- `<Escape>+2+h+t+f` would "focus (f) two (2) tags (t) to the right (h)".
--
-- Here is a basic implementation of such a system. Note that the action
-- functions themselves are not implemented to keep the example size and
-- complexity to a minimum. The implementation is just if/elseif of all action
-- and the code can be found in the normal `rc.lua` keybindings section:
--
-- 
--
--
-- 
--     local map, actions = {
--         verbs = {
--             m = &#34move&#34 , f = &#34focus&#34 , d = &#34delete&#34 , a = &#34append&#34,
--             w = &#34swap&#34 , p = &#34print&#34 , n = &#34new&#34    ,
--         },
--         adjectives = { h = &#34left&#34  , j = &#34down&#34 , k = &#34up&#34    , l = &#34right&#34 , },
--         nouns      = { c = &#34client&#34, t = &#34tag&#34  , s = &#34screen&#34, y = &#34layout&#34, },
--     }, {}
--  
--     function actions.client(action, adj) print(&#34IN CLIENT!&#34) end --luacheck: no unused args
--     function actions.tag   (action, adj) print(&#34IN TAG!&#34   ) end --luacheck: no unused args
--     function actions.screen(action, adj) print(&#34IN SCREEN!&#34) end --luacheck: no unused args
--     function actions.layout(action, adj) print(&#34IN LAYOUT!&#34) end --luacheck: no unused args
--  
--     local function parse(_, stop_key, _, sequence)
--         local parsed, count = { verbs = &#34&#34, adjectives = &#34&#34, nouns = &#34&#34, }, &#34&#34
--         sequence = sequence..stop_key
--  
--         for i=1, #sequence do
--             local char = sequence:sub(i,i)
--             if char >= &#340&#34 and char <= &#349&#34 then
--                 count = count .. char
--             else
--                 for kind in pairs(parsed) do
--                     parsed[kind] = map[kind][char] or parsed[kind]
--                 end
--             end
--         end
--  
--         if parsed.nouns == &#34&#34 then return end
--         for _=1, count == &#34&#34 and 1 or tonumber(count) do
--             actions[parsed.nouns](parsed.verbs, parsed.adjectives)
--         end
--     end
--  
--     awful.keygrabber {
--         stop_callback = parse,
--         stop_key   = gears.table.keys(map.verbs),
--         root_keybindings = {
--             awful.key({&#34Mod4&#34}, &#34v&#34)
--         },
--     }
--
-- Using signals
-- -------------
--
-- When the keygrabber is running, it will emit signals on each event. The
-- format is "key_name".."::".."pressed_or_released". For example, to attach
-- a callback to `Escape` being pressed, do:
--
--    mykeygrabber:connect_signal("Escape::pressed", function(self, modifiers, modset)
--        print("Escape called!")
--    end)
--
-- The `self` argument is the keygrabber instance. The `modifiers` is a list of
-- all the currently pressed modifiers and the `modset` is the same table, but
-- with the modifiers as keys instead of value. It allow to save time by
-- checking `if modset.Mod4 then ... end` instead of looping into the `modifiers`
-- table or using `gears.table`.
--
-- @author dodo
-- @author Emmanuel Lepage Vallee &lt;elv1313@gmail.com&gt;
-- @copyright 2012 dodo
-- @copyright 2017 Emmanuel Lepage Vallee
-- @coreclassmod awful.keygrabber
---------------------------------------------------------------------------

local ipairs = ipairs
local table = table
local gdebug = require('gears.debug')
local akey = require("awful.key")
local unpack = unpack or table.unpack -- luacheck: globals unpack (compatibility with Lua 5.1)
local gtable = require("gears.table")
local gobject = require("gears.object")
local gtimer = require("gears.timer")
local akeyboard = require("awful.keyboard")
local glib = require("lgi").GLib
local capi = { keygrabber = keygrabber, root = root, awesome = awesome }

local keygrab = {}

-- Private data
local grabbers = {}
local keygrabbing = false

local keygrabber = {
    object = {}
}

-- Instead of checking for every modifiers, check the key directly.
local conversion = nil

--BEGIN one day create a proper API to add and remove keybindings at runtime.
-- Doing it this way is horrible.

-- Read the modifiers name and map their keysyms to the modkeys
local function generate_conversion_map()
    if conversion then return conversion end

    local mods = capi.awesome._modifiers
    assert(mods)

    conversion = {}

    for mod, keysyms in pairs(mods) do
        for _, keysym in ipairs(keysyms) do
            assert(keysym.keysym)
            conversion[keysym.keysym] = mod
        end
    end

    return conversion
end

capi.awesome.connect_signal("xkb::map_changed"  , function() conversion = nil end)

local function add_root_keybindings(self, list)
    assert(
        list, "`add_root_keybindings` needs to be called with a list of keybindings"
    )

    for _, kb in ipairs(list) do
        if kb.on_press then
            local old_press = kb.on_press
            kb.on_press = function(...)
                self:start()
                old_press(...)
            end
        end

        if kb.on_release then
            local old_release = kb.on_release
            kb.on_release = function(...)
                self:start()
                old_release(...)
            end
        end

        akeyboard.append_global_keybinding(kb)
    end
end

--END hack

local function grabber(mod, key, event)
    for _, keygrabber_function in ipairs(grabbers) do
        -- continue if the grabber explicitly returns false
        if keygrabber_function(mod, key, event) ~= false then
            break
        end
    end
end

local function stop(self, stop_key, stop_mods)
    keygrab.stop(self.grabber)

    local timer = self._private.timer
    if timer and timer.started then
        timer:stop()
    end

    if self.stop_callback then
        self.stop_callback(
            self.current_instance, stop_key, stop_mods, self.sequence
        )
    end

    keygrab.emit_signal("property::current_instance", nil)

    self.grabber = nil
    self:emit_signal("stopped")
end

local function runner(self, modifiers, key, event)
    local converted = generate_conversion_map()[key]

    -- Stop the keygrabber with the `stop_key`
    if (key == self.stop_key or (converted and converted == self.stop_key))
      and event == self.stop_event and self.stop_key then
        stop(self, key, modifiers)
        return false
    end

    -- Stop when only a subset of keys are allowed and it isn't one of them.
    if self._private.allowed_keys and not self._private.allowed_keys[key] then
        stop(self, key, modifiers)
        return false
    end

    -- Support multiple stop keys
    if type(self.stop_key) == "table" and event == self.stop_event then
        for _, k in ipairs(self.stop_key) do
            if k == key then
                stop(self, k, modifiers)
                return false
            end
        end
    end

    local is_modifier = converted ~= nil

    -- Reset the inactivity timer on each events.
    if self._private.timer and self._private.timer.started then
        self._private.timer:again()
    end

    -- Lua strings are bytes, to handle UTF-8, use GLib
    local seq_len = glib.utf8_strlen(self.sequence, -1)

    -- Record the key sequence
    if key == "BackSpace" and seq_len > 0 and event == "release" then
        self.sequence = glib.utf8_substring(self.sequence, 0, seq_len - 1)
    elseif glib.utf8_strlen(key, -1) == 1 and  event == "release" then
        self.sequence = self.sequence..key
    end

    -- Convert index array to hash table
    local mod = {}
    for _, v in ipairs(modifiers) do mod[v] = true end

    -- Emit some signals so the user can connect to a single type of event.
    self:emit_signal(key.."::"..event, modifiers, mod)

    local filtered_modifiers = {}

    -- User defined cases
    if self._private.keybindings[key] then
        -- Remove caps and num lock
        -- for _, m in ipairs(modifiers) do
        --     if not gtable.hasitem(akey.ignore_modifiers, m) then
        --         table.insert(filtered_modifiers, m)
        --     end
        -- end

        for _,v in ipairs(self._private.keybindings[key]) do
            --require("naughty").notify({text="modifiers of "..key.." "..tostring(#v.modifiers)..", "..tostring(#filtered_modifiers)})
            if #filtered_modifiers == #v.modifiers then
                local match = true
                for _,v2 in ipairs(v.modifiers) do
                    match = match and mod[v2]
                end

                if match then
                    if event == "press" and v.on_press then
                        v.on_press(self)

                        if self.mask_event_callback ~= false then
                            return
                        end
                    elseif event == "release" and v.on_release then
                        v.on_release(self)
                    end
                end
            end
        end
    end

    -- Do not call the callbacks on modkeys
    if is_modifier and self.mask_modkeys then
        return
    end

    if self.keypressed_callback and event == "press" then
        self.keypressed_callback(self, modifiers, key, event)
    elseif self.keyreleased_callback and event == "release" then
        self.keyreleased_callback(self, modifiers, key, event)
    end
end

--- Stop grabbing the keyboard for the provided callback.
--
-- When no callback is given, the last grabber gets removed (last one added to
-- the stack).
--
-- @param[opt] g The key grabber that must be removed.
-- @deprecated awful.keygrabber.stop
function keygrab.stop(g)
    -- If `run` is used directly and stop() is called with `g==nil`, get the
    -- first keygrabber.
    g = g
        or keygrab.current_instance and keygrab.current_instance.grabber
        or grabbers[#grabbers]

    for i, v in ipairs(grabbers) do
        if v == g then
            table.remove(grabbers, i)
            break
        end
    end

    if g and keygrab.current_instance and keygrab.current_instance.grabber == g then
        keygrab.current_instance = nil
    end

    -- Stop the global key grabber if the last grabber disappears from stack.
    if #grabbers == 0 then
        keygrabbing = false
        capi.keygrabber.stop()
    end
end

--- The keygrabber timeout.
--
-- 
--
--
-- @usage
-- awful.keygrabber {
--     autostart      = true,
--     timeout        = 1, -- second
--     timeout_callback  = function()
--         print(&#34The keygrabber has expired&#34)
--     end,
-- }
--
-- @property timeout
-- @tparam[opt=nil] number|nil timeout
-- @propertyunit second
-- @negativeallowed false
-- @propertytype nil No timeout.
-- @see gears.timer
-- @see timeout_callback

--- The key on which the keygrabber listen to terminate itself.
--
-- When this is set, the running keygrabber will quit when [one of] the stop
-- key event occurs.
--
-- By default, the event is `press`. It is common for use case like the
-- `awful.prompt` where `return` (enter) will terminate the keygrabbing. Using
-- `release` as an event is more appropriate when the keygrabber is tied to a
-- modifier key. For example, an Alt+Tab implementation stops when `mod1` (Alt)
-- is released.
--
-- It can also be a table containing many keys (as values).
--
-- Please note that modkeys are not accepted as `stop_key`s. You have to use
-- their corresponding key names such as `Control_L`.
--
-- @property stop_key
-- @tparam[opt=nil] string|table|nil stop_key
-- @propertyunit nil No stop key.
-- @propertyunit string A single stop key.
-- @propertyunit table One or more stop key(s).
-- @tablerowtype A list of key names, such as `"Control"` or `"a"`.
-- @see stop_event

--- The event on which the keygrabbing will be terminated.
--
-- @property stop_event
-- @tparam[opt="press"] string stop_event
-- @propertyvalue "press" When the keyboard key is first pressed.
-- @propertyvalue "release" When the keyboard key is released.
-- @see stop_key

--- Whether or not to execute the key press/release callbacks when keybindings are called.
--
-- When this property is set to false, the `keyreleased_callback` and
-- `keypressed_callback` callbacks will be executed even when the event was
-- consumed by a `keybinding`.
--
-- By default, keybindings block those callbacks from being executed.
--
-- @property mask_event_callback
-- @tparam[opt=true] boolean mask_event_callback
-- @see keybindings
-- @see keyreleased_callback
-- @see keypressed_callback

--- Do not call the callbacks on modifier keys (like `Control` or `Mod4`) events.
-- @property mask_modkeys
-- @tparam[opt=false] boolean mask_modkeys
-- @see mask_event_callback

--- Export all keygrabber keybindings as root (global) keybindings.
--
-- When this is enabled, calling all of the keygrabber object `keybinding`s will
-- will create root `awful.key` and will automatically starts the grabbing.
--
-- Use this with caution. If many keygrabber or "real" root keybindings are set
-- on the same key combination, they are all executed and there is almost no
-- safe way to undo that. Make sure the `keygrabber` that use this option
-- have a single instance.
--
-- @property export_keybindings
-- @tparam[opt=false] boolean export_keybindings

--- The root (global) keybinding to start this keygrabber.
--
-- Instead of adding an entry to `root.keys` or `rc.lua` `globalkeys` section,
-- this property can be used to take care of everything. This way, it becomes
-- easier to package modules using keygrabbers.
--
-- 
--
--
--**Usage example output**:
--
--    Is now active!	nil
--    A key was pressed:	a	with	0	modifier!
--    A key was pressed:	i	with	1	modifier!
--    Called again!
--
--
-- @usage
-- awful.keygrabber {
--     mask_modkeys = true,
--     root_keybindings = {
--         awful.key {
--             modifiers = {&#34Mod4&#34},
--             key       = &#34i&#34,
--             on_press  = function(self)
--                 print(&#34Is now active!&#34, self)
--             end
--         },
--     },
--     keybindings = {
--         awful.key {
--             modifiers = {&#34Mod4&#34, &#34Shift&#34},
--             key       = &#34i&#34,
--             on_press  = function(self)
--                 print(&#34Called again!&#34)
--                 self:stop()
--             end
--         },
--     },
--     keypressed_callback  = function(_, modifiers, key)
--         print(&#34A key was pressed:&#34, key, &#34with&#34, #modifiers, &#34modifier!&#34)
--     end,
-- }
--  
-- -- The following will **NOT** trigger the keygrabbing because it isn't exported
-- -- to the root (global) keys. Adding `export_keybindings` would solve that
-- root._execute_keybinding({&#34Mod4&#34, &#34Shift&#34}, &#34i&#34)
-- assert(#keybinding_works == 0)
--  
-- -- But this will start the keygrabber because it is part of the root_keybindings
-- root._execute_keybinding({&#34Mod4&#34}, &#34i&#34)
--  
-- -- Note that that keygrabber is running, all callbacks should work:
-- root.fake_input(&#34key_press&#34  , &#34a&#34)
-- root.fake_input(&#34key_release&#34  , &#34a&#34)
--  
-- -- Calling the root keybindings now wont work because they are not part of
-- -- the keygrabber internal (own) keybindings, so `keypressed_callback` will
-- -- be called.
-- root._execute_keybinding({&#34Mod4&#34}, &#34i&#34)
--  
-- -- Now the keygrabber own keybindings will work
-- root._execute_keybinding({&#34Mod4&#34, &#34Shift&#34}, &#34i&#34)
--
-- @property root_keybindings
-- @tparam[opt={}] table root_keybindings
-- @tablerowtype A list of `awful.key` objects.
-- @see export_keybindings
-- @see keybindings

--- The keybindings associated with this keygrabber.
--
-- This property contains a table of `awful.key` objects.
--
-- @property keybindings
-- @tparam[opt={}] table keybindings
-- @tablerowtype A list of `awful.key` objects.
-- @see export_keybindings
-- @see root_keybindings
-- @see awful.key

--- If any key is pressed that is not in this list, the keygrabber is stopped.
--
-- When defined, this property allows to define an implicit way to release the
-- keygrabber. It helps save some boilerplate code in the handler callbacks.
--
-- It is useful when a transaction only handle a limited number of keys. If
-- a key unhandled by the transaction is triggered, the transaction is
-- canceled.
--
-- 
--
--
-- @usage
-- awful.keygrabber {
--     autostart      = true,
--     allowed_keys   = {&#34a&#34, &#34w&#34, &#34e&#34, &#34s&#34, &#34o&#34, &#34m&#34, &#34e&#34},
-- }
--
-- @property allowed_keys
-- @tparam[opt=nil] table|nil allowed_keys
-- @propertytype nil All keys are allowed.
-- @propertytype table Only some keys are allowed.
-- @tablerowtype A list of key names, such as `"Control"` or `"a"`.

--- The sequence of keys recorded since the start of the keygrabber.
--
-- In this example, the `stop_callback` is used to retrieve the final key
-- sequence.
--
-- Please note that backspace will remove elements from the sequence and
-- named keys and modifiers are ignored.
--
-- 
--
--
-- @usage
-- awful.keygrabber {
--     autostart      = true,
--     stop_key       = &#34Return&#34,
--     stop_callback  = function(_, _, _, sequence)
--         naughty.notification {message=&#34The keys were:&#34..sequence}
--     end,
-- }
--
-- @property sequence
-- @tparam[opt=""] string sequence
--

--- The current (running) instance of this keygrabber.
--
-- The keygrabber instance is created when the keygrabber starts. It is an object
-- mirroring this keygrabber object, but where extra properties can be added. It
-- is useful to keep some contextual data part of the current transaction without
-- polluting the original object of having extra boilerplate code.
--
-- @tfield keygrabber current_instance
-- @emits property::current_instance

--- The global signal used to track the `current_instance`.
--
-- @signal property::current_instance

--- If a keygrabber is currently running.
-- @tfield boolean is_running

--- Start the keygrabber.
--
-- Note that only a single keygrabber can be started at any one time. If another
-- keygrabber (or this one) is currently running. This method returns false.
--
-- @method start
-- @treturn boolean If the keygrabber was successfully started.
-- @emits started
-- @emits property::current_instance
function keygrabber:start()
    if self.grabber or keygrab.current_instance then
        return false
    end

    self.current_instance = setmetatable({}, {
        __index = self,
        __newindex = function(tab, key, value)
            if keygrabber["set_"..key] then
                self[key](self, value)
            else
                rawset(tab, key, value)
            end
        end
    })

    self.sequence = ""

    if self.start_callback then
        self.start_callback(self.current_instance)
    end

    self.grabber = keygrab.run(function(...) return runner(self, ...) end)

    -- Ease making keygrabber that won't hang forever if no action is taken.
    if self.timeout and not self._private.timer then
        self._private.timer = gtimer {
            timeout     = self.timeout,
            single_shot = true,
            callback    = function()
                if self.timeout_callback then
                    pcall(self.timeout_callback, self)
                end
                self:stop()
            end
        }
    end

    if self._private.timer then
        self._private.timer:start()
    end

    keygrab.current_instance = self

    keygrab.emit_signal("property::current_instance", keygrab.current_instance)

    self:emit_signal("started")
end

--- Stop the keygrabber.
--
-- Also stops any `timeout`.
--
-- @method stop
-- @tparam string|nil stop_key Override the key passed to `stop_callback` **DEPRECATED**
-- @tparam tale|nil stop_mods Override the modifiers passed to `stop_callback` **DEPRECATED**
-- @noreturn
-- @emits stopped
-- @emits property::current_instance
function keygrabber:stop(stop_key, stop_mods)
    if stop_key then
        gdebug.deprecate(
            "The `stop_key` is deprecated. Overriding callback parameters "..
            "is an anti-pattern and might confuse third party modules.",
            {deprecated_in=5}
        )
    end

    if stop_mods then
        gdebug.deprecate(
            "The `stop_mods` is deprecated. Overriding callback parameters "..
            "is an anti-pattern and might confuse third party modules.",
            {deprecated_in=5}
        )
    end

    stop(self, stop_key, stop_mods)
end

--- Add a keybinding to this keygrabber.
--
-- Those keybindings will automatically start the keygrabbing when hit.
--
-- Please note that this method previously accepted a
-- `mods, keycode, callback, description` signature. This is deprecated. Store
-- those values in an `awful.key` prior to passing it to this function. The
-- previous method signature made it impossible to alter the description and/or
-- enable/disable the keybinding.
--
-- @method add_keybinding
-- @tparam awful.key key The key.
-- @tparam string description.group The keybinding group
-- @noreturn
-- @see remove_keybinding

function keygrabber:add_keybinding(key, keycode, callback, description)
    local mods = not key._is_awful_key and key or nil

    if mods then
        gdebug.deprecate(":add_keybinding now takes `awful.key` objects instead"
            .. " of multiple parameters",
            {deprecated_in=5}
        )

        key = akey {
            modifiers   = mods,
            key         = keycode,
            description = description,
            on_press    = callback
        }
    elseif keycode or callback or description then
        gdebug.deprecate(
            ":add_keybinding only accept a single parameter. All "..
            "other were ignored.",
            {deprecated_in=4}
        )
    end

    self._private.keybindings[key.key] = self._private.keybindings[key.key] or {}
    table.insert(self._private.keybindings[key.key], key)

    if self.export_keybindings then
        add_root_keybindings(self, {key})
    end
end

--- Remove a keybinding from the keygrabber.
--
-- @method remove_keybinding
-- @treturn boolean `true` if removed, `false` if not found.
-- @see add_keybinding

function keygrabber:remove_keybinding(key)
    for idx, obj in ipairs(self._private.keybindings[key.key]) do
        if obj == key then
            table.remove(self._private.keybindings[key.key], idx)

            if #self._private.keybindings[key.key] == 0 then
                self._private.keybindings[key.key] = nil
            end

            return true
        end
    end
    return false
end

function keygrabber:set_root_keybindings(keys)
    local real_keys = {}

    -- Handle the pre-object-oriented input structures.
    for _, key in ipairs(keys) do
        if key._is_awful_key then
            table.insert(real_keys, key)
        else
            gdebug.deprecate(":set_root_keybindings now takes `awful.key` "
                .. " objects instead of tables",
                {deprecated_in=5}
            )

            local mods, keycode, press, release, data = unpack(key)

            table.insert(real_keys, akey {
                modifiers   = mods,
                key         = keycode,
                description = (data or {}).description,
                on_press    = press,
                on_release  = release,
            })
        end
    end

    add_root_keybindings(self, real_keys)
end

-- Turn into a set.
function keygrabber:set_allowed_keys(keys)
    self._private.allowed_keys = {}

    for _, v in ipairs(keys) do
        self._private.allowed_keys[v] = true
    end
end

--TODO v5 remove this
function keygrabber:set_release_event(event)
    -- It has never been in a release, so it can be deprecated right away
    gdebug.deprecate("release_event has been renamed to stop_event")

    self.stop_event = event
end

--TODO v5 remove this
function keygrabber:get_release_event()
    return self.stop_event
end

--- When the keygrabber starts.
-- @signal started

--- When the keygrabber stops.
-- @signal stopped

--- When an `awful.key` is pressed.
-- @signal keybinding::triggered
-- @tparam awful.keybinding self
-- @tparam awful.key key The keybinding.
-- @tparam string event Either `"press"` or `"release"`.

--- A function called when a keygrabber starts.
-- @callback start_callback
-- @tparam keygrabber keygrabber The keygrabber.

--- The callback when the keygrabbing stops.
--
-- @usage local function my_done_cb(self, stop_key, stop_mods, sequence)
--    -- do something
-- end
-- @tparam table self The current transaction object.
-- @tparam string stop_key The key(s) that stop the keygrabbing (if any)
-- @tparam table stop_mods The modifiers key (if any)
-- @tparam string sequence The recorded key sequence.
-- @callback stop_callback
-- @see sequence
-- @see stop

--- The function called when the keygrabber stops because of a `timeout`.
--
-- Note that the `stop_callback` is also called when the keygrabbers timeout.
--
-- @callback timeout_callback
-- @see timeout

--- The callback function to call with mod table, key and command as arguments
-- when a key was pressed.
--
-- @callback keypressed_callback
-- @tparam table self The current transaction object.
-- @tparam table mod The current modifiers (like `"Control"` or `"Shift"`).
-- @tparam string key The key name.
-- @tparam string event The event ("press" or "release").
-- @usage local function my_keypressed_cb(self, mod, key, command)
--    -- do something
-- end

--- The callback function to call with mod table, key and command as arguments
-- when a key was released.
-- @usage local function my_keyreleased_cb(self, mod, key, command)
--    -- do something
-- end
-- @callback keyreleased_callback
-- @tparam table self The current transaction object.
-- @tparam table mod The current modifiers (like `"Control"` or `"Shift"`).
-- @tparam string key The key name.
-- @tparam string event The event ("press" or "release")

--- A wrapper around the keygrabber to make it easier to add keybindings.
--
-- This is similar to the `awful.prompt`, but without an actual widget. It can
-- be used to implement custom transactions such as alt+tab or keyboard menu
-- navigation.
--
-- Note that the object returned can be used as a client or global keybinding
-- callback without modification. Make sure to set `stop_key` and `stop_event`
-- to proper values to avoid permanently locking the keyboard.
--
-- @tparam table args
-- @tparam[opt="press"] string args.stop_event Release event ("press" or "release")
-- @tparam[opt=nil] string|table args.stop_key The key that has to be kept pressed.
-- @tparam table args.keybindings All keybindings.
-- @tparam[opt=-1] number args.timeout The maximum inactivity delay.
-- @tparam[opt=true] boolean args.mask_event_callback Do not call `keypressed_callback`
--  or `keyreleased_callback` when a hook is called.
-- @tparam[opt] function args.start_callback
-- @tparam[opt] function args.stop_callback
-- @tparam[opt] function args.timeout_callback
-- @tparam[opt] function args.keypressed_callback
-- @tparam[opt] function args.keyreleased_callback
-- @tparam[opt=nil] table|nil args.allowed_keys A table with all keys that
--  **won't** stop the keygrabber.
-- @tparam[opt] table args.root_keybindings The root (global) keybindings.
-- @tparam[opt=false] boolean args.export_keybindings Create root (global) keybindings.
-- @tparam[opt=false] boolean args.autostart Start the grabbing immediately
-- @tparam[opt=false] boolean args.mask_modkeys Do not call the callbacks on
--  modifier keys (like `"Control"` or `"Mod4"`) events.
-- @constructorfct awful.keygrabber
function keygrab.run_with_keybindings(args)
    args = args or {}

    local ret = gobject {
        enable_properties   = true,
        enable_auto_signals = true
    }

    rawset(ret, "_private", {})

    -- Do not use `rawset` or `_private` because it uses the `gears.object`
    -- auto signals.
    ret.sequence = ""

    gtable.crush(ret, keygrabber, true)

    gtable.crush(ret, args)

    ret._private.keybindings = {}
    ret.stop_event = args.stop_event or "press"

    -- Build the hook map
    for _,v in ipairs(args.keybindings or {}) do
        if v._is_awful_key then
            ret._private.keybindings[v.key] = ret._private.keybindings[v.key] or {}
            table.insert(ret._private.keybindings[v.key], v)
        elseif #v >= 3 and #v <= 4 then
            gdebug.deprecate("keybindings now contains `awful.key` objects"
                .. "instead of multiple tables",
                {deprecated_in=5}
            )

            local modifiers, key, callback = unpack(v)
            if type(callback) == "function" then

                local k = akey {
                    modifiers = modifiers,
                    key       = key,
                    on_press  = callback,
                }

                ret._private.keybindings[key] = ret._private.keybindings[key] or {}
                table.insert(ret._private.keybindings[key], k)
            else
                gdebug.print_warning(
                    "The hook's 3rd parameter has to be a function. " ..
                        gdebug.dump_return(v or {})
                )
            end
        else
            gdebug.print_warning(
                "The keybindings should be awful.key objects" ..
                        gdebug.dump_return(v or {})
            )
        end
    end

    if args.export_keybindings then
        ret:set_root_keybindings(args.keybindings)
    end

    local mt = getmetatable(ret)

    -- Add syntax-sugar to call `:start()`.
    -- This allows keygrabbers object to be used as callbacks "functions".
    function mt.__call()
        ret:start()
    end

    if args.autostart then
        ret:start()
    end

    return ret
end

--- A lower level API to interact with the keygrabber directly.
--
-- Grab keyboard input and read pressed keys, calling the least callback
-- function from the stack at each keypress, until the stack is empty.
--
-- Calling run with the same callback again will bring the callback
-- to the top of the stack.
--
-- The callback function receives three arguments:
--
-- * a table containing modifiers keys
-- * a string with the pressed key
-- * a string with either "press" or "release" to indicate the event type.
--
-- Here is the content of the modifier table:
--
-- <table class='widget_list' border=1>
--  <tr style='font-weight: bold;'>
--   <th align='center'>Modifier name </th>
--   <th align='center'>Key name</th>
--   <th align='center'>Alternate key name</th>
--  </tr>
--  <tr><td> Mod4</td><td align='center'> Super_L </td><td align='center'> Super_R </td></tr>
--  <tr><td> Control </td><td align='center'> Control_L </td><td align='center'> Control_R </td></tr>
--  <tr><td> Shift </td><td align='center'> Shift_L </td><td align='center'> Shift_R </td></tr>
--  <tr><td> Mod1</td><td align='center'> Alt_L </td><td align='center'> Alt_R </td></tr>
-- </table>
--
-- A callback can return `false` to pass the events to the next
-- keygrabber in the stack.
--
-- @param g The key grabber callback that will get the key events until it
--  will be deleted or a new grabber is added.
-- @return the given callback `g`.
-- @usage
-- -- The following function can be bound to a key, and be used to resize a
-- -- client using the keyboard.
--
-- function resize(c)
--   local grabber
--   grabber = awful.keygrabber.run(function(mod, key, event)
--     if event == "release" then return end
--
--     if     key == 'Up'    then c:relative_move(0, 0, 0, 5)
--     elseif key == 'Down'  then c:relative_move(0, 0, 0, -5)
--     elseif key == 'Right' then c:relative_move(0, 0, 5, 0)
--     elseif key == 'Left'  then c:relative_move(0, 0, -5, 0)
--     else   awful.keygrabber.stop(grabber)
--     end
--   end)
-- end
-- @deprecated awful.keygrabber.run
function keygrab.run(g)
    -- Remove the grabber if it is in the stack.
    keygrab.stop(g)

    -- Record the grabber that has been added most recently.
    table.insert(grabbers, 1, g)

    -- Start the keygrabber if it is not running already.
    if not keygrabbing then
        keygrabbing = true
        capi.keygrabber.run(grabber)
    end

    return g
end

-- Implement the signal system for the keygrabber.

local signals = {}

--- Connect to a signal for all keygrabbers at once.
-- @staticfct awful.keygrabber.connect_signal
-- @tparam string name The signal name.
-- @tparam function callback The callback.
-- @noreturn
function keygrab.connect_signal(name, callback)
    signals[name] = signals[name] or {}

    -- Use table.insert instead of signals[name][callback] = true to make
    -- the execution order stable across `emit_signal`. This avoids some
    -- heisenbugs.
    table.insert(signals[name], callback)
end

--- Disconnect to a signal for all keygrabbers at once.
-- @staticfct awful.keygrabber.disconnect_signal
-- @tparam string name The signal name.
-- @tparam function callback The callback.
-- @noreturn
function keygrab.disconnect_signal(name, callback)
    signals[name] = signals[name] or {}

    for k, v in ipairs(signals[name]) do
        if v == callback then
            table.remove(signals[name], k)
            break
        end
    end
end

--- Emit a signal on the keygrabber module itself.
--
-- Warning, usually don't use this directly, use
-- `my_keygrabber:emit_signal(name, ...)`. This function works on the whole
-- keygrabber module, not one of its instance.
--
-- @staticfct awful.keygrabber.emit_signal
-- @tparam string name The signal name.
-- @param ... Other arguments for the callbacks.
-- @noreturn
function keygrab.emit_signal(name, ...)
    signals[name] = signals[name] or {}

    for _, cb in ipairs(signals[name]) do
        cb(...)
    end
end

function keygrab.get_is_running()
    return keygrab.current_instance ~= nil
end

--
--- Disconnect from a signal.
-- @tparam string name The name of the signal.
-- @tparam function func The callback that should be disconnected.
-- @method disconnect_signal
-- @treturn boolean `true` when the function was disconnected or `false` if it
--  wasn't found.
-- @baseclass gears.object

--- Emit a signal.
--
-- @tparam string name The name of the signal.
-- @param ... Extra arguments for the callback functions. Each connected
--   function receives the object as first argument and then any extra
--   arguments that are given to emit_signal().
-- @method emit_signal
-- @noreturn
-- @baseclass gears.object

--- Connect to a signal.
-- @tparam string name The name of the signal.
-- @tparam function func The callback to call when the signal is emitted.
-- @method connect_signal
-- @noreturn
-- @baseclass gears.object

--- Connect to a signal weakly.
--
-- This allows the callback function to be garbage collected and
-- automatically disconnects the signal when that happens.
--
-- **Warning:**
-- Only use this function if you really, really, really know what you
-- are doing.
-- @tparam string name The name of the signal.
-- @tparam function func The callback to call when the signal is emitted.
-- @method weak_connect_signal
-- @noreturn
-- @baseclass gears.object

return setmetatable(keygrab, {
    __call = function(_, args) return keygrab.run_with_keybindings(args) end
})

-- vim: filetype=lua:expandtab:shiftwidth=4:tabstop=8:softtabstop=4:textwidth=80
