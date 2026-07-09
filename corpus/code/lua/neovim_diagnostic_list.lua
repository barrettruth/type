local function set_list(loclist, opts)
  opts = opts or {}
  local open = vim.nonnil(opts.open, true)
  local title = opts.title or 'Diagnostics'
  local winnr = opts.winnr or 0
  local bufnr --- @type integer?
  if loclist then
    bufnr = api.nvim_win_get_buf(winnr)
  end

  -- Don't clamp line numbers since the quickfix list can already handle line
  -- numbers beyond the end of the buffer
  local diagnostics = M._store.get_diagnostics(bufnr, opts --[[@as vim.diagnostic.GetOpts]], false)
  if opts.format then
    diagnostics = require('vim.diagnostic._shared').reformat_diagnostics(opts.format, diagnostics)
  end
  local items = M.toqflist(diagnostics)
  local qf_id = nil
  if loclist then
    vim.fn.setloclist(winnr, {}, 'u', { title = title, items = items })
  else
    qf_id = get_qf_id_for_title(title)
    -- If we already have a diagnostics quickfix, update it rather than creating a new one.
    -- This avoids polluting the finite set of quickfix lists, and preserves the currently selected
    -- entry.
    vim.fn.setqflist({}, qf_id and 'u' or ' ', {
      title = title,
      items = items,
      id = qf_id,
    })
  end

  if open then
    if not loclist then
      -- First navigate to the diagnostics quickfix list.
      local qflist = vim.fn.getqflist({ id = qf_id, nr = 0 }) --- @type { nr: integer }
      local nr = qflist.nr
      api.nvim_command(('silent %dchistory'):format(nr))
      -- Now open the quickfix list.
      api.nvim_command('botright cwindow')
    else
      api.nvim_command('lwindow')
    end
  end
end
