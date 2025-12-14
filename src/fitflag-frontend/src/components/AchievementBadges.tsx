import { motion } from 'framer-motion';
import { FaTrophy, FaFire, FaMedal, FaStar } from 'react-icons/fa';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: FaStar,
    color: 'text-yellow-500',
    unlocked: true,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: '7 day streak',
    icon: FaFire,
    color: 'text-orange-500',
    unlocked: true,
  },
  {
    id: 'step-master',
    title: 'Step Master',
    description: 'Reach 10,000 steps',
    icon: FaTrophy,
    color: 'text-blue-500',
    unlocked: true,
  },
  {
    id: 'fitness-legend',
    title: 'Fitness Legend',
    description: '30 day streak',
    icon: FaMedal,
    color: 'text-purple-500',
    unlocked: false,
  },
];

export default function AchievementBadges() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaTrophy className="text-yellow-500" />
        Achievements
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            className={`relative p-4 rounded-lg text-center ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-indigo-50 to-green-50 dark:from-gray-700 dark:to-gray-600'
                : 'bg-gray-100 dark:bg-gray-800 opacity-50'
            }`}
          >
            <achievement.icon
              className={`text-4xl mx-auto mb-2 ${
                achievement.unlocked ? achievement.color : 'text-gray-400'
              }`}
            />
            <h3 className="font-semibold text-sm">{achievement.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {achievement.description}
            </p>
            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
