# syntax=docker/dockerfile:1
#
# Container image for the k3s hosting option. Render does not use this file.
#
# Build from the repo root, so the whole project is the build context:
#
#   docker build -f k3s/Dockerfile \
#     --platform linux/amd64 \
#     --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=... \
#     --build-arg NEXT_PUBLIC_BUILD_ID=$(git rev-parse --short HEAD) \
#     -t luwah-site:$(git rev-parse --short HEAD) .
#
# See k3s/README.md for the full list of build arguments.

ARG NODE_VERSION=26

# ── deps: install once, cached until the lockfile changes ────────────────
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --include=dev because the build needs tailwind, typescript and postcss.
RUN npm ci --include=dev --no-audit --no-fund

# ── build: next build with standalone output ─────────────────────────────
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# next.config.js only switches to standalone output when this is set, so the
# Render build (`next start`) is unaffected.
ENV NEXT_OUTPUT=standalone

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the JavaScript at build time, on the
# server as well as in the browser. Setting them only in the running
# container has no effect, so they are build arguments. An argument that is
# not passed stays unset, and the code falls back to its default.
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET=production
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_N8N_PARTIAL_WEBHOOK_URL
# Unset keeps the production Sentry DSN. Pass an empty value to turn it off,
# or another project's DSN for a staging copy.
ARG NEXT_PUBLIC_SENTRY_DSN
# Tags browser events, for example "k3s". Server events use the runtime
# SENTRY_ENVIRONMENT instead. Unset, browser events say "production".
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
# There is no .git in the image, so pass the id in. See /status and X-Build-Id.
ARG NEXT_PUBLIC_BUILD_ID
ARG NEXT_PUBLIC_BUILD_TIME

RUN npm run build

# ── runtime: only what `node server.js` needs ────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The standalone folder holds server.js and the traced node_modules. Static
# assets and public/ are not part of it and have to be copied in.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000

# For plain `docker run`. Kubernetes uses the probes in the Deployment.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", "server.js"]
