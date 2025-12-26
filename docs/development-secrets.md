# Development Secrets Architecture

This document describes the secrets management setup for local development using HashiCorp Vault and External Secrets Operator (ESO).

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│ vault (namespace)                               │
│  - vault-0 pod (Vault server)                   │
│  - vault service (ClusterIP)                    │
│    URL: vault.vault.svc.cluster.local:8200      │
│                                                 │
│  Platform/infrastructure service shared         │
│  across all projects                            │
└─────────────────────────────────────────────────┘
           │
           │ (accessed via service URL)
           │
┌──────────▼──────────────────────────────────────┐
│ external-secrets (namespace)                    │
│  - External Secrets Operator                    │
│  - Infrastructure component that watches        │
│    all namespaces for ExternalSecret resources  │
└─────────────────────────────────────────────────┘
           │
           │ (creates secrets in)
           │
┌──────────▼──────────────────────────────────────┐
│ microservices-dev (namespace)                   │
│  - vault-root-token secret (for ESO auth)       │
│  - vault-backend SecretStore                    │
│  - microservices-secrets ExternalSecret         │
│  - api-gateway, auth-service pods               │
│                                                 │
│  Application namespace where secrets are        │
│  automatically synced from Vault                │
└─────────────────────────────────────────────────┘
```

## Components

### 1. Vault (Infrastructure)
- **Namespace**: `vault`
- **Purpose**: Centralized secret storage
- **Configuration**: Dev mode (NOT for production)
  - Root token: `root`
  - In-memory storage (ephemeral)
  - Auto-unsealed
- **Service**: `vault.vault.svc.cluster.local:8200`

### 2. External Secrets Operator
- **Namespace**: `external-secrets`
- **Purpose**: Syncs secrets from Vault to Kubernetes Secrets
- **How it works**: Watches ExternalSecret resources and creates/updates K8s Secrets

### 3. Application Secrets
- **Namespace**: `microservices-dev`
- **Components**:
  - `vault-root-token` - Secret containing Vault authentication token
  - `vault-backend` - SecretStore pointing to Vault instance
  - `microservices-secrets` - ExternalSecret that syncs from Vault

## Loading Secrets into Vault

### Load from JSON file

**One-command solution** - Load secrets from `secrets.json` into Vault:

```bash
./scripts/vault-load-secrets.sh
```

This script automatically:
1. Validates `secrets.json` exists
2. Starts port-forwarding to Vault
3. Loads secrets into Vault at `secret/microservices`
4. Displays the loaded secrets
5. Cleans up port-forward on exit

You can also specify a different secrets file:
```bash
./scripts/vault-load-secrets.sh path/to/other-secrets.json
```

Example `secrets.json` format:
```json
{
  "jwt_secret": "my-super-secret-jwt-key",
  "database_url": "postgresql://user:pass@localhost:5432/db",
  "api_key": "some-api-key"
}
```

### Load individual secrets

```bash
vault kv put secret/microservices \
  jwt_secret="your-secret-here" \
  database_url="postgresql://..." \
  api_key="api-key-here"
```

### Verify secrets

```bash
# Read all secrets
vault kv get secret/microservices

# Read in JSON format
vault kv get -format=json secret/microservices
```

## Viewing Secrets in Kubernetes

### Check ExternalSecret status

```bash
# List ExternalSecrets
kubectl get externalsecret -n microservices-dev

# Check detailed status
kubectl describe externalsecret microservices-secrets -n microservices-dev
```

### View synced Kubernetes Secrets

```bash
# List secrets
kubectl get secrets -n microservices-dev

# View secret (base64 encoded)
kubectl get secret microservices-secrets -n microservices-dev -o yaml

# Decode a specific key
kubectl get secret microservices-secrets -n microservices-dev \
  -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

## Multi-Project Support

Vault can be shared across multiple projects using different paths:

```bash
# Project 1: microservices
vault kv put secret/microservices jwt_secret="secret1"

# Project 2: another project
vault kv put secret/my_project api_key="secret2"

# Nested paths
vault kv put secret/team-a/project-x database_url="postgres://..."
```

Each project would have its own:
- Kubernetes namespace
- SecretStore resource (pointing to Vault)
- ExternalSecret resources (with different `key` paths)

## Troubleshooting

### ExternalSecret shows "SecretSyncedError"

1. Check if secret exists in Vault:
```bash
vault kv get secret/microservices
```

2. Check SecretStore is ready:
```bash
kubectl get secretstore -n microservices-dev
```

3. Check ESO operator logs:
```bash
kubectl logs -n external-secrets -l app.kubernetes.io/name=external-secrets
```

### Vault pod not running

```bash
kubectl get pods -n vault
kubectl logs -n vault vault-0
```

## Important Notes

**⚠️ WARNING**: This setup is for **LOCAL DEVELOPMENT ONLY**

- Vault runs in dev mode (in-memory storage)
- Root token is hardcoded as `root`
- No authentication/authorization policies
- Data is ephemeral (lost on pod restart)

For production, you need:
- Proper Vault initialization and unsealing
- Secure token management
- Vault policies for access control
- Persistent storage
- High availability setup
- TLS/encryption in transit