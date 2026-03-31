import React from 'react';
import { motion } from 'framer-motion';

interface DonutChartProps {
  current: number;
  max: number;
  color: string;
  label: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ current, max, color, label }) => {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const safeMax = Math.max(max, 1);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Track */}
        <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress */}
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
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>

        {/* Center Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '36px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1 }}>
            {current}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            / {max}
          </span>
          <span style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {label}
          </span>
          <span style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', fontSize: '10px', fontWeight: 600, color: '#f0c040' }}>
            {Math.round((current / safeMax) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
