
import { motion } from 'framer-motion';
import UserRoleSelector from './UserRoleSelector';

interface DemoDashboardProps {
  onClose: () => void;
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export default function DemoDashboard({ onClose, currentRole, onRoleChange }: DemoDashboardProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed top-0 right-0 h-full w-80 bg-gray-50 dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Demo Dashboard</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl leading-none">
          ×
        </button>
      </div>
      <div className="space-y-6">
        <UserRoleSelector currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Toggle role to see changes. Frontend will add gamification and recommendations based on role.
        Both Quarkus and Nodejs backends will adjust calorie calculation algorithm based on role as well. 
        Powered by OpenFeature & flagd.
      </p>
    </motion.div>
  );
}