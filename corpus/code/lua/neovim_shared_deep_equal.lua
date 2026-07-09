local function deep_equal(left, right, seen)
  if left == right then
    return true
  end

  if type(left) ~= type(right) then
    return false
  end

  if type(left) ~= 'table' then
    return false
  end

  seen = seen or {}
  local seen_left = seen[left]
  if seen_left and seen_left[right] ~= nil then
    return seen_left[right]
  end

  seen_left = seen_left or {}
  seen[left] = seen_left
  -- Assume equality while descending so recursive structures can terminate.
  seen_left[right] = true

  for k, v in pairs(left) do
    if not deep_equal(v, right[k], seen) then
      seen_left[right] = false
      return false
    end
  end

  for k in pairs(right) do
    if left[k] == nil then
      seen_left[right] = false
      return false
    end
  end

  return true
end

function vim.deep_equal(a, b)
  return deep_equal(a, b)
end

function vim.list_extend(dst, src, start, finish)
  vim.validate('dst', dst, 'table')
  vim.validate('src', src, 'table')
  vim.validate('start', start, 'number', true)
  vim.validate('finish', finish, 'number', true)
  for i = start or 1, finish or #src do
    table.insert(dst, src[i])
  end
  return dst
end
