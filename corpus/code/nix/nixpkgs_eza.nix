{
  lib,
  gitSupport ? true,
  fetchFromGitHub,
  rustPlatform,
  cmake,
  pandoc,
  pkg-config,
  zlib,
  installShellFiles,
  versionCheckHook,
  exaAlias ? true,
}:

rustPlatform.buildRustPackage (finalAttrs: {
  pname = "eza";
  version = "0.23.4";

  __structuredAttrs = true;

  src = fetchFromGitHub {
    owner = "eza-community";
    repo = "eza";
    tag = "v${finalAttrs.version}";
    hash = "sha256-zLb2VPfmv9J9UdPAXS+QPHI+hvDRl5UBcvW84J6nUK8=";
  };

  cargoHash = "sha256-3KLjlEZhGEyOcaiBnfIafR509oRbsWllqf1e6Z0M8Sg=";

  nativeBuildInputs = [
    cmake
    pkg-config
    installShellFiles
    pandoc
  ];
  buildInputs = [ zlib ];

  buildNoDefaultFeatures = true;
  buildFeatures = lib.optional gitSupport "git";

  outputs = [
    "out"
    "man"
  ];

  postInstall = ''
    for page in eza.1 eza_colors.5 eza_colors-explanation.5; do
      sed "s/\$version/v${finalAttrs.version}/g" "man/$page.md" |
        pandoc --standalone -f markdown -t man >"man/$page"
    done
    installManPage man/eza.1 man/eza_colors.5 man/eza_colors-explanation.5
    installShellCompletion \
      --bash completions/bash/eza \
      --fish completions/fish/eza.fish \
      --zsh completions/zsh/_eza
  ''
  + lib.optionalString exaAlias ''
    ln -s eza $out/bin/exa
  '';

  nativeInstallCheckInputs = [ versionCheckHook ];
  doInstallCheck = true;
})
