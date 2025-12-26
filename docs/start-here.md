# Start Here - Project Context & Session Guidelines

> **CRITICAL**: Read this file at the START of EVERY session. Update it at the END of EVERY session.

**Last Updated**: December 25, 2025
**Project Version**: 0.1.0-alpha

---

## Session Rules (MUST FOLLOW)

### Rule 1: Research Before Action

- **ALWAYS** research latest documentation and best practices before implementing
- **ALWAYS** ask for permission before making significant changes
- Check official docs for latest versions and recommended patterns
- Example: "I'm about to implement X using Y approach based on Z documentation. Should I proceed?"

### Rule 2: Consistency is King

- **NEVER** deviate from established patterns without explicit approval
- If current approach needs modification, **ASK** for:
    - One-time exception (for this task only)
    - Permanent change (update this file)
- Follow existing code structure, naming conventions, and architecture patterns
- Example: If auth uses Express patterns, all TypeScript services use Express patterns

### Rule 3: Professional Engineering Mindset

- Act as a **curious engineer** - question assumptions
- Be **skeptical** - verify before implementing
- **Doubt** is healthy - raise concerns about design decisions
- Ask "why" and "what if" questions
- Challenge requirements if something seems off

### Rule 4: File Maintenance Protocol

- **START of session**: Read this file completely
- **DURING session**: Take notes on changes, decisions, and new patterns
- **END of session**: Update this file with:
    - New architectural decisions
    - Technology choices made
    - Patterns established
    - TODOs and blockers
    - Lessons learned

---

## Project Vision & Purpose

### What We're Building

A **cloud-native payment processing microservices platform** supporting:

- **Cryptocurrency payments** (Bitcoin, Ethereum, etc.)
- **Fiat payments** (Stripe, PayPal, bank transfers)
- **Multi-platform clients** (Web, Mobile, Desktop)
- **Enterprise-grade security** (mTLS, JWT, network policies)

### Core Business Capabilities

1. Multi-currency transaction processing (crypto + fiat)
2. User authentication and account management
3. Double-entry bookkeeping ledger system
4. Real-time analytics and reporting
5. Payment gateway integrations (Stripe, PayPal)
6. Blockchain integration for crypto transactions

---

## Technology Decisions (CANONICAL)

### Language Assignments by Service

| Service         | Language           | Rationale                                      | Status          |
|-----------------|--------------------|------------------------------------------------|-----------------|
| **API Gateway** | Rust               | Performance, memory safety for public endpoint | Framework ready |
| **Auth**        | TypeScript         | Existing better-auth ecosystem                 | Framework ready |
| **Users**       | TypeScript         | Consistency with Auth service                  | Framework ready |
| **Fiat**        | Go                 | Payment processor integrations, performance    | Planned         |
| **Crypto**      | Rust               | Memory safety for blockchain ops, performance  | Planned         |
| **Ledger**      | Go or TypeScript   | TBD - ask before deciding                      | Planned         |
| **Analytics**   | Rust or TypeScript | TBD - ask before deciding                      | Planned         |

### Client Applications

| Platform | Technology    | Framework         | Rationale                  |
|----------|---------------|-------------------|----------------------------|
| Web      | TypeScript    | Next.js 15+       | SSR, SEO, React ecosystem  |
| Mobile   | TypeScript/JS | Expo React Native | Cross-platform iOS/Android |
| Desktop  | Rust + TS     | Tauri             | Native performance, secure |

### Infrastructure Stack

- **Orchestration**: Kubernetes (Minikube dev, K8s prod)
- **IaC**: Terraform (v1.5+)
- **Config Management**: Kustomize (base + overlays)
- **Secrets**: HashiCorp Vault + External Secrets Operator
- **Monitoring**: Prometheus + Grafana (planned)
- **Automation**: Ansible (planned)
- **Database**: PostgreSQL via Supabase

---

## Architecture Patterns (ESTABLISHED)

### Communication Protocol Hierarchy

```
External (Client → API Gateway)
  ↓ HTTP/3 + TLS 1.3 (Let's Encrypt via cert-manager)

Internal (API Gateway → Services)
  ↓ gRPC + mTLS (mutual TLS via internal CA)

Service → Service
  ↓ gRPC + mTLS (mutual TLS via internal CA)

Service → Database
  ↓ PostgreSQL wire protocol + SSL/TLS
```

### Network Security Model

- **External Layer**: Only API Gateway accepts public traffic
- **Network Policies**: Backend services ONLY accept from API Gateway
- **Inbound/Outbound Control**: Kubernetes NetworkPolicies enforce restrictions
- **No direct service-to-service** HTTP - all via gRPC + mTLS

### Authentication & Secrets

- **Auth Method**: JWT tokens with RS256 signing
- **Token Expiry**: 15 minutes (access), 7 days (session)
- **Key Rotation**: JWKS every 30 days
- **Secrets Storage**: Vault KV v2 at `secret/microservices`
- **Secret Sync**: External Secrets Operator (15s refresh in dev)

---

## Project Structure

```
microservices/
├── services/              # Backend microservices
│   ├── api-gateway/       # Rust (Axum 0.8.8 + Tokio)
│   ├── auth/              # TypeScript (Express 5 + better-auth 1.4.7)
│   ├── users/             # TypeScript (Express 5)
│   ├── fiat/              # Go (placeholder - not started)
│   ├── crypto/            # Rust (placeholder - not started)
│   ├── ledger/            # TBD (placeholder - not started)
│   └── analytics/         # TBD (placeholder - not started)
├── clients/
│   ├── web/               # Next.js (placeholder - not started)
│   ├── mobile/            # Expo React Native (placeholder - not started)
│   └── desktop/           # Tauri (planned)
├── manifests/
│   ├── base/              # Kubernetes base configs
│   │   ├── api-gateway/
│   │   └── auth-service/
│   └── overlays/
│       ├── dev/           # Development (namespace: microservices-dev)
│       ├── staging/       # Staging (namespace: microservices-staging)
│       └── prod/          # Production (namespace: microservices-prod)
├── provision/             # Terraform IaC
│   ├── vault.tf
│   ├── vault.values.yaml
│   ├── external-secrets.tf
│   └── kubernetes.tf
├── scripts/
│   └── load-secrets.sh    # One-command Vault secret loading
├── docs/
│   ├── start-here.md      # THIS FILE
│   ├── development-secrets.md
│   └── development-issues.md
└── automation/            # Ansible playbooks (placeholder)
```

---

## Current Implementation Status

### ✅ Fully Implemented

- [x] API Gateway framework (Rust/Axum) - HTTP/2 support
- [x] Auth Service framework (TypeScript/Express + better-auth)
- [x] Users Service framework (TypeScript/Express)
- [x] Kubernetes manifests (base + 3 overlays)
- [x] Terraform infrastructure provisioning
- [x] Vault dev mode installation
- [x] External Secrets Operator installation
- [x] Secret syncing (Vault → K8s via ESO)
- [x] Docker multi-stage builds for all services
- [x] Supabase PostgreSQL integration
- [x] Test infrastructure (Vitest configured)
- [x] Comprehensive README.md

### 🚧 Partially Implemented

- [ ] API Gateway routes (stubs exist, no business logic)
- [ ] Auth endpoints (template structure, no real auth logic)
- [ ] gRPC scaffolding (marked as TODO in code)

### ❌ Not Yet Started

- [ ] gRPC client/server implementation
- [ ] mTLS certificate generation and setup
- [ ] cert-manager for Let's Encrypt
- [ ] Fiat Service (Go)
- [ ] Crypto Service (Rust)
- [ ] Ledger Service
- [ ] Analytics Service
- [ ] Client applications (web/mobile/desktop)
- [ ] Prometheus + Grafana
- [ ] Ansible automation
- [ ] CI/CD pipelines (workflows exist as .dev files)
- [ ] Database migrations
- [ ] Middleware (logging, rate limiting, CORS)
- [ ] Production Vault setup (persistent storage, HA)

---

## Development Workflows

### Local Development Setup

```bash
# 1. Start Minikube
minikube start --memory=4096 --cpus=2
minikube addons enable default-storageclass storage-provisioner

# 2. Provision infrastructure
cd provision && terraform init && terraform apply

# 3. Load secrets
cd .. && ./scripts/load-secrets.sh

# 4. Verify
kubectl get pods -n microservices-dev
kubectl get externalsecret -n microservices-dev
```

### Secret Management Pattern

- **secrets.json** in project root (gitignored)
- Run `./scripts/load-secrets.sh` to upload to Vault
- ESO automatically syncs to K8s Secret `microservices-secrets`
- Services reference K8s Secret in env vars

### Testing Strategy

- **TypeScript services**: Vitest framework
- **Test structure**:
    - `source/**/*.test.ts` - Unit tests
    - `tests/integration/` - Integration tests
    - `tests/e2e/` - End-to-end tests
- **Commands**: `npm run test`, `npm run test:coverage`, `npm run test:ui`

### Code Quality Tools

- **Rust**: rustfmt, clippy
- **TypeScript**: ESLint + Prettier
- **Go**: gofmt, golint (when implemented)
- **Commit style**: Conventional Commits

---

## Key Configuration Details

### Kubernetes Namespaces

- `vault` - HashiCorp Vault pod
- `external-secrets` - ESO operator
- `microservices-dev` - Development deployment
- `microservices-staging` - Staging deployment (future)
- `microservices-prod` - Production deployment (future)

### Terraform Providers

```hcl
hashicorp/kubernetes : 2.38.0
hashicorp/helm : 2.15.0
kbst/kustomization : 0.9.7
```

### Vault Configuration

- **Mode**: Dev mode (in-memory, ephemeral)
- **Root Token**: `root` (hardcoded for dev)
- **Service**: `vault.vault.svc.cluster.local:8200`
- **KV Version**: v2
- **Secret Path**: `secret/microservices`

### API Gateway Details

- **Framework**: Axum 0.8.8
- **Runtime**: Tokio (full features)
- **Port**: 3000 internal, 443 external
- **Current state**: HTTP/2 enabled, HTTP/3 planned
- **Routes**: `/auth/*`, `/users/*`, `/health`

### Auth Service Details

- **Framework**: Express.js 5
- **Auth Library**: better-auth 1.4.7
- **JWT Library**: jose 6.1.3
- **Port**: 3001
- **Database**: Supabase PostgreSQL

---

## Architectural Decisions & Rationale

### Why Polyglot (Multiple Languages)?

- **Rust for API Gateway**: Performance critical, memory safety for public endpoint
- **Rust for Crypto**: Memory safety essential for blockchain operations
- **Go for Fiat**: Strong ecosystem for payment integrations, good concurrency
- **TypeScript for Auth/Users**: better-auth ecosystem, rapid development

### Why gRPC Internally?

- Type-safe contracts via protobuf
- Better performance than REST for internal communication
- Supports streaming for real-time updates
- Industry standard for microservices

### Why Kubernetes?

- Cloud-agnostic deployment
- Built-in service discovery, load balancing
- NetworkPolicies for security
- Auto-scaling and self-healing
- Standard for microservices platforms

### Why Vault + ESO?

- Centralized secret management
- Automatic rotation capabilities
- Audit logging
- GitOps-friendly (secrets not in git)
- Industry standard for secret management

---

## Known Issues & Blockers

### Critical Blockers

1. **gRPC not implemented** - API Gateway can't communicate with backend
2. **mTLS certificates not generated** - No internal service authentication
3. **Auth endpoints are stubs** - No real authentication happening
4. **No database migrations** - Schema changes not managed

### Development Issues

- Terraform can hang during ESO installation (networking issue)
    - Fix: `minikube stop && minikube start` with storage addons
- Vault connection requires port-forwarding
    - Fix: Use `./scripts/load-secrets.sh` which handles it

### Technical Debt

- Error handling not implemented in API Gateway
- No middleware layer (logging, rate limiting)
- CI/CD workflows are placeholder files (.dev extension)
- No monitoring/observability stack

---

## Naming Conventions & Patterns

### Service Naming

- Pattern: `{domain}-service` (e.g., `auth-service`, `users-service`)
- Container images: `frostdev273/microservices-{service}:{version}`

### Kubernetes Resources

- Deployments: `{service-name}` (e.g., `api-gateway`, `auth-service`)
- Services: `{service-name}` (e.g., `api-gateway`, `auth-service`)
- ConfigMaps: `{service-name}` (e.g., `api-gateway`, `auth-service`)
- Secrets: `{purpose}-secrets` (e.g., `microservices-secrets`, `vault-root-token`)

### File Structure Pattern (TypeScript Services)

```
service/
├── source/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utilities/
│   └── server.ts
├── tests/
├── build/
├── docker/
└── package.json
```

---

## Dependencies & Versions

### API Gateway (Rust)

```toml
axum = "0.8.8" (features: http2)
tokio = "1.0" (features: full)
serde = "1.0" (features: derive)
jsonwebtoken = "10.2.0"
bcrypt = "0.17.1"
```

### Auth/Users Services (TypeScript)

```json
better-auth: ^1.4.7
express: ^5.2.1
jose: ^6.1.3
@supabase/supabase-js: ^2.89.0
pg: ^8.16.3
vitest: ^4.0.16
```

### Infrastructure

- Vault Helm Chart: 0.31.0
- External Secrets Operator: 1.2.0
- Minikube: 1.30+
- Terraform: 1.5+
- kubectl: 1.28+

---

## Future Roadmap Phases

### Phase 2: Core Services (Q1-Q2 2025)

- Implement gRPC communication
- Setup mTLS with cert-manager
- Build Fiat Service (Go) - Stripe integration
- Build Crypto Service (Rust) - Bitcoin/Ethereum
- Build Ledger Service - Transaction recording
- Implement comprehensive error handling

### Phase 3: Client Applications (Q2-Q3 2025)

- Next.js web application
- Expo React Native mobile app
- Tauri desktop application

### Phase 4: Observability (Q3 2025)

- Prometheus metrics
- Grafana dashboards
- Distributed tracing (Jaeger)
- Ansible automation

### Phase 5: Production Hardening (Q4 2025)

- HTTP/3 support
- Production Vault (HA, persistent storage)
- Auto-scaling policies
- Security audits

---

## Environment-Specific Notes

### Development (overlays/dev)

- Single replicas for all services
- Vault in dev mode (in-memory)
- Debug logging enabled
- No resource limits

### Staging (overlays/staging)

- Production-like setup
- Used for integration testing
- Separate namespace

### Production (overlays/prod)

- High availability (multiple replicas)
- Production Vault with persistent storage
- Resource limits enforced
- Auto-scaling enabled

---

## Commands Cheat Sheet

### Kubernetes

```bash
# Get all resources in dev
kubectl get all -n microservices-dev

# Check secrets sync
kubectl get externalsecret -n microservices-dev
kubectl describe externalsecret microservices-secrets -n microservices-dev

# Check logs
kubectl logs -n microservices-dev deployment/api-gateway
kubectl logs -n external-secrets -l app.kubernetes.io/name=external-secrets

# Port forward
kubectl port-forward -n microservices-dev svc/api-gateway 3000:443
```

### Vault

```bash
# Load secrets
./scripts/load-secrets.sh

# Manual Vault access
kubectl port-forward -n vault svc/vault 8200:8200 &
export VAULT_ADDR='http://localhost:8200'
export VAULT_TOKEN='root'
vault kv get secret/microservices
```

### Terraform

```bash
cd provision
terraform init
terraform plan
terraform apply
terraform destroy  # Careful!
```

### Development

```bash
# Build service
cd services/api-gateway && cargo build --release
cd services/auth && npm run build

# Run tests
cd services/auth && npm run test
cd services/auth && npm run test:coverage

# Lint/format
npm run lint
npm run format
```

---

## Questions to Ask Before Proceeding

When implementing new features, always clarify:

1. **Language choice**: "Should I implement {service} in {language} based on our stack?"
2. **Architecture**: "This follows {pattern}. Should I proceed or use a different approach?"
3. **Dependencies**: "I'm adding {dependency} version {X}. Is this acceptable?"
4. **Breaking changes**: "This change affects {area}. Should I create a migration plan?"
5. **Security**: "I'm implementing {feature} with {security approach}. Is this aligned with our model?"
6. **Testing**: "Should I write unit tests, integration tests, or both for this?"

---

## Session End Checklist

Before ending a session, ensure:

- [ ] This file is updated with new decisions
- [ ] New patterns are documented
- [ ] Technology choices are recorded
- [ ] Known issues are noted
- [ ] File structure changes are reflected
- [ ] Dependencies/versions are updated
- [ ] Any exceptions to rules are documented

---

## Emergency Contacts & Resources

- **Repository**: https://github.com/chopsticks-user/microservices
- **License**: MIT (Copyright 2025 Quang Cap)
- **Primary Documentation**: README.md, services/api-gateway/README.md
- **Secrets Guide**: docs/development-secrets.md
- **Issues**: docs/development-issues.md

---

**End of Context File**

Remember: Read this FIRST, update this LAST, follow the rules ALWAYS.
