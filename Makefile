# Makefile for managing the auth-svc project

# ------------------ Variables ------------------------
# Environment file for Docker Compose
ENV_FILE = ./envs/.env.dev
AUTH_ENV_FILE = ./apps/auth-svc/.env.dev

# Docker Compose files
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.override.yml
COMPOSE_API_GATEWAY = docker-compose.api-gateway.yml
COMPOSE_MONITORING = infras/monitoring/docker-compose.monitoring.yml

# Image names
AUTH_IMAGE = mdop297/isnex-auth
CLIENT_IMAGE = mdop297/isnex-client

# Network name
NETWORK_NAME = isnex-net

# Kong configuration path
KONG_CONFIG = ./infras/api-gateway/declarative/kong.yml

# Health check URL
HEALTH_URL = http://localhost:3000/health

.PHONY: help up up-dev up-monitoring up-network build-dev build-prod down logs exec-auth \
        skaffold-dev-cloud skaffold-prod skaffold-clean auth-run-dev auth-run-dev-watch \
        auth-migrate-dev auth-db-reset auth-db-studio auth-prisma-generate auth-localhost \
        clean push-prod check-health k8s-logs k8s-exec kong-config status

# Default target
help:
	@echo "🐳 Docker Compose Commands:"
	@echo "  up              - Start services in production mode"
	@echo "  up-dev          - Start services in development mode"
	@echo "  up-monitoring   - Start monitoring services"
	@echo "  up-network      - Create Docker network"
	@echo "  build-dev       - Build services for development"
	@echo "  build-prod      - Build services for production"
	@echo "  down            - Stop and remove services"
	@echo "  logs            - View logs for all services"
	@echo "  exec-auth       - Access the auth service container"
	@echo "  kong-config     - Apply Kong configuration manually"
	@echo ""
	@echo "☸️  Kubernetes Commands:"
	@echo "  skaffold-dev-cloud - Run Skaffold in development mode"
	@echo "  skaffold-prod      - Run Skaffold in production mode"
	@echo "  skaffold-clean     - Delete Skaffold resources"
	@echo "  k8s-logs           - View Kubernetes pod logs"
	@echo "  k8s-exec           - Access Kubernetes pod"
	@echo ""
	@echo "🔐 Auth Service Commands:"
	@echo "  auth-run-dev         - Run auth service in development"
	@echo "  auth-run-dev-watch   - Run with hot reload (nodemon)"
	@echo "  auth-migrate-dev     - Migrate database in development"
	@echo "  auth-db-reset        - Reset database (drops and recreates)"
	@echo "  auth-db-studio       - Open Prisma Studio"
	@echo "  auth-prisma-generate - Generate Prisma client"
	@echo "  auth-localhost       - Run auth-service on localhost"
	@echo ""
	@echo "🛠️  Utility Commands:"
	@echo "  clean          - Clean up Docker resources"
	@echo "  push-prod      - Build and push production image"
	@echo "  check-health   - Check container health"
	@echo "  status         - Show status of all services"

# ------------------ Docker Network Management ------------------------

# Create Docker network if it doesn't exist
up-network:
	@echo "🌐 Creating Docker network: $(NETWORK_NAME)"
	@docker network ls | grep -q $(NETWORK_NAME) || docker network create $(NETWORK_NAME)
	@echo "✅ Network $(NETWORK_NAME) is ready"

# ------------------ Docker Compose Commands ------------------------

# Start services in production mode
up: up-network
	@echo "🚀 Starting services in production mode..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d
	@echo "✅ Services started successfully!"

# Start services in development mode with code sync
up-dev: up-network
	@echo "🔧 Starting all services in development mode (single stack)..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) up -d
# docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) up --watch documents
	@echo "✅ All development services started in single stack!"

# Start monitoring services
up-monitoring: up-network
	@echo "📊 Starting monitoring services..."
	@if [ -f "$(COMPOSE_MONITORING)" ]; then \
		docker compose --env-file $(ENV_FILE) -f $(COMPOSE_MONITORING) up -d; \
		echo "✅ Monitoring services started successfully!"; \
	else \
		echo "⚠️  Monitoring compose file not found: $(COMPOSE_MONITORING)"; \
	fi

# Build services for development
build-dev:
	@echo "🏗️  Building development images..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) build
	@echo "✅ Development build completed!"

# Apply Kong config manually
kong-config:
	@echo "🔧 Applying Kong configuration..."
	@docker compose -f $(COMPOSE_API_GATEWAY) exec kong deck sync -s $(KONG_CONFIG) --kong-addr http://localhost:8001
	@echo "✅ Kong configuration applied successfully!"

# Build services for production
build-prod:
	@echo "🏭 Building production images..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) build
	@echo "✅ Production build completed!"

# Stop and remove services
down:
	@echo "🛑 Stopping all services..."
	docker compose -p isnex down
	@echo "✅ All services stopped!"

# View logs for all services
logs:
	@echo "📋 Showing logs for all services..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f --tail=100

# Access the auth service container
exec-auth:
	@echo "🔍 Accessing auth service container..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec auth bash

# ------------------ Kubernetes Commands ------------------------

# Run Skaffold in development mode (hot reload)
skaffold-dev-cloud:
	@echo "☸️  Starting Skaffold in development mode..."
	skaffold dev --profile=dev-cloud

# Run Skaffold in production mode
skaffold-prod:
	@echo "☸️  Deploying with Skaffold in production mode..."
	skaffold run --profile=prod

# Delete Skaffold resources
skaffold-clean:
	@echo "🧹 Cleaning up Skaffold resources..."
	skaffold delete

# ------------------ Auth Service Commands -----------------------

# Run auth service in development mode
auth-run-dev:
	@echo "🔐 Running auth service in development mode..."
	nx run auth-svc:start:dev --no-cache

# Run auth service with hot reload (nodemon)
auth-run-dev-watch:
	@echo "🔥 Running auth service with hot reload..."
	cd apps/auth-svc && pnpm run dev

# Migrate database in development
auth-migrate-dev:
	@echo "🗃️  Running database migration in development..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec auth npx prisma migrate dev

# Reset database (drops and recreates)
auth-db-reset:
	@echo "⚠️  Resetting database (this will drop all data)..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec auth npx prisma migrate reset; \
	else \
		echo ""; \
		echo "Database reset cancelled."; \
	fi


# Open Prisma Studio
auth-db-studio:
	@echo "🎨 Opening Prisma Studio..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec auth npx prisma studio


# Generate Prisma client
auth-prisma-generate:
	@echo "⚙️  Generating Prisma client..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec auth npx prisma generate


# Run auth-service in localhost with passed env file
auth-localhost:
	@echo "🏠 Running auth service on localhost..."
	pnpx env-cmd -f $(ENV_FILE) nx run auth-svc:serve

# ------------------ Utility Commands ------------------------

# Clean up unused Docker images and containers
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans 2>/dev/null || true
	docker system prune -f
	@echo "✅ Cleanup completed!"

# Build and push production image to registry
push-prod:
	@echo "📦 Building and pushing production image..."
	docker build -f apps/auth-svc/Dockerfile -t $(AUTH_IMAGE):latest .
	docker push $(AUTH_IMAGE):latest
	@echo "✅ Image pushed to registry!"

# Check container health
check-health:
	@echo "🏥 Checking container health..."
	@curl -f $(HEALTH_URL) && echo "✅ Health check passed!" || echo "❌ Health check failed!"

# View Kubernetes pod logs
k8s-logs:
	@echo "📋 Viewing Kubernetes pod logs..."
	kubectl logs -l app=auth-svc -f

# Access Kubernetes pod
k8s-exec:
	@echo "🔍 Accessing Kubernetes pod..."
	kubectl exec -it $$(kubectl get pod -l app=auth-svc -o jsonpath="{.items[0].metadata.name}") -- bash

# Show status of all services
status:
	@echo "📊 Service Status:"
	@echo "=================="
	@echo "🐳 Docker Services:"
	@docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) ps 2>/dev/null || echo "No main services running"
	@echo ""
	@echo "🌉 API Gateway:"
	@docker compose -f $(COMPOSE_API_GATEWAY) ps 2>/dev/null || echo "API Gateway not running"
	@echo ""
	@echo "🌐 Network:"
	@docker network ls | grep $(NETWORK_NAME) && echo "✅ Network $(NETWORK_NAME) exists" || echo "❌ Network $(NETWORK_NAME) not found"
	@echo ""
	@if command -v kubectl >/dev/null 2>&1; then \
		echo "☸️  Kubernetes Pods:"; \
		kubectl get pods -l app=auth-svc 2>/dev/null || echo "No Kubernetes pods found or kubectl not available"; \
	fi