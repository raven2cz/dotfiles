local colorscheme = require "fishlive.colorscheme"

menu = {}

-- Colorschemes Switcher --
menu.prepare_colorscheme_menu = function()
  local menucs = {}
  for i, cs in ipairs(colorscheme.table) do
      menucs[i] = { cs.scheme, function()
          local homeDir = os.getenv("HOME")
          -- call global colorscheme script for switch all GNU/Linux apps
          os.execute(homeDir .. "/bin/global-colorscheme.lua " .. cs.scheme_id)
          -- permanent storage of selected colorscheme to last.lua
          local file = io.open(homeDir .. "/.config/awesome/fishlive/colorscheme/last.lua", "w")
          file:write('return require "fishlive.colorscheme".' .. cs.scheme_id)
          file:close()
          -- change rofi theme
          file = io.open(homeDir .. "/.config/rofi/config.rasi", "w")
          file:write('@theme "'..homeDir..'/.config/rofi/multicolor-'..cs.scheme_id..'.rasi"')
          file:close()
          -- restart AWESOME
          awesome.restart()
        end
      }
  end
  return menucs
end

return menu
