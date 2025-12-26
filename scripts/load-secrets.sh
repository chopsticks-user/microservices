#!/bin/bash

set -e

SECRETS_FILE="${1:-secrets.json}"

echo "Loading secrets into Vault..."

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
  echo "Error: Secrets file '$SECRETS_FILE' not found"
  echo "Usage: $0 [path/to/secrets.json]"
  exit 1
fi

# Check if Vault pod is running
if ! kubectl get pod -n vault vault-0 &>/dev/null; then
  echo "Error: Vault pod is not running in the 'vault' namespace"
  echo "Please run 'terraform apply' in the provision directory first"
  exit 1
fi

# Kill any existing port-forward on 8200
pkill -f "port-forward.*vault.*8200" 2>/dev/null || true
sleep 1

# Start port-forward in background
echo "Starting port-forward to Vault..."
kubectl port-forward -n vault svc/vault 8200:8200 >/dev/null 2>&1 &
VAULT_PF_PID=$!

# Ensure port-forward is killed on script exit
trap "kill $VAULT_PF_PID 2>/dev/null || true" EXIT

# Wait for port-forward to be ready
echo "Waiting for port-forward to be ready..."
for i in {1..10}; do
  if curl -s http://localhost:8200/v1/sys/health >/dev/null 2>&1; then
    break
  fi
  if [ $i -eq 10 ]; then
    echo "Error: Port-forward failed to start"
    exit 1
  fi
  sleep 1
done

# Export environment variables
export VAULT_ADDR='http://localhost:8200'
export VAULT_TOKEN='root'

echo "✓ Connected to Vault"
echo ""

# Load secrets into Vault
echo "Loading secrets from $SECRETS_FILE..."
vault kv put secret/microservices @"$SECRETS_FILE"

echo ""
echo "✓ Secrets loaded successfully!"
echo ""
echo "Verify with:"
echo "  vault kv get secret/microservices"
echo ""

# Verify the secrets (optional)
echo "Current secrets in Vault:"
vault kv get secret/microservices

echo ""
echo "Cleaning up port-forward..."