# Makefile for managing the auth-svc project

# ------------------ Variables ------------------------
# Environment file for Docker Compose
ENV_FILE = ./envs/auth.env

# Docker Compose files
COMPOSE_FILE = infras/compose/docker-compose.yml
COMPOSE_DEV_FILE = infras/compose/docker-compose.override.yml
COMPOSE_API_GATEWAY = infras/compose/docker-compose.api-gateway.yml
COMPOSE_KAFKA = infras/compose/docker-compose.kafka.yml

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
        auth-migrate-dev auth-db-reset auth-db-studio auth-prisma-generate auth-localhost \
        clean push-prod check-health k8s-logs k8s-exec kong-config status

# Default target
help:
	@echo "🐳 Docker Compose Commands:"
	@echo "  up              - Start services in production mode"
	@echo "  up-dev          - Start services in development mode"
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
# ------------------ Docker Compose Commands ------------------------

# Start kafka services
up-kafka: up-network
	@echo "🚀 Starting Kafka services..."
	docker compose -f $(COMPOSE_KAFKA) up -d

# Start services in production mode
up: up-network up-kafka
	@echo "🚀 Starting services in production mode..."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d
	@echo "✅ Services started successfully!"

# Start services in development mode with code sync
up-dev: up-network up-kafka
	@echo "🔧 Starting all services in development mode (single stack)..."
	docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) -f $(COMPOSE_API_GATEWAY) --env-file $(ENV_FILE) --env-file $(AUTH_ENV_FILE) up -d
	@echo "✅ All development services started in single stack!"

# Build services for development
build-dev:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) build

# Build services for production
build-prod:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) build

# Stop and remove services
down:
	docker compose down

# View logs for all services
logs:
	docker compose logs -f --tail=100

# Access the auth service container
exec-auth:
	docker compose exec auth bash

# ------------------ Kubernetes Commands ------------------------

# Run Skaffold in development mode (hot reload)
skaffold-dev-cloud:
	skaffold dev --profile=dev-cloud

# Run Skaffold in production mode
skaffold-prod:
	skaffold run --profile=prod

# Delete Skaffold resources
skaffold-clean:
	skaffold delete


# ------------------ Auth Service Commands -----------------------

# Run auth service in development mode
auth-run-dev:
	nx run auth-svc:start:dev --no-cache

# Run auth service with hot reload (nodemon)
auth-run-dev-watch:
	cd apps/auth-svc && pnpm run dev

# Migrate database in development
auth-migrate-dev:
	docker compose exec auth npx prisma migrate dev

# Reset database (drops and recreates)
auth-db-reset:
	docker compose exec auth npx prisma migrate reset

# Open Prisma Studio
auth-db-studio:
	docker compose exec auth npx prisma studio

# Generate Prisma client
auth-prisma-generate:
	docker compose exec auth npx prisma generate

# Run auth-service in localhost with passed env file
auth-localhost:
	pnpx env-cmd -f ./envs/auth.env nx run auth-svc:serve



# ------------------ Utility Commands ------------------------

# Clean up unused Docker images and containers
clean:
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -f

# Build and push production image to registry
push-prod:
	docker build -f apps/auth-svc/Dockerfile -t $(IMAGE_NAME):latest .
	docker push $(IMAGE_NAME):latest

# Check container health
check-health:
	curl -f http://localhost:3000/health || echo "Health check failed"

# View Kubernetes pod logs
k8s-logs:
	kubectl logs -l app=auth-svc -f

# Access Kubernetes pod
k8s-exec:
	kubectl exec -it $$(kubectl get pod -l app=auth-svc -o jsonpath="{.items[0].metadata.name}") -- bash



