const QUARKUS_URL = import.meta.env.VITE_QUARKUS_URL || 'http://localhost:8080';
const NODEJS_URL = import.meta.env.VITE_NODEJS_URL || 'http://localhost:8082';

// Fetch daily calories from Node.js backend
export const fetchCalories = async () => {
  try {
    // Get user context from localStorage (set by UserRoleSelector)
    const role = localStorage.getItem('userRole') || 'user';
    const userId = localStorage.getItem('userId') || 'user123';
    
    const response = await fetch(`${NODEJS_URL}/api/calories/daily?userId=${userId}&role=${role}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Log algorithm being used
    if (import.meta.env.DEV) {
      console.log('[Node.js Backend] Calorie algorithm:', data.algorithm);
      if (data.details) {
        console.log('[Node.js Backend] Calorie details:', data.details);
      }
    }
    
    return {
      calories: data.calories,
      activityMinutes: data.activityMinutes,
      algorithm: data.algorithm,
      details: data.details,
    };
  } catch (error) {
    console.error('Error fetching calories from Node.js backend:', error);
    // Fallback to mock data if backend is unavailable
    return {
      calories: Math.floor(Math.random() * 500),
      activityMinutes: Math.floor(Math.random() * 60),
      algorithm: 'offline',
    };
  }
};

// Fetch daily steps from Quarkus backend
export const fetchSteps = async () => {
  try {
    // Get user context from localStorage (set by UserRoleSelector)
    const role = localStorage.getItem('userRole') || 'user';
    const userId = localStorage.getItem('userId') || 'user123';
    
    const response = await fetch(`${QUARKUS_URL}/api/steps/daily?userId=${userId}&role=${role}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Log algorithm being used
    if (import.meta.env.DEV) {
      console.log('[Quarkus Backend] Step algorithm:', data.algorithm);
      if (data.details) {
        console.log('[Quarkus Backend] Step details:', data.details);
      }
    }
    
    return {
      steps: data.steps,
      algorithm: data.algorithm,
      details: data.details,
    };
  } catch (error) {
    console.error('Error fetching steps from Quarkus backend:', error);
    // Fallback to mock data if backend is unavailable
    return {
      steps: Math.floor(Math.random() * 10000),
      algorithm: 'offline',
    };
  }
};

// Fetch combined progress from both backends
export const fetchMockProgress = async () => {
  try {
    const [stepsData, caloriesData] = await Promise.all([
      fetchSteps(),
      fetchCalories(),
    ]);
    
    return {
      steps: stepsData.steps,
      stepsAlgorithm: stepsData.algorithm,
      stepsDetails: stepsData.details,
      calories: caloriesData.calories,
      caloriesAlgorithm: caloriesData.algorithm,
      caloriesDetails: caloriesData.details,
      activityMinutes: caloriesData.activityMinutes,
    };
  } catch (error) {
    console.error('Error fetching progress:', error);
    // Fallback to mock data if backends are unavailable
    return {
      steps: Math.floor(Math.random() * 10000),
      stepsAlgorithm: 'offline',
      calories: Math.floor(Math.random() * 2000),
      caloriesAlgorithm: 'offline',
      activityMinutes: 0,
    };
  }
};

export const toggleThemeFlag = async (enabled: boolean) => ({ enabled }); // POST to Quarkus

export const toggleRecsFlag = async (enabled: boolean) => ({ enabled }); // POST to Go

export const fetchRecs = async () => ["Try Yoga!", "Go for a Run"]; // GET from Go if enabled

export const setGamificationFlag = async (level: string) => ({ level }); // POST to Node

export const fetchGamification = async (level: string) =>
  level === "low" ? ["Bronze"] : ["Gold", "Platinum"]; // GET from Node
