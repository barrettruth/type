set -euo pipefail

items=("alpha" "beta" "gamma")
for item in "${items[@]}"; do
  printf '%s\n' "${item^^}"
done
