local function statusline(mode, file)
  local parts = { mode, file.name, tostring(file.line) }
  return table.concat(parts, " ")
end

return statusline
