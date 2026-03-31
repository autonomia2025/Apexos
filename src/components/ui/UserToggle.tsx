import React from 'react';
import { motion } from 'framer-motion';
import { useCouple } from '../../hooks/useCouple';
import { UserId } from '../../types';

export const UserToggle: React.FC = () => {
  const { activeUserId, setActiveUserId, users } = useCouple();

  // If desktop, we don't necessarily need the toggle, or we can hide it.
  // The plan says "Desktop: show BOTH users side by side always".
  // But maybe the toggle is useful for some global context, so let's render it 
  // only on mobile or conditionally. For now, we render it but the parent can hide.

  return (
    <div className="flex bg-navy-800/80 p-1 rounded-full border border-white/5 relative z-10 backdrop-blur-sm">
      {(['jose', 'anto'] as UserId[]).map((userId) => {
        const user = users[userId].user;
        const isActive = activeUserId === userId;
        
        return (
          <button
            key={userId}
            onClick={() => setActiveUserId(userId)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-20 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="user-toggle-pill"
                className="absolute inset-0 rounded-full z-[-1]"
                style={{ backgroundColor: user.color }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {user.name}
          </button>
        );
      })}
    </div>
  );
};
