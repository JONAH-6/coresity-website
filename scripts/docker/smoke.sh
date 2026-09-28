#!/usr/bin/env bash
# Smoke-test a running Coresity web deployment over HTTP(S): health, pages,
# SPA fallback, assets and their caching, security headers.
#
# Usage: scripts/docker/smoke.sh [base-url] [-k|--insecure]
#
#   base-url       default http://localhost:8910 (prod.sh); also works against
#                  the VPS or SecretVM URL, e.g. https://coresity.com
#   -k, --insecure accept a self-signed certificate
#
# Runs every check, then exits non-zero if any failed.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

base=""
curl_opts=(-sS --max-time 15)
while [[ $# -gt 0 ]]; do
  case "$1" in
    -k | --insecure) curl_opts+=(-k) ;;
    -h | --help) usage; exit 0 ;;
    -*) die "Unknown option: $1 (see --help)" ;;
    *) base="$1" ;;
  esac
  shift
done
base="${base:-http://localhost:8910}"
base="${base%/}"

command -v curl >/dev/null 2>&1 || die "curl is required"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
failures=0

pass() { ok "$1"; }
fail() {
  printf '%s✖%s %s\n' "$C_RED" "$C_RESET" "$1"
  failures=$((failures + 1))
}

# fetch <path>: sets STATUS, and writes the headers and body to $work.
fetch() {
  STATUS="$(curl "${curl_opts[@]}" -o "${work}/body" -D "${work}/headers" -w '%{http_code}' "${base}$1" 2>"${work}/err")" || {
    STATUS="000"
    : >"${work}/headers"
    : >"${work}/body"
  }
}
header() { grep -i "^$1:" "${work}/headers" | head -1 | cut -d: -f2- | tr -d '\r' | sed 's/^ *//'; }

# check_page <path> <label>: a 200 HTML page with the Redwood mount point.
check_page() {
  fetch "$1"
  if [[ "$STATUS" == 200 && "$(header content-type)" == text/html* ]] && grep -q 'id="redwood-app"' "${work}/body"; then
    pass "$2"
  else
    fail "$2 (status ${STATUS}, content-type '$(header content-type)')"
  fi
}

info "Smoke-testing ${base}"

fetch /healthz
if [[ "$STATUS" == 200 ]]; then pass "/healthz returns 200"; else fail "/healthz returns 200 (got ${STATUS})"; fi

check_page / "/ serves the app"
index_html="$(cat "${work}/body")"

for name in content-security-policy x-content-type-options x-frame-options referrer-policy; do
  if [[ -n "$(header "$name")" ]]; then pass "/ sends ${name}"; else fail "/ sends ${name}"; fi
done
if [[ "$(header cache-control)" == *no-cache* ]]; then pass "/ is revalidated (Cache-Control: no-cache)"; else fail "/ is revalidated (Cache-Control: '$(header cache-control)')"; fi
if [[ "$base" == https://* ]]; then
  if [[ -n "$(header strict-transport-security)" ]]; then pass "/ sends strict-transport-security"; else fail "/ sends strict-transport-security"; fi
fi

check_page /about "/about is served by the SPA fallback"
check_page /this-route-does-not-exist "unknown routes reach the client-side NotFoundPage"

asset="$(printf '%s' "$index_html" | grep -o '/assets/[^"]*\.js' | head -1 || true)"
if [[ -z "$asset" ]]; then
  fail "index.html references a /assets/*.js bundle"
else
  fetch "$asset"
  if [[ "$STATUS" == 200 && "$(header content-type)" == *javascript* && "$(header cache-control)" == *immutable* ]]; then
    pass "${asset} is served as JavaScript with an immutable cache"
  else
    fail "${asset} (status ${STATUS}, content-type '$(header content-type)', cache-control '$(header cache-control)')"
  fi
fi

fetch /CORESITY-IMAGE/lockup@3x.png
if [[ "$STATUS" == 200 && "$(header content-type)" == image/png ]]; then pass "public images are served"; else fail "public images are served (/CORESITY-IMAGE/lockup@3x.png: ${STATUS})"; fi

echo
if [[ "$failures" -gt 0 ]]; then
  die "${failures} check(s) failed against ${base}"
fi
ok "All checks passed against ${base}"
