def clamp(value: float, low: float, high: float) -> float:
    return min(max(value, low), high)


def normalized_error(target: float, measured: float) -> float:
    return clamp(target - measured, -1.0, 1.0)
