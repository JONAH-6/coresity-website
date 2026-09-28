#!/usr/bin/env bash
# Build the Coresity web image and push it to the registry, then print the
# tag@digest reference to deploy.
#
# Usage: scripts/docker/build-push.sh <version> [--no-cache] [--allow-dirty] [--force]
#
#   version        X.Y.Z or X.Y.Z-prerelease (e.g. 1.2.0, 1.2.0-rc.1)
#   --no-cache     rebuild every layer
#   --allow-dirty  build with uncommitted changes (revision label ends in -dirty)
#   --force        overwrite a version tag that already exists in the registry
#
# Pushes <repo>:<version>, plus <repo>:latest for non-prerelease versions.
# Deployments pin the printed digest, never a moving tag.
# Registry and image name come from scripts/docker/.env (see .env.example).
# Run `docker login <registry>` once before the first push.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

version=""
force=false
allow_dirty=false
extra=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-cache) extra+=(--no-cache) ;;
    --allow-dirty) allow_dirty=true ;;
    --force) force=true ;;
    -h | --help) usage; exit 0 ;;
    -*) die "Unknown option: $1 (see --help)" ;;
    *)
      [[ -z "$version" ]] || die "Only one version may be given"
      version="$1"
      ;;
  esac
  shift
done

[[ -n "$version" ]] || die "A version is required (see --help)"
validate_semver "$version"
load_config
require_docker
[[ "$allow_dirty" == true ]] || require_clean_tree

push_release "$version" "$force" ${extra[@]+"${extra[@]}"}

echo
echo "${C_BOLD}Deploy reference:${C_RESET}"
echo "  ${PINNED_REF}"
echo
echo "VPS:       set WEB_IMAGE=${PINNED_REF} in the server's .env, then"
echo "           docker compose pull && docker compose up -d"
echo "SecretVM:  scripts/docker/release-secretvm.sh pins it in ${SECRETVM_COMPOSE}"
