# FitFlag Node.js Backend

Node.js backend service for FitFlag fitness tracking application. Provides calorie tracking API with OpenFeature flag support.

## Features

- RESTful API for daily calories tracking
- OpenFeature integration with flagd provider
- Multiple calculation algorithms (simple, enhanced, ml-powered)
- Feature flag-driven algorithm selection
- TypeScript for type safety
- Docker support

## API Endpoints

### Get Daily Calories
```
GET /api/calories/daily?userId=user123&role=user
```

Query Parameters:
- `userId` (optional): User identifier for feature flag context (default: "user123")
- `role` (optional): User role for targeting (default: "user")

Response:
```json
{
  "calories": 450,
  "activityMinutes": 60,
  "algorithm": "enhanced",
  "details": {
    "intensityLevel": "moderate",
    "burnRate": 6.5,
    "activityType": "running"
  }
}
```

### Health Check
```
GET /health
GET /api/calories/health
```

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Run Production
```bash
npm start
```

## Docker

### Build Image
```bash
docker build -t fitflag-nodejs .
```

### Run Container
```bash
docker run -p 8082:8082 \
  -e FLAGD_HOST=localhost \
  -e FLAGD_PORT=8013 \
  fitflag-nodejs
```

## Environment Variables

- `PORT` - Server port (default: 8082)
- `FLAGD_HOST` - Flagd server host (default: localhost)
- `FLAGD_PORT` - Flagd server port (default: 8013)

## Feature Flags

The service uses the `calorie-calculation-algorithm` feature flag to determine which algorithm to use:

- `simple` - Basic calorie calculation (5 cal/min)
- `enhanced` - Intensity and activity type based calculation
- `ml-powered` - ML-enhanced personalized calculation

See `flagd/config/nodejs.yaml` for flag configuration.
