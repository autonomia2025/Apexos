import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  gold?: boolean;
  jose?: boolean;
  anto?: boolean;
  className?: string;
  hoverScale?: boolean;
}

/**
 * HIGH-END GLASS CARD COMPONENT
 * Implements a world-class glassmorphism aesthetic with 
 * subtle noise, inner glows, and dynamic user-specific accents.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  gold = false, 
  jose = false, 
  anto = false,
  className = '', 
  hoverScale = true,
  ...props 
}) => {
  // Sophisticated user-specific glass borders and glows
  let border = 'rgba(255,255,255,0.08)';
  let accentGlow = '';
  
  if (gold) {
    border = 'rgba(240,192,64,0.3)';
    accentGlow = 'radial-gradient(circle at 100% 0%, rgba(240,192,64,0.1), transparent 70%)';
  } else if (jose) {
    border = 'rgba(74,144,217,0.3)';
    accentGlow = 'radial-gradient(circle at 100% 0%, rgba(74,144,217,0.1), transparent 70%)';
  } else if (anto) {
    border = 'rgba(232,121,160,0.3)';
    accentGlow = 'radial-gradient(circle at 100% 0%, rgba(232,121,160,0.1), transparent 70%)';
  }

  return (
    <motion.div
      whileHover={hoverScale ? { scale: 1.01, translateY: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      className={`glass-card-base rounded-3xl ${gold ? 'glass-card-gold' : ''} ${className}`}
      style={{
        borderColor: border,
        ...props.style,
      }}
      {...props}
    >
      {/* High-end grain shadow/accent effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ background: accentGlow }} 
      />
      
      {/* Noise overlay for premium texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
