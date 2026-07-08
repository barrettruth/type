local function clamp(value, low, high)
  return math.min(math.max(value, low), high)
end

return clamp
