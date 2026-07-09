local function tbl_extend_rec(behavior, deep_extend, ...)
  local ret = {} --- @type table<any,any>
  if vim._empty_dict_mt ~= nil and getmetatable(select(1, ...)) == vim._empty_dict_mt then
    ret = vim.empty_dict()
  end

  for i = 1, select('#', ...) do
    local tbl = select(i, ...) --[[@as table<any,any>]]
    if tbl then
      for k, v in pairs(tbl) do
        if deep_extend and can_merge(v) and can_merge(ret[k]) then
          ret[k] = tbl_extend_rec(behavior, true, ret[k], v)
        elseif type(behavior) == 'function' then
          ret[k] = behavior(k, ret[k], v)
        elseif behavior ~= 'force' and ret[k] ~= nil then
          if behavior == 'error' then
            error('key found in more than one map: ' .. k)
          end -- Else behavior is "keep".
        else
          ret[k] = v
        end
      end
    end
  end

  return ret
end

local function tbl_extend(behavior, deep_extend, ...)
  if
    behavior ~= 'error'
    and behavior ~= 'keep'
    and behavior ~= 'force'
    and type(behavior) ~= 'function'
  then
    error('invalid "behavior": ' .. tostring(behavior))
  end

  local nargs = select('#', ...)

  if nargs < 2 then
    error(('wrong number of arguments (given %d, expected at least 3)'):format(1 + nargs))
  end

  for i = 1, nargs do
    vim.validate('after the second argument', select(i, ...), 'table')
  end

  return tbl_extend_rec(behavior, deep_extend, ...)
end
