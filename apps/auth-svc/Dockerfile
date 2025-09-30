FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apk add --no-cache protobuf openssl

WORKDIR /isnex/apps/auth-svc/
COPY ./apps/auth-svc/package*.json ./

WORKDIR /isnex
COPY ./pnpm-workspace.yaml ./pnpm-lock.yaml ./package.json ./
RUN pnpm install --frozen-lockfile --filter auth-svc...

WORKDIR /isnex/apps/auth-svc
COPY ./apps/auth-svc .
RUN pnpx prisma generate
RUN pnpm run build


FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apk add --no-cache protobuf openssl
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /isnex/apps/auth-svc/
COPY package*.json ./
COPY --from=builder --chown=nodejs:nodejs /isnex/apps/auth-svc/pnpm-lock.yaml /isnex/apps/auth-svc/
RUN pnpm install --frozen-lockfile --prod && \
    pnpm store prune && \
    rm -rf ~/.pnpm-store

COPY --from=builder --chown=nodejs:nodejs /isnex/apps/auth-svc/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /isnex/apps/auth-svc/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /isnex/apps/auth-svc/prisma ./prisma
COPY --chown=nodejs:nodejs ./entrypoint.prod.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
USER nodejs

EXPOSE 3001

# ENTRYPOINT ["dumb-init", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]



