--- Validates a client configuration as given to |vim.lsp.start()|.
--- @param config vim.lsp.ClientConfig
local function validate_config(config)
  validate('config', config, 'table')
  validate('handlers', config.handlers, 'table', true)
  validate('capabilities', config.capabilities, 'table', true)
  validate('cmd_cwd', config.cmd_cwd, optional_validator(is_dir), 'directory')
  validate('cmd_env', config.cmd_env, 'table', true)
  validate('detached', config.detached, 'boolean', true)
  validate('exit_timeout', config.exit_timeout, { 'number', 'boolean' }, true)
  validate('name', config.name, 'string', true)
  validate('on_error', config.on_error, 'function', true)
  validate('on_exit', config.on_exit, { 'function', 'table' }, true)
  validate('on_init', config.on_init, { 'function', 'table' }, true)
  validate('on_attach', config.on_attach, { 'function', 'table' }, true)
  validate('settings', config.settings, 'table', true)
  validate('commands', config.commands, 'table', true)
  validate('before_init', config.before_init, { 'function', 'table' }, true)
  validate('offset_encoding', config.offset_encoding, 'string', true)
  validate('flags', config.flags, 'table', true)
  validate('get_language_id', config.get_language_id, 'function', true)

  assert(
    (
      not config.flags
      or not config.flags.debounce_text_changes
      or type(config.flags.debounce_text_changes) == 'number'
    ),
    'flags.debounce_text_changes must be a number with the debounce time in milliseconds'
  )
end

--- @param trace string
--- @return 'off'|'messages'|'verbose'
local function get_trace(trace)
  local valid_traces = {
    off = 'off',
    messages = 'messages',
    verbose = 'verbose',
  }
  return trace and valid_traces[trace] or 'off'
end

--- @param id integer
--- @param config vim.lsp.ClientConfig
--- @return string
local function get_name(id, config)
  local name = config.name
  if name then
    return name
  end

  if type(config.cmd) == 'table' and config.cmd[1] then
    return assert(vim.fs.basename(config.cmd[1]))
  end

  return tostring(id)
end

--- @nodoc
--- @param config vim.lsp.ClientConfig
--- @return vim.lsp.Client?
function Client.create(config)
  validate_config(config)

  client_index = client_index + 1
  local id = client_index
  local name = get_name(id, config)

  --- @class vim.lsp.Client
  local self = {
    id = id,
    config = config,
    handlers = config.handlers or {},
    offset_encoding = validate_encoding(config.offset_encoding),
    name = name,
    _log_prefix = string.format('LSP[%s]', name),
    requests = {},
    attached_buffers = {},
    server_capabilities = {},
    registrations = {},
    commands = config.commands or {},
    settings = config.settings or {},
    flags = config.flags or {},
    exit_timeout = config.exit_timeout or false,
