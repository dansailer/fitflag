import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchMockProgress } from '../services/api';
import { getFeatureFlagClient, getCurrentContext } from '../services/featureFlags';
import YogaIcon from '../assets/icons/YogaIcon';
import RunningIcon from '../assets/icons/RunningIcon';
import WeightsIcon from '../assets/icons/WeightsIcon';
import AchievementBadges from './AchievementBadges';
import StreakCounter from './StreakCounter';
import { useState, useEffect } from 'react';

const mockWorkouts = [
  { id: 1, name: 'Yoga', Icon: YogaIcon, description: 'Relax and stretch' },
  { id: 2, name: 'Running', Icon: RunningIcon, description: 'Cardio boost' },
  { id: 3, name: 'Weights', Icon: WeightsIcon, description: 'Build strength' },
];

export default function Dashboard() {
  const [gamificationEnabled, setGamificationEnabled] = useState(false);
  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: fetchMockProgress,
    initialData: { 
      steps: 7500, 
      stepsAlgorithm: 'loading',
      calories: 1200, 
      caloriesAlgorithm: 'loading',
      activityMinutes: 0,
    },
  });

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const client = getFeatureFlagClient();
        const enabled = await client.getBooleanValue('gamification-enabled', false);
        if (import.meta.env.DEV) {
          const context = getCurrentContext();
          console.log('[flagd] Evaluating gamification-enabled with context:', context);
          console.log('[flagd] gamification-enabled:', enabled);
        }
        setGamificationEnabled(enabled);
      } catch (error) {
        console.error('Error checking feature flag:', error);
      }
    };

    checkFeatureFlag();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {gamificationEnabled && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StreakCounter currentStreak={7} bestStreak={14} />
        </motion.div>
      )}
      
      {gamificationEnabled && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AchievementBadges />
        </motion.div>
      )}
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Daily Steps</h2>
            {progress.stepsAlgorithm && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {progress.stepsAlgorithm}
              </span>
            )}
          </div>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-green-600">{progress.steps}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">/ 10,000 steps</div>
            {progress.stepsDetails && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                <div>Distance: {progress.stepsDetails.distanceKm} km</div>
                <div>Stride: {progress.stepsDetails.averageStride}m</div>
                <div>Intensity: {progress.stepsDetails.intensity}</div>
              </div>
            )}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((progress.steps / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Calories Burned</h2>
            {progress.caloriesAlgorithm && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                {progress.caloriesAlgorithm}
              </span>
            )}
          </div>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-indigo-600">{progress.calories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">/ 2,000 calories</div>
            {progress.caloriesDetails && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                <div>Activity: {progress.activityMinutes} min</div>
                <div>Type: {progress.caloriesDetails.activityType}</div>
                <div>Intensity: {progress.caloriesDetails.intensityLevel}</div>
                <div>Burn Rate: {progress.caloriesDetails.burnRate.toFixed(1)} cal/min</div>
              </div>
            )}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((progress.calories / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-green-50 dark:from-gray-700 dark:to-gray-600">
                <div className="w-24 h-24">
                  <workout.Icon />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{workout.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{workout.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}