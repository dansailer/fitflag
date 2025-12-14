import { DailyCalories, CalorieDetails } from '../models/DailyCalories';

export class CaloriesService {
  private random(): number {
    return Math.random();
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Simple algorithm: Basic calorie calculation
   */
  calculateWithSimpleAlgorithm(): DailyCalories {
    console.log('Using SIMPLE algorithm for calorie calculation');
    const activityMinutes = this.randomInt(30, 90);
    const calories = activityMinutes * 5; // Simple: 5 calories per minute
    
    return {
      calories,
      activityMinutes,
      algorithm: 'simple'
    };
  }

  /**
   * Enhanced algorithm: Factors in intensity and activity type
   */
  calculateWithEnhancedAlgorithm(): DailyCalories {
    console.log('Using ENHANCED algorithm for calorie calculation');
    
    const activityMinutes = this.randomInt(30, 90);
    const intensityLevel = this.random() > 0.5 ? 'moderate' : 'high';
    const activityType = this.getRandomActivityType();
    
    // Enhanced calorie calculation based on intensity and activity
    const burnRateMap: { [key: string]: number } = {
      'low': 4,
      'moderate': 6,
      'high': 8
    };
    
    const burnRate = burnRateMap[intensityLevel];
    const activityMultiplier = this.getActivityMultiplier(activityType);
    const calories = Math.round(activityMinutes * burnRate * activityMultiplier);
    
    const details: CalorieDetails = {
      intensityLevel,
      burnRate,
      activityType
    };
    
    return {
      calories,
      activityMinutes,
      algorithm: 'enhanced',
      details
    };
  }

  /**
   * ML-powered algorithm: Simulates ML-based personalization and prediction
   */
  calculateWithMLAlgorithm(): DailyCalories {
    console.log('Using ML-POWERED algorithm for calorie calculation');
    
    const baseMinutes = this.randomInt(40, 100);
    const activityType = this.getRandomActivityType();
    
    // ML model adjusts for patterns and user profile
    const mlAdjustment = 1.0 + (this.random() * 0.3 - 0.15); // ±15% adjustment
    const activityMinutes = Math.round(baseMinutes * mlAdjustment);
    
    // More accurate intensity determination using ML
    const intensityLevel = this.determineIntensityML(activityMinutes);
    
    // Advanced burn rate calculation
    const burnRate = this.calculateMLBurnRate(intensityLevel, activityType);
    const activityMultiplier = this.getActivityMultiplier(activityType);
    const calories = Math.round(activityMinutes * burnRate * activityMultiplier);
    
    const details: CalorieDetails = {
      intensityLevel,
      burnRate,
      activityType
    };
    
    return {
      calories,
      activityMinutes,
      algorithm: 'ml-powered',
      details
    };
  }

  private getRandomActivityType(): string {
    const activities = ['running', 'cycling', 'swimming', 'walking', 'yoga', 'weights'];
    return activities[Math.floor(this.random() * activities.length)];
  }

  private getActivityMultiplier(activityType: string): number {
    const multipliers: { [key: string]: number } = {
      'running': 1.3,
      'cycling': 1.2,
      'swimming': 1.4,
      'walking': 0.8,
      'yoga': 0.7,
      'weights': 1.1
    };
    return multipliers[activityType] || 1.0;
  }

  private determineIntensityML(minutes: number): string {
    // Simulate ML-based intensity classification
    if (minutes < 40) return 'low';
    if (minutes < 60) return 'moderate';
    if (minutes < 80) return 'high';
    return 'very-high';
  }

  private calculateMLBurnRate(intensity: string, activityType: string): number {
    const baseRates: { [key: string]: number } = {
      'low': 4,
      'moderate': 6,
      'high': 8,
      'very-high': 10
    };
    
    // ML adds small adjustments based on activity type
    const baseRate = baseRates[intensity] || 6;
    const adjustment = this.random() * 0.5;
    return baseRate + adjustment;
  }
}
