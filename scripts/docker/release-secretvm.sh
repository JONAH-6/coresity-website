#!/usr/bin/env bash
# Release to SecretVM: build and push the web image (as build-push.sh does),
# then pin its tag@digest in deploy/secretvm/docker-compose.yml.
#
# Usage: scripts/docker/release-secretvm.sh <version> [--no-cache] [--allow-dirty] [--force]
#
#   Options are the same as build-push.sh.
#
# Afterwards: commit the compose change, then upload the file in the SecretAI
# portal (`scripts/docker/secretvm.sh show` prints it with the steps).
# Rolling back means reverting that commit and uploading again.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

MARKER="# pinned by scripts/docker/release-secretvm.sh"

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

# Check the compose file before pushing anything.
[[ -f "$SECRETVM_COMPOSE" ]] || die "${SECRETVM_COMPOSE} not found"
marked="$(grep -cF "$MARKER" "$SECRETVM_COMPOSE" || true)"
[[ "$marked" == 1 ]] || die "Expected exactly one line marked '${MARKER}' in ${SECRETVM_COMPOSE}, found ${marked}."

push_release "$version" "$force" ${extra[@]+"${extra[@]}"}

info "Pinning ${SECRETVM_COMPOSE}"
tmp="$(mktemp)"
awk -v ref="$PINNED_REF" -v marker="$MARKER" '
  index($0, marker) {
    match($0, /^[ \t]*/)
    $0 = substr($0, 1, RLENGTH) "image: " ref " " marker
  }
  { print }
' "$SECRETVM_COMPOSE" >"$tmp"
cat "$tmp" >"$SECRETVM_COMPOSE"
rm -f "$tmp"

grep -qF "image: ${PINNED_REF} ${MARKER}" "$SECRETVM_COMPOSE" ||
  die "The new reference did not land in ${SECRETVM_COMPOSE}; do not deploy it."
docker compose -f "$SECRETVM_COMPOSE" config -q ||
  die "${SECRETVM_COMPOSE} no longer validates; do not deploy it."
ok "${SECRETVM_COMPOSE} now runs ${PINNED_REF}"

echo
git --no-pager diff --stat -- "$SECRETVM_COMPOSE" || true
echo
echo "${C_BOLD}Next:${C_RESET}"
echo "  1. git add ${SECRETVM_COMPOSE} && git commit -m \"Release web ${version} to SecretVM\""
echo "  2. scripts/docker/secretvm.sh show   (the file to upload, the portal steps and DNS records)"
echo "  3. scripts/docker/smoke.sh https://${SECRETVM_DOMAIN}"
