{
  lib,
  buildGoModule,
  fetchFromGitHub,
  runtimeShell,
  installShellFiles,
  bc,
  ncurses,
  versionCheckHook,
}:

buildGoModule (finalAttrs: {
  pname = "fzf";
  version = "0.73.1";

  __structuredAttrs = true;

  src = fetchFromGitHub {
    owner = "junegunn";
    repo = "fzf";
    tag = "v${finalAttrs.version}";
    hash = "sha256-xdhlbokeCzeBUP3YHA5u5tr3NTQz7n5TKPlJANp7yvM=";
  };

  vendorHash = "sha256-MLuoKPEAqrpCbUphYOCpHdo8MdW5kvueeDU/3loK33Q=";

  env.CGO_ENABLED = 0;

  outputs = [
    "out"
    "man"
  ];

  nativeBuildInputs = [ installShellFiles ];

  buildInputs = [ ncurses ];

  ldflags = [
    "-s"
    "-w"
    "-X main.version=${finalAttrs.version} -X main.revision=${finalAttrs.src.rev}"
  ];

  postPatch = ''
    sed -i -e "s|expand('<sfile>:h:h')|'$out'|" plugin/fzf.vim

    if ! grep -q $out plugin/fzf.vim; then
        echo "Failed to replace vim base_dir path with $out"
        exit 1
    fi

    substituteInPlace bin/fzf-tmux \
      --replace-fail "bc" "${lib.getExe bc}"
  '';

  postInstall = ''
    install bin/fzf-tmux $out/bin

    installManPage man/man1/fzf.1 man/man1/fzf-tmux.1

    install -D plugin/* -t $out/share/vim-plugins/fzf/plugin
    mkdir -p $out/share/nvim
    ln -s $out/share/vim-plugins/fzf $out/share/nvim/site
  '';
})
