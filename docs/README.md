# IsNex Documentation

Welcome to the IsNex microservices platform documentation. This guide provides comprehensive information for developers, operators, and contributors working with the IsNex MLOps platform.

## 🚀 Quick Links

- **[Quick Start Guide](quickstart.md)** - Get up and running in 5 minutes
- **[System Architecture](architecture.md)** - Understand the platform design
- **[API Documentation](assets/openapi/)** - OpenAPI specifications
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## 📋 What is IsNex?

IsNex is a microservices-based MLOps platform built with:

- **Node.js** microservices architecture
- **Kubernetes-native** deployment
- **Docker Compose** for local development
- **Nx monorepo** for efficient development workflow
- **Skaffold** for seamless K8s development

## 🏗️ Platform Components

### Core Services

- **[Auth Service](services/auth-service.md)** - Authentication and user management
- **[Documents Service](services/documents-service.md)** - Document processing and storage
- **[API Gateway](services/api-gateway.md)** - Centralized request routing and middleware
- **[Client App](services/client-app.md)** - Frontend user interface

### Infrastructure

- **[Docker Compose](infra/docker-compose.md)** - Local development environment
- **[Kubernetes](infra/k8s/)** - Production container orchestration
- **[Skaffold](infra/skaffold.md)** - Development workflow automation

## 📖 Documentation Structure

```
docs/
├── 📄 README.md              # This file - documentation overview
├── 📄 overview.md            # Platform overview and concepts
├── 📄 quickstart.md          # 5-minute setup guide
├── 📄 architecture.md        # System architecture and design
├── 📄 glossary.md            # Terms and definitions
├── 📄 CONTRIBUTING.md        # Contribution guidelines
├── 📄 CHANGELOG.md           # Version history and changes
│
├── 📁 assets/                # Static resources
│   ├── diagrams/             # Architecture diagrams
│   ├── openapi/              # API specifications
│   └── screenshots/          # UI screenshots
│
├── 📁 services/              # Service-specific documentation
│   ├── api-gateway.md
│   ├── auth-service.md
│   ├── documents-service.md
│   └── client-app.md
│
├── 📁 infra/                 # Infrastructure documentation
│   ├── docker-compose.md
│   ├── k8s/                  # Kubernetes manifests and guides
│   └── skaffold.md
│
├── 📁 mlops/                 # MLOps workflows (future)
│   ├── README.md
│   ├── training.md
│   └── evaluation.md
│
├── 📁 runbooks/              # Operational procedures
│   ├── incident_template.md
│   ├── auth_service_down.md
│   └── high_cpu.md
│
├── 📁 ci-cd/                 # CI/CD and automation
│   ├── pipelines.md
│   └── nx-commands.md
│
├── 📁 observability/         # Monitoring and logging
│   ├── monitoring.md
│   ├── dashboards.md
│   └── alerts.md
│
├── 📁 security/              # Security guidelines
│   ├── secrets.md
│   └── network_policy.md
│
├── 📁 commands/              # Command references
│   ├── dev_commands.md
│   └── deploy_commands.md
│
└── 📁 templates/             # Documentation templates
    ├── service_template.md
    ├── openapi_template.yaml
    └── incident_report_template.md
```

## 🎯 Getting Started

### For Developers

1. **[Quick Start](quickstart.md)** - Set up your development environment
2. **[Development Commands](commands/dev_commands.md)** - Essential commands for daily work
3. **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute code

### For Operators

1. **[Infrastructure Setup](infra/)** - Deploy and manage the platform
2. **[Runbooks](runbooks/)** - Operational procedures and troubleshooting
3. **[Monitoring](observability/)** - Observability and alerting setup

### For Architects

1. **[System Architecture](architecture.md)** - Platform design and patterns
2. **[Service Documentation](services/)** - Individual service specifications
3. **[Security Guidelines](security/)** - Security best practices

## 🔧 Development Workflow

### Local Development

```bash
# Quick start with Docker Compose
docker-compose up -d

# Or with Nx commands
pnpm nx serve auth-svc
pnpm nx serve client
```

### Kubernetes Development

```bash
# Start Skaffold development mode
skaffold dev

# Deploy to development cluster
skaffold run -p development
```

### Testing

```bash
# Run all tests
pnpm nx run-many --target=test

# Run affected tests only
pnpm nx affected:test
```

## 📚 Key Concepts

### Microservices Architecture

- **Service Independence**: Each service has its own database and deployment cycle
- **API-First Design**: All inter-service communication via well-defined APIs
- **Event-Driven**: Asynchronous communication through message queues (built with kafka)

### MLOps Integration

- **Model Lifecycle Management**: Training, validation, deployment, monitoring
- **Experiment Tracking**: Version control for models and datasets
- **Automated Pipelines**: CI/CD for ML models and data pipelines

### Cloud-Native Principles

- **Containerization**: Docker containers for all services
- **Orchestration**: Kubernetes for production deployment
- **Observability**: Comprehensive logging, metrics, and tracing

## 🆘 Getting Help

### Common Issues

- Check **[Troubleshooting](runbooks/)** runbooks
- Review **[FAQ](glossary.md#faq)** section
- Search existing **[GitHub Issues](https://github.com/your-org/isnex/issues)**

### Support Channels

- **Documentation**: Browse this documentation site
- **GitHub Issues**: Report bugs and feature requests
- **Team Chat**: Internal Slack/Discord channels
- **Code Reviews**: GitHub Pull Request discussions

### Contributing

We welcome contributions! Please read our **[Contributing Guidelines](CONTRIBUTING.md)** to get started.

## 📅 Recent Updates

| Date       | Update                                | Link                         |
| ---------- | ------------------------------------- | ---------------------------- |
| 2025-08-22 | Added project documentation structure | [CHANGELOG.md](CHANGELOG.md) |

## 🏷️ Version Information

- **Platform Version**: v1.0.0
- **Documentation Version**: v1.0.0
- **Last Updated**: August 22, 2025
- **Maintainers**: Nhat Minh (mdop297)

## 📄 License & Legal

This documentation is part of the IsNex project. Please refer to the main project repository for licensing information.

---

**Need something updated?** Please create an issue or submit a pull request to keep this documentation accurate and helpful! 🚀
