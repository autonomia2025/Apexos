import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  current, 
  max, 
  color, 
  showValue = true 
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-end">
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.08em]">
          {label}
        </span>
        {showValue && (
          <span className="text-xs font-bold font-mono text-white">
            {current} <span className="text-gray-500 font-normal">/ {max}g</span>
          </span>
        )}
      </div>
      
      <div className="h-2.5 w-full bg-navy-800/90 rounded-full overflow-hidden border border-white/10 shadow-inner">
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className="text-[10px] font-medium text-gray-500 text-right">{Math.round(percentage)}% completado</span>
    </div>
  );
};
