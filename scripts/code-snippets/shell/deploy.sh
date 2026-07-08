set -eu

release="$DEPLOY_ROOT/releases/$BUILD_ID"
mkdir -p "$release"
rsync -a --delete "$BUILD_DIR"/ "$release"/
