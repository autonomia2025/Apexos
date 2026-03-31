import React from 'react';
import { motion } from 'framer-motion';

interface AvatarRingProps {
  initials: string;
  color: string;
  progress: number; // 0 to 100
  size?: number;
}

export const AvatarRing: React.FC<AvatarRingProps> = ({ initials, color, progress, size = 64 }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))', width: size, height: size }}>
      {/* Background Circle */}
      <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle animated with framer-motion */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      {/* Avatar Content */}
      <div 
        style={{ 
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          color: '#fff',
          width: size - strokeWidth * 3, 
          height: size - strokeWidth * 3,
          backgroundColor: 'var(--navy-800)',
          fontSize: size * 0.35,
          border: `1px solid ${color}33`,
          boxShadow: `inset 0 0 10px ${color}22`
        }}
      >
        {initials}
      </div>
    </div>
  );
};
