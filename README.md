# FitFlag - Fitness Tracking with Feature Flags

A demonstration application showcasing feature flag integration across multiple backend technologies using OpenFeature and flagd.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backends**:
  - **Quarkus** (Java): Daily steps API with algorithm selection via feature flags
  - _(More backends coming soon: Go, Node.js)_
- **Feature Flags**: flagd with OpenFeature SDK

## Features

### Frontend
- User role selector (user, beta-tester, admin)
- Theme toggle (light/dark mode)
- Gamification features (conditional on feature flags)
- Daily steps and calorie tracking

### Quarkus Backend
- REST API for daily steps tracking
- Three calculation algorithms controlled by feature flags:
  - **simple**: Basic step counting (default for guests)
  - **enhanced**: Improved with stride and intensity (regular users)
  - **ml-powered**: ML-based with anomaly detection (premium users)

## Quick Start

### Prerequisites
- Docker or Podman
- Node.js 18+
- Java 17+ (for Quarkus backend)

### 1. Start flagd
```bash
just flagd-start
```

### 2. Start Quarkus Backend
```bash
just quarkus-dev
```

The backend will be available at http://localhost:8080

### 3. Start Frontend
```bash
just frontend-install  # First time only
just frontend-dev
```

The frontend will be available at http://localhost:5173

## Feature Flags

### Frontend Flags (`flagd/config/gui.yaml`)
- `gamification-enabled`: Shows/hides gamification features (badges, streaks)

### Backend Flags (`flagd/config/backend.yaml`)
- `step-calculation-algorithm`: Controls which algorithm calculates daily steps
  - Variants: `simple`, `enhanced`, `ml-powered`
  - Targeting: Based on user role

## Testing Feature Flags

1. Open the application at http://localhost:5173
2. Use the user role selector to switch between roles:
   - **User**: Gets enhanced algorithm
   - **Beta Tester**: Gets ml-powered algorithm + gamification
   - **Admin**: Gets ml-powered algorithm + gamification

Watch the browser console to see which feature flags are being evaluated and which algorithm is used.

## Available Commands

```bash
# flagd
just flagd-start      # Start flagd container
just flagd-stop       # Stop flagd
just flagd-restart    # Restart flagd
just flagd-logs       # View flagd logs

# Quarkus Backend
just quarkus-dev      # Run in dev mode (hot reload)
just quarkus-build    # Build for production
just quarkus-run      # Run production build
just quarkus-clean    # Clean build artifacts
just quarkus-test     # Run tests

# Frontend
just frontend-install # Install dependencies
just frontend-dev     # Start dev server
just frontend-build   # Build for production
just frontend-preview # Preview production build
just frontend-lint    # Lint code
```

## Project Structure

```
fitflag/
├── flagd/
│   └── config/
│       ├── gui.yaml      # Frontend feature flags
│       ├── steps.yaml    # Legacy flags
│       └── backend.yaml  # Backend feature flags
├── src/
│   ├── fitflag-frontend/ # React frontend
│   └── fitflag-quarkus/  # Quarkus backend
└── justfile              # Build commands
```

## API Documentation

When the Quarkus backend is running, you can access:
- Swagger UI: http://localhost:8080/swagger-ui
- OpenAPI spec: http://localhost:8080/openapi

## Learn More

- [OpenFeature](https://openfeature.dev/) - Vendor-agnostic feature flag SDK
- [flagd](https://flagd.dev/) - Feature flag daemon
- [Quarkus](https://quarkus.io/) - Supersonic Subatomic Java
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling