{ pkgs }:

pkgs.mkShell {
  packages = [
    pkgs.just
    pkgs.tree-sitter
  ];
}
