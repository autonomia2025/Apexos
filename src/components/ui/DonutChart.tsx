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
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-display font-bold text-white tracking-tight leading-none">
            {current}
          </span>
          <span className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-[0.14em]">
            / {max}
          </span>
          <span className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-[0.12em]">
            {label}
          </span>
          <span className="mt-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gold-300">
            {Math.round((current / safeMax) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
