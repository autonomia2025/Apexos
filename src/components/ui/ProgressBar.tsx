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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(209,213,219,1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        {showValue && (
          <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>
            {current} <span style={{ color: '#6b7280', fontWeight: 400 }}>/ {max}g</span>
          </span>
        )}
      </div>
      
      <div style={{ height: '10px', width: '100%', background: 'rgba(15,23,42,0.9)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)' }}>
        <motion.div
          style={{ height: '100%', borderRadius: '999px', backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span style={{ fontSize: '10px', fontWeight: 500, color: '#6b7280', textAlign: 'right' }}>{Math.round(percentage)}% completado</span>
    </div>
  );
};
