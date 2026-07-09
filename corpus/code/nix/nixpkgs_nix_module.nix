/*
  Manages /etc/nix/nix.conf.

  See also
   - ./nix-channel.nix
   - ./nix-flakes.nix
   - ./nix-remote-build.nix
   - nixos/modules/services/system/nix-daemon.nix
*/
{
  config,
  lib,
  pkgs,
  ...
}:

let
  inherit (lib)
    literalExpression
    mapAttrsToList
    mkAfter
    mkIf
    mkOption
    mkRenamedOptionModuleWith
    optionals
    systems
    types
    ;

  cfg = config.nix;

  nixPackage = cfg.package.out;

  defaultSystemFeatures = [
    "nixos-test"
    "benchmark"
    "big-parallel"
    "kvm"
  ]
  ++ optionals (pkgs.stdenv.hostPlatform ? gcc.arch) (
    # a builder can run code for `gcc.arch` and inferior architectures
    [ "gccarch-${pkgs.stdenv.hostPlatform.gcc.arch}" ]
    ++ map (x: "gccarch-${x}") (
      systems.architectures.inferiors.${pkgs.stdenv.hostPlatform.gcc.arch} or [ ]
    )
  );

  legacyConfMappings = {
    useSandbox = "sandbox";
    buildCores = "cores";
    maxJobs = "max-jobs";
    sandboxPaths = "extra-sandbox-paths";
    binaryCaches = "substituters";
    trustedBinaryCaches = "trusted-substituters";
    binaryCachePublicKeys = "trusted-public-keys";
    autoOptimiseStore = "auto-optimise-store";
    requireSignedBinaryCaches = "require-sigs";
    trustedUsers = "trusted-users";
    allowedUsers = "allowed-users";
    systemFeatures = "system-features";
  };

  semanticConfType =
    with types;
    let
      confAtom =
        nullOr (oneOf [
          bool
          int
          float
          str
          path
          package
        ])
        // {
          description = "Nix config atom (null, bool, int, float, str, path or package)";
        };
    in
    attrsOf (either confAtom (listOf confAtom));

  nixConf =
    (pkgs.formats.nixConf {
      inherit (cfg)
        package
        checkAllErrors
        checkConfig
        extraOptions
        ;
      inherit (nixPackage) version;
    }).generate
      "nix.conf"
      cfg.settings;

in
