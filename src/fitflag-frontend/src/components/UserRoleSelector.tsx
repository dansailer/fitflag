import { motion } from 'framer-motion';
import { FaUser, FaStar } from 'react-icons/fa';

interface UserRoleSelectorProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export default function UserRoleSelector({ currentRole, onRoleChange }: UserRoleSelectorProps) {
  const roles = [
    { id: 'user', label: 'Regular User', icon: FaUser, color: 'bg-gray-500' },
    { id: 'beta-tester', label: 'Beta Tester', icon: FaStar, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-3">User Role (Demo)</h3>
      <div className="space-y-2">
        {roles.map((role) => (
          <motion.button
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRoleChange(role.id)}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
              currentRole === role.id
                ? `${role.color} text-white shadow-lg`
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <role.icon className="text-xl" />
            <span className="font-medium">{role.label}</span>
            {currentRole === role.id && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto text-xl"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Switch roles to see feature flag targeting in action
      </p>
    </div>
  );
}
