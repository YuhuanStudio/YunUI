# Showcase / docs site image for YunUI.
#
# IMPORTANT: build with the *repo root* as context (not site/) — the site imports
# the parent library (`yunui` → repo root via symlink + dist/), so the whole
# monorepo must be present to build. The GitHub Actions workflow passes
# `context: .` + `file: site/Dockerfile`.
#
#   docker build -f site/Dockerfile -t yunui-site .

# ============================================
# Stage 1: Builder
# ============================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Pin pnpm major to match CI / packageManager (reproducible install).
RUN corepack enable && corepack prepare pnpm@11 --activate

# Dependency manifests first, for Docker layer caching. The workspace + npmrc
# must be visible before install or a frozen install can disagree with the
# lockfile. Includes site/package.json (the only workspace package).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY site/package.json ./site/package.json

# Full install (devDependencies included — needed for the build).
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo.
COPY . .

# Cache-buster so content edits force a rebuild even when deps are cached.
ARG CONTENT_HASH
RUN echo "Content hash: ${CONTENT_HASH}"

# 1) Build the library (gen-tokens + tsup → dist/). The site resolves `yunui`
#    via the node_modules/yunui -> .. symlink, so dist/ must exist first.
RUN pnpm build

# 2) Build the site (prebuild sync-icons + next build → .next/standalone).
RUN pnpm --filter yunui-site build

# ============================================
# Stage 2: Runtime (minimal)
# ============================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Non-root user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output is traced from the repo root (outputFileTracingRoot), so it
# mirrors the monorepo layout: server.js lands at site/server.js and the traced
# node_modules / library files sit alongside it. Copy the three pieces Next
# documents for standalone deploys.
#   1) the self-contained server + node_modules (preserves the site/ subpath)
COPY --from=builder --chown=nextjs:nodejs /app/site/.next/standalone ./
#   2) static assets (CSS/JS chunks) — not included in the trace
COPY --from=builder --chown=nextjs:nodejs /app/site/.next/static ./site/.next/static
#   3) public assets (favicon, synced icons, logo)
COPY --from=builder --chown=nextjs:nodejs /app/site/public ./site/public

USER nextjs

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://localhost:3000').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

EXPOSE 3000

# Run the traced server directly (bypasses pnpm script lifecycle). server.js is
# under site/ because tracing kept the monorepo-relative path.
CMD ["node", "site/server.js"]
