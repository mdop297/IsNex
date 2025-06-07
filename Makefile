# Makefile for managing the auth-svc project

# ------------------ Variables ------------------------
# Environment file for Docker Compose
ENV_FILE = ./envs/auth.env

# Docker Compose files
COMPOSE_FILE = docker-compose.yml
COMPOSE_DB_FILE = docker-compose.db.yml
COMPOSE_DEV_FILE = docker-compose.override.yml

# Image name for auth service
IMAGE_NAME = mdop297/isnex-auth

# ------------------ Docker Compose Commands ------------------------

# Start services in detached mode
up:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) up -d

# Start database to test in local in detached mode
up-database:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_DB_FILE) up -d


# Start services in development mode with override
up-dev:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d

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
skaffold-dev-local:
	skaffold dev --profile=dev-local

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



