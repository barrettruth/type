import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path

languages = {
    "bash": "bash",
    "c": "c",
    "cpp": "cpp",
    "css": "css",
    "html": "html",
    "javascript": "javascript",
    "lua": "lua",
    "nix": "nix",
    "python": "python",
    "shell": "bash",
    "typescript": "typescript",
}

lua_script = r'''
local manifest_path = os.getenv('TS_NVIM_AUDIT_MANIFEST')
local output_path = os.getenv('TS_NVIM_AUDIT_OUTPUT')
local manifest = vim.json.decode(table.concat(vim.fn.readfile(manifest_path), '\n'))
local lang_map = {
  bash = 'bash',
  c = 'c',
  cpp = 'cpp',
  css = 'css',
  html = 'html',
  javascript = 'javascript',
  lua = 'lua',
  nix = 'nix',
  python = 'python',
  shell = 'bash',
  typescript = 'typescript',
}
local function hex(value)
  if value == nil then
    return nil
  end
  return string.format('#%06x', value)
end
local normal = vim.api.nvim_get_hl(0, { name = 'Normal', link = false })
local normal_fg = normal.fg
local function visible(hl)
  return (hl.fg ~= nil and hl.fg ~= normal_fg)
    or hl.bg ~= nil
    or hl.bold == true
    or hl.italic == true
    or hl.underline == true
    or hl.undercurl == true
    or hl.reverse == true
end
local function inspect_group(group)
  local ok, hl = pcall(vim.api.nvim_get_hl, 0, { name = group, link = false })
  if not ok then
    return nil
  end
  return hl
end
local function top_treesitter(pos)
  local captures = pos.treesitter or {}
  if #captures == 0 then
    return nil
  end
  return captures[#captures]
end
local results = {}
for _, item in ipairs(manifest) do
  vim.cmd('silent edit ' .. vim.fn.fnameescape(item.path))
  local buf = vim.api.nvim_get_current_buf()
  vim.bo[buf].swapfile = false
  local lang = lang_map[item.language] or item.language
  pcall(vim.treesitter.start, buf, lang)
  vim.cmd('redraw')
  vim.wait(100)
  local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, true)
  local entries = {}
  local offset = 0
  for row, line in ipairs(lines) do
    for col = 0, #line - 1 do
      local capture = top_treesitter(vim.inspect_pos(buf, row - 1, col))
      if capture ~= nil then
        local hl = inspect_group(capture.hl_group) or {}
        entries[#entries + 1] = {
          index = offset + col,
          capture = capture.capture,
          group = capture.hl_group,
          link = capture.hl_group_link,
          fg = hex(hl.fg),
          bg = hex(hl.bg),
          visible = visible(hl),
        }
      end
    end
    offset = offset + #line + 1
  end
  results[#results + 1] = {
    name = item.name,
    language = item.language,
    highlights = entries,
  }
  vim.cmd('silent bwipeout!')
end
vim.fn.writefile({ vim.json.encode(results) }, output_path)
vim.cmd('qa!')
'''


def fail(message):
    print(message, file=sys.stderr)
    raise SystemExit(1)


def load_code_corpus(path):
    text = path.read_text()
    prefix = "export const codeSnippets = "
    if not text.startswith(prefix) or not text.rstrip().endswith(";"):
        fail(f"{path}: unsupported code corpus format")
    return json.loads(text[len(prefix) : text.rfind(";")])


def classes_for(snippet):
    classes = [None] * len(snippet["code"])
    for span in snippet["spans"]:
        for index in range(span["start"], span["end"]):
            classes[index] = span["className"]
    return classes


def web_visibility(css_path):
    values = {}
    for name, value in re.findall(r"--(syntax-[a-z-]+):\s*([^;]+);", css_path.read_text()):
        values.setdefault(name, set()).add(value.strip())
    return {name: any("var(--text)" not in value for value in vals) for name, vals in values.items()}


def group_key(entry):
    link = entry.get("link") or entry.get("group") or "Normal"
    capture = entry.get("capture") or "none"
    return f"{capture} -> {link}"


def example_for(snippet, index):
    code = snippet["code"]
    start = max(code.rfind("\n", 0, index) + 1, 0)
    end = code.find("\n", index)
    if end == -1:
        end = len(code)
    line = code[start:end]
    return line[:100]


def run_nvim(nvim, manifest, timeout):
    with tempfile.TemporaryDirectory(prefix="ts-nvim-highlight-audit-") as tmp:
        tmp_path = Path(tmp)
        manifest_path = tmp_path / "manifest.json"
        output_path = tmp_path / "highlights.json"
        lua_path = tmp_path / "audit.lua"
        manifest_path.write_text(json.dumps(manifest))
        lua_path.write_text(lua_script)
        env = os.environ.copy()
        env["TS_NVIM_AUDIT_MANIFEST"] = str(manifest_path)
        env["TS_NVIM_AUDIT_OUTPUT"] = str(output_path)
        result = subprocess.run(
            [nvim, "--headless", "--cmd", "set noswapfile", "+luafile " + str(lua_path)],
            check=False,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
        )
        if result.returncode != 0:
            fail(result.stdout + result.stderr)
        if not output_path.exists():
            fail("Neovim audit did not produce output")
        return json.loads(output_path.read_text())


def print_counter(title, counter, total, limit):
    print(f"\n{title}")
    if not counter:
        print("  none")
        return
    for key, count in counter.most_common(limit):
        pct = count / total * 100 if total else 0
        print(f"  {count:5d}  {pct:5.1f}%  {key}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--nvim", default=shutil.which("nvim") or "nvim")
    parser.add_argument("--limit", type=int, default=18)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--json-output", type=Path)
    args = parser.parse_args()

    repo = args.repo.resolve()
    snippets_dir = repo / "scripts" / "code-snippets"
    corpus_path = repo / "public" / "code-corpus.js"
    css_path = repo / "public" / "main.css"
    corpus = load_code_corpus(corpus_path)
    by_name = {snippet["name"]: snippet for snippet in corpus}
    manifest = []
    for snippet in corpus:
        language = snippet["language"]
        path = snippets_dir / snippet["name"]
        if language not in languages:
            fail(f"{snippet['name']}: unsupported language {language}")
        if not path.exists():
            fail(f"{snippet['name']}: source file missing")
        manifest.append({"name": snippet["name"], "language": language, "path": str(path)})

    nvim_results = run_nvim(args.nvim, manifest, args.timeout)
    visibility = web_visibility(css_path)
    visible_nvim = Counter()
    visible_missed_by_web = Counter()
    captured_but_web_normal = Counter()
    web_visible = Counter()
    web_classes = Counter()
    pairings = Counter()
    examples = {}
    total_chars = 0
    total_nvim_visible = 0

    for result in nvim_results:
        snippet = by_name[result["name"]]
        web = classes_for(snippet)
        by_index = {entry["index"]: entry for entry in result["highlights"]}
        total_chars += len(snippet["code"])
        for index, web_class in enumerate(web):
            if web_class is not None:
                web_classes[web_class] += 1
                if visibility.get(web_class, False):
                    web_visible[web_class] += 1
            entry = by_index.get(index)
            if entry is None:
                continue
            key = group_key(entry)
            web_key = web_class or "normal"
            pairings[(key, web_key)] += 1
            if web_class is not None and not visibility.get(web_class, False):
                captured_but_web_normal[f"{web_class} <= {key}"] += 1
            if entry.get("visible"):
                total_nvim_visible += 1
                visible_nvim[key] += 1
                if not (web_class is not None and visibility.get(web_class, False)):
                    visible_missed_by_web[f"{key} as {web_key}"] += 1
                    examples.setdefault(f"{key} as {web_key}", (result["name"], example_for(snippet, index)))

    payload = {
        "total_chars": total_chars,
        "total_nvim_visible": total_nvim_visible,
        "visible_nvim": visible_nvim,
        "visible_missed_by_web": visible_missed_by_web,
        "captured_but_web_normal": captured_but_web_normal,
        "web_visible": web_visible,
        "web_classes": web_classes,
    }
    if args.json_output is not None:
        args.json_output.write_text(json.dumps(payload, indent=2, default=dict))

    print(f"Audited {len(corpus)} snippets / {total_chars} characters with {args.nvim}")
    print(f"Neovim visibly highlighted {total_nvim_visible} characters")
    print_counter("Web classes with visible colors", web_visible, total_chars, args.limit)
    print_counter("Neovim visible captures", visible_nvim, total_nvim_visible, args.limit)
    print_counter("Neovim-visible characters missing a visible web class", visible_missed_by_web, total_nvim_visible, args.limit)
    if visible_missed_by_web:
        print("\nExamples for visible misses")
        for key, (name, line) in list(examples.items())[: args.limit]:
            print(f"  {key}\n    {name}: {line}")
    print_counter("Captured web classes currently styled as normal text", captured_but_web_normal, total_chars, args.limit)


if __name__ == "__main__":
    main()
