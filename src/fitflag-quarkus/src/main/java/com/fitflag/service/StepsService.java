package com.fitflag.service;

import com.fitflag.model.DailySteps;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

import java.util.Random;

@ApplicationScoped
public class StepsService {
    private static final Logger LOG = Logger.getLogger(StepsService.class);
    private final Random random = new Random();

    /**
     * Simple algorithm: Basic step counting
     */
    public DailySteps calculateWithSimpleAlgorithm() {
        LOG.debug("Using SIMPLE algorithm for step calculation");
        int baseSteps = 5000 + random.nextInt(5000); // 5000-10000
        int calories = (int) (baseSteps * 0.04); // Simple conversion
        
        DailySteps result = new DailySteps(baseSteps, calories, "simple");
        return result;
    }

    /**
     * Enhanced algorithm: Factors in stride length, intensity, and elevation
     */
    public DailySteps calculateWithEnhancedAlgorithm() {
        LOG.debug("Using ENHANCED algorithm for step calculation");
        
        // Simulate more sophisticated calculation
        int baseSteps = 5000 + random.nextInt(5000);
        double strideLength = 0.7 + (random.nextDouble() * 0.3); // 0.7-1.0 meters
        double distanceKm = (baseSteps * strideLength) / 1000.0;
        
        // Enhanced calorie calculation based on intensity
        String intensity = random.nextBoolean() ? "moderate" : "high";
        double calorieMultiplier = intensity.equals("high") ? 0.06 : 0.045;
        int calories = (int) (baseSteps * calorieMultiplier);
        
        DailySteps result = new DailySteps(baseSteps, calories, "enhanced");
        DailySteps.StepDetails details = new DailySteps.StepDetails(
            strideLength,
            Math.round(distanceKm * 100.0) / 100.0,
            intensity
        );
        result.setDetails(details);
        
        return result;
    }

    /**
     * ML-powered algorithm: Simulates ML-based anomaly detection and prediction
     */
    public DailySteps calculateWithMLAlgorithm() {
        LOG.debug("Using ML-POWERED algorithm for step calculation");
        
        // Simulate ML-enhanced calculations
        int baseSteps = 6000 + random.nextInt(4000); // Slightly different range
        double strideLength = 0.75 + (random.nextDouble() * 0.25);
        double distanceKm = (baseSteps * strideLength) / 1000.0;
        
        // ML model adjusts for patterns and anomalies
        double mlAdjustment = 1.0 + (random.nextDouble() * 0.2 - 0.1); // ±10% adjustment
        int adjustedSteps = (int) (baseSteps * mlAdjustment);
        
        // More accurate calorie estimation
        String intensity = determineIntensityML(adjustedSteps);
        double calorieMultiplier = switch (intensity) {
            case "low" -> 0.035;
            case "moderate" -> 0.045;
            case "high" -> 0.060;
            case "very-high" -> 0.075;
            default -> 0.045;
        };
        int calories = (int) (adjustedSteps * calorieMultiplier);
        
        DailySteps result = new DailySteps(adjustedSteps, calories, "ml-powered");
        DailySteps.StepDetails details = new DailySteps.StepDetails(
            strideLength,
            Math.round(distanceKm * 100.0) / 100.0,
            intensity
        );
        result.setDetails(details);
        
        return result;
    }

    private String determineIntensityML(int steps) {
        // Simulate ML-based intensity classification
        if (steps < 5000) return "low";
        if (steps < 7500) return "moderate";
        if (steps < 10000) return "high";
        return "very-high";
    }
}
