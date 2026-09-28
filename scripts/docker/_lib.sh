# shellcheck shell=bash
# shellcheck disable=SC2034 # variables here are used by the sourcing scripts
# Shared helpers for scripts/docker/*.sh. Sourced, not executed.
# Written for bash 3.2 (the macOS default) as well as newer versions.

# Paths come from this file's location, never from the caller's $PWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "$ROOT_DIR" || exit 1

SECRETVM_COMPOSE="deploy/secretvm/docker-compose.yml"

# Logging
# -------
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
  C_RED=$'\033[0;31m' C_GREEN=$'\033[0;32m' C_YELLOW=$'\033[1;33m'
  C_BLUE=$'\033[0;34m' C_BOLD=$'\033[1m' C_RESET=$'\033[0m'
else
  C_RED='' C_GREEN='' C_YELLOW='' C_BLUE='' C_BOLD='' C_RESET=''
fi

info() { printf '%s==>%s %s\n' "$C_BLUE" "$C_RESET" "$*"; }
ok() { printf '%s✔%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%s!%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
die() {
  printf '%s✖ %s%s\n' "$C_RED" "$*" "$C_RESET" >&2
  exit 1
}

# Prints the comment block at the top of the calling script (after the
# shebang), without the leading "# ".
usage() {
  sed -n '2,/^[^#]/p' "$0" | sed -e '/^[^#]/d' -e 's/^# \{0,1\}//'
}

# Configuration
# -------------
# Precedence: shell environment > scripts/docker/.env > defaults below.
# The .env file is parsed, never sourced, and only these keys are accepted.
CONFIG_KEYS="REGISTRY IMAGE_NAMESPACE IMAGE_NAME PLATFORM SECRETVM_DOMAIN"

load_config() {
  local file="${SCRIPT_DIR}/.env" line key value
  if [[ -f "$file" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      line="${line%$'\r'}"
      [[ "$line" =~ ^[[:space:]]*(#.*)?$ ]] && continue
      [[ "$line" =~ ^([A-Z_]+)=(.*)$ ]] || die "Cannot parse line in ${file}: ${line}"
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      case " ${CONFIG_KEYS} " in
        *" ${key} "*) ;;
        *) die "Unknown key '${key}' in ${file} (allowed: ${CONFIG_KEYS})" ;;
      esac
      # Strip one pair of surrounding quotes.
      if [[ "$value" =~ ^\"(.*)\"$ || "$value" =~ ^\'(.*)\'$ ]]; then
        value="${BASH_REMATCH[1]}"
      fi
      # A variable already set in the shell wins over the file.
      if [[ -z "${!key+set}" ]]; then
        printf -v "$key" '%s' "$value"
      fi
    done <"$file"
  fi

  REGISTRY="${REGISTRY:-docker.io}"
  IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-privexlabs}"
  IMAGE_NAME="${IMAGE_NAME:-coresity-web}"
  PLATFORM="${PLATFORM:-linux/amd64}"
  SECRETVM_DOMAIN="${SECRETVM_DOMAIN:-coresity.com}"

  IMAGE_REPO="${REGISTRY}/${IMAGE_NAMESPACE}/${IMAGE_NAME}"
  LOCAL_TAG="${IMAGE_NAME}:local"
}

# Checks
# ------
require_docker() {
  command -v docker >/dev/null 2>&1 || die "docker is not installed"
  docker info >/dev/null 2>&1 || die "Docker is not running"
  docker buildx version >/dev/null 2>&1 || die "docker buildx is required"
}

validate_semver() {
  [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]] ||
    die "Invalid version '$1' (expected X.Y.Z or X.Y.Z-prerelease, e.g. 1.2.0 or 1.2.0-rc.1)"
}

is_prerelease() { [[ "$1" == *-* ]]; }

tree_is_dirty() { [[ -n "$(git status --porcelain 2>/dev/null)" ]]; }

# A pushed image records the commit it was built from, so the tree must match it.
require_clean_tree() {
  if tree_is_dirty; then
    git status --short >&2
    die "Uncommitted changes. Commit them first, or pass --allow-dirty (the image revision label is then marked -dirty)."
  fi
}

git_revision() {
  local sha
  sha="$(git rev-parse HEAD 2>/dev/null)" || {
    echo "unknown"
    return
  }
  if tree_is_dirty; then sha="${sha}-dirty"; fi
  echo "$sha"
}

# Build
# -----
# Usage: buildx_build <version> [docker buildx build options...]
# Always single-platform with no provenance/SBOM attestations: SecretVM
# rejects attestation manifests, and one image serves every environment.
buildx_build() {
  local version="$1"
  shift
  DOCKER_BUILDKIT=1 docker buildx build \
    --platform "$PLATFORM" \
    --provenance=false \
    --sbom=false \
    --target runtime \
    --label "org.opencontainers.image.version=${version}" \
    --label "org.opencontainers.image.revision=$(git_revision)" \
    --label "org.opencontainers.image.created=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    "$@" \
    "$ROOT_DIR"
}

# Registry
# --------
# Prints the digest the registry holds for <ref>, or nothing if the tag or
# repository does not exist. Any other error (network, auth) is fatal, so a
# registry problem is never mistaken for "tag is free".
registry_digest() {
  local ref="$1" out
  if out="$(docker buildx imagetools inspect "$ref" --format '{{json .Manifest.Digest}}' 2>&1)"; then
    out="${out//\"/}"
    [[ "$out" =~ ^sha256:[0-9a-f]{64}$ ]] || die "Unexpected digest for ${ref}: ${out}"
    echo "$out"
    return
  fi
  case "$out" in
    *"not found"* | *"repository does not exist"*) return 0 ;;
    *) die "Could not query ${ref}: ${out}" ;;
  esac
}

# SecretVM needs a plain image manifest, not an index with attestations.
assert_single_manifest() {
  local ref="$1" media_type
  media_type="$(docker buildx imagetools inspect "$ref" | awk '/^MediaType:/ { print $2; exit }')"
  case "$media_type" in
    application/vnd.oci.image.manifest.v1+json | application/vnd.docker.distribution.manifest.v2+json) ;;
    *) die "${ref} is '${media_type:-unknown}', not a single image manifest; SecretVM would reject it." ;;
  esac
}

# Usage: push_release <version> <force:true|false> [extra buildx options...]
# Builds and pushes <version> (plus :latest for non-prerelease versions),
# verifies the result in the registry, and sets PINNED_REF to
# <repo>:<version>@<digest>.
push_release() {
  local version="$1" force="$2"
  shift 2
  local ref="${IMAGE_REPO}:${version}" existing metadata digest remote

  info "Checking ${ref} in the registry"
  existing="$(registry_digest "$ref")"
  if [[ -n "$existing" ]]; then
    if [[ "$force" != true ]]; then
      die "${ref} already exists (${existing}). Release tags are immutable: bump the version, or pass --force to overwrite."
    fi
    warn "Overwriting existing ${ref} (${existing})"
  fi

  local tags="-t ${ref}"
  if is_prerelease "$version"; then
    info "Prerelease: :latest is not moved"
  else
    tags="${tags} -t ${IMAGE_REPO}:latest"
  fi

  metadata="$(mktemp)"
  # shellcheck disable=SC2064 # expand now: the variable is local
  trap "rm -f '${metadata}'" EXIT

  info "Building and pushing ${ref} (${PLATFORM}, revision $(git_revision))"
  # shellcheck disable=SC2086 # tags is a list of -t options
  buildx_build "$version" --push --metadata-file "$metadata" $tags "$@"

  digest="$(sed -n 's/.*"containerimage.digest": *"\(sha256:[0-9a-f]\{64\}\)".*/\1/p' "$metadata")"
  [[ -n "$digest" ]] || die "No digest in the build metadata; not deploy-safe."

  remote="$(registry_digest "$ref")"
  [[ "$remote" == "$digest" ]] || die "Registry has ${remote:-nothing} for ${ref}, expected ${digest}."
  assert_single_manifest "${IMAGE_REPO}@${digest}"

  PINNED_REF="${ref}@${digest}"
  ok "Pushed and verified ${PINNED_REF}"
}
