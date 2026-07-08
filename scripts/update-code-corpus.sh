#!/bin/sh
set -eu

out_dir=${1:-public}
CDPATH=
script_dir=$(cd -- "$(dirname -- "$0")" && pwd)
repo_dir=$(cd -- "$script_dir/.." && pwd)
tmp=${TMPDIR:-/tmp}/ts-code-corpus-$$

mkdir -p "$out_dir" "$tmp/grammars" "$tmp/cache"
trap 'chmod -R u+w "$tmp" 2>/dev/null || true; rm -rf "$tmp"' EXIT HUP INT TERM

require_source() {
  name=$1
  value=$2
  if [ -z "$value" ]; then
    echo "$name is not set" >&2
    exit 1
  fi
  if [ ! -d "$value" ]; then
    echo "$name does not point to a directory: $value" >&2
    exit 1
  fi
}

require_source TS_TREE_SITTER_BASH_SOURCE "${TS_TREE_SITTER_BASH_SOURCE:-}"
require_source TS_TREE_SITTER_C_SOURCE "${TS_TREE_SITTER_C_SOURCE:-}"
require_source TS_TREE_SITTER_CPP_SOURCE "${TS_TREE_SITTER_CPP_SOURCE:-}"
require_source TS_TREE_SITTER_CSS_SOURCE "${TS_TREE_SITTER_CSS_SOURCE:-}"
require_source TS_TREE_SITTER_HTML_SOURCE "${TS_TREE_SITTER_HTML_SOURCE:-}"
require_source TS_TREE_SITTER_JAVASCRIPT_SOURCE "${TS_TREE_SITTER_JAVASCRIPT_SOURCE:-}"
require_source TS_TREE_SITTER_LUA_SOURCE "${TS_TREE_SITTER_LUA_SOURCE:-}"
require_source TS_TREE_SITTER_NIX_SOURCE "${TS_TREE_SITTER_NIX_SOURCE:-}"
require_source TS_TREE_SITTER_PYTHON_SOURCE "${TS_TREE_SITTER_PYTHON_SOURCE:-}"
require_source TS_TREE_SITTER_TYPESCRIPT_SOURCE "${TS_TREE_SITTER_TYPESCRIPT_SOURCE:-}"

copy_grammar() {
  name=$1
  source=$2
  mkdir -p "$tmp/grammars/$name"
  cp -R "$source"/. "$tmp/grammars/$name"
}

copy_grammar tree-sitter-bash "$TS_TREE_SITTER_BASH_SOURCE"
copy_grammar tree-sitter-c "$TS_TREE_SITTER_C_SOURCE"
copy_grammar tree-sitter-cpp "$TS_TREE_SITTER_CPP_SOURCE"
copy_grammar tree-sitter-css "$TS_TREE_SITTER_CSS_SOURCE"
copy_grammar tree-sitter-html "$TS_TREE_SITTER_HTML_SOURCE"
copy_grammar tree-sitter-javascript "$TS_TREE_SITTER_JAVASCRIPT_SOURCE"
copy_grammar tree-sitter-lua "$TS_TREE_SITTER_LUA_SOURCE"
copy_grammar tree-sitter-nix "$TS_TREE_SITTER_NIX_SOURCE"
copy_grammar tree-sitter-python "$TS_TREE_SITTER_PYTHON_SOURCE"
copy_grammar tree-sitter-typescript "$TS_TREE_SITTER_TYPESCRIPT_SOURCE"

mkdir -p "$tmp/grammars/tree-sitter-cpp/node_modules" "$tmp/grammars/tree-sitter-typescript/node_modules"
ln -s "$tmp/grammars/tree-sitter-c" "$tmp/grammars/tree-sitter-cpp/node_modules/tree-sitter-c"
ln -s "$tmp/grammars/tree-sitter-javascript" "$tmp/grammars/tree-sitter-typescript/node_modules/tree-sitter-javascript"

cat >"$tmp/config.json" <<EOF
{"parser-directories":["$tmp/grammars"]}
EOF

XDG_CACHE_HOME="$tmp/cache" python3 "$script_dir/generate-code-corpus.py" "$repo_dir/scripts/code-snippets" "$out_dir/code-corpus.js" "$tmp/config.json"
