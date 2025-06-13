-- ==================================================================== --
--  lua/core/keymaps.lua  ── global key-bindings
-- --------------------------------------------------------------------
--  Leader key = <Space>
--  All mappings are non-recursive & silent by default
-- ==================================================================== --
local map  = vim.keymap.set
local opts = { noremap = true, silent = true }

vim.g.mapleader      = " "
vim.g.maplocalleader = " "

-- --------------------------------------------------------------------
--  ↪ File operations
-- --------------------------------------------------------------------
map("n", "<leader>w", ":w<CR>", opts) -- <Space>w  → save file (:write)
map("n", "<leader>q", ":q<CR>", opts) -- <Space>q  → quit window

-- --------------------------------------------------------------------
--  ↪ Telescope – fuzzy finder shortcuts
-- --------------------------------------------------------------------
map("n", "<leader>ff", "<cmd>Telescope find_files<CR>",  opts) -- files
map("n", "<leader>fg", "<cmd>Telescope live_grep<CR>",   opts) -- ripgrep
map("n", "<leader>fb", "<cmd>Telescope buffers<CR>",     opts) -- open buffers
map("n", "<leader>fh", "<cmd>Telescope help_tags<CR>",   opts) -- :help tags

-- --------------------------------------------------------------------
--  ↪ Oil.nvim – open as *persistent* sidebar on the left
--     • vertical=true  → open in vertical split
--     • split="left"   → force position to the far left (keeps file visible)
-- --------------------------------------------------------------------
map("n", "<leader>e", function()
  -- Open *current* directory in a topleft vertical split 30 columns wide
  require("oil").open("",{
    split    = "left",   -- force far-left position
    size     = 30,       -- initial width in columns
    dir      = vim.fn.getcwd(), -- open project root; swap for "%:p:h" if you prefer current file’s dir
  })
end, { desc = "Open Oil sidebar", noremap = true, silent = true })

-- --------------------------------------------------------------------
--  ↪ Toggle relative line numbers (handy for screencasts)
-- --------------------------------------------------------------------
map("n", "<leader>rn", function()
  vim.opt.relativenumber = not vim.opt.relativenumber:get()
end, { desc = "Toggle relative number" })
