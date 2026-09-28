#!/usr/bin/env bash
# Run the production image locally (docker-compose.yml): the same nginx
# image and hardening as the deployments, on http://localhost:8910.
#
# Usage: scripts/docker/prod.sh <command>
#
#   up     build the image and start it; returns once the container is healthy
#   down   stop and remove the container
#   logs   follow the nginx logs
#   ps     show the container and its health
#
# WEB_PORT changes the host port (default 8910). To test a pushed image
# instead of a local build: WEB_IMAGE=<repo>:<version> scripts/docker/prod.sh up

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

compose() { docker compose -f "${ROOT_DIR}/docker-compose.yml" "$@"; }

cmd="${1:-}"
[[ $# -gt 0 ]] && shift

case "$cmd" in
  up)
    require_docker
    if [[ -n "${WEB_IMAGE:-}" ]]; then
      compose up -d --no-build --pull missing --wait
    else
      compose up -d --build --wait
    fi
    ok "Running on http://localhost:${WEB_PORT:-8910}"
    echo "Check it:  scripts/docker/smoke.sh http://localhost:${WEB_PORT:-8910}"
    ;;
  down) require_docker; compose down ;;
  logs) require_docker; compose logs -f web ;;
  ps) require_docker; compose ps ;;
  -h | --help | "") usage; [[ -n "$cmd" ]] ;;
  *) die "Unknown command: ${cmd} (see --help)" ;;
esac
