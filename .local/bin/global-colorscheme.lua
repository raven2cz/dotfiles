#!/usr/bin/env lua
local params = {...}
for key,value in pairs(params) do print(key, value) end

local sel_sc = params[1]

local colorschemes = {
  dracula = {
    kitty = "Dracula",
    alacritty = "dracula.yaml",
    emacs = "doom-dracula",
    nvim = "dracula",
  },
  doom_one = {
    kitty = "Doom Vibrant",
    alacritty = "doom_one.yml",
    emacs = "doom-one",
    nvim = "doom-one",
  },
  darcula = {
    kitty = "Jet Brains Darcula",
    alacritty = "darcula.yaml",
    emacs = "doom-one",
    nvim = "darcula-solid",
  },
  eighties_one_dark = {
    kitty = "Atom",
    alacritty = "dark_pastels.yaml",
    emacs = "doom-one",
    nvim = "everforest",
  },
  gruvbox_dark_soft = {
    kitty = "Gruvbox Dark",
    alacritty = "gruvbox_dark.yaml",
    emacs = "doom-gruvbox",
    nvim = "gruvbox-baby",
  },
  gruvbox_light_soft = {
    kitty = "Gruvbox Light",
    alacritty = "gruvbox_light.yaml",
    emacs = "doom-gruvbox-light",
    nvim = "dawnfox",
  },
  material_palenight = {
    kitty = "Oceanic Material",
    alacritty = "palenight.yml",
    emacs = "doom-palenight",
    nvim = "palenight",
  },
  material = {
    kitty = "Material Dark",
    alacritty = "material_theme.yaml",
    emacs = "doom-material",
    nvim = "material",
  },
  monokai_pro = {
    kitty = "Monokai Pro",
    alacritty = "monokai_pro.yaml",
    emacs = "doom-monokai-pro",
    nvim = "sonokai",
  },
  nord = {
    kitty = "Nord",
    alacritty = "nord.yaml",
    emacs = "doom-nord",
    nvim = "nordfox",
  },
  oceanic_next = {
    kitty = "Oceanic Material",
    alacritty = "oceanic_next.yaml",
    emacs = "doom-oceanic-next",
    nvim = "OceanicNext",
  },
  one_dark = {
    kitty = "One Dark",
    alacritty = "one_dark.yaml",
    emacs = "doom-one",
    nvim = "darkplus",
  },
  solarized_dark = {
    kitty = "Solarized Dark - Patched",
    alacritty = "solarized_dark.yaml",
    emacs = "doom-solarized-dark",
    nvim = "solarized",
  },
  solarized_light = {
    kitty = "Solarized Light",
    alacritty = "solarized_light.yaml",
    emacs = "doom-solarized-light",
    nvim = "dayfox",
  },
  tomorrow_night = {
    kitty = "Tomorrow Night Eighties",
    alacritty = "tomorrow_night.yaml",
    emacs = "doom-tomorrow-night",
    nvim = "tokyonight",
  },
}

local function writeToFile(resource, content)
  local file = assert(io.open(resource, "w"))
  file:write(content)
  file:close()
end

local function loadFromFile(resource)
  local file = assert(io.open(resource, "r"))
  local content = file:read("*a")
  file:close()
  return content
end

local function atom_cs(scheme)
  local homeDir = os.getenv("HOME")
  local content = loadFromFile(homeDir.."/.atom/config.cson")
  local sidx = string.find(content, "themes: [", nil, true)
  if sidx == nil then
    sidx = string.find(content, "core:")
    if sidx == nil then return end
    content = content:sub(1,sidx+5).."    themes: [\n"..scheme.."    ]\n"..content:sub(sidx+6)
  else
    local eidx = string.find(content, "]", sidx + 1, true)
    content = content:sub(1,sidx+9)..scheme..content:sub(eidx-4)
  end
  writeToFile(homeDir.."/.atom/config.cson", content)
end

if sel_sc == "list" then
  print("Available colorschemes:")
  local tkeys = {}
  for k in pairs(colorschemes) do table.insert(tkeys, k) end
  table.sort(tkeys)
  for _, k in ipairs(tkeys) do print(k) end
  return
end

local homeDir = os.getenv("HOME")
local found = false
for colorId,apps in pairs(colorschemes) do
  print(colorId, apps)
  if sel_sc == colorId then
    print(colorId.." [selected]")
    found = true
    for appId,cs in pairs(apps) do
      print(appId, cs)
      -- KITTY
      if appId == "kitty" then
        os.execute("kitty +kitten themes --reload-in=all "..cs)
      -- ALACRITTY
      elseif appId == "alacritty" then
        os.execute("alacritty-colorscheme -V apply "..cs)
      -- DOOM EMACS
      elseif appId == "emacs" then
        os.execute('sed -i "/(load-theme/c\\(load-theme \''..cs..' t)" '..homeDir..'/.config/doom/config.el')
      -- NEOVIM
      elseif appId == "nvim" then
        os.execute('sed -i "/local theme/c\\local theme = \''..cs..'\'" '..homeDir..'/.config/nvim/lua/user/colorscheme.lua')
      -- ATOM
      elseif appId == "atom" then
        atom_cs(cs)
      end
    end
    break
  end
end

if not found then
  print("No color scheme was selected. Choose available color scheme by input argument!")
else
  print("Color scheme is applied successufully.")
end
