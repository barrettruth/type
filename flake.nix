{
  description = "type.barrettruth.com";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      systems,
      rust-overlay,
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
              overlays = [ (import rust-overlay) ];
            }
          )
        );
    in
    {
      formatter = forEachSystem (pkgs: pkgs.nixfmt-tree);

      devShells = forEachSystem (
        pkgs:
        let
          rustToolchain = pkgs.rust-bin.stable.latest.default.override {
            targets = [ "wasm32-unknown-unknown" ];
          };
          commonPackages = [
            pkgs.binaryen
            pkgs.just
            pkgs.openssh
            pkgs.rsync
            pkgs.trunk
            pkgs.wasm-bindgen-cli_0_2_100
            rustToolchain
          ];
        in
        {
          default = pkgs.mkShell { packages = commonPackages; };
          ci = pkgs.mkShell { packages = commonPackages; };
        }
      );
    };
}
