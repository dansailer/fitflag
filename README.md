# FitFlag - Fitness Tracking with Feature Flags

<p align="center">
  <img src="src/fitflag-frontend/public/flagfit.svg" alt="FitFlag Logo" width="200"/>
</p>

A demonstration application showcasing feature flag integration across multiple backend technologies using OpenFeature and flagd.

> **⚠️ Security Notice - Demo Only**  
> This application passes user roles from the frontend to backend APIs via query parameters for **demonstration purposes only**. In production applications, user roles and permissions should **never** be client-controlled. Instead:
> - User roles should be determined server-side from authenticated session tokens (JWT, OAuth, etc.)
> - Feature flag evaluation contexts should use verified user attributes from trusted sources
> - Client-provided data should always be validated and never trusted for authorization decisions
> 
> This demo intentionally simplifies authentication to focus on feature flag patterns and OpenFeature SDK integration.

## Features

### Frontend
- **User role selector** (user, beta-tester) - drives feature flag targeting
- **Gamification features** - badges, streaks (controlled by feature flags)
- **Real-time fitness tracking**:
  - Daily steps from Quarkus backend
  - Calories burned from Node.js backend
  - Algorithm badges showing which calculation method is active
  - Detailed metrics (stride, distance, intensity, burn rate)

### Quarkus Backend (Steps API)
- REST API endpoint: `GET /api/steps/daily`
- Three calculation algorithms controlled by feature flags:
  - **simple**: Basic step counting (5,000-10,000 steps)
  - **ml-powered**: ML-based with pattern detection and adjustments
- OpenFeature integration with flagd provider
- Feature flag: `step-calculation-algorithm`

### Node.js Backend (Calories API)
- REST API endpoint: `GET /api/calories/daily`
- Three calculation algorithms controlled by feature flags:
  - **simple**: Basic calorie calculation (5 cal/min)
  - **ml-powered**: ML-enhanced personalized calculation with burn rate optimization
- OpenFeature integration with flagd provider
- Feature flags:
  - `calorie-calculation-algorithm`: Controls calculation method

## Quick Start

### Prerequisites
- Docker or Podman
- Node.js 20+
- Java 17+ (for local Quarkus development)
- [just](https://github.com/casey/just) command runner

### Option 1: Docker Compose (Recommended)

Start the entire stack with one command:

```bash
just compose-up
```

This starts:
- **flagd** on ports 8013 (API) and 8016 (sync)
- **Quarkus backend** on port 8081
- **Node.js backend** on port 8082
- **Frontend** on port 8080

Access the application at: http://localhost:8080

Stop the stack:
```bash
just compose-down
```

### Option 2: Local Development

```bash
just flagd-start
just quarkus-dev
just nodejs-install  # First time only
just nodejs-dev
just frontend-install  # First time only
just frontend-dev
```

Frontend available at http://localhost:5173
Quarkus backend available at http://localhost:8081
NodeJS backend available at http://localhost:8082

## Feature Flags Explained

FitFlag uses [flagd](https://flagd.dev/) as the feature flag evaluation engine with [OpenFeature](https://openfeature.dev/) SDKs in each service. Feature flags are defined in YAML files and evaluated based on user context (role, userId).

### How Feature Flags Work

1. **Flag Definition**: Flags are defined in YAML files in `flagd/config/`
2. **Flag Evaluation**: Each service (frontend, Quarkus, Node.js) uses OpenFeature SDK to evaluate flags
3. **Context Targeting**: Flags use user context (role, userId) to determine which variant to return
4. **Real-time Updates**: flagd supports dynamic flag updates without service restarts

### Frontend Flags (`flagd/config/gui.yaml`)

**`gamification-enabled`** (Boolean)
- **Purpose**: Controls visibility of gamification features (badges, streaks)
- **Variants**: `true` (enabled), `false` (disabled)
- **Targeting**:
  - `admin`, `beta-tester` → enabled
  - `user` → disabled
- **Used in**: `Dashboard.tsx`, `AchievementBadges.tsx`, `StreakCounter.tsx`
- **Evaluation**: Client-side via OpenFeature Web SDK with flagd Web Provider

### Quarkus Backend Flags (`flagd/config/backend.yaml`)

**`step-calculation-algorithm`** (String)
- **Purpose**: Selects which algorithm calculates daily steps
- **Variants**:
  - `simple` - Basic step counting (5,000-10,000 steps, 0.04 cal/step)
  - `enhanced` - Includes stride length, distance, intensity factors
  - `ml-powered` - ML-based with pattern detection and ±10% adjustment
- **Targeting**:
  - `admin`, `beta-tester` → ml-powered
  - `user` → simple
- **Used in**: `StepsResource.java`, `StepsService.java`
- **Evaluation**: Server-side via OpenFeature Java SDK with flagd Provider

### Node.js Backend Flags (`flagd/config/nodejs.yaml`)

**`calorie-calculation-algorithm`** (String)
- **Purpose**: Selects which algorithm calculates calories burned
- **Variants**:
  - `simple` - Basic calculation (5 cal/min)
  - `enhanced` - Factors in intensity level and activity type multipliers
  - `ml-powered` - ML-enhanced with personalized burn rate (4-10+ cal/min)
- **Targeting**:
  - `admin`, `beta-tester` → ml-powered
  - `user` → simple
- **Used in**: `src/index.ts`, `CaloriesService.ts`
- **Evaluation**: Server-side via OpenFeature Node.js SDK with flagd Provider

## Testing Feature Flags

### 1. Using the UI

1. Open the application:
   - Docker: http://localhost:8080
   - Local dev: http://localhost:5173
2. Use the **user role selector** in the top-right to switch roles:
   - **user**: Simple algorithms, no gamification
   - **beta-tester**: ML-powered algorithms, gamification enabled

### 2. Observing Flag Evaluation

Open browser DevTools console to see real-time flag evaluation:

```
[flagd] Evaluating gamification-enabled with context: {role: "beta-tester", userId: "user123"}
[flagd] gamification-enabled: true
[Quarkus Backend] Step algorithm: ml-powered
[Quarkus Backend] Step details: {averageStride: 0.85, distanceKm: 6.5, intensity: "high"}
[Node.js Backend] Calorie algorithm: ml-powered
[Node.js Backend] Calorie details: {intensityLevel: "high", burnRate: 8.3, activityType: "running"}
```

### 4. Modifying Flags

Edit flag configurations in `flagd/config/*.yaml` and flagd will automatically reload them. For example, to give all users ML algorithms:

```yaml
# flagd/config/backend.yaml
targeting:
  if:
    - in:
        - var: role
        - ["admin", "beta-tester", "user"]  # Add "user" here
    - ml-powered
```

## Available Commands

```bash
# Docker Compose
just compose-up       # Start entire stack with docker-compose
just compose-down     # Stop and remove containers

# flagd
just flagd-start      # Start flagd container
just flagd-stop       # Stop flagd
just flagd-restart    # Restart flagd
just flagd-logs       # View flagd logs

# Frontend
just frontend-install # Install dependencies
just frontend-update  # Update dependencies
just frontend-dev     # Start dev server
just frontend-build   # Build for production
just frontend-preview # Preview production build
just frontend-lint    # Lint code
just frontend-docker-build # Build Docker image

# Quarkus Backend
just quarkus-dev      # Run in dev mode (hot reload)
just quarkus-build    # Build for production
just quarkus-run      # Run production build
just quarkus-clean    # Clean build artifacts
just quarkus-test     # Run tests
just quarkus-update   # Check for dependency updates
just quarkus-docker-build # Build Docker image

# Node.js Backend
just nodejs-install   # Install dependencies
just nodejs-update    # Update dependencies
just nodejs-dev       # Start dev server
just nodejs-build     # Build TypeScript
just nodejs-start     # Start production server
just nodejs-watch     # Start with auto-reload
just nodejs-docker-build # Build Docker image

# Update All
just update-all       # Update all project dependencies
```

## Project Structure

```
fitflag/
├── flagd/
│   └── config/
│       ├── gui.yaml      # Frontend feature flags (gamification)
│       ├── backend.yaml  # Quarkus backend flags (steps algorithm)
│       └── nodejs.yaml   # Node.js backend flags (calories algorithm, beta access)
├── src/
│   ├── fitflag-frontend/ # React + TypeScript frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx         # Main dashboard with steps & calories
│   │   │   │   ├── UserRoleSelector.tsx  # Role switcher for testing
│   │   │   │   ├── AchievementBadges.tsx # Gamification (flag-gated)
│   │   │   │   └── StreakCounter.tsx     # Gamification (flag-gated)
│   │   │   ├── services/
│   │   │   │   ├── api.ts               # Backend API calls
│   │   │   │   └── featureFlags.ts      # OpenFeature client setup
│   │   │   └── contexts/
│   │   │       └── ThemeContext.tsx     # Dark/light mode
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── fitflag-quarkus/  # Quarkus (Java) backend
│   │   ├── src/main/java/com/fitflag/
│   │   │   ├── config/
│   │   │   │   └── OpenFeatureConfig.java    # flagd provider setup
│   │   │   ├── resource/
│   │   │   │   └── StepsResource.java        # REST endpoint
│   │   │   ├── service/
│   │   │   │   └── StepsService.java         # Algorithm implementations
│   │   │   └── model/
│   │   │       └── DailySteps.java           # Data model
│   │   ├── Dockerfile
│   │   └── pom.xml
│   └── fitflag-nodejs/   # Node.js (TypeScript) backend
│       ├── src/
│       │   ├── index.ts                  # Express server + OpenFeature
│       │   ├── services/
│       │   │   └── CaloriesService.ts    # Algorithm implementations
│       │   └── models/
│       │       └── DailyCalories.ts      # Data model
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml    # Multi-container orchestration
└── justfile              # Build commands
```

## API Endpoints

### Quarkus Backend (Steps)
- **Base URL**: http://localhost:8081 (Docker) or http://localhost:8081 (local)
- **GET** `/api/steps/daily?userId={userId}&role={role}` - Get daily steps
- **GET** `/api/steps/health` - Health check
- **Swagger UI**: http://localhost:8081/swagger-ui
- **OpenAPI spec**: http://localhost:8081/openapi

### Node.js Backend (Calories)
- **Base URL**: http://localhost:8082
- **GET** `/api/calories/daily?userId={userId}&role={role}` - Get calories burned
- **GET** `/api/calories/health` - Health check
- **GET** `/health` - Alternative health check

### flagd
- **Base URL**: http://localhost:8013
- **OFREP API**: Port 8013
- **gRPC Sync**: Port 8016

## Technology Stack

### Feature Flags
- **[flagd](https://flagd.dev/)** - Feature flag evaluation engine
- **[OpenFeature](https://openfeature.dev/)** - Vendor-agnostic feature flag SDKs
  - Java SDK (Quarkus)
  - Node.js SDK (Express)
  - Web SDK (React)

### Frontend
- **[React](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[TanStack Query](https://tanstack.com/query)** - Data fetching
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations

### Backend - Quarkus
- **[Quarkus](https://quarkus.io/)** - Java framework
- **[Jakarta REST](https://eclipse-ee4j.github.io/jersey/)** - REST API
- **[Maven](https://maven.apache.org/)** - Build tool

### Backend - Node.js
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Express](https://expressjs.com/)** - Web framework
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin support

### DevOps
- **[Docker](https://www.docker.com/)** / **[Podman](https://podman.io/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[just](https://github.com/casey/just)** - Command runner

## Learn More

- [OpenFeature Specification](https://openfeature.dev/specification/)
- [flagd Documentation](https://flagd.dev/docs/)
- [OpenFeature Java SDK](https://openfeature.dev/docs/reference/technologies/server/java/)
- [OpenFeature Node.js SDK](https://openfeature.dev/docs/reference/technologies/server/javascript/)
- [OpenFeature Web SDK](https://openfeature.dev/docs/reference/technologies/client/web/)

## License

MIT