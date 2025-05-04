compose-up:
	docker compose --env-file ./envs/auth.env up -d

compose-down:
	docker compose down

auth-run-dev:
	nx run auth-svc:serve


# ------------------ Kubernetes commands ------------------------
skaffold-dev: 
	skaffold dev
