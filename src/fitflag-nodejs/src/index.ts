import express, { Request, Response } from 'express';
import cors from 'cors';
import { OpenFeature } from '@openfeature/server-sdk';
import { FlagdProvider } from '@openfeature/flagd-provider';
import { CaloriesService } from './services/CaloriesService';

const app = express();
const PORT = process.env.PORT || 8082;

// CORS configuration
app.use(cors());
app.use(express.json());

// Initialize OpenFeature with flagd provider
const flagdHost = process.env.FLAGD_HOST || 'localhost';
const flagdPort = parseInt(process.env.FLAGD_PORT || '8013', 10);

console.log(`Initializing OpenFeature with flagd at ${flagdHost}:${flagdPort}`);

const provider = new FlagdProvider({
  host: flagdHost,
  port: flagdPort,
  tls: false
});

OpenFeature.setProvider(provider);
const client = OpenFeature.getClient();

// Initialize services
const caloriesService = new CaloriesService();

/**
 * GET /api/calories/daily
 * Returns daily calories burned based on feature flag algorithm
 */
app.get('/api/calories/daily', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'user123';
    const role = (req.query.role as string) || 'user';

    console.log(`Fetching daily calories for user: ${userId} with role: ${role}`);

    // Create OpenFeature evaluation context
    const context = {
      targetingKey: userId,
      userId,
      role
    };

    // Evaluate feature flag
    const algorithm = await client.getStringValue(
      'calorie-calculation-algorithm',
      'simple',
      context
    );

    console.log(`Using algorithm: ${algorithm} for user ${userId}`);

    // Calculate calories based on algorithm
    let result;
    switch (algorithm) {
      case 'enhanced':
        result = caloriesService.calculateWithEnhancedAlgorithm();
        break;
      case 'ml-powered':
        result = caloriesService.calculateWithMLAlgorithm();
        break;
      default:
        result = caloriesService.calculateWithSimpleAlgorithm();
    }

    res.json(result);
  } catch (error) {
    console.error('Error calculating calories:', error);
    res.status(500).json({ error: 'Failed to calculate calories' });
  }
});

/**
 * GET /api/calories/health
 * Health check endpoint
 */
app.get('/api/calories/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'fitflag-nodejs-calories' });
});

/**
 * GET /health
 * Alternative health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'fitflag-nodejs-calories' });
});

// Start server
app.listen(PORT, () => {
  console.log(`FitFlag Node.js backend listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Calories API: http://localhost:${PORT}/api/calories/daily`);
});
