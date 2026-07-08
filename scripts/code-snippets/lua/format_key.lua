local map = vim.keymap.set

map("n", "<leader>f", function()
  vim.lsp.buf.format({ async = true })
end)
