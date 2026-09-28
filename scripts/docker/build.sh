#!/usr/bin/env bash
# Build the Coresity web image locally, exactly as it is shipped
# (same platform and flags as build-push.sh), without pushing.
#
# Usage: scripts/docker/build.sh [version] [--no-cache]
#
#   version     optional X.Y.Z[-prerelease]; also tags <repo>:<version>
#   --no-cache  rebuild every layer
#
# Always tags <image-name>:local, which docker-compose.yml and prod.sh run.
# Registry and image name come from scripts/docker/.env (see .env.example).

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

version=""
extra=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-cache) extra+=(--no-cache) ;;
    -h | --help) usage; exit 0 ;;
    -*) die "Unknown option: $1 (see --help)" ;;
    *)
      [[ -z "$version" ]] || die "Only one version may be given"
      version="$1"
      ;;
  esac
  shift
done

load_config
require_docker

tags=(-t "$LOCAL_TAG")
if [[ -n "$version" ]]; then
  validate_semver "$version"
  tags+=(-t "${IMAGE_REPO}:${version}")
fi

info "Building ${LOCAL_TAG}${version:+ and ${IMAGE_REPO}:${version}} (${PLATFORM})"
buildx_build "${version:-dev}" --load "${tags[@]}" ${extra[@]+"${extra[@]}"}

ok "Built $(docker image inspect "$LOCAL_TAG" --format '{{.Id}}' | cut -c1-19) ($(docker image ls "$LOCAL_TAG" --format '{{.Size}}'))"
echo "Run it:   scripts/docker/prod.sh up"
