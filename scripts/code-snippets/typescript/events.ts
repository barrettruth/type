function onKey(event: KeyboardEvent): string | null {
  return event.key.length === 1 ? event.key : null;
}
