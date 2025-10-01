# IsNex

## 📦 Requirements

- Node.js (>=18)
- pnpm (>=9)
- Nx CLI

## 🚀 How to run

### 1. Clone the repository

```bash
git clone https://github.com/mdop297/IsNex.git
cd IsNex
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Install Nx globally (if not installed)

```bash
pnpm install --global nx
```

### 4. Run the client (UI)

```bash
nx run client:dev
```

## Project structure

```
.
├── .github/                      → GitHub Actions workflows & configs
├── .husky/                       → Git hooks (lint-staged, commit checks)
├── .nx/                          → Nx build system cache & metadata

├── apps/                         → Main applications (microservices + frontend)
│   ├── api-gateway/              → Kong or custom API gateway service
│   ├── auth-svc/                 → Authentication & authorization microservice
│   ├── client/                   → Frontend app (Next.js/React)
│   └── documents/                → Document management service

├── envs/                         → Environment variable files
│   ├── auth.env                  → Local env config for auth service
│   └── auth.env.example          → Example template for env setup

├── infras/                       → Infrastructure configs
│   ├── k8s/                      → Kubernetes manifests (prod/staging)
│   └── k8s-dev/                  → Dev k8s manifests (local/dev cluster)

├── docker-compose.yml            → Base Docker Compose setup
├── docker-compose.override.yml   → Overrides for docker-compose.yml, usually for local dev

├── skaffold.yaml                 → Skaffold config for Kubernetes dev workflow
├── Makefile                      → Automation scripts (build, deploy, test)
├── README.md                     → Project overview & instructions

├── eslint.config.js              → ESLint rules
├── commitlint.config.js          → Rules for commit message linting with Commitlint
├── nx.json                       → Nx workspace config
├── pnpm-workspace.yaml           → Monorepo workspace definition
├── pnpm-lock.yaml                → Dependency lockfile
└── package.json                  → Root dependencies & scripts

```
