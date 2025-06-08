-- ==================================================================== --
--  lua/core/options.lua  ── editor, UI, performance settings
-- --------------------------------------------------------------------
--  Each option has a short explanation so newcomers understand *why*
-- ==================================================================== --
local opt = vim.opt

-- --------------------------------------------------------------------
--  ↪ General
-- --------------------------------------------------------------------
opt.encoding     = "utf-8"   -- internal string encoding
opt.fileencoding = "utf-8"   -- file-written encoding
opt.swapfile     = false     -- no *.swp files (use undo-tree instead)
opt.backup       = false     -- disable backup files
opt.undofile     = true      -- persistent undo across sessions
opt.clipboard    = "unnamedplus" -- sync unnamed register <-> system clipboard

-- --------------------------------------------------------------------
--  ↪ User Interface
-- --------------------------------------------------------------------
opt.number         = true      -- absolute line numbers
opt.relativenumber = true      -- …plus relative for motions
opt.cursorline     = true      -- highlight current line
opt.signcolumn     = "yes"     -- always reserve signcolumn (no text shift)
opt.termguicolors  = true      -- enable 24-bit RGB in TUI

-- --------------------------------------------------------------------
--  ↪ Indentation
-- --------------------------------------------------------------------
opt.expandtab   = true  -- convert <Tab> to spaces
opt.shiftwidth  = 2     -- spaces per indent when shifting
opt.tabstop     = 2     -- spaces per <Tab>
opt.smartindent = true  -- smart auto-indenting on new lines

-- --------------------------------------------------------------------
--  ↪ Search
-- --------------------------------------------------------------------
opt.ignorecase = true  -- case-insensitive by default…
opt.smartcase  = true  -- …unless search contains CAPs

-- --------------------------------------------------------------------
--  ↪ Performance & UX
-- --------------------------------------------------------------------
opt.updatetime = 250   -- faster CursorHold & diagnostic updates (ms)
opt.timeoutlen = 400   -- mapped sequence completion timeout (ms)
