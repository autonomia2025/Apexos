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

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--navy-800)"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-display font-bold text-white tracking-tight">
            {current}
          </span>
          <span className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">
            / {max}
          </span>
          <span className="text-[10px] text-gray-500 mt-2 font-mono uppercase">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
