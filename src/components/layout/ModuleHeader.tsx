import React from 'react';
import { motion } from 'framer-motion';

import { UserToggle } from '../ui/UserToggle';

interface ModuleHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: React.ReactNode;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ title, subtitle, badge, icon }) => {
  return (
    <motion.header
      className="module-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="module-header-main">
        {badge && <span className="module-badge">{badge}</span>}
        <div className="module-title-row">
          {icon && (
            <motion.span
              className="module-icon"
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              {icon}
            </motion.span>
          )}
          <h1 className="module-title">{title}</h1>
        </div>
        <p className="module-subtitle">{subtitle}</p>
        <div className="module-divider" />
      </div>
      <div className="module-header-toggle">
        <UserToggle />
      </div>
    </motion.header>
  );
};
