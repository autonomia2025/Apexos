import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, 
  Apple, 
  Dumbbell, 
  Wallet, 
  BookOpen, 
  Briefcase,
  Target,
  Settings
} from 'lucide-react';
import { UserToggle } from '../ui/UserToggle';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/nutrition', icon: Apple, label: 'Nutrition' },
  { path: '/fitness', icon: Dumbbell, label: 'Fitness' },
  { path: '/finance', icon: Wallet, label: 'Finance' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/goals', icon: Target, label: 'Goals' },
];

/**
 * HIGH-END DESKTOP SEGMENTED NAVIGATION
 */
export const DesktopSideNav: React.FC = () => {
  return (
    <nav className="desktop-nav-segmented flex flex-col items-center">
      
      {/* Brand Icon */}
      <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-10 group cursor-pointer relative">
         <div className="absolute inset-0 bg-gold-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
         <span className="text-xl font-display font-bold text-gold-400 relative z-10 select-none">A</span>
      </div>

      {/* Nav List */}
      <div className="flex flex-col gap-6 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all group
              ${isActive ? 'text-gold-400' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeSideNav"
                    className="absolute inset-0 bg-gold-400/5 border border-gold-400/20 rounded-2xl z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={22} className="relative z-10" />
                <span className="text-[8px] uppercase tracking-widest mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap relative z-10">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <div className="h-px bg-white/5 mx-3 my-2" />

        {/* Tablio Business Link */}
        <NavLink 
          to="/tablio"
          className={({ isActive }) => `
            relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all group
            ${isActive ? 'text-gold-400' : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div 
                  layoutId="activeSideNav"
                  className="absolute inset-0 bg-gold-400/5 border border-gold-400/20 rounded-2xl z-0"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Briefcase size={22} className="relative z-10" />
              <span className="text-[8px] uppercase tracking-widest mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap relative z-10">
                Tablio
              </span>
            </>
          )}
        </NavLink>
      </div>

      <div className="mt-auto items-center flex flex-col gap-4">
        {/* User Toggle Vertical Rotated or Mini version */}
        <div className="rotate-90 origin-center absolute bottom-24 -translate-x-[0px]">
           <UserToggle />
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};
