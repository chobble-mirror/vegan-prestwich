(import
  (
    let
      lock = builtins.fromJSON (builtins.readFile ./flake.lock);
      flake-compat = fetchTarball {
        url = "https://github.com/edolstra/flake-compat/archive/${lock.nodes.flake-compat.locked.rev}.tar.gz";
        sha256 = lock.nodes.flake-compat.locked.narHash;
      };
    in
    flake-compat
  )
  {
    src = ./.;
  }
).defaultNix.packages.${builtins.currentSystem}.site
