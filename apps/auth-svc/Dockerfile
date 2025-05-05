# Builder Stage
FROM node:20-slim AS builder

WORKDIR /workspace

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
# COPY libs/graphql ./libs/graphql
# COPY libs/grpc ./libs/grpcenv:
  #   - name: POSTGRES_USER
  #     value: 'mdop297' # Replace with your desired username
  #   - name: POSTGRES_PASSWORD
  #     value: 'mdop297' # Replace with your desired password
  #   - name: POSTGRES_DB
  #     value: 'isnex_auth' # Replace with your desired database name
  # COPY libs/nestjs ./libs/nestjs
  # COPY libs/prisma ./libs/prisma
  
  # Install dependencies
ENV CI=true
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apt-get update && apt-get install -y protobuf-compiler

RUN pnpm install

# # Build the app
RUN pnpx nx build auth-svc
WORKDIR /workspace/apps/auth-svc
RUN pnpx prisma generate

# # Runner Stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

WORKDIR /app

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/auth-svc/package.json ./apps/auth-svc/package.json
COPY --from=builder /workspace/apps/auth-svc/prisma ./apps/auth-svc/prisma
COPY --from=builder /workspace/pnpm-*.yaml ./
# COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
# COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
# COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json

# Set production environment
ENV NODE_ENV=production

# # Install production dependencies
RUN pnpm install --frozen-lockfile

# Copy build output and other files
COPY --from=builder /workspace/apps/auth-svc/node_modules/@prisma-client/user/ ./apps/auth-svc/node_modules/@prisma-client/user/
COPY --from=builder /workspace/apps/auth-svc/dist ./dist

# Run the application
CMD ["node", "dist/main"]