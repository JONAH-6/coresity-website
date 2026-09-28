#!/usr/bin/env bash
# SecretVM deployment helper.
#
# Usage: scripts/docker/secretvm.sh show
#
#   show   print deploy/secretvm/docker-compose.yml, ready to upload, followed
#          by the SecretAI portal steps and the DNS records for the Custom
#          Domain (SECRETVM_DOMAIN in scripts/docker/.env, default coresity.com)
#
# Release a new image with scripts/docker/release-secretvm.sh first.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

cmd="${1:-}"

case "$cmd" in
  show) ;;
  -h | --help | "") usage; [[ -n "$cmd" ]]; exit ;;
  *) die "Unknown command: ${cmd} (see --help)" ;;
esac

load_config
[[ -f "$SECRETVM_COMPOSE" ]] || die "${SECRETVM_COMPOSE} not found"

image="$(awk '/# pinned by scripts\/docker\/release-secretvm.sh/ { print $2; exit }' "$SECRETVM_COMPOSE")"
if [[ "$image" == *"@sha256:0000000000000000000000000000000000000000000000000000000000000000" ]]; then
  die "${SECRETVM_COMPOSE} still has the placeholder image. Run scripts/docker/release-secretvm.sh <version> first."
fi

echo "${C_BOLD}----- ${SECRETVM_COMPOSE} (upload as docker-compose.yaml) -----${C_RESET}"
cat "$SECRETVM_COMPOSE"
echo "${C_BOLD}----- end -----${C_RESET}"
echo
echo "Web image: ${image}"
echo
cat <<EOF
${C_BOLD}Deploy in the SecretAI portal${C_RESET} (https://secretai.scrtlabs.com)
  Update:  open the VM and upload the compose file above. No .env is needed.

  First launch only:
  1. Create a SecretVM, upload the compose file above, and set
     Custom Domain = ${SECRETVM_DOMAIN} BEFORE launching.
  2. Network tab: note the VM's IP address. At your DNS provider, add
       A     ${SECRETVM_DOMAIN}  ->  <VM IP>
     and let it propagate.
  3. Once the VM starts, search its Logs tab for "CNAME Challenge" and add
     the CNAME record it shows (name and value) at your DNS provider. The
     certificate is issued once the record is seen; startup then continues.

  The certificate covers ${SECRETVM_DOMAIN} only. www.${SECRETVM_DOMAIN}
  would reach the VM but fail TLS until a certificate covers it too.

${C_BOLD}Verify${C_RESET}
  scripts/docker/smoke.sh https://${SECRETVM_DOMAIN}
EOF
