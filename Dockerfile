# syntax=docker/dockerfile:1

# Coresity web image: the Redwood web side built to static files and served
# by nginx. The install and build stages follow Redwood's own Docker template
# (node_modules/@redwoodjs/cli/dist/commands/setup/docker/templates/Dockerfile).
# The api side is not shipped: nothing on the web side calls it yet.
#
# Build and push through scripts/docker/ (see scripts/docker/README.md).

# deps
# ----
# Node 20 matches "engines" in package.json. docker-compose.dev.yml also
# targets this stage.
FROM node:20.20.2-bookworm-slim AS deps

# Prisma's postinstall scripts run during the workspace install and expect
# openssl, as in Redwood's template.
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  REDWOOD_DISABLE_TELEMETRY=1

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml package.json yarn.lock ./
COPY --chown=node:node api/package.json api/
COPY --chown=node:node web/package.json web/

# web/node_modules is created here (Yarn hoists everything to the root) so the
# dev compose's named volume over it starts out owned by node, not root; Vite
# writes its dependency cache there.
RUN mkdir -p /home/node/.yarn/berry /home/node/.cache web/node_modules

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
  --mount=type=cache,target=/home/node/.cache,uid=1000 \
  CI=1 yarn install --immutable

COPY --chown=node:node redwood.toml graphql.config.js .env.defaults ./

# build
# -----
FROM deps AS build

COPY --chown=node:node web web

# No route is prerendered, so the web side builds without the api side.
RUN yarn rw build web --no-prerender

# runtime
# -------
# Runs as the unprivileged nginx user on port 8080 and writes only to /tmp,
# so the container works with a read-only root filesystem.
FROM nginxinc/nginx-unprivileged:1.30.5-alpine AS runtime

# Replace the labels inherited from the nginx base image, which describe nginx.
# scripts/docker sets the real version, revision and created with --label,
# which overrides these defaults.
LABEL org.opencontainers.image.title="coresity-web" \
  org.opencontainers.image.description="Coresity website (Redwood web side, static, served by nginx)" \
  org.opencontainers.image.version="dev" \
  org.opencontainers.image.revision="" \
  org.opencontainers.image.created="" \
  org.opencontainers.image.source="" \
  org.opencontainers.image.url="" \
  org.opencontainers.image.licenses="" \
  maintainer=""

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /home/node/app/web/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
