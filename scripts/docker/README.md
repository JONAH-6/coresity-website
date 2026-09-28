# Docker

Coresity's web side is built into a single static image: nginx serves the
Redwood build on port 8080 as a non-root user. The same image runs everywhere.
- It needs no environment variables.
- Nothing about it depends on the environment it runs in.
- Deployments pin it by tag and digest.

The api side is not containerised yet: nothing on the web side calls it.

| File | Purpose |
|---|---|
| `Dockerfile` | `deps` (yarn install) → `build` (`yarn rw build web`) → `runtime` (nginx) |
| `docker/nginx/` | SPA routing, caching, security headers |
| `docker-compose.dev.yml` | Redwood dev server with hot reload, Node 20 |
| `docker-compose.yml` | the production image, run locally |
| `deploy/vps/` | web + Traefik + Let's Encrypt for a plain server |
| `deploy/secretvm/` | web + Traefik with SecretVM's certificate, image pinned |

## Setup

Requires Docker with Compose v2 and buildx (Docker Desktop has both), plus bash and curl.

```sh
cp scripts/docker/.env.example scripts/docker/.env   # optional; defaults shown inside
docker login                                          # once, before the first push
```

`scripts/docker/.env` sets the registry, namespace, image name, platform and
SecretVM domain. The defaults are `docker.io/privexlabs/coresity-web`,
`linux/amd64` and `coresity.com`. A variable set in your shell overrides the
file.

## Commands

Every script prints its usage with `--help`.

```sh
scripts/docker/dev.sh up              # dev server on http://localhost:8910, hot reload
scripts/docker/dev.sh rebuild         # after changing dependencies

scripts/docker/build.sh               # build the production image (coresity-web:local)
scripts/docker/prod.sh up             # run it on http://localhost:8910
scripts/docker/smoke.sh               # check it
yarn test:e2e                         # Playwright runs against the running container
scripts/docker/prod.sh down

scripts/docker/build-push.sh 1.0.0    # push <repo>:1.0.0 (+ :latest), print tag@digest
scripts/docker/release-secretvm.sh 1.0.0   # push, then pin it in deploy/secretvm
scripts/docker/secretvm.sh show       # compose file to upload + portal and DNS steps
```

## Releasing

Versions are `X.Y.Z` or `X.Y.Z-prerelease`.
- **Tags are immutable.** Pushing a version that already exists is refused unless you pass `--force`.
- **Prereleases don't move `:latest`.**
- **The working tree must be clean.** Every image records its commit in the `org.opencontainers.image.revision` label. `--allow-dirty` overrides this and marks the revision `-dirty`.
- **Builds are always `linux/amd64` without provenance/SBOM attestations.** After the push, the script confirms the registry holds a single image manifest, the only form SecretVM accepts.

### SecretVM

```sh
scripts/docker/release-secretvm.sh 1.0.0
git add deploy/secretvm/docker-compose.yml && git commit -m "Release web 1.0.0 to SecretVM"
scripts/docker/secretvm.sh show
```

In the SecretAI portal (https://secretai.scrtlabs.com), upload the printed file as the VM's compose file. No `.env` is needed.

For the first launch:
1. Set the Custom Domain (`coresity.com`) before launching.
2. Add an A record pointing the domain at the VM's IP.
3. Add the "CNAME Challenge" record shown in the VM logs. The certificate is issued once DNS has that record.

The certificate covers that one name. `www` would reach the VM but fail TLS
until a certificate covers it.

**Rollback:** revert the release commit and upload the file again.

Traefik reads the certificate from `/mnt/secure/cert/secret_vm_fullchain.pem`
and `secret_vm_private.pem`. That path comes from the privexbot SecretVM
deployment; the SecretVM docs do not document it. If the site serves
Traefik's default certificate after the first launch, check that path in the
VM.

### VPS

```sh
scripts/docker/build-push.sh 1.0.0    # prints <repo>:1.0.0@sha256:...
```

On the server, in a directory with `deploy/vps/docker-compose.yml` and a `.env`
copied from `deploy/vps/.env.example`:
1. Set `WEB_IMAGE` to the printed reference, and fill in `DOMAIN` and `ACME_EMAIL`.
2. Point DNS for `DOMAIN` at the server.
3. Open ports 80 and 443.
4. Run `docker compose pull && docker compose up -d`.

Traefik obtains and renews the Let's Encrypt certificate and redirects HTTP to
HTTPS.

**Rollback:** set `WEB_IMAGE` back to the previous reference and run the same command.

Check either deployment with `scripts/docker/smoke.sh https://<domain>`.

## Design notes

- **Routing** mirrors Redwood's own web server: real files are served as-is, and every other path gets `200.html`, so the client router handles it (including the NotFoundPage).
- **Caching:** only Vite's hashed `/assets/*` are cached for a year. Everything else, including logos and icons, is revalidated.
- **CSP:** scripts are `'self'` only. Styles allow `'unsafe-inline'` because NotFoundPage and FatalErrorPage render inline `<style>`. Google Fonts are allowed.
- **HSTS** is added by Traefik, where TLS ends.
- **Hardening:** containers run with a read-only root filesystem, `/tmp` as tmpfs, all capabilities dropped, and `no-new-privileges`.
- **Traefik** uses its file provider only, so the Docker socket (root on the host) is never mounted.
- **Changing the site means building a new image.** Coresity reads no runtime configuration, so this applies to every change, including the Google Form URLs in `web/src/lib/links.ts`.

## Caveats

- **Node 20 is past end-of-life (April 2026).** It is required by `engines` and Redwood 8.9, and used only in the build stages; the shipped image contains nginx only.
- **The install downloads one package from `verdaccio.tobbe.dev`.** This comes from a `resolutions` entry in the root `package.json`. Builds fail if that host is down and the Yarn cache is cold.
- **Redwood's boilerplate `web/public/README.md` is served** at `/README.md`.
- **nginx logs `can not modify /etc/nginx/conf.d/default.conf (read-only file system?)` at startup.** It is informational: that entrypoint script only edits nginx's stock config, which this image replaces.
