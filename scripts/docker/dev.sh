#!/usr/bin/env bash
# Run the Redwood dev server (hot reload) in a Node 20 container, with the
# repo bind-mounted. Serves http://localhost:8910.
#
# Usage: scripts/docker/dev.sh <command>
#
#   up [args]   build the dev image and start in the foreground (Ctrl-C stops);
#               extra args go to `docker compose up`, e.g. `up -d`
#   down        stop and remove the container
#   logs        follow the dev server logs
#   shell       open a shell in the dev container (yarn rw ... works there)
#   rebuild     after a dependency change: drop the node_modules volumes and
#               rebuild the dev image

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

compose() { docker compose -f "${ROOT_DIR}/docker-compose.dev.yml" "$@"; }

cmd="${1:-}"
[[ $# -gt 0 ]] && shift

case "$cmd" in
  up)
    require_docker
    info "Starting the dev server on http://localhost:8910"
    compose up --build "$@"
    ;;
  down) require_docker; compose down ;;
  logs) require_docker; compose logs -f web ;;
  shell)
    require_docker
    if [[ -n "$(compose ps -q web)" ]]; then
      compose exec web bash
    else
      compose run --rm web bash
    fi
    ;;
  rebuild)
    require_docker
    compose down --volumes
    compose build
    ok "Dev image rebuilt with fresh node_modules. Start it with: scripts/docker/dev.sh up"
    ;;
  -h | --help | "") usage; [[ -n "$cmd" ]] ;;
  *) die "Unknown command: ${cmd} (see --help)" ;;
esac
