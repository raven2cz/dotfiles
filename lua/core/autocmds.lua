-- ==================================================================== --
--  lua/core/autocmds.lua  ── small, helpful autocommands
-- --------------------------------------------------------------------
--  Only one example for now: highlight yank for 120 ms
-- ==================================================================== --
local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

local yankGrp = augroup("HighlightYank", {})
autocmd("TextYankPost", {
  group = yankGrp,
  pattern = "*",
  callback = function()
    vim.highlight.on_yank({ timeout = 120 })
  end,
})
