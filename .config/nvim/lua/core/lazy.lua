-- ==================================================================== --
--  lua/core/lazy.lua  ── plugin specification & per-plugin configs
-- --------------------------------------------------------------------
--  • lazy.nvim handles installation, versioning (lazy-lock.json),
--    and lazy-loading on various triggers (event/cmd/ft/keys/…)
--  • Each plugin entry is preceded by a comment explaining its purpose
--  • To **change colourscheme**:
--        1) install preferred theme below
--        2) adapt the `vim.cmd("colorscheme …")` line in Colorschemes
-- ==================================================================== --
local lazy = require("lazy")

lazy.setup({

  --------------------------------------------------------------------
  -- § Essentials / libraries
  --------------------------------------------------------------------
  { -- Lua utility functions used by many plugins
    "nvim-lua/plenary.nvim",
    lazy = true,
  },

  { -- Devicons (file-type glyphs) for statusline, file tree, etc.
    "nvim-tree/nvim-web-devicons",
    lazy = true,
  },

  --------------------------------------------------------------------
  -- § Plugin manager can manage itself
  --------------------------------------------------------------------
  { "folke/lazy.nvim", version = "*" },

  --------------------------------------------------------------------
  -- § Colorschemes  ——  default = tokyonight-moon
  --    » Add/Remove themes here; switch via :colorscheme <name>
  --------------------------------------------------------------------
  { -- TokyoNight: soft yet vivid dark theme
    "folke/tokyonight.nvim",
    priority = 1000,            -- load first
    lazy = false,               -- load during startup
    config = function()
      vim.cmd("colorscheme tokyonight-moon") -- ← change here
    end,
  },

  { -- Kanagawa: warm, ink-wash painting inspired palette
    "rebelot/kanagawa.nvim",
    lazy = true,                -- only if :colorscheme kanagawa*
  },

  { -- Catppuccin: pastel, community-driven palette
    "catppuccin/nvim",
    name = "catppuccin",
    lazy = true,
  },

  --------------------------------------------------------------------
  -- § UI / Helper plugins
  --------------------------------------------------------------------
  { -- Lualine: blazing-fast statusline
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      require("lualine").setup({
        options = {
          theme = "auto",
          section_separators   = { left = "", right = "" },
          component_separators = { left = "", right = "" },
        },
      })
    end,
  },

  { -- Oil.nvim: Vim-style editable file browser (replaces nvim-tree)
    "stevearc/oil.nvim",
    cmd = "Oil",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function() require("oil").setup() end,
  },

  { -- Which-key: popup showing pending keybinds (great for discovery)
    "folke/which-key.nvim",
    event = "VeryLazy",
    config = function() require("which-key").setup() end,
  },

  { -- Comment.nvim: smart commenter (gcc, gc in visual, etc.)
    "numToStr/Comment.nvim",
    event = "VeryLazy",
    config = function() require("Comment").setup() end,
  },

  { -- Autopairs: insert/auto-close brackets, quotes, etc.
    "windwp/nvim-autopairs",
    event = "InsertEnter",
    config = function()
      require("nvim-autopairs").setup({})
      -- integrate with nvim-cmp
      local cmp_autopairs = require("nvim-autopairs.completion.cmp")
      require("cmp").event:on("confirm_done", cmp_autopairs.on_confirm_done())
    end,
  },

  --------------------------------------------------------------------
  -- § Telescope – fuzzy finder (files, grep, buffers, …)
  --------------------------------------------------------------------
  { -- Core Telescope
    "nvim-telescope/telescope.nvim",
    branch = "0.1.x",
    cmd = "Telescope",
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      require("telescope").setup({
        defaults = {
          layout_strategy = "horizontal",
          layout_config   = { prompt_position = "top" },
          sorting_strategy = "ascending",
        },
      })
    end,
  },

  { -- Native FZF sorter (optional, faster)
    "nvim-telescope/telescope-fzf-native.nvim",
    build = "make",                            -- compile C module
    cond  = vim.fn.executable("make") == 1,    -- skip if no make
    dependencies = { "nvim-telescope/telescope.nvim" },
    config = function() require("telescope").load_extension("fzf") end,
  },

  --------------------------------------------------------------------
  -- § Treesitter – incremental parsing for syntax, folds, etc.
  --------------------------------------------------------------------
  { "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",                       -- auto-update parsers
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {                   -- languages to install
          "lua", "css", "html", "python", "json", "yaml", "bash"
        },
        highlight = { enable = true },         -- syntax highlight
        indent    = { enable = true },         -- better =indent
      })
    end,
  },

  --------------------------------------------------------------------
  -- § Git decorations – signs in gutter, hunk actions
  --------------------------------------------------------------------
  { "lewis6991/gitsigns.nvim",
    event = "BufReadPre",
    config = function() require("gitsigns").setup() end,
  },

  --------------------------------------------------------------------
  -- § Completion engine (nvim-cmp) + snippet engine (LuaSnip)
  --------------------------------------------------------------------
  { "hrsh7th/nvim-cmp",
    event = "InsertEnter",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",   -- LSP source
      "hrsh7th/cmp-buffer",     -- buffer words
      "hrsh7th/cmp-path",       -- filesystem paths
      "saadparwaiz1/cmp_luasnip",
      "L3MON4D3/LuaSnip",       -- snippet engine
    },
    config = function()
      local cmp     = require("cmp")
      local luasnip = require("luasnip")
      luasnip.config.setup({})          -- default snippet config

      cmp.setup({
        snippet = {
          expand = function(args) luasnip.lsp_expand(args.body) end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<CR>"]      = cmp.mapping.confirm({ select = true }),
          ["<C-Space>"] = cmp.mapping.complete(),
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" },
          { name = "luasnip" },
          { name = "path" },
          { name = "buffer" },
        }),
      })
    end,
  },

  --------------------------------------------------------------------
  -- § LSP tool-chain  (Mason v2  +  mason-lspconfig  +  nvim-lspconfig)
  --------------------------------------------------------------------
  { -- Mason: binary downloader/manager for LSPs, DAPs, linters, formatters
    "mason-org/mason.nvim",
    lazy = false,        -- load at startup so :Mason commands exist instantly
    opts = {},           -- default UI is fine
  },

  { -- Bridge between Mason and nvim-lspconfig (auto-register servers)
    "mason-org/mason-lspconfig.nvim",
    lazy = false,
    dependencies = {
      { "mason-org/mason.nvim", opts = {} },
      "neovim/nvim-lspconfig",
    },
    opts = {},           -- actual server list lives in lua/lsp/init.lua
  },

  { -- nvim-lspconfig: configs for 50+ language servers
    "neovim/nvim-lspconfig",
    lazy = false,
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",          -- share capabilities with cmp
      "mason-org/mason-lspconfig.nvim",
    },
    config = function() require("lsp") end, -- delegate to our lsp module
  },
},
{
  ui = { border = "rounded" },            -- nicer floating windows
  install = {                             -- what lazy.nvim installs first
    colorscheme = { "tokyonight", "catppuccin", "kanagawa" },
  },
  change_detection = { notify = false },  -- disable noisy “plugin X updated”
})
