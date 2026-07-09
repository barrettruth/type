function Client:_process_request(id, req_type, bufnr, method)
  local pending = req_type == 'pending'

  validate('id', id, 'number')
  if pending then
    validate('bufnr', bufnr, 'number')
    validate('method', method, 'string')
  end

  local cur_request = self.requests[id]

  if pending and cur_request then
    log.error(
      self._log_prefix,
      ('Cannot create request with id %d as one already exists'):format(id)
    )
    return
  elseif not pending and not cur_request then
    log.error(
      self._log_prefix,
      ('Cannot find request with id %d whilst attempting to %s'):format(id, req_type)
    )
    return
  end

  if cur_request then
    bufnr = cur_request.bufnr
    method = cur_request.method
  end

  assert(bufnr and method)

  local request = { type = req_type, bufnr = bufnr, method = method }

  -- Clear 'complete' requests
  -- Note 'pending' and 'cancelled' requests are cleared when the server sends a response
  -- which is processed via the notify_reply_callback argument to rpc.request.
  self.requests[id] = req_type ~= 'complete' and request or nil

  api.nvim_exec_autocmds('LspRequest', {
    buf = api.nvim_buf_is_valid(bufnr) and bufnr or nil,
    modeline = false,
    data = { client_id = self.id, request_id = id, request = request },
  })
end
