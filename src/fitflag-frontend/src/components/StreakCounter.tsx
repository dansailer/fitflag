import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg shadow-md text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaFire className="text-yellow-300" />
            Current Streak
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-5xl font-bold"
          >
            {currentStreak}
          </motion.div>
          <div className="text-sm opacity-90 mt-1">days in a row! 🎉</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">Best Streak</div>
          <div className="text-3xl font-bold">{bestStreak}</div>
          <div className="text-xs opacity-75 mt-1">days</div>
        </div>
      </div>
      <div className="mt-4 bg-white/20 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-yellow-300 h-2 rounded-full"
        />
      </div>
      <div className="text-xs opacity-75 mt-2 text-center">
        {30 - currentStreak > 0 ? `${30 - currentStreak} more days to Fitness Legend!` : 'You are a Fitness Legend! 👑'}
      </div>
    </div>
  );
}
