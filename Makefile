# ------------------ Docker Compose Commands ------------------------

up:
	docker compose --env-file ./envs/auth.env up -d

up-dev:
	docker compose --env-file ./envs/auth.env -f docker-compose.yml -f docker-compose.override.yml up -d --build

down:
	docker compose down

logs:
	docker compose logs -f --tail=100

# ------------------ Auth Service Commands ------------------------

auth-run-dev:
	nx run auth-svc:serve

auth-migrate-dev:
	docker compose exec auth npx prisma migrate dev

auth-db-reset:
	docker compose exec auth npx prisma migrate reset

auth-db-studio:
	docker compose exec auth npx prisma studio

# ------------------ Kubernetes Commands ------------------------

skaffold-dev:
	skaffold dev
