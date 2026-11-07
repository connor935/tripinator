# syntax=docker/dockerfile:1

# ---- base -------------------------------------------------------------------
# Debian (glibc) slim. Node 24 to match .node-version. No native modules to
# compile: pg is pure JS, exceljs too.
FROM node:24-bookworm-slim AS base
WORKDIR /app

# ---- deps -------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----------------------------------------------------------------
# Build the standalone Next.js output. This stage keeps full deps + source +
# tsx, so it doubles as the image for the "admin" tools service (see compose).
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner -----------------------------------------------------------------
# Slim runtime: only the standalone server, static assets, and migrations.
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as the non-root user shipped in the node image. All data lives in the
# shared Postgres; the container itself is stateless.
RUN chown node:node /app
USER node

# Standalone server + its traced node_modules (includes pg and exceljs).
COPY --from=builder --chown=node:node /app/.next/standalone ./
# Static assets and public/ are NOT included in standalone output — copy them.
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Migrations are auto-applied on startup from process.cwd()/drizzle.
COPY --from=builder --chown=node:node /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "server.js"]
