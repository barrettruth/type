set -eu

for path in "$@"; do
  [ -f "$path" ] || continue
  printf '%s\n' "$path"
done
