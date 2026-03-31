import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'jose' | 'anto';
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

/**
 * PURE CSS GLASS CARD
 * Uses semantic classes defined in index.css.
 */
export const GlassCard = ({
  children, 
  variant = 'default', 
  style, 
  className = '',
  onClick 
}: GlassCardProps) => {
  const variantClass = variant === 'gold' ? 'glass-gold' 
    : variant === 'jose' ? 'glass-jose'
    : variant === 'anto' ? 'glass-anto'
    : 'glass';
    
  return (
    <div
      className={`${variantClass} ${onClick ? 'glass-interactive' : ''} ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
