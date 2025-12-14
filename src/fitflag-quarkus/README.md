# FitFlag Quarkus Backend

A Quarkus-based backend service for the FitFlag fitness tracking application, demonstrating feature flag integration with flagd using OpenFeature.

## Features

- **Daily Steps API**: REST endpoint for retrieving daily step counts
- **Feature Flag Integration**: Uses OpenFeature with flagd provider
- **Multiple Calculation Algorithms**: 
  - `simple`: Basic step counting
  - `enhanced`: Factors in stride length and intensity
  - `ml-powered`: ML-based calculations with anomaly detection (premium feature)

## Feature Flag: `step-calculation-algorithm`

This backend demonstrates a practical use case for feature flags in backend services. The `step-calculation-algorithm` flag controls which calculation method is used for step tracking:

### Variants
- **simple** (default): Basic step calculation for regular users
- **enhanced**: Improved algorithm for authenticated users
- **ml-powered**: Advanced ML-based algorithm for premium users (admin/beta-tester roles)

### Use Cases
- **A/B Testing**: Compare different algorithms to see which provides better user engagement
- **Gradual Rollout**: Deploy new algorithms to a subset of users first
- **Tier-Based Features**: Provide premium features to paying customers
- **Performance Testing**: Switch algorithms based on system load

## Prerequisites

- Java 17 or later
- Maven 3.8+ (or use the included Maven wrapper)
- flagd running on localhost:8013

## Running the Application

### Development Mode (with live reload)
```bash
just quarkus-dev
# or
./mvnw quarkus:dev
```

The application will start on http://localhost:8080

### Production Mode
```bash
just quarkus-build
just quarkus-run
# or
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

## API Endpoints

### Get Daily Steps
```bash
GET /api/steps/daily?userId=user123&role=user
```

Query Parameters:
- `userId` (optional): User identifier for feature flag context (default: "user123")
- `role` (optional): User role - `user`, `admin`, or `beta-tester` (default: "user")

Response:
```json
{
  "steps": 7543,
  "calories": 339,
  "algorithm": "enhanced",
  "details": {
    "averageStride": 0.83,
    "distanceKm": 6.26,
    "intensity": "moderate"
  }
}
```

### Health Check
```bash
GET /api/steps/health
```

### OpenAPI/Swagger UI
- OpenAPI spec: http://localhost:8080/openapi
- Swagger UI: http://localhost:8080/swagger-ui

## Testing Different Algorithms

Test with different user roles to see different algorithms in action:

```bash
# Simple algorithm (guest user)
curl "http://localhost:8080/api/steps/daily?role=guest"

# Enhanced algorithm (regular user)
curl "http://localhost:8080/api/steps/daily?role=user"

# ML-powered algorithm (premium user)
curl "http://localhost:8080/api/steps/daily?role=admin"
```

## Configuration

Edit `src/main/resources/application.properties` to configure:
- HTTP port and CORS settings
- flagd connection (host, port, TLS)
- Logging levels
- OpenAPI/Swagger UI settings

## Feature Flag Configuration

The feature flag is defined in `/flagd/config/backend.yaml`:

```yaml
flags:
  step-calculation-algorithm:
    state: ENABLED
    variants:
      simple: "simple"
      enhanced: "enhanced"
      ml-powered: "ml-powered"
    defaultVariant: simple
    targeting:
      # Premium users get ML-powered
      # Regular users get enhanced
      # Others get simple
```

## Integration with Frontend

The frontend automatically fetches steps from this backend when running. The user role selector in the UI determines which algorithm variant is used.

## Architecture

- **StepsResource**: REST API endpoints
- **StepsService**: Business logic for different calculation algorithms
- **OpenFeatureConfig**: Configures OpenFeature with flagd provider on startup
- **DailySteps**: Data model for API responses

## Learn More

- [Quarkus](https://quarkus.io/)
- [OpenFeature](https://openfeature.dev/)
- [flagd](https://flagd.dev/)
