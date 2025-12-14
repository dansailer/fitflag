package com.fitflag.model;

public class DailySteps {
    private int steps;
    private int calories;
    private String algorithm;
    private StepDetails details;

    public DailySteps() {
    }

    public DailySteps(int steps, int calories, String algorithm) {
        this.steps = steps;
        this.calories = calories;
        this.algorithm = algorithm;
    }

    public int getSteps() {
        return steps;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }

    public int getCalories() {
        return calories;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public StepDetails getDetails() {
        return details;
    }

    public void setDetails(StepDetails details) {
        this.details = details;
    }

    public static class StepDetails {
        private double averageStride;
        private double distanceKm;
        private String intensity;

        public StepDetails() {
        }

        public StepDetails(double averageStride, double distanceKm, String intensity) {
            this.averageStride = averageStride;
            this.distanceKm = distanceKm;
            this.intensity = intensity;
        }

        public double getAverageStride() {
            return averageStride;
        }

        public void setAverageStride(double averageStride) {
            this.averageStride = averageStride;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public void setDistanceKm(double distanceKm) {
            this.distanceKm = distanceKm;
        }

        public String getIntensity() {
            return intensity;
        }

        public void setIntensity(String intensity) {
            this.intensity = intensity;
        }
    }
}
