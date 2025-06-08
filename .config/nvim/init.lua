-- ==================================================================== --
--  init.lua  ── root of ~/.config/nvim
-- --------------------------------------------------------------------
--  • Bootstraps folke/lazy.nvim       → modern plugin manager (lazy-loading,
--    lockfile, version constraints…)
--  • Loads the core modules (options, keymaps, autocmds, plugins)
--  • Keep this file minimal: anything “real” lives in lua/core or lua/lsp
-- ==================================================================== --

-- >>> 1. Make sure lazy.nvim is installed (auto-clone on first run) <<< --
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",            -- do shallow clone
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",               -- latest stable tag
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)        -- prepend to runtimepath

-- >>> 2. Load core modules (each one is fully documented inside) <<< --
require("core.options")      -- basic editor & UI settings
require("core.keymaps")      -- leader keys and helper shortcuts
require("core.autocmds")     -- small quality-of-life autocommands
require("core.lazy")         -- plugin specification  +  inline configs