import React from 'react';

interface MetricPillProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  icon?: React.ReactNode;
}

export const MetricPill: React.FC<MetricPillProps> = ({ label, value, highlightColor, icon }) => {
  return (
    <div className="bg-navy-800/80 rounded-2xl p-3.5 border border-white/10 flex flex-col justify-center relative overflow-hidden group shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
      {highlightColor && (
        <div 
          className="absolute top-0 left-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: highlightColor }}
        />
      )}
      <div className="flex items-center gap-2 mb-1.5">
        {icon && <span className="opacity-80 text-gold-300">{icon}</span>}
        <span className="text-[11px] text-gray-400 font-semibold tracking-[0.08em] uppercase">{label}</span>
      </div>
      <span className="text-xl font-bold text-white font-display ml-1 leading-none">{value}</span>
    </div>
  );
};
