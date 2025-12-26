# Start Here - Project Context & Session Guidelines

> **CRITICAL**: Read this file at the START of EVERY session. Update it at the END of EVERY session.

**Last Updated**: December 26, 2025
**Project Version**: 0.1.0-alpha

---

## Session Rules (MUST FOLLOW)

### Rule 1: Research Before Action
- **ALWAYS** research latest documentation and best practices before implementing
- **ALWAYS** ask for permission before making significant changes
- Check official docs for latest versions and recommended patterns

### Rule 2: Consistency is King
- **NEVER** deviate from established patterns without explicit approval
- If current approach needs modification, **ASK** for:
    - One-time exception (for this task only)
    - Permanent change (update this file)
- Follow existing code structure, naming conventions, and architecture patterns

### Rule 3: Professional Engineering Mindset
- Act as a **curious engineer** - question assumptions, be skeptical, verify before implementing
- **Doubt** is healthy - raise concerns about design decisions
- Challenge requirements if something seems off

### Rule 4: File Maintenance Protocol
- **START of session**: Read this file completely
- **END of session**: Update with new architectural decisions, technology choices, patterns, TODOs, blockers, and lessons learned

### Rule 5: Session Start Protocol
After reading this file, present structured choices:
1. **Backend Service** → Show submenu: API Gateway, Auth, Users, Fiat, Crypto, Ledger, Analytics
2. **Frontend Client** → Show submenu: Web, Mobile, Desktop
3. **Infrastructure/DevOps** → Kubernetes, Terraform, scripts, CI/CD, GitOps
4. **Other** → Ask user to specify

### Rule 6: Match User's Code Style
- **ALWAYS** read existing code before writing new code to learn patterns and style
- Match the user's coding style exactly: naming conventions, file organization, error handling patterns, comment style, formatting
- When in doubt, find similar existing code and follow that pattern
- If user's approach seems incorrect, raise concerns but still follow their pattern unless given permission to change

---

## Project Vision & Purpose

**Cloud-native payment processing microservices platform** supporting:
- **Cryptocurrency payments** (Bitcoin, Ethereum, etc.)
- **Fiat payments** (Stripe, PayPal, bank transfers)
- **Multi-platform clients** (Web, Mobile, Desktop)
- **Enterprise-grade security** (mTLS, JWT, network policies)

**Core Business Capabilities:**
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
- **IaC**: Terraform (v1.5+), Kustomize (base + overlays)
- **Secrets**: HashiCorp Vault + External Secrets Operator
- **Database**: PostgreSQL via Supabase
- **Monitoring**: Prometheus + Grafana (planned)
- **Automation**: Ansible (planned)

---

## Architecture Patterns (ESTABLISHED)

### Communication Protocol Hierarchy

```
External (Client → API Gateway)
  ↓ HTTP/3 + TLS 1.3 (Let's Encrypt via cert-manager)

API Gateway → Auth Service
  ↓ HTTP (internal ClusterIP)

API Gateway → Other Services
  ↓ gRPC + mTLS (mutual TLS via internal CA)

Service → Service (if needed)
  ↓ gRPC + mTLS (mutual TLS via internal CA)

Service → Database
  ↓ PostgreSQL wire protocol + SSL/TLS
```

### Network Security Model
- **External Layer**: Only API Gateway accepts public traffic (NodePort)
- **Internal Layer**: All backend services use ClusterIP (not externally accessible)
- **Network Policies**: Backend services ONLY accept from API Gateway (planned)
- **Inbound/Outbound Control**: Kubernetes NetworkPolicies enforce restrictions (planned)
- **Service Communication**: Auth uses HTTP, all other services use gRPC + mTLS

### Auth Service Architecture Decision
**Why HTTP instead of gRPC for auth-service?**

Auth-service uses **Express.js + better-auth** over HTTP instead of gRPC because:

1. **better-auth is HTTP-native**: Built for HTTP request/response flows, OAuth redirects, session cookies
2. **OAuth flows require HTTP**: OAuth 2.0 providers (Google, GitHub) require HTTP redirect callbacks
3. **Email verification**: Uses HTTP callback URLs for email confirmation links
4. **Only API Gateway calls it**: No need for gRPC since only one consumer (API Gateway)
5. **Other services don't need it**: Backend services validate JWTs locally using public keys (JWKS)

**JWT Validation Pattern:**
- Auth-service: Issues JWTs via HTTP endpoints
- API Gateway: Calls auth-service (HTTP), adds JWT to gRPC metadata for backend services
- Backend Services: Validate JWTs locally without calling auth-service

This keeps better-auth's ecosystem benefits while maintaining secure internal communication.

### Authentication & Secrets
- **Auth Method**: JWT tokens with RS256 signing
- **Token Expiry**: 15 minutes (access), 7 days (session)
- **Key Rotation**: JWKS every 30 days
- **Secrets Storage**: Vault KV v2 at `secret/microservices`
- **Secret Sync**: External Secrets Operator (15s refresh in dev)

### Why These Choices?
- **Polyglot**: Rust for performance/safety critical parts, TypeScript for rapid dev with better-auth, Go for payment integrations
- **gRPC**: Type-safe contracts, better internal performance, streaming support, industry standard
- **Kubernetes**: Cloud-agnostic, service discovery, NetworkPolicies for security, auto-scaling
- **Vault + ESO**: Centralized secret management, automatic rotation, audit logging, GitOps-friendly

---

## Project Structure

```
microservices/
├── services/              # Backend microservices
│   ├── api-gateway/       # Rust (Axum 0.8.8 + Tokio)
│   ├── auth/              # TypeScript (Express 5 + better-auth 1.4.7)
│   ├── users/             # TypeScript (Express 5)
│   ├── fiat/              # Go (placeholder)
│   ├── crypto/            # Rust (placeholder)
│   ├── ledger/            # TBD (placeholder)
│   └── analytics/         # TBD (placeholder)
├── clients/
│   ├── web/               # Next.js (placeholder)
│   ├── mobile/            # Expo React Native (placeholder)
│   └── desktop/           # Tauri (planned)
├── manifests/
│   ├── base/              # Kubernetes base configs
│   └── overlays/          # dev, staging, prod
├── provision/             # Terraform IaC
├── scripts/               # Automation scripts
└── docs/                  # Documentation
```

---

## Current Implementation Status

### ✅ Fully Implemented
- API Gateway framework (Rust/Axum) - HTTP/2 support
- Auth Service framework (TypeScript/Express + better-auth)
- Users Service framework (TypeScript/Express)
- Kubernetes manifests (base + 3 overlays)
- Terraform infrastructure provisioning
- Vault dev mode + External Secrets Operator
- Secret syncing (Vault → K8s via ESO)
- Docker multi-stage builds
- Supabase PostgreSQL integration
- Test infrastructure (Vitest)

### 🚧 Partially Implemented
- API Gateway routes (stubs exist, no business logic)
- Auth endpoints (template structure, no real auth logic)
- gRPC scaffolding (marked as TODO in code)

### ❌ Not Yet Started
- gRPC client/server implementation
- mTLS certificate generation and setup
- cert-manager for Let's Encrypt
- Fiat Service (Go)
- Crypto Service (Rust)
- Ledger Service
- Analytics Service
- Client applications (web/mobile/desktop)
- Prometheus + Grafana
- Ansible automation
- CI/CD pipelines
- Database migrations
- Middleware (logging, rate limiting, CORS)

---

## Known Issues & Blockers

### Critical Blockers
1. **gRPC not implemented** - API Gateway can't communicate with gRPC-based backend services (Users, Fiat, Crypto, etc.)
2. **HTTP client needed in API Gateway** - Need to implement HTTP client for auth-service communication
3. **mTLS certificates not generated** - No internal service authentication for gRPC services
4. **Auth endpoints are stubs** - No real authentication happening
5. **No database migrations** - Schema changes not managed

### Development Issues
- Terraform can hang during ESO installation → Fix: `minikube stop && minikube start` with storage addons
- Vault connection requires port-forwarding → Use `./scripts/load-secrets.sh`

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
- Deployments/Services/ConfigMaps: `{service-name}` (e.g., `api-gateway`, `auth-service`)
- Secrets: `{purpose}-secrets` (e.g., `microservices-secrets`)

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

## Key Dependencies & Versions

### API Gateway (Rust)
- axum: 0.8.8 (http2)
- tokio: 1.0 (full)
- serde: 1.0 (derive)
- jsonwebtoken: 10.2.0
- bcrypt: 0.17.1

### Auth/Users Services (TypeScript)
- better-auth: ^1.4.7
- express: ^5.2.1
- jose: ^6.1.3
- @supabase/supabase-js: ^2.89.0
- pg: ^8.16.3
- vitest: ^4.0.16

### Infrastructure
- Vault Helm Chart: 0.31.0
- External Secrets Operator: 1.2.0
- Terraform: 1.5+
- Kubernetes: 1.28+

### Configuration Essentials
- **Namespaces**: vault, external-secrets, microservices-{dev|staging|prod}
- **API Gateway**: Axum 0.8.8, Port 3000→443, Routes: /auth/*, /users/*, /health
- **Auth Service**: Express 5, better-auth 1.4.7, Port 3001
- **Vault**: Dev mode (in-memory), Root token: `root`, KV v2 at `secret/microservices`
- **Secret Pattern**: secrets.json → `./scripts/load-secrets.sh` → Vault → ESO → K8s Secret

---

## Testing & Code Quality

### Testing Strategy
- **TypeScript**: Vitest framework
- **Test structure**: `source/**/*.test.ts` (unit), `tests/integration/`, `tests/e2e/`

### Code Quality
- **Rust**: rustfmt, clippy
- **TypeScript**: ESLint + Prettier
- **Go**: gofmt, golint (when implemented)
- **Commits**: Conventional Commits

---

## Session End Checklist

Before ending a session, ensure:
- [ ] This file is updated with new decisions
- [ ] New patterns are documented
- [ ] Technology choices are recorded
- [ ] Known issues are noted
- [ ] Dependencies/versions are updated

---

**End of Context File**

Remember: Read this FIRST, update this LAST, follow the rules ALWAYS.