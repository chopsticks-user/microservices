# Integration & E2E Tests

This folder contains integration and end-to-end tests for the auth service.

## Structure

- `integration/` - Integration tests that test multiple components together (e.g., controller + service + database)
- `e2e/` - End-to-end tests that test the full API flow with real dependencies

## Unit Tests

Unit tests are co-located with implementation files:
- `source/controllers/*.test.ts`
- `source/services/*.test.ts`
- `source/models/*.test.ts`

## Running Tests

```bash
# All tests (unit + integration + e2e)
npm test

# Unit tests only (co-located with source)
npm run test:unit

# Integration tests only (requires database)
npm run test:integration

# E2E tests only (requires full environment)
npm run test:e2e

# Watch mode for development
npm test                    # Auto-runs all tests on file changes
npm run test:unit -- --watch

# UI mode for debugging
npm run test:ui

# Coverage report
npm run test:coverage
```

## How Test Discovery Works

Vitest uses file path filtering:
- `npm run test:unit` → Runs tests in `source/**/*.test.ts`
- `npm run test:integration` → Runs tests in `tests/integration/**/*.test.ts`
- `npm run test:e2e` → Runs tests in `tests/e2e/**/*.test.ts`