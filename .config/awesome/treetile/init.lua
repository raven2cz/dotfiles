--[[
    treetile: Binary Tree-based tiling layout for Awesome 3

    Github:https://github.com/guotsuan/treetile
    Folked from Github: https://github.com/RobSis/treesome
    License: GNU General Public License v2.0



    Because the the split of space is depending on the parent node, which is
    current focused client.  Therefore it is necessary to set the correct 
    focus option, "treetile.focusnew".

    If the new created client will automatically gain the focus, for exmaple
    in rc.lua with the settings:

    ...
    awful.rules.rules = {
        { rule = { },
          properties = { focus = awful.client.focus.filter,
         ...

    You need to set "treetile.focusnew = true"

    Otherwise, set "treetile.focusnew = false"
--]]

local awful        = require("awful")
local beautiful    = require("beautiful")
local Bintree      = require("treetile/bintree")
local os           = os
local math         = math
local ipairs       = ipairs
local pairs        = pairs
local table        = table
local tonumber     = tonumber
local tostring     = tostring
local type         = type
local capi         = {
    client         = client,
    tag            = tag,
    mouse          = mouse,
    screen         = screen,
    mousegrabber   = mousegrabber
}
local debug   = require("gears.debug")

local treetile     = {
    focusnew       = true,
    name           = "treetile",
    direction      = "right" -- the newly created client 
                             -- on the RIGHT or LEFT side of current focus?
}
local naughty      = require("naughty")

    


-- Globals
local forceSplit = nil
local layoutSwitch = false
local trees = {}

treetile.name = "treetile"

-- Layout icon
beautiful.layout_treetile = os.getenv("HOME") .. "/.config/awesome/treetile/layout_icon.png"

capi.tag.connect_signal("property::layout", function() layoutSwitch = true end)

local function debuginfo(message)
    if type(message) == "table" then
        for k,v in pairs(message) do 
            naughty.notify({ text = "key: "..k.." value: "..tostring(v), timeout = 10 })
        end
    elseif type(message) == 'string' then 
        nid = naughty.notify({ text = message, timeout = 10 })
    else
        nid = naughty.notify({ text = tostring(message), timeout = 10 })
    end
end

-- get an unique identifier of a window
local function hash(client)
    if client then
        return client.window
    else
        return nil
    end
end

function Bintree:update_nodes_geo(parent_geo, geo_table)

    local left_node_geo = nil
    local right_node_geo = nil
    if type(self.data) == 'number' then 
        -- This sibling node is a client. 
        -- Just need to resize this client to the size of its geometry of
        -- parent node (the empty workear left by the killed client
        -- together with orignal area occupied by this sibling client).

        if type(parent_geo) == "table" then
            geo_table[self.data] = awful.util.table.clone(parent_geo)
        else
            debug.print_error ('geometry table error errors')
        end

        return
    end

    if type(self.data) == 'table' then
        -- the sibling is another table, need to update the geometry of all descendants.
        local now_geo = nil
        now_geo = awful.util.table.clone(self.data)
        self.data = awful.util.table.clone(parent_geo)

        if type(self.left.data) == 'number'  then
            left_node_geo = awful.util.table.clone(geo_table[self.left.data])
        end


        if type(self.right.data) == 'number'  then
            right_node_geo = awful.util.table.clone(geo_table[self.right.data])
        end

        if type(self.left.data) == 'table' then
            left_node_geo = awful.util.table.clone(self.left.data)
        end

        if type(self.right.data) == 'table' then
            right_node_geo = awful.util.table.clone(self.right.data)
        end
        

        -- {{{ vertical split 
        if math.abs(left_node_geo.x - right_node_geo.x) < 0.2 then
            -- Nodes are split in vertical way
            if math.abs(parent_geo.width - now_geo.width ) > 0.2 then
                left_node_geo.width = parent_geo.width 
                right_node_geo.width = parent_geo.width 

                local new_x = parent_geo.x

                left_node_geo.x = new_x
                right_node_geo.x = new_x
            end

            if math.abs(parent_geo.height - now_geo.height ) > 0.2 then

                if treetile.direction == 'left' then 
                    left_node_geo, right_node_geo = right_node_geo, left_node_geo
                end

                local new_y = parent_geo.y

                r_l_ratio = left_node_geo.height / now_geo.height

                left_node_geo.height = parent_geo.height * r_l_ratio
                right_node_geo.height = parent_geo.height - left_node_geo.height
                
                left_node_geo.y = new_y
                right_node_geo.y = new_y + left_node_geo.height

            end
        end
        -- }}}

        -- {{{ horizontal split
        if math.abs(left_node_geo.y - right_node_geo.y) < 0.2 then
            -- Nodes are split in horizontal way
            if math.abs(parent_geo.height - now_geo.height) > 0.2 then
                left_node_geo.height = parent_geo.height
                right_node_geo.height = parent_geo.height

                local new_y = parent_geo.y

                left_node_geo.y = new_y
                right_node_geo.y = new_y
            end

            if math.abs(parent_geo.width - now_geo.width) > 0.2 then

                if treetile.direction == 'left' then 
                    left_node_geo, right_node_geo = right_node_geo, left_node_geo
                end

                local new_x =  parent_geo.x

                r_l_ratio = left_node_geo.width / now_geo.width

                left_node_geo.width = parent_geo.width * r_l_ratio
                right_node_geo.width = parent_geo.width - left_node_geo.width
                
                left_node_geo.x = new_x
                right_node_geo.x = new_x + left_node_geo.width

            end

        end
        -- }}}
        

        if type(self.left.data) == 'number' then
            geo_table[self.left.data].x = left_node_geo.x
            geo_table[self.left.data].y = left_node_geo.y
            geo_table[self.left.data].height = left_node_geo.height
            geo_table[self.left.data].width = left_node_geo.width
        end 

        if type(self.right.data) == 'number' then
            geo_table[self.right.data].x = right_node_geo.x
            geo_table[self.right.data].y = right_node_geo.y
            geo_table[self.right.data].height = right_node_geo.height
            geo_table[self.right.data].width = right_node_geo.width
        end 


        if type(self.left.data) == 'table' then
           self.left:update_nodes_geo(left_node_geo, geo_table)
        end

        if type(self.right.data) == 'table' then
           self.right:update_nodes_geo(right_node_geo, geo_table)
        end


    end

end


local function table_find(tbl, item)
    for key, value in pairs(tbl) do
        if value == item then return key end
    end
    return false
end

local function table_diff(table1, table2)
    local diffList = {}
    for i,v in ipairs(table1) do
        if table2[i] ~= v then
            table.insert(diffList, v)
        end
    end
    if #diffList == 0 then
        diffList = nil
    end
    return diffList
end

-- get ancestors of node with given data
function Bintree:trace(data, path, dir)
    if path then
        table.insert(path, {split=self.data, direction=dir})
    end

    if data == self.data then
        return path
    end

    if type(self.left) == "table" then
        if (self.left:trace(data, path, "left")) then
            return true
        end
    end

    if type(self.right) == "table" then
        if (self.right:trace(data, path, "right")) then
            return true
        end
    end

    if path then
        table.remove(path)
    end
end

-- remove all leaves with data that don't appear in given table
-- and only remove clients
function Bintree:filterClients(node, clients)
    if node then
        if node.data and not table_find(clients, node.data) and
            type(node.data) == 'number' then
            self:removeLeaf(node.data)
        end

        local output = nil
        if node.left then
            self:filterClients(node.left, clients)
        end

        if node.right then
            self:filterClients(node.right, clients)
        end
    end
end

function treetile.horizontal()
    forceSplit = "horizontal"
    debuginfo('Next split is left right (|) split')
end

function treetile.vertical()
    forceSplit = "vertical"
    debuginfo('Next split is upper bottom (-)split')
end

local function do_treetile(p)
    local old_clients = nil
    local area = p.workarea
    local n = #p.clients
    local gs = p.geometries

    local tag = tostring(p.tag or capi.screen[p.screen].selected_tag 
                        or awful.tag.selected(capi.mouse.screen))


    if not trees[tag] then
        trees[tag] = {
            t = nil,
            lastFocus = nil,
            clients = nil,
            geo_t = nil,
            geo = nil,
            n = 0
        }
    end

    -- t is tree structure to record all the clients and the way of splitting
    -- geo_t is the tree structure to record the geometry of all nodes/clients
    -- of the parent nodes (the over-all geometry of all siblings together)

    if trees[tag] ~= nil then
        -- should find a better to handle this 
        if treetile.focusnew then
            focus = awful.client.focus.history.get(p.screen,1)
        else
            focus = capi.client.focus
        end
        
        if focus ~= nil then
            local isfloat
            if type(focus.floating) == 'boolean' then
                isfloat = focus.floating
            else
                isfloat = awful.client.floating.get(focus) 
            end

            if isfloat then
                focus = nil
            else
                trees[tag].lastFocus = focus
            end
        end

    end

    -- rearange only on change
    local changed = 0
    local update = false

    if trees[tag].n ~= n then
        if not trees[tag].n or n > trees[tag].n then
            changed = 1
        else
            changed = -1
        end
        trees[tag].n = n
    else
        if trees[tag].clients then
            local diff = table_diff(p.clients, trees[tag].clients)
            if diff and #diff == 2 then
                trees[tag].t:swapLeaves(hash(diff[1]), hash(diff[2]))
                trees[tag].geo_t:swapLeaves(hash(diff[1]), hash(diff[2]))
                trees[tag].geo[hash(diff[1])], trees[tag].geo[hash(diff[2])] 
                    = trees[tag].geo[hash(diff[2])], trees[tag].geo[hash(diff[1])] 
                update=true
            end
        end
    end

    trees[tag].clients = p.clients

    -- some client removed. update the trees
    if changed < 0 then
        if n > 0 then
            local tokens = {}
            for i, c in ipairs(p.clients) do
                tokens[i] = hash(c)
            end

            for clid, _ in pairs(trees[tag].geo) do
                if awful.util.table.hasitem(tokens, clid) == nil then
                    -- update the size of clients left, fill the empty space left by the killed client

                    local sib_node = trees[tag].geo_t:getSibling(clid)
                    local parent = trees[tag].geo_t:getParent(clid)
                    local parent_geo = nil
                    
                    if parent then
                        parent_geo = parent.data
                    end

                    if sib_node ~= nil then 
                        sib_node:update_nodes_geo(parent_geo, trees[tag].geo)
                    end

                    local pos = awful.util.table.hasitem(trees[tag].geo, clid)
                    table.remove(trees[tag].geo, pos)
                end
            end

            trees[tag].geo_t:filterClients(trees[tag].geo_t, tokens)
            trees[tag].t:filterClients(trees[tag].t, tokens)

            --awful.client.jumpto(trees[tag].lastFocus)
        else
            trees[tag] = nil
        end
    end


    -- one or more clients are added. Put them in the tree. 
    local prevClient = nil
    local nextSplit = 0

    if changed > 0 then
        for i, c in ipairs(p.clients) do
            if not trees[tag].t or not trees[tag].t:find(hash(c)) then
                if focus == nil then
                    focus = trees[tag].lastFocus
                end

                local focusNode = nil
                local focusGeometry = nil
                local focusNode_geo_t = nil
                local focusId = nil

                if trees[tag].t and focus and hash(c) ~= hash(focus)  and not layoutSwitch then
                    -- Find the parent node for splitting
                    focusNode = trees[tag].t:find(hash(focus))
                    focusNode_geo_t = trees[tag].geo_t:find(hash(focus))
                    focusGeometry = focus:geometry()
                    focusId = hash(focus)
                else
                    -- the layout was switched with more clients to order at once
                    if prevClient then
                        focusNode = trees[tag].t:find(hash(prevClient))
                        focusNode_geo_t = trees[tag].geo_t:find(hash(prevClient))
                        nextSplit = (nextSplit + 1) % 2
                        focusGeometry = trees[tag].geo[hash(prevClient)]
                        focusId = hash(prevClient)

                    else
                        if not trees[tag].t then
                            -- create a new root
                            trees[tag].t = Bintree.new(hash(c))
                            focusGeometry = {
                                width = 0,
                                height = 0
                            }
                            trees[tag].geo_t = Bintree.new(hash(c))
                            trees[tag].geo = {}
                            trees[tag].geo[hash(c)] = awful.util.table.clone(area)
                            focusId = hash(c)
                            --focusNode = trees[tag].t:find(hash(c))
                            --focusNode_geo_t = trees[tag].geo_t:find(hash(c))
                        end
                    end
                end

                -- {{{ if focusNode exists
                if focusNode then
                    if focusGeometry == nil then
                        local splits = {"horizontal", "vertical"}
                        focusNode.data = splits[nextSplit + 1]
                    else
                        if (forceSplit ~= nil) then

                            focusNode.data = forceSplit
                        else
                            if (focusGeometry.width <= focusGeometry.height) then
                                focusNode.data = "vertical"
                            else
                                focusNode.data = "horizontal"
                            end
                        end
                    end

                    if treetile.direction == 'right' then 
                        focusNode:addLeft(Bintree.new(focusId))
                        focusNode_geo_t:addLeft(Bintree.new(focusId))
                        focusNode:addRight(Bintree.new(hash(c)))
                        focusNode_geo_t:addRight(Bintree.new(hash(c)))
                    else
                        focusNode:addRight(Bintree.new(focusId))
                        focusNode_geo_t:addRight(Bintree.new(focusId))
                        focusNode:addLeft(Bintree.new(hash(c)))
                        focusNode_geo_t:addLeft(Bintree.new(hash(c)))
                    end

                    local useless_gap = tonumber(beautiful.useless_gap)
                    if useless_gap == nil then
                        useless_gap = 0
                    else
                        useless_gap = useless_gap * 2.0
                    end

                    local avail_geo =nil

                    if focusGeometry then 
                        if focusGeometry.height == 0 and focusGeometry.width == 0 then
                            avail_geo = area
                        else
                            avail_geo = focusGeometry
                        end
                    else
                        avail_geo = area
                    end
        
                    local new_c = {}
                    local old_focus_c = {}

                    -- put the geometry of parament node into table too
                    focusNode_geo_t.data = awful.util.table.clone(avail_geo)

                    if focusNode.data == "horizontal" then
                        new_c.width = math.floor((avail_geo.width - useless_gap) / 2.0 )
                        new_c.height = avail_geo.height
                        old_focus_c.width = math.floor((avail_geo.width - useless_gap) / 2.0 )
                        old_focus_c.height = avail_geo.height
                        old_focus_c.y = avail_geo.y
                        new_c.y = avail_geo.y

                        if treetile.direction == "right" then
                            new_c.x = avail_geo.x + new_c.width + useless_gap
                            old_focus_c.x = avail_geo.x
                        else
                            new_c.x = avail_geo.x
                            old_focus_c.x = avail_geo.x + new_c.width - useless_gap
                        end


                    elseif focusNode.data == "vertical" then
                        new_c.height = math.floor((avail_geo.height - useless_gap) / 2.0 )
                        new_c.width = avail_geo.width
                        old_focus_c.height = math.floor((avail_geo.height - useless_gap) / 2.0 )
                        old_focus_c.width = avail_geo.width
                        old_focus_c.x = avail_geo.x
                        new_c.x = avail_geo.x

                        if  treetile.direction == "right" then
                            new_c.y = avail_geo.y + new_c.height + useless_gap
                            old_focus_c.y = avail_geo.y
                        else
                            new_c.y = avail_geo.y 
                            old_focus_c.y =avail_geo.y + new_c.height - useless_gap
                        end

                    end
                    
                    -- put geometry of clients into tables
                    if focusId then
                        trees[tag].geo[focusId] = old_focus_c
                        trees[tag].geo[hash(c)] = new_c
                    end
                

                end
            end
            -- }}} 

            prevClient = c
        end
        forceSplit = nil
    end


    -- update the geometries of all clients
    if changed ~= 0 or layoutSwitch or update then

        if n >= 1 then
            for i, c in ipairs(p.clients) do
                local hints = {}

                local geo = nil
                geo = trees[tag].geo[hash(c)]
                if type(geo) == 'table' then 
                    --gs[c] = geo
                    c:geometry(geo)
                    --hints.width, hints.height = c:apply_size_hints(geo.width, geo.height)
                else
                    debug.print_error("wrong geometry in treetile/init.lua")
                end
            end
        end

        layoutSwitch=false
    end
end

local function clip(v, min, max)
    return math.max(math.min(v,max), min)
end


function treetile.resize_client(inc)  --{{{ resize client
    -- inc: percentage of change: 0.01, 0.99 with +/-
    local focus_c = capi.client.focus
    local g = focus_c:geometry()

    local tag = tostring(focus_c.screen.selected_tag or awful.tag.selected(focus_c.screen))

    local parent_node = trees[tag].geo_t:getParent(hash(focus_c))
    local parent_c = trees[tag].t:getParent(hash(focus_c))
    local sib_node = trees[tag].geo_t:getSibling(hash(focus_c))
    local sib_node_geo
    if type(sib_node.data) == "number" then
        sib_node_geo = trees[tag].geo[sib_node.data]
    else
        sib_node_geo = sib_node.data
    end

    local parent_geo

    if parent_node then
        parent_geo = parent_node.data
    else
        return
    end

    local new_geo = {}
    local new_sib = {}
  
    local min_y = 20.0
    local min_x = 20.0

    local useless_gap = tonumber(beautiful.useless_gap)
    if useless_gap == nil then
        useless_gap = 0
    else
        useless_gap = useless_gap * 2.0
    end

    new_geo.x = g.x
    new_geo.y = g.y
    new_geo.width = g.width
    new_geo.height = g.height

    local fact_y
    local fact_x

    if parent_c.data =='vertical' then
        fact_y =  math.ceil(clip(g.height * clip(math.abs(inc), 0.01, 0.99), 5, 30))
        if inc < 0 then 
            fact_y = -fact_y
        end

    end
  
    if parent_c.data =='horizontal' then
        fact_x =  math.ceil(clip(g.width * clip(math.abs(inc), 0.01, 0.99), 5, 30))
        if inc < 0 then 
            fact_x = - fact_x
        end
    end


    if parent_c.data =='vertical' then
        -- determine which is on the right side
        if g.y  > sib_node_geo.y  then
            new_geo.height = clip(g.height - fact_y, min_y, parent_geo.height - min_y)
            new_geo.y = parent_geo.y + parent_geo.height - new_geo.height
  
            new_sib.x = parent_geo.x
            new_sib.y = parent_geo.y
            new_sib.width = parent_geo.width
            new_sib.height = parent_geo.height - new_geo.height - useless_gap
        else
            new_geo.y = g.y
            new_geo.height = clip(g.height + fact_y, min_y, parent_geo.height - min_y)
  
            new_sib.x = new_geo.x
            new_sib.y = new_geo.y + new_geo.height + useless_gap
            new_sib.width = parent_geo.width
            new_sib.height = parent_geo.height - new_geo.height - useless_gap
        end
    end
  
    
    if parent_c.data =='horizontal' then
        -- determine which is on the top side
        if g.x  > sib_node_geo.x  then

            new_geo.width = clip(g.width - fact_x, min_x, parent_geo.width - min_x)
            new_geo.x = parent_geo.x + parent_geo.width - new_geo.width
            
            new_sib.y = parent_geo.y 
            new_sib.x = parent_geo.x 
            new_sib.height = parent_geo.height 
            new_sib.width = parent_geo.width - new_geo.width - useless_gap
        else
            new_geo.x = g.x
            new_geo.width = clip(g.width + fact_x, min_x, parent_geo.width - min_x)
  
            new_sib.y = parent_geo.y 
            new_sib.x = parent_geo.x + new_geo.width + useless_gap
            new_sib.height = parent_geo.height 
            new_sib.width = parent_geo.width - new_geo.width - useless_gap
        end
    end
  

  trees[tag].geo[hash(focus_c)] = new_geo

  local sib_node = trees[tag].geo_t:getSibling(hash(focus_c))

   if sib_node ~= nil then 
       sib_node:update_nodes_geo(new_sib, trees[tag].geo)
   end


  for _, c in ipairs(trees[tag].clients) do
        local geo = nil
        geo = trees[tag].geo[hash(c)]
        if type(geo) == 'table' then 
            c:geometry(geo)
        else
            debug.print_error("wrong geometry in init.lua")
        end
   end

end--}}}


function treetile.arrange(p)
    return do_treetile(p)
end

-- no implimented yet, do not use it!
-- resizing should only happen between the siblings? I guess so
-- 
local function mouse_resize_handler(c, _, _, _)--{{{
    local orientation = orientation or "tile"
    local wa = capi.screen[c.screen].workarea
    local tag = tostring(c.screen.selected_tag or awful.tag.selected(c.screen))
    local cursor
    local g = c:geometry()
    local offset = 0
    local corner_coords
    
    local parent_c = trees[tag].t:getParent(hash(c))
    
    local parent_node = trees[tag].geo_t:getParent(hash(c))
    local parent_geo

    local new_y = nil
    local new_x = nil

    local sib_node = trees[tag].geo_t:getSibling(hash(c))
    local sib_node_geo
    if type(sib_node.data) == "number" then
        sib_node_geo = trees[tag].geo[sib_node.data]
    else
        sib_node_geo = sib_node.data
    end

    if parent_node then
        parent_geo = parent_node.data
    else
        return
    end
    if parent_c then
        if parent_c.data =='vertical' then
            cursor = "sb_v_double_arrow"
            new_y = math.max(g.y, sib_node_geo.y)
            new_x = g.x + g.width / 2
        end

        if parent_c.data =='horizontal' then
            cursor = "sb_h_double_arrow"
            new_x = math.max(g.x, sib_node_geo.x)
            new_y = g.y + g.height / 2
        end
    end


    corner_coords = { x = new_x, y = new_y }   
    
    capi.mouse.coords(corner_coords)

    local prev_coords = {}
    capi.mousegrabber.run(function (_mouse)
                              for k, v in ipairs(_mouse.buttons) do
                                  if v then
                                      prev_coords = { x =_mouse.x, y = _mouse.y }
                                      local fact_x = (_mouse.x - corner_coords.x) 
                                      local fact_y = (_mouse.y - corner_coords.y) 

                                      local new_geo = {}
                                      local new_sib = {}

                                      local min_x = 15.0
                                      local min_y = 15.0

                                      new_geo.x = g.x
                                      new_geo.y = g.y
                                      new_geo.width = g.width
                                      new_geo.height = g.height

                                      if parent_c.data =='vertical' then
                                          if g.y > sib_node_geo.y then
                                              new_geo.height = clip(g.height - fact_y, min_y, parent_geo.height - min_y)
                                              new_geo.y= clip(_mouse.y, sib_node_geo.y + min_y, parent_geo.y + parent_geo.height - min_y)

                                              new_sib.x = parent_geo.x
                                              new_sib.y = parent_geo.y
                                              new_sib.width = parent_geo.width
                                              new_sib.height = parent_geo.height - new_geo.height
                                          else
                                              new_geo.y = g.y 
                                              new_geo.height = clip(g.height + fact_y,  min_y, parent_geo.height - min_y)

                                              new_sib.x = new_geo.x
                                              new_sib.y = new_geo.y + new_geo.height
                                              new_sib.width = parent_geo.width
                                              new_sib.height = parent_geo.height - new_geo.height
                                          end
                                      end

                                      
                                      if parent_c.data =='horizontal' then
                                          if g.x  > sib_node_geo.x  then
                                              new_geo.width = clip(g.width - fact_x, min_x, parent_geo.width - min_x)
                                              new_geo.x = clip(_mouse.x, sib_node_geo.x + min_x, parent_geo.x + parent_geo.width - min_x)

                                              new_sib.y = parent_geo.y 
                                              new_sib.x = parent_geo.x 
                                              new_sib.height = parent_geo.height 
                                              new_sib.width = parent_geo.width - new_geo.width
                                          else
                                              new_geo.x = g.x 
                                              new_geo.width = clip(g.width + fact_x, min_x, parent_geo.width - min_x)

                                              new_sib.y = parent_geo.y 
                                              new_sib.x = parent_geo.x + new_geo.width
                                              new_sib.height = parent_geo.height 
                                              new_sib.width = parent_geo.width - new_geo.width
                                          end
                                      end


                                      trees[tag].geo[hash(c)] = new_geo

                                      local sib_node = trees[tag].geo_t:getSibling(hash(c))

                                       if sib_node ~= nil then 
                                           sib_node:update_nodes_geo(new_sib, trees[tag].geo)
                                       end


                                      for _, c in ipairs(trees[tag].clients) do
                                            local geo = nil
                                            geo = trees[tag].geo[hash(c)]
                                            if type(geo) == 'table' then 
                                                c:geometry(geo)
                                            else
                                                debug.print_error ("wrong geometry in init.lua")
                                            end
                                       end
                                      return true
                                  end
                              end
                              return prev_coords.x == _mouse.x and prev_coords.y == _mouse.y
                          end, cursor)
end
--}}}

function treetile.mouse_resize_handler(c, corner, x, y)
    mouse_resize_handler(c, corner,x,y)
end


return treetile
