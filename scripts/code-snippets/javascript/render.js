function render(items) {
  return items.map((item) => String(item.label)).join(", ");
}
