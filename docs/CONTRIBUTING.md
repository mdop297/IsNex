# Contributing to IsNex

Thank you for your interest in contributing to [Project Name]! This document outlines how you can contribute to the project.

## Getting Started

- **Clone the repository**: `git clone <repo-url>`
- **Set up the environment**: Follow the instructions in [quickstart.md](quickstart.md) to set up the development environment.
- **Run locally**: See [dev_commands.md](commands/dev_commands.md) for running the project locally.

## How to Contribute

### Reporting Bugs

- Use the GitHub Issues template to report bugs.
- Include:
  - A clear description of the issue.
  - Steps to reproduce the bug.
  - Expected and actual behavior.
  - Environment details (OS, version, etc.).

### Suggesting Features

- Submit feature requests via GitHub Issues with the "Feature Request" label.
- Provide a detailed explanation of the proposed feature and its use case.

### Submitting Pull Requests

1. Fork the repository and create a new branch (`git checkout -b feature/your-feature-name`).
2. Make your changes and ensure tests pass.
3. Follow the coding standards outlined in [service_template.md](templates/service_template.md).
4. Write clear commit messages using [Conventional Commits](https://www.conventionalcommits.org/).
5. Submit a Pull Request to the `main` branch and include a description of your changes.
6. Ensure CI/CD pipelines (see [pipelines.md](ci-cd/pipelines.md)) pass.

## Code Style

- Use [Prettier/ESLint] for code formatting.
- Document all public APIs using the OpenAPI template ([openapi_template.yaml](templates/openapi_template.yaml)).
- Update relevant documentation in the `services` or `architecture.md` files.

## Testing

- Write unit tests for all new features.
- Run tests locally using commands in [dev_commands.md](commands/dev_commands.md).
- Ensure 100% test coverage for critical components.

## Deployment

- For deployment instructions, refer to [deploy_commands.md](commands/deploy_commands.md) and [skaffold.md](infra/skaffold.md).

## Community

- Join our [Slack/Discord] for discussions.

## Resources

- Architecture: [architecture.md](architecture.md)
- API Docs: [openapi-auth-service.yaml](assets/openapi/openapi-auth-service.yaml)
- Diagrams: [arch-high-level.svg](assets/diagrams/arch-high-level.svg)

Thank you for contributing!
