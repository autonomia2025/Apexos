import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../../hooks/useCouple';

/**
 * HIGH-END USER TOGGLE COMPONENT
 * Minimalist pill design with elegant active animations.
 */
export const UserToggle: React.FC = () => {
  const { activeUserId, setActiveUserId } = useCouple();

  return (
    <div className="premium-pill p-1 gap-1 h-[42px] overflow-hidden min-w-[140px] relative">
      <AnimatePresence mode="popLayout">
        {['jose', 'anto'].map((user) => {
          const isActive = activeUserId === user;
          const color = user === 'jose' ? 'rgba(74, 144, 217, 0.2)' : 'rgba(232, 121, 160, 0.2)';
          const textColor = user === 'jose' ? '#4a90d9' : '#e879a0';
          
          return (
            <button
              key={user}
              onClick={() => setActiveUserId(user as 'jose' | 'anto')}
              className="flex-1 h-full px-4 rounded-full relative z-10 transition-all cursor-pointer group"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-full shadow-inner border border-white/10"
                  style={{ backgroundColor: color }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span 
                className={`relative z-10 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? '' : 'text-gray-500 group-hover:text-gray-300'
                }`}
                style={{ color: isActive ? textColor : undefined }}
              >
                {user}
              </span>
            </button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
