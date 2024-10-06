-- Which Theme is used (can be changed externaly!)
local theme = 'darkplus'
--------------------------------------------------
local g = vim.g
local opt = vim.opt

local function Set (list)
  local set = {}
  for _, l in ipairs(list) do set[l] = true end
  return set
end

-- set themes here which needs active term gui colors, default is disabled
local termguicolors_reqs = Set {
  "doom-one",
  "everforest",
  "darcula-solid",
  "palenight",
  "sonokai",
  "OceanicNext",
  "doom-one",
}

-- gruvbox-baby
g.gruvbox_baby_function_style = "NONE"
g.gruvbox_baby_keyword_style = "ITALIC"

-- vscode
g.vscode_style = "dark" --"light"
g.vscode_transparent = 0
g.vscode_italic_comment = 1

-- everforest
g.everforest_background = "hard"
g.everforest_enable_italic = 1
g.everforest_diagnostic_text_highlight = 1
g.everforest_diagnostic_virtual_text = "colored"
g.everforest_current_word = "bold"

-- sonokai (monokai pro)
g.sonokai_style = "default" --andromeda,atlantis,shusia,maia,espresso
g.sonokai_enable_italic = 1
g.sonokai_disable_italic_comment = 0

-- fox themes
local nightfox = require("nightfox")
nightfox.setup({
  transparent = false
})

-- default
g.italic_keywords = "italic"
g.italic_function = "NONE"
g.italic_variables = "NONE"
g.transparent_background = 0

-- palenight
if theme == "palenight" then
  g.material_style = "palenight"
  theme = "material"
end
if theme == "material" then
  g.material_style = "oceanic" -- darker, deep ocean
end
if theme == "material-light" then
  g.material_style = "lighter"
  theme = "material"
end


if termguicolors_reqs[theme] then
  opt.termguicolors = true
end

-- set colorscheme according to theme variable
vim.cmd("colorscheme "..theme)

-- support for coloring of RGB color syntaxes
require 'colorizer'.setup()
