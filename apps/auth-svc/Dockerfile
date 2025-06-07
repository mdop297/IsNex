FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN apk add --no-cache protobuf openssl
WORKDIR /isnex/apps/auth-svc
COPY . .
RUN chmod +x entrypoint.sh
RUN pnpm install
RUN pnpm run build

ENTRYPOINT ["./entrypoint.sh"]
