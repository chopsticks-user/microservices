# API Gateway - Project Summary

## High-Level Overview

This is a Rust-based API Gateway microservice using **Axum** web framework and **Tokio** async runtime. Currently at v0.1.0, it provides a foundational HTTP/3-enabled server structure with authentication and user management route stubs. The project is in early development with framework boilerplate established but business logic yet to be implemented.

**Server**: Binds to `0.0.0.0:3000` | **Edition**: Rust 2024

### Microservices Architecture Context

This API Gateway serves as the **REST-to-gRPC translation layer** in a microservices architecture:

- **Client-Facing**: Exposes RESTful HTTP endpoints for mobile and web clients
- **Backend Communication**: Forwards requests as gRPC calls to downstream microservices
- **Deployment**: Terraform + Kubernetes infrastructure
- **Service Mesh**: API Gateway is itself a service within the microservices ecosystem

**Architecture Flow**:
```
Mobile/Web Clients → REST/HTTP/3 → API Gateway → gRPC → Microservices (Auth, Users, etc.)
                                        ↓
                                  Deployed on K8s
                                  (Terraform IaC)
```

## Folder Structure

```
/home/frost/dev/microservices/services/api-gateway/
├── src/
│   ├── main.rs              # Entry point, server initialization
│   ├── routes/
│   │   ├── mod.rs           # Central router builder
│   │   ├── auth.rs          # Authentication endpoints (42 lines)
│   │   └── users.rs         # User management endpoints (11 lines)
│   └── middlewares/
│       └── .gitkeep         # Placeholder for future middleware
├── Cargo.toml               # Dependencies and project config
└── Cargo.lock               # Dependency lock file
```

**Total**: 88 lines of Rust code across 4 source files

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axum** | 0.8.8 | HTTP web framework with HTTP/3 support |
| **Tokio** | 1.48.0 | Async runtime (full features) |
| **Serde** | 1.0.228 | JSON serialization/deserialization |
| **Hyper** | 1.8.1 | Underlying HTTP protocol handler |
| **Tower** | 0.5.2 | Service composition & middleware |
| **gRPC** (planned) | TBD | Backend service communication |

## Architecture

**Pattern**: Modular Router Composition with Layered Architecture

- **Entry Point** (`main.rs`): Initializes Tokio runtime, creates router, binds TCP listener
- **Router Hub** (`routes/mod.rs`): Composes all sub-routers using `.nest()`
- **Route Modules**: Each domain (auth, users) has dedicated file with `router()` function
- **Async-First**: All handlers are `async fn` leveraging Tokio runtime
- **Type-Safe**: Compile-time route validation via Axum's router builder

**Request Flow**:
```
Client → HTTP/3 (QUIC) → Axum Router → Handler → gRPC Client → Backend Services
                                              ↓
                                         JSON Response
```

## Main Modules and Endpoints

### Root (`main.rs`)
- `main()` - Server initialization and routing setup
- `GET /` - Returns HTTP version detection

### Authentication (`routes/auth.rs`)
All endpoints are POST and currently return stub responses:
- `/auth/login` - Accepts `{email, password}` JSON
- `/auth/logout`
- `/auth/signup`
- `/auth/refresh` - Token refresh endpoint
- `/auth/reset-password`
- `/auth/forgot-password`

**Data Types**:
- `LoginData` - Struct with email and password fields (password commented out)

### Users (`routes/users.rs`)
- `POST /users/{id}` - Path parameter extraction demo

### GraphQL (Reserved)
- `/graphql` - Empty route reserved for future implementation

## Coding Conventions

### Naming
- **Functions**: `snake_case` (e.g., `reset_password()`, `users_id()`)
- **Modules**: `snake_case` (e.g., `routes`, `middlewares`)
- **Structs**: `PascalCase` (e.g., `LoginData`)
- **Constants**: `SCREAMING_SNAKE_CASE`

### Patterns
1. **Module-Per-Route**: Separate files for route groups (`auth.rs`, `users.rs`)
2. **Router Function Pattern**: Each module exports `router()` returning `Router`
3. **Handler Isolation**: Dedicated async function per endpoint
4. **Derive Macros**: Heavy use of `#[derive(Deserialize, Serialize, Debug)]`
5. **Extractors**: Axum's `Json<T>`, `Path<T>`, `Request` for dependency injection

### Code Style
- Async/await syntax throughout
- Error handling with Result types (not yet implemented in handlers)
- Type safety enforced via compile-time checks
- Zero-copy operations where possible

## Important Quirks and Notes

### Recent Changes (Uncommitted)
1. **HTTP/2 Enabled**: Added `features = ["http2"]` to Axum dependency
2. **Version Endpoint**: New `/` handler that detects HTTP protocol version
3. **Login Handler Enhanced**: Now deserializes JSON body and returns email field

### Current State
- **All handlers are stubs** - Return placeholder responses, no real business logic
- **No authentication implementation** - Framework only
- **No database connections** - Not yet integrated
- **No error handling middleware** - Basic HTTP status codes only
- **Middleware directory empty** - Reserved for future implementation

### Project Maturity
- **Early-stage** (v0.1.0) - Framework skeleton established
- **Production-ready foundation** - Modern async stack with HTTP/2
- **Awaiting implementation** - Business logic, database, middleware, error handling

### Security Architecture

#### Two-Tier Certificate Strategy

**External Layer (Client → Gateway)**:
- **Protocol**: HTTP/3 over QUIC
- **TLS**: Let's Encrypt certificates (public CA)
- **Termination**: Kubernetes Ingress Controller (nginx/Caddy)
- **Purpose**: Encrypt internet traffic, public-facing TLS

**Internal Layer (Gateway → Services)**:
- **Protocol**: gRPC with mutual TLS (mTLS)
- **Certificates**: Internal CA (self-managed)
- **Purpose**: Authentication & authorization enforcement
- **Security Model**: Services trust ONLY the API Gateway, no auth logic in services

```
Internet Clients                    Kubernetes Cluster
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mobile/Web
    ↓
  HTTP/3 + TLS
(Let's Encrypt)          ┌─────────────────────────────────┐
    ↓                    │  Ingress Controller             │
Ingress ─────────────────│  - Terminates HTTP/3            │
(port 443 UDP/TCP)       │  - cert-manager integration     │
    ↓                    │  - Auto cert renewal            │
  HTTP/2                 └─────────────────────────────────┘
    ↓                                   ↓
┌────────────────┐              ┌──────────────────┐
│ API Gateway    │   mTLS       │  Auth Service    │
│                │─────────────→│                  │
│ - Has client   │   gRPC       │ - Validates cert │
│   certificate  │              │ - Trusts CA only │
│ - Handles auth │              │ - NO auth logic  │
└────────────────┘              └──────────────────┘
         │
         │ mTLS/gRPC          ┌──────────────────┐
         └───────────────────→│  User Service    │
                              │ - Validates cert │
                              │ - Trusts CA only │
                              └────────────────────┘
```

#### Certificate Setup (To Be Implemented)

**1. External Certificates (cert-manager + Let's Encrypt)**:
- Install cert-manager in K8s cluster
- Create ClusterIssuer for Let's Encrypt ACME
- Ingress automatically provisions & renews certificates
- Zero manual certificate management

**2. Internal CA & mTLS Certificates**:
- Create internal root CA (one-time setup)
- Issue client certificate for API Gateway
- Distribute CA certificate to all services
- Services configured to:
  - Require client certificates
  - Validate against internal CA
  - Reject requests without valid gateway certificate

**3. Rust Code Requirements**:
- API Gateway: Configure gRPC client with client certificate & CA cert
- Services: Configure gRPC server to require & validate client certificates
- Mount certificates from Kubernetes secrets to pods

### Technical Debt / Future Work
- [ ] **HTTP/3 Setup** - Configure K8s Ingress with HTTP/3 annotations (infrastructure-level, no code changes)
- [ ] **cert-manager Installation** - Set up Let's Encrypt for external TLS
- [ ] **Internal CA Creation** - Generate root CA for service-to-service mTLS
- [ ] **mTLS Implementation** - Configure gRPC client/server with certificate validation
- [ ] **Implement gRPC client integration** for backend service communication
- [ ] Generate/integrate Protobuf schemas for microservices
- [ ] Implement middleware layer (auth, logging, rate limiting, CORS)
- [ ] Add database integration for auth operations
- [ ] Implement error handling and validation
- [ ] Add request/response logging and distributed tracing
- [ ] Implement GraphQL endpoint
- [ ] REST-to-gRPC translation logic in handlers
- [ ] Implement actual authentication logic with JWT/sessions
- [ ] Kubernetes deployment manifests (Deployment, Service, Ingress)
- [ ] Terraform infrastructure as code

## Quick Start

```bash
# Build and run
cargo build
cargo run

# Server starts on http://0.0.0.0:3000
# Test: curl http://localhost:3000/
```

## Key Files to Know

- **src/main.rs:21** - Server entry point and root route
- **src/routes/mod.rs:14** - Central router composition
- **src/routes/auth.rs:42** - Authentication route handlers
- **Cargo.toml** - Dependencies and feature flags