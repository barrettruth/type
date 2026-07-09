# All provided arguments are joined with a space, then prefixed by the name of the function which invoked `nixLog` (or
# the hook name if the caller was an implicit hook), then directed to $NIX_LOG_FD, if it's set.
nixLog() {
  # Return a value explicitly instead of the implicit return of the last command (result of the test).
  # NOTE: By requiring NIX_LOG_FD be set, we avoid dumping logging inside of nix-shell.
  [[ -z ${NIX_LOG_FD-} ]] && return 0

  # Use the function name of the caller, unless it is _callImplicitHook, in which case use the name of the hook.
  local callerName="${FUNCNAME[1]}"
  if [[ $callerName == "_callImplicitHook" ]]; then
    callerName="${hookName:?}"
  fi
  printf "%s: %s\n" "$callerName" "$*" >&"$NIX_LOG_FD"
}

# Identical to nixLog, but additionally prefixed by the logLevel.
# NOTE: This function is only every meant to be called from the nix*Log family of functions.
_nixLogWithLevel() {
  # Return a value explicitly instead of the implicit return of the last command (result of the test).
  # NOTE: By requiring NIX_LOG_FD be set, we avoid dumping logging inside of nix-shell.
  [[ -z ${NIX_LOG_FD-} || ${NIX_DEBUG:-0} -lt ${1:?} ]] && return 0

  local logLevel
  case "${1:?}" in
  0) logLevel=ERROR ;;
  1) logLevel=WARN ;;
  2) logLevel=NOTICE ;;
  3) logLevel=INFO ;;
  4) logLevel=TALKATIVE ;;
  5) logLevel=CHATTY ;;
  6) logLevel=DEBUG ;;
  7) logLevel=VOMIT ;;
  *)
    echo "_nixLogWithLevel: called with invalid log level: ${1:?}" >&"$NIX_LOG_FD"
    return 1
    ;;
  esac

  # Use the function name of the caller, unless it is _callImplicitHook, in which case use the name of the hook.
  # NOTE: Our index into FUNCNAME is 2, not 1, because we are only ever to be called from the nix*Log family of
  # functions, never directly.
  local callerName="${FUNCNAME[2]}"
  if [[ $callerName == "_callImplicitHook" ]]; then
    callerName="${hookName:?}"
  fi

  # Use the function name of the caller's caller, since we should only every be invoked by nix*Log functions.
  printf "%s: %s: %s\n" "$logLevel" "$callerName" "${2:?}" >&"$NIX_LOG_FD"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlError` in the Nix source.
nixErrorLog() {
  _nixLogWithLevel 0 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlWarn` in the Nix source.
nixWarnLog() {
  _nixLogWithLevel 1 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlNotice` in the Nix source.
nixNoticeLog() {
  _nixLogWithLevel 2 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlInfo` in the Nix source.
nixInfoLog() {
  _nixLogWithLevel 3 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlTalkative` in the Nix source.
nixTalkativeLog() {
  _nixLogWithLevel 4 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlChatty` in the Nix source.
nixChattyLog() {
  _nixLogWithLevel 5 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlDebug` in the Nix source.
nixDebugLog() {
  _nixLogWithLevel 6 "$*"
}

# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.
# Corresponds to `Verbosity::lvlVomit` in the Nix source.
nixVomitLog() {
  _nixLogWithLevel 7 "$*"
}
