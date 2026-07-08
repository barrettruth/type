{ lib, config, ... }:

{
  options.services.site.enable = lib.mkEnableOption "site";
  config.services.nginx.enable = config.services.site.enable;
}
