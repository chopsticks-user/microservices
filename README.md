# Payment Processing Microservices Platform

A cloud-native, polyglot microservices platform for processing both **cryptocurrency** and **fiat payments** (Stripe, PayPal, etc.) with enterprise-grade security and scalability.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-orange.svg)](https://github.com/chopsticks-user/microservices/releases)

> **⚠️ Development Status**: This project is in active early-stage development (v0.1.0-alpha). Core infrastructure is established but business logic implementation is ongoing.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Services](#services)
- [Client Applications](#client-applications)
- [Infrastructure](#infrastructure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This platform provides a complete payment processing solution supporting both traditional fiat currencies and cryptocurrencies through a modern microservices architecture. The system is designed for:

- **Multi-Currency Support**: Process payments in both fiat (USD, EUR, etc.) and cryptocurrencies (BTC, ETH, etc.)
- **Payment Gateway Integration**: Stripe, PayPal, and other fiat payment processors
- **Blockchain Integration**: Direct cryptocurrency transaction processing
- **Enterprise Security**: mTLS between services, JWT authentication, secrets management via Vault
- **Cloud-Native**: Kubernetes-first design with Terraform infrastructure-as-code
- **Multi-Platform**: Web (Next.js), Mobile (React Native), and Desktop (Tauri) clients

### Core Capabilities

- ✅ **User Authentication & Management**: Secure JWT-based auth with session handling
- 🚧 **Payment Processing**: Fiat (Stripe, PayPal) and Crypto (blockchain integration)
- 🚧 **Transaction Ledger**: Double-entry bookkeeping for all financial transactions
- 🚧 **Analytics & Reporting**: Real-time insights into payment flows and user behavior
- 🔮 **HTTP/3 Support**: Next-generation protocol for reduced latency

**Legend**: ✅ Implemented | 🚧 In Development | 🔮 Planned

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────────┐   │
│  │   Web    │  │  Mobile  │  │        Desktop GUI           │   │
│  │ Next.js  │  │   Expo   │  │          Tauri               │   │
│  │          │  │  React   │  │     (Rust + WebView)         │   │
│  │          │  │  Native  │  │                              │   │
│  └────┬─────┘  └────┬─────┘  └─────────────┬────────────────┘   │
│       └─────────────┴──────────────────────┘                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS/HTTP3 + TLS
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Rust)                          │
│            REST/HTTP → gRPC Translation Layer                   │
│         • Request validation & rate limiting                    │
│         • JWT verification                                      │
│         • Protocol translation (REST → gRPC)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ gRPC + mTLS (internal)
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
┌───────────────────────┐  ┌───────────────────────┐
│   Auth Service (TS)   │  │  Users Service (TS)   │
│  • JWT generation     │  │  • Profile management │
│  • Session mgmt       │  │  • Account data       │
└───────────────────────┘  └───────────────────────┘
                │                       │
                └───────────┬───────────┘
                            ↓
                ┌───────────────────────┐
                │  PostgreSQL (Supabase)│
                │   User & Auth Data    │
                └───────────────────────┘

        ┌─────────────────────────────────┐
        │      Payment Services Layer     │
        ├─────────────────────────────────┤
        │  ┌───────────────────────────┐  │
        │  │  Fiat Service (Go)        │  │
        │  │  • Stripe integration     │  │
        │  │  • PayPal integration     │  │
        │  │  • Bank transfers         │  │
        │  └───────────────────────────┘  │
        │                                 │
        │  ┌───────────────────────────┐  │
        │  │  Crypto Service (Rust)    │  │
        │  │  • Blockchain integration │  │
        │  │  • Wallet management      │  │
        │  │  • Transaction signing    │  │
        │  └───────────────────────────┘  │
        └─────────────────────────────────┘
                      │
                      ↓
        ┌─────────────────────────────────┐
        │   Ledger Service (Go)           │
        │   • Double-entry bookkeeping    │
        │   • Transaction history         │
        │   • Balance reconciliation      │
        └─────────────────────────────────┘
                      │
                      ↓
        ┌─────────────────────────────────┐
        │   Analytics Service (Rust)      │
        │   • Metrics aggregation         │
        │   • Reporting & insights        │
        │   • Prometheus/Grafana export   │
        └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   Vault  │  │   ESO    │  │Prometheus│  │ Grafana  │         │
│  │ Secrets  │  │  Sync    │  │ Metrics  │  │Dashboard │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Kubernetes (Minikube/K8s)                    │    │
│  │  • Network policies (inbound/outbound control)          │    │
│  │  • Service mesh for inter-service communication         │    │
│  │  • Auto-scaling & self-healing                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Provisioned via Terraform (Infrastructure as Code)             │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Patterns

| Layer                      | Protocol                 | Security                | Status            |
|----------------------------|--------------------------|-------------------------|-------------------|
| **Client → API Gateway**   | REST/HTTP3 over QUIC     | TLS 1.3 (Let's Encrypt) | 🔮 Planned        |
| **API Gateway → Services** | gRPC                     | mTLS (mutual TLS)       | 🚧 In Development |
| **Service → Service**      | gRPC                     | mTLS (mutual TLS)       | 🚧 In Development |
| **Service → Database**     | PostgreSQL wire protocol | SSL/TLS                 | ✅ Implemented     |

### Security Model

1. **External Layer**: HTTPS/HTTP3 with TLS certificates from Let's Encrypt (cert-manager)
2. **Internal Layer**: gRPC with mutual TLS (mTLS) using internal Certificate Authority
3. **Secrets Management**: HashiCorp Vault with External Secrets Operator (ESO)
4. **Authentication**: JWT tokens with RS256 signing, 15-minute expiry, 30-day key rotation
5. **Network Policies**: Kubernetes NetworkPolicies ensure services only accept requests from API Gateway

---

## Technology Stack

### Backend Services

| Service               | Language   | Framework                | Purpose                         | Status            |
|-----------------------|------------|--------------------------|---------------------------------|-------------------|
| **API Gateway**       | Rust       | Axum + Tokio             | Client-facing REST endpoint     | ✅ Framework ready |
| **Auth Service**      | TypeScript | Express.js + better-auth | Authentication & JWT management | ✅ Framework ready |
| **Users Service**     | TypeScript | Express.js               | User profile management         | ✅ Framework ready |
| **Fiat Service**      | Go         | TBD                      | Stripe, PayPal integration      | 🔮 Planned        |
| **Crypto Service**    | Rust       | TBD                      | Blockchain & wallet management  | 🔮 Planned        |
| **Ledger Service**    | Go         | TBD                      | Transaction ledger & accounting | 🔮 Planned        |
| **Analytics Service** | Rust       | TBD                      | Metrics & reporting             | 🔮 Planned        |

### Frontend Applications

| Platform    | Technology            | Framework           | Status     |
|-------------|-----------------------|---------------------|------------|
| **Web**     | TypeScript            | Next.js (React)     | 🔮 Planned |
| **Mobile**  | TypeScript/JavaScript | Expo (React Native) | 🔮 Planned |
| **Desktop** | Rust + TypeScript     | Tauri (WebView GUI) | 🔮 Planned |

### Infrastructure & DevOps

- **Container Orchestration**: Kubernetes (Minikube for local, K8s for production)
- **Infrastructure as Code**: Terraform (Kubernetes, Helm, Kustomization providers)
- **Configuration Management**: Kustomize (base + overlays pattern)
- **Secrets Management**: HashiCorp Vault (KV v2) + External Secrets Operator
- **Container Registry**: Docker Hub (frostdev273/*)
- **Monitoring**: Prometheus + Grafana (planned)
- **Configuration Automation**: Ansible (planned)
- **Databases**: PostgreSQL via Supabase

---

## Services

### 1. API Gateway (Rust)

**Port**: 3000 (internal) / 443 (external HTTPS)
**Version**: 0.1.0
**Location**: `/services/api-gateway/`

The entry point for all client requests. Translates RESTful HTTP calls into gRPC calls to backend microservices.

**Key Features**:
- HTTP/2 support (HTTP/3 planned)
- JWT verification middleware
- Request validation and sanitization
- Rate limiting (planned)
- Protocol translation (REST → gRPC)

**Tech Stack**: Axum 0.8.8, Tokio (async runtime), Serde (JSON), jsonwebtoken, bcrypt

**Documentation**: [services/api-gateway/README.md](services/api-gateway/README.md)

### 2. Auth Service (TypeScript)

**Port**: 3001
**Version**: 0.1.0
**Location**: `/services/auth/`

Handles user authentication, JWT token generation, and session management.

**Key Features**:
- Email/password authentication
- JWT generation with RS256 signing
- JWKS (JSON Web Key Set) rotation every 30 days
- Session management (7-day sessions, 15-minute JWT expiry)
- Integration with Supabase PostgreSQL

**Tech Stack**: Express.js 5, better-auth 1.4.7, jose (JWT), Supabase client

**Dependencies**:
```json
{
  "better-auth": "^1.4.7",
  "jose": "^6.1.3",
  "@supabase/supabase-js": "^2.89.0"
}
```

### 3. Users Service (TypeScript)

**Port**: 3001
**Version**: 0.1.0
**Location**: `/services/users/`

Manages user profiles, account data, and user-related operations.

**Key Features**:
- User profile CRUD operations
- Account settings management
- Integration with auth service for authorization

**Tech Stack**: Express.js 5, Supabase client, PostgreSQL (pg)

**Test Framework**: Vitest with coverage via @vitest/coverage-v8

### 4. Fiat Service (Go) - Planned

**Location**: `/services/fiat/`
**Status**: 🔮 Not yet implemented

Will handle traditional payment processing through:
- Stripe API integration
- PayPal REST API
- Bank transfer processing (ACH, SEPA)
- Payment verification and webhooks

### 5. Crypto Service (Rust) - Planned

**Location**: `/services/crypto/`
**Status**: 🔮 Not yet implemented

Will handle cryptocurrency operations:
- Blockchain integration (Bitcoin, Ethereum, etc.)
- Wallet creation and management
- Transaction signing and broadcasting
- Balance tracking and confirmations

### 6. Ledger Service (Go) - Planned

**Location**: `/services/ledger/`
**Status**: 🔮 Not yet implemented

Financial ledger implementing double-entry bookkeeping:
- Transaction recording (debits/credits)
- Balance reconciliation
- Audit trail and history
- Multi-currency support

### 7. Analytics Service (Rust) - Planned

**Location**: `/services/analytics/`
**Status**: 🔮 Not yet implemented

Aggregates metrics and provides insights:
- Transaction volume and trends
- User behavior analytics
- Payment success/failure rates
- Prometheus metrics export
- Grafana dashboard integration

---

## Client Applications

### Web Application (Next.js)

**Location**: `/clients/web/`
**Status**: 🔮 Not yet implemented
**Technology**: Next.js 15+ (React Server Components)

Features:
- Server-side rendering for SEO
- Payment checkout flows
- User dashboard
- Transaction history
- Real-time balance updates

### Mobile Application (React Native)

**Location**: `/clients/mobile/`
**Status**: 🔮 Not yet implemented
**Technology**: Expo (React Native)

Features:
- Cross-platform (iOS & Android)
- Biometric authentication
- Push notifications
- QR code scanning for crypto payments
- Offline-first architecture

### Desktop Application (Tauri)

**Status**: 🔮 Planned
**Technology**: Tauri (Rust backend + web frontend)

Features:
- Cross-platform (Windows, macOS, Linux)
- Native performance
- Secure key storage
- Advanced trading features
- Multi-account management

---

## Infrastructure

### Kubernetes Architecture

The platform deploys to Kubernetes with environment-specific configurations using Kustomize overlays.

```
manifests/
├── base/                    # Base configurations
│   ├── api-gateway/         # API Gateway deployment, service, configmap
│   ├── auth-service/        # Auth service deployment, service, configmap
│   └── kustomization.yaml
└── overlays/
    ├── dev/                 # Development environment
    │   ├── namespace.yaml
    │   ├── secret.yaml
    │   ├── secret-store.yaml
    │   ├── external-secret.yaml
    │   └── kustomization.yaml
    ├── staging/             # Staging environment
    └── prod/                # Production environment
```

**Network Policies**: Each service has inbound/outbound rules ensuring:
- Only API Gateway can receive external traffic
- Backend services only accept requests from API Gateway
- Database access is restricted to authorized services

### Terraform Infrastructure

**Location**: `/provision/`

Infrastructure is provisioned as code using Terraform with multiple providers:

| Component            | Provider               | Version | Purpose              |
|----------------------|------------------------|---------|----------------------|
| Kubernetes resources | `hashicorp/kubernetes` | 2.38.0  | Deploy K8s manifests |
| Helm charts          | `hashicorp/helm`       | 2.15.0  | Install Vault, ESO   |
| Kustomize            | `kbst/kustomization`   | 0.9.7   | Apply overlays       |

**Managed Components**:
- **Vault** (v0.31.0): Secret storage in dev mode
- **External Secrets Operator** (v1.2.0): Syncs secrets from Vault to K8s
- **Kubernetes manifests**: Via Kustomization provider

**Configuration Files**:
- `vault.tf`: Vault Helm installation
- `vault.values.yaml`: Vault dev mode configuration
- `external-secrets.tf`: ESO Helm installation
- `kubernetes.tf`: Kustomization resources

### Secrets Management

Secrets are managed using **HashiCorp Vault** + **External Secrets Operator (ESO)**:

1. **Vault** stores secrets at path `secret/microservices`
2. **SecretStore** (`vault-backend`) connects ESO to Vault
3. **ExternalSecret** resources define which secrets to sync
4. **ESO** automatically creates/updates Kubernetes Secrets

**Loading Secrets**:
```bash
# One-command secret loading
./scripts/load-secrets.sh

# Secrets are defined in secrets.json
{
  "jwt_secret": "your-secret-here",
  "database_url": "postgresql://...",
  "api_key": "..."
}
```

**Documentation**: [docs/development-secrets.md](docs/development-secrets.md)

---

## Getting Started

### Prerequisites

- **Kubernetes**: Minikube 1.30+ or any K8s cluster
- **Terraform**: 1.5+
- **Docker**: 24.0+
- **kubectl**: 1.28+
- **Vault CLI**: 1.15+ (for secret management)

**Optional**:
- **Rust**: 1.75+ (for building API Gateway)
- **Node.js**: 20+ (for TypeScript services)
- **Go**: 1.21+ (for future Go services)

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/chopsticks-user/microservices.git
cd microservices
```

#### 2. Start Minikube

```bash
minikube start --memory=4096 --cpus=2
minikube addons enable default-storageclass
minikube addons enable storage-provisioner
```

#### 3. Provision Infrastructure

```bash
cd provision
terraform init
terraform plan
terraform apply
```

This will install:
- HashiCorp Vault (dev mode)
- External Secrets Operator
- Kubernetes manifests (API Gateway, Auth Service, Users Service)

#### 4. Load Secrets

```bash
cd ..
./scripts/load-secrets.sh
```

Ensure `secrets.json` exists in the project root with your secrets.

#### 5. Verify Deployment

```bash
kubectl get pods -n microservices-dev
kubectl get services -n microservices-dev

# Check External Secrets sync
kubectl get externalsecret -n microservices-dev
kubectl get secretstore -n microservices-dev
```

#### 6. Access Services

```bash
# API Gateway
minikube service api-gateway -n microservices-dev

# Or use port-forwarding
kubectl port-forward -n microservices-dev svc/api-gateway 3000:443
```

### First API Request

```bash
# Health check
curl http://localhost:3000/health

# Login (stub endpoint)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

## Development

### Project Structure

```
microservices/
├── services/              # Backend microservices
│   ├── api-gateway/       # Rust API Gateway
│   ├── auth/              # TypeScript Auth Service
│   ├── users/             # TypeScript Users Service
│   ├── fiat/              # Go Fiat Payment Service (planned)
│   ├── crypto/            # Rust Crypto Service (planned)
│   ├── ledger/            # Go Ledger Service (planned)
│   └── analytics/         # Rust Analytics Service (planned)
├── clients/               # Client applications
│   ├── web/               # Next.js web app (planned)
│   ├── mobile/            # Expo React Native (planned)
│   └── desktop/           # Tauri desktop app (planned)
├── manifests/             # Kubernetes manifests
│   ├── base/              # Base configurations
│   └── overlays/          # Environment overlays (dev/staging/prod)
├── provision/             # Terraform IaC
├── scripts/               # Automation scripts
├── docs/                  # Documentation
└── automation/            # Ansible playbooks (planned)
```

### Building Services

#### API Gateway (Rust)

```bash
cd services/api-gateway
cargo build --release
cargo run
```

#### Auth Service (TypeScript)

```bash
cd services/auth
npm install
npm run dev          # Development with watch
npm run build        # Production build
npm run test         # Run tests
npm run test:coverage # Coverage report
```

#### Users Service (TypeScript)

```bash
cd services/users
npm install
npm run dev
npm run test
```

### Running Tests

All TypeScript services use **Vitest** for testing:

```bash
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Generate coverage report
npm run test:ui         # Interactive test UI
```

**Test Structure**:
- `source/**/*.test.ts`: Unit tests alongside source code
- `tests/integration/`: Integration tests
- `tests/e2e/`: End-to-end tests

### Code Quality

#### Linting & Formatting

```bash
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix issues
npm run format          # Prettier format
npm run format:check    # Check formatting
```

#### Pre-commit Hooks

The project uses Git hooks (planned) for automated checks:
- Code linting
- Format validation
- Test execution
- Type checking

---

## Deployment

### Environment Configuration

The platform supports three environments via Kustomize overlays:

1. **Development** (`manifests/overlays/dev/`):
   - Namespace: `microservices-dev`
   - Single replicas
   - Debug logging enabled
   - Vault in dev mode

2. **Staging** (`manifests/overlays/staging/`):
   - Namespace: `microservices-staging`
   - Production-like setup
   - Integration testing environment

3. **Production** (`manifests/overlays/prod/`):
   - Namespace: `microservices-prod`
   - High availability
   - Auto-scaling enabled
   - Production Vault with persistent storage

### Deploying to Kubernetes

```bash
# Deploy to development
kubectl apply -k manifests/overlays/dev

# Deploy to staging
kubectl apply -k manifests/overlays/staging

# Deploy to production
kubectl apply -k manifests/overlays/prod
```

### Container Images

Images are published to Docker Hub:

- `frostdev273/microservices-api-gateway:0.1.0`
- `frostdev273/microservices-auth-service:0.1.0`
- `frostdev273/microservices-users-service:0.1.0`

**Building & Pushing**:

```bash
# API Gateway
cd services/api-gateway
docker build -t frostdev273/microservices-api-gateway:0.1.0 .
docker push frostdev273/microservices-api-gateway:0.1.0

# Auth Service
cd services/auth
docker build -t frostdev273/microservices-auth-service:0.1.0 .
docker push frostdev273/microservices-auth-service:0.1.0
```

### CI/CD Pipeline (Planned)

GitHub Actions workflows will automate:
1. Testing on PR
2. Building Docker images
3. Security scanning
4. Deploying to staging on merge to `main`
5. Production deployment on tagged releases

---

## Roadmap

### Phase 1: Foundation (Current - Q1 2025) ✅

- [x] Project structure and repository setup
- [x] API Gateway framework (Rust/Axum)
- [x] Auth Service with JWT (TypeScript)
- [x] Users Service skeleton
- [x] Kubernetes manifests (base + overlays)
- [x] Terraform infrastructure provisioning
- [x] Vault + ESO secrets management
- [x] Docker multi-stage builds
- [x] Basic documentation

### Phase 2: Core Services (Q1-Q2 2025) 🚧

- [ ] Implement gRPC communication
- [ ] mTLS between services (cert-manager + internal CA)
- [ ] Fiat Service (Go) - Stripe integration
- [ ] Crypto Service (Rust) - Bitcoin/Ethereum support
- [ ] Ledger Service (Go) - Transaction recording
- [ ] Database migrations framework
- [ ] Comprehensive error handling
- [ ] Middleware layer (logging, rate limiting, CORS)

### Phase 3: Client Applications (Q2-Q3 2025) 🔮

- [ ] Web application (Next.js)
- [ ] Mobile application (Expo/React Native)
- [ ] Desktop application (Tauri)
- [ ] Real-time updates via WebSockets
- [ ] Push notifications

### Phase 4: Observability & Operations (Q3 2025) 🔮

- [ ] Prometheus metrics collection
- [ ] Grafana dashboards
- [ ] Distributed tracing (Jaeger/Tempo)
- [ ] Centralized logging (Loki/ELK)
- [ ] Ansible automation playbooks
- [ ] CI/CD pipelines (GitHub Actions)

### Phase 5: Production Hardening (Q4 2025) 🔮

- [ ] HTTP/3 support (QUIC protocol)
- [ ] Auto-scaling policies
- [ ] Disaster recovery procedures
- [ ] Performance optimization
- [ ] Security audits
- [ ] Load testing
- [ ] Production Vault setup (HA, persistent storage)

### Phase 6: Advanced Features (2026+) 🔮

- [ ] Multi-region deployment
- [ ] GraphQL API endpoint
- [ ] Webhook system for integrations
- [ ] Advanced fraud detection
- [ ] Compliance reporting (PCI-DSS, GDPR)
- [ ] White-label solutions

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Workflow

1. Pick an issue from the [issue tracker](https://github.com/chopsticks-user/microservices/issues)
2. Comment on the issue to claim it
3. Develop your feature/fix
4. Write tests
5. Update documentation
6. Submit PR with clear description

### Code Standards

- **Rust**: Follow `rustfmt` and `clippy` recommendations
- **TypeScript**: ESLint + Prettier configuration
- **Go**: `gofmt` and `golint`
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## Documentation

- **Architecture**: This README
- **API Gateway**: [services/api-gateway/README.md](services/api-gateway/README.md)
- **Secrets Management**: [docs/development-secrets.md](docs/development-secrets.md)
- **Testing Guide**: [services/users/tests/README.md](services/users/tests/README.md)
- **Development Issues**: [docs/development-issues.md](docs/development-issues.md)

---

## Troubleshooting

### Terraform Issues

**Problem**: Terraform hangs during ESO installation

**Solution**:
```bash
minikube stop
minikube start
minikube addons enable default-storageclass
minikube addons enable storage-provisioner
```

See [docs/development-issues.md](docs/development-issues.md) for more.

### Vault Connection Issues

**Problem**: `vault kv put` fails with connection refused

**Solution**:
```bash
# Use the provided script which handles port-forwarding
./scripts/load-secrets.sh
```

### ExternalSecret Not Syncing

**Problem**: ExternalSecret shows `SecretSyncedError`

**Solution**:
```bash
# Check if secret exists in Vault
kubectl port-forward -n vault svc/vault 8200:8200 &
export VAULT_ADDR='http://localhost:8200'
export VAULT_TOKEN='root'
vault kv get secret/microservices

# Check ESO operator logs
kubectl logs -n external-secrets -l app.kubernetes.io/name=external-secrets
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Quang Cap

---

## Acknowledgments

- Built with [Axum](https://github.com/tokio-rs/axum) and [Tokio](https://tokio.rs/)
- Authentication powered by [better-auth](https://www.better-auth.com/)
- Infrastructure managed by [Terraform](https://www.terraform.io/)
- Secrets management by [HashiCorp Vault](https://www.vaultproject.io/)

---

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/chopsticks-user/microservices/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chopsticks-user/microservices/discussions)
- **Security**: See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

---

**Status**: Active Development | **Version**: 0.1.0-alpha | **Last Updated**: December 2025