-- ==================================================================== --
--  lua/lsp/init.lua  ── Language-Server configuration
-- --------------------------------------------------------------------
--  • Mason installs servers listed in ensure_installed
--  • mason-lspconfig registers them with nvim-lspconfig
--  • on_attach defines per-buffer keymaps once a server attaches
-- ==================================================================== --
local lspconfig       = require("lspconfig")
local mason_lspconfig = require("mason-lspconfig")

-- --------------------------------------------------------------------
--  ↪ Capabilities (advertise completion support to the servers)
-- --------------------------------------------------------------------
local capabilities = require("cmp_nvim_lsp").default_capabilities()

-- --------------------------------------------------------------------
--  ↪ on_attach  (buffer-local mappings once LSP is active)
-- --------------------------------------------------------------------
local on_attach = function(_, bufnr)
  local nmap = function(keys, func, desc)
    if desc then desc = "LSP: " .. desc end
    vim.keymap.set("n", keys, func, { buffer = bufnr, desc = desc })
  end

  nmap("gd",         vim.lsp.buf.definition,    "Go to definition")
  nmap("K",          vim.lsp.buf.hover,         "Hover documentation")
  nmap("<leader>rn", vim.lsp.buf.rename,        "Rename symbol")
  nmap("<leader>ca", vim.lsp.buf.code_action,   "Code action")
  nmap("<leader>sd", vim.diagnostic.open_float, "Show diagnostics")
end

-- --------------------------------------------------------------------
--  ↪ Per-server custom settings (only Lua needs tweaks here)
-- --------------------------------------------------------------------
local servers = {
  lua_ls = {
    settings = {
      Lua = {
        diagnostics = { globals = { "vim" } },      -- ignore "vim" undefined
        workspace   = {
          checkThirdParty = false,
          library = { vim.env.VIMRUNTIME },         -- make stdlib discoverable
        },
        telemetry   = { enable = false },
      },
    },
  },
}

-- --------------------------------------------------------------------
--  ↪ Mason-LSP bridge (API v2)
-- --------------------------------------------------------------------
mason_lspconfig.setup({
  -- Mason will ensure these servers are installed (once)
  ensure_installed = {
    "lua_ls", "cssls", "html", "pyright",
    "jsonls", "yamlls", "bashls",
  },

  -- Handler called for *each* installed server (name as argument)
  handlers = {
    function(server_name)
      local opts = {
        capabilities = capabilities,
        on_attach    = on_attach,
      }
      -- merge server-specific settings if any
      if servers[server_name] then
        opts = vim.tbl_deep_extend("force", opts, servers[server_name])
      end
      lspconfig[server_name].setup(opts)
    end,
  },
})
