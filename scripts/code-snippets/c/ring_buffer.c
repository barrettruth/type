size_t ring_next(size_t index, size_t capacity) {
  if (capacity == 0) {
    return 0;
  }
  return (index + 1) % capacity;
}
