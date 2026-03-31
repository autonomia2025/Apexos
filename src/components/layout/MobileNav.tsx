import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Wallet, MoreHorizontal, BookOpen, Target, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileNav = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Tablio is placed at the end of the main nav items as requested
  const mainNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
    { to: '/fitness', icon: Dumbbell, label: 'Fitness' },
    { to: '/finance', icon: Wallet, label: 'Finance' },
    { to: '/tablio', icon: Briefcase, label: 'Tablio' },
  ];

  const moreItems = [
    { to: '/learn', icon: BookOpen, label: 'Learn', color: 'text-purple-400' },
    { to: '/goals', icon: Target, label: 'Metas', color: 'text-gold-400' },
  ];

  const closeMore = () => setIsMoreOpen(false);

  return (
    <>
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMore}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <nav className="mobile-nav">
        
        <AnimatePresence>
          {isMoreOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-4 mb-2 bg-navy-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel z-50 min-w-[160px]"
            >
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMore}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-4 transition-colors active:bg-white/10 ${
                      isActive ? 'bg-white/5' : 'hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-bold text-sm tracking-wide text-white">{item.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-around items-center h-16 px-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200 active:scale-95 ${
                  isActive ? 'text-gold-400' : 'text-gray-500 hover:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'fill-gold-400/20' : ''}`}
                      stroke={isActive ? 'var(--color-gold-400)' : 'currentColor'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(193,96,58,0.8)]"
                      />
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium font-body mt-1">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <button
             onClick={() => setIsMoreOpen(!isMoreOpen)}
             className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200 active:scale-95 ${
               isMoreOpen ? 'text-white' : 'text-gray-500 hover:text-gray-400'
             }`}
          >
            <div className="relative">
              {isMoreOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              ) : (
                <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium font-body mt-1">
              Más
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
