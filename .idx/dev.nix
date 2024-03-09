# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  channel = "stable-23.11"; # "stable-23.11" or "unstable"
  # Use https://search.nixos.org/packages to  find packages
  packages = [
    pkgs.nodejs
  ];
  # Sets environment variables in the workspace
  env = { };
  idx = {
    # search for the extension on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    previews = {
      enable = true;
      previews = [
        {
          command = ["npm" "run" "start" "--" "--port" "$PORT"];
          manager = "web";
          id = "web";
        }
        {
          manager = "ios";
          id = "ios";
        }
      ];
    };
    workspace = {
      # runs when a workspace is first created with this `dev.nix` file
      # to run something each time the environment is rebuilt, use the `onStart` hook
      onCreate = {
        npm-install = "npm install";
      };
    };
  };
}