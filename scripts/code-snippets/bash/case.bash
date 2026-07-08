set -euo pipefail

case "${1:-}" in
start) action=run ;;
stop) action=halt ;;
*) action=status ;;
esac
printf '%s\n' "$action"
