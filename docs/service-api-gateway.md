# API Gateway - Feature Requirements

> Context: Rust/Axum-based API Gateway for payment processing microservices platform

**Last Updated**: December 26, 2025

---

## Priority 1: Critical Security & Core Functionality

### 1. Authorization (JWT Verification)
- **JWT Token Validation**: Verify RS256 signatures, expiration, and issuer from Auth Service tokens
- **Claims Extraction**: Extract user ID, roles, scopes from validated tokens
- **Permission Checks**: Verify token scopes/roles match required permissions for routes
- **Token Forwarding**: Pass validated tokens to backend services in headers
- **mTLS**: Mutual TLS for internal service-to-service communication
- **Note**: Authentication (credential verification, token issuance) is handled by Auth Service
- **Rationale**: Gateway enforces authorization policy; prevent unauthorized access to resources

### 2. Request Routing & Load Balancing
- **Path-based Routing**: Route requests to backend services (/auth/*, /users/*, /fiat/*, /crypto/*)
- **Service Discovery**: Dynamic routing to available service instances
- **Load Distribution**: Balance requests across multiple backend replicas
- **Health Checks**: Route only to healthy service instances
- **Rationale**: Core gateway function; ensures reliability and scalability

### 3. Rate Limiting & Throttling
- **Per-Client Limits**: Configurable rate limits by API key/token
- **Global Throttling**: Prevent DDoS and system overload
- **Sliding Window**: Accurate rate limit tracking
- **429 Responses**: Proper rate limit exceeded handling
- **Rationale**: Critical for payment APIs; prevent abuse and ensure fair resource allocation

### 4. SSL/TLS Termination
- **TLS 1.3**: Modern encryption for external clients
- **Certificate Management**: Integration with cert-manager (Let's Encrypt)
- **HTTPS Enforcement**: Redirect HTTP to HTTPS
- **Rationale**: Baseline security for payment data in transit

### 5. Protocol Translation
- **HTTP to gRPC**: Translate REST requests to internal gRPC calls
- **gRPC to HTTP**: Convert gRPC responses back to JSON
- **Error Mapping**: Map gRPC status codes to HTTP status codes
- **Rationale**: Architecture requires HTTP/REST externally, gRPC internally

---

## Priority 2: Production Essentials

### 6. Request/Response Transformation
- **Header Manipulation**: Add/remove/modify headers (correlation IDs, auth context)
- **Body Transformation**: Format conversion if needed (JSON ↔ Protobuf)
- **Request Validation**: Schema validation before forwarding

### 7. Circuit Breaker Pattern
- **Failure Detection**: Detect when backend service is unhealthy
- **Open Circuit**: Stop forwarding requests to failing services
- **Half-Open State**: Periodically test if service recovered
- **Fallback Responses**: Return meaningful errors during outages

### 8. Monitoring & Observability
- **Access Logging**: Request/response logs with correlation IDs
- **Metrics Collection**: Request count, latency, error rates (Prometheus format)
- **Distributed Tracing**: Integration with OpenTelemetry/Jaeger
- **Health Endpoint**: Gateway health status (/health)

### 9. Input Validation & Sanitization
- **Request Size Limits**: Prevent large payload attacks
- **Content-Type Validation**: Ensure proper content types
- **SQL Injection Prevention**: Sanitize query parameters
- **XSS Prevention**: Sanitize headers and inputs

### 10. Error Handling
- **Centralized Error Format**: Consistent error responses across all services
- **Error Logging**: Log errors with context for debugging
- **Client-Friendly Messages**: Don't leak internal details
- **HTTP Status Codes**: Proper 4xx/5xx usage

---

## Priority 3: Performance & Advanced Features

### 11. Response Caching
- **Cache-Control Headers**: Respect client/backend cache directives
- **In-Memory Cache**: Cache frequent read-only responses
- **Cache Invalidation**: Invalidate on data mutations
- **TTL Configuration**: Per-route cache duration

### 12. Request Aggregation (Backend for Frontend)
- **Multi-Service Queries**: Aggregate data from multiple backends in single request
- **Parallel Execution**: Execute backend calls concurrently
- **Partial Failure Handling**: Return partial data on some failures

### 13. Service Mesh Integration
- **Istio/Linkerd**: Integration with service mesh for advanced traffic management
- **mTLS Delegation**: Leverage mesh for mutual TLS

### 14. WAF Integration
- **OWASP Top 10 Protection**: Block common web attacks
- **IP Whitelisting/Blacklisting**: Geography-based access control
- **Bot Detection**: Identify and block malicious bots

---

## Implementation Status

**Current State**:
- ✅ HTTP/2 support enabled (Axum 0.8.8)
- ✅ Basic routing stubs (/auth/*, /users/*, /health)
- ❌ No authorization (JWT verification)
- ❌ No gRPC translation
- ❌ No rate limiting
- ❌ No mTLS
- ❌ No error handling
- ❌ No monitoring/metrics

**Critical Path**:
1. Implement JWT verification & authorization (Priority 1.1)
2. Add gRPC client support (Priority 1.5)
3. Implement rate limiting (Priority 1.3)
4. Add mTLS for backend communication (Priority 1.1)
5. Implement circuit breaker (Priority 2.7)
6. Add monitoring/metrics (Priority 2.8)

---

## Architecture Decisions

### Why Axum?
- High-performance async runtime (Tokio)
- Type-safe routing and middleware
- Low-level control for custom protocols (gRPC)
- Memory safety for public-facing service

### Security Model
- **External → Gateway**: TLS 1.3 (HTTPS)
- **Gateway → Services**: mTLS + gRPC
- **Auth Flow**: JWT tokens validated at gateway, passed to services
- **No Service Bypass**: NetworkPolicies enforce gateway-only access

### Performance Targets
- p95 latency: <50ms (excluding backend time)
- Throughput: 10,000 req/s (single instance)
- Memory: <200MB base, +1MB per 1000 concurrent connections

---

## References

- [API Gateway Security Best Practices 2025](https://www.practical-devsecops.com/api-gateway-security-best-practices/)
- [Core API Gateway Features - API7.ai](https://api7.ai/learning-center/api-gateway-guide/core-api-gateway-features)
- [Microservices API Gateway Pattern](https://microservices.io/patterns/apigateway.html)
- [Azure API Gateway Design](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway)
- [API Gateway Security - Solo.io](https://www.solo.io/topics/api-gateway/api-gateway-security)
- [6 Must-Have Features of an API Gateway - Zuplo](https://zuplo.com/blog/2025/01/22/top-api-gateway-features)

---

**Next Steps**: Prioritize implementing features in order, starting with JWT validation and gRPC translation.