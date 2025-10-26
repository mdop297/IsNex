# Makefile for managing the auth-svc project


# Docker Compose files
COMPOSE_FILE = infras/compose/docker-compose.yml
COMPOSE_DEV_FILE = infras/compose/docker-compose.override.yml
COMPOSE_API_GATEWAY = infras/compose/docker-compose.api-gateway.yml
COMPOSE_KAFKA = infras/compose/docker-compose.kafka.yml
# COMPOSE_MONITORING = infras/monitoring/docker-compose.monitoring.yml

# Image names
AUTH_IMAGE = mdop297/isnex-auth
CLIENT_IMAGE = mdop297/isnex-client

# Network name
NETWORK_NAME = isnex-net

# Kong configuration path
KONG_CONFIG = ./apps/api-gateway/declarative/kong.yml

# Health check URL
HEALTH_URL = http://localhost:3000/health

.PHONY: help up up-dev up-monitoring up-network build-dev build-prod down logs exec-auth \
        skaffold-dev-cloud skaffold-prod skaffold-clean auth-run-dev auth-run-dev-watch \
        auth-migrate-dev isnex-db-reset isnext-db-studio auth-prisma-generate auth-localhost \
        clean push-prod check-health k8s-logs k8s-exec kong-config status


# ------------------ Docker Network Management ------------------------

# Create Docker network if it doesn't exist
up-network:
	@echo "🌐 Creating Docker network: $(NETWORK_NAME)"
	@docker network ls | grep -q $(NETWORK_NAME) || docker network create $(NETWORK_NAME)
	@echo "✅ Network $(NETWORK_NAME) is ready"

# ------------------ Docker Compose Commands ------------------------
# Start kafka service
up-kafka: up-network
	@echo "🚀 Starting Kafka service..."
	docker compose -f $(COMPOSE_KAFKA) up -d

up-db: up-network 
	@echo "🚀 Starting DB service..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d isnex-db

# Start auth service in development mode
up-auth : up-kafka
	@echo "🚀 Starting auth service in development mode..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d auth-svc isnex-db
	@echo "✅ Auth service started successfully!"

# Start notification service 
up-notification:
	@echo "🚀 Starting notification service ..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE)  up -d notification
	@echo "✅ Notification service started successfully!"

# Start client service
up-client:
	@echo "🚀 Starting client service ..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d client
	@echo "✅ Client service started successfully!"

up-documents: up-db
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE)  up -d documents-svc data-lake

documents-revision:
# how to use: make documents-revision m="message"
	docker exec documents-svc uv run revision "$(m)"

documents-upgrade:
	docker exec documents-svc uv run upgrade

# Start services in development mode with code sync
up-dev: up-network up-kafka up-db
	@echo "🔧 Starting all services in development mode (single stack)..."
# merge ENV files then override conflicting fields in earlier ones
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) up -d
# docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) up --watch documents
	@echo "✅ All development services started in single stack!"

# Start services in production mode
up: up-network
	@echo "🚀 Starting services in production mode..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d
	@echo "✅ Services started successfully!"

# Build services for development
build-dev:
	@echo "🏗️  Building development images..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY)  build
	@echo "✅ Development build completed!"

# Build notification service
build-notification: 
	@echo "🏗️  Building notification service image..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) build notification
	@echo "✅ Notification service build completed!"


# Apply Kong config manually
kong-config:
	@echo "🔧 Applying Kong configuration..."
	@docker compose -f $(COMPOSE_API_GATEWAY) exec kong deck sync -s $(KONG_CONFIG) --kong-addr http://localhost:8001
	@echo "✅ Kong configuration applied successfully!"

# Build services for production
build-prod:
	@echo "🏭 Building production images..."
	docker compose -f $(COMPOSE_FILE) build
	@echo "✅ Production build completed!"

# Stop and remove services
down:
	@echo "🛑 Stopping all services..."
	docker compose -p compose down
	@echo "✅ All services stopped!"

# docker ps format view:
ps: 
	@echo "📊 Showing Docker containers..."
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"


# View logs for all services
logs:
	@echo "📋 Showing logs for all services..."
	docker compose -f $(COMPOSE_FILE) logs -f --tail=100

# Access the auth service container
exec-auth:
	@echo "🔍 Accessing auth service container..."
	docker compose -f $(COMPOSE_FILE) exec auth bash

