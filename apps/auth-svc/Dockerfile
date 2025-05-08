# Builder Stage
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apt-get update && apt-get install -y protobuf-compiler

WORKDIR /isnex

RUN apt-get update && apt-get install -y openssl
# Copy necessary files for building the app
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint*.config.mjs ./
COPY .npmrc ./
COPY pnpm*.yaml ./
COPY package*.json ./

COPY apps/auth-svc ./apps/auth-svc
  
# Install dependencies
RUN pnpm install --frozen-lockfile

RUN pnpx nx sync

# WORKDIR /isnex/apps/auth-svc
# RUN pnpx prisma generate

# # Build the app
RUN pnpx nx build auth-svc

# # Runner Stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

WORKDIR /isnex

# Copy necessary files
COPY --from=builder /isnex/package.json ./
COPY --from=builder /isnex/apps/auth-svc/package.json ./apps/auth-svc/package.json
COPY --from=builder /isnex/apps/auth-svc/prisma ./apps/auth-svc/prisma
COPY --from=builder /isnex/pnpm-*.yaml ./
# COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
# COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
# COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json

# Set production environment
ENV NODE_ENV=production

# # Install production dependencies
RUN pnpm install --frozen-lockfile

# Copy build output and other files
COPY --from=builder /isnex/apps/auth-svc/node_modules/@prisma-client/user/ ./apps/auth-svc/node_modules/@prisma-client/user/
COPY --from=builder /isnex/apps/auth-svc/dist ./dist

# Run the application
CMD ["node", "dist/main"]