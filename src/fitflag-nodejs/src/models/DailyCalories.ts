export interface DailyCalories {
  calories: number;
  activityMinutes: number;
  algorithm: string;
  details?: CalorieDetails;
}

export interface CalorieDetails {
  intensityLevel: string;
  burnRate: number;
  activityType: string;
}
