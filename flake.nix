{
  description = "ts.barrettruth.com";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      nixpkgs,
      systems,
      ...
    }:
    let
      forEachSystem =
        f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f (
            import nixpkgs {
              inherit system;
            }
          )
        );
      commonPackages = pkgs: [
        pkgs.biome
        pkgs.just
        pkgs.openssh
        pkgs.python3
        pkgs.rsync
        pkgs.shellcheck
        pkgs.shfmt
        pkgs.tree-sitter
      ];
      treeSitterSources = pkgs: {
        TS_TREE_SITTER_BASH_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-bash.src}";
        TS_TREE_SITTER_C_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-c.src}";
        TS_TREE_SITTER_CPP_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-cpp.src}";
        TS_TREE_SITTER_CSS_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-css.src}";
        TS_TREE_SITTER_HTML_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-html.src}";
        TS_TREE_SITTER_JAVASCRIPT_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-javascript.src}";
        TS_TREE_SITTER_LUA_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-lua.src}";
        TS_TREE_SITTER_NIX_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-nix.src}";
        TS_TREE_SITTER_PYTHON_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-python.src}";
        TS_TREE_SITTER_TYPESCRIPT_SOURCE = "${pkgs.tree-sitter-grammars.tree-sitter-typescript.src}";
      };
      devShell =
        pkgs:
        pkgs.mkShell (
          {
            packages = commonPackages pkgs;
          }
          // treeSitterSources pkgs
        );
    in
    {
      formatter = forEachSystem (pkgs: pkgs.nixfmt-tree);

      devShells = forEachSystem (pkgs: {
        default = devShell pkgs;
        ci = devShell pkgs;
      });
    };
}
