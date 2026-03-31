import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, active, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={twMerge(
          "glass-panel transition-all duration-300",
          active ? "glass-panel-gold border-gold-400/40" : "hover:border-gold-400/20",
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);
